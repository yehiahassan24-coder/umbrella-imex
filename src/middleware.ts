import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

const PUBLIC_API_ROUTES = [
    '/api/inquiries',
    '/api/auth/login',
    '/api/setup'
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const method = request.method;
    const token = request.cookies.get('admin-token')?.value;

    // 1. CORS Preflight / OPTIONS - Always allow and terminate
    if (method === 'OPTIONS') {
        return new NextResponse(null, { status: 200 });
    }

    // 2. Public API Routes - Allowed without Auth/CSRF
    // Matches exact path or subpaths (e.g. /api/inquiries/bulk)
    if (PUBLIC_API_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
        return NextResponse.next();
    }

    // 3. CSRF Protection (Protected API Routes only)
    const isMutating = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
    const isApiRoute = pathname.startsWith('/api/');

    if (isApiRoute && isMutating) {
        const csrfTokenHeader = request.headers.get('x-csrf-token');
        const csrfTokenCookie = request.cookies.get('csrf-token')?.value;

        if (!csrfTokenHeader || !csrfTokenCookie || csrfTokenHeader !== csrfTokenCookie) {
            return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 });
        }
    }

    // 4. Admin Dashboard Protection

    // Login Page Access
    if (pathname === '/admin') {
        if (token) {
            const payload = await verifyJWT(token);
            if (payload && payload.isActive !== false) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
        }
        return NextResponse.next();
    }

    // Protected Dashboard Routes
    if (pathname.startsWith('/admin/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        const payload = await verifyJWT(token);
        if (!payload) {
            const response = NextResponse.redirect(new URL('/admin', request.url));
            response.cookies.delete('admin-token');
            response.cookies.delete('is-authenticated');
            return response;
        }

        if (payload.isActive === false) {
            const response = NextResponse.redirect(new URL('/admin', request.url));
            response.cookies.delete('admin-token');
            response.cookies.delete('is-authenticated');
            return response;
        }

        // Role-based access control
        const userRole = payload.role as string;
        if (pathname.startsWith('/admin/dashboard/users') && userRole !== 'SUPER_ADMIN') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        if (pathname.startsWith('/admin/dashboard/inquiries') && userRole === 'EDITOR') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/:path*'],
};
