# Umbrella Import & Export - Technical Documentation

## 🏗️ System Architecture

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM 5
- **Authentication**: JWT (stateless, HTTP-only cookies)
- **Email**: Nodemailer (SMTP)
- **Styling**: CSS Modules + Design Tokens
- **Charts**: Recharts
- **Icons**: Lucide React

### Database Schema
```prisma
User (id, email, password, role, isActive, createdAt, updatedAt)
├─ Role: SUPER_ADMIN | ADMIN | EDITOR
└─ Relations: AuditLog[]

Product (id, name_en, name_fr, desc_en, desc_fr, category, origin, season, price, moq, quantity, is_active, createdAt)
└─ Relations: Inquiry[]

Inquiry (id, productId, name, email, phone, message, is_read, status, createdAt, updatedAt)
├─ Status: NEW | CONTACTED | QUOTED | WON | LOST
└─ Relations: Product

AuditLog (id, userId, action, entity, entityId, details, createdAt)
└─ Relations: User
```

---

## 🔐 Security Features

### Authentication & Authorization
- **JWT-based authentication** with 24-hour expiration
- **Role-Based Access Control (RBAC)** with 3 tiers
- **Middleware protection** on all admin routes
- **Self-protection logic** prevents admins from locking themselves out
- **System safety** prevents deletion of last Super Admin

### Password Security
- **bcryptjs hashing** with salt rounds
- **Account lockout** via `isActive` flag
- **Secure password reset** (ready for implementation)

### API Security
- **Permission checks** on every sensitive endpoint
- **Input validation** on all forms
- **SQL injection protection** via Prisma
- **CSRF protection** via SameSite cookies

---

## 👥 User Roles & Permissions

| Feature | SUPER_ADMIN | ADMIN | EDITOR |
|---------|-------------|-------|--------|
| View Dashboard | ✅ | ✅ | ✅ |
| Manage Products | ✅ | ✅ | ✅ |
| View Inquiries | ✅ | ✅ | ❌ |
| Manage Inquiries | ✅ | ✅ | ❌ |
| Delete Inquiries | ✅ | ❌ | ❌ |
| View Users | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| View Audit Logs | ✅ | ❌ | ❌ |

---

## 📧 Email Notification System

### Automated Workflows
1. **New Inquiry Submitted**
   - Admin receives instant notification with customer details
   - Customer receives auto-reply (bilingual: EN/FR)

2. **SLA Monitoring**
   - Visual alerts for inquiries unanswered >24 hours
   - Red indicator in dashboard

### Email Templates
- **Admin Notification**: Professional HTML template with customer info
- **Customer Auto-Reply**: Branded confirmation email
- **Language Detection**: Automatically sends FR or EN based on form submission

---

## 📊 Sales Pipeline (CRM)

### Inquiry Lifecycle
```
NEW → CONTACTED → QUOTED → WON/LOST
```

### Status Definitions
- **NEW**: Fresh lead, unanswered
- **CONTACTED**: Initial response sent
- **QUOTED**: Price/terms provided
- **WON**: Deal closed successfully
- **LOST**: Opportunity lost

### Pipeline Features
- Inline status updates
- Visual color coding
- Audit trail for every status change
- Email integration (auto-marks as CONTACTED when replying)

---

## 🎨 Design System

