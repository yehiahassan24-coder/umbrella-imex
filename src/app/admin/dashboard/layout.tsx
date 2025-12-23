import { getAuthUser } from '@/lib/user';
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
    const user = await getAuthUser();

    if (!user) {
        redirect('/admin');
    }

    return (
        <DashboardShell email={user.email} role={user.role}>
            {children}
        </DashboardShell>
    );
}
