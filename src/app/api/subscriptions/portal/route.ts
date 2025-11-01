import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth/server';
import { apiRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/get-client-ip';
import { handleCorsPreflightRequest, validateCors } from '@/lib/cors';

// SECURITY: Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflightRequest(request);
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Validate CORS to prevent unauthorized cross-origin requests
    const { allowed, headers: corsHeaders } = validateCors(request);
    if (!allowed) {
      return NextResponse.json(
        { error: 'CORS policy violation: Origin not allowed' },
        { status: 403 }
      );
    }
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please set up Stripe to use subscriptions.' },
        { status: 503 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Get authenticated user first
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Rate limiting by IP (secure extraction)
    const ip = getClientIp(request);
    const ipResult = await apiRateLimit.check(30, ip); // 30 requests per minute per IP

    if (!ipResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    // Additional rate limiting by user ID for defense-in-depth
    const userResult = await apiRateLimit.check(30, user.id); // 30 requests per minute per user

    if (!userResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
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
      return NextResponse.json(
        { error: 'No active subscription found. Please subscribe to a plan first.' },
        { status: 400 }
      );
    }

    // Create Stripe customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions`,
    });

    return NextResponse.json(
      {
        url: portalSession.url
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}