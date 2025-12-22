"use client";
import React from 'react';
import Link from 'next/link';
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
    price: number | string; // Assuming number from DB but handled as string in UI potentially
    season: string;
    is_active?: boolean;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { t, language } = useLanguage();

    const name = language === 'en' ? product.name_en : product.name_fr;
    // const desc = language === 'en' ? product.desc_en : product.desc_fr;

    return (
        <div className={styles.card}>
            <div className={styles.image} style={{ /* Add actual image handling later */ }}></div>
            <div className={styles.info}>
                <div className={styles.meta}>
                    <span>{product.category}</span>
                    <span className="text-gold">{t('products.inStock') || 'In Stock'}</span>
                </div>
                <h3>{name}</h3>
                <p className={styles.origin}>{t('products.origin')}: {product.origin}</p>
                <p className={styles.price}>{product.price}</p>
                <Link href={`/products/${product.id}`} className={styles.link}>
                    {t('products.details') || 'Details'}
                </Link>
            </div>
        </div>
    );
}
