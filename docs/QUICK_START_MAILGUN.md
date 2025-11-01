# Mailgun SMTP Quick Start Guide

Fast-track setup guide to get Mailgun working with your Niche Navigator authentication system in under 30 minutes.

---

## What You're Setting Up

You'll configure Mailgun to send authentication emails (password resets, confirmations) instead of using Supabase's default email service.

**Your auth system is already 100% implemented** - you just need to connect Mailgun!

---

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] Active Mailgun.com account (logged in)
- [ ] Domain verified in Mailgun (with DNS records configured)
- [ ] Access to Supabase Dashboard (logged in)
- [ ] Your Niche Navigator app code ready

**If your Mailgun domain isn't verified yet:**
1. Log into Mailgun → Sending → Domains
2. Click your domain
3. Copy DNS records (SPF, DKIM, MX)
4. Add them to your domain's DNS settings (via registrar)
5. Wait 30 minutes, then click "Verify DNS Settings"

---

## Step 1: Get Mailgun SMTP Credentials (5 minutes)

### 1.1 Open Mailgun Dashboard
- Go to: [https://app.mailgun.com](https://app.mailgun.com)
- Navigate to: **Sending** → **Domain settings**
- Select your domain from dropdown

### 1.2 Get SMTP Credentials
Click on **SMTP credentials** tab

**Copy these values:**

| Field | Value | Your Value |
|-------|-------|------------|
| **Host** | `smtp.mailgun.org` | (same for everyone) |
| **Port** | `587` | (recommended) |
| **Username** | `postmaster@your-domain.mailgun.org` | _________________ |
| **Password** | Click "Reset password" to generate | _________________ |

**⚠️ Important:** Save these credentials securely - you'll need them in Step 2!

---

## Step 2: Configure Supabase (10 minutes)

### 2.1 Open Supabase Dashboard
- Go to: [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Select your **Niche Navigator** project
- Click: **Authentication** → **Settings**

### 2.2 Enable Custom SMTP
1. Scroll to **SMTP Settings** section
2. Toggle **Enable Custom SMTP** to **ON**

### 2.3 Enter Configuration
Fill in the form with these values:

**Sender email:**
```
noreply@nichenavigator.com
```
(Or use your actual domain)

**Sender name:**
```
Niche Navigator
```

**Host:**
```
smtp.mailgun.org
```

**Port number:**
```
587
```

**Username:**
```
[Paste your Mailgun username from Step 1]
```

**Password:**
```
[Paste your Mailgun password from Step 1]
```

**Secure connection (TLS):**
```
✅ Enabled
```

### 2.4 Save Configuration
1. Click **Save** at bottom of page
2. Wait for success message
3. ✅ Done!

### 2.5 Configure Redirect URLs
Still in **Authentication** → **Settings**, scroll to:

**Site URL:**
```
http://localhost:3000
```
(Change to production URL when deploying)

**Redirect URLs:** (add these)
```
http://localhost:3000/**
https://nichenavigator.com/**
https://*.vercel.app/**
```

Click **Save**.

---

## Step 3: Test Password Reset (10 minutes)

### 3.1 Start Your App
```bash
cd c:\Users\brism\myProjects\SaaS\Niche-Navigator
npm run dev
```

Wait for: `✓ Ready in [X]ms`

### 3.2 Test Password Reset Flow

**Open browser:**
```
http://localhost:3000/login
```

**Click:** "Forgot password?" link

**Enter:** Your email address (one you can access)

**Click:** "Send Reset Link"

**Check email inbox** (and spam folder!)

**Expected:**
- ✅ Email from: `Niche Navigator <noreply@nichenavigator.com>`
- ✅ Subject: "Reset Your Password" or similar
- ✅ Arrives within 30 seconds
- ✅ Has "Reset Password" button/link

**Click the reset link in email**

**Should redirect to:**
```
http://localhost:3000/reset-password?code=xxxxx
```

**Enter new password** (twice)

**Click:** "Reset Password"

**Expected:**
- ✅ Success message appears
- ✅ Auto-redirects to `/dashboard` after 2 seconds
- ✅ You're logged in automatically

**Test login with new password:**
- Log out (if needed)
- Go back to `/login`
- Log in with new password
- ✅ Should work!

### 3.3 Verify in Mailgun
1. Open: [https://app.mailgun.com/app/sending/logs](https://app.mailgun.com/app/sending/logs)
2. Find your test email
3. Status should show: **Delivered**
4. Delivery time: < 5 seconds

---

## Step 4: Customize Email Template (Optional - 5 minutes)

### 4.1 Navigate to Templates
- Supabase Dashboard → **Authentication** → **Email Templates**
- Click: **Reset Password**

### 4.2 Update Subject
Change from:
```
Reset Your Password
```

To:
```
Reset your Niche Navigator password
```

### 4.3 Update Body (Optional)
Use the branded HTML template from `MAILGUN_SETUP.md` or keep it simple for now.

**Minimum requirement:** Ensure `{{ .ConfirmationURL }}` is present in the template.

### 4.4 Save
Click **Save** at bottom.

---

## ✅ Success Checklist

You're done when:
- [ ] Mailgun SMTP credentials obtained
- [ ] Supabase custom SMTP enabled and configured
- [ ] Test password reset email received
- [ ] Email arrived in inbox (not spam)
- [ ] Reset link works and redirects to your app
- [ ] New password successfully set
- [ ] Login works with new password
- [ ] Mailgun logs show "Delivered" status

---

## Troubleshooting

### Email Not Arriving

**Check 1: Spam folder**
- Always check spam/junk first
- Mark as "Not Spam" if found

**Check 2: Mailgun logs**
- Go to: Mailgun → Sending → Logs
- Find your email
- Status shows "Delivered"? → Email provider issue
- Status shows "Failed"? → Click for error details

**Check 3: SMTP credentials**
- Supabase → Authentication → Settings
- Verify username/password correct
- Try regenerating password in Mailgun
- Save and test again

**Check 4: Domain verification**
- Mailgun → Sending → Domains
- Your domain should show "Verified" (green checkmark)
- If not, check DNS records

### Email Goes to Spam

**Quick fix:**
1. Mark as "Not Spam" in your email client
2. Whitelist `noreply@nichenavigator.com`
3. Check spam score at [mail-tester.com](https://www.mail-tester.com)

**Long-term fix:**
- Verify DNS records (SPF, DKIM) in Mailgun
- See full guide: `MAILGUN_SETUP.md`

### Reset Link Doesn't Work

**Check 1: URL parameters**
- URL should have `?code=` or `#access_token=`
- If missing, check email template has `{{ .ConfirmationURL }}`

**Check 2: Redirect URLs**
- Supabase → Authentication → Settings → Redirect URLs
- Must include: `http://localhost:3000/**`

**Check 3: Token expiration**
- Links expire after 1 hour
- Request new reset email
- Use link immediately

---

## Next Steps

### Required for Production
Before going live:
1. **Review production checklist:** `PRODUCTION_EMAIL_CHECKLIST.md`
2. **Configure production Supabase** with same Mailgun credentials
3. **Update Site URL** to production domain
4. **Test on production** before launch

### Optional Enhancements
1. **Customize email templates** - Add branding, colors, logo
   - See: `MAILGUN_SETUP.md` for HTML templates
2. **Enable email confirmation** - Verify new user emails
   - See: `EMAIL_CONFIRMATION_SETUP.md`
3. **Add confirmation banner** - Remind users to verify email
   - Component already created: `EmailConfirmationBanner.tsx`

### Documentation
- **Full setup guide:** `MAILGUN_SETUP.md` (comprehensive)
- **Testing guide:** `EMAIL_TESTING_GUIDE.md` (detailed tests)
- **Overview:** `EMAIL_SYSTEM_README.md` (architecture)

---

## Quick Reference

### Mailgun Dashboard
- **URL:** [https://app.mailgun.com](https://app.mailgun.com)
- **Logs:** [https://app.mailgun.com/app/sending/logs](https://app.mailgun.com/app/sending/logs)
- **SMTP Credentials:** Sending → Domain settings → SMTP credentials

### Supabase Dashboard
- **URL:** [https://supabase.com/dashboard](https://supabase.com/dashboard)
- **SMTP Settings:** Authentication → Settings → SMTP Settings
- **Email Templates:** Authentication → Email Templates

### Local App
- **Homepage:** [http://localhost:3000](http://localhost:3000)
- **Login:** [http://localhost:3000/login](http://localhost:3000/login)
- **Forgot Password:** [http://localhost:3000/forgot-password](http://localhost:3000/forgot-password)

### Testing Commands
```bash
# Start dev server
npm run dev

# Open browser to test
# http://localhost:3000/login → Click "Forgot password?"
```

---

## Support

**Need help?**
1. Check `EMAIL_TESTING_GUIDE.md` for detailed troubleshooting
2. Review `MAILGUN_SETUP.md` for complete configuration steps
3. Check Mailgun support: [help.mailgun.com](https://help.mailgun.com)
4. Check Supabase docs: [supabase.com/docs](https://supabase.com/docs)

---

## Summary

**You just configured:**
✅ Mailgun SMTP integration with Supabase
✅ Custom email sending for authentication
✅ Password reset flow with branded emails
✅ Production-ready email infrastructure

**Total time:** ~30 minutes

**Your authentication system is now complete and ready for production!**

---

**Last Updated:** 2025-10-31
**Version:** 1.0.0
