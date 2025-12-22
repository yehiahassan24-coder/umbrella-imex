import React from 'react';
import { prisma } from '@/lib/prisma';
import UserForm from '../../components/UserForm';
import styles from '../../../dashboard.module.css';
import { notFound } from 'next/navigation';
import PageHeader from '../../../components/PageHeader';

export const dynamic = 'force-dynamic';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            role: true,
            isActive: true
        }
    });

    if (!user) {
        notFound();
    }

    return (
        <div className={styles.dashboardPage}>
            <PageHeader
                title="Edit User"
                description={`Update account details for ${user.email}`}
            />

            <UserForm initialData={user} isEdit={true} />
        </div>
    );
}
