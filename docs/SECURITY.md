# Security Documentation

This document provides comprehensive security guidelines, configuration details, and best practices for the Niche Navigator application.

## Table of Contents

1. [Security Overview](#security-overview)
2. [Cookie Security](#cookie-security)
3. [Environment Variables](#environment-variables)
4. [Production Deployment Checklist](#production-deployment-checklist)
5. [Security Headers](#security-headers)
6. [Authentication Security](#authentication-security)
7. [API Security](#api-security)
8. [Database Security](#database-security)
9. [Client-Side Security](#client-side-security)
10. [Monitoring and Logging](#monitoring-and-logging)
11. [Incident Response](#incident-response)

---

## Security Overview

Niche Navigator implements defense-in-depth security across multiple layers:

- **Application Layer**: Input validation, rate limiting, error handling
- **API Layer**: CORS policies, request size limits, authentication checks
- **Database Layer**: Row Level Security (RLS), parameterized queries
- **Transport Layer**: HTTPS/HSTS enforcement, secure cookies
- **Client Layer**: Content Security Policy, XSS prevention, secure storage

### Security Features Implemented

✅ **Content Security Policy (CSP)** - Prevents XSS attacks
✅ **Rate Limiting** - Prevents brute force and DoS attacks
✅ **Input Validation** - Prevents injection attacks
✅ **HTTPS/HSTS** - Enforces encrypted connections
✅ **CORS Configuration** - Prevents CSRF attacks
✅ **Error Handling** - Prevents information disclosure
✅ **Request Size Limits** - Prevents DoS via large payloads
✅ **Secure Storage** - Prevents credential leakage
✅ **Database RLS** - Prevents unauthorized data access
✅ **OAuth Redirect Validation** - Prevents open redirect attacks
✅ **Webhook Signature Verification** - Prevents webhook spoofing
✅ **Structured Logging** - Enables security monitoring
✅ **Secure Cookie Configuration** - Prevents session hijacking

---

## Cookie Security

### Supabase Authentication Cookies

Supabase Auth uses secure HTTP-only cookies for session management:

```typescript
// Cookie configuration (handled by Supabase SSR)
{
  httpOnly: true,        // Prevents JavaScript access
  secure: true,          // Only sent over HTTPS (production)
  sameSite: 'lax',       // CSRF protection
  maxAge: 604800,        // 7 days (configurable)
  path: '/',             // Available to entire application
}
```

### Cookie Security Best Practices

**✅ DO:**
- Use `httpOnly: true` for authentication cookies
- Set `secure: true` in production (HTTPS only)
- Use `sameSite: 'lax'` or `'strict'` for CSRF protection
- Set appropriate `maxAge` for session duration
- Use short-lived tokens with refresh token rotation

**❌ DON'T:**
- Store sensitive data in cookies without encryption
- Use cookies for client-side data that doesn't need server access
- Set overly long expiration times for session cookies
- Disable `httpOnly` for authentication cookies
- Use `sameSite: 'none'` unless absolutely necessary

### Session Management

```typescript
// Session configuration in Supabase
const supabase = createClient(url, key, {
  auth: {
    persistSession: true,        // Persist sessions across page reloads
    autoRefreshToken: true,      // Automatically refresh expired tokens
    detectSessionInUrl: true,    // Handle OAuth redirects
    flowType: 'pkce',            // Use PKCE for OAuth (more secure)
  },
});
```

### Cookie Debugging

To inspect authentication cookies:

1. Open Chrome DevTools → Application → Cookies
2. Look for cookies with names starting with `sb-`
3. Verify flags: ✅ HttpOnly, ✅ Secure (in production), ✅ SameSite

**Security Warning**: Never log or expose cookie values in client-side code or error messages.

---

## Environment Variables

### Required Environment Variables

#### Development (.env.local)

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...  # Publishable/Anon key
SUPABASE_SECRET_KEY=eyJhbGc...                   # Service role key (SECRET!)

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...                    # SECRET!
STRIPE_WEBHOOK_SECRET=whsec_...                  # SECRET!

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000        # Use HTTPS in production
NODE_ENV=development
```

#### Production Environment Variables

```bash
# Production Supabase (different project recommended)
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
SUPABASE_SECRET_KEY=eyJhbGc...

# Production Stripe (live keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Production Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com       # MUST be HTTPS
NODE_ENV=production
```

### Environment Variable Security Checklist

**Before Deploying to Production:**

- [ ] All secret keys use production values (not test/development keys)
- [ ] `NEXT_PUBLIC_APP_URL` uses HTTPS protocol
- [ ] No secrets are committed to version control (.env.local in .gitignore)
- [ ] Service role keys are never exposed to the client
- [ ] All `NEXT_PUBLIC_*` variables contain only non-sensitive data
- [ ] Stripe webhook secret is updated with production endpoint URL
- [ ] Environment variables are set in deployment platform (Vercel/Netlify)
- [ ] .env.local.example is up to date with all required variables

### Naming Conventions

| Prefix | Purpose | Accessible From | Security Level |
|--------|---------|----------------|----------------|
| `NEXT_PUBLIC_*` | Client-side variables | Browser & Server | ⚠️ Public (non-sensitive only) |
| No prefix | Server-only variables | Server only | 🔒 Private (secrets allowed) |

**Critical**: Never prefix secret keys with `NEXT_PUBLIC_` as they will be exposed to the browser.

### Rotating Secrets

When rotating secrets (recommended every 90 days):

1. Generate new keys in service dashboard (Supabase/Stripe)
2. Update environment variables in deployment platform
3. Deploy application with new variables
4. Verify application works with new keys
5. Revoke old keys in service dashboard
6. Update team documentation

---

## Production Deployment Checklist

### Pre-Deployment Security Review

**Application Configuration:**
- [ ] `NODE_ENV=production` is set
- [ ] `NEXT_PUBLIC_APP_URL` uses HTTPS
- [ ] All secrets use production keys (not test keys)
- [ ] HSTS header is enabled (automatic in production)
- [ ] Content Security Policy is configured
- [ ] CORS origins are restricted to production domains

**Authentication & Authorization:**
- [ ] Supabase RLS policies are enabled on all tables
- [ ] RLS verification script passes: `npm run security:verify-rls`
- [ ] OAuth redirect whitelist includes only production URLs
- [ ] Session duration is appropriate for your use case
- [ ] Password requirements are enforced (8+ chars, mixed case, numbers)

**API Security:**
- [ ] Rate limiting is enabled on all API routes
- [ ] Request size limits are configured (1MB for APIs, 2MB for webhooks)
- [ ] CORS is configured for production origins only
- [ ] All API routes have authentication checks
- [ ] Input validation is applied to all user inputs
- [ ] Error messages don't leak sensitive information

**Payment Integration:**
- [ ] Stripe webhook endpoint is registered in dashboard
- [ ] Webhook signature verification is enabled
- [ ] Webhook timestamp validation is active (5 min max age)
- [ ] Live Stripe keys are used (not test keys)
- [ ] Stripe products and prices are created in live mode
- [ ] Customer portal is configured in Stripe dashboard

**Database Security:**
- [ ] Database is not publicly accessible
- [ ] RLS is enabled on all user data tables
- [ ] Service role key is stored securely (never in client code)
- [ ] Database backups are enabled and tested
- [ ] Connection pooling is configured appropriately

**Client-Side Security:**
- [ ] No sensitive data is stored in localStorage
- [ ] Storage audit passes with no critical issues
- [ ] Console logs don't contain sensitive data
- [ ] Source maps are disabled in production build
- [ ] XSS prevention is applied to user-generated content

**Logging & Monitoring:**
- [ ] Structured logging is enabled
- [ ] Sensitive data is redacted from logs
- [ ] Log aggregation service is configured (optional)
- [ ] Error tracking is enabled (Sentry/similar)
- [ ] Security events are logged (failed logins, rate limits, etc.)

**Infrastructure:**
- [ ] HTTPS certificate is valid and auto-renewing
- [ ] DNS is configured with CAA records (optional)
- [ ] DDoS protection is enabled (Cloudflare/similar)
- [ ] CDN caching is configured appropriately
- [ ] Deployment platform has automatic security updates

### Post-Deployment Verification

**Functional Testing:**
1. Test user registration and login flow
2. Verify OAuth authentication (Google, etc.)
3. Test password reset functionality
4. Create test subscription (with test card in live mode)
5. Verify webhook processing for subscription events
6. Test customer portal access and plan changes

**Security Testing:**
1. Verify HTTPS redirect (http → https)
2. Check security headers with [securityheaders.com](https://securityheaders.com)
3. Test CORS with requests from unauthorized origins
4. Attempt SQL injection on input fields
5. Test XSS prevention with `<script>` tags in inputs
6. Verify rate limiting with rapid requests
7. Check that admin endpoints reject unauthorized access
8. Verify RLS with direct database queries as different users

**Performance Testing:**
1. Run Lighthouse audit (target: 90+ performance score)
2. Test page load times from different geographic locations
3. Verify API response times are under 200ms (p95)
4. Check for N+1 query issues in database operations

### Rollback Plan

If critical security issues are discovered post-deployment:

1. **Immediate**: Disable affected endpoints via deployment platform
2. **Short-term**: Deploy hotfix or rollback to previous version
3. **Investigation**: Review logs to assess impact and affected users
4. **Communication**: Notify affected users if data was compromised
5. **Documentation**: Document incident and prevention measures

---

## Security Headers

All security headers are configured in `next.config.ts`:

### Content Security Policy (CSP)

```javascript
'Content-Security-Policy': [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://accounts.google.com",
  "style-src 'self' 'unsafe-inline' https://accounts.google.com",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://api.stripe.com https://accounts.google.com",
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://accounts.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests"
].join('; ')
```

**Purpose**: Prevents XSS attacks by controlling which resources can load.

### X-Frame-Options

```javascript
'X-Frame-Options': 'DENY'
```

**Purpose**: Prevents clickjacking attacks by disallowing iframe embedding.

### X-Content-Type-Options

```javascript
'X-Content-Type-Options': 'nosniff'
```

**Purpose**: Prevents MIME type sniffing attacks.

### X-XSS-Protection

```javascript
'X-XSS-Protection': '1; mode=block'
```

**Purpose**: Enables browser XSS protection (legacy browsers).

### Referrer-Policy

```javascript
'Referrer-Policy': 'strict-origin-when-cross-origin'
```

**Purpose**: Controls referrer information sent with requests.

### Strict-Transport-Security (HSTS)

```javascript
'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
```

**Purpose**: Forces HTTPS connections for 2 years. **Only enabled in production**.

### Testing Security Headers

Use these tools to verify security headers:

- [securityheaders.com](https://securityheaders.com) - A+ rating target
- [Mozilla Observatory](https://observatory.mozilla.org)
- Chrome DevTools → Network → Headers

---

## Authentication Security

### Supabase Auth Configuration

**Authentication Methods Supported:**
- ✅ Email/Password (with strong password requirements)
- ✅ OAuth (Google, GitHub, etc.)
- ✅ Magic Links (email-based passwordless)

**Security Features:**
- JWT-based authentication with automatic refresh
- HTTP-only cookies prevent token theft
- PKCE flow for OAuth (more secure than implicit flow)
- Rate limiting on login attempts (via our API rate limiter)
- Email verification required (configurable)
- Password reset with time-limited tokens

### Password Requirements

Enforced via Zod schema in `src/lib/validations/auth.ts`:

```typescript
passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
```

**Recommendations:**
- Consider adding special character requirement: `.regex(/[^a-zA-Z0-9]/, '...')`
- Implement password history (prevent reuse of last 5 passwords)
- Add password strength meter in UI
- Consider implementing breach password checking (HaveIBeenPwned API)

### Session Management

**Session Duration**: 7 days (default)
**Refresh Token**: Automatically refreshed when within 60 seconds of expiry
**Token Storage**: HTTP-only cookies (not accessible to JavaScript)

**Security Recommendations:**
- Shorten session duration for high-security applications
- Implement "Remember Me" with longer duration (30 days)
- Force re-authentication for sensitive operations (account changes, payments)
- Implement session invalidation on password change

### Route Protection

Three methods of route protection:

1. **Middleware** (most secure): Blocks requests before page loads
   - Location: `src/middleware.ts`
   - Protected paths: `/dashboard`, `/settings`, `/profile`

2. **Server Components**: Server-side protection with redirects
   - Component: `src/components/auth/ProtectedRoute.tsx`

3. **Client Components**: Client-side protection for interactive pages
   - Component: `src/components/auth/ClientProtectedRoute.tsx`

### OAuth Security

**OAuth Providers Configured:**
- Google OAuth 2.0

**Security Features:**
- PKCE flow for enhanced security
- Redirect URL whitelist prevents open redirect attacks
- State parameter validation (automatic via Supabase)
- Authorization code validation (length and format)

**OAuth Redirect Whitelist** (`src/app/auth/callback/route.ts`):
```typescript
const ALLOWED_REDIRECT_PATHS = [
  '/',
  '/dashboard',
  '/subscriptions',
  '/profile',
  '/settings',
];
```

---

## API Security

### Rate Limiting

**Implementation**: LRU cache-based rate limiter in `src/lib/rate-limit.ts`

**Limits:**
- API routes: 30 requests per minute per IP
- API routes: 30 requests per minute per user ID (authenticated)
- Webhook: Not rate limited (verified via signature instead)

**Configuration:**
```typescript
await apiRateLimit.check(30, ip);      // By IP
await apiRateLimit.check(30, userId);  // By user
```

**Exceeded Limit Response**: 429 Too Many Requests with retry-after information

### Request Size Limits

**Limits:**
- Standard API routes: 1MB
- Webhooks: 2MB (for batch events)
- Server Actions: 2MB
- File uploads: 10MB (if implemented)

**Implementation**: `src/lib/request-size-limit.ts`

```typescript
const sizeCheck = enforceRequestSizeLimit(request, SIZE_LIMITS.API_ROUTE);
if (sizeCheck) return sizeCheck; // Returns 413 if too large
```

### Input Validation

**Validation Library**: Zod
**Validation Schemas**: `src/lib/validations/`

**Validated Inputs:**
- Email addresses (format, length, lowercase)
- Passwords (strength requirements)
- User IDs (UUID format)
- Redirect URLs (open redirect prevention)
- Stripe IDs (format validation)
- Subscription data (metadata validation)

**Example:**
```typescript
import { validateData, checkoutRequestSchema } from '@/lib/validations/subscription';

const validatedData = validateData(
  checkoutRequestSchema,
  body,
  'Invalid checkout request'
);
```

### CORS Configuration

**Allowed Origins** (`src/lib/cors.ts`):
- Development: `http://localhost:3000`, `http://127.0.0.1:3000`
- Production: `process.env.NEXT_PUBLIC_APP_URL`

**CORS Headers:**
```javascript
'Access-Control-Allow-Origin': origin,
'Access-Control-Allow-Credentials': 'true',
'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
'Access-Control-Allow-Headers': 'Content-Type, Authorization',
```

**Preflight Handling**: `OPTIONS` requests return 204 for allowed origins, 403 for denied

### Error Handling

**Implementation**: `src/lib/error-handler.ts`

**Security Features:**
- Generic error messages in production
- Detailed errors in development
- No stack traces exposed to clients
- Sensitive data redacted from error responses

**Error Response Format:**
```json
{
  "error": "Authentication required",
  "code": "AUTHENTICATION_REQUIRED",
  "timestamp": "2025-11-02T12:00:00.000Z",
  "requestId": "req_abc123"
}
```

### Webhook Security

**Stripe Webhook Verification** (`src/app/api/subscriptions/webhook/route.ts`):

1. **Signature Verification**: HMAC-SHA256 validation
2. **Timestamp Validation**: Maximum 5 minutes age
3. **User-Agent Check**: Logs non-Stripe user agents
4. **Request Size Limit**: 2MB maximum

**Webhook Endpoint**: `/api/subscriptions/webhook`

**Configuration in Stripe Dashboard:**
1. Add webhook endpoint URL: `https://yourdomain.com/api/subscriptions/webhook`
2. Select events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
3. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Database Security

### Row Level Security (RLS)

**Documentation**: See [DATABASE_SECURITY.md](./DATABASE_SECURITY.md) for complete RLS guide.

**Verification Script**: `npm run security:verify-rls`

**Required Tables with RLS:**
- `subscriptions` - User-only access
- `products` - Public read, service role write
- `prices` - Public read, service role write

**Example Policy:**
```sql
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);
```

### Service Role Key Usage

**⚠️ WARNING**: The service role key bypasses RLS. Use with extreme caution.

**Appropriate Uses:**
- Webhook handlers (backend-to-backend)
- Admin operations (with additional authentication)
- Migrations and seed scripts

**Never:**
- Expose service role key to client
- Use in client-side code
- Log or display in error messages
- Commit to version control

### Database Connection Security

**Supabase Managed Security:**
- Connection pooling (PgBouncer)
- SSL/TLS encryption for connections
- IP allow lists (configurable)
- Automatic security patches

**Best Practices:**
- Use connection pooling for high-traffic applications
- Enable IP restrictions for production database
- Regularly review and audit database logs
- Implement read replicas for scaling (if needed)

---

## Client-Side Security

### Secure Storage

**Implementation**: `src/lib/storage.ts`

**Security Features:**
- Whitelist-only approach (only approved keys can be stored)
- Forbidden pattern detection (blocks tokens, passwords, PII)
- Storage audit functionality
- Type-safe operations

**Allowed Storage Keys:**
```typescript
ALLOWED_STORAGE_KEYS = {
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  LANGUAGE: 'language',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  LAST_VISITED_PAGE: 'last_visited_page',
  ANALYTICS_CONSENT: 'analytics_consent',
  COOKIE_CONSENT: 'cookie_consent',
}
```

**Usage:**
```typescript
import { secureStorage } from '@/lib/storage';

// Store data
secureStorage.setItem('theme', 'dark');

// Retrieve data
const theme = secureStorage.getItem('theme');

// Audit storage
const issues = secureStorage.auditStorage(); // Returns suspicious keys
```

### XSS Prevention

**Framework Protection**: React automatically escapes content

**Additional Measures:**
- Content Security Policy
- Input sanitization via Zod validation
- `dangerouslySetInnerHTML` is never used
- User-generated content is rendered as text, not HTML

**If you need to render HTML:**
```typescript
import DOMPurify from 'dompurify'; // Install if needed

const cleanHTML = DOMPurify.sanitize(userInput);
```

### CSRF Protection

**Automatic Protection:**
- SameSite cookies (`lax` mode)
- CORS validation on API routes
- Origin checking in middleware

**Additional Recommendations:**
- Implement CSRF tokens for form submissions (if needed)
- Use `POST` for state-changing operations (not `GET`)
- Verify Origin header matches expected domains

---

## Monitoring and Logging

### Structured Logging

**Implementation**: `src/lib/logger.ts`

**Log Levels:**
- `debug`: Development debugging (not shown in production)
- `info`: Normal operations
- `warn`: Recoverable issues
- `error`: Errors requiring attention
- `security`: Security events (failed auth, rate limits, etc.)

**Logged Events:**
- Authentication attempts (success and failure)
- API requests with request ID
- Rate limit violations
- CORS policy violations
- Input validation failures
- Webhook processing
- Database errors
- OAuth callback flow

**Sensitive Data Redaction:**

Automatically redacted fields:
- `password`, `token`, `secret`, `apiKey`
- `creditCard`, `cvv`, `ssn`
- `authorization`, `cookie`, `session`

**Log Format (Production):**
```json
{
  "level": "info",
  "timestamp": "2025-11-02T12:00:00.000Z",
  "message": "User authenticated",
  "context": {
    "requestId": "req_abc123",
    "userId": "uuid",
    "method": "POST",
    "path": "/api/subscriptions/checkout"
  }
}
```

### Security Event Monitoring

**Events to Monitor:**
- Multiple failed login attempts (potential brute force)
- Rate limit violations (potential DoS)
- CORS violations (potential CSRF attempt)
- Suspicious authorization code lengths (OAuth attack)
- Webhook signature failures (spoofing attempt)
- RLS policy violations (unauthorized access attempt)

**Recommended Setup:**
1. Aggregate logs to external service (Datadog, Loggly, Papertrail)
2. Set up alerts for security events
3. Review security logs weekly
4. Implement automated anomaly detection (optional)

### Error Tracking

**Recommended Services:**
- Sentry (JavaScript errors and performance)
- LogRocket (session replay for debugging)
- Rollbar (error tracking and alerting)

**Configuration Example (Sentry):**
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
  beforeSend(event) {
    // Redact sensitive data before sending
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers?.Authorization;
    }
    return event;
  },
});
```

---

## Incident Response

### Security Incident Levels

**Level 1 - Critical**: Data breach, authentication bypass, payment fraud
- Response time: Immediate
- Team: CTO, Security Lead, Legal

**Level 2 - High**: XSS vulnerability, RLS bypass, exposed secrets
- Response time: Within 1 hour
- Team: Engineering Lead, Security Lead

**Level 3 - Medium**: Rate limit bypass, information disclosure
- Response time: Within 4 hours
- Team: Engineering Team

**Level 4 - Low**: Configuration issues, non-exploitable bugs
- Response time: Within 24 hours
- Team: Engineering Team

### Incident Response Playbook

**1. Detection**
- Automated alerts from logging/monitoring
- Security researcher report
- Customer report
- Internal discovery

**2. Containment (< 30 minutes)**
- Disable affected endpoint/feature via deployment
- Rotate compromised credentials
- Block malicious IPs at load balancer
- Document initial findings

**3. Investigation (< 2 hours)**
- Review logs for exploitation attempts
- Identify affected users/data
- Determine attack vector and scope
- Preserve evidence for forensics

**4. Eradication (< 4 hours)**
- Deploy fix or rollback
- Verify vulnerability is patched
- Update security tests to prevent regression
- Document root cause

**5. Recovery (< 8 hours)**
- Restore services to normal operation
- Monitor for additional attacks
- Verify fix doesn't introduce new issues
- Update security configurations

**6. Post-Incident (Within 1 week)**
- Conduct post-mortem meeting
- Document lessons learned
- Update security documentation
- Notify affected users if required (GDPR/CCPA)
- Implement additional preventive measures

### Data Breach Response

If user data is compromised:

1. **Immediate**:
   - Contain the breach (disable affected systems)
   - Assess scope (what data, how many users)
   - Preserve evidence

2. **Within 72 hours**:
   - Notify data protection authorities (GDPR requirement)
   - Notify affected users via email
   - Publish security advisory

3. **Ongoing**:
   - Offer credit monitoring (if financial data exposed)
   - Force password reset for affected accounts
   - Revoke all active sessions
   - Implement additional security measures

### Security Contact

For security issues, contact: **security@yourdomain.com**

**Do NOT** create public GitHub issues for security vulnerabilities.

---

## Security Resources

### Internal Documentation
- [DATABASE_SECURITY.md](./DATABASE_SECURITY.md) - RLS policies and verification
- [example-rls-policies.sql](./example-rls-policies.sql) - SQL policy templates

### External Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/security)
- [Supabase Security Guide](https://supabase.com/docs/guides/platform/going-into-prod)
- [Stripe Security Best Practices](https://stripe.com/docs/security)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### Security Tools
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Dependency vulnerability scanning
- [Snyk](https://snyk.io) - Continuous security monitoring
- [OWASP ZAP](https://www.zaproxy.org) - Web application security scanner
- [securityheaders.com](https://securityheaders.com) - Header analysis
- [ssllabs.com](https://www.ssllabs.com/ssltest/) - SSL/TLS configuration testing

---

## Security Checklist Summary

### Before Every Deployment

- [ ] Run `npm audit` and fix critical/high vulnerabilities
- [ ] Run `npm run security:verify-rls` and fix critical issues
- [ ] Review security headers with securityheaders.com
- [ ] Verify all environment variables are set correctly
- [ ] Test authentication and authorization flows
- [ ] Review recent code changes for security implications
- [ ] Ensure logging doesn't contain sensitive data
- [ ] Verify HTTPS is enforced

### Monthly Security Tasks

- [ ] Review access logs for suspicious activity
- [ ] Audit user permissions and RLS policies
- [ ] Update dependencies to latest secure versions
- [ ] Review and rotate API keys (if needed)
- [ ] Test disaster recovery procedures
- [ ] Review security incident logs
- [ ] Update security documentation

### Quarterly Security Tasks

- [ ] Conduct security training for team
- [ ] Perform penetration testing (internal or external)
- [ ] Review and update incident response playbook
- [ ] Audit third-party integrations
- [ ] Review and update security policies
- [ ] Conduct tabletop security exercise
- [ ] Evaluate new security tools/services

---

**Document Version**: 1.0
**Last Updated**: 2025-11-02
**Maintained By**: Security Team
**Next Review**: 2025-12-02
