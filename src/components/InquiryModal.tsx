"use client";
import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import styles from './InquiryModal.module.css';

interface InquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialProduct?: string;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    product: string;
    volume: string;
    port: string;
    message: string;
}

export default function InquiryModal({ isOpen, onClose, initialProduct }: InquiryModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        product: initialProduct || '',
        volume: '',
        port: '',
        message: ''
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});

    if (!isOpen) return null;

    const totalSteps = 4;

    const handleNext = () => {
        if (validateStep(step)) {
            if (step < totalSteps) {
                setStep(step + 1);
            } else {
                handleSubmit();
            }
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const validateStep = (currentStep: number) => {
        const newErrors: Partial<FormData> = {};
        let isValid = true;

        if (currentStep === 1) {
            if (!formData.name) newErrors.name = "Name is required";
            if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email is required";
        } else if (currentStep === 2) {
            if (!formData.product) newErrors.product = "Please select a product category";
        } else if (currentStep === 3) {
            if (!formData.volume) newErrors.volume = "Expected volume is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        // Here you would typically post to your API
        console.log("Submitting form:", formData);

        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        alert("Inquiry Sent! We will contact you shortly.");
        onClose();
        setStep(1);
        setFormData({
            name: '', email: '', phone: '', product: '', volume: '', port: '', message: ''
        });
    };

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div className={styles.overlay} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>

                <div className={styles.progressContainer}>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        />
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.875rem', color: '#718096' }}>
                        Step {step} of {totalSteps}
                    </div>
                </div>

                {step === 1 && (
                    <div className="step-content">
                        <h3 className={styles.stepTitle}>Let&apos;s start with your details</h3>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Full Name</label>
                            <input
                                className={styles.input}
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Enter your full name"
                            />
                            {errors.name && <p className={styles.error}>{errors.name}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email Address</label>
                            <input
                                className={styles.input}
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="name@company.com"
                            />
                            {errors.email && <p className={styles.error}>{errors.email}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Phone Number (Optional)</label>
                            <input
                                className={styles.input}
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="step-content">
                        <h3 className={styles.stepTitle}>What are you looking for?</h3>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Product Type</label>
                            <select
                                className={styles.select}
                                value={formData.product}
                                onChange={(e) => handleChange('product', e.target.value)}
                            >
                                <option value="">Select a category...</option>
                                <option value="Fruits">Fresh Fruits</option>
                                <option value="Vegetables">Fresh Vegetables</option>
                                <option value="Organic">Organic Produce</option>
                                <option value="Other">Other / Mixed Load</option>
                            </select>
                            {errors.product && <p className={styles.error}>{errors.product}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Additional Details</label>
                            <textarea
                                className={styles.textarea}
                                rows={4}
                                value={formData.message}
                                onChange={(e) => handleChange('message', e.target.value)}
                                placeholder="Specific varieties, quality grades, etc."
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="step-content">
                        <h3 className={styles.stepTitle}>Volume & Logistics</h3>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Expected Volume</label>
                            <select
                                className={styles.select}
                                value={formData.volume}
                                onChange={(e) => handleChange('volume', e.target.value)}
                            >
                                <option value="">Select volume...</option>
                                <option value="< 1 Container">Less than 1 Container</option>
                                <option value="1-5 Containers">1-5 Containers</option>
                                <option value="5-10 Containers">5-10 Containers</option>
                                <option value="10+ Containers">10+ Containers</option>
                            </select>
                            {errors.volume && <p className={styles.error}>{errors.volume}</p>}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="step-content">
                        <h3 className={styles.stepTitle}>Delivery Preferences</h3>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Preferred Destination Port</label>
                            <input
                                className={styles.input}
                                value={formData.port}
                                onChange={(e) => handleChange('port', e.target.value)}
                                placeholder="e.g. Rotterdam, Dubai, New York"
                            />
                        </div>
                        <div style={{ background: '#f0fff4', padding: '1rem', borderRadius: '8px', border: '1px solid #c6f6d5', color: '#276749' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Check size={20} />
                                <strong>Almost Done!</strong>
                            </div>
                            <p style={{ fontSize: '0.9rem', margin: 0 }}>Review your details and click submit to receive a custom quote within 24 hours.</p>
                        </div>
                    </div>
                )}

                <div className={styles.buttonGroup}>
                    {step > 1 ? (
                        <button className={`${styles.btn} ${styles.btnBack}`} onClick={handleBack}>
                            <ChevronLeft size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            Back
                        </button>
                    ) : (
                        <div></div> // Spacer
                    )}
                    <button className={`${styles.btn} ${styles.btnNext}`} onClick={handleNext}>
                        {step === totalSteps ? 'Submit Inquiry' : 'Next Step'}
                        {step !== totalSteps && <ChevronRight size={18} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
