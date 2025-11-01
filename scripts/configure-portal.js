/**
 * Configure Stripe Customer Portal to allow plan switching
 * Run with: node scripts/configure-portal.js
 */

const Stripe = require('stripe');
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

async function configurePortal() {
  try {
    console.log('Configuring Stripe Customer Portal...\n');

    // Product and Price IDs from our Stripe account
    const plans = {
      free: {
        product: 'prod_TLNDIMbGHlHG9k',
        price: 'price_1SOgW5CcyvNaU3BZ5okhoKDq',
      },
      pro: {
        product: 'prod_TLNDrYkt6mPYti',
        price: 'price_1SOgWACcyvNaU3BZCzpmvN0q',
      },
      enterprise: {
        product: 'prod_TLNDSitTk8C5ZG',
        price: 'price_1SOgWFCcyvNaU3BZQkztKGbd',
      },
    };

    // First, get the default portal configuration
    const configurations = await stripe.billingPortal.configurations.list({
      limit: 1,
    });

    if (configurations.data.length === 0) {
      console.error('❌ No portal configuration found. Please create one in the Dashboard first.');
      process.exit(1);
    }

    const configId = configurations.data[0].id;
    console.log(`📋 Found portal configuration: ${configId}\n`);

    // Update the configuration to allow plan switching
    const updatedConfig = await stripe.billingPortal.configurations.update(
      configId,
      {
        features: {
          subscription_update: {
            enabled: true,
            default_allowed_updates: ['price', 'promotion_code'],
            proration_behavior: 'create_prorations',
            products: [
              { product: plans.free.product, prices: [plans.free.price] },
              { product: plans.pro.product, prices: [plans.pro.price] },
              { product: plans.enterprise.product, prices: [plans.enterprise.price] },
            ],
          },
        },
      }
    );

    console.log('✅ Portal configuration updated successfully!\n');
    console.log('Configuration details:');
    console.log(`- Configuration ID: ${updatedConfig.id}`);
    console.log(`- Plan switching: ${updatedConfig.features.subscription_update.enabled ? 'Enabled ✓' : 'Disabled'}`);
    console.log(`- Proration: ${updatedConfig.features.subscription_update.proration_behavior}`);

    const productsCount = updatedConfig.features.subscription_update.products?.length || 3;
    console.log(`- Products available for switching: ${productsCount}`);
    console.log('  - Free ($0/month) - prod_TLNDIMbGHlHG9k');
    console.log('  - Pro ($29/month) - prod_TLNDrYkt6mPYti');
    console.log('  - Enterprise ($99/month) - prod_TLNDSitTk8C5ZG');
    console.log('\n🎉 Customers can now switch between all three plans in the portal!');
  } catch (error) {
    console.error('❌ Error configuring portal:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('\n⚠️  Make sure STRIPE_SECRET_KEY is set in your .env.local file');
    }
    process.exit(1);
  }
}

configurePortal();
