import { Metadata } from 'next';

// Prevent search engines from indexing admin routes
export const metadata: Metadata = {
    title: 'Admin Login | Umbrella Import & Export',
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
