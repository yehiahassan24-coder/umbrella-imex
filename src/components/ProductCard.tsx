"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './ProductCard.module.css';

interface Product {
    id: string;
    name_en: string;
    name_fr: string;
    desc_en: string;
    desc_fr: string;
    category: string;
    origin: string;
    price: number | string;
    season: string;
    is_active?: boolean;
    images?: string[];
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { t, language } = useLanguage();

    const name = language === 'en' ? product.name_en : product.name_fr;
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;

    return (
        <div className={styles.card}>
            <div className={styles.image}>
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontWeight: 500 }}>
                        No Image
                    </div>
                )}

                {/* Category Badge */}
                <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)',
                    padding: '6px 14px', borderRadius: '50px',
                    fontSize: '0.75rem', fontWeight: 700, color: '#166534',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    letterSpacing: '0.5px', textTransform: 'uppercase'
                }}>
                    {product.category}
                </div>
            </div>

            <div className={styles.info}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#1e293b', lineHeight: 1.4 }}>{name}</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', background: '#f8fafc', padding: '4px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        {product.origin}
                    </span>
                    {product.is_active !== false && (
                        <span style={{ fontSize: '0.8rem', color: '#15803d', background: '#dcfce7', padding: '4px 10px', borderRadius: '6px' }}>
                            In Stock
                        </span>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                    <div>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Price</span>
                        <p style={{ fontSize: '1.4rem', fontWeight: 700, color: '#166534', margin: 0, lineHeight: 1 }}>
                            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                        </p>
                    </div>
                    <Link
                        href={`/products/${product.id}`}
                        className={styles.link}
                        style={{
                            background: '#166534',
                            color: 'white',
                            padding: '10px 24px',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 6px -1px rgba(22, 101, 52, 0.2)'
                        }}
                    >
                        {t('products.details') || 'View Details'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
