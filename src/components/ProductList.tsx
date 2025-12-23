"use client";
import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import ProductCard from './ProductCard';
import { Filter, Search, ChevronDown, Leaf, MapPin, Calendar, Scale, X } from 'lucide-react';
import styles from '@/app/page.module.css';
import { Product } from '@/types';

interface ProductListProps {
    products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
    const { t } = useLanguage();

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [originFilter, setOriginFilter] = useState('All');
    const [seasonFilter, setSeasonFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Derived Lists for Dropdowns
    const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);
    const origins = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.origin)))], [products]);
    const seasons = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.season)))], [products]);

    // Filtering Logic
    const filtered = products
        .filter(p => {
            const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
            const matchesOrigin = originFilter === 'All' || p.origin === originFilter;
            const matchesSeason = seasonFilter === 'All' || p.season === seasonFilter;
            const matchesSearch =
                p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.name_fr.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesOrigin && matchesSeason && matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === 'priceLow') return a.price - b.price;
            if (sortBy === 'priceHigh') return b.price - a.price;
            if (sortBy === 'name') return a.name_en.localeCompare(b.name_en);
            return 0; // Default (newest)
        });

    const activeFiltersCount = [
        categoryFilter !== 'All',
        originFilter !== 'All',
        seasonFilter !== 'All'
    ].filter(Boolean).length;

    const clearFilters = () => {
        setCategoryFilter('All');
        setOriginFilter('All');
        setSeasonFilter('All');
        setSearchQuery('');
    };

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
                {/* Mobile Filter Toggle */}
                <div className="lg-hidden" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                        className="btn"
                        style={{
                            background: 'white', border: '1px solid #e2e8f0', color: '#1e293b',
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px'
                        }}
                    >
                        <Filter size={18} /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                    </button>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white' }}
                    >
                        <option value="newest">Newest</option>
                        <option value="priceLow">Price: Low to High</option>
                        <option value="priceHigh">Price: High to Low</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>

                    {/* Sidebar / Filters */}
                    <aside className={`filter-sidebar ${mobileFiltersOpen ? 'open' : ''}`} style={{
                        width: '280px', flex: '0 0 280px',
                        background: 'white', padding: '2rem',
                        borderRadius: '16px', border: '1px solid #eef2f6',
                        position: 'sticky', top: '100px',
                        height: 'fit-content', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Filter size={20} color="#28A745" /> Filters
                            </h3>
                            {activeFiltersCount > 0 && (
                                <button onClick={clearFilters} style={{ fontSize: '0.85rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                                    Clear All
                                </button>
                            )}
                        </div>

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
                        <div className="filter-group" style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {categories.map(cat => (
                                    <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '4px 0' }}>
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={categoryFilter === cat}
                                            onChange={() => setCategoryFilter(cat)}
                                            style={{ accentColor: '#28A745' }}
                                        />
                                        <span style={{ color: categoryFilter === cat ? '#166534' : '#64748b', fontWeight: categoryFilter === cat ? 600 : 400 }}>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Origin */}
                        <div className="filter-group" style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Origin</h4>
                            <select
                                value={originFilter}
                                onChange={(e) => setOriginFilter(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#334155' }}
                            >
                                {origins.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>

                        {/* Season */}
                        <div className="filter-group" style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Season</h4>
                            <select
                                value={seasonFilter}
                                onChange={(e) => setSeasonFilter(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#334155' }}
                            >
                                {seasons.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {/* Desktop Sort (Hidden on Mobile) */}
                        <div className="mobile-hidden">
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort By</h4>
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
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div className={styles.productGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
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
                                        onClick={clearFilters}
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

            <style jsx>{`
                .lg-hidden { display: none; }
                .mobile-hidden { display: block; }
                
                @media (max-width: 900px) {
                    .lg-hidden { display: flex; }
                    .mobile-hidden { display: none !important; }
                    
                    .filter-sidebar {
                        display: none;
                        position: fixed;
                        top: 0; left: 0; right: 0; bottom: 0;
                        width: 100% !important;
                        height: 100vh !important;
                        z-index: 100;
                        overflow-y: auto;
                        border-radius: 0 !important;
                    }
                    
                    .filter-sidebar.open {
                        display: block;
                    }
                }
            `}</style>
        </section>
    );
}
