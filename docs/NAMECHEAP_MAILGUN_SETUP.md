# Namecheap + Mailgun Setup for nichenavigator.ai

Complete guide to configure your `nichenavigator.ai` domain with Mailgun SMTP for email authentication.

---

## 🎉 Congratulations!

You've purchased: **nichenavigator.ai** via Namecheap

**Now you'll:**
1. Add your domain to Mailgun
2. Get DNS records from Mailgun
3. Add DNS records in Namecheap
4. Verify domain
5. Get SMTP credentials
6. Configure Supabase
7. Test email sending

**Total time:** 45 minutes (including DNS propagation)

---

## Part 1: Add Domain to Mailgun (5 minutes)

### Step 1: Open Mailgun Dashboard

1. **Go to:** [https://app.mailgun.com](https://app.mailgun.com)
2. **Log in** with your credentials
3. You should see the "Get started guide" screen

### Step 2: Click "Set up a custom domain"

From the sidebar (from your screenshot):
- ✅ Activate your account (completed)
- ⏭️ Invite a teammate (skipped)
- ⏭️ Send a test email (skipped for now)
- **👉 Set up a custom domain** ← Click this (10 mins)

### Step 3: Add Your Domain

**Enter domain details:**

**Domain name:**
```
nichenavigator.ai
```

**Domain region:**
- US (recommended if your users are primarily in North America)
- EU (if users are primarily in Europe)

**Domain type:**
- ✅ **Sending domain** (for sending emails)

**Click:** "Add Domain"

### Step 4: Copy DNS Records

Mailgun will show a screen with DNS records you need to add.

**You'll see records like:**

```
Type: TXT
Hostname: @ (or nichenavigator.ai)
Value: v=spf1 include:mailgun.org ~all
Priority: N/A

Type: TXT
Hostname: k1._domainkey
Value: k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4G... (long string)
Priority: N/A

Type: CNAME
Hostname: email
Value: mailgun.org
Priority: N/A

Type: MX (optional - for receiving emails)
Hostname: @ (or nichenavigator.ai)
Value: mxa.mailgun.org
Priority: 10

Type: MX (optional)
Hostname: @ (or nichenavigator.ai)
Value: mxb.mailgun.org
Priority: 10
```

**⚠️ IMPORTANT:**
- Keep this page open in a tab
- You'll need to copy these exact values
- Don't close until DNS is added in Namecheap

---

## Part 2: Add DNS Records in Namecheap (15 minutes)

### Step 1: Log into Namecheap

1. **Go to:** [https://www.namecheap.com](https://www.namecheap.com)
2. **Click:** Sign In (top right)
3. **Enter:** Your credentials
4. **Click:** Sign In

### Step 2: Navigate to DNS Settings

1. **Click:** Account (top right) → Domain List
2. **Find:** `nichenavigator.ai` in your domain list
3. **Click:** "Manage" button next to nichenavigator.ai

### Step 3: Open Advanced DNS

**You'll see several tabs:**
- Details
- Sharing & Transfer
- **Advanced DNS** ← Click this tab
- Email Forwarding
- Redirect Domain
- etc.

**Click:** "Advanced DNS" tab

### Step 4: Add DNS Records from Mailgun

**You'll see a section called "Host Records"**

For each record Mailgun showed, click **"Add New Record"** and enter:

---

#### Record 1: SPF (TXT Record)

**Click:** Add New Record

```
Type: TXT Record
Host: @
Value: v=spf1 include:mailgun.org ~all
TTL: Automatic (or 1800)
```

**Click:** ✓ (checkmark to save)

**What this does:** Authorizes Mailgun to send emails from your domain

---

#### Record 2: DKIM (TXT Record)

**Click:** Add New Record

```
Type: TXT Record
Host: k1._domainkey
Value: [Paste the LONG value from Mailgun - starts with "k=rsa; p=MIG..."]
TTL: Automatic (or 1800)
```

**⚠️ Important:**
- Copy the ENTIRE value from Mailgun
- It's very long (200+ characters)
- Include everything: `k=rsa; p=MIGfMA0GCSq...` to the end

**Click:** ✓ (checkmark to save)

**What this does:** Email authentication signature (anti-spoofing)

---

#### Record 3: Tracking Domain (CNAME)

**Click:** Add New Record

```
Type: CNAME Record
Host: email
Value: mailgun.org
TTL: Automatic (or 1800)
```

**Click:** ✓ (checkmark to save)

**What this does:** Enables click/open tracking (optional but recommended)

---

#### Record 4 & 5: MX Records (Optional - for receiving replies)

**Only add these if you want to receive emails at your domain**

**Click:** Add New Record

```
Type: MX Record
Host: @
Value: mxa.mailgun.org
Priority: 10
TTL: Automatic (or 1800)
```

**Click:** ✓ (checkmark to save)

**Click:** Add New Record (again)

```
Type: MX Record
Host: @
Value: mxb.mailgun.org
Priority: 10
TTL: Automatic (or 1800)
```

**Click:** ✓ (checkmark to save)

**What this does:** Allows you to receive emails sent to your domain (e.g., replies to password reset emails)

---

### Step 5: Save All Changes

**After adding all records:**
- ✅ SPF (TXT)
- ✅ DKIM (TXT)
- ✅ Tracking (CNAME)
- ✅ MX records (optional)

**Click:** "Save All Changes" (green button at top or bottom)

**Namecheap will show:** "All changes have been saved successfully"

---

## Part 3: Verify Domain in Mailgun (Wait 15-30 min)

### DNS Propagation Time

**After adding DNS records:**
- Changes take **15-30 minutes** to propagate
- Sometimes up to **2-4 hours**
- Rarely up to **24 hours**

**What to do while waiting:**
- ☕ Take a break
- 📧 Check your email
- 📚 Read the documentation
- 💻 Work on other parts of your app

### Check Verification Status

**After 30 minutes:**

1. **Go back to Mailgun Dashboard**
2. **Navigate to:** Sending → Domains
3. **Find:** `nichenavigator.ai` in the list
4. **Check status column:**

**Status indicators:**
- 🟡 **Unverified** (yellow) - DNS not propagated yet, wait longer
- 🟢 **Verified** (green checkmark) - Success! Domain ready to use
- 🔴 **Failed** (red) - DNS records incorrect, check configuration

**If still unverified after 30 minutes:**

1. **Click on** `nichenavigator.ai` domain name
2. **Click:** "Verify DNS Settings" button
3. **Wait 5 minutes**
4. **Refresh page**

**If still failing after 1 hour:**
- Go back to Namecheap Advanced DNS
- Double-check all DNS records match Mailgun exactly
- Look for typos in Host or Value fields
- Ensure no extra spaces before/after values

### Verify DNS with Online Tool (Optional)

**Check if DNS records are live:**

1. **Go to:** [https://mxtoolbox.com/SuperTool.aspx](https://mxtoolbox.com/SuperTool.aspx)
2. **Enter:** `nichenavigator.ai`
3. **Select:** "TXT Lookup"
4. **Click:** Search
5. **Should see:** `v=spf1 include:mailgun.org ~all`

**If you see the record:** DNS has propagated! Go verify in Mailgun

**If you don't see it:** Wait 15 more minutes and try again

---

## Part 4: Get SMTP Credentials (5 minutes)

**Once domain shows "Verified" (green checkmark):**

### Step 1: Navigate to SMTP Settings

1. **Mailgun Dashboard** → Sending → Domain settings
2. **Dropdown:** Select `nichenavigator.ai`
3. **Click:** SMTP credentials tab

### Step 2: View/Generate SMTP Password

**You'll see:**

```
SMTP Hostname: smtp.mailgun.org
Port: 587 (recommended)
Username: postmaster@nichenavigator.ai
Password: [hidden - click to reset]
```

**To generate/view password:**
1. **Click:** "Reset password" button
2. **Copy the password** (you won't see it again!)
3. **Paste into secure note:**

```
=== Mailgun SMTP Credentials for nichenavigator.ai ===
Host: smtp.mailgun.org
Port: 587
Username: postmaster@nichenavigator.ai
Password: [paste here]
Sender email: noreply@nichenavigator.ai
Sender name: Niche Navigator
```

**⚠️ Important:** Save this password securely - you can't view it again!

---

## Part 5: Configure Supabase (10 minutes)

### Step 1: Open Supabase Dashboard

1. **Go to:** [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Log in** with your credentials
3. **Select:** Your Niche Navigator project
4. **Click:** Authentication (in left sidebar)

### Step 2: Navigate to SMTP Settings

1. **Click:** Settings (under Authentication section)
2. **Scroll down** to find: **SMTP Settings** section

### Step 3: Enable Custom SMTP

**Toggle:** Enable Custom SMTP to **ON**

### Step 4: Enter SMTP Configuration

**Fill in the form:**

**Sender email:**
```
noreply@nichenavigator.ai
```

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
postmaster@nichenavigator.ai
```

**Password:**
```
[Paste your Mailgun SMTP password from Part 4]
```

**Minimum interval between emails (optional):**
```
[Leave default or blank]
```

**Secure connection (TLS):**
```
✅ Enabled
```

### Step 5: Save Configuration

1. **Scroll down**
2. **Click:** "Save" button (green)
3. **Wait for success message:** "SMTP settings updated successfully"

**If you see an error:**
- Check password is correct (no extra spaces)
- Verify username is exactly: `postmaster@nichenavigator.ai`
- Ensure host is: `smtp.mailgun.org`
- Port should be: `587`

### Step 6: Configure Site URL and Redirect URLs

**Scroll up to find:** "Auth Settings" or "URL Configuration"

**Site URL:**
```
http://localhost:3000
```
(Change to `https://nichenavigator.ai` when you deploy to production)

**Redirect URLs (add all of these):**
```
http://localhost:3000/**
https://nichenavigator.ai/**
https://*.vercel.app/**
```

**Click:** "Add" for each URL, then "Save"

---

## Part 6: Update Environment Variables (2 minutes)

### Development (.env.local)

Your current `.env.local` should already have:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://njqrfzvrrhzwxthzrrad.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJI...
SUPABASE_SECRET_KEY=eyJhbGciOiJI...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**No changes needed** - SMTP is configured in Supabase Dashboard, not env variables!

### Production (when deploying)

When you deploy to Vercel/production, set:

```bash
NEXT_PUBLIC_APP_URL=https://nichenavigator.ai
```

And update Supabase Site URL to: `https://nichenavigator.ai`

---

## Part 7: Test Password Reset (10 minutes)

### Step 1: Start Development Server

```bash
cd c:\Users\brism\myProjects\SaaS\Niche-Navigator
npm run dev
```

**Wait for:** `✓ Ready in [X]ms`

### Step 2: Test Password Reset Flow

**Open browser:**
```
http://localhost:3000/login
```

**Click:** "Forgot password?" link (top right of form)

**Enter your email:**
```
gptsinnovationslab@gmail.com
```
(or any email you have access to)

**Click:** "Send Reset Link"

**Expected:**
- Success message: "Check your email for a reset link"
- Shows your email address

### Step 3: Check Email

**Check your inbox** (and spam folder!)

**Expected email:**
```
From: Niche Navigator <noreply@nichenavigator.ai>
To: gptsinnovationslab@gmail.com
Subject: Reset Your Password (or custom subject)
```

**Email should:**
- ✅ Arrive within 30 seconds
- ✅ Show sender: `Niche Navigator <noreply@nichenavigator.ai>`
- ✅ Have professional styling
- ✅ Include "Reset Password" button/link
- ✅ Land in inbox (not spam)

**⚠️ If email doesn't arrive:**
- Wait 2-3 minutes (first email may be slow)
- Check spam/junk folder
- Check Mailgun logs (see Step 6 below)

### Step 4: Click Reset Link

**In the email:**
1. **Click:** "Reset Password" button
2. **Should redirect to:** `http://localhost:3000/reset-password?code=xxxxx`
3. **Should see:** Password reset form (not error page)

### Step 5: Reset Password

**On the reset password page:**

1. **Enter new password** (min 8 characters)
2. **Confirm password** (enter same password)
3. **Click:** "Reset Password"

**Expected:**
- ✅ Green success message
- ✅ Auto-redirect to `/dashboard` after 2 seconds
- ✅ You're logged in automatically

### Step 6: Verify in Mailgun Logs

**Check delivery status:**

1. **Go to:** [https://app.mailgun.com/app/sending/logs](https://app.mailgun.com/app/sending/logs)
2. **Find your email** in the list
3. **Check details:**
   - **To:** Your email address
   - **From:** noreply@nichenavigator.ai
   - **Subject:** Reset Your Password
   - **Status:** Delivered ✅
   - **Time:** < 5 seconds

**If status shows "Failed":**
- Click on the email to see error details
- Check SMTP credentials in Supabase
- Verify domain is verified in Mailgun

### Step 7: Test Login with New Password

**To confirm password reset worked:**

1. **Log out** (if needed) from dashboard
2. **Go to:** `http://localhost:3000/login`
3. **Enter email:** Your test email
4. **Enter password:** Your NEW password
5. **Click:** Sign In

**Expected:**
- ✅ Successfully logs in
- ✅ Redirects to dashboard
- ✅ Old password no longer works

---

## ✅ Success Checklist

**Your setup is complete when:**

- [ ] Domain `nichenavigator.ai` purchased on Namecheap
- [ ] Domain added to Mailgun
- [ ] DNS records added in Namecheap Advanced DNS
- [ ] DNS changes saved in Namecheap
- [ ] Domain verified in Mailgun (green checkmark)
- [ ] SMTP password generated and saved
- [ ] Supabase SMTP configured with Mailgun credentials
- [ ] Redirect URLs added in Supabase
- [ ] Test password reset email sent
- [ ] Email received from `noreply@nichenavigator.ai`
- [ ] Email arrived in inbox (not spam)
- [ ] Reset link clicked and redirected correctly
- [ ] New password set successfully
- [ ] Login with new password works
- [ ] Mailgun logs show "Delivered" status

---

## 🎉 You're Done!

**Your email system is now:**
- ✅ Production-ready
- ✅ Using custom domain (nichenavigator.ai)
- ✅ Professional sender address
- ✅ Reliable delivery via Mailgun
- ✅ Integrated with Supabase Auth

**What you can do now:**
- Send password reset emails
- Sign up new users
- Enable email confirmation (optional)
- Deploy to production

---

## 🔧 Next Steps

### Optional Enhancements

**1. Customize Email Templates**
- Supabase → Authentication → Email Templates
- Click "Reset Password"
- Update subject line and HTML body
- Add your branding colors
- See: `MAILGUN_SETUP.md` for template examples

**2. Enable Email Confirmation**
- Supabase → Authentication → Settings
- Toggle "Enable email confirmations" ON
- Customize "Confirm signup" template
- Add EmailConfirmationBanner component
- See: `EMAIL_CONFIRMATION_SETUP.md`

**3. Test Other Email Types**
- Signup confirmation
- Email change confirmation
- Magic link login (if enabled)

**4. Prepare for Production**
- Review: `PRODUCTION_EMAIL_CHECKLIST.md`
- Update Site URL to production domain
- Test on production environment
- Set up monitoring alerts

---

## 📋 Quick Reference

### Your Configuration

**Domain:** `nichenavigator.ai`

**Email Addresses:**
- Sending: `noreply@nichenavigator.ai`
- Support: `hello@nichenavigator.ai` (configure in Namecheap email forwarding)
- Contact: `contact@nichenavigator.ai` (optional)

**SMTP Details:**
```
Host: smtp.mailgun.org
Port: 587
Username: postmaster@nichenavigator.ai
Password: [your generated password]
TLS: Enabled
```

**Supabase Configuration:**
```
Custom SMTP: Enabled
Sender: noreply@nichenavigator.ai
Site URL: http://localhost:3000 (dev)
Site URL: https://nichenavigator.ai (production)
```

### Important Links

- **Namecheap Dashboard:** [https://ap.www.namecheap.com](https://ap.www.namecheap.com)
- **Mailgun Dashboard:** [https://app.mailgun.com](https://app.mailgun.com)
- **Mailgun Logs:** [https://app.mailgun.com/app/sending/logs](https://app.mailgun.com/app/sending/logs)
- **Supabase Dashboard:** [https://supabase.com/dashboard](https://supabase.com/dashboard)
- **DNS Checker:** [https://mxtoolbox.com](https://mxtoolbox.com)
- **Spam Checker:** [https://www.mail-tester.com](https://www.mail-tester.com)

---

## 🆘 Troubleshooting

### Domain Not Verifying in Mailgun

**Check DNS records:**
1. Go to [mxtoolbox.com/SuperTool.aspx](https://mxtoolbox.com/SuperTool.aspx)
2. Enter: `nichenavigator.ai`
3. Select: "TXT Lookup"
4. Should see: `v=spf1 include:mailgun.org ~all`

**If records not showing:**
- Wait longer (DNS can take up to 24 hours)
- Check Namecheap Advanced DNS for typos
- Ensure records saved in Namecheap

### Email Not Arriving

**Check Mailgun logs:**
- Go to: [app.mailgun.com/app/sending/logs](https://app.mailgun.com/app/sending/logs)
- Find your email
- Status "Delivered"? → Check spam folder
- Status "Failed"? → Click for error details

**Common issues:**
- SMTP credentials incorrect
- Domain not verified
- Recipient email bounced
- Rate limiting (unlikely on free tier)

### Email Going to Spam

**Improve deliverability:**
1. Verify SPF and DKIM records configured
2. Send test email to [mail-tester.com](https://www.mail-tester.com)
3. Check spam score (aim for 8/10+)
4. Ask recipients to whitelist your sender
5. Build sending reputation (send consistently)

### Reset Link Not Working

**Check:**
- URL has `?code=` or `#access_token=` parameter
- Redirect URLs in Supabase include your domain
- Token not expired (< 1 hour)
- `/reset-password` page exists and works

---

**Last Updated:** 2025-10-31
**Domain:** nichenavigator.ai
**Status:** Ready to configure!
