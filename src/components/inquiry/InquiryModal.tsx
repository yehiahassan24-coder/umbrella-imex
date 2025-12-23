"use client";
import React from 'react';
import { X } from 'lucide-react';
import styles from './InquiryModal.module.css';
import InquiryForm from './InquiryForm';

interface InquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialProduct?: string;
}

export default function InquiryModal({ isOpen, onClose, initialProduct }: InquiryModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>

                <InquiryForm
                    initialProduct={initialProduct}
                    onSuccess={onClose}
                    onCancel={onClose}
                />
            </div>
        </div>
    );
}
