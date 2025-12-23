"use client";
import React from 'react';
import { Quote } from 'lucide-react';
import styles from './LeadershipMessage.module.css';

export default function LeadershipMessage() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.quoteCard}>
                    <div className={styles.quoteIcon}>
                        <Quote size={24} fill="currentColor" />
                    </div>
                    <blockquote className={styles.text}>
                        &quot;At Umbrella Import & Export, we understand that trust is the currency of international trade.
                        Our commitment isn&apos;t just to the quality of our produce, but to the reliability of our partnership.
                        When you work with us, you&apos;re not just buying a container; you&apos;re securing a supply chain built on integrity and precision.&quot;
                    </blockquote>
                    <div className={styles.author}>
                        <div className={styles.name}>Yehia Hassan</div>
                        <div className={styles.role}>Managing Director</div>
                        <div className={styles.signature}>Yehia Hassan</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
