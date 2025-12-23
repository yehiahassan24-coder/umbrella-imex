"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './ProductDetail.module.css';
import {
    ArrowLeft, ArrowRight, CheckCircle, Globe, Calendar, Package, TrendingUp,
    ShieldCheck, Download, Star, ChevronRight, FileCheck, Thermometer
} from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types';
import InquiryModal from './InquiryModal';

interface ProductDetailProps {
    product: Product;
    relatedProducts?: Partial<Product>[];
}

export default function ProductDetail({ product, relatedProducts = [] }: ProductDetailProps) {
    const { t, language } = useLanguage();
    const [selectedImage, setSelectedImage] = useState(
        (product.images && product.images.length > 0 && product.images[0])
            ? product.images[0]
            : '/images/placeholder.png'
    );
    const [isZoomed, setIsZoomed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Derived content
    const name = language === 'en' ? product.name_en : product.name_fr;
    const desc = language === 'en' ? product.desc_en : product.desc_fr;

    return (
        <div className={styles.pageWrapper}>
            {/* 1. Main Content Section */}
            <section className={styles.detailsWrapper}>
                <div className="container">
                    {/* Breadcrumb / Back Navigation */}
                    <div className={styles.topNav}>
                        <Link href="/products" className={styles.backLink}>
                            <ArrowLeft size={18} /> {t('products.back')}
                        </Link>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.breadcrumbCurrent}>{product.category}</span>
                    </div>

                    <div className={styles.grid}>
                        {/* LEFT COLUMN: Hero Gallery */}
                        <div className={styles.imageGallery}>
                            <div
                                className={styles.mainImageWrapper}
                                onMouseEnter={() => setIsZoomed(true)}
                                onMouseLeave={() => setIsZoomed(false)}
                            >
                                {selectedImage ? (
                                    <Image
                                        src={selectedImage}
                                        alt={name}
                                        fill
                                        className={`${styles.mainImage} ${isZoomed ? styles.zoomed : ''}`}
                                        priority
                                    />
                                ) : (
                                    <div className={styles.noImage}>No Image</div>
                                )}

                                {/* Trust Badges Overlay */}
                                <div className={styles.trustBadges}>
                                    <div className={styles.badge} title="ISO 9001 Certified">ISO 9001</div>
                                    <div className={styles.badge} title="GlobalG.A.P Verified">GlobalG.A.P</div>
                                </div>

                                {/* Stock Status Badge */}
                                <div className={`${styles.stockBadge} ${product.quantity > 0 ? styles.inStock : styles.outStock}`}>
                                    {product.quantity > 0 ? 'Available in Bulk' : 'Seasonal / Made to Order'}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {product.images && product.images.length > 1 && (
                                <div className={styles.thumbnailList}>
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            className={`${styles.thumbnail} ${selectedImage === img ? styles.activeThumb : ''}`}
                                            onClick={() => setSelectedImage(img)}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${name} thumbnail ${idx + 1}`}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Trust & Certifications Section (Mobile/Desktop) */}
                            <div className={styles.trustSection}>
                                <h4 className={styles.trustTitle}><ShieldCheck size={18} /> Export Compliance</h4>
                                <div className={styles.trustGrid}>
                                    <div className={styles.trustItem}>
                                        <FileCheck size={20} className={styles.trustIcon} />
                                        <span>Phytosanitary Cert.</span>
                                    </div>
                                    <div className={styles.trustItem}>
                                        <Globe size={20} className={styles.trustIcon} />
                                        <span>EUR.1 / COO</span>
                                    </div>
                                    <div className={styles.trustItem}>
                                        <Thermometer size={20} className={styles.trustIcon} />
                                        <span>Cold Chain Log</span>
                                    </div>
                                </div>
                                <button className={styles.downloadBtn}>
                                    <Download size={16} /> Download Datasheet (PDF)
                                </button>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Product Info & Commercials */}
                        <div className={styles.productInfo}>
                            <div className={styles.headerGroup}>
                                <div className={styles.metaRow}>
                                    <span className={styles.categoryBadge}>{product.category}</span>
                                    {product.sku && <span className={styles.sku}>SKU: {product.sku}</span>}
                                </div>
                                <h1 className={styles.title}>{name}</h1>
                                <div className={styles.originRow}>
                                    <span className={styles.flag}>🇪🇬</span>
                                    <span>Origin: {product.origin}</span>
                                </div>
                            </div>

                            {/* Sticky Commercial Card */}
                            <div className={styles.commercialCard}>
                                <div className={styles.priceSection}>
                                    <div className={styles.priceLabel}>FOB Price Estimate</div>
                                    <div className={styles.priceValue}>
                                        {product.price ? `$${product.price.toLocaleString()}` : 'Contact for Quote'}
                                        <span className={styles.unit}> / Metric Ton</span>
                                    </div>
                                </div>

                                <div className={styles.actionButtons}>
                                    <button
                                        className={`${styles.btn} ${styles.btnPrimary}`}
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Request Bulk Quote
                                    </button>
                                    <button
                                        className={`${styles.btn} ${styles.btnSecondary}`}
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Request Sample
                                    </button>
                                </div>
                                <div className={styles.responseTime}>
                                    <div className={styles.onlineDot}></div>
                                    <span>Typical response time: <strong>2-4 Hours</strong></span>
                                </div>
                            </div>

                            {/* Specification Grid */}
                            <div className={styles.specsContainer}>
                                <h3 className={styles.sectionTitle}>Product Specifications</h3>
                                <div className={styles.specsGrid}>
                                    <div className={styles.specBox}>
                                        <Calendar size={20} className={styles.specIcon} />
                                        <div className={styles.specContent}>
                                            <label>Seasonicity</label>
                                            <span>{product.season}</span>
                                        </div>
                                    </div>
                                    <div className={styles.specBox}>
                                        <Package size={20} className={styles.specIcon} />
                                        <div className={styles.specContent}>
                                            <label>MOQ</label>
                                            <span>{product.moq.toLocaleString()} kg</span>
                                        </div>
                                    </div>
                                    <div className={styles.specBox}>
                                        <TrendingUp size={20} className={styles.specIcon} />
                                        <div className={styles.specContent}>
                                            <label>Shelf Life</label>
                                            <span>~21 Days (Cold)</span>
                                        </div>
                                    </div>
                                    <div className={styles.specBox}>
                                        <Globe size={20} className={styles.specIcon} />
                                        <div className={styles.specContent}>
                                            <label>Export Markets</label>
                                            <span>EU, UK, Russia, Gulf</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.description}>
                                <h3 className={styles.sectionTitle}>About this Product</h3>
                                <p>{desc}</p>
                                <p className={styles.qualityNote}>
                                    <CheckCircle size={16} style={{ display: 'inline', color: '#16a34a', marginRight: '6px' }} />
                                    All shipments are inspected by our QC team prior to loading. Third-party inspection (SGS/Bureau Veritas) available upon request.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Reviews / Social Proof Section */}
            <section className={styles.reviewsSection}>
                <div className="container">
                    <div className={styles.reviewHeader}>
                        <h3>Client Verification</h3>
                        <div className={styles.stars}>
                            <Star size={20} fill="#eab308" color="#eab308" />
                            <Star size={20} fill="#eab308" color="#eab308" />
                            <Star size={20} fill="#eab308" color="#eab308" />
                            <Star size={20} fill="#eab308" color="#eab308" />
                            <Star size={20} fill="#eab308" color="#eab308" />
                            <span>(4.9/5 from Verified Buyers)</span>
                        </div>
                    </div>
                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewCard}>
                            <p>“Consistent quality for our wholesale chain in Rotterdam. The onions arrived with perfect skin retention and zero spoilage.”</p>
                            <div className={styles.reviewAuthor}>— Procurement Manager, Netherlands</div>
                        </div>
                        <div className={styles.reviewCard}>
                            <p>“Fast documentation processing. We cleared the container in Dubai in record time thanks to Umbrella&apos;s compliance team.”</p>
                            <div className={styles.reviewAuthor}>— Import Director, UAE</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Related Products Section */}
            {relatedProducts.length > 0 && (
                <section className={styles.relatedSection}>
                    <div className="container">
                        <h2 className={styles.relatedTitle}>Similar Export Products</h2>
                        <div className={styles.relatedGrid}>
                            {relatedProducts.map(rp => (
                                <Link href={`/products/${rp.id}`} key={rp.id} className={styles.relatedCard}>
                                    <div className={styles.relatedImage}>
                                        {rp.images && rp.images[0] ? (
                                            <Image src={rp.images[0]} alt={rp.name_en || ''} fill style={{ objectFit: 'cover' }} />
                                        ) : (
                                            <div className={styles.noImage}>No Image</div>
                                        )}
                                    </div>
                                    <div className={styles.relatedInfo}>
                                        <h4>{language === 'en' ? rp.name_en : rp.name_fr || rp.name_en}</h4>
                                        <div className={styles.relatedMeta}>
                                            <span>{rp.category}</span>
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Inquiry Modal */}
            <InquiryModal
                key={product.id}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialProduct={name}
            />
        </div>
    );
}
