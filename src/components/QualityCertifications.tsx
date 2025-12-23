"use client";
import React from 'react';
import { Award, ShieldCheck, Thermometer, FileCheck } from 'lucide-react';
import styles from './QualityCertifications.module.css';

export default function QualityCertifications() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.heading}>
                    <h2>Certified Excellence</h2>
                    <p>We adhere to strict international standards to guarantee safety and quality.</p>
                </div>
                <div className={styles.certGrid}>
                    <div className={styles.certItem}>
                        <div className={styles.iconWrapper}>
                            <Award size={40} />
                        </div>
                        <span className={styles.certLabel}>ISO 9001:2015</span>
                    </div>
                    <div className={styles.certItem}>
                        <div className={styles.iconWrapper}>
                            <ShieldCheck size={40} />
                        </div>
                        <span className={styles.certLabel}>Global G.A.P</span>
                    </div>
                    <div className={styles.certItem}>
                        <div className={styles.iconWrapper}>
                            <Thermometer size={40} />
                        </div>
                        <span className={styles.certLabel}>Cold Chain Certified</span>
                    </div>
                    <div className={styles.certItem}>
                        <div className={styles.iconWrapper}>
                            <FileCheck size={40} />
                        </div>
                        <span className={styles.certLabel}>FDA Registered</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
