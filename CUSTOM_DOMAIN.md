# Custom Domain Setup Guide

## Overview
By default, Vercel provides a free subdomain: `your-app.vercel.app`
This guide shows how to connect your own custom domain (e.g., `umbrella-import.com`)

---

## Prerequisites
- Domain name purchased (from Namecheap, GoDaddy, Google Domains, etc.)
- Vercel account with deployed project
- Access to domain DNS settings

---

## Step 1: Add Domain in Vercel

### 1.1 Navigate to Domain Settings
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `umbrella-import-export`
3. Click "Settings" tab
4. Click "Domains" in sidebar

### 1.2 Add Your Domain
1. Click "Add" button
2. Enter your domain:
   - For root domain: `umbrella-import.com`
   - For subdomain: `www.umbrella-import.com`
   - For both: Add both separately
3. Click "Add"

---

## Step 2: Configure DNS Records

Vercel will show you DNS records to add. There are two methods:

### Method A: Using Vercel Nameservers (Recommended - Easiest)

**Advantages**: Automatic SSL, fastest setup, managed by Vercel

1. Vercel will provide nameservers like:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

2. Go to your domain registrar (Namecheap, GoDaddy, etc.)

3. Find "Nameservers" or "DNS Settings"

4. Change from default to custom nameservers

5. Enter Vercel's nameservers

6. Save changes

7. Wait 24-48 hours for propagation (usually faster)

### Method B: Using A/CNAME Records (Manual)

**Use this if you want to keep your current nameservers**

#### For Root Domain (umbrella-import.com):
Add an **A Record**:
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

#### For WWW Subdomain (www.umbrella-import.com):
Add a **CNAME Record**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

---

## Step 3: Verify Domain

### 3.1 Check DNS Propagation
Use online tools to verify DNS changes:
- https://dnschecker.org
- https://www.whatsmydns.net

Enter your domain and check if it points to Vercel's servers.

### 3.2 Verify in Vercel
1. Go back to Vercel → Settings → Domains
2. Your domain should show "Valid Configuration" ✅
3. SSL certificate will be automatically issued (takes 1-2 minutes)

---

## Step 4: Set Primary Domain

### 4.1 Choose Primary Domain
If you added both `umbrella-import.com` and `www.umbrella-import.com`:

1. In Vercel Domains settings
2. Click the three dots (•••) next to your preferred domain
3. Select "Set as Primary"
4. Other domains will automatically redirect to primary

**Recommendation**: Use `www.umbrella-import.com` as primary (better for SEO)

---

## Step 5: Update Environment Variables

### 5.1 Update App URL
1. Go to Vercel → Settings → Environment Variables
2. Find `NEXT_PUBLIC_APP_URL`
3. Update to: `https://umbrella-import.com` (or your domain)
4. Click "Save"

### 5.2 Update Email Configuration
If using custom domain for emails:
1. Update `SMTP_FROM` to: `noreply@umbrella-import.com`
2. Update `ADMIN_EMAIL` to: `admin@umbrella-import.com`
3. Redeploy for changes to take effect

### 5.3 Trigger Redeploy
1. Go to Deployments tab
2. Click "Redeploy" on latest deployment
3. Or push a new commit to trigger auto-deploy

---

## Step 6: Configure Email Domain (Optional)

To send emails from your domain (e.g., `noreply@umbrella-import.com`):

### Option A: Using Gmail with Custom Domain
1. Set up Google Workspace (paid) or Gmail with custom domain
2. Use SMTP settings:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=noreply@umbrella-import.com
   SMTP_PASS=<app-specific-password>
   ```

### Option B: Using SendGrid (Recommended)
1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Verify your domain
3. Add DNS records for domain authentication
4. Use SMTP settings:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=<your-sendgrid-api-key>
   ```

### Option C: Using Resend (Modern Alternative)
1. Sign up at https://resend.com (free tier: 3,000 emails/month)
2. Verify domain
3. Add DNS records
4. Use their API or SMTP

---

## Step 7: SSL Certificate

