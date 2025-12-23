"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../dashboard.module.css';
import { useToast } from '../../components/ToastContext';
import {
    Save, ArrowLeft, Loader2, Package,
    CheckCircle, Eye, UploadCloud, X, Search, Layers, Globe
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { authFetch } from '@/lib/api';

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
    images: string[];
    slug: string;
    sku: string | null;
    tags: string[];
    seoTitle: string | null;
    seoDesc: string | null;
    isFeatured: boolean;
}

interface Props {
    initialData?: Partial<ProductData>;
    isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: Props) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'en' | 'fr'>('en');
    const [previewMode, setPreviewMode] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const AUTO_SAVE_KEY = isEdit ? `product_draft_${initialData?.id}` : 'product_new_draft';

    const defaultState: ProductData = {
        name_en: '', name_fr: '',
        desc_en: '', desc_fr: '',
        category: 'Fruits',
        origin: '',
        season: '',
        price: '',
        moq: '',
        quantity: '',
        is_active: true,
        images: [],
        slug: '',
        sku: '',
        tags: [],
        seoTitle: '',
        seoDesc: '',
        isFeatured: false
    };

    const [formData, setFormData] = useState<ProductData>({
        ...defaultState,
        ...initialData,
        images: initialData?.images || [],
        tags: initialData?.tags || [],
        sku: initialData?.sku || '',
        slug: initialData?.slug || '',
        seoTitle: initialData?.seoTitle || '',
        seoDesc: initialData?.seoDesc || '',
    } as ProductData);

    const [tagInput, setTagInput] = useState(initialData?.tags?.join(', ') || '');
    const [touchedSlug, setTouchedSlug] = useState(!!initialData?.slug);

    useEffect(() => {
        if (!isEdit) {
            const saved = localStorage.getItem(AUTO_SAVE_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setFormData(prev => ({ ...prev, ...parsed }));
                    if (parsed.tags) setTagInput(parsed.tags.join(', '));
                } catch (e) { console.error("Failed to load draft", e); }
            }
        }
    }, [isEdit, AUTO_SAVE_KEY]);

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(formData));
        }, 1000);
        return () => clearTimeout(timer);
    }, [formData, AUTO_SAVE_KEY]);

    useEffect(() => {
        if (!isEdit && !touchedSlug && formData.name_en) {
            const generated = formData.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug: generated }));
        }
    }, [formData.name_en, touchedSlug, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
        const tagsArray = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, tags: tagsArray }));
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTouchedSlug(true);
        handleChange(e);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = async (files: FileList) => {
        setUploading(true);
        const newImages: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const data = new FormData();
            data.append('file', file);
            try {
                const res = await authFetch('/api/upload', { method: 'POST', body: data });
                if (res.ok) {
                    const json = await res.json();
                    newImages.push(json.url);
                } else {
                    showToast(`Failed to upload ${file.name}`, 'error');
                }
            } catch (err) {
                console.error(err);
                showToast('Upload network error', 'error');
            }
        }
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
        setUploading(false);
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const url = isEdit ? `/api/products/${formData.id}` : '/api/products';
        const method = isEdit ? 'PUT' : 'POST';
        const payload = {
            ...formData,
            price: parseFloat(formData.price as string),
            moq: parseInt(formData.moq as string),
            quantity: parseInt(formData.quantity as string)
        };

        try {
            const res = await authFetch(url, {
                method,
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                showToast(isEdit ? 'Product updated successfully' : 'Product created successfully', 'success');
                localStorage.removeItem(AUTO_SAVE_KEY);
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

    // --- RENDER CONTENT ---
    if (previewMode) {
        return (
            <div className={styles.previewContainer}>
                <div className={styles.header}>
                    <button onClick={() => setPreviewMode(false)} className="btn btn-secondary">
                        <ArrowLeft size={18} /> Exit Preview
                    </button>
                    <h1>Product Preview</h1>
                </div>
                <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            {formData.images.length > 0 ? (
                                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                                    <Image
                                        src={formData.images[0]}
                                        alt="Product"
                                        fill
                                        style={{ borderRadius: '8px', objectFit: 'cover' }}
                                    />
                                </div>
                            ) : (
                                <div style={{ height: '300px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>No Image</div>
                            )}
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                {formData.images.slice(1).map((img, i) => (
                                    <div key={i} style={{ position: 'relative', width: '60px', height: '60px' }}>
                                        <Image
                                            src={img}
                                            alt={`Preview ${i}`}
                                            fill
                                            style={{ borderRadius: '4px', objectFit: 'cover' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{formData.category}</span>
                            <h1 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{formData.name_en || 'Product Name'}</h1>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>${formData.price || '0.00'}</p>
                            <p style={{ color: '#64748b' }}>{formData.desc_en || 'Product description will appear here...'}</p>

                            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '1rem' }}>
                                <p><strong>Origin:</strong> {formData.origin}</p>
                                <p><strong>Season:</strong> {formData.season}</p>
                                <p><strong>MOQ:</strong> {formData.moq} kg</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
            {/* Header Actions */}
            <div className={styles.header} style={{ marginBottom: '2rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/dashboard/products" className={styles.backBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#64748b', transition: 'color 0.2s' }}>
                        <ArrowLeft size={20} />
                        <span style={{ fontWeight: 500 }}>Back</span>
                    </Link>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
                            {isEdit ? 'Edit Product' : 'Add New Product'}
                        </h1>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        type="button"
                        onClick={() => setPreviewMode(true)}
                        className="btn"
                        style={{ border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                    >
                        <Eye size={18} /> Preview
                    </button>
                    <button
                        form="product-form"
                        type="submit"
                        disabled={loading}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem',
                            background: '#1F3D2B', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '0.95rem', fontWeight: 600, boxShadow: '0 4px 6px -1px rgba(31, 61, 43, 0.2)'
                        }}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isEdit ? 'Save Changes' : 'Save Product'}
                    </button>
                </div>
            </div>

            <form id="product-form" onSubmit={handleSubmit} className="product-form-layout">
                {/* Main Column */}
                <div className="main-column" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Media Upload */}
                    <div className={styles.card}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                            <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}><UploadCloud size={20} /></div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Media</h3>
                        </div>

                        <div
                            className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileInput}
                                style={{ display: 'none' }}
                            />
                            <div style={{ textAlign: 'center' }}>
                                {uploading ? (
                                    <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: '#94a3b8' }} />
                                ) : (
                                    <UploadCloud size={32} style={{ margin: '0 auto', color: '#94a3b8' }} />
                                )}
                                <p style={{ margin: '1rem 0 0.5rem', fontWeight: 600, color: '#334155' }}>
                                    {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                                </p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>SVG, PNG, JPG or GIF (max. 5MB)</p>
                            </div>
                        </div>

                        {/* Image Preview List */}
                        {formData.images.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className={styles.imagePreview}>
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <Image
                                                src={img}
                                                alt={`Product ${idx}`}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                        <button type="button" onClick={() => removeImage(idx)} className={styles.removeBtn}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Basic Info Tabs */}
                    <div className={styles.card} style={{ overflow: 'hidden', padding: 0 }}>
                        <div style={{
                            background: '#f8fafc',
                            borderBottom: '1px solid #e2e8f0',
                            padding: '0 1rem',
                            display: 'flex',
                            gap: '1px'
                        }}>
                            <button
                                type="button"
                                onClick={() => setActiveTab('en')}
                                style={{
                                    padding: '1.25rem 1.5rem',
                                    border: 'none',
                                    background: activeTab === 'en' ? 'white' : 'transparent',
                                    borderTop: activeTab === 'en' ? '3px solid #ca8a04' : '3px solid transparent',
                                    color: activeTab === 'en' ? '#ca8a04' : '#64748b',
                                    fontWeight: activeTab === 'en' ? 700 : 600,
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    transition: 'all 0.2s',
                                    flex: 1, justifyContent: 'center'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>🇺🇸</span> English Details
                            </button>
                            <div style={{ width: '1px', background: '#e2e8f0', margin: '0.75rem 0' }} />
                            <button
                                type="button"
                                onClick={() => setActiveTab('fr')}
                                style={{
                                    padding: '1.25rem 1.5rem',
                                    border: 'none',
                                    background: activeTab === 'fr' ? 'white' : 'transparent',
                                    borderTop: activeTab === 'fr' ? '3px solid #ca8a04' : '3px solid transparent',
                                    color: activeTab === 'fr' ? '#ca8a04' : '#64748b',
                                    fontWeight: activeTab === 'fr' ? 700 : 600,
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    transition: 'all 0.2s',
                                    flex: 1, justifyContent: 'center'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>🇫🇷</span> French Details
                            </button>
                        </div>

                        <div style={{ padding: '2rem' }}>
                            <div style={{ display: activeTab === 'en' ? 'block' : 'none', animation: 'fadeIn 0.3s ease' }}>
                                <div className={styles.formGroup}>
                                    <label>Product Name (EN)</label>
                                    <input name="name_en" className={styles.input} value={formData.name_en} onChange={handleChange} placeholder="e.g. Fresh Red Apples" style={{ fontSize: '1.1rem', fontWeight: 500 }} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Description (EN)</label>
                                    <textarea name="desc_en" className={styles.textarea} rows={6} value={formData.desc_en} onChange={handleChange} placeholder="Product description..." style={{ lineHeight: '1.6' }} />
                                </div>
                            </div>

                            <div style={{ display: activeTab === 'fr' ? 'block' : 'none', animation: 'fadeIn 0.3s ease' }}>
                                <div className={styles.formGroup}>
                                    <label>Nom du Produit (FR)</label>
                                    <input name="name_fr" className={styles.input} value={formData.name_fr} onChange={handleChange} placeholder="ex. Pommes Rouges Fraîches" style={{ fontSize: '1.1rem', fontWeight: 500 }} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Description (FR)</label>
                                    <textarea name="desc_fr" className={styles.textarea} rows={6} value={formData.desc_fr} onChange={handleChange} placeholder="Description du produit..." style={{ lineHeight: '1.6' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEO & Metadata */}
                    <div className={styles.card}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                            <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}><Search size={20} /></div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>SEO & Metadata</h3>
                        </div>
                        <div className={styles.formGroup}>
                            <label>URL Slug</label>
                            <input name="slug" className={styles.input} value={formData.slug} onChange={handleSlugChange} placeholder="my-product-url" />
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Globe size={14} /> Full URL: <span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>https://umbrella.com/products/{formData.slug || '...'}</span>
                            </p>
                        </div>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>SEO Title</label>
                                <input name="seoTitle" className={styles.input} value={formData.seoTitle || ''} onChange={handleChange} placeholder="Meta title for Google" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>SEO Description</label>
                                <input name="seoDesc" className={styles.input} value={formData.seoDesc || ''} onChange={handleChange} placeholder="Meta description for Google" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="sidebar-column" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Status */}
                    <div className={styles.card}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                            <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}><CheckCircle size={20} /></div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Status</h3>
                        </div>
                        <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                            <label className={styles.toggleTile} style={{ borderColor: formData.is_active ? '#22c55e' : 'var(--color-border)', background: formData.is_active ? 'rgba(34, 197, 94, 0.05)' : 'white' }}>
                                <input name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange} />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: formData.is_active ? '#166534' : '#64748b' }}>{formData.is_active ? 'Active' : 'Draft'}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Visible on website</div>
                                </div>
                            </label>
                        </div>
                        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                            <label className={styles.toggleTile} style={{ borderColor: formData.isFeatured ? '#eab308' : 'var(--color-border)', background: formData.isFeatured ? 'rgba(234, 179, 8, 0.05)' : 'white' }}>
                                <input name="isFeatured" type="checkbox" checked={formData.isFeatured} onChange={handleChange} />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: formData.isFeatured ? '#854d0e' : '#64748b' }}>{formData.isFeatured ? 'Featured Product' : 'Standard'}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Promote on homepage</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Organization */}
                    <div className={styles.card}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                            <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}><Layers size={20} /></div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Organization</h3>
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
                            <label>Tags</label>
                            <input className={styles.input} value={tagInput} onChange={handleTagChange} placeholder="organic, sweet, seasonal" />
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className={styles.card}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                            <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}><Package size={20} /></div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Inventory</h3>
                        </div>

                        <div className={styles.formGroup}>
                            <label>SKU (Stock Keeping Unit)</label>
                            <input name="sku" className={styles.input} value={formData.sku || ''} onChange={handleChange} placeholder="e.g. FR-APP-001" style={{ fontFamily: 'monospace' }} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Price ($)</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b' }}>$</span>
                                <input name="price" type="number" step="0.01" className={styles.input} value={formData.price} onChange={handleChange} placeholder="0.00" style={{ paddingLeft: '28px' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className={styles.formGroup}>
                                <label>MOQ (kg)</label>
                                <input name="moq" type="number" className={styles.input} value={formData.moq} onChange={handleChange} placeholder="100" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Stock (kg)</label>
                                <input name="quantity" type="number" className={styles.input} value={formData.quantity} onChange={handleChange} placeholder="1000" />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Origin</label>
                            <input name="origin" className={styles.input} value={formData.origin} onChange={handleChange} placeholder="Country" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Season</label>
                            <input name="season" className={styles.input} value={formData.season} onChange={handleChange} placeholder="Summer" />
                        </div>
                    </div>
                </div>
            </form>

            <style jsx>{`
                .product-form-layout {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 2rem;
                }
                @media (max-width: 1024px) {
                    .product-form-layout { grid-template-columns: 1fr; }
                }
                
                .dropZone {
                    border: 2px dashed #cbd5e1;
                    border-radius: 12px;
                    padding: 3rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    background: #f8fafc;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .dropZone:hover, .dragActive {
                    border-color: #ca8a04;
                    background: #fefce8;
                    transform: translateY(-2px);
                }
                
                .imagePreview {
                    position: relative;
                    border-radius: 12px;
                    overflow: hidden;
                    height: 120px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    transition: all 0.2s;
                    group: preview;
                }
                .imagePreview:hover {
                    transform: scale(1.02);
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
                }
                .removeBtn {
                    position: absolute;
                    top: 6px; 
                    right: 6px;
                    background: rgba(0,0,0,0.6);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s;
                    backdrop-filter: blur(4px);
                    z-index: 10;
                }
                .removeBtn:hover { background: #ef4444; }
                
                 .toggleTile {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    cursor: pointer;
                    padding: 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    transition: all 0.2s;
                    background: white;
                }
                .toggleTile:hover {
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                    transform: translateY(-1px);
                    border-color: #cbd5e1;
                }
                .toggleTile input {
                    width: 20px;
                    height: 20px;
                    accent-color: #166534;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
