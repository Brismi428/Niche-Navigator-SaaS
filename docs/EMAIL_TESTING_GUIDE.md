# Email Testing Quick Reference

Fast testing procedures for Mailgun SMTP integration with Supabase authentication.

---

## Quick Test (5 Minutes)

### 1. Start Local Server
```bash
npm run dev
```

### 2. Test Password Reset
1. Navigate to: `http://localhost:3000/login`
2. Click **"Forgot password?"**
3. Enter your email address
4. Click **"Send Reset Link"**
5. Check email (and spam folder!)
6. Click **"Reset Password"** button in email
7. Enter new password twice
8. Click **"Reset Password"**
9. Verify redirect to dashboard

### 3. Check Mailgun Logs
- Go to: [https://app.mailgun.com/app/sending/logs](https://app.mailgun.com/app/sending/logs)
- Verify status: **Delivered**
- Delivery time: < 5 seconds

✅ **Success:** Email arrives in < 30 seconds with branded template

---

## Comprehensive Test (30 Minutes)

### Test Matrix

| Test Case | Expected Result | Pass/Fail |
|-----------|----------------|-----------|
| **1. Valid Email** | Email arrives in inbox | ⬜ |
| **2. Spam Check** | Email NOT in spam folder | ⬜ |
| **3. Sender Display** | Shows "Niche Navigator" | ⬜ |
| **4. Template Branding** | Uses custom HTML template | ⬜ |
| **5. Link Works** | Redirects to /reset-password | ⬜ |
| **6. Token Valid** | Shows password form | ⬜ |
| **7. Password Reset** | Successfully updates password | ⬜ |
| **8. Auto Login** | Redirects to dashboard | ⬜ |
| **9. New Password Works** | Can log in with new password | ⬜ |
| **10. Old Password Fails** | Cannot log in with old password | ⬜ |

### Edge Cases

| Test Case | Expected Result | Pass/Fail |
|-----------|----------------|-----------|
| **1. Invalid Email** | Shows success (security) | ⬜ |
| **2. Expired Token (>1hr)** | Shows error message | ⬜ |
| **3. Reused Token** | Shows error message | ⬜ |
| **4. Multiple Requests** | Only newest link works | ⬜ |
| **5. Password Too Short** | Shows validation error | ⬜ |
| **6. Passwords Don't Match** | Shows validation error | ⬜ |

---

## Email Provider Testing

Test deliverability across major providers:

### Gmail
```
Test Email: your-email@gmail.com
Location: Inbox / Promotions / Spam?
Spam Score: ___ /10 (use mail-tester.com)
```

### Outlook/Hotmail
```
Test Email: your-email@outlook.com
Location: Inbox / Junk?
Delivery Time: ___ seconds
```

### Yahoo Mail
```
Test Email: your-email@yahoo.com
Location: Inbox / Spam?
Delivery Time: ___ seconds
```

### Custom Domain
```
Test Email: you@yourdomain.com
Location: Inbox / Spam?
Delivery Time: ___ seconds
```

---

## Mailgun Dashboard Checklist

### Before Testing
- [ ] Domain status: **Verified** (green checkmark)
- [ ] SMTP credentials: Retrieved and saved
- [ ] Sender email: Configured (e.g., noreply@nichenavigator.com)
- [ ] DNS records: All configured (SPF, DKIM, MX)

### During Testing
- [ ] Go to: **Sending** → **Logs**
- [ ] Find your test email in the list
- [ ] Status shows: **Delivered**
- [ ] Delivery time: < 5 seconds
- [ ] No errors or warnings

### After Testing
- [ ] Bounce rate: 0% (no bounces on test emails)
- [ ] Complaint rate: 0% (no spam reports)
- [ ] Delivery rate: 100%
- [ ] No failed deliveries

---

## Supabase Dashboard Checklist

### SMTP Settings
- [ ] Navigate to: **Authentication** → **Settings**
- [ ] Custom SMTP: **Enabled** (toggle ON)
- [ ] Sender email: `noreply@nichenavigator.com`
- [ ] Sender name: `Niche Navigator`
- [ ] Host: `smtp.mailgun.org`
- [ ] Port: `587`
- [ ] Username: `postmaster@your-domain.mailgun.org`
- [ ] Password: [configured]
- [ ] Settings saved successfully

### Email Templates
- [ ] Navigate to: **Authentication** → **Email Templates**
- [ ] Reset Password template: Customized with branding
- [ ] Subject line: Branded
- [ ] HTML template: Responsive design
- [ ] Variables included: `{{ .ConfirmationURL }}`
- [ ] Template saved successfully

### Redirect URLs
- [ ] Site URL: `http://localhost:3000` (dev) or production URL
- [ ] Redirect URLs include:
  - `http://localhost:3000/**`
  - `https://nichenavigator.com/**`
  - `https://*.vercel.app/**`
- [ ] Settings saved successfully

---

## Debugging Flowchart

```
Email not arriving?
│
├─ Check spam folder
│  └─ Found? → Mark as "Not Spam"
│
├─ Check Mailgun logs
│  ├─ Status: Delivered → Check email provider filtering
│  ├─ Status: Failed → Check error message
│  └─ Not found → Check Supabase SMTP settings
│
├─ Test with different email
│  └─ Works? → Original email has issue
│
└─ Check SMTP configuration
   ├─ Verify credentials
   ├─ Check domain verification
   └─ Try regenerating SMTP password
```

---

## Common Issues & Quick Fixes

### Issue: Email in spam folder
**Fix:**
1. Check spam score at mail-tester.com
2. Verify DNS records (SPF, DKIM)
3. Ask recipient to whitelist sender

### Issue: Email delayed (>1 min)
**Fix:**
1. Check Mailgun account limits
2. Verify not in email greylisting
3. Check Mailgun server status

### Issue: Reset link doesn't work
**Fix:**
1. Check URL has `?code=` parameter
2. Verify redirect URLs in Supabase
3. Check token not expired (< 1 hour)

### Issue: SMTP connection error
**Fix:**
1. Verify credentials in Supabase
2. Try regenerating Mailgun password
3. Check port number (use 587)

---

## Production Deployment Checklist

Before going live:

### Mailgun Configuration
- [ ] Domain fully verified (all DNS records)
- [ ] Sender email uses production domain
- [ ] SMTP credentials saved securely
- [ ] Email templates finalized
- [ ] Sending limits appropriate for expected volume

### Supabase Configuration
- [ ] Production project SMTP settings configured
- [ ] Site URL updated to production domain
- [ ] Redirect URLs include production domain
- [ ] Email templates match staging/dev
- [ ] Test email sent from production

### Testing
- [ ] Password reset tested on production
- [ ] Email arrives in < 30 seconds
- [ ] Template displays correctly (mobile + desktop)
- [ ] Links point to production domain
- [ ] Tested on Gmail, Outlook, Yahoo
- [ ] Spam score: 8/10 or higher
- [ ] Mailgun logs show successful delivery

### Monitoring
- [ ] Mailgun alerts configured
- [ ] Bounce rate monitoring enabled
- [ ] Spam complaint alerts enabled
- [ ] Usage limit warnings set up

---

## Performance Benchmarks

### Email Delivery Times (Target)
- **Excellent:** < 5 seconds
- **Good:** 5-30 seconds
- **Acceptable:** 30-60 seconds
- **Poor:** > 60 seconds (investigate)

### Spam Scores (Mail-Tester)
- **Excellent:** 9-10/10
- **Good:** 8-8.9/10
- **Acceptable:** 7-7.9/10
- **Poor:** < 7/10 (fix DNS/content)

### Delivery Rates (Target)
- **Excellent:** > 99%
- **Good:** 95-99%
- **Acceptable:** 90-95%
- **Poor:** < 90% (investigate)

### Bounce Rates (Target)
- **Excellent:** < 2%
- **Good:** 2-5%
- **Acceptable:** 5-10%
- **Poor:** > 10% (clean email list)

---

## Testing Commands

### Start development server
```bash
npm run dev
```

### Check if server is running
```bash
curl http://localhost:3000
```

### View application logs
Check terminal where `npm run dev` is running for error messages.

---

## Useful Links

- **Mailgun Dashboard:** [https://app.mailgun.com](https://app.mailgun.com)
- **Mailgun Logs:** [https://app.mailgun.com/app/sending/logs](https://app.mailgun.com/app/sending/logs)
- **Supabase Dashboard:** [https://supabase.com/dashboard](https://supabase.com/dashboard)
- **Mail-Tester:** [https://www.mail-tester.com](https://www.mail-tester.com)
- **Local App:** [http://localhost:3000](http://localhost:3000)
- **Login Page:** [http://localhost:3000/login](http://localhost:3000/login)
- **Forgot Password:** [http://localhost:3000/forgot-password](http://localhost:3000/forgot-password)

---

## Emergency Troubleshooting

### If emails completely stop working:

1. **Check Mailgun account status**
   - Log into Mailgun dashboard
   - Look for suspension notices
   - Verify billing is current

2. **Check Supabase status**
   - Visit: [status.supabase.com](https://status.supabase.com)
   - Check for service disruptions

3. **Verify SMTP credentials**
   - Regenerate password in Mailgun
   - Update in Supabase SMTP settings
   - Save and test again

4. **Check domain verification**
   - Mailgun → Domains → Your domain
   - Should show "Verified"
   - If not, re-verify DNS records

5. **Test with curl** (advanced)
```bash
curl --url 'smtps://smtp.mailgun.org:465' \
  --ssl-reqd \
  --mail-from 'noreply@nichenavigator.com' \
  --mail-rcpt 'test@example.com' \
  --user 'postmaster@your-domain.mailgun.org:your-password' \
  -T message.txt
```

---

## Support

If you encounter issues not covered in this guide:

1. **Review full documentation:** `docs/MAILGUN_SETUP.md`
2. **Check Mailgun support:** [https://help.mailgun.com](https://help.mailgun.com)
3. **Check Supabase support:** [https://supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)

---

**Last Updated:** 2025-10-31
**Version:** 1.0.0
