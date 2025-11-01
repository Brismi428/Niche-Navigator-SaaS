# Production Email Deployment Checklist

Complete pre-launch checklist for Mailgun SMTP integration in production environment.

---

## Pre-Deployment (1-2 days before launch)

### 1. Mailgun Account Preparation

#### Domain Verification
- [ ] Production domain fully verified in Mailgun
- [ ] All DNS records configured and verified:
  - [ ] **SPF record** - Authorizes Mailgun to send
  - [ ] **DKIM record** - Email authentication signature
  - [ ] **MX records** - For receiving bounces (if applicable)
  - [ ] **CNAME records** - For tracking (optional)
- [ ] Domain shows **"Verified"** status with green checkmark
- [ ] DNS propagation complete (wait 24-48 hours after adding records)
- [ ] Test DNS records with: [MXToolbox.com](https://mxtoolbox.com/)

#### Sender Configuration
- [ ] Production sender email configured:
  - Recommended: `noreply@nichenavigator.com`
  - Alternative: `hello@nichenavigator.com` (if accepting replies)
- [ ] Sender name finalized: `Niche Navigator`
- [ ] Reply-to address configured (if different from sender)
- [ ] From address matches verified domain

#### SMTP Credentials
- [ ] Production SMTP credentials generated
- [ ] SMTP username format: `postmaster@your-domain.mailgun.org`
- [ ] SMTP password: Strong and secure
- [ ] Credentials saved in secure password manager
- [ ] Credentials NOT committed to git repository

#### Account Settings
- [ ] Billing information up to date
- [ ] Appropriate sending plan selected:
  - Free tier: 5,000 emails/month (limited features)
  - Paid tier: Based on expected volume
- [ ] Payment method valid and verified
- [ ] Sending limits appropriate for launch volume
- [ ] Overage alerts configured

### 2. Email Template Finalization

#### Reset Password Template
- [ ] Custom HTML template created with branding
- [ ] Mobile-responsive design tested
- [ ] All variables working: `{{ .ConfirmationURL }}`
- [ ] Subject line finalized: "Reset your Niche Navigator password"
- [ ] Plain-text version included (accessibility)
- [ ] Footer includes:
  - [ ] Company name and address (if required by law)
  - [ ] Link to support/help
  - [ ] Link to website
- [ ] Template tested on:
  - [ ] Desktop email clients (Outlook, Apple Mail, Thunderbird)
  - [ ] Web email clients (Gmail, Outlook.com, Yahoo)
  - [ ] Mobile email clients (iOS Mail, Gmail app, Outlook app)
- [ ] No broken images or missing assets
- [ ] All links point to production domain

#### Other Templates (if applicable)
- [ ] **Confirm Signup** template customized
- [ ] **Magic Link** template customized (if using passwordless)
- [ ] **Change Email** template customized
- [ ] **Welcome Email** template created (optional)
- [ ] All templates use consistent branding
- [ ] All templates tested and verified

### 3. Supabase Production Configuration

#### Project Setup
- [ ] Production Supabase project created (separate from dev/staging)
- [ ] Database migrated to production
- [ ] Environment variables configured
- [ ] API keys secured

#### SMTP Configuration
- [ ] Navigate to: Authentication → Settings → SMTP Settings
- [ ] **Enable Custom SMTP:** Toggle ON
- [ ] **Sender email:** `noreply@nichenavigator.com`
- [ ] **Sender name:** `Niche Navigator`
- [ ] **Host:** `smtp.mailgun.org`
- [ ] **Port:** `587` (STARTTLS)
- [ ] **Username:** Production Mailgun SMTP username
- [ ] **Password:** Production Mailgun SMTP password
- [ ] **Secure connection (TLS):** Enabled
- [ ] Configuration saved successfully
- [ ] No error messages displayed

#### Authentication Settings
- [ ] **Site URL:** `https://nichenavigator.com`
- [ ] **Redirect URLs:** All production domains allowed:
  ```
  https://nichenavigator.com/**
  https://www.nichenavigator.com/**
  https://*.vercel.app/** (if using Vercel)
  ```
- [ ] **JWT expiry:** Appropriate for your security requirements
- [ ] **Refresh token rotation:** Enabled (recommended)
- [ ] **Email confirmation:** Enabled (if required)
- [ ] **Password requirements:** Configured (min 8 characters recommended)

#### Email Templates
- [ ] All templates uploaded to production Supabase
- [ ] Templates match staging/development environment
- [ ] Variables correctly configured
- [ ] Preview function tested for each template

### 4. Application Configuration

#### Environment Variables
Verify production environment variables:
```bash
# Production .env or Vercel environment variables
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<production-publishable-key>
SUPABASE_SECRET_KEY=<production-secret-key>
NEXT_PUBLIC_APP_URL=https://nichenavigator.com
```

- [ ] All Supabase keys point to production project
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] No development URLs in production config
- [ ] Secrets stored securely (Vercel secrets, AWS Secrets Manager, etc.)

