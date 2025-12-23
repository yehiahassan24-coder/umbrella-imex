# Umbrella Import & Export Security Policy

This document outlines the security measures, reporting procedures, and architectural decisions made to ensure the Umbrella platform remains enterprise-grade and secure.

## 🛡️ Security Features

### 1. Authentication & Authorization
- **JWT (JSON Web Tokens)**: Secured with `HS256`, unique `issuer` (`umbrella-corp`), and `audience` (`umbrella-admin`) validation.
- **Short-lived Sessions**: Tokens expire in **4 hours** to minimize risk.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for `SUPER_ADMIN`, `ADMIN`, and `EDITOR`.
- **Session Revocation**: Integrated `tokenVersion` support. Password changes or manual revocations invalidate all active sessions for that user.
- **Idle Timeout**: Automatic client-side logout after 30 minutes of inactivity.

### 2. Infrastructure & Data Protection
- **CSRF Protection**: Double-submit cookie pattern implemented via HTTP-only cookies and custom headers (`x-csrf-token`).
- **Rate Limiting**: Database-backed rate limiting for:
  - Login attempts (5/min per IP)
  - Public Inquiries (10/min per IP)
  - Image Uploads (5/min per IP)
- **Account Lockout**: 15-minute lockout after 5 failed login attempts.
- **HTTP Security Headers**:
  - `Content-Security-Policy` (Strict policy against XSS)
  - `Strict-Transport-Security` (HSTS)
  - `X-Frame-Options: DENY` (Clickjacking protection)
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`

### 3. Upload Security
- **Type Validation**: Only `JPEG`, `PNG`, `WEBP`, and `SVG` allowed.
- **Size Limit**: 5MB maximum per file.
- **UUID Renaming**: All uploaded files are renamed to cryptographically secure UUIDs.
- **MIME Sniffing Prevention**: Enforced via headers.

### 4. Audit & Monitoring
- **Immutable Logs**: All administrative actions (creates, updates, deletes) are recorded in an append-only `AuditLog` table.
- **Active User Checks**: Every API request verifies the `isActive` status directly from the database, allowing for instant user deactivation.

## 🤝 Reporting a Vulnerability

If you discover a security vulnerability, please report it privately:
1. **Email**: security@umbrellaimp.com
2. **Details**: Include a summary, steps to reproduce, and impact.

Please do not open a public Issue for security vulnerabilities.

---
*Last Security Audit: 2025-12-23*
