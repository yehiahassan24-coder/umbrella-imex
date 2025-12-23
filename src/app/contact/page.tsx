"use client";
import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Clock, Send, MessageSquare } from 'lucide-react';
import styles from './contact.module.css';

export default function Contact() {
    const { t } = useLanguage();
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        setStatus('idle');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            phone: formData.get('phone'),
            subject: formData.get('subject')
        };

        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus('success');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        } finally {
            setSending(false);
        }
    };

    return (
        <section className={styles.section}>
            {/* Header */}
            <div className={`container ${styles.header}`}>
                <h1 className={styles.title}>{t('contact.title')}</h1>
                <p className={styles.subtitle}>
                    {t('contact.text') || "We're here to help. Reach out to us for any inquiries about our premium produce."}
                </p>
            </div>

            <div className={`container ${styles.grid}`}>
                {/* Contact Info Side */}
                <div>
                    <div className={styles.card}>
                        <h2 className={styles.infoTitle}>Get in Touch</h2>

                        <div className={styles.contactItem}>
                            <div className={styles.iconWrapper}><MapPin size={24} /></div>
                            <div>
                                <h3 className={styles.itemTitle}>Headquarters</h3>
                                <p className={styles.itemText}>123 Export Blvd, Suite 400<br />Montreal, QC H3B 1A7<br />Canada</p>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <div className={styles.iconWrapper}><Mail size={24} /></div>
                            <div>
                                <h3 className={styles.itemTitle}>Email Us</h3>
                                <a href="mailto:info@umbrella-import.com" className={styles.itemLink}>info@umbrella-import.com</a>
                                <a href="mailto:sales@umbrella-import.com" className={styles.itemLink}>sales@umbrella-import.com</a>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <div className={styles.iconWrapper}><Phone size={24} /></div>
                            <div>
                                <h3 className={styles.itemTitle}>Call Us</h3>
                                <p className={styles.itemText} style={{ marginBottom: '4px' }}>+1 (514) 555-0123</p>
                                <a href="https://wa.me/15145550123" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#25D366', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px', textDecoration: 'none' }}>
                                    Chat on WhatsApp
                                </a>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#166534', background: '#dcfce7', width: 'fit-content', padding: '2px 8px', borderRadius: '4px', marginTop: '4px' }}>
                                    <div style={{ width: '6px', height: '6px', background: '#166534', borderRadius: '50%' }}></div>
                                    Response time: ~2 hours
                                </div>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <div className={styles.iconWrapper}><Clock size={24} /></div>
                            <div>
                                <h3 className={styles.itemTitle}>Business Hours</h3>
                                <p className={styles.itemText}>Monday - Friday<br />09:00 AM - 06:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div>
                    <form onSubmit={handleSubmit} className={styles.formCard}>
                        <div className={styles.formHeader}>
                            <h3 className={styles.formTitle}>
                                Send us a Message <MessageSquare size={24} color="#28A745" />
                            </h3>
                            <p className={styles.formSubtitle}>Fill out the form below and we&apos;ll get back to you shortly.</p>
                        </div>

                        {status === 'success' && (
                            <div className={styles.successMessage}>
                                <CheckCircle size={20} />
                                <div>
                                    <strong>Message Sent!</strong><br />
                                    <span style={{ fontSize: '0.9rem' }}>We&apos;ll get back to you within 24 hours.</span>
                                </div>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className={styles.errorMessage}>
                                <AlertCircle size={20} />
                                <div>
                                    <strong>Error Sending Message</strong><br />
                                    <span style={{ fontSize: '0.9rem' }}>Please try again or email us directly.</span>
                                </div>
                            </div>
                        )}

                        <div className={styles.row}>
                            <div>
                                <label className={styles.label}>{t('contact.formName')}</label>
                                <input name="name" type="text" placeholder="John Doe" className={styles.input} required />
                            </div>
                            <div>
                                <label className={styles.label}>Phone</label>
                                <input name="phone" type="tel" placeholder="+1 (555) 000-0000" className={styles.input} />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('contact.formEmail')}</label>
                            <input name="email" type="email" placeholder="john@company.com" className={styles.input} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Subject</label>
                            <input name="subject" type="text" placeholder="Product Inquiry / General Question" className={styles.input} required />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label className={styles.label}>{t('contact.formMessage')}</label>
                            <textarea name="message" rows={5} placeholder="Tell us about your needs..." className={styles.input} style={{ resize: 'vertical' }} required></textarea>
                        </div>

                        <button className={styles.submitBtn} disabled={sending}>
                            {sending ? 'Sending...' : (
                                <>
                                    {t('contact.submit')} <Send size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
