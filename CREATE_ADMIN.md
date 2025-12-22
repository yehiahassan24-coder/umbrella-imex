# Creating Your First Admin Account

## Method 1: Using Prisma Studio (Easiest)

### Step 1: Connect to Production Database
```bash
# Set your production database URL
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"

# Open Prisma Studio
npx prisma studio
```

### Step 2: Generate Password Hash
Before creating the user, you need to hash the password:

```bash
# Install bcryptjs if not already installed
npm install bcryptjs

# Generate password hash (run in Node.js)
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourStrongPassword123!', 10));"

# Example output:
# $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

### Step 3: Create User in Prisma Studio
1. Prisma Studio will open in your browser (http://localhost:5555)
2. Click on "User" model
3. Click "Add record"
4. Fill in:
   - **id**: (auto-generated, leave blank or use UUID)
   - **email**: `admin@yourdomain.com`
   - **password**: `$2a$10$...` (paste the hash from Step 2)
   - **role**: `SUPER_ADMIN`
   - **isActive**: `true`
   - **createdAt**: (auto-generated)
   - **updatedAt**: (auto-generated)
5. Click "Save 1 change"

---

## Method 2: Using SQL (Advanced)

### Step 1: Generate Password Hash
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourStrongPassword123!', 10));"
```

### Step 2: Connect to Database
```bash
# Using psql
psql "postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

### Step 3: Run SQL Insert
```sql
INSERT INTO "User" (
  id,
  email,
  password,
  role,
  "isActive",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'admin@yourdomain.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'SUPER_ADMIN',
  true,
  NOW(),
  NOW()
);
```

### Step 4: Verify Creation
```sql
SELECT id, email, role, "isActive" FROM "User";
```

---

## Method 3: Using API Setup Endpoint (Development Only)

**⚠️ WARNING**: This method only works in development mode and is disabled in production for security.

If you're still in development:

```bash
# Make sure NODE_ENV is not set to production
unset NODE_ENV

# Or set it to development
export NODE_ENV=development

# Restart your app
npm run dev

# Then visit:
# http://localhost:3000/api/setup
```

This will create a default admin account:
- Email: `admin@umbrella.com`
- Password: `admin123`

**IMPORTANT**: Change this password immediately after first login!

---

## Method 4: Using a Setup Script (Recommended for Production)

Create a one-time setup script:

### Step 1: Create setup.js
```javascript
// setup.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2] || 'admin@umbrella.com';
  const password = process.argv[3] || 'ChangeMe123!';

  // Check if admin already exists
  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing) {
    console.log('❌ User already exists:', email);
    process.exit(1);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true
    }
  });

  console.log('✅ Admin created successfully!');
  console.log('Email:', admin.email);
  console.log('Role:', admin.role);
  console.log('⚠️  Please change your password after first login!');

  await prisma.$disconnect();
}

createAdmin().catch(console.error);
```

### Step 2: Run the Script
```bash
# Set production database URL
export DATABASE_URL="your-production-database-url"

# Run script with custom credentials
node setup.js "your-email@domain.com" "YourStrongPassword123!"

# Or use defaults
node setup.js
```

### Step 3: Delete the Script
```bash
# After creating admin, delete the script for security
rm setup.js
```

---

## Password Requirements

For security, use a strong password with:
- ✅ At least 12 characters
- ✅ Mix of uppercase and lowercase
- ✅ Numbers
- ✅ Special characters (!@#$%^&*)
- ❌ No common words or patterns
- ❌ No personal information

**Example strong passwords:**
- `Tr0pic@lFru!t2024`
- `Exp0rt$Umbr3lla!`
- `Secur3#Admin2024`

---

## Verification Steps

After creating the admin account:

1. **Test Login**:
   - Go to: `https://your-app.vercel.app/admin`
   - Enter your email and password
   - Should redirect to dashboard

2. **Verify Permissions**:
   - Try accessing all dashboard sections
   - Create a test product
   - View audit logs (Super Admin only)

3. **Change Password** (if using default):
   - Go to Users page
   - Edit your account
   - Set a new strong password

---

## Troubleshooting

### "Invalid credentials" error
- Verify email is correct
- Ensure password was hashed with bcrypt
- Check `isActive` is set to `true`
- Verify `role` is `SUPER_ADMIN`

### "User not found" error
- Check database connection
- Verify user was actually created:
  ```sql
  SELECT * FROM "User" WHERE email = 'your-email@domain.com';
  ```

### Can't access Prisma Studio
- Ensure DATABASE_URL is set correctly
- Check database is accessible from your network
- Try using connection pooling URL instead

---

## Security Best Practices

✅ **DO**:
- Use unique, strong passwords
- Store credentials in a password manager
- Change default passwords immediately
- Enable 2FA (when implemented)
- Regularly rotate passwords

❌ **DON'T**:
- Use simple passwords like "admin123"
- Share admin credentials
- Store passwords in plain text
- Reuse passwords from other services
- Commit credentials to Git

---

## Next Steps

After creating your admin account:
1. ✅ Login to verify it works
2. ✅ Change password if using default
3. ✅ Create additional admin users if needed
4. ✅ Test all dashboard features
5. ✅ Review audit logs
