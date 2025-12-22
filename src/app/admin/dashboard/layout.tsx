import React from 'react';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import DashboardShell from './components/DashboardShell';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

// Prevent search engines from indexing admin routes
export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) {
        redirect('/admin');
    }

    const payload = await verifyJWT(token);
    if (!payload) {
        redirect('/admin');
    }

    return (
        <DashboardShell email={payload.email as string} role={payload.role as string}>
            {children}
        </DashboardShell>
    );
}
