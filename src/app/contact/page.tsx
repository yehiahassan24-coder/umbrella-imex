"use client";
import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
// import styles from './page.module.css'; 

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
            phone: '', // Not in this specific form UI but nice to have in API
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
        <section>
            <div className="container">
                <h1>{t('contact.title')}</h1>
                <div className="grid-2">
                    <div>
                        <p className="text-large" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{t('contact.text')}</p>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="text-gold"><MapPin /></div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Headquarters</h3>
                                <p>123 Export Blvd<br />Montreal, QC, Canada</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="text-gold"><Mail /></div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Email</h3>
                                <p>info@umbrella-import.com</p>
                                <p>sales@umbrella-import.com</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="text-gold"><Phone /></div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Phone</h3>
                                <p>+1 (514) 555-0123</p>
                            </div>
                        </div>

                    </div>

                    <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Request a Quote</h3>

                        {status === 'success' && (
                            <div style={{ color: 'green', padding: '1rem', background: '#e6f4ea', borderRadius: '6px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CheckCircle size={20} /> {t('products.successMsg')}
                            </div>
                        )}

                        {status === 'error' && (
                            <div style={{ color: '#d93025', padding: '1rem', background: '#fce8e6', borderRadius: '6px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <AlertCircle size={20} /> {t('products.errorMsg')}
                            </div>
                        )}

                        <div style={{ marginBottom: '1.2rem' }}>
                            <label style={{ display: 'block', marginBottom: '.5rem', fontWeight: '500' }}>{t('contact.formName')}</label>
                            <input name="name" type="text" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '1rem' }} required />
                        </div>
                        <div style={{ marginBottom: '1.2rem' }}>
                            <label style={{ display: 'block', marginBottom: '.5rem', fontWeight: '500' }}>{t('contact.formEmail')}</label>
                            <input name="email" type="email" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '1rem' }} required />
                        </div>
                        <div style={{ marginBottom: '1.2rem' }}>
                            <label style={{ display: 'block', marginBottom: '.5rem', fontWeight: '500' }}>{t('contact.formMessage')}</label>
                            <textarea name="message" rows={5} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '1rem', resize: 'vertical' }} required></textarea>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} disabled={sending}>
                            {sending ? t('products.sending') : t('contact.submit')}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
