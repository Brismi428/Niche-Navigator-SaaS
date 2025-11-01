import { z } from 'zod';

/**
 * Subscription-related validation schemas using Zod
 *
 * SECURITY: These schemas prevent:
 * - Type coercion exploits
 * - Malformed data injection
 * - Invalid Stripe IDs
 * - Missing required fields
 */

// Stripe ID patterns for validation
const STRIPE_PRICE_ID_PATTERN = /^price_[a-zA-Z0-9]{24,}$/;
const STRIPE_CUSTOMER_ID_PATTERN = /^cus_[a-zA-Z0-9]{14,}$/;
const STRIPE_SUBSCRIPTION_ID_PATTERN = /^sub_[a-zA-Z0-9]{14,}$/;

/**
 * Checkout session creation request validation
 */
export const checkoutRequestSchema = z.object({
  priceId: z
    .string()
    .min(1, 'Price ID is required')
    .regex(STRIPE_PRICE_ID_PATTERN, 'Invalid Stripe price ID format')
    .describe('Stripe price ID for the subscription plan'),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

/**
 * Customer portal session creation validation
 * No body required, but we validate the structure
 */
export const portalRequestSchema = z.object({}).optional();

export type PortalRequest = z.infer<typeof portalRequestSchema>;

/**
 * Webhook event metadata validation
 */
export const webhookMetadataSchema = z.object({
  user_id: z
    .string()
    .uuid('Invalid user ID format')
    .describe('Supabase user UUID'),
  product_id: z
    .string()
    .min(1, 'Product ID is required')
    .describe('Internal product identifier'),
});

export type WebhookMetadata = z.infer<typeof webhookMetadataSchema>;

/**
 * Stripe customer ID validation
 */
export const stripeCustomerIdSchema = z
  .string()
  .regex(STRIPE_CUSTOMER_ID_PATTERN, 'Invalid Stripe customer ID format');

/**
 * Stripe subscription ID validation
 */
export const stripeSubscriptionIdSchema = z
  .string()
  .regex(STRIPE_SUBSCRIPTION_ID_PATTERN, 'Invalid Stripe subscription ID format');

/**
 * Subscription status validation (matches Stripe's subscription statuses)
 */
export const subscriptionStatusSchema = z.enum([
  'active',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'trialing',
  'unpaid',
  'paused',
]);

export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

/**
 * Helper function to safely parse and validate data
 * Returns parsed data or throws with user-friendly error message
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage = 'Validation failed'
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    throw new Error(`${errorMessage}: ${errors}`);
  }

  return result.data;
}
