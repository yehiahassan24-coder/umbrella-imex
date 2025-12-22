# Deployment Troubleshooting Guide

## Common Issues & Solutions

---

## 🔴 Build Failures

### Issue: "Module not found" errors

**Symptoms**:
```
Error: Cannot find module 'bcryptjs'
Error: Cannot find module '@prisma/client'
```

**Solutions**:
```bash
# 1. Ensure all dependencies are in package.json
npm install

# 2. Verify package-lock.json is committed
git add package-lock.json
git commit -m "Add package-lock.json"
git push

# 3. Clear Vercel cache and redeploy
# In Vercel dashboard: Deployments → ••• → Redeploy
```

---

### Issue: "Prisma Client not generated"

**Symptoms**:
```
Error: @prisma/client did not initialize yet
```

**Solutions**:

**Option A**: Add postinstall script to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

**Option B**: Manually generate in Vercel:
1. Go to Settings → General
2. Build Command: `prisma generate && next build`
3. Redeploy

---

### Issue: TypeScript errors during build

**Symptoms**:
```
Type error: Property 'X' does not exist on type 'Y'
```

**Solutions**:
```bash
# 1. Fix locally first
npm run build

# 2. If you need to deploy urgently (NOT RECOMMENDED):
# Add to next.config.mjs:
typescript: {
  ignoreBuildErrors: true,
},

# 3. Better: Fix the actual type errors
```

---

## 🔴 Database Connection Issues

### Issue: "Can't reach database server"

**Symptoms**:
```
Error: P1001: Can't reach database server at `xxx.supabase.co`
```

**Solutions**:

1. **Check DATABASE_URL format**:
   ```bash
   # Correct format:
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
   
   # Common mistakes:
   # ❌ Missing ?sslmode=require
   # ❌ Wrong port (should be 5432 or 6543 for pooling)
   # ❌ Special characters in password not URL-encoded
   ```

2. **URL-encode special characters in password**:
   ```javascript
   // If password is: P@ss#word!
   // Encode as: P%40ss%23word%21
   ```

3. **Verify database is running**:
   - Check Supabase/Neon dashboard
   - Ensure project is not paused

4. **Test connection locally**:
   ```bash
   export DATABASE_URL="your-production-url"
   npx prisma db pull
   ```

---

### Issue: "Too many connections"

**Symptoms**:
```
Error: P1001: Too many connections
```

**Solutions**:

1. **Use connection pooling**:
   ```env
   # Supabase pooling URL (port 6543):
   DATABASE_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
   ```

2. **Reduce connection limit in Prisma**:
   ```javascript
   // src/lib/prisma.ts
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL,
       },
     },
     // Add connection pool settings
     pool: {
       max: 10,
       min: 2,
       idle: 10000,
     },
   });
   ```

3. **Use Prisma Data Proxy** (advanced):
   - https://www.prisma.io/docs/data-platform/data-proxy

---

## 🔴 Authentication Issues

### Issue: "Invalid credentials" after deployment

**Symptoms**:
- Login works locally but not in production
- "Invalid credentials" error

**Solutions**:

1. **Verify JWT_SECRET is set in Vercel**:
   - Go to Settings → Environment Variables
   - Ensure JWT_SECRET exists and matches

2. **Check cookie settings**:
   ```typescript
   // src/app/api/auth/login/route.ts
   // Ensure secure cookies in production:
   response.cookies.set('token', token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production', // ← Important
     sameSite: 'lax',
     maxAge: 60 * 60 * 24 * 7,
   });
   ```

3. **Verify user exists in production database**:
   ```bash
   export DATABASE_URL="production-url"
   npx prisma studio
   # Check User table
   ```

---

### Issue: "Session expired" immediately

**Symptoms**:
- Login successful but immediately logged out
- Infinite redirect loop

**Solutions**:

1. **Check domain/cookie mismatch**:
   - If using custom domain, ensure cookies are set for correct domain
   - Check browser DevTools → Application → Cookies

2. **Verify middleware**:
   ```typescript
   // src/middleware.ts
   // Ensure token verification is working
   console.log('Token:', token); // Debug in Vercel logs
   ```

3. **Check Vercel logs**:
   - Go to Deployments → View Function Logs
   - Look for authentication errors

---

## 🔴 Email Issues

### Issue: Emails not sending

**Symptoms**:
- No error, but emails don't arrive
- SMTP connection timeout

**Solutions**:

1. **Verify SMTP credentials**:
   ```bash
   # Test SMTP connection
   node -e "
   const nodemailer = require('nodemailer');
   const transport = nodemailer.createTransport({
     host: 'smtp.gmail.com',
     port: 587,
     auth: {
       user: 'your-email@gmail.com',
       pass: 'your-app-password'
     }
   });
   transport.verify().then(console.log).catch(console.error);
   "
   ```

2. **Gmail-specific**:
   - Use App Password, not regular password
   - Enable "Less secure app access" (not recommended)
   - Or use OAuth2 (better)

3. **Check environment variables**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587  # Not 465!
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-specific-password
   SMTP_FROM=noreply@yourdomain.com
   ADMIN_EMAIL=admin@yourdomain.com
   ```

4. **Check Vercel logs for errors**:
   - Deployments → Function Logs
   - Look for SMTP errors

---

### Issue: Emails go to spam

**Solutions**:

1. **Set up SPF record**:
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.google.com ~all
   ```

2. **Set up DKIM** (via email provider)

