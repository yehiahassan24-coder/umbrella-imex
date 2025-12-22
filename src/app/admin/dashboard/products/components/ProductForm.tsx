"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../dashboard.module.css';
import { useToast } from '../../components/ToastContext';
import { Save, ArrowLeft, Loader2, Globe, FileText, Settings, Database } from 'lucide-react';
import Link from 'next/link';

interface ProductData {
    id?: string;
    name_en: string;
    name_fr: string;
    desc_en: string;
    desc_fr: string;
    category: string;
    origin: string;
    season: string;
    price: number | string;
    moq: number | string;
    quantity: number | string;
    is_active: boolean;
}

interface Props {
    initialData?: ProductData;
    isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: Props) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<ProductData>(initialData || {
        name_en: '', name_fr: '',
        desc_en: '', desc_fr: '',
        category: 'Fruits',
        origin: '',
        season: '',
        price: '',
        moq: '',
        quantity: '',
        is_active: true
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const url = isEdit ? `/api/products/${formData.id}` : '/api/products';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                showToast(isEdit ? 'Product updated successfully' : 'Product created successfully', 'success');
                router.push('/admin/dashboard/products');
                router.refresh();
            } else {
                const data = await res.json();
                showToast(data.error || 'Operation failed', 'error');
            }
        } catch {
            showToast('Network error occurred', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px' }}>
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/dashboard/products" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#64748b' }}>
                        <ArrowLeft size={20} />
                        Back to list
                    </Link>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        form="product-form"
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem' }}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isEdit ? 'Save Changes' : 'Create Product'}
                    </button>
                </div>
            </div>

            <form id="product-form" onSubmit={handleSubmit} className={styles.formLayout}>
                <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#0f172a' }}>
                        <Globe size={18} />
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Localized Information</h3>
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Product Name (English)</label>
                            <input name="name_en" className={styles.input} value={formData.name_en} onChange={handleChange} required placeholder="e.g. Fresh Red Apples" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Product Name (French)</label>
                            <input name="name_fr" className={styles.input} value={formData.name_fr} onChange={handleChange} required placeholder="e.g. Pommes Rouges Fraîches" />
                        </div>
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Description (English)</label>
                            <textarea name="desc_en" className={styles.textarea} rows={4} value={formData.desc_en} onChange={handleChange} required placeholder="Describe the product for English speakers..." />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Description (French)</label>
                            <textarea name="desc_fr" className={styles.textarea} rows={4} value={formData.desc_fr} onChange={handleChange} required placeholder="Décrivez le produit pour les francophones..." />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className={styles.card}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#0f172a' }}>
                            <Settings size={18} />
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Classification</h3>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Category</label>
                            <select name="category" className={styles.select} value={formData.category} onChange={handleChange}>
                                <option value="Fruits">Fruits</option>
                                <option value="Vegetables">Vegetables</option>
                                <option value="Spices">Spices</option>
                                <option value="Grains">Grains</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Origin Country</label>
                            <input name="origin" className={styles.input} value={formData.origin} onChange={handleChange} required placeholder="e.g. Egypt" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Harvest Season</label>
                            <input name="season" className={styles.input} value={formData.season} onChange={handleChange} required placeholder="e.g. Winter / Summer" />
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#0f172a' }}>
                            <Database size={18} />
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Inventory & Pricing</h3>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Price ($ per unit)</label>
                            <input name="price" type="number" step="0.01" className={styles.input} value={formData.price} onChange={handleChange} required placeholder="0.00" />
                        </div>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>MOQ (kg)</label>
                                <input name="moq" type="number" className={styles.input} value={formData.moq} onChange={handleChange} required placeholder="100" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Stock (kg)</label>
                                <input name="quantity" type="number" className={styles.input} value={formData.quantity} onChange={handleChange} required placeholder="1000" />
                            </div>
                        </div>

                        <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                                <input name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Visible on Website</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>If unchecked, customers won't see this product.</div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </form>

            <style jsx>{`
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
