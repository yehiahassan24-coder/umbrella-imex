import React from 'react';
import { prisma } from '@/lib/prisma';
import styles from './dashboard.module.css';
import { Package, MessageSquare, Clock, ShoppingBag, Eye, TrendingUp, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import DashboardCharts from './components/DashboardCharts';
import { getDashboardAnalytics } from '@/lib/dashboard-analytics';

import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { ShieldCheck, History } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
    const data = await getDashboardAnalytics();
    const token = (await cookies()).get('admin-token')?.value;
    const payload = token ? await verifyJWT(token) : null;
    const role = (payload?.role as string) || '';

    const [recentInquiries, recentLogs, usersCount] = await Promise.all([
        prisma.inquiry.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { product: true }
        }),
        role === 'SUPER_ADMIN' ? prisma.auditLog.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        }) : Promise.resolve([]),
        role === 'SUPER_ADMIN' ? prisma.user.count({ where: { isActive: true } }) : Promise.resolve(0)
    ]);

    const stats = [
        { label: 'Total Products', value: data.kpis.totalProducts, icon: Package, color: '#0f172a', bg: '#f1f5f9' },
        { label: 'Active Products', value: data.kpis.activeProducts, icon: ShoppingBag, color: '#166534', bg: '#f0fdf4' },
        { label: 'Total Inquiries', value: data.kpis.totalInquiries, icon: MessageSquare, color: '#92400e', bg: '#fffbeb' },
        { label: 'New (7 Days)', value: data.kpis.newInquiries, icon: Clock, color: '#991b1b', bg: '#fef2f2' },
    ];

    if (role === 'SUPER_ADMIN') {
        stats.push({ label: 'Active Users', value: usersCount, icon: ShieldCheck, color: '#7e22ce', bg: '#f3e8ff' });
    }

    return (
        <div className={styles.dashboardPage}>
            <div className={styles.header}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 700 }}>Overview</h1>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Business metrics and trends from the last 14 days</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link href="/admin/dashboard/products/new" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                        + Add Product
                    </Link>
                </div>
            </div>

            <div className={styles.kpiGrid}>
                {stats.map((stat) => (
                    <div key={stat.label} className={styles.kpiCard}>
                        <div className={styles.kpiIcon} style={{ background: stat.bg, color: stat.color }}>
                            <stat.icon size={24} />
                        </div>
                        <div className={stat.label === 'New (7 Days)' && data.kpis.newInquiries > 0 ? styles.kpiContentHighlighted : styles.kpiContent}>
                            <p className={styles.kpiLabel}>{stat.label}</p>
                            <h3 className={styles.kpiValue}>{stat.value.toLocaleString()}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                    <TrendingUp size={20} color="#1F3D2B" />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Analytics In-Depth</h2>
                </div>
                <DashboardCharts
                    chartData={data.charts.inquiriesTrend}
                    categoryData={data.charts.productsByCategory}
                />
            </div>

            <div className={styles.dashboardGrid}>
                <div className={styles.card} style={{ gridColumn: 'span 12' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BarChart2 size={20} color="#1F3D2B" />
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Most Recent Inquiries</h3>
                        </div>
                        <Link href="/admin/dashboard/inquiries" className={styles.viewAllBtn}>
                            View All Inquiries
                        </Link>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Product</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentInquiries.map((inq: any) => (
                                    <tr key={inq.id} style={!inq.is_read ? { backgroundColor: '#f8fafc' } : {}}>
                                        <td style={{ color: '#64748b', fontSize: '0.875rem' }}>
                                            {new Date(inq.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: inq.is_read ? 500 : 700 }}>{inq.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{inq.email}</div>
                                        </td>
                                        <td>
                                            {inq.product ? (
                                                <span className={styles.productBadge}>{inq.product.name_en}</span>
                                            ) : (
                                                <span style={{ color: '#94a3b8' }}>General</span>
                                            )}
                                        </td>
                                        <td>
                                            {inq.is_read ?
                                                <span className={`${styles.statusBadge} ${styles.statusRead}`}>Read</span> :
                                                <span className={`${styles.statusBadge} ${styles.statusNew}`}>New</span>
                                            }
                                        </td>
                                        <td>
                                            <Link href="/admin/dashboard/inquiries" className={styles.iconBtn}>
                                                <Eye size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {recentInquiries.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                            No recent inquiries found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {role === 'SUPER_ADMIN' && recentLogs.length > 0 && (
                <div style={{ marginTop: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                        <History size={20} color="#1F3D2B" />
                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>System Integrity Log</h3>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>Action</th>
                                        <th>Entity</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentLogs.map((log: any) => (
                                        <tr key={log.id}>
                                            <td style={{ color: '#64748b', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                            <td>
                                                <span className={styles.statusBadge} style={{
                                                    backgroundColor: log.action === 'DELETE' ? '#fef2f2' : log.action === 'CREATE' ? '#f0fdf4' : '#f8fafc',
                                                    color: log.action === 'DELETE' ? '#991b1b' : log.action === 'CREATE' ? '#166534' : '#475569'
                                                }}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{log.entity}</td>
                                            <td style={{ fontSize: '0.875rem', color: '#64748b' }}>{log.details}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
