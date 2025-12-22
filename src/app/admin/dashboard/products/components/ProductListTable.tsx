"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../../dashboard.module.css';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '../../components/ToastContext';

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

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

        // Save old state in case we need to revert
        const oldProducts = [...optimisticProducts];
        setOptimisticProducts(prev => prev.filter(p => p.id !== id));

        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
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

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {optimisticProducts.map(p => (
                        <tr key={p.id}>
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
                    {optimisticProducts.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                                No products found. Click "Add Product" to create your first one.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
