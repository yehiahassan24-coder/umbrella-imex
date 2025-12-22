# 🚀 Production Deployment Checklist

## Pre-Deployment Security Hardening

### 1. Environment Variables
- [ ] **Copy `.env.example` to `.env.production`**
- [ ] **Update `DATABASE_URL`** to production PostgreSQL instance
  - Recommended: Supabase, Neon, Railway, or AWS RDS
  - Format: `postgresql://user:password@host:port/database?sslmode=require`
- [ ] **Generate new `JWT_SECRET`**
  ```bash
  openssl rand -base64 32
  ```
- [ ] **Configure SMTP** (for email notifications)
  - `SMTP_HOST`: Your email provider (e.g., smtp.gmail.com)
  - `SMTP_PORT`: Usually 587 or 465
  - `SMTP_USER`: Your email address
  - `SMTP_PASS`: App-specific password
  - `SMTP_FROM`: noreply@yourdomain.com
  - `ADMIN_EMAIL`: admin@yourdomain.com
- [ ] **Set `NODE_ENV=production`**
- [ ] **Add `NEXT_PUBLIC_APP_URL`** (your production domain)

### 2. Database Setup
- [ ] **Run Prisma migrations on production database**
  ```bash
  npx prisma migrate deploy
  ```
- [ ] **Seed initial Super Admin** (do NOT use setup endpoint)
  ```bash
  # Create a secure script or use Prisma Studio
  # Password should be strong and unique
  ```
- [ ] **Verify database connection** works from production environment

### 3. Security Hardening
- [ ] **Delete or disable `/api/setup` route**
  - Remove `src/app/api/setup/route.ts` OR
  - Add production guard at the top of the file
- [ ] **Change all default passwords**
  - Generate strong passwords for all initial users
  - Store securely (password manager)
- [ ] **Review CORS settings** if using separate frontend
- [ ] **Enable HTTPS** (handled by most platforms automatically)
- [ ] **Configure CSP headers** (optional but recommended)

### 4. Code Quality
- [ ] **Run production build test**
  ```bash
  npm run build
  ```
- [ ] **Fix any build warnings or errors**
- [ ] **Test production bundle locally**
  ```bash
  npm run start
  ```
- [ ] **Remove console.logs** from sensitive areas (optional)

---

## Deployment Options

### Option A: Vercel (Recommended - Easiest)
1. Push code to GitHub/GitLab
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

**Pros:** Zero-config, automatic HTTPS, global CDN
**Cons:** Serverless functions have cold starts

### Option B: Docker + VPS
1. Use provided `Dockerfile` and `docker-compose.yml`
2. Deploy to DigitalOcean, Linode, or AWS EC2
3. Configure reverse proxy (Nginx)
4. Set up SSL with Let's Encrypt

**Pros:** Full control, no cold starts
**Cons:** More maintenance required

### Option C: Railway / Render
1. Connect GitHub repository
2. Configure environment variables
3. Deploy with one click

**Pros:** Simple, good for small teams
**Cons:** Can be more expensive at scale

---

## Post-Deployment Smoke Test

### Critical Path Testing (5 minutes)

#### 1. Authentication
- [ ] Navigate to `https://yourdomain.com/admin`
- [ ] Login with Super Admin credentials
- [ ] Verify redirect to dashboard

#### 2. Dashboard
- [ ] Charts load correctly
- [ ] KPI cards show accurate data
- [ ] No console errors

#### 3. CRUD Operations
- [ ] **Products**: Create a test product
- [ ] **Inquiries**: Submit inquiry from public form
- [ ] **Users**: Create a test Editor account (if Super Admin)

#### 4. Permissions
- [ ] Login as Editor
- [ ] Verify `/admin/dashboard/users` is inaccessible
- [ ] Verify `/admin/dashboard/logs` is inaccessible
- [ ] Verify Products and Inquiries are accessible

#### 5. Audit Trail
- [ ] Login as Super Admin
- [ ] Navigate to Activity Logs
- [ ] Verify recent actions are logged

#### 6. Email Notifications (if configured)
- [ ] Submit a public inquiry
- [ ] Verify admin receives notification email
- [ ] Verify customer receives auto-reply

#### 7. Dark Mode
- [ ] Toggle theme
- [ ] Verify persistence after refresh

---

## Monitoring & Maintenance

### Post-Launch
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure uptime monitoring (UptimeRobot, Pingdom)
- [ ] Enable database backups (daily recommended)
- [ ] Document admin procedures for team
- [ ] Schedule regular security audits

### Performance
- [ ] Monitor database query performance
- [ ] Check for N+1 queries in Prisma
- [ ] Review server response times
- [ ] Optimize images if needed

---

## Rollback Plan

If issues arise:
1. Revert to previous deployment via platform dashboard
2. Check error logs for root cause
3. Fix in development environment
4. Re-deploy after testing

---

## Support Contacts

- **Database Issues**: Check provider status page
- **Email Issues**: Verify SMTP credentials
- **Build Failures**: Review build logs in platform dashboard

---

## Success Criteria

✅ All users can login
✅ All CRUD operations work
✅ Permissions are enforced correctly
✅ Audit logs are recording
✅ Email notifications are sending (if enabled)
✅ No console errors in production
✅ HTTPS is enabled
✅ Database is accessible and backed up

---

**Once all items are checked, you are PRODUCTION READY! 🎉**
