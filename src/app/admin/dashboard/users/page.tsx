import React from 'react';
import { prisma } from '@/lib/prisma';
import styles from '../dashboard.module.css';
import UserListTable from './components/UserListTable';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import PageHeader from '../components/PageHeader';

export const dynamic = 'force-dynamic';

export default async function UsersAdminPage() {
    const token = (await cookies()).get('admin-token')?.value;
    const payload = token ? await verifyJWT(token) : null;
    const currentUserId = payload?.id as string;

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            lastLogin: true
        }
    });

    return (
        <div className={styles.dashboardPage}>
            <PageHeader
                title="Users"
                description="Manage system administrators and their access levels"
            />

            <div className={styles.card}>
                {users.length > 0 ? (
                    <UserListTable users={users} currentUserId={currentUserId} />
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                        <p style={{ fontSize: '1.125rem' }}>No users found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