### Color Palette
- **Primary**: Forest Green (#1F3D2B)
- **Accent**: Gold (#E6C200)
- **Background**: Soft White (#F7F9F8)
- **Text**: Charcoal Gray (#2E2E2E)

### Dark Mode
- **Toggle**: Persistent theme switcher
- **Palette**: Navy (#020617) + Slate (#0f172a)
- **Token-based**: All colors use CSS variables

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: 0.75rem - 1.875rem
- **Weights**: 400, 500, 600, 700

---

## 🔍 Audit & Compliance

### Audit Log Tracking
Every critical action is logged:
- **User Management**: Create, Update, Delete
- **Inquiry Updates**: Status changes, read/unread
- **Product Changes**: Create, Update, Delete

### Log Structure
```typescript
{
  userId: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  entity: 'User' | 'Product' | 'Inquiry',
  entityId: string,
  details: string,
  createdAt: Date
}
```

### Compliance Features
- **User attribution** on every action
- **Timestamp precision** to the second
- **Immutable logs** (no delete endpoint)
- **CSV export** (ready for implementation)

---

## 🚀 Performance Optimizations

### Database
- **Connection pooling** via `pg` adapter
- **Indexed fields**: email, productId, userId
- **Selective queries**: Only fetch needed fields
- **Pagination**: Limit 100 on audit logs

### Frontend
- **Server Components** for initial render
- **Client Components** only where needed
- **Optimistic UI** for instant feedback
- **Code splitting** via Next.js automatic chunking

### Caching
- **Static pages**: Public website (ISR ready)
- **Dynamic pages**: Admin dashboard (`force-dynamic`)
- **API routes**: No caching on sensitive endpoints

---

## 📱 Responsive Design

### Breakpoints
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px

### Mobile Features
- Collapsible sidebar with hamburger menu
- Horizontal scrolling tables
- Touch-friendly buttons (min 44px)
- Stacked forms on small screens

---

## 🔧 Development Workflow

### Local Setup
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your database URL

# 3. Run migrations
npx prisma migrate dev

# 4. Seed database (development only)
curl http://localhost:3000/api/setup

# 5. Start dev server
npm run dev
```

### Database Migrations
```bash
# Create new migration
npx prisma migrate dev --name description

# Apply to production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

### Code Quality
```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build test
npm run build
```

---

## 🌐 Deployment Guide

### Environment Variables (Production)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="<generated-with-openssl>"
NODE_ENV="production"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@domain.com"
SMTP_PASS="app-specific-password"
SMTP_FROM="noreply@umbrella-import.com"
ADMIN_EMAIL="admin@umbrella-import.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Recommended Platforms
1. **Vercel** (easiest, zero-config)
2. **Railway** (simple, good pricing)
3. **Docker + VPS** (full control)

### Pre-Deployment Checklist
- [ ] Change all default passwords
- [ ] Rotate JWT_SECRET
- [ ] Configure production database
- [ ] Set up SMTP credentials
- [ ] Delete or disable `/api/setup`
- [ ] Test production build locally
- [ ] Configure domain and SSL

---

## 📈 Future Enhancements (Optional)

### Phase 7: Advanced Features
- **2FA** for Super Admins
- **CSV Export** for audit logs
- **Advanced Analytics** (conversion rates, revenue tracking)
- **Multi-language** admin dashboard
- **Bulk operations** (import/export products)

### Phase 8: Integrations
- **Stripe/PayPal** for online payments
- **Twilio** for SMS notifications
- **Slack** for team alerts
- **Google Analytics** for traffic tracking

### Phase 9: Enterprise
- **Multi-tenant** architecture
- **SSO** integration (SAML, OAuth)
- **Advanced permissions** (custom roles)
- **API documentation** (OpenAPI/Swagger)

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: Database connection fails
- **Solution**: Check `DATABASE_URL` format, ensure database is accessible

**Issue**: JWT verification fails
- **Solution**: Ensure `JWT_SECRET` matches between environments

**Issue**: Emails not sending
- **Solution**: Verify SMTP credentials, check firewall/port access

**Issue**: Build fails
- **Solution**: Run `npx prisma generate`, clear `.next` folder

**Issue**: Dark mode not persisting
- **Solution**: Check browser localStorage, ensure JavaScript is enabled

---

## 📞 Support & Maintenance

### Regular Maintenance
- **Weekly**: Review audit logs for anomalies
- **Monthly**: Database backup verification
- **Quarterly**: Security dependency updates
- **Annually**: Full security audit

### Monitoring Recommendations
- **Uptime**: UptimeRobot, Pingdom
- **Errors**: Sentry, LogRocket
- **Performance**: Vercel Analytics, Google Lighthouse
- **Database**: Built-in provider monitoring

---

## 📄 License & Credits

**Built with**: Next.js, Prisma, PostgreSQL, Recharts
**Design**: Custom design system with CSS Modules
**Icons**: Lucide React
**Fonts**: Inter (Google Fonts)

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: Production Ready ✅
