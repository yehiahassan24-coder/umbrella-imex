# Umbrella Import & Export

A professional, enterprise-grade digital platform for agricultural import/export businesses. Features a bilingual public website and a secure, role-based admin dashboard with CRM capabilities.

## ✨ Features

### Public Website
- 🌍 **Bilingual** (English & French)
- 📱 **Fully Responsive** design
- 🎨 **Premium Aesthetics** with glassmorphism and animations
- 📧 **Contact Forms** with product-specific inquiries
- 🛍️ **Product Catalog** with detailed specifications

### Admin Dashboard
- 🔐 **Role-Based Access Control** (Super Admin, Admin, Editor)
- 📊 **Analytics Dashboard** with interactive charts
- 🛒 **Product Management** (CRUD operations)
- 💼 **CRM Pipeline** (NEW → CONTACTED → QUOTED → WON/LOST)
- 👥 **User Management** with self-protection logic
- 📧 **Email Notifications** (admin alerts + customer auto-replies)
- 🕐 **SLA Monitoring** (24-hour response tracking)
- 📜 **Audit Logs** for compliance
- 🌙 **Dark Mode** with persistent theme
- 🔔 **Toast Notifications** for real-time feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- SMTP credentials (for email notifications)

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd umbrella-app

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your database URL and SMTP credentials

# 4. Run database migrations
npx prisma migrate dev

# 5. Seed initial data (development only)
curl http://localhost:3000/api/setup

# 6. Start development server
npm run dev
```

Visit `http://localhost:3000` for the public website  
Visit `http://localhost:3000/admin` for the admin dashboard

### Default Credentials (Development)
- **Super Admin**: super@umbrella.com / admin123
- **Admin**: admin@umbrella.com / admin123
- **Editor**: editor@umbrella.com / admin123

⚠️ **Change these passwords before production deployment!**

## 📁 Project Structure

```
umbrella-app/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── (public)/         # Public website pages
│   │   ├── admin/            # Admin dashboard
│   │   └── api/              # API routes
│   ├── lib/                  # Utilities (auth, permissions, mail)
│   └── styles/               # Global styles & design tokens
├── .env.example              # Environment template
├── PRODUCTION_CHECKLIST.md   # Deployment guide
└── TECHNICAL_DOCUMENTATION.md # Full technical docs
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT (HTTP-only cookies)
- **Email**: Nodemailer
- **Styling**: CSS Modules + Design Tokens
- **Charts**: Recharts
- **Icons**: Lucide React

## 🔐 Security Features

- ✅ JWT-based authentication with secure cookies
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with bcryptjs
- ✅ Self-protection (admins can't lock themselves out)
- ✅ System safety (can't delete last Super Admin)
- ✅ Audit logging for compliance
- ✅ Input validation on all forms
- ✅ SQL injection protection via Prisma

## 📊 User Roles

| Role | Dashboard | Products | Inquiries | Users | Audit Logs |
|------|-----------|----------|-----------|-------|------------|
| **Super Admin** | ✅ | ✅ | ✅ Full | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ View/Edit | ❌ | ❌ |
| **Editor** | ✅ | ✅ | ❌ | ❌ | ❌ |

## 🚀 Deployment

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Option 2: Docker
```bash
docker-compose up -d
```

### Option 3: Manual VPS
See `PRODUCTION_CHECKLIST.md` for detailed steps

## 📧 Email Configuration

Configure SMTP in `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@umbrella-import.com
ADMIN_EMAIL=admin@umbrella-import.com
```

## 🧪 Testing

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build test
npm run build

# Production preview
npm run start
```

## 📖 Documentation

- **[Production Checklist](PRODUCTION_CHECKLIST.md)** - Pre-deployment guide
- **[Technical Documentation](TECHNICAL_DOCUMENTATION.md)** - Full system architecture

## 🎨 Design System

- **Primary Color**: Forest Green (#1F3D2B)
- **Accent Color**: Gold (#E6C200)
- **Typography**: Inter (Google Fonts)
- **Dark Mode**: Fully supported with persistent theme

## 🔄 Database Migrations

```bash
# Create migration
npx prisma migrate dev --name description

# Apply to production
npx prisma migrate deploy

# Reset (dev only)
npx prisma migrate reset
```

## 🐛 Troubleshooting

**Database connection fails?**
- Check `DATABASE_URL` format
- Ensure database is accessible

**Emails not sending?**
- Verify SMTP credentials
- Check firewall/port access

**Build fails?**
- Run `npx prisma generate`
- Clear `.next` folder

## 📈 Future Enhancements

- [ ] CSV export for audit logs
- [ ] 2FA for Super Admins
- [ ] Advanced analytics dashboard
- [ ] Bulk product import/export
- [ ] Multi-tenant architecture

## 📄 License

Proprietary - All rights reserved

## 🙏 Support

For issues or questions, please contact your development team.

---

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: December 2024
