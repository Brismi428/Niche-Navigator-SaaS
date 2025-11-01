# Revisit TODOs - Niche Navigator

Tasks to revisit and improve before production launch.

---

## 📧 Email Deliverability Improvements

### Current Status
- ✅ **Emails working** from `noreply@nichenavigator.ai`
- ✅ **Mailgun SMTP** configured and verified
- ✅ **Password reset** flow working end-to-end
- 🟡 **Going to spam** (normal for new domains - will improve over time)

### Forgot Password Flow (Currently Implemented)

**How it works:**
1. User goes to `/login` page
2. Clicks "Forgot password?" link (top-right of login form)
3. Redirects to `/forgot-password` page
4. User enters their email address
5. Clicks "Send Reset Link"
6. Supabase sends email via Mailgun SMTP from `noreply@nichenavigator.ai`
7. User receives email with "Reset Password" link
8. Clicks link → Redirects to `/reset-password?code=xxxxx`
9. User enters new password (twice)
10. Clicks "Reset Password"
11. Password updated, auto-redirects to `/dashboard`
12. User is logged in automatically

**Current implementation:**
- ✅ Login page has "Forgot password?" link
- ✅ Forgot password page (`/forgot-password`)
- ✅ Reset password page (`/reset-password`)
- ✅ Email template (Supabase default)
- ✅ Token validation (checks URL params)
- ✅ Success states with visual feedback
- ✅ Error handling for invalid/expired tokens
- ✅ Auto-login after successful reset

**Components:**
- `src/components/auth/ForgotPasswordForm.tsx` - Email input form
- `src/components/auth/ResetPasswordForm.tsx` - New password form with validation
- `src/app/forgot-password/page.tsx` - Forgot password page
- `src/app/reset-password/page.tsx` - Reset password page
- `src/contexts/AuthContext.tsx` - `resetPassword()` and `updatePassword()` methods

### Action Items (Before Production)

#### 1. Add DMARC Record (5 minutes)
**Why:** Improves email authentication and deliverability

**Steps:**
1. Go to: Namecheap.com → Domain List → Manage → Advanced DNS
2. Add new record:
   ```
   Type: TXT Record
   Host: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:hello@nichenavigator.ai
   TTL: Automatic
   ```
