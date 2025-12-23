import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import styles from './RetailSolution.module.css';
import {
    Thermometer, Package, Clock, Eye,
    ShieldCheck, Globe, FileCheck, AlertCircle,
    Building2, Tag, Star, ArrowRight,
    CheckCircle, TrendingUp, ArrowDownRight,
    Search, LayoutGrid, Calendar
} from 'lucide-react';
import InquiryModalWrapper from './InquiryModalWrapper';

export const metadata: Metadata = {
    title: 'Retail Shelf-Life Solutions | Umbrella Import & Export',
    description: 'Optimized cold-chain logistics and export-grade handling designed for supermarkets and retail chains that demand maximum shelf life and premium appearance.',
};

export default function RetailSolutionPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Retail Shelf-Life Solutions",
        "provider": {
            "@type": "Organization",
            "name": "Umbrella Import & Export",
            "url": "https://umbrella-imex.vercel.app"
        },
        "description": "Optimized cold-chain logistics for supermarket fresh produce shelf-life extension."
    };

    return (
        <main className={styles.pageContainer}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* 1. Hero Section */}
            <section className={styles.hero}>
                <Image
                    src="/images/supermarket_fresh_shelf_hero.png"
                    alt="Fresh produce on supermarket shelves"
                    fill
                    className={styles.heroImage}
                    priority
                />
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <h1>Produce That Arrives Shelf-Ready — Every Time</h1>
                    <p>Optimized cold-chain logistics and export-grade handling designed for supermarkets and retail chains that demand maximum shelf life and premium appearance.</p>
                    <div className={styles.ctaGroup}>
                        <InquiryModalWrapper
                            btnText="Request Retail Quote"
                            className={styles.primaryBtn}
                            initialProduct="Retail Shelf Life Solutions"
                        />
                        <button className={styles.secondaryBtn}>
                            Talk to a Retail Specialist
                        </button>
                    </div>
                    <div className={styles.heroTrustBadges}>
                        <div className={styles.heroBadge}>
                            <ShieldCheck size={24} />
                            <span>ISO 9001</span>
                        </div>
                        <div className={styles.heroBadge}>
                            <Globe size={24} />
                            <span>GlobalG.A.P</span>
                        </div>
                        <div className={styles.heroBadge}>
                            <Package size={24} />
                            <span>Retail Ready</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. The Retail Challenge */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2>Why Shelf Life Matters in Retail</h2>
                        <p>Retailers lose margin not at the port—but on the shelf. Every extra day of freshness translates directly into higher sell-through.</p>
                    </div>
                    <div className={styles.problemGrid}>
                        {[
                            { icon: <AlertCircle />, title: "Spoilage During Transit", desc: "Temperature fluctuations lead to early decay before arrival." },
                            { icon: <ArrowDownRight />, title: "Shrinkage on Shelves", desc: "Moisture loss and soft spots reduce sellable weight and volume." },
                            { icon: <Search />, title: "Inconsistent Appearance", desc: "Mixed grades and uneven sizing hurt brand perception." },
                            { icon: <Clock />, title: "Short Selling Window", desc: "Fast-ripening products create pressure for deep discounts." }
                        ].map((item, idx) => (
                            <div key={idx} className={styles.problemCard}>
                                <div className={styles.problemIcon}>{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className={styles.supportingCopy}>
                        “The true cost of produce is measured by its performance in the hands of the consumer. We engineer our exports to survive the retailer&apos;s floor and thrive in the buyer&apos;s home.”
                    </div>
                </div>
            </section>

            {/* 3. Our Shelf-Life Solution */}
            <section className={`${styles.section} ${styles.graySection}`}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2>Engineered for Freshness & Shelf Performance</h2>
                        <p>Our end-to-end management covers every variable that impacts retail shelf life.</p>
                    </div>
                    <div className={styles.solutionGrid}>
                        <div className={styles.solutionCard}>
                            <Thermometer className={styles.solutionIcon} />
                            <h3>End-to-End Cold Chain</h3>
                            <p>Temperature-controlled harvesting, packing, and shipping to maintain the dormant state of produce.</p>
                        </div>
                        <div className={styles.solutionCard}>
                            <Package className={styles.solutionIcon} />
                            <h3>Retail-Grade Packaging</h3>
                            <p>Ventilated cartons, modified atmosphere packaging (MAP), and custom labeling for instant retail placement.</p>
                        </div>
                        <div className={styles.solutionCard}>
                            <Calendar className={styles.solutionIcon} />
                            <h3>Harvest-to-Shelf Optimization</h3>
                            <p>Export scheduling strictly aligned with peak freshness windows for maximum &quot;days-to-discount&quot;.</p>
                        </div>
                        <div className={styles.solutionCard}>
                            <Eye className={styles.solutionIcon} />
                            <h3>Visual Quality Control</h3>
                            <p>Rigorous cosmetic grading for size, color uniformity, and firmness to meet premium retail standards.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Cold Chain Process */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2>Our Cold Chain Workflow</h2>
                        <p>A rigorous 5-step process that guarantees arrival quality.</p>
                    </div>
                    <div className={styles.processTimeline}>
                        {[
                            { title: "Optimal Maturity Harvest", time: "Hour 0", temp: "Ambient" },
                            { title: "Rapid Pre-Cooling", time: "Hour 2", temp: "2°C - 5°C" },
                            { title: "Cold Storage & Pack", time: "Hour 4", temp: "Constant" },
                            { title: "Monitored Transit", time: "Days 1-7", temp: "Live tracking" },
                            { title: "Shelf-Ready Delivery", time: "Arrival", temp: "Final QC" }
                        ].map((step, idx) => (
                            <div key={idx} className={styles.processStep}>
                                <div className={styles.stepCircle}>{idx + 1}</div>
                                <h4>{step.title}</h4>
                                <div className={styles.stepInfo}>
                                    <Clock size={14} /> {step.time} | <Thermometer size={14} /> {step.temp}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Proof & Compliance */}
            <section className={`${styles.section} ${styles.graySection}`}>
                <div className={styles.container}>
                    <div className={styles.complianceFlex}>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Trusted by Retailers Worldwide</h2>
                            <p style={{ marginBottom: '2rem' }}>We operate with full transparency and world-class documentation to ensure seamless customs clearance and retail compliance in EU, GCC, and Asian markets.</p>
                            <div className={styles.complianceBadges}>
                                <div className={styles.badgeCard}>
                                    <ShieldCheck color="#28a745" /> <strong>ISO 9001:2015</strong>
                                </div>
                                <div className={styles.badgeCard}>
                                    <Globe color="#28a745" /> <strong>GlobalG.A.P</strong>
                                </div>
                                <div className={styles.badgeCard}>
                                    <FileCheck color="#28a745" /> <strong>Phytosanitary</strong>
                                </div>
                                <div className={styles.badgeCard}>
                                    <Thermometer color="#28a745" /> <strong>BRC Compliant</strong>
                                </div>
                            </div>
                        </div>
                        <div style={{ flex: 0.8, background: 'white', padding: '3rem', borderRadius: '24px', position: 'relative' }}>
                            <Image
                                src="/images/supermarket_fresh_shelf_hero.png"
                                alt="Inspection"
                                width={500}
                                height={300}
                                style={{ borderRadius: '12px', objectFit: 'cover', width: '100%' }}
                            />
                            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: '#28a745', color: 'white', padding: '1rem', borderRadius: '8px', fontWeight: 600 }}>
                                100% Audit Pass Rate
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Use Cases */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2>Custom Solutions for Every Scale</h2>
                    </div>
                    <div className={styles.useCaseGrid}>
                        <div className={styles.useCaseCard}>
                            <div className={styles.useCaseContent}>
                                <Building2 className={styles.solutionIcon} />
                                <h3>National Supermarkets</h3>
                                <p>High volume, strict QC, and consistent weekly supply schedules to power massive distribution hubs.</p>
                            </div>
                            <button className={styles.useCaseBtn}>Discuss Retail Program</button>
                        </div>
                        <div className={styles.useCaseCard}>
                            <div className={styles.useCaseContent}>
                                <Tag className={styles.solutionIcon} />
                                <h3>Private Label Retail</h3>
                                <p>Custom packaging, branding, and specialized labeling options for your store&apos;s own premium line.</p>
                            </div>
                            <button className={styles.useCaseBtn}>Discuss Retail Program</button>
                        </div>
                        <div className={styles.useCaseCard}>
                            <div className={styles.useCaseContent}>
                                <Star className={styles.solutionIcon} />
                                <h3>Premium Grocery Chains</h3>
                                <p>Appearance-first grading and maximum shelf-life for high-end boutiques and specialty retailers.</p>
                            </div>
                            <button className={styles.useCaseBtn}>Discuss Retail Program</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Key Metrics */}
            <section className={styles.metricSection}>
                <div className={styles.container}>
                    <div className={styles.metricGrid}>
                        <div className={styles.metricItem}>
                            <h4>+30%</h4>
                            <p>Longer Shelf Life</p>
                        </div>
                        <div className={styles.metricItem}>
                            <h4>-20%</h4>
                            <p>Shrinkage Reduction</p>
                        </div>
                        <div className={styles.metricItem}>
                            <h4>15+</h4>
                            <p>Retail Markets Served</p>
                        </div>
                        <div className={styles.metricItem}>
                            <h4>100%</h4>
                            <p>Cold-Chain Compliance</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. Testimonial */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.testimonialBox}>
                        <div className={styles.quote}>
                            “Umbrella’s cold-chain process reduced our in-store spoilage by over 15%. The produce arrives shelf-ready and visually consistent, allowing us to maintain premium pricing throughout the week.”
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>— Procurement Director</div>
                        <div style={{ color: '#64748b' }}>European Retail Chain</div>
                    </div>
                </div>
            </section>

            {/* 9. Final CTA */}
            <section className={styles.finalCTA}>
                <div className={styles.container}>
                    <h2>Ready to Deliver Fresher Produce to Your Shelves?</h2>
                    <div className={styles.ctaGroup}>
                        <InquiryModalWrapper
                            btnText="Request Retail Quote"
                            className={styles.primaryBtn}
                            initialProduct="Retail Shelf Life Solutions"
                        />
                        <button className={styles.secondaryBtn} style={{ background: 'white', color: '#1e5b3a' }}>
                            Schedule Retail Consultation
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
