import { NextRequest, NextResponse } from 'next/server';

/**
 * CORS Configuration for API routes
 *
 * SECURITY: This implements strict CORS policies to prevent unauthorized cross-origin requests
 * - Only allows requests from explicitly whitelisted origins
 * - Prevents CSRF attacks by validating request origin
 * - Supports both development and production environments
 *
 * For production, update ALLOWED_ORIGINS with your actual domain(s)
 */

// SECURITY: Explicitly define allowed origins
// IMPORTANT: Update this list with your production domain(s)
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  // Add your production domain(s) here:
  // 'https://yourdomain.com',
  // 'https://www.yourdomain.com',
].filter(Boolean);

/**
 * Validate if the request origin is allowed
 *
 * @param origin - The Origin header from the request
 * @returns boolean - true if origin is allowed, false otherwise
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) {
    // Same-origin requests don't include Origin header
    // Allow these requests (they're from the same domain)
    return true;
  }

  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Get CORS headers for allowed origins
 *
 * @param origin - The Origin header from the request
 * @returns Record<string, string> - CORS headers to include in response
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
  // Only set CORS headers if origin is allowed
  if (!origin || !isOriginAllowed(origin)) {
    return {};
  }

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

/**
 * Handle CORS preflight (OPTIONS) requests
 *
 * @param request - Next.js request object
 * @returns NextResponse with CORS headers or 403 Forbidden
 */
export function handleCorsPreflightRequest(request: NextRequest): NextResponse {
  const origin = request.headers.get('origin');

  // SECURITY: Reject requests from unauthorized origins
  if (origin && !isOriginAllowed(origin)) {
    return new NextResponse(null, {
      status: 403,
      statusText: 'Forbidden',
    });
  }

  // Return preflight response with CORS headers
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

/**
 * Validate CORS for non-preflight requests
 *
 * @param request - Next.js request object
 * @returns { allowed: boolean, headers: Record<string, string> }
 */
export function validateCors(request: NextRequest): {
  allowed: boolean;
  headers: Record<string, string>;
} {
  const origin = request.headers.get('origin');

  // If there's no origin header, it's a same-origin request (allowed)
  if (!origin) {
    return { allowed: true, headers: {} };
  }

  // Check if origin is allowed
  const allowed = isOriginAllowed(origin);

  return {
    allowed,
    headers: allowed ? getCorsHeaders(origin) : {},
  };
}

/**
 * Middleware helper to add CORS headers to API responses
 *
 * Usage in API routes:
 * ```typescript
 * import { withCors } from '@/lib/cors';
 *
 * export async function GET(request: NextRequest) {
 *   return withCors(request, async () => {
 *     // Your API logic here
 *     return NextResponse.json({ data: 'example' });
 *   });
 * }
 * ```
 *
 * @param request - Next.js request object
 * @param handler - Async function that returns a NextResponse
 * @returns NextResponse with CORS headers added
 */
export async function withCors(
  request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  // Handle OPTIONS preflight requests
  if (request.method === 'OPTIONS') {
    return handleCorsPreflightRequest(request);
  }

  // Validate CORS for non-preflight requests
  const { allowed, headers: corsHeaders } = validateCors(request);

  // SECURITY: Reject requests from unauthorized origins
  if (!allowed) {
    return new NextResponse(
      JSON.stringify({ error: 'CORS policy violation: Origin not allowed' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Execute the handler
  const response = await handler();

  // Add CORS headers to response
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
