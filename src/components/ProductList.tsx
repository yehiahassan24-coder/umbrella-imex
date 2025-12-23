"use client";
import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import ProductCard from './ProductCard';
import { Filter, Search, ChevronDown, Leaf } from 'lucide-react';
import styles from '@/app/page.module.css';

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
    images?: string[];
}

interface ProductListProps {
    products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Get unique categories
    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    // Filter and Sort Logic
    const filtered = products
        .filter(p => {
            const matchesCategory = filter === 'All' || p.category === filter;
            const matchesSearch = p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.name_fr.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === 'priceLow') return a.price - b.price;
            if (sortBy === 'priceHigh') return b.price - a.price;
            if (sortBy === 'name') return a.name_en.localeCompare(b.name_en);
            return 0; // Default (newest) is already sorted from server
        });

    return (
        <section style={{ background: '#f8fafc', minHeight: '100vh', padding: '3rem 0' }}>
            {/* Header Banner */}
            <div className="container" style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', color: '#1E5B3A', marginBottom: '1rem', position: 'relative', display: 'inline-block' }}>
                    {t('products.title')}
                    <Leaf size={32} style={{ position: 'absolute', top: -15, right: -30, color: '#48bb78', transform: 'rotate(15deg)' }} />
                </h1>
                <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Explore our premium selection of fresh fruits and vegetables, sourced directly from the best farms worldwide.
                </p>
            </div>

            <div className="container">
                <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                    {/* Sidebar / Filters */}
                    <aside style={{
                        width: '280px', flex: '0 0 280px',
                        background: 'white', padding: '2rem',
                        borderRadius: '16px', border: '1px solid #eef2f6',
                        position: 'sticky', top: '100px',
                        height: 'fit-content', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        {/* Search */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px 12px 12px 40px',
                                        borderRadius: '8px', border: '1px solid #e2e8f0',
                                        fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Filter size={18} color="#28A745" /> Categories
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        style={{
                                            textAlign: 'left',
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            background: filter === cat ? '#f0fdf4' : 'transparent',
                                            color: filter === cat ? '#166534' : '#64748b',
                                            border: filter === cat ? '1px solid #bbf7d0' : '1px solid transparent',
                                            fontWeight: filter === cat ? '600' : '400',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {cat}
                                        {filter === cat && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#166534' }} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#1e293b' }}>Sort By</h3>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    width: '100%', padding: '10px', borderRadius: '8px',
                                    border: '1px solid #e2e8f0', color: '#475569',
                                    backgroundColor: 'white', cursor: 'pointer'
                                }}
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="priceLow">Price: Low to High</option>
                                <option value="priceHigh">Price: High to Low</option>
                                <option value="name">Name (A-Z)</option>
                            </select>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <div className={styles.productGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                            {filtered.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}

                            {filtered.length === 0 && (
                                <div style={{
                                    gridColumn: '1 / -1',
                                    textAlign: 'center',
                                    padding: '5rem',
                                    background: 'white',
                                    borderRadius: '16px',
                                    color: '#64748b',
                                    border: '1px dashed #e2e8f0'
                                }}>
                                    <Leaf size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                                    <p style={{ fontSize: '1.1rem' }}>No products found matching your criteria.</p>
                                    <button
                                        onClick={() => { setFilter('All'); setSearchQuery(''); }}
                                        style={{
                                            marginTop: '1rem', color: '#28A745', fontWeight: 600,
                                            borderBottom: '1px solid currentColor', background: 'none'
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {filtered.length > 0 && (
                            <div style={{ marginTop: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                                Showing {filtered.length} products
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
