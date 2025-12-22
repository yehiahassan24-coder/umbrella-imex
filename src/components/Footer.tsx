"use client";
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './Footer.module.css';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.column}>
                        <h3>Umbrella Import & Export</h3>
                        <p>{t('home.heroSubtitle')}</p>
                    </div>

                    <div className={styles.column}>
                        <h3>Quick Links</h3>
                        <Link href="/about">{t('nav.about')}</Link>
                        <Link href="/products">{t('nav.products')}</Link>
                        <Link href="/quality">{t('nav.quality')}</Link>
                        <Link href="/contact">{t('nav.contact')}</Link>
                    </div>

                    <div className={styles.column}>
                        <h3>{t('contact.title')}</h3>
                        <p>123 Export Blvd<br />Montreal, QC, Canada</p>
                        <p>Email: info@umbrella-import.com</p>
                        <p>Phone: +1 555-0123</p>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} Umbrella Import & Export. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
