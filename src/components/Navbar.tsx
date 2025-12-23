"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './Navbar.module.css';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
    const { t, language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleLang = () => {
        setLanguage(language === 'en' ? 'fr' : 'en');
    };

    const menuItems = [
        { key: 'nav.home', href: '/' },
        { key: 'nav.products', href: '/products' },
        { key: 'nav.solutions', href: '/solutions/retail-shelf-life' },
        { key: 'nav.about', href: '/about' },
        { key: 'nav.contact', href: '/contact' },
    ];

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                {/* Brand Logo - Left */}
                <div className={styles.logo}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <Image
                            src="/logo-new.svg"
                            alt="Umbrella Import & Export"
                            width={150}
                            height={48}
                            style={{ height: '48px', width: 'auto', display: 'block' }}
                            priority
                        />
                    </Link>
                </div>

                {/* Desktop Menu - Right */}
                <div className={styles.menu}>
                    {menuItems.map(item => (
                        <Link key={item.key} href={item.href} className={styles.navLink}>
                            {t(item.key)}
                        </Link>
                    ))}

                    <button onClick={toggleLang} className={styles.langBtn}>
                        {language === 'en' ? 'FR' : 'EN'}
                    </button>

                    <Link href="/contact" className={styles.ctaButton}>
                        {t('home.ctaButton') || 'Get Started'}
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <div className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
                {menuItems.map(item => (
                    <Link key={item.key} href={item.href} onClick={() => setIsOpen(false)} className={styles.mobileNavLink}>
                        {t(item.key)}
                    </Link>
                ))}
                <button onClick={() => { toggleLang(); setIsOpen(false); }} className={styles.mobileNavLink} style={{ border: 'none', background: 'none', textAlign: 'left', padding: '1rem 0' }}>
                    Language: {language === 'en' ? 'Français' : 'English'}
                </button>
                <Link href="/contact" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                    {t('home.ctaButton') || 'Get Started'}
                </Link>
            </div>
        </nav>
    );
}
