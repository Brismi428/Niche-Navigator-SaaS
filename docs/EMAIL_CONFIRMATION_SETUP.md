# Email Confirmation Setup Guide

How to enable and implement email confirmation for new user signups.

---

## Table of Contents
1. [Overview](#overview)
2. [Enable Email Confirmation in Supabase](#enable-email-confirmation-in-supabase)
3. [Add Confirmation Banner](#add-confirmation-banner)
4. [Customize Confirmation Email Template](#customize-confirmation-email-template)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Overview

Email confirmation is a security feature that verifies users own the email address they signed up with.

### Benefits
- ✅ Prevents fake/spam accounts
- ✅ Ensures users can receive important notifications
- ✅ Improves email deliverability (reduces bounces)
- ✅ Protects against typos in email addresses
- ✅ Industry best practice for SaaS applications

### How It Works
1. User signs up with email and password
2. Supabase sends confirmation email via Mailgun
3. User clicks confirmation link in email
4. Account is marked as verified
5. User gains full access to application

---

## Enable Email Confirmation in Supabase

### Step 1: Navigate to Auth Settings
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Authentication** in sidebar
4. Click **Settings** (under Authentication section)

### Step 2: Enable Email Confirmation
1. Scroll to **Email Confirmation** section
2. Toggle **Enable email confirmations** to **ON**
3. Click **Save**

### Step 3: Configure Confirmation Settings

**Email Redirect URL:**
This is where users land after clicking the confirmation link.

**Development:**
```
http://localhost:3000/auth/callback
```

**Production:**
```
https://nichenavigator.com/auth/callback
```

**Confirmation Grace Period:**
- Default: Users can log in before confirming (with limited access)
- Strict: Users CANNOT log in until confirmed (more secure)

**Recommended:** Use default (grace period) for better UX.

### Step 4: Update Redirect URLs
Ensure these URLs are in the **Redirect URLs** list:
```
http://localhost:3000/auth/callback
https://nichenavigator.com/auth/callback
https://*.vercel.app/auth/callback
```

---

## Add Confirmation Banner

The `EmailConfirmationBanner` component displays a prominent reminder for users to verify their email.

### Step 1: Add to Root Layout

Edit: `src/app/layout.tsx`

```typescript
import EmailConfirmationBanner from '@/components/auth/EmailConfirmationBanner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <NavigationProvider>
              <Header />

              {/* Add email confirmation banner here */}
              <EmailConfirmationBanner />

              <main>{children}</main>
              <Footer />
            </NavigationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Why in root layout?**
- Shows on all pages when user is logged in
- Automatic detection (no need to add to each page)
- Dismissible (user preference saved in localStorage)

### Step 2: Alternative - Add to Specific Pages

If you only want to show the banner on certain pages (e.g., dashboard):

Edit: `src/app/dashboard/page.tsx`

```typescript
import EmailConfirmationBanner from '@/components/auth/EmailConfirmationBanner'

export default function DashboardPage() {
  return (
    <>
      <EmailConfirmationBanner />

      <div className="container mx-auto px-4 py-8">
        {/* Your dashboard content */}
      </div>
    </>
  )
}
```

### Component Features

The `EmailConfirmationBanner` automatically:
- ✅ Detects if user's email is unconfirmed
- ✅ Shows only to logged-in users with unconfirmed emails
- ✅ Allows resending confirmation email
- ✅ Provides success/error feedback
- ✅ Remembers dismissal in localStorage
- ✅ Fully responsive and accessible
- ✅ Dark mode support

---

## Customize Confirmation Email Template

### Step 1: Navigate to Email Templates
1. Supabase Dashboard → **Authentication** → **Email Templates**
2. Click on **Confirm signup** template

### Step 2: Customize Subject
**Default:**
```
Confirm Your Signup
```

**Recommended:**
```
Welcome to Niche Navigator - Please confirm your email
```

### Step 3: Customize HTML Body

**Default Template:**
```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
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
                Welcome to Niche Navigator!
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 0 40px 30px 40px; color: #475569; font-size: 16px; line-height: 1.6;">
              <p style="margin: 0 0 20px 0;">Hi there,</p>

              <p style="margin: 0 0 20px 0;">
                Thanks for signing up! We're excited to have you on board.
              </p>

              <p style="margin: 0 0 30px 0;">
                To get started, please confirm your email address by clicking the button below:
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 0 0 30px 0;">
                <a href="{{ .ConfirmationURL }}"
                   style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Confirm Email Address
                </a>
              </div>

              <p style="margin: 0 0 20px 0; font-size: 14px; color: #64748b;">
                This link will expire in 24 hours for security reasons.
              </p>

              <p style="margin: 0 0 20px 0; font-size: 14px; color: #64748b;">
                If you didn't create an account with Niche Navigator, please ignore this email.
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

### Step 4: Available Variables
Use these variables in your template:

- `{{ .ConfirmationURL }}` - Full confirmation link (recommended)
- `{{ .Token }}` - Just the confirmation token
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your site's base URL

### Step 5: Add Plain Text Version

For better deliverability and accessibility:

```
Welcome to Niche Navigator!

Thanks for signing up! We're excited to have you on board.

To get started, please confirm your email address by clicking this link:

{{ .ConfirmationURL }}

This link will expire in 24 hours for security reasons.

If you didn't create an account with Niche Navigator, please ignore this email.

Best regards,
The Niche Navigator Team

https://nichenavigator.com
```

### Step 6: Save Template
Click **Save** at the bottom of the page.

---

## Testing

### Test 1: New User Signup with Email Confirmation

**Step-by-step:**

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to signup:**
   - Go to `http://localhost:3000/signup`

3. **Create new account:**
   - Enter test email (one you have access to)
   - Enter name, password
   - Check terms & conditions
   - Click **Sign Up**

4. **Check for confirmation email:**
   - **⚠️ Important:** Check both inbox AND spam folder
   - Email from: `Niche Navigator <noreply@nichenavigator.com>`
   - Subject: "Welcome to Niche Navigator - Please confirm your email"

5. **Verify email content:**
   - Should see branded template
   - Should have "Confirm Email Address" button
   - Hover over button - URL should be: `http://localhost:3000/auth/callback?...`

6. **Before confirming - Check banner:**
   - Log in with new account
   - Should see yellow confirmation banner at top
   - Banner should show your email address
   - Should have "Resend Email" button

7. **Click confirmation link in email:**
   - Should redirect to your app
   - Should show success message or redirect to dashboard
   - Should be logged in automatically

8. **After confirming - Check banner:**
   - Refresh the page
   - Banner should NO LONGER appear (email now confirmed)

9. **Verify in Supabase:**
   - Supabase Dashboard → Authentication → Users
   - Find your test user
   - `email_confirmed_at` column should have timestamp

### Test 2: Resend Confirmation Email

1. **Create new account** (as in Test 1)
2. **Log in** before confirming email
3. **See confirmation banner** at top of page
4. **Click "Resend Email" button**
5. **Check for success message:** "Confirmation email sent!"
6. **Check email inbox** for NEW confirmation email
7. **Click link in NEW email**
8. **Verify confirmation works**

### Test 3: Dismiss Banner

1. **Log in with unconfirmed account**
2. **See confirmation banner**
3. **Click "Dismiss" button** or X icon
4. **Banner should disappear**
5. **Refresh page** - Banner should NOT reappear (localStorage)
6. **Clear localStorage and refresh** - Banner should appear again

**To clear localStorage:**
- Chrome: F12 → Application → Local Storage → Delete `emailBannerDismissed`
- Firefox: F12 → Storage → Local Storage → Delete `emailBannerDismissed`

### Test 4: Email Deliverability

Test across different email providers:

| Provider | Inbox/Spam? | Delivery Time | Notes |
|----------|-------------|---------------|-------|
| Gmail | ⬜ Inbox ⬜ Promotions ⬜ Spam | ___ sec | |
| Outlook | ⬜ Inbox ⬜ Junk | ___ sec | |
| Yahoo | ⬜ Inbox ⬜ Spam | ___ sec | |
| Custom | ⬜ Inbox ⬜ Spam | ___ sec | |

**Spam Score Check:**
1. Go to [Mail-Tester.com](https://www.mail-tester.com)
2. Copy the test email shown
3. Sign up with that email
4. Go back to Mail-Tester and click "Check Score"
5. **Target:** 8/10 or higher

---

## Advanced Configuration

### Option 1: Require Email Confirmation Before Login

**More secure, but stricter UX**

1. Supabase Dashboard → Authentication → Settings
2. Enable **Email Confirmations**
3. Set confirmation mode to **Strict**
4. Users CANNOT log in until email is confirmed

**Pros:**
- ✅ More secure (prevents unverified access)
- ✅ Forces users to verify email immediately

**Cons:**
- ❌ Worse UX (users can't explore app before confirming)
- ❌ Higher drop-off rate

### Option 2: Restrict Features for Unconfirmed Users

**Balanced approach - let users log in but limit features**

Add checks in your components:

```typescript
'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function PremiumFeature() {
  const { user } = useAuth()

  if (!user?.emailConfirmed) {
    return (
      <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800">
          Please confirm your email to access this feature.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Premium feature content */}
    </div>
  )
}
```

**Features you might restrict:**
- Creating projects
- Inviting team members
- Accessing billing/payments
- API access
- Export functionality

### Option 3: Periodic Reminders

Show confirmation banner periodically (not just once):

Modify `EmailConfirmationBanner.tsx`:

```typescript
// Instead of checking localStorage once, check daily
const [dismissed, setDismissed] = useState(() => {
  if (typeof window !== 'undefined') {
    const dismissedDate = localStorage.getItem('emailBannerDismissedDate')
    if (dismissedDate) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedDate)) / (1000 * 60 * 60 * 24)
      return daysSinceDismissed < 1 // Show again after 1 day
    }
  }
  return false
})

const handleDismiss = () => {
  setDismissed(true)
  localStorage.setItem('emailBannerDismissedDate', Date.now().toString())
}
```

---

## Troubleshooting

### Confirmation Email Not Arriving

**Check 1: Email Confirmation Enabled**
- Supabase → Authentication → Settings → Email Confirmations
- Should be toggled ON

**Check 2: Mailgun Configuration**
- Verify SMTP settings in Supabase
- Check Mailgun logs for delivery status
- See main `MAILGUN_SETUP.md` guide

**Check 3: Spam Folder**
- Always check spam/junk folder
- Mark as "Not Spam" if found there

**Check 4: Email Template**
- Verify template includes `{{ .ConfirmationURL }}`
- Check template saved successfully

### Banner Not Showing

**Check 1: User Email Status**
- Log user object: `console.log(user)`
- Check `emailConfirmed` field
- Should be `false` or `undefined` for unconfirmed

**Check 2: Component Imported**
- Verify `EmailConfirmationBanner` imported in layout
- Check it's inside `<AuthProvider>` wrapper
- Ensure placed after Header but before main content

**Check 3: LocalStorage**
- Check if `emailBannerDismissed` is set to `true`
- Clear it: `localStorage.removeItem('emailBannerDismissed')`
- Refresh page

### Confirmation Link Not Working

**Error: "Invalid or expired token"**

**Check 1: Token Expiration**
- Default expiry: 24 hours
- Request new confirmation email
- Use link within 24 hours

**Check 2: Redirect URL**
- Supabase → Authentication → Settings → Redirect URLs
- Ensure `http://localhost:3000/auth/callback` is allowed
- Include `/**` wildcard

**Check 3: Callback Handler**
- Verify `/auth/callback/route.ts` exists
- Check it handles `?code=` parameter
- Review server logs for errors

### Resend Email Not Working

**Check 1: Rate Limiting**
- Supabase may rate-limit resend requests
- Wait 60 seconds between attempts

**Check 2: SMTP Configuration**
- Same checks as regular email sending
- Verify Mailgun credentials
- Check Mailgun logs

**Check 3: Browser Console**
- Open browser DevTools (F12)
- Check Console tab for errors
- Look for failed API requests

---

## Best Practices

### User Experience
- ✅ Allow users to use app before confirming (grace period)
- ✅ Show clear, non-intrusive reminder banner
- ✅ Make "Resend Email" button easy to find
- ✅ Provide helpful instructions ("check spam folder")
- ✅ Auto-dismiss banner after confirmation

### Email Content
- ✅ Use friendly, welcoming tone
- ✅ Clear call-to-action button
- ✅ Explain WHY confirmation is needed
- ✅ Include expiration time
- ✅ Mobile-responsive design

### Security
- ✅ Use HTTPS for all confirmation links
- ✅ Set reasonable token expiration (24 hours)
- ✅ Rate-limit resend requests
- ✅ Don't expose whether email exists in database
- ✅ Log confirmation attempts for security audit

### Monitoring
- ✅ Track confirmation rate (% of users who confirm)
- ✅ Monitor time-to-confirmation (how long it takes)
- ✅ Check email deliverability for confirmation emails
- ✅ Watch for users who never confirm (follow-up?)

---

## Integration with Existing Features

### Dashboard Access
Optionally require confirmation:

```typescript
// src/app/dashboard/page.tsx
import { requireAuth } from '@/lib/auth/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await requireAuth()

  // Optional: Redirect to confirmation page if not confirmed
  if (!user.emailConfirmed) {
    redirect('/confirm-email-required')
  }

  return <div>Dashboard content</div>
}
```

### Settings Page
Add email status:

```typescript
// Show confirmation status in user settings
<div>
  <label>Email Status</label>
  <div>
    {user.emailConfirmed ? (
      <span className="text-green-600">✓ Verified</span>
    ) : (
      <span className="text-yellow-600">⚠ Unverified</span>
    )}
  </div>
</div>
```

---

## Support Resources

- **Supabase Auth Docs:** [supabase.com/docs/guides/auth/auth-email-verification](https://supabase.com/docs/guides/auth/auth-email-verification)
- **Mailgun Setup:** See `docs/MAILGUN_SETUP.md`
- **Testing Guide:** See `docs/EMAIL_TESTING_GUIDE.md`

---

**Last Updated:** 2025-10-31
**Version:** 1.0.0
