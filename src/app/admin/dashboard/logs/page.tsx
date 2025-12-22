import React from 'react';
import { prisma } from '@/lib/prisma';
import styles from '../dashboard.module.css';
import PageHeader from '../components/PageHeader';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LogsTable from './components/LogsTable';
import { FileText, Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AuditLogsPage() {
    const token = (await cookies()).get('admin-token')?.value;
    const payload = token ? await verifyJWT(token) : null;

    if (!payload || payload.role !== 'SUPER_ADMIN') {
        redirect('/admin/dashboard');
    }

    // @ts-ignore - Prisma might need client restart or types are catching up
    const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: true
        },
        take: 100
    });

    // Serialize logs
    const serializedLogs = logs.map((log: any) => ({
        id: log.id,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        details: log.details,
        createdAt: log.createdAt.toISOString(),
        user: {
            email: log.user?.email || 'System',
            role: log.user?.role || 'SYSTEM'
        }
    }));

    return (
        <div className={styles.dashboardPage}>
            <PageHeader
                title="Activity Logs"
                description="Monitor system actions and user activity for compliance"
            >
                <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Download size={18} /> Export CSV
                </button>
            </PageHeader>

            <div className={styles.card}>
                {serializedLogs.length > 0 ? (
                    <LogsTable logs={serializedLogs} />
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                        <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p style={{ fontSize: '1.125rem' }}>No activity logs found yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
