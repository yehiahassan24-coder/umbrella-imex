"use client";
import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import ProductCard from './ProductCard';
import { Filter } from 'lucide-react';
import styles from '@/app/page.module.css'; // Reuse grid styles or move to module

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

interface ProductListProps {
    products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('All');

    // Get unique categories
    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);

    return (
        <section>
            <div className="container">
                <h1 style={{ marginBottom: '2rem' }}>{t('products.title')}</h1>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {/* Sidebar */}
                    <div style={{ width: '250px', flex: '0 0 250px', background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                            <Filter size={20} className="text-gold" />
                            <h3 style={{ fontSize: '1.1rem', marginBottom: 0, color: 'var(--color-forest-green)' }}>{t('products.filters') || 'Filters'}</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    style={{
                                        textAlign: 'left',
                                        background: filter === cat ? 'var(--color-forest-green)' : 'transparent',
                                        color: filter === cat ? 'white' : 'inherit',
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        fontWeight: filter === cat ? '600' : '400',
                                        border: '1px solid transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <div className={styles.productGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                            {filtered.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                            {filtered.length === 0 && <p>{t('products.noProducts') || 'No products found.'}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
