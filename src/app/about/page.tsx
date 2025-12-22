"use client";
import { useLanguage } from '@/lib/LanguageContext';

export default function About() {
    const { t } = useLanguage();
    return (
        <section>
            <div className="container">
                <h1>{t('about.title')}</h1>
                <div className="grid-2" style={{ alignItems: 'center' }}>
                    <div>
                        <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>{t('about.text')}</p>
                        <p style={{ marginTop: '1rem' }}>
                            {t('contact.aboutText2')}
                        </p>
                        <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
                            <div>
                                <h2 className="text-gold">10+</h2>
                                <span>{t('contact.yearsExp')}</span>
                            </div>
                            <div>
                                <h2 className="text-gold">50+</h2>
                                <span>{t('contact.partners')}</span>
                            </div>
                            <div>
                                <h2 className="text-gold">100%</h2>
                                <span>{t('contact.guarantee')}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ background: '#eee', height: '400px', borderRadius: '12px', backgroundImage: 'url(/images/hero-bg.png)', backgroundSize: 'cover' }}></div>
                </div>
            </div>
        </section>
    );
}
