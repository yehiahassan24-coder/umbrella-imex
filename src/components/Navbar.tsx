"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './Navbar.module.css';
import { Menu, X, ShoppingBag } from 'lucide-react';

export default function Navbar() {
    const { t, language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const toggleLang = () => {
        setLanguage(language === 'en' ? 'fr' : 'en');
    };

    const menuItems = [
        { key: 'nav.home', href: '/' },
        { key: 'nav.about', href: '/about' },
        { key: 'nav.products', href: '/products' },
        { key: 'nav.quality', href: '/quality' },
        { key: 'nav.shipping', href: '/shipping' }, // Added based on requirements
        { key: 'nav.contact', href: '/contact' },
    ];

    return (
        <nav className={styles.navbar}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                <div className={styles.logo}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShoppingBag size={24} />
                        Umbrella
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className={styles.menu}>
                    {menuItems.map(item => (
                        <Link key={item.key} href={item.href}>
                            {t(item.key)}
                        </Link>
                    ))}
                    <button onClick={toggleLang} className={styles.langBtn}>
                        {language === 'en' ? 'FR' : 'EN'}
                    </button>
                </div>

                {/* Mobile Toggle */}
                <div className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className={styles.mobileMenu}>
                    {menuItems.map(item => (
                        <Link key={item.key} href={item.href} onClick={() => setIsOpen(false)}>
                            {t(item.key)}
                        </Link>
                    ))}
                    <button onClick={() => { toggleLang(); setIsOpen(false); }} className={styles.langBtn}>
                        {language === 'en' ? 'Français' : 'English'}
                    </button>
                </div>
            )}
        </nav>
    );
}
