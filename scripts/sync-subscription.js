/**
 * Manually sync subscription from Stripe to database
 * Run with: node scripts/sync-subscription.js <user_id>
 */

const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  }
}

loadEnvFile();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function syncSubscription(userId) {
  try {
    console.log(`\n🔄 Syncing subscription for user: ${userId}\n`);

    // Get the user's subscription from database
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (subError || !subscription) {
      console.error('❌ No subscription found in database for this user');
      return;
    }

    console.log(`📋 Found subscription: ${subscription.stripe_subscription_id}`);

    // Fetch the latest subscription data from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripe_subscription_id
    );

    console.log(`\n📊 Stripe subscription data:`);
    console.log(`   Status: ${stripeSubscription.status}`);
    console.log(`   Current price: ${stripeSubscription.items.data[0].price.id}`);

    // Get the price ID
    const stripePriceId = stripeSubscription.items.data[0].price.id;

    // Find the product_id for this price in our database
    const { data: priceData, error: priceError } = await supabase
      .from('prices')
      .select('product_id, products(name)')
      .eq('stripe_price_id', stripePriceId)
      .single();

    if (priceError || !priceData) {
      console.error('❌ Could not find product for price:', stripePriceId);
      return;
    }

    console.log(`   Plan: ${priceData.products.name}`);

    // Update the subscription in the database
    const updateData = {
      product_id: priceData.product_id,
      status: stripeSubscription.status,
      cancel_at_period_end: stripeSubscription.cancel_at_period_end,
      current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('user_id', userId);

    if (updateError) {
      console.error('❌ Error updating subscription:', updateError);
      return;
    }

    console.log(`\n✅ Subscription synced successfully!`);
    console.log(`   Updated plan to: ${priceData.products.name}`);
    console.log(`   Refresh your browser to see the changes.`);
  } catch (error) {
    console.error('❌ Error syncing subscription:', error.message);
  }
}

// Get user_id from command line arguments
const userId = process.argv[2];

if (!userId) {
  console.error('❌ Please provide a user_id');
  console.log('\nUsage: node scripts/sync-subscription.js <user_id>');
  process.exit(1);
}

syncSubscription(userId);
