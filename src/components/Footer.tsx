"use client";
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './Footer.module.css';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

import Image from 'next/image';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContent}`}>
                {/* Brand Column */}
                <div className={styles.column}>
                    <div className={styles.logo}>
                        <Image
                            src="/logo-new.svg"
                            alt="Umbrella Import & Export"
                            width={120}
                            height={40}
                            style={{ height: '40px', width: 'auto', filter: 'brightness(0) invert(1)' }}
                        />
                    </div>
                    <p className={styles.tagline}>
                        Connecting global agriculture with premium quality and sustainable practices.
                    </p>
                    <div className={styles.contactInfo}>
                        <div className={styles.contactItem}>
                            <MapPin size={18} />
                            <span>123 Trade Center, Global City</span>
                        </div>
                        <div className={styles.contactItem}>
                            <Phone size={18} />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className={styles.contactItem}>
                            <Mail size={18} />
                            <span>contact@umbrellaimex.com</span>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className={styles.column}>
                    <h3>Quick Links</h3>
                    <ul className={styles.links}>
                        <li><Link href="/">{t('nav.home')}</Link></li>
                        <li><Link href="/products">{t('nav.products')}</Link></li>
                        <li><Link href="/about">{t('nav.about')}</Link></li>
                        <li><Link href="/contact">{t('nav.contact')}</Link></li>
                        <li><Link href="/quality">{t('nav.quality')}</Link></li>
                    </ul>
                </div>

                {/* Socials & Newsletter */}
                <div className={styles.column}>
                    <h3>Stay Connected</h3>
                    <div className={styles.socials}>
                        <a href="#" aria-label="LinkedIn"><Linkedin /></a>
                        <a href="#" aria-label="Instagram"><Instagram /></a>
                        <a href="#" aria-label="Facebook"><Facebook /></a>
                    </div>

                    <div className={styles.newsletter}>
                        <h4>Subscribe to our Newsletter</h4>
                        <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Enter your email" />
                            <button type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <div className={`container ${styles.bottomBarContent}`}>
                    <p>&copy; {new Date().getFullYear()} Umbrella Import & Export. All rights reserved.</p>
                    <div className={styles.legalLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
