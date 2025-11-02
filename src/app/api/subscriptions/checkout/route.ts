import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth/server';
import { apiRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/get-client-ip';
import { checkoutRequestSchema, validateData } from '@/lib/validations/subscription';
import { handleCorsPreflightRequest } from '@/lib/cors';
import { validateCors } from '@/lib/cors';
import { createRequestLogger } from '@/lib/logger';
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
  const logger = createRequestLogger(request);

  try {
    logger.info('Checkout session creation started');

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
      logger.security('Unauthenticated checkout attempt');
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

    // SECURITY: Validate and sanitize input data
    const body = await request.json();
    let validatedData;
    try {
      validatedData = validateData(
        checkoutRequestSchema,
        body,
        'Invalid checkout request'
      );
    } catch (error) {
      logger.warn('Checkout validation failed', { userId: user.id });
      throw new ValidationError(
        error instanceof Error ? error.message : 'Invalid checkout request'
      );
    }

    const { priceId } = validatedData;

    const supabase = await createClient();

    // Verify the price exists in our database
    const { data: price, error: priceError } = await supabase
      .from('prices')
      .select('*')
      .eq('stripe_price_id', priceId)
      .single();

    if (priceError || !price) {
      logger.warn('Invalid price ID provided', { userId: user.id, priceId });
      throw new ValidationError('Invalid price ID');
    }

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
      logger.warn('User attempted checkout with existing subscription', { userId: user.id });
      throw new ValidationError(
        'You already have an active subscription. Use the customer portal to manage it.'
      );
    }

    // Create or get Stripe customer
    let customerId: string;

    // Check if user already has a Stripe customer ID
    const { data: existingCustomer } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .not('stripe_customer_id', 'is', null)
      .single();

    if (existingCustomer?.stripe_customer_id) {
      customerId = existingCustomer.stripe_customer_id;
      logger.debug('Using existing Stripe customer', { userId: user.id, customerId });
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;
      logger.info('Created new Stripe customer', { userId: user.id, customerId });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions?canceled=true`,
      metadata: {
        user_id: user.id,
        product_id: price.product_id,
      },
    });

    logger.info('Checkout session created successfully', {
      userId: user.id,
      sessionId: session.id,
    });

    return NextResponse.json(
      {
        url: session.url,
        sessionId: session.id
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