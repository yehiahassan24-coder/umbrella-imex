"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';
import styles from '@/app/page.module.css';
import ProductCard from '@/components/ProductCard';
import {
    Truck, CheckCircle, Globe, MessageCircle,
    ArrowRight, MapPin, Mail, Phone, Quote
} from 'lucide-react';

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

export default function HomeContent({ products }: { products: Product[] }) {
    const { t, language } = useLanguage();

    const features = [
        { icon: Truck, title: "Fast Delivery", desc: "Reliable global shipping network ensuring freshness." },
        { icon: CheckCircle, title: "Quality Assurance", desc: "Rigorous quality checks for premium produce." },
        { icon: Globe, title: "Global Reach", desc: "Connecting farmers to markets worldwide." },
        { icon: MessageCircle, title: "Bilingual Support", desc: "Seamless communication in English and French." },
    ];

    const testimonials = [
        { name: "John Smith", role: "Retail Manager, UK", text: "Umbrella Import delivers the freshest produce we've seen. Their reliability is unmatched." },
        { name: "Marie Dubois", role: "Restaurant Owner, France", text: "La qualité des fruits est exceptionnelle. Un partenaire de confiance pour mon restaurant." },
        { name: "Ahmed Hassan", role: "Wholesaler, UAE", text: "Professional service and great communication. Highly recommended for bulk imports." }
    ];

    return (
        <>
            {/* 2. Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>{t('home.heroTitle') || "Global Agricultural Import & Export, Simplified"}</h1>
                    <p>{t('home.heroSubtitle') || "Premium quality produce delivered worldwide, bilingual support"}</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                        <Link href="/products" className="btn btn-primary" style={{ minWidth: '160px' }}>
                            {t('home.viewAll') || "Explore Products"}
                        </Link>
                        <button
                            onClick={() => document.getElementById('inquiry-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="btn btn-secondary"
                            style={{ borderColor: 'white', color: 'white', minWidth: '160px' }}
                        >
                            Request Inquiry
                        </button>
                    </div>
                </div>
            </section>

            {/* 3. Features / Value Proposition */}
            <section className={styles.featuresSection}>
                <div className="container">
                    <div className="grid-4">
                        {features.map((f, i) => (
                            <div key={i} className={styles.featureCard}>
                                <div className={styles.featureIcon}>
                                    <f.icon size={32} />
                                </div>
                                <h3>{f.title}</h3>
                                <p style={{ color: '#666' }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Product Showcase */}
            <section className={styles.productSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>{t('home.featuredProducts')}</h2>
                    <div className={styles.productGrid}>
                        {products.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                    <div className="text-center" style={{ marginTop: '3rem' }}>
                        <Link href="/products" className="btn btn-secondary">
                            View All Products <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 5. Inquiry / Contact Preview */}
            <section id="inquiry-section" className={styles.inquirySection}>
                <div className="container">
                    <div className="text-center" style={{ marginBottom: '3rem' }}>
                        <h2>Interested in our products?</h2>
                        <p>Send us a quick inquiry and we&apos;ll get back to you within 24 hours.</p>
                    </div>
                    <div className={styles.inquiryCard}>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className={styles.formGroup}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name</label>
                                <input type="text" className={styles.input} placeholder="Your name" />
                            </div>
                            <div className={styles.formGroup}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
                                <input type="email" className={styles.input} placeholder="your@email.com" />
                            </div>
                            <div className={styles.formGroup}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Message</label>
                                <textarea className={styles.input} rows={4} placeholder="Tell us what you need..."></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                Send Inquiry
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* 6. Testimonials */}
            <section className={styles.testimonialSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
                    <div className={styles.testimonialGrid}>
                        {testimonials.map((t, i) => (
                            <div key={i} className={styles.testimonialCard}>
                                <Quote size={40} className={styles.quoteIcon} />
                                <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '1.5rem', color: '#4a5568' }}>&quot;{t.text}&quot;</p>
                                <div>
                                    <div style={{ fontWeight: 700, color: '#1E5B3A' }}>{t.name}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#718096' }}>{t.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. About / Values Section */}
            <section className={styles.aboutSection}>
                <div className="container">
                    <div className={styles.aboutGrid}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Reliable Global Trading</h2>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#4a5568', marginBottom: '2rem' }}>
                                At Umbrella Import & Export, we bridge the gap between premium local farmers and global markets.
                                Our commitment to sustainability, quality assurance, and efficient logistics ensures that you receive
                                only the best produce, exactly when you need it.
                            </p>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div>
                                    <h4 style={{ fontSize: '2rem', color: '#28A745', marginBottom: '0.5rem' }}>10+</h4>
                                    <span style={{ color: '#718096' }}>Years Experience</span>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '2rem', color: '#28A745', marginBottom: '0.5rem' }}>50+</h4>
                                    <span style={{ color: '#718096' }}>Global Partners</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.aboutImage}>
                            <Image
                                src="/images/about-illustration.png"
                                alt="Global Logistics"
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. CTA Banner */}
            <section className={styles.ctaBanner}>
                <div className="container">
                    <h2>Ready to streamline your global produce business?</h2>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2.5rem' }}>Join hundreds of satisfied partners worldwide.</p>
                    <Link href="/contact" className="btn btn-primary" style={{ backgroundColor: 'white', color: '#1E5B3A', padding: '16px 40px', fontSize: '1.1rem' }}>
                        Get Started Today
                    </Link>
                </div>
            </section>
        </>
    );
}
