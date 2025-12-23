# 🚀 Umbrella Production Go-Live Checklist

Follow these steps exactly to launch the platform with professional stability and security.

## Phase 1: Environment & Secrets (Vercel Setup)
In **Vercel -> Project -> Settings -> Environment Variables**, add the following:

| Key | Value | Purpose |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enforces secure logic |
| `DATABASE_URL` | `postgresql://user:pass@host:port/db` | Your production DB |
| `JWT_SECRET` | `(Generate 64-char string)` | Authentication security |
| `JWT_ISSUER` | `umbrella-platform` | JWT Validation |
| `JWT_AUDIENCE` | `umbrella-admin` | JWT Validation |
| `UPLOAD_STORAGE_TYPE` | `s3` | Enables Cloud Storage |

### Cloud Storage (AWS S3 / Cloudflare R2)
*If using S3 for images:*
- `AWS_ACCESS_KEY_ID`: Your IAM access key
- `AWS_SECRET_ACCESS_KEY`: Your IAM secret
- `AWS_BUCKET_NAME`: Your bucket name
- `AWS_REGION`: e.g., `us-east-1`
- `AWS_S3_PUBLIC_URL`: (Optional) Your CDN or custom domain URL

## Phase 2: Database & Infrastructure
1. **Provision DB**: Use Neon, Supabase, or AWS RDS with **SSL enabled**.
2. **Migrate**: Run `npx prisma migrate deploy` locally pointing to production DB.
3. **Verify**: Open `npx prisma studio` with production URL to verify tables.

## Phase 3: Domain & DNS
1. **Vercel**: Add `umbrella-import.com` and `www.umbrella-import.com`.
2. **DNS**:
   - `A` record `@` -> Vercel IP
   - `CNAME` record `www` -> `cname.vercel-dns.com`
3. **SSL**: Automatic via Vercel.

## Phase 4: Final Verification (Smoke Test)
Run these checks on the **LIVE** URL:
- [ ] **Auth**: Log in as Admin. Verify success.
- [ ] **Revocation**: Log out. Verify the cookie is cleared.
- [ ] **Inquiry**: Submit a contact form. Verify it appears in the Admin Dashboard.
- [ ] **Products**: Upload a product image. Verify it saves to S3 and displays correctly.
- [ ] **Health**: Visit `/api/health`. Verify it returns `{"status":"HEALTHY"}`.
- [ ] **Legal**: Visit `/privacy` and `/terms`. Verify they load.

## Phase 5: Monitoring
1. **Uptime**: Add `/api/health` to UptimeRobot (1m interval).
2. **Errors**: Connect Sentry for automatic error reporting.

---
**Launch Status**: Technical implementation complete. Ready for Vercel Import.
