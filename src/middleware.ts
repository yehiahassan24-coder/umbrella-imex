import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const method = request.method;
    const token = request.cookies.get('admin-token')?.value;

    // --- CSRF PROTECTION ---
    const isMutating = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
    const isApiRoute = pathname.startsWith('/api/');
    const isPublicApi = pathname === '/api/auth/login' ||
        pathname === '/api/setup' ||
        (pathname === '/api/inquiries' && method === 'POST');

    if (isApiRoute && isMutating && !isPublicApi) {
        const csrfTokenHeader = request.headers.get('x-csrf-token');
        const csrfTokenCookie = request.cookies.get('csrf-token')?.value;

        if (!csrfTokenHeader || !csrfTokenCookie || csrfTokenHeader !== csrfTokenCookie) {
            return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 });
        }
    }

    // --- ADMIN DASHBOARD PROTECTION ---

    // 1. If hitting /admin (the login page)
    if (pathname === '/admin') {
        if (token) {
            const payload = await verifyJWT(token);
            if (payload && payload.isActive !== false) {
                // Already logged in, go to dashboard
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
        }
        return NextResponse.next();
    }

    // 2. If hitting any dashboard route (/admin/dashboard/...)
    if (pathname.startsWith('/admin/dashboard')) {
        if (!token) {
            console.log('Middleware: No token found, redirecting to /admin');
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        const payload = await verifyJWT(token);
        if (!payload) {
            console.log('Middleware: Token verification failed, clearing cookies and redirecting');
            const response = NextResponse.redirect(new URL('/admin', request.url));
            response.cookies.delete('admin-token');
            response.cookies.delete('is-authenticated');
            return response;
        }

        // Check if user is active
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
