# Umbrella Admin Dashboard - Professional Overview

## 🔍 Overview
The **Umbrella Admin Dashboard** serves as the central command center for the **Umbrella Import & Export** platform. It is designed for efficiency, security, and scalability, providing administrators and moderators with a unified interface to manage products, inquiries, users, and system activity.

The dashboard features a modern, responsive layout, strict **Role-Based Access Control (RBAC)**, and interactive feedback mechanisms to ensure smooth operations and enterprise-grade usability.

---

## 🚀 Key Features

### 1. **Authentication & Security**
*   **Secure Access**: JWT-based authentication stored in HTTP-only cookies.
*   **Role-Based Access Control (RBAC)**:
    *   **Super Admin**: Full access to all modules including Users, Logs, and Product Management.
    *   **Admin**: Access to Products and Inquiries management.
    *   **Editor**: Can view and edit products; limited administrative capabilities.
*   **Session Management**: Sign-out functionality available on Desktop and Mobile.
*   **Password Security**: All passwords hashed with `bcrypt` and salted.
*   **Audit Trail**: Actions are logged for compliance and monitoring.

### 2. **Dashboard Overview (`/admin/dashboard`)**
*   **KPI Widgets**: Real-time snapshot of critical metrics:
    *   Total Products
    *   Active Products
    *   Total Inquiries
    *   New Inquiries
    *   **Active Users** (Super Admin only)
*   **Quick Actions**: Shortcut buttons for common administrative tasks.
*   **Recent Activity Feed**: Displays the latest inquiries, product updates, and system events.
*   **Role-Aware View**: Super Admins see system-wide metrics; Admins see operational KPIs; Editors see content-focused KPIs.

### 3. **Product Management (`/admin/dashboard/products`)**
*   **CRUD Operations**: Full create, read, update, delete functionality.
*   **Search & Filtering**: Live search by name, category, or status; filtering by availability and stock.
*   **Media Management**:
    *   Upload multiple product images via drag-and-drop.
    *   Automatic resizing and optimization (Next.js Image component recommended).
    *   Thumbnail previews in list and detail views.
*   **SEO Fields**: Titles, meta descriptions, and structured data inputs.
*   **Multi-Language Support**: English & French for names and descriptions.
*   **Inventory Tracking**: Price, Minimum Order Quantity (MOQ), and Quantity with alerts for low stock.
*   **Bulk Actions**: Enable/disable products, delete multiple items, assign categories/tags.

### 4. **Inquiry Management (`/admin/dashboard/inquiries`)**
*   **Centralized Message Center**: Handles all website customer inquiries.
*   **Status Tracking**: New, Read, Contacted, Closed.
*   **Priority & Assignment**: Tag inquiries by urgency and assign to specific moderators.
*   **Filtering & Sorting**: Quickly locate unread, urgent, or product-specific messages.
*   **Bulk Actions & Export**: Update status or export inquiries to CSV for reporting.

### 5. **User Management (Super Admin Only) (`/admin/dashboard/users`)**
*   **Moderator Management**: Add, edit, and remove admin accounts.
*   **Roles**: `SUPER_ADMIN`, `ADMIN`, `EDITOR`.
*   **Status Control**: Instantly enable/disable accounts without deleting them.
*   **Activity Monitoring**: Last login, recent actions, and online status.
*   **Safeguards**: Prevent self-deletion and ensure at least one Super Admin exists.
*   **Inline Editing & Search**: Edit roles/status directly in table; search/filter by email, role, or status.
*   **Password Reset Workflow**: Admin-triggered resets with notifications.

### 6. **Activity Logs (Super Admin Only) (`/admin/dashboard/logs`)**
*   **Comprehensive Audit Trail**: Tracks critical actions with:
    *   User email & role
    *   Action type (Create, Update, Delete)
    *   Target entity (Product, User, Inquiry)
    *   Timestamp
*   **Filters & Search**: View logs by user, action type, or date range.
*   **Export & Reporting**: CSV export or integration with monitoring tools (Sentry, Datadog).

### 7. **Technical & UI/UX Highlights**
*   **Responsive Design**: Optimized for Desktop, Tablet, and Mobile.
*   **Collapsible Sidebar**: Maximize workspace on smaller screens.
*   **Dark/Light Mode**: User preference toggle with persistent settings.
*   **Interactive Feedback**: Toast notifications for success/error states.
*   **Optimized Performance**:
    *   Server-side rendering (SSR) for initial load.
    *   Client-side interactivity for dynamic components.
    *   Lazy-loading of images and tables for large datasets.
*   **Accessibility**: ARIA-compliant elements, keyboard navigation, and screen reader support.
*   **Drag-and-Drop Uploads**: For product images with preview and validation.
*   **Modular Components**: Forms, tables, and widgets designed for reuse across modules.

### 8. **Future-Proof & Enterprise Features**
*   **API-First Architecture**: Enables mobile apps or third-party integrations.
*   **Role-Based Dashboards**: Each role sees relevant KPIs and modules.
*   **Notifications & Alerts**: System events, low stock, or pending moderator tasks.
*   **Customizable Dashboard**: Pin favorite widgets or KPIs.
*   **Audit & Monitoring Integration**: For security, compliance, and analytics.

---

## ✅ Conclusion
The **Umbrella Admin Dashboard** is:
*   **Enterprise-Grade**: Secure, scalable, and compliant.
*   **Feature-Rich**: Covers all operational needs from products to users to inquiries.
*   **User-Friendly**: Polished UI, responsive design, and interactive feedback.
*   **Future-Ready**: API-first design, modular components, and advanced monitoring.
