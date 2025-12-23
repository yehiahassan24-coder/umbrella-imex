"use client";
import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Package } from 'lucide-react';
import styles from './ProductCarousel.module.css';
import { Product } from '@/types';
import { useLanguage } from '@/lib/LanguageContext';

interface ProductCarouselProps {
    products: Product[];
    onQuoteRequest: (productName: string) => void;
}

export default function ProductCarousel({ products, onQuoteRequest }: ProductCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { t, language } = useLanguage();

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current: container } = scrollRef;
            const scrollAmount = 320; // card width + gap
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className={styles.carouselContainer}>
            <div className={styles.controls}>
                <button
                    onClick={() => scroll('left')}
                    className={styles.controlButton}
                    aria-label="Scroll left"
                >
                    <ArrowLeft size={20} />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className={styles.controlButton}
                    aria-label="Scroll right"
                >
                    <ArrowRight size={20} />
                </button>
            </div>

            <div className={styles.scrollArea} ref={scrollRef}>
                {products.map((product) => (
                    <div key={product.id} className={styles.carouselItem}>
                        <div className={styles.card}>
                            <div className={styles.imageRequest}>
                                {product.images && product.images.length > 0 ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={language === 'en' ? product.name_en : product.name_fr}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <Package size={48} strokeWidth={1} />
                                )}
                                <span className={styles.badge}>{product.category}</span>
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.title}>
                                    {language === 'en' ? product.name_en : product.name_fr}
                                </h3>
                                <div className={styles.meta}>
                                    <span>{t('product.moq') || 'MOQ'}: {product.moq}kg</span>
                                    <span>{product.origin}</span>
                                </div>
                                <div className={styles.actions}>
                                    <Link href={`/products/${product.id}`} className={styles.viewBtn}>
                                        View Details
                                    </Link>
                                    <button
                                        onClick={() => onQuoteRequest(language === 'en' ? product.name_en : product.name_fr)}
                                        className={styles.quoteBtn}
                                    >
                                        Quote
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
