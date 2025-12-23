"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../dashboard.module.css';
import { Mail, CheckCircle, Trash2, Eye, X, Phone, User, Calendar, PackageOpen, LayoutGrid, AlertCircle, ExternalLink, Download, Search, Filter } from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { formatRelativeDate } from '@/lib/utils';
import { authFetch } from '@/lib/api';

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
    const [selected, setSelected] = useState<string[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'ALL'>('ALL');
    const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');

    // Update optimistic state when props change
    React.useEffect(() => {
        setOptimisticInquiries(inquiries);
    }, [inquiries]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelected(optimisticInquiries.map(i => i.id));
        } else {
            setSelected([]);
        }
    };

    const handleSelect = (id: string) => {
        if (selected.includes(id)) {
            setSelected(prev => prev.filter(i => i !== id));
        } else {
            setSelected(prev => [...prev, id]);
        }
    };

    const handleBulkAction = async (action: 'delete' | 'mark_read' | 'update_status', data?: any) => {
        if (action === 'delete') {
            if (!confirm(`Are you sure you want to delete ${selected.length} inquiries?`)) return;
        }

        setIsBulkProcessing(true);
        try {
            const res = await authFetch('/api/inquiries/bulk', {
                method: 'POST',
                body: JSON.stringify({
                    action,
                    ids: selected,
                    data
                })
            });

            if (res.ok) {
                showToast(`Successfully processed ${selected.length} items`, 'success');
                setSelected([]);

                if (action === 'delete') {
                    setOptimisticInquiries(prev => prev.filter(p => !selected.includes(p.id)));
                } else if (action === 'mark_read') {
                    setOptimisticInquiries(prev => prev.map(p =>
                        selected.includes(p.id) ? { ...p, is_read: true } : p
                    ));
                } else if (action === 'update_status') {
                    setOptimisticInquiries(prev => prev.map(p =>
                        selected.includes(p.id) ? { ...p, status: data.status } : p
                    ));
                }
                router.refresh();
            } else {
                showToast('Bulk action failed', 'error');
            }
        } catch (e) {
            showToast('Network error', 'error');
        } finally {
            setIsBulkProcessing(false);
        }
    };

    const exportCSV = () => {
        const headers = ["Date", "Name", "Email", "Phone", "Product", "Message", "Status", "Is Read"];
        const rows = optimisticInquiries.map(inq => [
            new Date(inq.createdAt).toLocaleDateString(),
            `"${inq.name.replace(/"/g, '""')}"`,
            inq.email,
            inq.phone,
            `"${inq.product?.name_en || 'General'}"`,
            `"${inq.message.replace(/"/g, '""')}"`,
            inq.status,
            inq.is_read ? "Yes" : "No"
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `inquiries_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Export downloaded", 'success');
    };

    const updateInquiry = async (id: string, updates: Partial<Inquiry>) => {
        setIsUpdating(true);
        setOptimisticInquiries(prev => prev.map(inq =>
            inq.id === id ? { ...inq, ...updates } : inq
        ));

        try {
            const res = await authFetch(`/api/inquiries/${id}`, {
                method: 'PATCH',
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
            const res = await authFetch(`/api/inquiries/${id}`, { method: 'DELETE' });
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

    const filteredInquiries = optimisticInquiries.filter(inq => {
        const matchesSearch =
            inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (inq.product && inq.product.name_en.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;

        const date = new Date(inq.createdAt);
        const now = new Date();
        let matchesDate = true;
        if (dateFilter === 'TODAY') {
            matchesDate = date.toDateString() === now.toDateString();
        } else if (dateFilter === 'WEEK') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = date >= weekAgo;
        } else if (dateFilter === 'MONTH') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = date >= monthAgo;
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    return (
        <>
            {/* Header Controls */}
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', background: 'white', borderRadius: '12px 12px 0 0' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search by customer, email or product..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.input}
                                style={{ paddingLeft: '40px', margin: 0, width: '100%', height: '42px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className={styles.select}
                                style={{ width: '140px', height: '42px', margin: 0 }}
                            >
                                <option value="ALL">All Status</option>
                                <option value="NEW">New</option>
                                <option value="CONTACTED">Contacted</option>
                                <option value="QUOTED">Quoted</option>
                                <option value="WON">Won</option>
                                <option value="LOST">Lost</option>
                            </select>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value as any)}
                                className={styles.select}
                                style={{ width: '140px', height: '42px', margin: 0 }}
                            >
                                <option value="ALL">All Time</option>
                                <option value="TODAY">Today</option>
                                <option value="WEEK">Last 7 Days</option>
                                <option value="MONTH">Last 30 Days</option>
                            </select>
                        </div>
                    </div>
                    <button onClick={exportCSV} className="btn btn-secondary" style={{ display: 'flex', gap: '8px', fontSize: '0.875rem', height: '42px' }}>
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                {/* Bulk Actions Bar */}
                {selected.length > 0 && (
                    <div style={{
                        position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                        background: '#1F3D2B', color: 'white', padding: '1rem 2rem', borderRadius: '50px',
                        display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        zIndex: 1000, minWidth: '400px', justifyContent: 'center', animation: 'slideUp 0.3s ease'
                    }}>
                        <span style={{ fontWeight: 600 }}>{selected.length} Selected</span>
                        <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
                        <button
                            disabled={isBulkProcessing}
                            onClick={() => handleBulkAction('mark_read')}
                            className={styles.iconBtn} style={{ color: 'white', display: 'flex', gap: '8px', fontSize: '0.9rem' }}
                        >
                            <Mail size={16} /> Mark Read
                        </button>
                        {role === 'SUPER_ADMIN' && (
                            <button
                                disabled={isBulkProcessing}
                                onClick={() => handleBulkAction('delete')}
                                className={styles.iconBtn} style={{ color: '#ff8a80', display: 'flex', gap: '8px', fontSize: '0.9rem' }}
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        )}
                        <button
                            onClick={() => setSelected([])}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
                            title="Cancel Selection"
                        >
                            <ExternalLink size={16} style={{ transform: 'rotate(45deg)' }} />
                        </button>
                    </div>
                )}

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}>
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={filteredInquiries.length > 0 && selected.length === filteredInquiries.length}
                                    style={{ transform: 'scale(1.2)', accentColor: '#1F3D2B' }}
                                />
                            </th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Pipeline Stage</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInquiries.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                        <Search size={48} style={{ opacity: 0.5 }} />
                                        <div>
                                            <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>No matching inquiries</p>
                                            <p style={{ fontSize: '0.875rem' }}>Try adjusting your filters or search terms.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredInquiries.map(inq => {
                            const statusStyle = getStatusStyle(inq.status);
                            const overdue = inq.status === 'NEW' && isOverdue(inq.createdAt);

                            return (
                                <tr key={inq.id} className={inq.is_read ? styles.rowRead : styles.rowUnread} style={{ background: selected.includes(inq.id) ? 'rgba(31, 61, 43, 0.03)' : undefined }}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(inq.id)}
                                            onChange={() => handleSelect(inq.id)}
                                            style={{ transform: 'scale(1.2)', accentColor: '#1F3D2B' }}
                                        />
                                    </td>
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
