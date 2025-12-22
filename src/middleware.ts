import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('admin-token')?.value;

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
    matcher: ['/admin/:path*'],
};
