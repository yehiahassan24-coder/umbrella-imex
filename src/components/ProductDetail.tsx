"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './ProductDetail.module.css';
import { ArrowLeft, CheckCircle, AlertCircle, FileText, Globe, Calendar, Package, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types';

export default function ProductDetail({ product }: { product: Product }) {
    const { t, language } = useLanguage();
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [selectedImage, setSelectedImage] = useState(product.images && product.images.length > 0 ? product.images[0] : null);

    // Derived content
    const name = language === 'en' ? product.name_en : product.name_fr;
    const desc = language === 'en' ? product.desc_en : product.desc_fr;

    // Form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        setStatus('idle');

        const formData = new FormData(e.currentTarget);
        const data = {
            productId: product.id,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message'),
        };

        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus('success');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className="container">
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/products" className={styles.backLink}>
                        <ArrowLeft size={18} /> {t('products.back')}
                    </Link>
                </div>

                <div className={styles.grid}>
                    {/* Left: Image Gallery */}
                    <div className={styles.imageContainer}>
                        {selectedImage ? (
                            <>
                                <div className={styles.mainImageWrapper}>
                                    <Image
                                        src={selectedImage}
                                        alt={name}
                                        width={800}
                                        height={800}
                                        className={styles.mainImage}
                                        priority
                                    />
                                </div>
                                {product.images && product.images.length > 1 && (
                                    <div className={styles.thumbnailList}>
                                        {product.images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className={`${styles.thumbnail} ${selectedImage === img ? styles.activeThumb : ''}`}
                                                onClick={() => setSelectedImage(img)}
                                            >
                                                <Image
                                                    src={img}
                                                    alt={`${name} ${idx + 1}`}
                                                    width={80}
                                                    height={80}
                                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className={styles.noImage}>
                                <span>No Image Available</span>
                            </div>
                        )}

                        {/* Quality Badge - Visual Trust */}
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '12px', border: '1px dashed #bbf7d0' }}>
                            <h4 style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                                <CheckCircle size={18} /> Quality Guaranteed
                            </h4>
                            <p style={{ fontSize: '0.9rem', color: '#14532d' }}>
                                This product is certified for export meeting ISO 9001 and Global G.A.P standards.
                            </p>
                        </div>
                    </div>

                    {/* Right: Details & Order */}
                    <div className={styles.info}>
                        <div className={styles.headerGroup}>
                            <span className={styles.category}>{product.category}</span>
                            <h1 className={styles.productTitle}>{name}</h1>
                            <div className={styles.priceRow}>
                                <span className={styles.priceTag}>
                                    {product.price ? `$${product.price.toFixed(2)}` : 'Contact for Pricing'}
                                    <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#64748b', marginLeft: '4px' }}>/ unit (FOB)</span>
                                </span>
                            </div>
                        </div>

                        <div className={styles.description}>
                            <p>{desc}</p>
                        </div>

                        <div className={styles.specsGrid}>
                            <div className={styles.specItem}>
                                <div className={styles.specIcon}><Globe size={20} /></div>
                                <div>
                                    <label>{t('products.origin')}</label>
                                    <span>{product.origin}</span>
                                </div>
                            </div>
                            <div className={styles.specItem}>
                                <div className={styles.specIcon}><Calendar size={20} /></div>
                                <div>
                                    <label>{t('products.season')}</label>
                                    <span>{product.season}</span>
                                </div>
                            </div>
                            <div className={styles.specItem}>
                                <div className={styles.specIcon}><Package size={20} /></div>
                                <div>
                                    <label>{t('products.moq')}</label>
                                    <span>{product.moq} kg</span>
                                </div>
                            </div>
                            <div className={styles.specItem}>
                                <div className={styles.specIcon}><TrendingUp size={20} /></div>
                                <div>
                                    <label>Availability</label>
                                    <span>{product.quantity > 0 ? 'In Stock' : 'Made to Order'}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.inquiryBox}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                                {t('products.inquireBtn') || "Request a Quote"}
                            </h3>

                            {status === 'success' && (
                                <div style={{ color: 'green', padding: '1rem', background: '#e6f4ea', borderRadius: '6px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <CheckCircle size={20} /> {t('products.successMsg')}
                                </div>
                            )}

                            {status === 'error' && (
                                <div style={{ color: '#d93025', padding: '1rem', background: '#fce8e6', borderRadius: '6px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <AlertCircle size={20} /> {t('products.errorMsg')}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className={styles.formGroup}>
                                        <label>{t('contact.formName')}</label>
                                        <input name="name" type="text" className={styles.input} required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Phone</label>
                                        <input name="phone" type="tel" className={styles.input} required />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{t('contact.formEmail')}</label>
                                    <input name="email" type="email" className={styles.input} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{t('contact.formMessage')}</label>
                                    <textarea
                                        name="message"
                                        rows={3}
                                        className={styles.textarea}
                                        defaultValue={`I am interested in bulk purchasing ${name} (MOQ: ${product.moq}kg). Please provide a quote for [Amount] tons to [Destination].`}
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} disabled={sending}>
                                    {sending ? t('products.sending') : "Send Inquiry Request"}
                                </button>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '1rem', textAlign: 'center' }}>
                                    By submitting this form, you agree to our Terms of Service. We typically reply within 2 hours.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
