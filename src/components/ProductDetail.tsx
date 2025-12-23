"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './ProductDetail.module.css';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface Product {
    id: string;
    name_en: string;
    name_fr: string;
    desc_en: string;
    desc_fr: string;
    category: string;
    origin: string;
    price: number;
    season: string;
    moq: number;
    quantity: number;
    images?: string[];
}

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
                <Link href="/products" className={styles.backLink}>
                    <ArrowLeft size={18} /> {t('products.back')}
                </Link>

                <div className={styles.grid}>
                    {/* Left: Image */}
                    <div className={styles.imageContainer}>
                        {selectedImage ? (
                            <>
                                <Image
                                    src={selectedImage}
                                    alt={name}
                                    width={600}
                                    height={600}
                                    className={styles.mainImage}
                                    style={{ width: '100%', height: 'auto', borderRadius: '12px', objectFit: 'cover', aspectRatio: '1/1' }}
                                    priority
                                />
                                {product.images && product.images.length > 1 && (
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                                        {product.images.map((img, idx) => (
                                            <Image
                                                key={idx}
                                                src={img}
                                                alt={`${name} ${idx + 1}`}
                                                width={80}
                                                height={80}
                                                onClick={() => setSelectedImage(img)}
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '8px',
                                                    objectFit: 'cover',
                                                    cursor: 'pointer',
                                                    border: selectedImage === img ? '2px solid var(--color-gold)' : '2px solid transparent',
                                                    flexShrink: 0
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{ width: '100%', height: '400px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '1.5rem', borderRadius: '12px', flexDirection: 'column', gap: '1rem' }}>
                                <span>No Image Available</span>
                            </div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className={styles.info}>
                        <span className={styles.category}>{product.category}</span>
                        <h1>{name}</h1>
                        <div className={styles.description}>
                            <p>{desc}</p>
                        </div>

                        <div className={styles.specs}>
                            <div className={styles.specItem}>
                                <label>{t('products.origin')}</label>
                                <span>{product.origin}</span>
                            </div>
                            <div className={styles.specItem}>
                                <label>{t('products.season')}</label>
                                <span>{product.season}</span>
                            </div>
                            <div className={styles.specItem}>
                                <label>{t('products.moq')}</label>
                                <span>{product.moq} kg</span>
                            </div>
                            <div className={styles.specItem}>
                                <label>{t('products.price')}</label>
                                <span>${product.price ? product.price.toFixed(2) : 'Contact'}</span>
                            </div>
                        </div>

                        <div className={styles.inquiryBox}>
                            <h3>{t('products.inquireBtn')}</h3>

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
                                <div className={styles.formGroup}>
                                    <label>{t('contact.formName')}</label>
                                    <input name="name" type="text" className={styles.input} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{t('contact.formEmail')}</label>
                                    <input name="email" type="email" className={styles.input} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Phone / WhatsApp</label>
                                    <input name="phone" type="tel" className={styles.input} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{t('contact.formMessage')}</label>
                                    <textarea name="message" rows={4} className={styles.textarea} defaultValue={`I am interested in buying ${name}. Please send me a quote for...`} required></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={sending}>
                                    {sending ? t('products.sending') : t('contact.submit')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
