"use client";
import React from 'react';
import styles from './KPICounters.module.css';

export default function KPICounters() {
    return (
        <section className={styles.counterSection}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.item}>
                        <div className={styles.number}>10+</div>
                        <div className={styles.label}>Years Experience</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.number}>50+</div>
                        <div className={styles.label}>Global Partners</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.number}>1000+</div>
                        <div className={styles.label}>Orders Delivered</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.number}>100%</div>
                        <div className={styles.label}>Satisfaction Rate</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
