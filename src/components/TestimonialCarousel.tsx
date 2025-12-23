"use client";
import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './TestimonialCarousel.module.css';

const testimonials = [
    {
        name: "John Smith",
        role: "Import Manager",
        company: "VegGreat UK Ltd.",
        country: "United Kingdom",
        text: "Umbrella Import delivers the freshest produce we've seen. Reduced our spoilage rates by 15% in the first quarter."
    },
    {
        name: "Marie Dubois",
        role: "Procurement Director",
        company: "Les Halles de Paris",
        country: "France",
        text: "La qualité des fruits est exceptionnelle. Their consistency allows us to supply Michelin-star restaurants with confidence."
    },
    {
        name: "Ahmed Hassan",
        role: "General Manager",
        company: "Gulf Fresh Trading",
        country: "UAE",
        text: "Professional service and great communication. They solved our logistical bottlenecks and ensured timely Ramadan shipments."
    },
    {
        name: "Sarah Jenkins",
        role: "Head of Sourcing",
        company: "BioMarket Chain",
        country: "Germany",
        text: "Finding a reliable source for organic citrus was hard until we met Umbrella. Full traceability and outstanding quality every time."
    }
];

export default function TestimonialCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section style={{ padding: '6rem 0', background: '#f8fafc' }}>
            <div className="container">
                <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', color: '#1e5b3a' }}>What Our Clients Say</h2>
                <div className={styles.carouselContainer}>
                    <button onClick={prev} className={`${styles.navButton} ${styles.prev}`} aria-label="Previous testimonial">
                        <ChevronLeft size={24} />
                    </button>
                    <div className={styles.slideTrack}>
                        {testimonials.map((t, i) => (
                            <div key={i} className={`${styles.slide} ${i === currentIndex ? styles.active : ''}`}>
                                <div className={styles.content}>
                                    <Quote size={50} className={styles.quoteIcon} />
                                    <p className={styles.text}>&quot;{t.text}&quot;</p>
                                    <div>
                                        <div className={styles.author}>{t.name}</div>
                                        <div className={styles.role} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.5rem' }}>
                                            <span style={{ fontWeight: 600, color: '#2d3748' }}>{t.company}</span>
                                            <span>{t.role}, {t.country}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={next} className={`${styles.navButton} ${styles.next}`} aria-label="Next testimonial">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
}
