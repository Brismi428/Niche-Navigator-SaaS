/**
 * Database RLS (Row Level Security) Verification Script
 *
 * SECURITY: Verifies that all database tables have proper RLS policies enabled
 * - Checks if RLS is enabled on all tables
 * - Validates that required policies exist
 * - Reports missing or misconfigured security policies
 * - Helps prevent unauthorized database access
 *
 * Usage:
 *   npx tsx scripts/verify-rls.ts
 *
 * Requirements:
 *   - SUPABASE_SECRET_KEY must be set in .env.local
 *   - User must have admin access to query system tables
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

interface TableInfo {
  schemaname: string;
  tablename: string;
  rowsecurity: boolean;
}

interface PolicyInfo {
  schemaname: string;
  tablename: string;
  policyname: string;
  permissive: string;
  roles: string[];
  cmd: string;
  qual: string;
  with_check: string;
}

interface RLSStatus {
  table: string;
  schema: string;
  rlsEnabled: boolean;
  policies: PolicyInfo[];
  issues: string[];
}

// Tables that should have RLS enabled
const REQUIRED_TABLES = [
  'subscriptions',
  'products',
  'prices',
  // Add more tables as needed
];

// Schemas to check (public is the default)
const SCHEMAS_TO_CHECK = ['public'];

class RLSVerifier {
  private supabase;
  private results: RLSStatus[] = [];

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY'
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  /**
   * Get all tables from specified schemas
   */
  async getTables(): Promise<TableInfo[]> {
    try {
      const { data, error } = await this.supabase.rpc('get_tables_rls_status', {
        schemas: SCHEMAS_TO_CHECK,
      });

      if (error) {
        // Fallback to direct query if RPC doesn't exist
        console.warn('RPC function not found, using direct query...');
        return this.getTablesDirectQuery();
      }

      return data || [];
    } catch (error) {
      console.warn('Error calling RPC, using direct query...', error);
      return this.getTablesDirectQuery();
    }
  }

  /**
   * Direct SQL query to get tables (fallback)
   */
  async getTablesDirectQuery(): Promise<TableInfo[]> {
    const { data, error } = await this.supabase
      .from('pg_tables')
      .select('schemaname, tablename')
      .in('schemaname', SCHEMAS_TO_CHECK);

    if (error) {
      console.error('Error fetching tables:', error);
      return [];
    }

    // Check RLS status for each table
    const tables: TableInfo[] = [];
    for (const table of data || []) {
      const rlsStatus = await this.checkRLSStatus(table.schemaname, table.tablename);
      tables.push({
        schemaname: table.schemaname,
        tablename: table.tablename,
        rowsecurity: rlsStatus,
      });
    }

    return tables;
  }

  /**
   * Check if RLS is enabled for a specific table
   */
  async checkRLSStatus(schema: string, table: string): Promise<boolean> {
    try {
      // Query pg_class to check RLS status
      const { data, error } = await this.supabase.rpc('check_table_rls', {
        schema_name: schema,
        table_name: table,
      });

      if (error) {
        console.warn(`Could not check RLS for ${schema}.${table}`);
        return false;
      }

      return data || false;
    } catch {
      return false;
    }
  }

  /**
   * Get RLS policies for a table
   */
  async getPolicies(schema: string, table: string): Promise<PolicyInfo[]> {
    try {
      const { data, error } = await this.supabase.rpc('get_table_policies', {
        schema_name: schema,
        table_name: table,
      });

      if (error) {
        console.warn(`Could not fetch policies for ${schema}.${table}`);
        return [];
      }

      return data || [];
    } catch {
      return [];
    }
  }

  /**
   * Analyze RLS configuration for a table
   */
  analyzeTable(table: TableInfo, policies: PolicyInfo[]): RLSStatus {
    const issues: string[] = [];
    const fullTableName = `${table.schemaname}.${table.tablename}`;

    // Check if RLS is enabled
    if (!table.rowsecurity) {
      issues.push('RLS is not enabled');
    }

    // Check if table should have RLS
    if (REQUIRED_TABLES.includes(table.tablename)) {
      if (!table.rowsecurity) {
        issues.push(`CRITICAL: RLS must be enabled for ${table.tablename}`);
      }

      if (policies.length === 0) {
        issues.push('CRITICAL: No RLS policies defined');
      }
    }

    // Check for common policy issues
    if (table.rowsecurity && policies.length === 0) {
      issues.push('WARNING: RLS enabled but no policies defined (all access blocked)');
    }

    // Check for overly permissive policies
    const publicPolicies = policies.filter((p) => p.roles.includes('public'));
    if (publicPolicies.length > 0) {
      issues.push(
        `WARNING: ${publicPolicies.length} policy/policies allow public access`
      );
    }

    return {
      table: table.tablename,
      schema: table.schemaname,
      rlsEnabled: table.rowsecurity,
      policies,
      issues,
    };
  }

  /**
   * Run verification on all tables
   */
  async verify(): Promise<void> {
    console.log('🔍 Starting RLS Verification...\n');
    console.log(`Checking schemas: ${SCHEMAS_TO_CHECK.join(', ')}\n`);

    // Get all tables
    const tables = await this.getTables();

    if (tables.length === 0) {
      console.error('❌ No tables found or unable to query database');
      console.error('   Make sure SUPABASE_SECRET_KEY has proper permissions');
      process.exit(1);
    }

    console.log(`Found ${tables.length} tables\n`);

    // Analyze each table
    for (const table of tables) {
      const policies = await this.getPolicies(table.schemaname, table.tablename);
      const status = this.analyzeTable(table, policies);
      this.results.push(status);
    }

    // Display results
    this.displayResults();
  }

  /**
   * Display verification results
   */
  displayResults(): void {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                    RLS VERIFICATION REPORT                    ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let criticalIssues = 0;
    let warnings = 0;
    let tablesWithRLS = 0;

    // Display detailed results for each table
    for (const result of this.results) {
      const fullName = `${result.schema}.${result.table}`;
      const status = result.rlsEnabled ? '✅' : '❌';

      console.log(`${status} ${fullName}`);
      console.log(`   RLS Enabled: ${result.rlsEnabled ? 'Yes' : 'No'}`);
      console.log(`   Policies: ${result.policies.length}`);

      if (result.rlsEnabled) {
        tablesWithRLS++;
      }

      if (result.policies.length > 0) {
        console.log('   Policy Details:');
        for (const policy of result.policies) {
          console.log(`      - ${policy.policyname} (${policy.cmd})`);
          console.log(`        Roles: ${policy.roles.join(', ')}`);
        }
      }

      if (result.issues.length > 0) {
        console.log('   Issues:');
        for (const issue of result.issues) {
          if (issue.includes('CRITICAL')) {
            console.log(`      🔴 ${issue}`);
            criticalIssues++;
          } else if (issue.includes('WARNING')) {
            console.log(`      ⚠️  ${issue}`);
            warnings++;
          } else {
            console.log(`      ℹ️  ${issue}`);
          }
        }
      }

      console.log('');
    }

    // Summary
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                           SUMMARY                             ');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`Total Tables: ${this.results.length}`);
    console.log(`Tables with RLS: ${tablesWithRLS}`);
    console.log(`Critical Issues: ${criticalIssues}`);
    console.log(`Warnings: ${warnings}`);

    // Required tables check
    console.log('\nRequired Tables Status:');
    for (const requiredTable of REQUIRED_TABLES) {
      const result = this.results.find((r) => r.table === requiredTable);
      if (!result) {
        console.log(`   ⚠️  ${requiredTable}: Table not found`);
      } else if (!result.rlsEnabled) {
        console.log(`   🔴 ${requiredTable}: RLS not enabled`);
      } else if (result.policies.length === 0) {
        console.log(`   🔴 ${requiredTable}: No policies defined`);
      } else {
        console.log(`   ✅ ${requiredTable}: Properly configured`);
      }
    }

    console.log('\n═══════════════════════════════════════════════════════════════\n');

    // Exit with error if critical issues found
    if (criticalIssues > 0) {
      console.error('❌ VERIFICATION FAILED: Critical security issues found');
      console.error('   Please fix RLS configuration before deploying to production\n');
      process.exit(1);
    } else if (warnings > 0) {
      console.warn('⚠️  VERIFICATION PASSED WITH WARNINGS');
      console.warn('   Review warnings and consider fixing before production\n');
      process.exit(0);
    } else {
      console.log('✅ VERIFICATION PASSED: All checks successful\n');
      process.exit(0);
    }
  }
}

// Run verification
async function main() {
  try {
    const verifier = new RLSVerifier();
    await verifier.verify();
  } catch (error) {
    console.error('❌ Error during verification:', error);
    process.exit(1);
  }
}

main();
