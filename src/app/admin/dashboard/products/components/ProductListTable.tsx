"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../../dashboard.module.css';
import { Edit2, Trash2, ExternalLink, Copy, Loader2, Search, Filter } from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { authFetch } from '@/lib/api';

interface Product {
    id: string;
    name_en: string;
    category: string;
    price: number;
    quantity: number;
    is_active: boolean;
}

export default function ProductListTable({ products, role }: { products: Product[], role: string }) {
    const router = useRouter();
    const { showToast } = useToast();
    const [optimisticProducts, setOptimisticProducts] = useState(products);
    const [selected, setSelected] = useState<string[]>([]);
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    // Update optimistic state when props change (revalidation)
    React.useEffect(() => {
        setOptimisticProducts(products);
    }, [products]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelected(optimisticProducts.map(p => p.id));
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

    const handleBulkAction = async (action: 'delete' | 'update', data?: any) => {
        if (action === 'delete') {
            if (!confirm(`Are you sure you want to delete ${selected.length} products?`)) return;
        }

        setIsBulkProcessing(true);
        try {
            const res = await authFetch('/api/products/bulk', {
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
                // For delete, remove locally
                if (action === 'delete') {
                    setOptimisticProducts(prev => prev.filter(p => !selected.includes(p.id)));
                } else if (action === 'update') {
                    // Optimistic update for status
                    if (data.is_active !== undefined) {
                        setOptimisticProducts(prev => prev.map(p =>
                            selected.includes(p.id) ? { ...p, is_active: data.is_active } : p
                        ));
                    }
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

    const handleDuplicate = async (id: string) => {
        setIsBulkProcessing(true);
        try {
            const res = await authFetch(`/api/products/${id}/duplicate`, { method: 'POST' });
            if (res.ok) {
                showToast('Product duplicated successfully (saved as Hidden)', 'success');
                router.refresh();
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to duplicate', 'error');
            }
        } catch {
            showToast('Network error', 'error');
        } finally {
            setIsBulkProcessing(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
        const oldProducts = [...optimisticProducts];
        setOptimisticProducts(prev => prev.filter(p => p.id !== id));
        try {
            const res = await authFetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Product successfully deleted', 'success');
                router.refresh();
            } else {
                setOptimisticProducts(oldProducts);
                const data = await res.json();
                showToast(data.error || 'Failed to delete product', 'error');
            }
        } catch {
            setOptimisticProducts(oldProducts);
            showToast('Network error occurred', 'error');
        }
    };

    const filteredProducts = optimisticProducts.filter(p => {
        const matchesSearch = p.name_en.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = Array.from(new Set(products.map(p => p.category)));

    return (
        <div className={styles.tableWrapper}>
            {/* Search and Filters */}
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', background: 'white', borderRadius: '12px 12px 0 0' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.input}
                            style={{ paddingLeft: '40px', margin: 0, width: '100%', height: '42px' }}
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className={styles.select}
                        style={{ width: '180px', height: '42px', margin: 0 }}
                    >
                        <option value="ALL">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

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
                        onClick={() => handleBulkAction('update', { is_active: true })}
                        className={styles.iconBtn} style={{ color: 'white', display: 'flex', gap: '8px', fontSize: '0.9rem' }}
                    >
                        Activate
                    </button>
                    <button
                        disabled={isBulkProcessing}
                        onClick={() => handleBulkAction('update', { is_active: false })}
                        className={styles.iconBtn} style={{ color: 'white', display: 'flex', gap: '8px', fontSize: '0.9rem' }}
                    >
                        Disable
                    </button>
                    {role !== 'EDITOR' && (
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
                                checked={filteredProducts.length > 0 && selected.length === filteredProducts.length}
                                style={{ transform: 'scale(1.2)', accentColor: '#1F3D2B' }}
                            />
                        </th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map(p => (
                        <tr key={p.id} style={{ background: selected.includes(p.id) ? 'rgba(31, 61, 43, 0.03)' : 'transparent' }}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selected.includes(p.id)}
                                    onChange={() => handleSelect(p.id)}
                                    style={{ transform: 'scale(1.2)', accentColor: '#1F3D2B' }}
                                />
                            </td>
                            <td>
                                <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.name_en}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {p.id.substring(0, 8)}...</div>
                            </td>
                            <td>
                                <span className={styles.productBadge}>{p.category}</span>
                            </td>
                            <td style={{ fontWeight: 500 }}>
                                ${p.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontWeight: 600 }}>{p.quantity.toLocaleString()}</span>
                                    {p.quantity === 0 && (
                                        <span style={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 700 }}>OUT</span>
                                    )}
                                </div>
                            </td>
                            <td>
                                <span className={`${styles.statusBadge} ${p.is_active ? styles.statusNew : styles.statusRead}`}>
                                    {p.is_active ? 'Active' : 'Hidden'}
                                </span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <Link
                                        href={`/products/${p.id}`}
                                        className={styles.iconBtn}
                                        target="_blank"
                                        title="View on Website"
                                    >
                                        <ExternalLink size={18} />
                                    </Link>
                                    <Link
                                        href={`/admin/dashboard/products/${p.id}`}
                                        className={styles.iconBtn}
                                        title="Edit Product"
                                    >
                                        <Edit2 size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDuplicate(p.id)}
                                        className={styles.iconBtn}
                                        disabled={isBulkProcessing}
                                        title="Duplicate Product"
                                    >
                                        <Copy size={18} />
                                    </button>
                                    {role !== 'EDITOR' && (
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className={`${styles.iconBtn} ${styles.deleteBtn}`}
                                            title="Delete Product"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                        <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                    <Search size={48} style={{ opacity: 0.5 }} />
                                    <div>
                                        <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>No products found</p>
                                        <p style={{ fontSize: '0.875rem' }}>Try adjusting your search or filters.</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