### Automatic SSL (Vercel)
- ✅ Automatically issued by Vercel
- ✅ Auto-renews every 90 days
- ✅ Supports wildcard certificates
- ✅ No configuration needed

### Verify SSL
1. Visit your domain: `https://umbrella-import.com`
2. Check for padlock icon 🔒 in browser
3. Click padlock → Certificate should be valid

---

## Step 8: Redirect Configuration

### Redirect WWW to Root (or vice versa)
Already handled by Vercel when you set primary domain!

### Redirect HTTP to HTTPS
Automatic with Vercel - all HTTP requests redirect to HTTPS.

### Custom Redirects (Optional)
Add to `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ]
  },
}

export default nextConfig;
```

---

## Common Domain Registrars - DNS Setup

### Namecheap
1. Login → Domain List → Manage
2. Advanced DNS tab
3. Add A/CNAME records
4. Or change nameservers under "Nameservers" section

### GoDaddy
1. Login → My Products → DNS
2. Add records or change nameservers
3. Save changes

### Google Domains
1. Login → My Domains → DNS
2. Custom records section
3. Add A/CNAME records

### Cloudflare
1. Login → Select domain
2. DNS tab
3. Add records
4. Ensure proxy is disabled (gray cloud) for Vercel

---

## Troubleshooting

### Domain not working after 24 hours
- Check DNS propagation: https://dnschecker.org
- Verify DNS records are correct
- Clear browser cache
- Try incognito/private mode

### SSL certificate error
- Wait a few minutes for certificate issuance
- Verify domain is correctly configured in Vercel
- Check that DNS is propagating

### "Too many redirects" error
- If using Cloudflare, disable proxy (gray cloud)
- Check for conflicting redirect rules
- Verify SSL/TLS mode is "Full" in Cloudflare

### Emails not sending from custom domain
- Verify SPF, DKIM, DMARC records
- Check SMTP credentials
- Test with a simple email first
- Check spam folder

---

## Domain Costs

### Domain Registration
- .com: $10-15/year
- .net: $12-15/year
- .io: $30-40/year
- .co: $20-30/year

**Recommended Registrars**:
- Namecheap (affordable, good UI)
- Google Domains (simple, reliable)
- Cloudflare (cheapest, at-cost pricing)

### Email Services
- Gmail/Google Workspace: $6/user/month
- SendGrid: Free (100/day) → $15/month (40k/month)
- Resend: Free (3k/month) → $20/month (50k/month)

---

## Best Practices

✅ **DO**:
- Use HTTPS (automatic with Vercel)
- Set up email authentication (SPF, DKIM)
- Enable DNSSEC if available
- Use www or non-www consistently
- Monitor domain expiration
- Enable auto-renewal

❌ **DON'T**:
- Mix HTTP and HTTPS
- Forget to renew domain
- Use unverified email domains
- Disable SSL
- Use too many redirects

---

## Security Enhancements

### 1. Enable DNSSEC
Protects against DNS spoofing:
- Available in domain registrar settings
- Adds cryptographic signatures to DNS records

### 2. CAA Records
Specify which Certificate Authorities can issue certificates:
```
Type: CAA
Name: @
Value: 0 issue "letsencrypt.org"
```

### 3. Security Headers
Already configured in Next.js, but verify:
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options

---

## Testing Checklist

After domain setup:
- [ ] Domain resolves correctly
- [ ] SSL certificate is valid
- [ ] WWW redirects to non-WWW (or vice versa)
- [ ] HTTP redirects to HTTPS
- [ ] All pages load correctly
- [ ] Admin login works
- [ ] Emails send from custom domain
- [ ] No mixed content warnings
- [ ] Mobile-friendly
- [ ] Fast load times

---

## Next Steps

1. ✅ Configure domain
2. ✅ Verify SSL
3. ✅ Update environment variables
4. ✅ Test all functionality
5. ✅ Set up email domain
6. ✅ Monitor analytics
7. ✅ Share with stakeholders!

**Your professional platform is now live on your custom domain! 🎉**