#### Code Verification
- [ ] Email redirect URLs use `NEXT_PUBLIC_APP_URL` environment variable
- [ ] No hardcoded localhost URLs in code
- [ ] Auth callback route tested (`/auth/callback`)
- [ ] Password reset pages deployed (`/forgot-password`, `/reset-password`)
- [ ] All auth navigation links working

### 5. Security Review

#### Email Security
- [ ] SMTP password strong (20+ characters, complex)
- [ ] Credentials not exposed in client-side code
- [ ] HTTPS enforced on all pages (especially auth pages)
- [ ] Password reset tokens expire (default: 1 hour)
- [ ] Rate limiting implemented (prevent abuse):
  - [ ] Max password reset requests per hour per IP
  - [ ] Max password reset requests per email per day
- [ ] No sensitive data in email content
- [ ] Email links use HTTPS only

#### Authentication Security
- [ ] Password requirements enforced (min 8 chars, complexity)
- [ ] JWT tokens use secure httpOnly cookies
- [ ] CSRF protection enabled
- [ ] Session timeout appropriate
- [ ] Brute force protection enabled
- [ ] OAuth redirect URIs whitelisted

### 6. Monitoring & Alerts Setup

#### Mailgun Alerts
Navigate to: Mailgun → Settings → Webhooks/Alerts

- [ ] **Delivery failures** alert configured
  - Send to: your-email@nichenavigator.com
  - Threshold: > 5 failures/hour
- [ ] **Bounce rate** alert configured
  - Threshold: > 5%
- [ ] **Spam complaints** alert configured
  - Threshold: > 1 complaint
- [ ] **Usage limit** alert configured
  - Threshold: 80% of monthly limit
- [ ] Test alerts by triggering sample events

#### Application Monitoring
- [ ] Error logging configured (Sentry, LogRocket, etc.)
- [ ] Auth error tracking enabled
- [ ] Email sending errors logged
- [ ] Failed password reset attempts tracked
- [ ] Dashboard to monitor auth metrics

#### Supabase Monitoring
- [ ] Supabase project alerts configured
- [ ] Database performance monitoring enabled
- [ ] API usage tracking enabled
- [ ] Billing alerts set up

---

## Deployment Day

### 1. Pre-Launch Testing (2-3 hours before)

#### Smoke Tests
- [ ] Deploy to production environment
- [ ] Verify app accessible at production URL
- [ ] Test login with existing account
- [ ] Test signup with new account
- [ ] **Test password reset flow:**
  1. [ ] Go to production login page
  2. [ ] Click "Forgot password?"
  3. [ ] Enter test email
  4. [ ] Receive email within 30 seconds
  5. [ ] Email from: `Niche Navigator <noreply@nichenavigator.com>`
  6. [ ] Click reset link
  7. [ ] Redirect to production reset page
  8. [ ] Reset password successfully
  9. [ ] Auto-login to dashboard
  10. [ ] Login with new password works

#### Cross-Browser Testing
Test on multiple browsers:
- [ ] **Chrome** (latest version)
- [ ] **Firefox** (latest version)
- [ ] **Safari** (latest version)
- [ ] **Edge** (latest version)
- [ ] **Mobile Chrome** (iOS/Android)
- [ ] **Mobile Safari** (iOS)

