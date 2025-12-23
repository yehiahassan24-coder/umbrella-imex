"use client";
import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Clock, Send, MessageSquare } from 'lucide-react';

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
        <section style={{ background: '#f8fafc', padding: '4rem 0' }}>
            {/* Header */}
            <div className="container" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', color: '#1E5B3A', marginBottom: '1rem' }}>{t('contact.title')}</h1>
                <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    {t('contact.text') || "We're here to help. Reach out to us for any inquiries about our premium produce."}
                </p>
            </div>

            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem' }}>

                    {/* Contact Info Side */}
                    <div>
                        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', height: '100%', border: '1px solid #f1f5f9' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#1e293b' }}>Get in Touch</h2>

                            <div className="contact-item" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                <div style={{ background: '#e6f4ea', padding: '12px', borderRadius: '12px', height: 'fit-content', color: '#166534' }}><MapPin size={24} /></div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>Headquarters</h3>
                                    <p style={{ color: '#64748b', lineHeight: 1.6 }}>123 Export Blvd, Suite 400<br />Montreal, QC H3B 1A7<br />Canada</p>
                                </div>
                            </div>

                            <div className="contact-item" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                <div style={{ background: '#e6f4ea', padding: '12px', borderRadius: '12px', height: 'fit-content', color: '#166534' }}><Mail size={24} /></div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>Email Us</h3>
                                    <a href="mailto:info@umbrella-import.com" style={{ color: '#64748b', display: 'block', marginBottom: '4px', textDecoration: 'none' }}>info@umbrella-import.com</a>
                                    <a href="mailto:sales@umbrella-import.com" style={{ color: '#64748b', display: 'block', textDecoration: 'none' }}>sales@umbrella-import.com</a>
                                </div>
                            </div>

                            <div className="contact-item" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                <div style={{ background: '#e6f4ea', padding: '12px', borderRadius: '12px', height: 'fit-content', color: '#166534' }}><Phone size={24} /></div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>Call Us</h3>
                                    <p style={{ color: '#64748b', marginBottom: '4px' }}>+1 (514) 555-0123</p>
                                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Mon-Fri, 9am - 5pm EST</span>
                                </div>
                            </div>

                            <div className="contact-item" style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ background: '#e6f4ea', padding: '12px', borderRadius: '12px', height: 'fit-content', color: '#166534' }}><Clock size={24} /></div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>Business Hours</h3>
                                    <p style={{ color: '#64748b' }}>Monday - Friday<br />09:00 AM - 06:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div>
                        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', borderTop: '4px solid #28A745' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    Send us a Message <MessageSquare size={24} color="#28A745" />
                                </h3>
                                <p style={{ color: '#64748b' }}>Fill out the form below and we&apos;ll get back to you shortly.</p>
                            </div>

                            {status === 'success' && (
                                <div style={{ color: '#15803d', padding: '1rem', background: '#dcfce7', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #bbf7d0' }}>
                                    <CheckCircle size={20} />
                                    <div>
                                        <strong>Message Sent!</strong><br />
                                        <span style={{ fontSize: '0.9rem' }}>We&apos;ll get back to you within 24 hours.</span>
                                    </div>
                                </div>
                            )}

                            {status === 'error' && (
                                <div style={{ color: '#b91c1c', padding: '1rem', background: '#fee2e2', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #fecaca' }}>
                                    <AlertCircle size={20} />
                                    <div>
                                        <strong>Error Sending Message</strong><br />
                                        <span style={{ fontSize: '0.9rem' }}>Please try again or email us directly.</span>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.95rem' }}>{t('contact.formName')}</label>
                                    <input name="name" type="text" placeholder="John Doe" style={inputStyle} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.95rem' }}>Phone</label>
                                    <input name="phone" type="tel" placeholder="+1 (555) 000-0000" style={inputStyle} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.95rem' }}>{t('contact.formEmail')}</label>
                                <input name="email" type="email" placeholder="john@company.com" style={inputStyle} required />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.95rem' }}>Subject</label>
                                <input name="subject" type="text" placeholder="Product Inquiry / General Question" style={inputStyle} required />
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.95rem' }}>{t('contact.formMessage')}</label>
                                <textarea name="message" rows={5} placeholder="Tell us about your needs..." style={{ ...inputStyle, resize: 'vertical' }} required></textarea>
                            </div>

                            <button className="btn" style={{
                                width: '100%',
                                background: sending ? '#94a3b8' : '#1E5B3A',
                                color: 'white',
                                padding: '16px',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px'
                            }} disabled={sending}>
                                {sending ? 'Sending...' : (
                                    <>
                                        {t('contact.submit')} <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
    color: '#1e293b',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: '#f8fafc'
};
