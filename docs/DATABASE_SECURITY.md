# Database Security Documentation

This document outlines the security policies and Row Level Security (RLS) configuration for the Niche Navigator database.

## Table of Contents

1. [Overview](#overview)
2. [Row Level Security (RLS)](#row-level-security-rls)
3. [Required Tables and Policies](#required-tables-and-policies)
4. [Verification Process](#verification-process)
5. [Common Security Patterns](#common-security-patterns)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

## Overview

**Row Level Security (RLS)** is a PostgreSQL feature that allows you to control which rows users can access in a table. This is a critical security feature that ensures users can only access data they're authorized to see.

### Why RLS Matters

- **Prevents unauthorized access**: Even if an attacker obtains API credentials, RLS limits what data they can access
- **Defense in depth**: Works alongside application-level security checks
- **Automatic enforcement**: Applied at the database level, cannot be bypassed by application code
- **Per-user control**: Different policies for different users and roles

## Row Level Security (RLS)

### What is RLS?

RLS allows you to create policies that restrict which rows a user can SELECT, INSERT, UPDATE, or DELETE based on conditions you define. Policies are automatically applied to all queries.

### Enabling RLS

To enable RLS on a table:

```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Creating Policies

Policies define who can access which rows and what operations they can perform:

```sql
CREATE POLICY policy_name ON table_name
  FOR SELECT  -- or INSERT, UPDATE, DELETE, ALL
  USING (condition);  -- When can a row be selected?
```

For INSERT/UPDATE operations, you can also specify a `WITH CHECK` clause:

```sql
CREATE POLICY policy_name ON table_name
  FOR INSERT
  WITH CHECK (condition);  -- What values can be inserted?
```

## Required Tables and Policies

### 1. Subscriptions Table

**Purpose**: Stores user subscription data including Stripe customer IDs and subscription status.

**Security Requirements**:
- ✅ RLS must be enabled
- ✅ Users can only access their own subscriptions
- ✅ No public access allowed

**Required Policies**:

```sql
-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own subscriptions (created via webhook)
CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
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
```

### 2. Products Table

**Purpose**: Stores Stripe product definitions and pricing tiers.

**Security Requirements**:
- ✅ RLS must be enabled
- ✅ All authenticated users can read products
- ✅ Only service role can modify products

**Required Policies**:

```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view products
CREATE POLICY "Authenticated users can view products"
  ON products
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Public users can view products (for pricing page)
CREATE POLICY "Public users can view products"
  ON products
  FOR SELECT
  USING (true);

-- Only service role can modify products
CREATE POLICY "Service role can manage products"
  ON products
  FOR ALL
  USING (auth.role() = 'service_role');
```

### 3. Prices Table

**Purpose**: Stores Stripe price points for products.

**Security Requirements**:
- ✅ RLS must be enabled
- ✅ All users can read prices (for checkout)
- ✅ Only service role can modify prices

**Required Policies**:

```sql
-- Enable RLS
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;

-- All users can view prices
CREATE POLICY "Public users can view prices"
  ON prices
  FOR SELECT
  USING (true);

-- Only service role can modify prices
CREATE POLICY "Service role can manage prices"
  ON prices
  FOR ALL
  USING (auth.role() = 'service_role');
```

## Verification Process

### Automated Verification Script

We provide a TypeScript script to verify RLS configuration:

```bash
# Install dependencies (if not already installed)
npm install tsx dotenv @supabase/supabase-js --save-dev

# Run the verification script
npx tsx scripts/verify-rls.ts
```

### What the Script Checks

1. **RLS Enabled**: Verifies RLS is enabled on all required tables
2. **Policy Existence**: Ensures required policies are defined
3. **Policy Permissions**: Checks for overly permissive policies
4. **Missing Tables**: Identifies required tables that don't exist
5. **Public Access**: Warns about policies that allow public access

### Script Output

The script generates a detailed report showing:

```
═══════════════════════════════════════════════════════════════
                    RLS VERIFICATION REPORT
═══════════════════════════════════════════════════════════════

✅ public.subscriptions
   RLS Enabled: Yes
   Policies: 4
   Policy Details:
      - Users can view own subscriptions (SELECT)
        Roles: authenticated
      - Service role can manage all subscriptions (ALL)
        Roles: service_role

❌ public.users
   RLS Enabled: No
   Policies: 0
   Issues:
      🔴 CRITICAL: RLS must be enabled for users
      🔴 CRITICAL: No RLS policies defined

═══════════════════════════════════════════════════════════════
                           SUMMARY
═══════════════════════════════════════════════════════════════

Total Tables: 3
Tables with RLS: 2
Critical Issues: 2
Warnings: 0

❌ VERIFICATION FAILED: Critical security issues found
```

### Manual Verification

You can manually check RLS status in Supabase:

1. Go to Supabase Dashboard
2. Navigate to **Database** → **Tables**
3. Select a table
4. Click **Policies** tab
5. Verify policies are enabled and configured correctly

## Common Security Patterns

### Pattern 1: User-Owned Resources

For resources that belong to a specific user (subscriptions, profiles, etc.):

```sql
CREATE POLICY "Users can access own resources"
  ON table_name
  FOR ALL
  USING (auth.uid() = user_id);
```

### Pattern 2: Public Read, Restricted Write

For resources that everyone can read but only specific users can modify:

```sql
-- Public read
CREATE POLICY "Anyone can view"
  ON table_name
  FOR SELECT
  USING (true);

-- Restricted write
CREATE POLICY "Only owner can modify"
  ON table_name
  FOR UPDATE
  USING (auth.uid() = owner_id);
```

### Pattern 3: Role-Based Access

For resources that require specific roles:

```sql
CREATE POLICY "Admins can manage all"
  ON table_name
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

### Pattern 4: Service Role Access

For operations that should only be performed by backend services:

```sql
CREATE POLICY "Service role only"
  ON table_name
  FOR ALL
  USING (auth.role() = 'service_role');
```

## Troubleshooting

### Issue: "RLS is not enabled"

**Solution**: Enable RLS on the table:

```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Issue: "No RLS policies defined"

**Problem**: RLS is enabled but no policies exist, blocking all access.

**Solution**: Add appropriate policies based on your security requirements.

### Issue: "Policy allows public access"

**Warning**: A policy allows unauthenticated access.

**Action**: Review if this is intentional. For public data (like products), this is fine. For user data, this is a security risk.

### Issue: "Unable to query database"

**Problem**: The verification script cannot access the database.

**Solution**: Ensure `SUPABASE_SECRET_KEY` is set in `.env.local` and has admin privileges.

### Issue: Users Can't Access Their Own Data

**Problem**: Users are getting permission denied errors even for their own data.

**Debugging Steps**:

1. Check if RLS is enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'your_table';`
2. List policies: `SELECT * FROM pg_policies WHERE tablename = 'your_table';`
3. Test policy conditions: Ensure `auth.uid()` returns the expected user ID
4. Check if the user is authenticated: `SELECT auth.role();`

## Best Practices

### 1. Always Enable RLS on User Data Tables

Any table containing user-specific data should have RLS enabled:

```sql
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
```

### 2. Use Principle of Least Privilege

Grant only the minimum permissions needed:

```sql
-- ❌ Bad: Overly permissive
CREATE POLICY "Everyone can do anything"
  ON table_name FOR ALL
  USING (true);

-- ✅ Good: Specific permissions
CREATE POLICY "Users can view own data"
  ON table_name FOR SELECT
  USING (auth.uid() = user_id);
```

### 3. Separate Policies by Operation

Create different policies for SELECT, INSERT, UPDATE, DELETE:

```sql
-- Read policy
CREATE POLICY "read_policy" ON table_name
  FOR SELECT USING (condition1);

-- Write policy
CREATE POLICY "write_policy" ON table_name
  FOR UPDATE USING (condition2);
```

### 4. Test Policies Thoroughly

Test policies with different user roles and authentication states:

```sql
-- Test as authenticated user
SET request.jwt.claim.sub = 'user_id_here';
SELECT * FROM table_name;

-- Test as anonymous user
RESET request.jwt.claim.sub;
SELECT * FROM table_name;
```

### 5. Use Service Role for Backend Operations

For operations performed by your backend (like webhook handlers), use the service role key:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY! // Service role key
);

// This bypasses RLS - use carefully!
```

### 6. Document Your Policies

Add comments to explain policy logic:

```sql
CREATE POLICY "users_read_own_subscriptions"
  ON subscriptions
  FOR SELECT
  USING (
    -- Users can only see their own subscriptions
    auth.uid() = user_id
  );
```

### 7. Regular Security Audits

Run the verification script regularly:

```bash
# Add to CI/CD pipeline
npx tsx scripts/verify-rls.ts

# Or add as npm script in package.json
"scripts": {
  "security:verify-rls": "tsx scripts/verify-rls.ts"
}
```

### 8. Monitor for Unauthorized Access Attempts

Set up logging to detect failed policy checks:

```sql
-- Enable query logging in Supabase Dashboard
-- Monitor for permission denied errors
```

## Security Checklist

Before deploying to production, verify:

- [ ] RLS is enabled on all user data tables
- [ ] Each table has appropriate policies for SELECT, INSERT, UPDATE, DELETE
- [ ] No policies grant overly broad access (e.g., `USING (true)` on sensitive data)
- [ ] Service role key is kept secret and never exposed to clients
- [ ] `verify-rls.ts` script passes with no critical issues
- [ ] Policies are tested with different user roles
- [ ] Documentation is up to date with current policies
- [ ] Team members understand RLS concepts and policies

## Additional Resources

- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
- [Common RLS Patterns](https://supabase.com/docs/guides/auth/row-level-security#common-rls-patterns)

## Support

If you encounter issues with RLS configuration:

1. Check this documentation for common patterns
2. Run the verification script for detailed diagnostics
3. Review Supabase logs in the Dashboard
4. Consult the PostgreSQL and Supabase documentation
5. Ask for help in team channels with specific error messages

---

**Last Updated**: 2025-11-02
**Maintained By**: Security Team
