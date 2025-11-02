import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createRequestLogger } from '@/lib/logger';
import {
  handleApiError,
  AuthenticationError,
  ValidationError,
} from '@/lib/error-handler';
import { redirectUrlSchema, validateAuthData } from '@/lib/validations/auth';

/**
 * OAuth Callback Handler
 *
 * SECURITY: This endpoint handles OAuth redirects from providers (Google, etc.)
 * - Validates authorization codes
 * - Prevents open redirect attacks with whitelist
 * - Logs all authentication attempts
 * - Implements secure session creation
 */

/**
 * Whitelist of allowed redirect paths after OAuth success
 * SECURITY: Prevents open redirect vulnerabilities
 */
const ALLOWED_REDIRECT_PATHS = [
  '/',
  '/dashboard',
  '/subscriptions',
  '/profile',
  '/settings',
] as const;

/**
 * Default redirect path after successful authentication
 */
const DEFAULT_SUCCESS_REDIRECT = '/dashboard';

/**
 * Default redirect path on authentication failure
 */
const DEFAULT_ERROR_REDIRECT = '/login';

/**
 * Validate and sanitize redirect URL
 * @param url - The redirect URL to validate
 * @param origin - The application origin
 * @returns Validated redirect URL or default
 */
function validateRedirectUrl(url: string | null, origin: string): string {
  // If no redirect provided, use default
  if (!url) {
    return `${origin}${DEFAULT_SUCCESS_REDIRECT}`;
  }

  try {
    // Validate using Zod schema
    validateAuthData(redirectUrlSchema, url, 'Invalid redirect URL');

    // Extract path from URL
    let path: string;
    if (url.startsWith('/')) {
      // Relative path
      path = url;
    } else {
      // Absolute URL - extract path
      const parsedUrl = new URL(url);
      path = parsedUrl.pathname;
    }

    // Check if path is in whitelist
    const isAllowed = ALLOWED_REDIRECT_PATHS.some((allowedPath) => {
      // Allow exact match or paths that start with allowed path + /
      return path === allowedPath || path.startsWith(`${allowedPath}/`);
    });

    if (!isAllowed) {
      // Path not in whitelist, use default
      return `${origin}${DEFAULT_SUCCESS_REDIRECT}`;
    }

    // Return validated full URL
    return url.startsWith('/') ? `${origin}${url}` : url;
  } catch {
    // Validation failed, use default
    return `${origin}${DEFAULT_SUCCESS_REDIRECT}`;
  }
}

export async function GET(request: NextRequest) {
  const logger = createRequestLogger(request);

  try {
    logger.info('OAuth callback started');

    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const errorDescription = requestUrl.searchParams.get('error_description');
    const redirectTo = requestUrl.searchParams.get('redirect_to');
    const origin = requestUrl.origin;

    // Check for OAuth provider errors
    if (error) {
      logger.warn('OAuth provider returned error', {
        error,
        errorDescription,
      });

      return NextResponse.redirect(
        `${origin}${DEFAULT_ERROR_REDIRECT}?error=oauth_error&message=${encodeURIComponent(errorDescription || error)}`
      );
    }

    // Validate authorization code exists
    if (!code) {
      logger.warn('OAuth callback missing authorization code');
      return NextResponse.redirect(
        `${origin}${DEFAULT_ERROR_REDIRECT}?error=missing_code`
      );
    }

    // Validate authorization code format (basic check)
    if (code.length < 10 || code.length > 500) {
      logger.security('OAuth callback with suspicious code length', {
        codeLength: code.length,
      });
      throw new ValidationError('Invalid authorization code format');
    }

    logger.debug('Authorization code received', {
      codeLength: code.length,
      hasRedirect: !!redirectTo,
    });

    // Create Supabase client with cookie handling
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Exchange authorization code for session
    logger.debug('Exchanging code for session');

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      logger.error('Error exchanging code for session', {
        error: exchangeError.message,
        status: exchangeError.status,
      });

      return NextResponse.redirect(
        `${origin}${DEFAULT_ERROR_REDIRECT}?error=auth_callback_error`
      );
    }

    // Verify session was created
    if (!data?.session) {
      logger.error('No session created after code exchange');
      throw new AuthenticationError('Failed to create session');
    }

    // Log successful authentication
    logger.info('OAuth authentication successful', {
      userId: data.user?.id,
      provider: data.user?.app_metadata?.provider,
      email: data.user?.email,
    });

    // SECURITY: Validate and sanitize redirect URL
    const validatedRedirect = validateRedirectUrl(redirectTo, origin);

    logger.debug('Redirecting after successful OAuth', {
      requestedRedirect: redirectTo,
      validatedRedirect,
    });

    return NextResponse.redirect(validatedRedirect);
  } catch (error) {
    return handleApiError(error, {
      requestId: logger['defaultContext']?.requestId as string,
      userId: undefined,
      method: request.method,
      path: new URL(request.url).pathname,
    });
  }
}
