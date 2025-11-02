import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getSubscriptionPeriodStart, getSubscriptionPeriodEnd, getInvoiceSubscriptionId } from '@/types/stripe';
import { webhookMetadataSchema, validateData } from '@/lib/validations/subscription';
import { createRequestLogger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const logger = createRequestLogger(request);

  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    logger.error('Stripe webhook not configured');
    return NextResponse.json(
      { error: 'Stripe is not configured. Webhook processing is disabled.' },
      { status: 503 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  // SECURITY: Validate webhook origin
  // In production, you can optionally restrict to known Stripe IPs
  // For now, we rely on signature verification which is cryptographically secure
  const userAgent = request.headers.get('user-agent') || '';
  if (!userAgent.includes('Stripe')) {
    logger.security('Webhook request with non-Stripe user agent', { userAgent });
    // Note: We still allow it if signature is valid, but log suspicious activity
  }

  let event: Stripe.Event;

  try {
    // SECURITY: Stripe's constructEvent internally validates:
    // 1. Signature authenticity (HMAC-SHA256)
    // 2. Timestamp freshness (rejects events >5 minutes old by default)
    // This prevents both tampering and replay attacks
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const error = err as Error;
    logger.error('Webhook signature verification failed', undefined, error);

    // Check if it's a timestamp error (replay attack attempt)
    if (error.message.includes('timestamp')) {
      logger.security('Possible replay attack detected - timestamp too old');
      return NextResponse.json(
        { error: 'Webhook timestamp too old - possible replay attack' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  logger.info('Webhook signature verified', { eventType: event.type, eventId: event.id });

  // SECURITY: Additional timestamp validation (defense-in-depth)
  // Stripe events include a 'created' timestamp
  const eventAge = Date.now() / 1000 - event.created;
  const MAX_EVENT_AGE = 300; // 5 minutes in seconds

  if (eventAge > MAX_EVENT_AGE) {
    logger.security('Webhook event timestamp too old', { eventAge, maxAge: MAX_EVENT_AGE });
    return NextResponse.json(
      { error: 'Webhook event timestamp too old' },
      { status: 400 }
    );
  }

  // Create Supabase client with service role for webhook operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === 'subscription' && session.subscription) {
          // Get the subscription details
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

          // SECURITY: Validate webhook metadata
          try {
            const metadata = validateData(
              webhookMetadataSchema,
              session.metadata,
              'Invalid webhook metadata'
            );

            const { user_id: userId, product_id: productId } = metadata;
            // Get period dates using helper functions
            const periodStart = getSubscriptionPeriodStart(subscription);
            const periodEnd = getSubscriptionPeriodEnd(subscription);
            
            // Create subscription record
            const { error } = await supabase
              .from('subscriptions')
              .upsert({
                user_id: userId,
                product_id: productId,
                stripe_subscription_id: subscription.id,
                stripe_customer_id: subscription.customer as string,
                status: subscription.status,
                current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : new Date().toISOString(),
                current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : new Date().toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end,
              }, {
                onConflict: 'stripe_subscription_id'
              });

            if (error) {
              logger.error('Error creating subscription record', { eventType: event.type }, error);
            } else {
              logger.info('Subscription record created', { eventType: event.type, userId });
            }
          } catch (validationError) {
            logger.warn('Webhook metadata validation failed', { eventType: event.type }, validationError);
            // Continue processing - don't break webhook handling for validation errors
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update subscription status
        const updateData: Record<string, string | boolean> = {
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        };

        // Get period dates using helper functions
        const periodStart = getSubscriptionPeriodStart(subscription);
        const periodEnd = getSubscriptionPeriodEnd(subscription);
        
        // Only update period dates if they exist
        if (periodStart) {
          updateData.current_period_start = new Date(periodStart * 1000).toISOString();
        }
        if (periodEnd) {
          updateData.current_period_end = new Date(periodEnd * 1000).toISOString();
        }

        // Check if the subscription items changed (plan switching)
        if (subscription.items && subscription.items.data.length > 0) {
          const stripePriceId = subscription.items.data[0].price.id;
          
          // Find the product_id for this price in our database
          const { data: priceData, error: priceError } = await supabase
            .from('prices')
            .select('product_id')
            .eq('stripe_price_id', stripePriceId)
            .single();

          if (!priceError && priceData) {
            updateData.product_id = priceData.product_id;
          } else {
            logger.error('Error finding product for price', { stripePriceId }, priceError);
          }
        }

        const { error } = await supabase
          .from('subscriptions')
          .update(updateData)
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          logger.error('Error updating subscription', { eventType: event.type, subscriptionId: subscription.id }, error);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Mark subscription as canceled
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          logger.error('Error canceling subscription', { eventType: event.type, subscriptionId: subscription.id }, error);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        const subscriptionId = getInvoiceSubscriptionId(invoice);
        if (subscriptionId) {
          // Update subscription status to active on successful payment
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId);

          if (error) {
            logger.error('Error updating subscription on payment success', { eventType: event.type }, error);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        const subscriptionId = getInvoiceSubscriptionId(invoice);
        if (subscriptionId) {
          // Update subscription status to past_due on failed payment
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId);

          if (error) {
            logger.error('Error updating subscription on payment failure', { eventType: event.type }, error);
          }
        }
        break;
      }

      default:
        logger.info('Unhandled event type', { eventType: event.type });
    }

    logger.info('Webhook processed successfully', { eventType: event.type, eventId: event.id });
    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Error processing webhook', { eventType: event?.type }, error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}