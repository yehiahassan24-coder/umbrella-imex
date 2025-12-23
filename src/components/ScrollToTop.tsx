"use client";
import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import styles from './ScrollToTop.module.css';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`${styles.scrollButton} ${isVisible ? styles.visible : styles.hidden}`}
            aria-label="Scroll to top"
        >
            <ChevronUp size={28} strokeWidth={2.5} />
        </button>
    );
}

