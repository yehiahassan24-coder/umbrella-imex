"use client";
import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import styles from '@/app/page.module.css';
import Link from 'next/link';
import { CheckCircle, Globe, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export interface Product {
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
}

export default function HomeContent({ products }: { products: Product[] }) {
    const { t } = useLanguage();

    return (
        <>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>{t('home.heroTitle')}</h1>
                    <p>{t('home.heroSubtitle')}</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                        <Link href="/products" className="btn btn-primary">{t('home.viewAll')}</Link>
                        <Link href="/contact" className="btn btn-secondary">{t('home.ctaButton')}</Link>
                    </div>
                </div>
            </section>

            <section className="container">
                <h2 className={styles.sectionTitle}>{t('home.whyUmbrella')}</h2>
                <div className="grid-4">
                    <div className={styles.card}>
                        <div className={styles.cardIcon}><ShieldCheck size={40} /></div>
                        <h3>{t('home.why1')}</h3>
                        <p>{t('home.why1desc')}</p>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardIcon}><TrendingUp size={40} /></div>
                        <h3>{t('home.why2')}</h3>
                        <p>{t('home.why2desc')}</p>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardIcon}><Globe size={40} /></div>
                        <h3>{t('home.why3')}</h3>
                        <p>{t('home.why3desc')}</p>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardIcon}><CheckCircle size={40} /></div>
                        <h3>{t('home.why4')}</h3>
                        <p>{t('home.why4desc')}</p>
                    </div>
                </div>
            </section>

            <section className="container" style={{ paddingTop: '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: 0 }}>{t('home.featuredProducts')}</h2>
                    <Link href="/products" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-gold)', fontWeight: 'bold' }}>
                        {t('home.viewAll')} <ArrowRight size={18} />
                    </Link>
                </div>

                <div className={styles.productGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                    {products.length === 0 && <p style={{ textAlign: 'center', width: '100%' }}>Coming Soon!</p>}
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className="container">
                    <h2>{t('home.ctaTitle')}</h2>
                    <p style={{ marginBottom: '2rem', fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem' }}>{t('home.ctaText')}</p>
                    <Link href="/contact" className="btn btn-primary" style={{ backgroundColor: 'white', color: 'var(--color-forest-green)' }}>
                        {t('home.ctaButton')}
                    </Link>
                </div>
            </section>
        </>
    );
}
