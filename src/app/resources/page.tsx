import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowRight, Calendar, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Export Resources & Market Insights | Umbrella Import',
    description: 'Expert guides on Egyptian produce seasons, bulk export logistics, and international trade standards.',
};

const resources = [
    {
        id: 'egyptian-onion-season-guide',
        title: "Egyptian Onion Export Seasons Explained",
        excerpt: "A comprehensive guide to Red and Golden Onion harvest times, storage capabilities, and best shipping windows to Europe and Russia.",
        category: "Market Guide",
        date: "Dec 15, 2024",
        icon: Calendar
    },
    {
        id: 'moq-pricing-logistics',
        title: "How MOQ Impacts Pricing in Bulk Produce",
        excerpt: "Understanding the relationship between Minimum Order Quantities, shipping container utilization, and FOB pricing structure.",
        category: "Logistics",
        date: "Nov 28, 2024",
        icon: TrendingUp
    },
    {
        id: 'globalgap-iso-standards',
        title: "GlobalGAP vs ISO: Import Standards 101",
        excerpt: "What importers need to know about our certifications and how they ensure compliance with EU and UK phytosanitary regulations.",
        category: "Compliance",
        date: "Nov 10, 2024",
        icon: FileText
    }
];

export default function ResourcesPage() {
    return (
        <section style={{ padding: '4rem 0', background: '#f8fafc', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', color: '#1E5B3A', marginBottom: '1rem' }}>Market Insights</h1>
                    <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                        Stay ahead of the market with expert analysis, seasonal updates, and logistics guides from Umbrella Import&apos;s trade specialists.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {resources.map((res) => (
                        <article key={res.id} style={{
                            background: 'white',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1px solid #e2e8f0',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{ padding: '2rem', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <span style={{
                                        background: '#e6f4ea',
                                        color: '#166534',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        textTransform: 'uppercase'
                                    }}>
                                        {res.category}
                                    </span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{res.date}</span>
                                </div>

                                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b', lineHeight: 1.3 }}>
                                    <Link href={`/resources/${res.id}`} style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-green-700">
                                        {res.title}
                                    </Link>
                                </h2>

                                <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '0' }}>{res.excerpt}</p>
                            </div>

                            <div style={{
                                padding: '1.5rem 2rem',
                                background: '#fafafa',
                                borderTop: '1px solid #f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <Link href="#" style={{
                                    color: '#1E5B3A',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    Read Guide <ArrowRight size={18} />
                                </Link>
                                <res.icon size={24} color="#cbd5e1" />
                            </div>
                        </article>
                    ))}
                </div>

                <div style={{ marginTop: '5rem', background: '#1E5B3A', borderRadius: '20px', padding: '4rem', textAlign: 'center', color: 'white' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Need specific market data?</h2>
                    <p style={{ opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem' }}>
                        Our team provides custom reports on seasonal availability and pricing forecasts for wholesale partners.
                    </p>
                    {/* Updated CTA to pass source query param */}
                    <Link href="/contact?source=market_report_request" style={{
                        background: 'white',
                        color: '#1E5B3A',
                        padding: '16px 32px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'inline-block'
                    }}>
                        Request Market Report
                    </Link>
                </div>
            </div>
        </section>
    );
}
