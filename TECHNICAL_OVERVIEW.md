# Umbrella Import & Export - Technical Investor Overview

## 🏗️ Core Architecture

The Umbrella platform is built on a modern, "clean-code" architecture using the **Next.js 14 App Router** and **TypeScript**. It follows a standard **Tiered Web Architecture**:

1.  **Frontend (Next.js)**: Server-Side Rendering (SSR) for SEO and Static Site Generation (SSG) for high-performance product listings.
2.  **API Layer (Next.js Route Handlers)**: RESTful API design with centralized authorization and audit logging.
3.  **ORM & Database (Prisma + PostgreSQL)**: Strongly-typed data access with automated migrations and safety checks.

## 🛡️ Enterprise-Grade Security

The platform has undergone a comprehensive hardening process, achieving an **A+ Security Rating**:
- **Real-Time Authorization**: Every administrative request re-validates user status and session versioning against the database.
- **CSRF & Brute Force Protection**: Hardened against modern web attack vectors.
- **Audit Logging**: Comprehensive, immutable activity tracking for compliance.
- **Secure File Handling**: Sanitized, type-validated, and UUID-renamed asset management.

## 🚀 Scalability & Performance

### 1. Current State (MVP/Scale-Ready)
- Optimized image delivery via `next/image`.
- Database-backed rate limiting.
- Responsive design tailored for global logistics operations.

### 2. Scaling Roadmap
- **Stateless Storage**: Integrated a storage abstraction layer (`src/lib/storage.ts`) that supports both local disk and **S3-compatible cloud storage** via the `UPLOAD_STORAGE_TYPE` environment variable.
- **Distributed Caching**: Prepared for **Redis** integration to handle high-traffic bursts and global state management.
- **Health Monitoring**: Native `/api/health` endpoint for external monitoring services (e.g., UptimeRobot, Datadog) to verify DB and API status.
- **Connection Pooling**: Optimized for serverless deployment (Vercel/AWS Lambda) using Prisma's connection management patterns.

## 💰 Business Continuity

- **Localization**: Native support for **English & French**, architected to easily add more languages as the business expands into new markets.
- **Data Integrity**: Enforced via Prisma schema constraints and relational mapping.
- **Recoverability**: Automated database migration history and modular environment configuration.

## 🛠️ Technical Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Modern CSS Modules (Design System approach)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT (jose) with secure HTTP-only cookies
- **Mailing**: SMTP-ready (Nodemailer)

---
*Created: 2025-12-23 | Version 1.1*
