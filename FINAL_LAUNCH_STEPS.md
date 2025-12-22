# 🏁 FINAL STEPS BEFORE PUBLIC LAUNCH

**Platform**: Umbrella Import & Export  
**Version**: Production v1.0  
**Date**: December 23, 2025  

---

## 1️⃣ LOCAL MANUAL TESTING (30-60 minutes)

### Prerequisites
- ✅ Local server running: `npm run dev`
- ✅ Local database with test data
- ✅ Browser DevTools open (F12)

---

### Test 1: Authentication & Roles

#### A. Create Test Users (if not already created)

```bash
# Option 1: Use setup endpoint (development only)
# Visit: http://localhost:3000/api/setup
# This creates:
# - super@umbrella.com (SUPER_ADMIN)
# - admin@umbrella.com (ADMIN)
# - editor@umbrella.com (EDITOR)
# Default password: admin123

# Option 2: Use admin creation script
export DATABASE_URL="your-local-database-url"
node scripts/create-admin.js super@test.com TestPassword123!
node scripts/create-admin.js admin@test.com TestPassword123!
node scripts/create-admin.js editor@test.com TestPassword123!
```

#### B. Test Login for Each Role

**Super Admin Test**:
- [ ] Login: http://localhost:3000/admin
- [ ] Email: `super@umbrella.com` / Password: `admin123`
- [ ] Should redirect to `/admin/dashboard`
- [ ] Verify all menu items visible: Dashboard, Products, Inquiries, Users, Activity Logs

**Admin Test**:
- [ ] Logout and login as `admin@umbrella.com`
- [ ] Verify menu: Dashboard, Products, Inquiries (NO Users, NO Activity Logs)
- [ ] Try accessing `/admin/dashboard/users` directly
- [ ] Should redirect to dashboard (403)

**Editor Test**:
- [ ] Logout and login as `editor@umbrella.com`
- [ ] Verify menu: Dashboard, Products only (NO Inquiries, NO Users)
- [ ] Try accessing `/admin/dashboard/inquiries` directly
- [ ] Should redirect to dashboard (403)

**Invalid Credentials Test**:
- [ ] Try login with wrong password
- [ ] Should show error: "Invalid email or password"

---

### Test 2: RBAC Enforcement

#### A. UI-Level Permissions

**As Super Admin**:
- [ ] Navigate to Users page
- [ ] Verify "Add User" button visible
- [ ] Verify Edit/Delete buttons visible for all users
- [ ] Verify your own account has disabled Edit/Delete buttons

**As Admin**:
- [ ] Navigate to Products page
- [ ] Verify "Add Product" button visible
- [ ] Verify Edit/Delete buttons visible
- [ ] Navigate to Inquiries page
- [ ] Verify can change status, mark as read
- [ ] Verify Delete button visible

**As Editor**:
- [ ] Navigate to Products page
- [ ] Verify "Add Product" button visible
- [ ] Verify Edit button visible
- [ ] Verify Delete button is HIDDEN or disabled

#### B. API-Level Permissions

Open Browser DevTools → Network tab

**Test Unauthorized Access**:
```bash
# As Editor, try to delete a product (should fail)
# 1. Login as editor@umbrella.com
# 2. Go to Products page
# 3. Open DevTools Network tab
# 4. Try to delete a product
# 5. Should see 401/403 error in Network tab
```

**Test Self-Protection**:
```bash
# As Super Admin, try to delete yourself
# 1. Login as super@umbrella.com
# 2. Go to Users page
# 3. Try to delete your own account
# 4. Should show error: "You cannot delete yourself"
```

---

### Test 3: CRUD Operations

#### A. Products CRUD

**Create Product**:
- [ ] Click "Add Product"
- [ ] Fill in all fields (EN + FR):
  - Name EN: "Test Product"
  - Name FR: "Produit Test"
  - Description (both languages)
  - Category: "Fruits"
  - Origin: "Canada"
  - Season: "Year-round"
  - Price: 10.00
  - MOQ: 100
  - Quantity: 500
- [ ] Click "Save"
- [ ] Should show success toast
- [ ] Product should appear in list

**Edit Product**:
- [ ] Click Edit icon on test product
- [ ] Change price to 12.00
- [ ] Change quantity to 400
- [ ] Click "Save"
- [ ] Should show success toast
- [ ] Changes should reflect in list

