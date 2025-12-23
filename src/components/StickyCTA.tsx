"use client";
import React, { useState, useEffect } from 'react';
import { MessageSquareText } from 'lucide-react';

interface StickyCTAProps {
    onOpenModal: () => void;
}

export default function StickyCTA({ onOpenModal }: StickyCTAProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down 400px
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <>
            {/* Desktop Sticky Button - Bottom Right */}
            <div className="desktop-only">
                <button
                    onClick={onOpenModal}
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        zIndex: 90,
                        backgroundColor: '#1E5B3A',
                        color: 'white',
                        padding: '1rem 1.5rem',
                        borderRadius: '50px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        animation: 'fadeIn 0.3s ease-out'
                    }}
                >
                    <MessageSquareText size={20} />
                    Request Custom Quote
                </button>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="mobile-only">
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 90,
                    backgroundColor: 'white',
                    padding: '0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom)) 1rem', // Safe Area
                    boxShadow: '0 -4px 10px rgba(0,0,0,0.05)',
                    borderTop: '1px solid #e2e8f0',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    <button
                        onClick={onOpenModal}
                        style={{
                            width: '100%',
                            backgroundColor: '#28A745',
                            color: 'white',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            fontWeight: 600,
                            border: 'none',
                            fontSize: '1rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                    >
                        <MessageSquareText size={18} />
                        Request Quote
                    </button>
                </div>
            </div>

            <style jsx>{`
                .desktop-only { display: block; }
                .mobile-only { display: none; }

                @media (max-width: 768px) {
                    .desktop-only { display: none; }
                    .mobile-only { display: block; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </>
    );
}