3. Save changes
4. Wait 30 minutes for DNS propagation
5. Verify at: [MXToolbox DMARC Check](https://mxtoolbox.com/dmarc.aspx)

**Expected improvement:** Better inbox placement, fewer spam flags

---

#### 2. Test Email Deliverability Across Providers (30 minutes)

**Current testing:**
- ✅ Gmail - Delivered (in spam folder)

**Test these providers:**
- [ ] **Outlook/Hotmail** (outlook.com email)
  - Check: Inbox vs Junk folder
  - Note delivery time
- [ ] **Yahoo Mail** (yahoo.com email)
  - Check: Inbox vs Spam folder
  - Note delivery time
- [ ] **ProtonMail** (if you have access)
  - Check deliverability
- [ ] **Custom domain email** (if applicable)

**How to test:**
1. Send password reset to each email provider
2. Check inbox vs spam placement
3. Note sender reputation warnings
4. Document results

---

#### 3. Check Spam Score (10 minutes)

**Use Mail-Tester.com:**
1. Go to: [https://www.mail-tester.com](https://www.mail-tester.com)
2. Copy the test email address shown
3. In your app: Request password reset to that email
4. Go back to Mail-Tester: Click "Then check your score"
5. Review results

**Target score:** 8/10 or higher

**Common issues to fix:**
- Missing DMARC record (see #1 above)
- SPF alignment issues
- Missing unsubscribe link (not required for transactional emails)
- Email content triggers (avoid words like "FREE", "URGENT")

---

#### 4. Build Sender Reputation (Ongoing)

**Short-term (Before Launch):**
- [ ] Send test emails regularly (daily for a week)
- [ ] Have beta testers mark emails as "Not Spam"
- [ ] Ensure consistent sending (avoid long gaps)

**Long-term (After Launch):**
- [ ] Monitor bounce rates (keep < 5%)
- [ ] Monitor spam complaint rates (keep < 0.1%)
- [ ] Remove invalid email addresses promptly
- [ ] Send emails consistently (regular volume)

**Check Mailgun stats:**
- Go to: [Mailgun Dashboard](https://app.mailgun.com/app/dashboard)
- Monitor: Delivery rate, bounce rate, complaint rate
- Aim for: 95%+ delivery, <5% bounce, <0.1% complaints

---

#### 5. Customize Email Templates (1 hour)

**Current:**
- Using Supabase default templates
- Basic text-only emails

**Improvements:**
1. **Add branded HTML templates**
   - Include Niche Navigator logo
   - Use brand colors (blue/purple gradient)
   - Mobile-responsive design
   - Professional styling

2. **Customize email copy**
   - Password reset email
   - Signup confirmation email (if enabled)
   - Welcome email (optional)

**See:** `docs/MAILGUN_SETUP.md` for HTML template examples

**Where to customize:**
- Supabase Dashboard → Authentication → Email Templates

---

#### 6. Add Email Confirmation Flow (Optional - 30 minutes)

**Current:**
- Email confirmation is NOT enabled
- Users can sign up without verifying email

**To enable:**
1. Supabase → Authentication → Settings
2. Toggle "Enable email confirmations" → ON
3. Customize "Confirm signup" email template
4. Add `EmailConfirmationBanner` component to layout
5. Test signup flow

**Component already created:**
- `src/components/auth/EmailConfirmationBanner.tsx`

**See:** `docs/EMAIL_CONFIRMATION_SETUP.md` for full guide

---

## 🔒 Security Enhancements

### Rate Limiting for Password Resets

**Current:**
- No rate limiting on password reset requests
- Could be abused (spam, DoS)

**To implement:**
1. Add rate limiting middleware
2. Limit to 3 password reset requests per hour per email
3. Add cooldown period after 5 failed attempts
4. Track in database or Redis

**Benefit:** Prevents abuse and brute force attacks

---

### Monitor Authentication Logs

**Set up monitoring for:**
- [ ] Failed login attempts
- [ ] Password reset requests
- [ ] Unusual activity patterns
- [ ] Multiple requests from same IP

**Tools to consider:**
- Supabase built-in logging
- Sentry for error tracking
- Custom analytics dashboard

---

## 📄 Content Pages

### Create Missing Legal Pages

**Currently linked but don't exist:**
- [ ] `/terms` - Terms of Service
- [ ] `/privacy` - Privacy Policy

**Required for:**
- Signup page links to these
- Legal compliance (GDPR, etc.)
- User trust

**Action:**
- Create basic templates
- Review with legal counsel (if needed)
- Update before accepting real users

---

## 🌐 Domain & Deployment

### Configure Production URLs

**When deploying to production:**

1. **Update Supabase Site URL:**
   - Change from: `http://localhost:3000`
   - Change to: `https://nichenavigator.ai`

2. **Update Redirect URLs:**
   - Ensure production domain is in list
   - Remove localhost if not needed

3. **Update Environment Variables:**
   ```bash
   NEXT_PUBLIC_APP_URL=https://nichenavigator.ai
   ```

4. **Test email links:**
   - Verify reset links point to production
   - Test OAuth callback URLs

---

### Point Domain to Vercel

**Current:**
- Domain purchased (nichenavigator.ai)
- Not pointing to website yet

**When ready to deploy:**
1. Deploy to Vercel
2. Add custom domain in Vercel settings
3. Update DNS in Namecheap (A/CNAME records)
4. Wait for SSL certificate
5. Test at production URL

**See:** Vercel documentation for custom domains

---

## 📊 Analytics & Monitoring

### Email Analytics

**Track:**
- [ ] Password reset email open rates
- [ ] Click-through rates on reset links
- [ ] Time to email delivery
- [ ] Bounce rates by provider

**Available in:**
- Mailgun dashboard (basic analytics)
- Consider upgrade for advanced tracking

---

### Application Monitoring

**Set up:**
- [ ] Error tracking (Sentry, LogRocket)
- [ ] Performance monitoring
- [ ] User analytics (optional)
- [ ] Uptime monitoring

---

## 🧪 Testing Checklist

### Before Production Launch

**Email Testing:**
- [ ] Password reset works (all providers)
- [ ] Emails arrive in < 30 seconds
- [ ] Links work from all email clients
- [ ] Mobile email display looks good
- [ ] Spam score 8/10 or higher

**Auth Testing:**
- [ ] Signup flow works
- [ ] Login flow works
- [ ] OAuth (Google) works
- [ ] Logout works
- [ ] Session persistence works
- [ ] Protected routes redirect correctly

**Cross-browser Testing:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers (iOS Safari, Chrome)

---

## 📚 Documentation

### Update README

**Add sections for:**
- [ ] Production deployment guide
- [ ] Environment variables reference
- [ ] Email configuration notes
- [ ] Troubleshooting common issues

**Update domain references:**
- [x] Changed email from `.com` to `.ai` in constants.ts
- [ ] Update any other `.com` references to `.ai`

---

## 🎯 Priority Rankings

### High Priority (Before Launch)
1. ⭐ Add DMARC record (improves deliverability)
2. ⭐ Test email across providers
3. ⭐ Check spam score (mail-tester.com)
4. ⭐ Create Terms & Privacy pages
5. ⭐ Test production deployment

### Medium Priority (Nice to Have)
1. 🔸 Customize email templates (branding)
2. 🔸 Enable email confirmation
3. 🔸 Add rate limiting
4. 🔸 Set up monitoring

### Low Priority (Post-Launch)
1. 🔹 Email analytics tracking
2. 🔹 Advanced email templates
3. 🔹 Multiple language support
4. 🔹 Email preferences page

---

## 📝 Notes

**Last Updated:** 2025-10-31

**Current Environment:**
- Domain: nichenavigator.ai (Namecheap)
- Email: Mailgun SMTP
- Auth: Supabase
- Hosting: (To be deployed - Vercel recommended)

**Resources:**
- Email docs: `docs/` folder
- Mailgun dashboard: [app.mailgun.com](https://app.mailgun.com)
- Supabase dashboard: [supabase.com/dashboard](https://supabase.com/dashboard)
- Namecheap: [www.namecheap.com](https://www.namecheap.com)

---

## ✅ Completed Items

- [x] Purchase domain (nichenavigator.ai)
- [x] Add domain to Mailgun
- [x] Configure DNS records in Namecheap
- [x] Verify domain in Mailgun
- [x] Get SMTP credentials
- [x] Configure Supabase SMTP
- [x] Test password reset flow
- [x] Verify email delivery (working, in spam)
- [x] Update constants.ts with .ai domain

---

**Review this file before production launch!**