**Delete Product**:
- [ ] Click Delete icon on test product
- [ ] Should show confirmation modal
- [ ] Click "Confirm"
- [ ] Should show success toast
- [ ] Product should disappear from list

#### B. Inquiries CRUD

**Create Inquiry** (via public site):
- [ ] Open http://localhost:3000/contact
- [ ] Fill in contact form:
  - Name: "Test Customer"
  - Email: "test@example.com"
  - Phone: "+1234567890"
  - Product: Select any
  - Message: "Test inquiry message"
- [ ] Submit form
- [ ] Should show success message

**View Inquiry** (in admin):
- [ ] Go to Inquiries page
- [ ] Verify new inquiry appears
- [ ] Status should be "NEW"
- [ ] Click to expand details
- [ ] Verify all fields display correctly

**Update Inquiry Status**:
- [ ] Click status dropdown
- [ ] Change to "CONTACTED"
- [ ] Should show success toast
- [ ] Status should update immediately

**Mark as Read**:
- [ ] Click "Mark as Read" button
- [ ] Should show success toast
- [ ] Badge should change

**Delete Inquiry** (Super Admin only):
- [ ] Login as Super Admin
- [ ] Click Delete icon
- [ ] Should show confirmation modal
- [ ] Confirm deletion
- [ ] Inquiry should disappear

#### C. Users CRUD (Super Admin Only)

**Create User**:
- [ ] Login as Super Admin
- [ ] Go to Users page
- [ ] Click "Add User"
- [ ] Fill in:
  - Email: "newuser@test.com"
  - Password: "TestPass123!"
  - Role: "ADMIN"
  - Active: Yes
- [ ] Click "Save"
- [ ] Should show success toast
- [ ] User should appear in list

**Edit User Role**:
- [ ] Click role dropdown for new user
- [ ] Change to "EDITOR"
- [ ] Should show success toast
- [ ] Role should update immediately

**Toggle User Status**:
- [ ] Click status toggle for new user
- [ ] Should change to "Disabled"
- [ ] Should show success toast
- [ ] Try logging in as that user
- [ ] Should fail with error

**Delete User**:
- [ ] Re-enable the user
- [ ] Click Delete icon
- [ ] Should show confirmation modal
- [ ] Confirm deletion
- [ ] User should disappear

---

### Test 4: Dashboard KPIs

**Initial State**:
- [ ] Note current KPI values:
  - Total Products: ___
  - Active Inquiries: ___
  - Low Stock Alerts: ___
  - New Users: ___

**After Creating Product**:
- [ ] Create a new product
- [ ] Refresh dashboard
- [ ] Total Products should increase by 1

**After Creating Inquiry**:
- [ ] Submit new inquiry via contact form
- [ ] Refresh dashboard
- [ ] Active Inquiries should increase by 1

**After Creating User**:
- [ ] Create new user (Super Admin only)
- [ ] Refresh dashboard
- [ ] New Users should increase by 1

**Charts**:
- [ ] Verify "Inquiries Over Time" chart displays
- [ ] Verify "Inventory Distribution" chart displays
- [ ] Hover over data points to see tooltips

---

### Test 5: Audit Logs

**As Super Admin**:
- [ ] Go to Activity Logs page
- [ ] Verify recent actions are logged:
  - CREATE_PRODUCT
  - UPDATE_PRODUCT
  - DELETE_PRODUCT
  - CREATE_USER
  - UPDATE_USER
  - DELETE_USER
  - DELETE_INQUIRY

**Verify Log Details**:
- [ ] Each log shows:
  - Timestamp
  - User email
  - Action (color-coded)
  - Entity type
  - Details

---

### Test 6: Mobile Responsiveness

**Desktop** (1920x1080):
- [ ] Sidebar fully visible
- [ ] Tables display all columns
- [ ] Forms in 2-column grid
- [ ] Charts render correctly

**Tablet** (768x1024):
- [ ] Sidebar collapses to hamburger menu
- [ ] Tables scroll horizontally
- [ ] Forms stack to 1 column
- [ ] KPI cards in 2x2 grid

