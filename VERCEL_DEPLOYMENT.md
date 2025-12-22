# 🚀 Vercel Deployment Guide - Umbrella Import & Export

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- Production PostgreSQL database (Supabase, Neon, or Railway)

---

## Step 1: Prepare Your Code for Deployment

### 1.1 Create Production Environment File
```bash
# Create .env.production (DO NOT commit this file)
cp .env.example .env.production
```

### 1.2 Update .env.production with Production Values
```env
# Database - Use your production PostgreSQL URL
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Security - Generate a new secret
JWT_SECRET="<run: openssl rand -base64 32>"

# Environment
NODE_ENV="production"

# SMTP Configuration (Optional but recommended)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-specific-password"
SMTP_FROM="noreply@umbrella-import.com"
ADMIN_EMAIL="admin@umbrella-import.com"

# App URL (will be provided by Vercel)
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

### 1.3 Security Hardening Checklist
- [ ] Generate new JWT_SECRET: `openssl rand -base64 32`
- [ ] Verify .gitignore includes `.env*` files
- [ ] Remove or disable `/api/setup` endpoint (already protected)
- [ ] Plan to change default passwords after first deployment

---

## Step 2: Set Up Production Database

### Option A: Supabase (Recommended - Free Tier)
1. Go to https://supabase.com
2. Create a new project
3. Copy the connection string from Settings → Database
4. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

### Option B: Neon (Serverless PostgreSQL)
1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string
4. Enable connection pooling for better performance

### Option C: Railway
1. Go to https://railway.app
2. Create a new PostgreSQL database
3. Copy the connection string from variables

---

## Step 3: Push Code to GitHub

### 3.1 Initialize Git (if not already done)
```bash
cd /home/voldmort/Desktop/Umbrellaimport/umbrella-app

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Production ready"
```

### 3.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (e.g., "umbrella-import-export")
3. **DO NOT** initialize with README (you already have one)

### 3.3 Push to GitHub
```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/umbrella-import-export.git

# Push code
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Vercel

### 4.1 Sign Up / Login to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub account
3. Authorize Vercel to access your repositories

### 4.2 Import Project
1. Click "Add New Project"
2. Select your GitHub repository
3. Vercel will auto-detect Next.js configuration

### 4.3 Configure Environment Variables
**IMPORTANT**: Add these in Vercel dashboard before deploying:

```
DATABASE_URL = postgresql://...
JWT_SECRET = <your-generated-secret>
NODE_ENV = production
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = your-email@gmail.com
SMTP_PASS = your-app-password
SMTP_FROM = noreply@umbrella-import.com
ADMIN_EMAIL = admin@umbrella-import.com
```

### 4.4 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Vercel will provide a URL: `https://your-app.vercel.app`

---

## Step 5: Run Database Migrations

### 5.1 Install Vercel CLI (Optional but recommended)
```bash
npm i -g vercel
```

### 5.2 Run Migrations on Production Database
```bash
# Set DATABASE_URL to production
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy

# Verify
npx prisma studio
```

---

## Step 6: Create Production Admin Account

### Option A: Using Prisma Studio
```bash
# Connect to production database
export DATABASE_URL="your-production-database-url"

# Open Prisma Studio
npx prisma studio

# Manually create user:
# - Email: admin@yourdomain.com
# - Password: <hash using bcrypt online tool>
# - Role: SUPER_ADMIN
# - isActive: true
```

### Option B: Using SQL (More Secure)
```sql
-- Generate password hash first using Node.js:
-- node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YOUR_STRONG_PASSWORD', 10));"

INSERT INTO "User" (id, email, password, role, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@yourdomain.com',
  '$2a$10$...', -- Your bcrypt hash here
  'SUPER_ADMIN',
  true,
  NOW(),
  NOW()
);
```

---

## Step 7: Post-Deployment Testing

### 7.1 Critical Path Test
1. **Visit your site**: `https://your-app.vercel.app`
2. **Test public pages**: Home, About, Products, Contact
3. **Test admin login**: `https://your-app.vercel.app/admin`
4. **Verify dashboard loads**: Charts, KPIs, navigation
5. **Test CRUD operations**: Create a product, submit an inquiry
6. **Check permissions**: Login as different roles
7. **Verify emails**: Submit inquiry, check notifications

### 7.2 Security Verification
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Admin login works
- [ ] JWT authentication is working
- [ ] Role-based access is enforced
- [ ] Setup endpoint is disabled in production

---

## Step 8: Configure Custom Domain (Optional)

### 8.1 Add Domain in Vercel
1. Go to Project Settings → Domains
2. Add your domain (e.g., umbrella-import.com)
3. Follow DNS configuration instructions

### 8.2 Update Environment Variables
```env
NEXT_PUBLIC_APP_URL="https://umbrella-import.com"
SMTP_FROM="noreply@umbrella-import.com"
```

---

## Step 9: Enable Monitoring

### 9.1 Vercel Analytics (Built-in)
- Automatically enabled
- View in Vercel dashboard

### 9.2 Error Tracking (Optional - Sentry)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 9.3 Uptime Monitoring
- Use UptimeRobot (free): https://uptimerobot.com
- Monitor: `https://your-app.vercel.app/api/health`

---

## Step 10: Ongoing Maintenance

### 10.1 Regular Updates
```bash
# Pull latest changes
git pull origin main

# Push updates
git add .
git commit -m "Update: description"
git push origin main

# Vercel auto-deploys on push
```

### 10.2 Database Backups
- Supabase: Automatic daily backups
- Neon: Point-in-time recovery
- Railway: Manual backups in dashboard

### 10.3 Security Updates
```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Test locally
npm run build
npm run start
```

---

## 🔒 Security Best Practices

### DO:
✅ Use strong, unique passwords
✅ Enable 2FA on GitHub and Vercel
✅ Rotate JWT_SECRET periodically
✅ Monitor audit logs regularly
✅ Keep dependencies updated
✅ Use environment variables for secrets

### DON'T:
❌ Commit .env files to Git
❌ Use default passwords in production
❌ Share admin credentials
❌ Disable HTTPS
❌ Expose database credentials
❌ Leave setup endpoint accessible

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm run build  # Test locally first
npx prisma generate  # Regenerate Prisma client
```

### Database Connection Issues
- Verify DATABASE_URL format
- Check database is accessible from Vercel (whitelist IPs if needed)
- Ensure SSL mode is enabled: `?sslmode=require`

### Environment Variables Not Working
- Redeploy after adding/changing variables
- Check variable names match exactly
- Verify no extra spaces in values

---

## 📊 Success Metrics

Your deployment is successful when:
- ✅ Public website loads at your Vercel URL
- ✅ Admin can login and access dashboard
- ✅ All CRUD operations work
- ✅ Email notifications are sending
- ✅ Audit logs are recording
- ✅ No console errors
- ✅ HTTPS is enabled
- ✅ Performance is acceptable (< 3s load time)

---

## 🎉 You're Live!

Your Umbrella Import & Export platform is now publicly accessible and secure!

**Next Steps:**
1. Share the URL with stakeholders
2. Monitor analytics and error logs
3. Gather user feedback
4. Plan future enhancements

**Support:**
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
