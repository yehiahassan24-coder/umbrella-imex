# Database Setup Guide - Supabase

## Step-by-Step Instructions

### 1. Create Supabase Account
1. Go to: https://supabase.com/dashboard/sign-up
2. Sign up with GitHub (recommended) or email
3. Verify your email if required

### 2. Create New Project
1. Click "New Project"
2. Fill in:
   - **Name**: umbrella-import-export
   - **Database Password**: Generate a strong password (SAVE THIS!)
   - **Region**: Choose closest to your users (e.g., US East, EU West)
   - **Pricing Plan**: Free (sufficient for starting)
3. Click "Create new project"
4. Wait 2-3 minutes for database to provision

### 3. Get Connection String
1. Go to Project Settings (gear icon) → Database
2. Scroll to "Connection string"
3. Select "URI" tab
4. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with the password you set in step 2

### 4. Enable Connection Pooling (Recommended)
1. In the same Database settings page
2. Find "Connection pooling"
3. Copy the "Connection string" with pooling:
   ```
   postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
4. This URL is better for serverless (Vercel) deployments

### 5. Configure Database Access
1. Go to Project Settings → Database → Connection pooling
2. Mode: "Transaction" (recommended for Prisma)
3. Pool Size: 15 (default is fine)

### 6. Test Connection (Optional)
```bash
# Install PostgreSQL client (if not already installed)
# Ubuntu/Debian:
sudo apt-get install postgresql-client

# macOS:
brew install postgresql

# Test connection
psql "postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"

# If successful, you'll see:
# postgres=>

# Type \q to exit
```

---

## Alternative: Neon (Serverless PostgreSQL)

If you prefer Neon instead:

1. Go to: https://console.neon.tech/signup
2. Sign up with GitHub
3. Create new project: "umbrella-import-export"
4. Copy connection string from dashboard
5. Enable connection pooling (automatic)

---

## Save Your Credentials Securely

**IMPORTANT**: Save these in a password manager:
- Database Password
- Connection String (URI)
- Connection String (Pooled)
- Supabase Project URL
- Supabase API Keys (for future use)

---

## Next Steps

Once you have your connection string:
1. ✅ Add it to Vercel environment variables
2. ✅ Run database migrations
3. ✅ Create your first admin user
