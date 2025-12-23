"use client";
import React, { useState } from 'react';
import InquiryModal from './InquiryModal';

interface InquiryTriggerProps {
    btnText: string;
    className?: string;
    initialProduct?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

/**
 * A client-side component that triggers the InquiryModal.
 * Useful for including the modal in server components.
 */
export default function InquiryTrigger({
    btnText,
    className,
    initialProduct,
    style,
    children
}: InquiryTriggerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={className}
                style={style}
            >
                {children || btnText}
            </button>
            <InquiryModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                initialProduct={initialProduct}
            />
        </>
    );
}