**Mobile** (375x667):
- [ ] Sidebar slides in from left
- [ ] Tables scroll horizontally
- [ ] Forms fully stacked
- [ ] KPI cards in single column
- [ ] All buttons are touch-friendly (min 44x44px)

**Test in Browser DevTools**:
1. Open DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Test different devices:
   - iPhone SE
   - iPad
   - Desktop

---

### Test 7: Dark Mode

**Toggle Dark Mode**:
- [ ] Click dark mode toggle in sidebar
- [ ] Theme should switch immediately
- [ ] All colors should invert correctly
- [ ] Text remains readable
- [ ] Charts update colors

**Persistence**:
- [ ] Refresh page
- [ ] Dark mode should persist
- [ ] Check localStorage: `theme` key should be "dark"

**Switch Back**:
- [ ] Toggle to light mode
- [ ] Verify all colors revert
- [ ] Refresh and verify persistence

---

### Test 8: Error Handling

**Network Errors**:
- [ ] Open DevTools → Network tab
- [ ] Set throttling to "Offline"
- [ ] Try to create a product
- [ ] Should show error toast: "Network error" or similar
- [ ] Set back to "No throttling"

**Validation Errors**:
- [ ] Try to create product with empty name
- [ ] Should show validation error
- [ ] Try to create user with invalid email
- [ ] Should show validation error

**Permission Errors**:
- [ ] Login as Editor
- [ ] Try to access `/admin/dashboard/users` directly
- [ ] Should redirect to dashboard

---

## ✅ LOCAL TESTING CHECKLIST

Mark each as complete:

### Authentication & Roles
- [ ] Super Admin login works
- [ ] Admin login works
- [ ] Editor login works
- [ ] Invalid credentials rejected
- [ ] Disabled users cannot login

### RBAC Enforcement
- [ ] Super Admin sees all menus
- [ ] Admin sees limited menus
- [ ] Editor sees minimal menus
- [ ] Direct URL access blocked
- [ ] API endpoints enforce permissions

### CRUD Operations
- [ ] Products: Create, Read, Update, Delete
- [ ] Inquiries: Create, Read, Update, Delete
- [ ] Users: Create, Read, Update, Delete

### Dashboard KPIs
- [ ] KPI cards display correctly
- [ ] KPIs update after CRUD operations
- [ ] Charts render data
- [ ] Recent activity shows

### Audit Logs
- [ ] All actions are logged
- [ ] Logs show user attribution
- [ ] Color coding works
- [ ] Details are accurate

### Mobile Responsiveness
- [ ] Desktop layout correct
- [ ] Tablet layout correct
- [ ] Mobile layout correct
- [ ] Touch targets adequate

### Dark Mode
- [ ] Toggle works
- [ ] Persistence works
- [ ] All colors update
- [ ] Readable in both modes

### Error Handling
- [ ] Network errors handled
- [ ] Validation errors shown
- [ ] Permission errors handled
- [ ] User-friendly messages

---

## 2️⃣ PRODUCTION DEPLOYMENT (15-30 minutes)

### Step 1: Set Up Production Database

**Recommended: Supabase**

1. Go to https://supabase.com/dashboard/sign-up
2. Create new project: "umbrella-import-export"
3. Set strong database password (SAVE IT!)
4. Wait 2-3 minutes for provisioning
5. Get connection string:
   - Settings → Database → Connection string (URI)
   - Use the **pooling** connection string (port 6543)
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

### Step 2: Generate JWT Secret

```bash
./scripts/rotate-jwt-secret.sh

# Copy the output, you'll need it for Vercel
```

### Step 3: Push to GitHub

```bash
# If not already configured, set your Git identity
git config --global user.name "Your Name"
git config --global user.email "you@email.com"

# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/umbrella-import-export.git
git push -u origin main
```

### Step 4: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure Environment Variables:
   ```
   DATABASE_URL = postgresql://postgres.[PROJECT-REF]:[PASSWORD]@...
   JWT_SECRET = <output from rotate-jwt-secret.sh>
   NODE_ENV = production
   
   # Optional (for email):
   SMTP_HOST = smtp.gmail.com
   SMTP_PORT = 587
   SMTP_USER = your-email@gmail.com
   SMTP_PASS = your-app-password
   SMTP_FROM = noreply@umbrella-import.com
   ADMIN_EMAIL = admin@umbrella-import.com
   NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
   ```
