"use client";
import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';
import styles from '@/app/page.module.css';
import { Target, Heart, Award, Users, ShieldCheck, Globe, Star, TrendingUp } from 'lucide-react';

export default function About() {
    const { t } = useLanguage();

    const values = [
        {
            icon: Target,
            title: "Our Mission",
            desc: "To provide seamless global access to premium agricultural products while supporting local farming communities."
        },
        {
            icon: Heart,
            title: "Sustainability",
            desc: "Committed to eco-friendly practices that preserve our planet for future generations of farmers and consumers."
        },
        {
            icon: Award,
            title: "Quality First",
            desc: "Rigorous quality control standards to ensure every shipment meets and exceeds international expectations."
        },
        {
            icon: Users,
            title: "Global Partnership",
            desc: "Building long-lasting relationships based on trust, transparency, and mutual growth across borders."
        }
    ];

    return (
        <>
            {/* Hero Section */}
            <section className={styles.hero} style={{ height: '50vh', minHeight: '400px' }}>
                <div className={styles.heroContent}>
                    <h1 style={{ fontSize: '3.5rem' }}>{t('about.title')}</h1>
                    <p style={{ maxWidth: '600px' }}>Bridging the gap between premium harvests and global dinner tables.</p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="container" style={{ padding: '8rem 0' }}>
                <div className={styles.aboutGrid}>
                    <div>
                        <span style={{ color: '#28A745', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Since 2014</span>
                        <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', color: '#1E5B3A' }}>Cultivating Trust in International Trade</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#4a5568', marginTop: '1.5rem' }}>
                            {t('about.text') || "Umbrella Import & Export started with a simple vision: to make the world's finest agricultural products accessible to everyone, everywhere. What began as a small family operation has grown into a global network, yet our core values remain unchanged."}
                        </p>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#4a5568', marginTop: '1rem' }}>
                            {t('contact.aboutText2') || "We understand that in the world of import and export, reliability is the most important commodity. That's why we manage every step of the supply chain with meticulous attention to detail."}
                        </p>
                    </div>
                    <div className={styles.aboutImage}>
                        <Image
                            src="/images/about-story.png"
                            alt="Our Story"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <section style={{ backgroundColor: '#1E5B3A', padding: '5rem 0', color: 'white' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '0.5rem' }}>10+</h2>
                            <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>{t('contact.yearsExp') || 'Years of Excellence'}</p>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '0.5rem' }}>50+</h2>
                            <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>{t('contact.partners') || 'Global Partners'}</p>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '0.5rem' }}>1200+</h2>
                            <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Successful Shipments</p>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '0.5rem' }}>100%</h2>
                            <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>{t('contact.guarantee') || 'Satisfaction Rate'}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section style={{ backgroundColor: '#f8fafc', padding: '8rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', color: '#1E5B3A' }}>Our Core Values</h2>
                        <div style={{ width: '60px', height: '4px', backgroundColor: '#28A745', margin: '1rem auto' }}></div>
                    </div>
                    <div className="grid-4">
                        {values.map((v, i) => (
                            <div key={i} className={styles.featureCard} style={{ textAlign: 'left', padding: '2rem' }}>
                                <div className={styles.featureIcon} style={{ marginLeft: 0 }}>
                                    <v.icon size={32} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#1E5B3A' }}>{v.title}</h3>
                                <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.6' }}>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Global Vision Section */}
            <section className="container" style={{ padding: '8rem 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '5rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', height: '450px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}>
                        <Image
                            src="/images/hero-bg-new.png"
                            alt="Global Vision"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#28A745', marginBottom: '1rem' }}>
                            <Globe size={20} />
                            <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Global Network</span>
                        </div>
                        <h2 style={{ fontSize: '2.5rem', color: '#1E5B3A', marginBottom: '1.5rem' }}>Your Reliable Partner in Agricultural Trade</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <ShieldCheck className="text-green" style={{ flexShrink: 0 }} />
                                <p><strong>Certified Logistics:</strong> We use state-of-the-art cold chain technology to ensure maximum freshness across continents.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <TrendingUp className="text-green" style={{ flexShrink: 0 }} />
                                <p><strong>Market Insight:</strong> We provide our partners with real-time data to make informed buying and selling decisions.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <Star className="text-green" style={{ flexShrink: 0 }} />
                                <p><strong>Premium Support:</strong> Bilingual expert support (EN/FR) available for all import/export documentation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
