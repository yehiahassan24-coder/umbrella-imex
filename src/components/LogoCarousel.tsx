import React from 'react';
import { Leaf, Globe, Sun, Anchor, Award } from 'lucide-react';
import styles from './LogoCarousel.module.css';

const logos = [
    { name: "FreshMarket UK", icon: Leaf },
    { name: "GlobalFoods", icon: Globe },
    { name: "SunnySide Import", icon: Sun },
    { name: "OceanLogistics", icon: Anchor },
    { name: "PremiumChoice", icon: Award },
    { name: "EuroGrocer", icon: Leaf }, // Duplicates for smooth loop
];

export default function LogoCarousel() {
    return (
        <section className={styles.logoSection}>
            <div className="container">
                <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#718096', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Trusted by partners worldwide
                </p>
                <div className={styles.logoContainer}>
                    <div className={styles.logoTrack}>
                        {logos.map((logo, i) => (
                            <div key={i} className={styles.logoItem}>
                                <div className={styles.logoPlaceholder}>
                                    <logo.icon size={24} />
                                    <span>{logo.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Duplicate track for seamless loop */}
                    <div className={styles.logoTrack}>
                        {logos.map((logo, i) => (
                            <div key={`dup-${i}`} className={styles.logoItem}>
                                <div className={styles.logoPlaceholder}>
                                    <logo.icon size={24} />
                                    <span>{logo.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