#### Email Provider Testing
Send test password reset emails to:
- [ ] **Gmail** - Verify lands in inbox (not promotions/spam)
- [ ] **Outlook.com** - Verify lands in inbox
- [ ] **Yahoo** - Verify lands in inbox
- [ ] **Custom domain** - If applicable
- [ ] Check spam score at [Mail-Tester.com](https://www.mail-tester.com) - Target: 8+/10

#### Performance Testing
- [ ] Email delivery time: < 30 seconds average
- [ ] Page load time acceptable (< 3 seconds)
- [ ] Auth flows complete successfully under load
- [ ] No timeout errors

#### Mailgun Production Check
- [ ] Log into Mailgun dashboard
- [ ] Navigate to: Sending → Logs
- [ ] Verify test emails show **"Delivered"** status
- [ ] Delivery time: < 5 seconds
- [ ] No failed deliveries
- [ ] No bounces or spam complaints

### 2. Final Verification

#### DNS & SSL
- [ ] Production domain resolves correctly
- [ ] SSL certificate valid and not expired
- [ ] HTTPS enforced (no mixed content warnings)
- [ ] All API calls use HTTPS

#### Email Links
- [ ] Password reset links point to production domain
- [ ] Signup confirmation links point to production (if applicable)
- [ ] All links use HTTPS
- [ ] No localhost or staging URLs in emails

#### User Experience
- [ ] Email templates display correctly (no broken layout)
- [ ] Branding consistent with website
- [ ] Mobile-responsive design works
- [ ] Links easy to click on mobile
- [ ] Email copy clear and professional

#### Error Handling
- [ ] Invalid token shows helpful error message
- [ ] Expired token shows helpful error message
- [ ] Network errors handled gracefully
- [ ] User-friendly error messages (no technical jargon)

---

## Post-Launch (First 24 Hours)

### Hour 1-2: Active Monitoring
- [ ] Monitor Mailgun logs for all outgoing emails
- [ ] Check delivery rates (should be > 95%)
- [ ] Watch for bounce or spam complaint alerts
- [ ] Monitor application error logs
- [ ] Check Supabase analytics dashboard

### Hour 3-6: User Testing
- [ ] Invite beta users to test auth flows
- [ ] Collect feedback on email content
- [ ] Monitor support channels for email issues
- [ ] Track password reset success rate
- [ ] Verify emails arriving across different providers

### Hour 7-24: Stability Check
- [ ] Review all auth-related error logs
- [ ] Check Mailgun delivery statistics:
  - Delivery rate
  - Bounce rate
  - Spam complaint rate
  - Average delivery time
- [ ] Monitor user signup/login rates
- [ ] Check for any failed password resets
- [ ] Review support tickets related to email

### Daily Monitoring (First Week)
- [ ] **Day 1:** Active monitoring every 2-3 hours
- [ ] **Day 2:** Check morning, afternoon, evening
- [ ] **Day 3-7:** Daily check of metrics
- [ ] Review weekly summary of:
  - Total emails sent
  - Delivery rate
  - Bounce rate
  - Spam complaints
  - User feedback

---

## Success Metrics (Week 1)

### Email Deliverability
- [ ] **Delivery rate:** > 98%
- [ ] **Bounce rate:** < 2%
- [ ] **Spam complaint rate:** < 0.1%
- [ ] **Average delivery time:** < 30 seconds

### User Experience
- [ ] **Password reset success rate:** > 95%
- [ ] **Email-related support tickets:** < 5% of total
- [ ] **User satisfaction:** Positive feedback
- [ ] **No critical email failures**

### System Health
- [ ] **Uptime:** 99.9%+
- [ ] **No SMTP connection errors**
- [ ] **No rate limiting issues**
- [ ] **API performance within acceptable range**

---

## Rollback Plan

If critical issues occur:

### Scenario 1: Emails Not Delivering
**Symptoms:** No emails being sent, SMTP errors

**Immediate Actions:**
1. [ ] Check Mailgun dashboard for account status
2. [ ] Verify SMTP credentials in Supabase
3. [ ] Check Mailgun server status page
4. [ ] Temporarily switch back to Supabase default email (if critical)

**Rollback Steps:**
1. [ ] Supabase → Authentication → Settings
2. [ ] Toggle **Custom SMTP** to OFF
3. [ ] Save changes
4. [ ] Test password reset with Supabase default email
5. [ ] Investigate Mailgun issue offline
6. [ ] Re-enable when resolved

### Scenario 2: Emails Going to Spam
**Symptoms:** High spam complaint rate, low deliverability

**Immediate Actions:**
1. [ ] Check spam score at mail-tester.com
2. [ ] Verify DNS records (SPF, DKIM)
3. [ ] Review email content for spam triggers
4. [ ] Check if domain blacklisted: [MXToolbox Blacklist Check](https://mxtoolbox.com/blacklists.aspx)

**Mitigation:**
- Add notice on website: "Check spam folder for password reset email"
- Provide alternative: "Contact support if email not received"
- Investigate and fix root cause

### Scenario 3: High Bounce Rate
**Symptoms:** Many bounced emails, failed deliveries

**Immediate Actions:**
1. [ ] Check Mailgun logs for bounce reasons
2. [ ] Verify sender domain is correct
3. [ ] Check for typos in email addresses
4. [ ] Review bounce types (hard vs soft bounces)

**Long-term Fix:**
- Implement email validation on signup
- Remove invalid emails from database
- Add email verification step

---

## Long-Term Maintenance

### Weekly Tasks
- [ ] Review Mailgun delivery statistics
- [ ] Check bounce and spam complaint rates
- [ ] Monitor email sending volume
- [ ] Review user feedback on emails

### Monthly Tasks
- [ ] Audit email templates for improvements
- [ ] Review and update email copy
- [ ] Check DNS records still valid
- [ ] Review Mailgun plan usage (upgrade if needed)
- [ ] Rotate SMTP credentials (security best practice)

### Quarterly Tasks
- [ ] Comprehensive deliverability audit
- [ ] Review and optimize email templates
- [ ] Update branding if needed
- [ ] Security review of auth flows
- [ ] Compliance review (GDPR, CAN-SPAM, etc.)

### Annual Tasks
- [ ] Full email infrastructure review
- [ ] Consider alternative providers if needed
- [ ] Update legal footer in emails (address changes, etc.)
- [ ] Review and update privacy policy
- [ ] Audit all email-related code

---

## Emergency Contacts

### Mailgun Support
- **Email:** support@mailgun.com
- **Dashboard:** [https://app.mailgun.com](https://app.mailgun.com)
- **Status Page:** [status.mailgun.com](https://status.mailgun.com)
- **Documentation:** [documentation.mailgun.com](https://documentation.mailgun.com)

### Supabase Support
- **Dashboard:** [https://supabase.com/dashboard](https://supabase.com/dashboard)
- **Status Page:** [status.supabase.com](https://status.supabase.com)
- **Discord:** [discord.supabase.com](https://discord.supabase.com)
- **Docs:** [supabase.com/docs](https://supabase.com/docs)

### Internal Team
- **Tech Lead:** [Your contact]
- **DevOps:** [Your contact]
- **Support Team:** [Your contact]

---

## Compliance & Legal

### Email Regulations
- [ ] **CAN-SPAM Act** (US):
  - [ ] Physical address in footer (if sending marketing emails)
  - [ ] Clear unsubscribe mechanism (if applicable)
  - [ ] Accurate subject lines
- [ ] **GDPR** (EU):
  - [ ] User consent for emails
  - [ ] Privacy policy updated
  - [ ] Data processing agreement with Mailgun
- [ ] **CASL** (Canada):
  - [ ] Implied/explicit consent for emails
  - [ ] Unsubscribe mechanism

### Documentation
- [ ] Privacy policy mentions email usage
- [ ] Terms of service updated
- [ ] Data processing addendum with Mailgun (if required)
- [ ] Email retention policy documented

---

## Final Sign-Off

### Stakeholder Approval
- [ ] **Tech Lead:** Approved _____________ (Date)
- [ ] **Product Manager:** Approved _____________ (Date)
- [ ] **Security Team:** Approved _____________ (Date)
- [ ] **Legal/Compliance:** Approved _____________ (Date)

### Documentation Complete
- [ ] Mailgun setup guide reviewed
- [ ] Testing procedures documented
- [ ] Troubleshooting guide accessible
- [ ] Monitoring dashboards configured
- [ ] Team trained on email system
- [ ] Runbook created for on-call team

### Go/No-Go Decision
- [ ] All critical items checked
- [ ] No blocking issues identified
- [ ] Rollback plan documented and understood
- [ ] Team ready for launch

**Final Decision:** GO / NO-GO

**Signed:** _________________ **Date:** _________________

---

**Last Updated:** 2025-10-31
**Version:** 1.0.0
**Next Review:** [Date after 1 week of production use]
