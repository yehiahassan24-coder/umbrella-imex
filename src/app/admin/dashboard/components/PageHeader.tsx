import React from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e2e8f0'
        }}>
            <div>
                <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 700, color: '#1e293b' }}>{title}</h1>
                {description && <p style={{ color: '#64748b', marginTop: '0.25rem' }}>{description}</p>}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                {children}
            </div>
        </div>
    );
}