4. Click "Deploy"
5. Wait 2-3 minutes

### Step 5: Run Database Migrations

```bash
# Set production database URL
export DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@..."

# Run migrations
npx prisma migrate deploy

# Verify tables were created
npx prisma studio
# Check that User, Product, Inquiry, AuditLog tables exist
```

### Step 6: Create First Super Admin

```bash
# Make sure DATABASE_URL is still set
node scripts/create-admin.js admin@yourdomain.com YourStrongPassword123!

# Verify creation
npx prisma studio
# Check User table for your admin account
```

---

## 3️⃣ PRODUCTION SMOKE TEST (15 minutes)

### Test on Production URL

**Your production URL**: `https://your-app.vercel.app`

### Public Site Tests

- [ ] Homepage loads: `https://your-app.vercel.app`
- [ ] Products page works: `https://your-app.vercel.app/products`
- [ ] Product detail opens
- [ ] Contact form submits
- [ ] Language toggle works (EN ↔ FR)
- [ ] Mobile responsive
- [ ] No console errors (F12)

### Admin Panel Tests

- [ ] Admin login: `https://your-app.vercel.app/admin`
- [ ] Login with your Super Admin credentials
- [ ] Dashboard loads with KPIs and charts
- [ ] Products page accessible
- [ ] Can create/edit/delete products
- [ ] Inquiries page accessible
- [ ] Can view and manage inquiries
- [ ] Users page accessible (Super Admin only)
- [ ] Can create/edit users
- [ ] Activity Logs accessible (Super Admin only)
- [ ] Audit logs are recording
- [ ] Dark mode toggle works

### Security Tests

- [ ] Setup endpoint blocked: `https://your-app.vercel.app/api/setup`
  - Should return: `{"error":"Forbidden"}`
- [ ] Unauthorized dashboard access redirects to login
- [ ] Logout and try to access `/admin/dashboard`
  - Should redirect to `/admin`
- [ ] Role restrictions work
  - Login as Admin, try to access `/admin/dashboard/users`
  - Should redirect to dashboard
- [ ] HTTPS enabled (padlock icon in browser)
- [ ] Cookies are secure (DevTools → Application → Cookies)
  - `admin-token` should have `HttpOnly` and `Secure` flags

### Email Tests (if configured)

- [ ] Submit inquiry via contact form
- [ ] Admin receives notification email
- [ ] Customer receives auto-reply (EN or FR based on language)
- [ ] Emails not in spam folder

---

## ✅ PRODUCTION SMOKE TEST CHECKLIST

### Public Site
- [ ] All pages load correctly
- [ ] Forms submit successfully
- [ ] Language toggle works
- [ ] Mobile responsive
- [ ] No errors in console

### Admin Panel
- [ ] Login works
- [ ] Dashboard displays correctly
- [ ] All CRUD operations work
- [ ] RBAC is enforced
- [ ] Audit logs are recording

### Security
- [ ] Setup endpoint disabled
- [ ] Unauthorized access blocked
- [ ] HTTPS enabled
- [ ] Secure cookies
- [ ] Role restrictions enforced

### Email (Optional)
- [ ] Admin notifications work
- [ ] Customer auto-replies work
- [ ] Emails not in spam

---

## 🎉 LAUNCH READY!

If all tests pass, your platform is ready for public launch!

### Final Actions

1. **Share Public URL**: `https://your-domain.com`
   - ✅ Share on social media
   - ✅ Update email signature
   - ✅ Add to business cards
   - ✅ List in directories

2. **DO NOT Share**:
   - ❌ `/admin` URLs
   - ❌ `/api/*` endpoints
   - ❌ Database credentials
   - ❌ Admin passwords

3. **Monitor**:
   - Check Vercel logs for errors
   - Review audit logs regularly
   - Monitor inquiry submissions
   - Track analytics

---

## 🆘 Troubleshooting

If any test fails, see:
- `TROUBLESHOOTING.md` - Common issues and solutions
- `GO_LIVE_CHECKLIST.md` - Complete deployment guide
- `TECHNICAL_REVIEW.md` - Technical verification

---

**Good luck with your launch! 🚀**
