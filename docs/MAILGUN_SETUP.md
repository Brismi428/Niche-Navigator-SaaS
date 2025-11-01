# Mailgun SMTP Setup Guide for Niche Navigator

Complete guide to configure Mailgun as your custom SMTP provider for Supabase authentication emails.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Part 1: Mailgun Account Setup](#part-1-mailgun-account-setup)
3. [Part 2: Get SMTP Credentials](#part-2-get-smtp-credentials)
4. [Part 3: Configure Supabase](#part-3-configure-supabase)
5. [Part 4: Customize Email Templates](#part-4-customize-email-templates)
6. [Part 5: Testing](#part-5-testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- ✅ Active Mailgun.com account (free or paid tier)
- ✅ Domain verified in Mailgun (for sending emails)
- ✅ Access to your Supabase project dashboard
- ✅ Your Niche Navigator app running locally

---

## Part 1: Mailgun Account Setup

### Step 1.1: Log into Mailgun Dashboard
1. Go to [https://app.mailgun.com](https://app.mailgun.com)
2. Sign in with your credentials
3. Navigate to your **Dashboard**

### Step 1.2: Verify Your Domain
1. In the Mailgun dashboard, click **Sending** → **Domains**
2. Locate your domain (e.g., `nichenavigator.com` or `mg.nichenavigator.com`)
3. Check the status - it should show **Verified** with a green checkmark

**If NOT verified:**
1. Click on your domain name
2. Copy the DNS records shown (SPF, DKIM, MX)
3. Add these records to your domain's DNS settings (via your domain registrar)
4. Wait 15-30 minutes for DNS propagation
5. Click **Verify DNS Settings** in Mailgun
6. Status should change to **Verified**

### Step 1.3: Choose Your Sender Email
Decide what email address will appear as the sender:

**Recommended format:**
- `noreply@nichenavigator.com` (no replies expected)
- `hello@nichenavigator.com` (if you want to receive replies)
- `auth@nichenavigator.com` (dedicated to auth emails)

**Important:** The domain must match your verified Mailgun domain!

---

## Part 2: Get SMTP Credentials

### Step 2.1: Navigate to SMTP Settings
1. In Mailgun dashboard, click **Sending** → **Domain settings**
2. Select your domain from the dropdown
3. Click on the **SMTP credentials** tab

### Step 2.2: Retrieve SMTP Information
You'll need these 4 pieces of information:

**1. SMTP Host:**
```
smtp.mailgun.org
```
(This is the same for all Mailgun accounts)

**2. SMTP Port:**
```
587  (recommended - uses STARTTLS)
```
Alternative ports:
- `465` (SSL/TLS)
- `2525` (alternative to 587)

**3. SMTP Username:**
Format: `postmaster@your-domain.mailgun.org`

Example:
```
postmaster@mg.nichenavigator.com
```

Find this in the **SMTP credentials** section. It's usually listed as "Default SMTP Login".

**4. SMTP Password:**
Click **Reset password** if you need a new one, then copy the generated password.

**⚠️ Important:** Copy and save these credentials securely - you'll need them in the next step!

### Step 2.3: Save Credentials (Recommended)
Create a temporary secure note with:
```
Mailgun SMTP Credentials for Niche Navigator
---------------------------------------------
Host: smtp.mailgun.org
Port: 587
Username: postmaster@mg.nichenavigator.com
Password: [your-generated-password]
Sender Email: noreply@nichenavigator.com
Sender Name: Niche Navigator
```

---

## Part 3: Configure Supabase

### Step 3.1: Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **Niche Navigator** project
3. Navigate to **Authentication** (in left sidebar)

### Step 3.2: Enable Custom SMTP
1. Click **Settings** (under Authentication section)
2. Scroll down to **SMTP Settings** section
3. Toggle **Enable Custom SMTP** to ON

### Step 3.3: Enter SMTP Configuration
Fill in the form with your Mailgun credentials:

**Sender email:**
```
noreply@nichenavigator.com
```
(Or your chosen sender email from Part 1)

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
postmaster@mg.nichenavigator.com
```
(Your actual Mailgun SMTP username)

**Password:**
```
[paste your Mailgun SMTP password]
```

**Secure connection (TLS):** ✅ Enabled (for port 587)

### Step 3.4: Save Configuration
1. Click **Save** at the bottom of the page
2. Wait for the success message: "SMTP settings updated"
3. ✅ Configuration complete!

### Step 3.5: Configure Redirect URLs
1. Still in **Authentication** → **Settings**
2. Scroll to **Site URL** section

**Site URL:**
```
http://localhost:3000
```
(For development - change to production URL later)

**Redirect URLs:**
Add these allowed domains:
```
http://localhost:3000/**
https://nichenavigator.com/**
https://*.vercel.app/**
```

Click **Save** when done.

---

## Part 4: Customize Email Templates

### Step 4.1: Navigate to Email Templates
1. In Supabase dashboard, go to **Authentication** → **Email Templates**
2. You'll see 4 template types:
   - Confirm signup
   - Magic Link
   - **Reset Password** ← We'll customize this one
   - Change Email Address

### Step 4.2: Customize Reset Password Template

Click on **Reset Password** template to edit.

**Default Subject:**
```
Reset Your Password
```

**Recommended Subject:**
```
Reset your Niche Navigator password
```

**Default Body (simplified):**
```html
<h2>Reset Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

**Enhanced Branded Template:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px;">
              <h1 style="margin: 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                Reset Your Password
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 0 40px 30px 40px; color: #475569; font-size: 16px; line-height: 1.6;">
              <p style="margin: 0 0 20px 0;">Hi there,</p>

              <p style="margin: 0 0 20px 0;">
                We received a request to reset your password for your Niche Navigator account.
              </p>

              <p style="margin: 0 0 30px 0;">
                Click the button below to choose a new password:
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 0 0 30px 0;">
                <a href="{{ .ConfirmationURL }}"
                   style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Reset Password
                </a>
              </div>

              <p style="margin: 0 0 20px 0; font-size: 14px; color: #64748b;">
                This link will expire in 1 hour for security reasons.
              </p>

              <p style="margin: 0 0 20px 0; font-size: 14px; color: #64748b;">
                If you didn't request this password reset, please ignore this email or contact support if you have concerns.
              </p>

              <p style="margin: 30px 0 0 0;">
                Best regards,<br>
                <strong>The Niche Navigator Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0 0 10px 0;">
                <strong>Niche Navigator</strong><br>
                Building Better SaaS Applications
              </p>
              <p style="margin: 0;">
                <a href="https://nichenavigator.com" style="color: #3b82f6; text-decoration: none;">nichenavigator.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

**Important Variables:**
- `{{ .ConfirmationURL }}` - This is automatically replaced with the reset link
- `{{ .Token }}` - Alternative variable (contains just the token)
- `{{ .SiteURL }}` - Your site's base URL

### Step 4.3: Save Template
1. Click **Save** at the bottom
2. Success message: "Email template updated"
3. ✅ Template ready to use!

### Step 4.4: Optional - Customize Other Templates
Repeat the process for:
- **Confirm signup** (if using email confirmation)
- **Magic Link** (if using passwordless login)
- **Change Email Address** (when users update their email)

---

## Part 5: Testing

### Step 5.1: Start Your Local Development Server
```bash
cd c:\Users\brism\myProjects\SaaS\Niche-Navigator
npm run dev
```

Wait for: `✓ Ready in [X]ms`

### Step 5.2: Test Password Reset Flow
1. **Open browser:** Navigate to `http://localhost:3000/login`

2. **Click "Forgot password?" link** (in top-right of login form)

3. **Enter your test email:**
   - Use an email you have access to
   - Example: `your-email@gmail.com`
   - Click **Send Reset Link**

4. **Check for success message:**
   - Should see: "Check your email for a reset link"
   - Should show the email address you entered

5. **Check your email inbox:**
   - Look for email from: `Niche Navigator <noreply@nichenavigator.com>`
   - Subject: "Reset your Niche Navigator password"
   - **⚠️ Check spam folder if not in inbox!**

6. **Verify email content:**
   - Should see branded template with your logo/colors
   - Should have blue "Reset Password" button
   - Hover over button - URL should point to: `http://localhost:3000/reset-password?code=...`

7. **Click "Reset Password" button:**
   - Should redirect to your app's reset password page
   - URL should include `?code=` or `#access_token=` parameters
   - Should see password reset form (not error page)

8. **Enter new password:**
   - Type new password (minimum 8 characters)
   - Retype password in "Confirm password" field
   - Click **Reset Password**

9. **Verify success:**
   - Should see green success message
   - Should auto-redirect to `/dashboard` after 2 seconds
   - Should be logged in automatically

10. **Test new password:**
    - Log out (if needed)
    - Go back to `/login`
    - Log in with your email and NEW password
    - Should successfully log in

### Step 5.3: Check Mailgun Delivery Logs
1. Go to Mailgun dashboard: [https://app.mailgun.com](https://app.mailgun.com)
2. Click **Sending** → **Logs**
3. You should see your test email with:
   - ✅ Status: **Delivered**
   - Recipient: Your test email
   - Subject: "Reset your Niche Navigator password"
   - Delivery time: < 5 seconds

### Step 5.4: Test Email Deliverability
**Test across different email providers:**

1. **Gmail:**
   - Send reset email to your Gmail address
   - Check: Inbox vs Promotions tab vs Spam folder
   - Note where it lands

2. **Outlook/Hotmail:**
   - Send to an Outlook.com email
   - Check delivery and placement

3. **Yahoo Mail:**
   - Send to a Yahoo email address
   - Verify delivery

4. **Check Spam Score:**
   - Go to [Mail-Tester.com](https://www.mail-tester.com)
   - Copy the test email address shown
   - Use it to request password reset
   - Click "Then check your score"
   - **Goal:** Score of 8/10 or higher

### Step 5.5: Test Different Scenarios

**Invalid email:**
- Try password reset with non-existent email
- Should still show success (security best practice - don't reveal if email exists)
- No email should be sent

**Expired token:**
- Request reset email
- Wait 1+ hour
- Try to use the link
- Should show error: "Invalid or expired reset token"
- Should offer to request new link

**Already used token:**
- Complete a password reset
- Try to use the same email link again
- Should show error message

**Multiple reset requests:**
- Request reset email
- Before using it, request another reset email
- Only the newest link should work
- Old link should be invalidated

---

## Part 6: Production Deployment

### Step 6.1: Update Supabase Production Settings
When ready to deploy:

1. Go to your **production** Supabase project
2. Repeat Part 3 steps with same Mailgun credentials
3. Update **Site URL** to production domain:
   ```
   https://nichenavigator.com
   ```
4. Update **Redirect URLs** to include production:
   ```
   https://nichenavigator.com/**
   ```

### Step 6.2: Test in Production
After deploying to Vercel/production:
1. Go to `https://nichenavigator.com/login`
2. Test password reset flow
3. Verify emails arrive with production domain in links
4. Monitor Mailgun logs for production emails

---

## Troubleshooting

### Email Not Arriving

**Check 1: Spam Folder**
- Check spam/junk folder in your email client
- Mark as "Not Spam" if found there

**Check 2: Mailgun Logs**
1. Go to Mailgun → Sending → Logs
2. Look for your email in the list
3. Check status column:
   - ✅ **Delivered** - Email was sent successfully
   - ⚠️ **Failed** - Click for error details
   - ⏳ **Queued** - Still processing

**Check 3: Email Address**
- Verify you entered correct email address
- Check for typos
- Try a different email provider (Gmail, Outlook, etc.)

**Check 4: SMTP Configuration**
1. Supabase → Authentication → Settings → SMTP Settings
2. Verify all credentials are correct:
   - Host: `smtp.mailgun.org`
   - Port: `587`
   - Username matches your Mailgun domain
   - Password is correct (try regenerating in Mailgun)

**Check 5: Mailgun Domain Status**
1. Mailgun → Sending → Domains
2. Verify domain shows "Verified" status
3. If not, check DNS records

### Email Goes to Spam

**Solution 1: Improve Sender Reputation**
- Send test emails to yourself and mark as "Not Spam"
- Ask users to whitelist `noreply@nichenavigator.com`
- Build sending history (Mailgun tracks reputation)

**Solution 2: DNS Records**
Ensure these DNS records are configured:
- **SPF** - Authorizes Mailgun to send from your domain
- **DKIM** - Cryptographic signature for authentication
- **DMARC** - Policy for handling failed authentication

Check in Mailgun → Domain Settings → DNS Records

**Solution 3: Improve Email Content**
- Avoid spam trigger words (FREE, URGENT, CLICK NOW)
- Include plain-text version
- Add physical address in footer (recommended)
- Include unsubscribe link (if sending marketing emails)

### Reset Link Not Working

**Error: "Invalid or expired reset token"**

Possible causes:
1. **Link expired** (default: 1 hour expiration)
   - Request new reset email
   - Use link within 1 hour

2. **Link already used**
   - Each link can only be used once
   - Request new reset email

3. **Redirect URL mismatch**
   - Check Supabase → Authentication → Settings → Redirect URLs
   - Ensure your app's URL is in the allowed list
   - Include `/**` wildcard (e.g., `http://localhost:3000/**`)

4. **Code parameter missing**
   - Check URL has `?code=` parameter
   - If missing, check email template has `{{ .ConfirmationURL }}`

### SMTP Connection Errors

**Error: "Failed to connect to SMTP server"**

Solutions:
1. **Check Mailgun credentials**
   - Username format: `postmaster@your-domain.mailgun.org`
   - Try regenerating password in Mailgun

2. **Check port number**
   - Try port `587` (STARTTLS)
   - Alternative: port `2525`
   - Avoid port `465` if having issues

3. **Check Mailgun account status**
   - Ensure account is active (not suspended)
   - Check if you've hit sending limits
   - Verify billing is up to date

4. **Firewall issues**
   - Ensure SMTP ports not blocked by firewall
   - Try from different network

### Emails Delayed

**Symptoms:** Emails arrive 5+ minutes late

**Solutions:**
1. Check Mailgun logs for processing time
2. Verify not in email provider's "greylisting" period
3. Check Mailgun account limits (free tier has lower priority)
4. Consider upgrading Mailgun plan for faster delivery

---

## Best Practices

### Security
- ✅ Use strong SMTP password
- ✅ Never commit credentials to git
- ✅ Rotate SMTP password periodically (every 90 days)
- ✅ Monitor Mailgun logs for suspicious activity
- ✅ Implement rate limiting for password resets

### Deliverability
- ✅ Maintain verified domain status
- ✅ Monitor bounce rates (keep < 5%)
- ✅ Remove invalid email addresses from your database
- ✅ Don't send to spam traps
- ✅ Warm up new domains gradually (start with low volume)

### User Experience
- ✅ Clear, branded email templates
- ✅ Mobile-responsive email design
- ✅ Fast delivery (< 30 seconds)
- ✅ Helpful error messages
- ✅ "Didn't receive email?" help text

### Monitoring
- ✅ Check Mailgun logs weekly
- ✅ Monitor delivery rates
- ✅ Set up Mailgun alerts for failures
- ✅ Track user support tickets related to email

---

## Next Steps

After successful setup:

1. **Customize other email templates** (signup confirmation, magic link, etc.)
2. **Add email confirmation flow** - Remind users to confirm email
3. **Implement rate limiting** - Prevent password reset abuse
4. **Monitor email analytics** - Track open rates, click rates
5. **Prepare for production** - Test thoroughly before launch

---

## Support Resources

- **Mailgun Documentation:** [https://documentation.mailgun.com](https://documentation.mailgun.com)
- **Supabase SMTP Docs:** [https://supabase.com/docs/guides/auth/auth-smtp](https://supabase.com/docs/guides/auth/auth-smtp)
- **Mail-Tester:** [https://www.mail-tester.com](https://www.mail-tester.com)
- **Niche Navigator Support:** See `docs/SUPPORT.md`

---

**Last Updated:** 2025-10-31
**Version:** 1.0.0
