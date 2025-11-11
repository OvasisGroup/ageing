# Email Deliverability Guide

## Why Emails Go to Spam

1. **Missing SPF/DKIM/DMARC records**
2. **No reverse DNS (rDNS) setup**
3. **Shared hosting IP with poor reputation**
4. **Suspicious content or subject lines**
5. **High spam complaint rate**

## Immediate Fixes

### 1. Update DNS Records (Critical)

Log into your domain registrar (where mynestshield.com is hosted) and add these DNS records:

#### SPF Record
```
Type: TXT
Name: @
Value: v=spf1 include:server218.web-hosting.com ~all
TTL: 3600
```

#### DMARC Record
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:info@mynestshield.com
TTL: 3600
```

### 2. Enable DKIM

Contact your hosting provider (server218.web-hosting.com) and ask them to:
1. Enable DKIM for info@mynestshield.com
2. Provide you with the DKIM DNS record to add

Usually looks like:
```
Type: TXT
Name: default._domainkey
Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA...
```

### 3. Verify Your Domain

Check your email authentication setup:
- **MXToolbox**: https://mxtoolbox.com/SuperTool.aspx?action=spf:mynestshield.com
- **Mail Tester**: https://www.mail-tester.com/ (send a test email here)

## Email Template Best Practices

✅ **Good Practices** (Already Implemented):
- Plain text alternative included
- Professional HTML using tables (better email client support)
- Clear sender name "MyNestShield"
- Branded subject line without spam triggers
- Footer with company info and year
- Clear call-to-action

❌ **Avoid These**:
- Words like "FREE", "URGENT", "WINNER", "CLICK HERE"
- Excessive exclamation marks!!!
- ALL CAPS SUBJECT LINES
- Too many links
- Large images without text

## Additional Improvements

### 4. Warm Up Your Email Domain

If this is a new domain or you haven't sent many emails:
1. Start by sending to verified emails only
2. Gradually increase volume over 2-4 weeks
3. Monitor bounce and complaint rates

### 5. Email Reputation Monitoring

Monitor your sending reputation:
- **Google Postmaster**: https://postmaster.google.com/ (for Gmail deliverability)
- **Microsoft SNDS**: https://sendersupport.olc.protection.outlook.com/snds/
- **Sender Score**: https://www.senderscore.org/

### 6. Consider Using a Dedicated Email Service

For production, consider using:
- **SendGrid** (Free tier: 100 emails/day)
- **Mailgun** (Free tier: 1000 emails/month)
- **Amazon SES** (Very cheap, $0.10 per 1000 emails)
- **Resend** (Free tier: 3000 emails/month)

These services have:
- ✅ Pre-warmed IP addresses
- ✅ Automatic SPF/DKIM/DMARC
- ✅ Better deliverability rates
- ✅ Email analytics
- ✅ Bounce handling

### 7. Test Your Emails

Before going live:
1. Send test emails to multiple providers:
   - Gmail (personal)
   - Outlook/Hotmail
   - Yahoo
   - ProtonMail
2. Check if they land in inbox or spam
3. Use https://www.mail-tester.com/ for a spam score

## Quick Wins

### Update Subject Line (Already Done)
Changed from "Verify Your Email - OTP Code" to "Verify Your Email Address"
(Removed "OTP" which can trigger spam filters)

### Add High Priority Header (Already Done)
```javascript
headers: {
  'X-Priority': '1',
  'X-MSMail-Priority': 'High',
  'Importance': 'high',
}
```

### Professional HTML Template (Already Done)
Using table-based layout for better email client compatibility

## For Gmail Users

If your users have Gmail, tell them to:
1. Check their Spam/Junk folder
2. Mark the email as "Not Spam"
3. Add info@mynestshield.com to contacts

## Current Status

✅ Email template improved with professional design
✅ Spam-trigger words removed from subject
✅ High priority headers added
✅ Plain text alternative included
✅ Professional footer with company branding

🔄 Pending:
- [ ] Add SPF record to DNS
- [ ] Enable DKIM with hosting provider
- [ ] Add DMARC record
- [ ] Test with mail-tester.com
- [ ] Consider switching to dedicated email service (SendGrid/Resend)

## Testing Now

1. Register a new test user
2. Check if email arrives in inbox or spam
3. Run the email through https://www.mail-tester.com/
4. Look for DNS authentication warnings

Target Score: 8/10 or higher on mail-tester.com