3. **Set up DMARC**:
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:admin@yourdomain.com
   ```

4. **Use reputable SMTP service**:
   - SendGrid
   - Resend
   - AWS SES

---

## 🔴 Environment Variable Issues

### Issue: Environment variables not working

**Symptoms**:
```
Error: process.env.DATABASE_URL is undefined
```

**Solutions**:

1. **Redeploy after adding variables**:
   - Environment variables only apply to NEW deployments
   - Go to Deployments → Redeploy

2. **Check variable names**:
   - Must match exactly (case-sensitive)
   - No extra spaces
   - No quotes around values in Vercel UI

3. **Client vs Server variables**:
   ```typescript
   // ❌ Won't work in client components:
   const secret = process.env.JWT_SECRET;
   
   // ✅ Use NEXT_PUBLIC_ prefix for client:
   const apiUrl = process.env.NEXT_PUBLIC_APP_URL;
   ```

4. **Verify in Vercel**:
   - Settings → Environment Variables
   - Check "Production" environment is selected

---

## 🔴 Performance Issues

### Issue: Slow page loads

**Solutions**:

1. **Enable caching**:
   ```typescript
   // In API routes:
   export const revalidate = 60; // Cache for 60 seconds
   ```

2. **Optimize images**:
   ```typescript
   import Image from 'next/image';
   
   <Image
     src="/image.jpg"
     width={500}
     height={300}
     alt="Description"
   />
   ```

3. **Use database connection pooling**

4. **Enable Vercel Analytics**:
   - Settings → Analytics → Enable

---

### Issue: Database queries are slow

**Solutions**:

1. **Add database indexes**:
   ```prisma
   model Product {
     id       String @id @default(uuid())
     name     String
     category String
     
     @@index([category]) // Add index
   }
   ```

2. **Optimize queries**:
   ```typescript
   // ❌ N+1 query problem:
   const products = await prisma.product.findMany();
   for (const product of products) {
     const category = await prisma.category.findUnique({
       where: { id: product.categoryId }
     });
   }
   
   // ✅ Use include:
   const products = await prisma.product.findMany({
     include: { category: true }
   });
   ```

3. **Use connection pooling** (see above)

---

## 🔴 Deployment Issues

### Issue: Deployment stuck or failing

**Solutions**:

1. **Check build logs**:
   - Deployments → Click on deployment → View Build Logs

2. **Increase build timeout**:
   - Pro plan: Up to 15 minutes
   - Free plan: 5 minutes max

3. **Clear cache and redeploy**:
   - Deployments → ••• → Redeploy → Clear cache

4. **Check for large files**:
   ```bash
   # Find large files
   find . -type f -size +10M
   
   # Add to .gitignore if needed
   ```

---

### Issue: "Function size exceeded"

**Symptoms**:
```
Error: Function size 50 MB exceeds the limit of 50 MB
```

**Solutions**:

1. **Optimize dependencies**:
   ```bash
   # Remove unused dependencies
   npm prune
   
   # Use production dependencies only
   npm ci --production
   ```

2. **Split large API routes**

3. **Upgrade to Pro plan** (250 MB limit)

---

## 🔴 SSL/HTTPS Issues

### Issue: "Your connection is not private"

**Solutions**:

1. **Wait for SSL provisioning**:
   - Takes 1-2 minutes after domain setup
   - Check Vercel → Domains → SSL status

2. **Verify domain configuration**:
   - DNS records must be correct
   - Check https://dnschecker.org

3. **Force HTTPS**:
   ```typescript
   // next.config.mjs
   async headers() {
     return [
       {
         source: '/(.*)',
         headers: [
           {
             key: 'Strict-Transport-Security',
             value: 'max-age=31536000; includeSubDomains'
           }
         ]
       }
     ]
   }
   ```

---

## 🔴 CORS Issues

### Issue: "CORS policy blocked"

**Solutions**:

```typescript
// src/app/api/[route]/route.ts
export async function GET(request: Request) {
  const response = NextResponse.json({ data: 'example' });
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

// Handle OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

---

## 🛠️ Debugging Tools

### 1. Vercel Logs
```bash
# Install Vercel CLI
npm i -g vercel

# View logs
vercel logs

# Follow logs in real-time
vercel logs --follow
```

### 2. Database Logs
```bash
# Supabase: Check logs in dashboard
# Neon: Query history in dashboard
```

### 3. Browser DevTools
- Network tab: Check API requests
- Console: Check for JavaScript errors
- Application → Cookies: Verify auth cookies

### 4. Test API Routes Directly
```bash
# Test with curl
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"test123"}'
```

---

## 📞 Getting Help

### Vercel Support
- Community: https://github.com/vercel/next.js/discussions
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support

### Database Support
- Supabase: https://supabase.com/docs
- Neon: https://neon.tech/docs
- Railway: https://docs.railway.app

### Next.js
- Documentation: https://nextjs.org/docs
- GitHub: https://github.com/vercel/next.js

---

## ✅ Health Check Checklist

Run through this after deployment:

- [ ] Website loads at production URL
- [ ] All pages are accessible
- [ ] Admin login works
- [ ] Dashboard loads correctly
- [ ] CRUD operations work (create, read, update, delete)
- [ ] Images load correctly
- [ ] Forms submit successfully
- [ ] Emails are sending
- [ ] SSL certificate is valid
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance is acceptable (< 3s load)
- [ ] Audit logs are recording
- [ ] Database queries are working
- [ ] Authentication persists across page loads

---

## 🚨 Emergency Rollback

If deployment breaks production:

```bash
# Option 1: Rollback in Vercel UI
# Deployments → Previous deployment → Promote to Production

# Option 2: Revert Git commit
git revert HEAD
git push origin main

# Option 3: Redeploy specific commit
# Deployments → Find working deployment → Redeploy
```

---

**Remember**: Most issues are related to environment variables or database configuration. Always check those first!
