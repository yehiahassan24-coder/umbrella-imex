"use client";
import React, { useState } from 'react';
import InquiryModal from '@/components/InquiryModal';

interface InquiryModalWrapperProps {
    btnText: string;
    className?: string;
    initialProduct?: string;
    style?: React.CSSProperties;
}

export default function InquiryModalWrapper({
    btnText,
    className,
    initialProduct,
    style
}: InquiryModalWrapperProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={className}
                style={style}
            >
                {btnText}
            </button>
            <InquiryModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                initialProduct={initialProduct}
            />
        </>
    );
}
