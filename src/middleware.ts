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

    // --- DASHBOARD PROTECTION ---

    // 1. Handle Admin Login Page Redirect
    if (pathname === '/admin') {
        const payload = token ? await verifyJWT(token) : null;
        if (payload) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // 2. Protect All Dashboard Routes
    if (pathname.startsWith('/admin/dashboard')) {
        const payload = token ? await verifyJWT(token) : null;

        if (!payload) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        // Self-protection: check if user is active
        if (payload.isActive === false) {
            const response = NextResponse.redirect(new URL('/admin', request.url));
            response.cookies.delete('admin-token');
            response.cookies.delete('csrf-token');
            response.cookies.delete('is-authenticated');
            return response;
        }

        const userRole = payload.role as string;

        // Hide users page entirely if not SUPER_ADMIN
        if (pathname.startsWith('/admin/dashboard/users')) {
            if (userRole !== 'SUPER_ADMIN') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
        }

        // Only SUPER_ADMIN and ADMIN see inquiries
        if (pathname.startsWith('/admin/dashboard/inquiries')) {
            if (userRole === 'EDITOR') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/:path*'],
};
