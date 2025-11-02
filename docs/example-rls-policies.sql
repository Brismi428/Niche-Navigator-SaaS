-- ============================================================================
-- Example RLS Policies for Niche Navigator
-- ============================================================================
-- This file contains example Row Level Security policies for common tables
-- in the Niche Navigator application. Apply these policies in your Supabase
-- SQL Editor or via migrations.
--
-- IMPORTANT: Review and customize these policies based on your specific
-- security requirements before applying them to production.
-- ============================================================================

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================
-- Users should only be able to access their own subscription data
-- Service role (webhooks) can manage all subscriptions

-- Enable RLS on subscriptions table
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running this script)
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON subscriptions;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own subscriptions
-- (Usually done via webhook, but allow for manual creation)
CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
-- (Usually done via webhook, but allow for cancellations)
CREATE POLICY "Users can update own subscriptions"
  ON subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role can manage all subscriptions (for webhooks)
CREATE POLICY "Service role can manage all subscriptions"
  ON subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================
-- Products should be publicly readable for the pricing page
-- Only service role can modify products

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public users can view products" ON products;
DROP POLICY IF EXISTS "Service role can manage products" ON products;

-- All users (including anonymous) can view products
CREATE POLICY "Public users can view products"
  ON products
  FOR SELECT
  USING (true);

-- Only service role can manage products
CREATE POLICY "Service role can manage products"
  ON products
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- PRICES TABLE
-- ============================================================================
-- Prices should be publicly readable for checkout
-- Only service role can modify prices

-- Enable RLS on prices table
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public users can view prices" ON prices;
DROP POLICY IF EXISTS "Service role can manage prices" ON prices;

-- All users (including anonymous) can view prices
CREATE POLICY "Public users can view prices"
  ON prices
  FOR SELECT
  USING (true);

-- Only service role can manage prices
CREATE POLICY "Service role can manage prices"
  ON prices
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- ADDITIONAL TABLES (Add as needed)
-- ============================================================================

-- Example: User Profiles Table
-- Uncomment and customize if you have a profiles table

/*
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
*/

-- Example: Admin-only Table
-- Uncomment and customize if you have admin-only tables

/*
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admins can access" ON admin_settings;

CREATE POLICY "Only admins can access"
  ON admin_settings
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
*/

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify RLS is properly configured

-- Check which tables have RLS enabled
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- List all policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check specific table policies
SELECT
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'subscriptions';

-- ============================================================================
-- TESTING RLS POLICIES
-- ============================================================================
-- Test policies with different user contexts

-- Test as authenticated user (replace with actual user ID)
/*
SET request.jwt.claim.sub = 'user-uuid-here';
SELECT * FROM subscriptions;
RESET request.jwt.claim.sub;
*/

-- Test as anonymous user
/*
RESET request.jwt.claim.sub;
SELECT * FROM products;  -- Should work (public read)
SELECT * FROM subscriptions;  -- Should return no rows
*/

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. Always test policies in a development environment first
-- 2. Verify policies work as expected before deploying to production
-- 3. Use the verify-rls.ts script to check for common issues
-- 4. Keep this file updated as your schema evolves
-- 5. Document any custom policies and their reasoning
-- 6. Review policies during security audits
-- ============================================================================
