"use client";
import React from 'react';
import Image from 'next/image';
import { Search, ClipboardList, ShieldCheck, Truck, Clock, Headphones } from 'lucide-react';
import styles from './StoryBlocks.module.css';

export function HowItWorks() {
    return (
        <section className={`${styles.section} ${styles.bgLight}`}>
            <div className="container">
                <div className={styles.heading}>
                    <h2>How It Works</h2>
                    <p>From our farms to your facility in three simple steps.</p>
                </div>
                <div className={styles.stepsGrid}>
                    <div className={styles.stepCard}>
                        <div className={styles.stepIconWrapper}>
                            <Search size={32} />
                            <div className={styles.stepNumber}>1</div>
                        </div>
                        <h3 className={styles.stepTitle}>Sourcing & Selection</h3>
                        <p className={styles.stepDesc}>We handpick the best produce from trusted local farms, ensuring peak freshness and quality specifications.</p>
                    </div>
                    <div className={styles.stepCard}>
                        <div className={styles.stepIconWrapper}>
                            <ShieldCheck size={32} />
                            <div className={styles.stepNumber}>2</div>
                        </div>
                        <h3 className={styles.stepTitle}>Quality Control</h3>
                        <p className={styles.stepDesc}>Every batch undergoes rigorous inspection and certification to meet international export standards.</p>
                    </div>
                    <div className={styles.stepCard}>
                        <div className={styles.stepIconWrapper}>
                            <Truck size={32} />
                            <div className={styles.stepNumber}>3</div>
                        </div>
                        <h3 className={styles.stepTitle}>Global Logistics</h3>
                        <p className={styles.stepDesc}>We handle customs, cold chain logistics, and delivery to your preferred port or warehouse.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function GlobalReach() {
    return (
        <section className={`${styles.section} ${styles.bgGray}`}>
            <div className="container">
                <div className={styles.mapContent}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1e5b3a' }}>Serving Global Markets</h2>
                    <p style={{ fontSize: '1.2rem', color: '#4a5568', marginBottom: '1.5rem' }}>
                        Our specialized logistics network connects Egyptian agriculture with key markets in Europe, the Middle East, and Asia.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {['United Kingdom', 'France', 'Germany', 'Netherlands', 'UAE', 'Saudi Arabia', 'Russia'].map(country => (
                            <span key={country} style={{
                                background: '#e6fffa',
                                color: '#1E5B3A',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                border: '1px solid #b2f5ea'
                            }}>
                                {country}
                            </span>
                        ))}
                    </div>
                </div>
                <div className={styles.mapImageContainer}>
                    <Image
                        src="/images/global-map.png"
                        alt="Global Export Map"
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>
        </section>
    );
}

export function Benefits() {
    return (
        <section className={`${styles.section} ${styles.bgLight}`}>
            <div className="container">
                <div className={styles.heading}>
                    <h2>Why Choose Umbrella Import?</h2>
                    <p>We are more than just a supplier; we are your strategic partner.</p>
                </div>
                <div className={styles.benefitsGrid}>
                    <div className={styles.benefitCard}>
                        <Clock size={40} className={styles.benefitIcon} />
                        <h3>Just-In-Time Delivery</h3>
                        <p className={styles.stepDesc}>Optimized supply chain to ensure your produce arrives at peak freshness.</p>
                    </div>
                    <div className={styles.benefitCard}>
                        <ShieldCheck size={40} className={styles.benefitIcon} />
                        <h3>Certified Excellence</h3>
                        <p className={styles.stepDesc}>Full compliance with ISO, GlobalG.A.P, and EU phytosanitary standards.</p>
                    </div>
                    <div className={styles.benefitCard}>
                        <Headphones size={40} className={styles.benefitIcon} />
                        <h3>24/7 Expert Support</h3>
                        <p className={styles.stepDesc}>Dedicated account managers available round the clock in English and French.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
