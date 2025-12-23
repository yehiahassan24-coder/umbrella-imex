import React from 'react';
import { prisma } from '@/lib/prisma';
import styles from '../dashboard.module.css';
import InquiriesTable, { Inquiry } from './components/InquiriesTable';
import PageHeader from '../components/PageHeader';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function InquiriesPage() {
    const token = (await cookies()).get('admin-token')?.value;
    const payload = token ? await verifyJWT(token) : null;
    const role = (payload?.role as string) || 'EDITOR';

    const inquiries = await prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' },
        include: { product: true }
    });

    // Define the shape we expect from the DB (to fix potential type sync issues)
    interface InquiryResult {
        id: string;
        name: string;
        email: string;
        phone: string;
        message: string;
        is_read: boolean;
        status: any; // Using any for enum to avoid import clashes if types are stale
        priority?: any;
        notes?: string | null;
        tags?: string[];
        assignedTo?: string | null;
        createdAt: Date;
        product?: {
            name_en: string;
        } | null;
    }

    // Serialize dates and ensure all fields are passed
    const serializedInquiries: Inquiry[] = (inquiries as unknown as InquiryResult[]).map((inq) => ({
        id: inq.id,
        name: inq.name,
        email: inq.email,
        phone: inq.phone,
        message: inq.message,
        is_read: inq.is_read,
        status: inq.status,
        priority: inq.priority || 'MEDIUM',
        notes: inq.notes || '',
        tags: inq.tags || [],
        assignedTo: inq.assignedTo || undefined,
        product: inq.product ? { name_en: inq.product.name_en } : null,
        createdAt: inq.createdAt.toISOString(),
    }));

    return (
        <div className={styles.dashboardPage}>
            <PageHeader
                title="Inquiries"
                description="Manage and respond to customer requests"
            />

            <div className={styles.card}>
                <InquiriesTable inquiries={serializedInquiries} role={role} />
            </div>
        </div>
    );
}
