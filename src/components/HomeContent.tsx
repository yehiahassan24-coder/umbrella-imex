"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from '@/app/page.module.css';
import { Product } from '@/types';

// Components
import { HowItWorks, GlobalReach, Benefits } from '@/components/StoryBlocks';
import ProductCarousel from '@/components/ProductCarousel';
import LogoCarousel from '@/components/LogoCarousel';
import KPICounters from '@/components/KPICounters';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import InquiryModal from '@/components/InquiryModal';
import BuyerSegments from '@/components/BuyerSegments';
import QualityCertifications from '@/components/QualityCertifications';
import StickyCTA from '@/components/StickyCTA';
import LeadershipMessage from '@/components/LeadershipMessage';
import CaseStudies from '@/components/CaseStudies';
import { track } from '@vercel/analytics/react';

export default function HomeContent({ products }: { products: Product[] }) {
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<string>('');

    const openModal = (productName?: string) => {
        setSelectedProduct(productName || '');
        setIsModalOpen(true);
        track('Inquiry Modal Opened', { product: productName || 'General' });
    };

    return (
        <>
            <InquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialProduct={selectedProduct}
            />
            <StickyCTA onOpenModal={() => openModal()} />

            {/* 1. Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>{t('home.heroTitle') || "Premium Egyptian Produce for Global Markets"}</h1>
                    <p>{t('home.heroSubtitle') || "Connecting growers to global buyers with certified quality and reliable logistics."}</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                        <Link href="/products" className="btn btn-primary" style={{ minWidth: '180px', padding: '1rem 2rem' }}>
                            Explore Products
                        </Link>
                        <button
                            onClick={() => openModal()}
                            className="btn btn-secondary"
                            style={{ borderColor: 'white', color: 'white', minWidth: '180px', padding: '1rem 2rem' }}
                        >
                            Request Custom Quote
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. Visual Storytelling - How It Works */}
            <HowItWorks />

            {/* 3. Buyer Segments (Who We Serve) */}
            <BuyerSegments onQuoteRequest={(s) => openModal(s)} />

            {/* 4. Rich Product Preview - Carousel */}
            <section className={styles.productSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>{t('home.featuredProducts') || "Seasonal Highlights"}</h2>
                    <ProductCarousel products={products} onQuoteRequest={openModal} />
                    <div className="text-center" style={{ marginTop: '2rem' }}>
                        <Link href="/products" style={{ textDecoration: 'underline', color: '#1E5B3A', fontWeight: 600 }}>
                            View Entire Catalog &rarr;
                        </Link>
                    </div>
                </div>
            </section>

            {/* 5. Quality Certifications (Gray Bg) */}
            <QualityCertifications />

            {/* 6. Metrics / Trust Signals */}
            <KPICounters />

            {/* 7. Leadership Message - NEW (Human Presence) */}
            <LeadershipMessage />

            {/* 8. Global Reach Map (Gray Bg) */}
            <GlobalReach />

            {/* 9. Customer Logos / Social Proof (White Bg) */}
            <LogoCarousel />

            {/* 10. StoryBlocks - Benefits (Light Bg) */}
            <Benefits />

            {/* 11. Secondary CTA "Safety Net" - NEW */}
            <section style={{ padding: '3rem 0', background: 'white', textAlign: 'center', borderTop: '1px solid #edf2f7' }}>
                <div className="container">
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2d3748' }}>Not ready for a full quote?</h3>
                    <button
                        onClick={() => openModal('General Consultation')}
                        style={{
                            background: 'transparent',
                            border: '2px solid #28a745',
                            color: '#28a745',
                            padding: '12px 24px',
                            borderRadius: '50px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#f0fff4' }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                        Talk to an Export Specialist
                    </button>
                </div>
            </section>

            {/* 12. Modern Testimonials (Gray Bg) */}
            <TestimonialCarousel />

            {/* 13. Case Studies - NEW (Success Stories) */}
            <CaseStudies />

            {/* 14. Final CTA Area */}
            <section className={styles.ctaBanner}>
                <div className="container">
                    <h2>Ready to elevate your supply chain?</h2>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2.5rem' }}> Partner with Umbrella Import for reliability you can taste.</p>
                    <button
                        onClick={() => openModal()}
                        className="btn btn-primary"
                        style={{ backgroundColor: 'white', color: '#1E5B3A', padding: '16px 40px', fontSize: '1.1rem', border: 'none' }}
                    >
                        Start Your Inquiry
                    </button>
                </div>
            </section>
        </>
    );
}
