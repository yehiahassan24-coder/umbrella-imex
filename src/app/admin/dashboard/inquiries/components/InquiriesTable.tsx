"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../dashboard.module.css';
import { Mail, CheckCircle, Trash2, Eye, X, Phone, User, Calendar, PackageOpen, LayoutGrid, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { formatRelativeDate } from '@/lib/utils';

export type InquiryStatus = 'NEW' | 'CONTACTED' | 'QUOTED' | 'WON' | 'LOST';

export interface Inquiry {
    id: string;
    createdAt: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    is_read: boolean;
    status: InquiryStatus;
    product?: {
        name_en: string;
    } | null;
}

export default function InquiriesTable({ inquiries, role }: { inquiries: Inquiry[], role: string }) {
    const router = useRouter();
    const { showToast } = useToast();
    const [optimisticInquiries, setOptimisticInquiries] = useState(inquiries);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const updateInquiry = async (id: string, updates: Partial<Inquiry>) => {
        setIsUpdating(true);
        setOptimisticInquiries(prev => prev.map(inq =>
            inq.id === id ? { ...inq, ...updates } : inq
        ));

        try {
            const res = await fetch(`/api/inquiries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (res.ok) {
                router.refresh();
            } else {
                setOptimisticInquiries(inquiries);
                showToast('Failed to update status', 'error');
            }
        } catch {
            setOptimisticInquiries(inquiries);
            showToast('Error updating status', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this inquiry?')) return;

        const old = [...optimisticInquiries];
        setOptimisticInquiries(prev => prev.filter(inq => inq.id !== id));

        try {
            const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Inquiry deleted', 'success');
                router.refresh();
            } else {
                setOptimisticInquiries(old);
                showToast('Failed to delete inquiry', 'error');
            }
        } catch {
            setOptimisticInquiries(old);
            showToast('Error deleting inquiry', 'error');
        }
    };

    const getStatusStyle = (status: InquiryStatus) => {
        switch (status) {
            case 'NEW': return { bg: '#eff6ff', color: '#2563eb', border: '#dbeafe' };
            case 'CONTACTED': return { bg: '#fefce8', color: '#854d0e', border: '#fef08a' };
            case 'QUOTED': return { bg: '#f5f3ff', color: '#7c3aed', border: '#ede9fe' };
            case 'WON': return { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' };
            case 'LOST': return { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' };
            default: return { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' };
        }
    };

    const isOverdue = (createdAt: string) => {
        const receivedDate = new Date(createdAt);
        const now = new Date();
        const diffInHours = (now.getTime() - receivedDate.getTime()) / (1000 * 60 * 60);
        return diffInHours > 24;
    };

    return (
        <>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Pipeline Stage</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {optimisticInquiries.map(inq => {
                            const statusStyle = getStatusStyle(inq.status);
                            const overdue = inq.status === 'NEW' && isOverdue(inq.createdAt);

                            return (
                                <tr key={inq.id} className={inq.is_read ? styles.rowRead : styles.rowUnread}>
                                    <td style={{ color: overdue ? '#ef4444' : '#64748b', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {overdue && <AlertCircle size={14} />}
                                            {formatRelativeDate(inq.createdAt)}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{inq.name}</div>
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
                                        <select
                                            value={inq.status}
                                            onChange={(e) => updateInquiry(inq.id, { status: e.target.value as InquiryStatus })}
                                            disabled={isUpdating}
                                            className={styles.statusBadge}
                                            style={{
                                                backgroundColor: statusStyle.bg,
                                                color: statusStyle.color,
                                                borderColor: statusStyle.border,
                                                border: `1px solid ${statusStyle.border}`,
                                                cursor: 'pointer',
                                                appearance: 'none',
                                                padding: '4px 12px'
                                            }}
                                        >
                                            <option value="NEW">New Lead</option>
                                            <option value="CONTACTED">Contacted</option>
                                            <option value="QUOTED">Quoted</option>
                                            <option value="WON">Closed - Won</option>
                                            <option value="LOST">Closed - Lost</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button onClick={() => setSelectedInquiry(inq)} className={styles.iconBtn} title="View Details">
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => updateInquiry(inq.id, { is_read: !inq.is_read })}
                                                className={styles.iconBtn}
                                                title={inq.is_read ? "Mark as Unread" : "Mark as Read"}
                                            >
                                                {inq.is_read ? <Mail size={18} /> : <CheckCircle size={18} color="#16a34a" />}
                                            </button>
                                            {role === 'SUPER_ADMIN' && (
                                                <button onClick={() => handleDelete(inq.id)} className={`${styles.iconBtn} ${styles.deleteBtn}`} title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Inquiry Details Panel */}
            {selectedInquiry && (
                <div className={styles.modalOverlay} onClick={() => setSelectedInquiry(null)}>
                    <div className={styles.detailsPanel} onClick={e => e.stopPropagation()}>
                        <div className={styles.panelHeader}>
                            <h3>Inquiry Details</h3>
                            <button onClick={() => setSelectedInquiry(null)} className={styles.closeBtn}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.panelContent}>
                            <div className={styles.detailGroup}>
                                <div className={styles.detailLabel}><User size={16} /> Customer</div>
                                <div className={styles.detailValue}>{selectedInquiry.name}</div>
                            </div>

                            <div className={styles.detailGrid}>
                                <div className={styles.detailGroup}>
                                    <div className={styles.detailLabel}><Mail size={16} /> Email</div>
                                    <div className={styles.detailValue}>
                                        <a href={`mailto:${selectedInquiry.email}`}>{selectedInquiry.email}</a>
                                    </div>
                                </div>
                                <div className={styles.detailGroup}>
                                    <div className={styles.detailLabel}><Phone size={16} /> Phone</div>
                                    <div className={styles.detailValue}>{selectedInquiry.phone}</div>
                                </div>
                            </div>

                            <div className={styles.detailGrid}>
                                <div className={styles.detailGroup}>
                                    <div className={styles.detailLabel}><PackageOpen size={16} /> Product</div>
                                    <div className={styles.detailValue}>
                                        {selectedInquiry.product ? selectedInquiry.product.name_en : 'General Inquiry'}
                                    </div>
                                </div>
                                <div className={styles.detailGroup}>
                                    <div className={styles.detailLabel}><Calendar size={16} /> Received</div>
                                    <div className={styles.detailValue}>
                                        {new Date(selectedInquiry.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.detailGroup}>
                                <div className={styles.detailLabel}><LayoutGrid size={16} /> Current Status</div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                                    {(['NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST'] as InquiryStatus[]).map(s => {
                                        const active = selectedInquiry.status === s;
                                        const style = getStatusStyle(s);
                                        return (
                                            <button
                                                key={s}
                                                onClick={() => {
                                                    updateInquiry(selectedInquiry.id, { status: s });
                                                    setSelectedInquiry({ ...selectedInquiry, status: s });
                                                }}
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    border: active ? `2px solid ${style.color}` : '1px solid #e2e8f0',
                                                    backgroundColor: active ? style.bg : 'white',
                                                    color: active ? style.color : '#64748b',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {s}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={styles.messageBox}>
                                <div className={styles.detailLabel}>Message</div>
                                <div className={styles.messageContent}>
                                    {selectedInquiry.message}
                                </div>
                            </div>

                            <div className={styles.panelActions}>
                                <a
                                    href={`mailto:${selectedInquiry.email}?subject=Re: Inquiry about ${selectedInquiry.product?.name_en || 'Umbrella Products'}`}
                                    className="btn btn-primary"
                                    style={{ textDecoration: 'none', textAlign: 'center' }}
                                    onClick={() => updateInquiry(selectedInquiry.id, { status: 'CONTACTED', is_read: true })}
                                >
                                    Reply via Email
                                </a>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedInquiry(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
