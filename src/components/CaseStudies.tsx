import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function CaseStudies() {
    return (
        <section style={{ padding: '5rem 0', background: 'white' }}>
            <div className="container">
                <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', color: '#1E5B3A', marginBottom: '0.5rem' }}>Success Stories</h2>
                        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Real results from our global partnerships.</p>
                    </div>
                    {/* Add View All Link if needed later */}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Case Study 1 */}
                    <div className="case-card" style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: '#e2e8f0', lineHeight: 1 }}>01</div>
                        <h3 style={{ fontSize: '1.5rem', margin: '1rem 0', color: '#1e293b' }}>Supplying UK Wholesalers</h3>
                        <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
                            Delivered 500 tons of Golden Onions to a leading Manchester distributor with zero rejection rate and 3-day early arrival.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <span style={{ background: 'white', border: '1px solid #cbd5e1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', color: '#475569' }}>Onions</span>
                            <span style={{ background: 'white', border: '1px solid #cbd5e1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', color: '#475569' }}>United Kingdom</span>
                        </div>
                    </div>

                    {/* Case Study 2 */}
                    <div className="case-card" style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: '#e2e8f0', lineHeight: 1 }}>02</div>
                        <h3 style={{ fontSize: '1.5rem', margin: '1rem 0', color: '#1e293b' }}>Gulf Supermarket Chain</h3>
                        <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
                            Established a weekly air-freight strawberry program for a premium retailer in Dubai, ensuring shelf-life extension.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <span style={{ background: 'white', border: '1px solid #cbd5e1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', color: '#475569' }}>Strawberries</span>
                            <span style={{ background: 'white', border: '1px solid #cbd5e1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', color: '#475569' }}>UAE</span>
                        </div>
                    </div>

                    {/* Case Study 3 */}
                    <div className="case-card" style={{ background: '#1E5B3A', borderRadius: '16px', padding: '2rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Start Your Story</h3>
                        <p style={{ opacity: 0.9, marginBottom: '2rem', lineHeight: 1.6 }}>Join 50+ global partners who trust Umbrella Import for their produce needs.</p>
                        <Link href="/contact" style={{ background: 'white', color: '#1E5B3A', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
