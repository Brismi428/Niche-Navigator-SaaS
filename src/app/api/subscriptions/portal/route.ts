import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth/server';
import { apiRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/get-client-ip';
import { handleCorsPreflightRequest, validateCors } from '@/lib/cors';
import { createRequestLogger } from '@/lib/logger';
import { enforceRequestSizeLimit, SIZE_LIMITS } from '@/lib/request-size-limit';
import {
  handleApiError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  ServiceUnavailableError,
  CorsViolationError,
} from '@/lib/error-handler';

// SECURITY: Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflightRequest(request);
}

export async function POST(request: NextRequest) {
  // SECURITY: Enforce request size limit (1MB for API routes)
  const sizeCheck = enforceRequestSizeLimit(request, SIZE_LIMITS.API_ROUTE);
  if (sizeCheck) return sizeCheck;

  const logger = createRequestLogger(request);

  try {
    logger.info('Customer portal session creation started');

    // SECURITY: Validate CORS to prevent unauthorized cross-origin requests
    const { allowed, headers: corsHeaders } = validateCors(request);
    if (!allowed) {
      logger.security('CORS policy violation detected');
      throw new CorsViolationError('Origin not allowed');
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      logger.error('Stripe not configured');
      throw new ServiceUnavailableError(
        'Stripe is not configured. Please set up Stripe to use subscriptions.'
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Get authenticated user first
    const user = await getUser();
    if (!user) {
      logger.security('Unauthenticated portal access attempt');
      throw new AuthenticationError();
    }

    logger.info('User authenticated', { userId: user.id });

    // Rate limiting by IP (secure extraction)
    const ip = getClientIp(request);
    const ipResult = await apiRateLimit.check(30, ip); // 30 requests per minute per IP

    if (!ipResult.success) {
      logger.warn('Rate limit exceeded (IP)', { ip, userId: user.id });
      throw new RateLimitError();
    }

    // Additional rate limiting by user ID for defense-in-depth
    const userResult = await apiRateLimit.check(30, user.id); // 30 requests per minute per user

    if (!userResult.success) {
      logger.warn('Rate limit exceeded (User)', { userId: user.id });
      throw new RateLimitError();
    }

    const supabase = await createClient();

    // Get user's subscription to find their Stripe customer ID
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .not('stripe_customer_id', 'is', null)
      .single();

    if (subscriptionError || !subscription?.stripe_customer_id) {
      logger.warn('User attempted portal access without subscription', { userId: user.id });
      throw new ValidationError(
        'No active subscription found. Please subscribe to a plan first.'
      );
    }

    // Create Stripe customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions`,
    });

    logger.info('Portal session created successfully', {
      userId: user.id,
      portalSessionId: portalSession.id,
    });

    return NextResponse.json(
      {
        url: portalSession.url
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    return handleApiError(error, {
      requestId: logger['defaultContext']?.requestId as string,
      userId: undefined, // User might not be authenticated
      method: request.method,
      path: new URL(request.url).pathname,
    });
  }
}