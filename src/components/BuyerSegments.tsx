"use client";
import React from 'react';
import Image from 'next/image';
import { Building2, Store, ShoppingBag } from 'lucide-react';
import styles from './BuyerSegments.module.css';

interface BuyerSegmentsProps {
    onQuoteRequest: (segment: string) => void;
}

export default function BuyerSegments({ onQuoteRequest }: BuyerSegmentsProps) {
    const segments = [
        {
            id: 'wholesale',
            title: 'Wholesale Importers',
            category: 'Volume & Scale',
            pain: 'Need reliable seasonal volume with consistent grading and sizing standards?',
            solution: 'We prioritize large-scale contracts with guaranteed allocation during peak seasons.',
            action: 'Request Wholesale Pricing',
            image: '/images/segments/wholesale.png'
        },
        {
            id: 'distribution',
            title: 'Food Distributors',
            category: 'Reliability',
            pain: 'Tired of gaps in supply chain and communication black holes?',
            solution: 'Dedicated account managers and real-time shipment tracking for every container.',
            action: 'Discuss Distribution',
            image: '/images/segments/distribution.png'
        },
        {
            id: 'retail',
            title: 'Supermarkets & Retail',
            category: 'Shelf Life',
            pain: 'Need produce that arrives fresh and ready for the shelf?',
            solution: 'Optimized cold chain logistics ensuring maximum shelf life superior appearance.',
            action: 'View Retail Solutions',
            image: '/images/segments/retail.png'
        }
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.heading}>
                    <h2>Who We Serve</h2>
                    <p>Tailored solutions for every level of the supply chain.</p>
                </div>
                <div className={styles.grid}>
                    {segments.map((segment) => (
                        <div key={segment.id} className={styles.card}>
                            <div className={styles.imageArea} style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                <Image
                                    src={segment.image}
                                    alt={segment.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4))'
                                }} />
                            </div>
                            <div className={styles.content}>
                                <div className={styles.category}>{segment.category}</div>
                                <h3 className={styles.title}>{segment.title}</h3>
                                <p className={styles.painPoint}>{segment.pain} <strong>{segment.solution}</strong></p>
                                {segment.id === 'retail' ? (
                                    <a
                                        href="/solutions/retail-shelf-life"
                                        className={styles.actionBtn}
                                        style={{ textAlign: 'center', display: 'block' }}
                                    >
                                        {segment.action}
                                    </a>
                                ) : (
                                    <button
                                        className={styles.actionBtn}
                                        onClick={() => onQuoteRequest(segment.title)}
                                    >
                                        {segment.action}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TruckIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 18h14" />
            <path d="M5 18a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h10l4 4v6a2 2 0 0 1 0 4H5Z" />
            <circle cx="7.5" cy="17.5" r="2.5" />
            <circle cx="16.5" cy="17.5" r="2.5" />
        </svg>
    )
}
