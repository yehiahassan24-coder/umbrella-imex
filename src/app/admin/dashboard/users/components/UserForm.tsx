"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../dashboard.module.css';
import { Mail, Shield, Lock, Save, ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import Link from 'next/link';

interface UserFormProps {
    initialData?: {
        id: string;
        email: string;
        role: string;
        isActive: boolean;
    };
    isEdit?: boolean;
}

export default function UserForm({ initialData, isEdit = false }: UserFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: initialData?.email || '',
        password: '',
        role: initialData?.role || 'EDITOR',
        isActive: initialData?.isActive !== undefined ? initialData.isActive : true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = '/api/users';
            const method = isEdit ? 'PUT' : 'POST';
            const body = isEdit ? { id: initialData?.id, ...formData } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok) {
                showToast(isEdit ? 'User updated successfully' : 'User created successfully', 'success');
                router.push('/admin/dashboard/users');
                router.refresh();
            } else {
                showToast(data.error || 'Something went wrong', 'error');
            }
        } catch (error) {
            showToast('Connection error', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.productForm}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <Link href="/admin/dashboard/users" className={styles.backBtn} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none' }}>
                    <ArrowLeft size={18} /> Back to Users
                </Link>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Save size={18} /> {loading ? 'Saving...' : (isEdit ? 'Update User' : 'Create User')}
                </button>
            </div>

            <div className={styles.formGrid}>
                {/* Credentials Section */}
                <div className={styles.card}>
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Mail size={20} color="var(--color-gold)" /> Account Credentials
                    </h3>

                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="admin@umbrella.com"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>{isEdit ? 'New Password (Leave blank to keep current)' : 'Password'}</label>
                        <input
                            type="password"
                            required={!isEdit}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {/* Permissions & Status Section */}
                <div className={styles.card}>
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Shield size={20} color="var(--color-gold)" /> Permissions & Status
                    </h3>

                    <div className={styles.formGroup}>
                        <label>System Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="SUPER_ADMIN">Super Administrator (Full Access)</option>
                            <option value="ADMIN">Administrator (Stock & Inquiries)</option>
                            <option value="EDITOR">Editor (Stock Management Only)</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Account Status</label>
                        <div
                            className={styles.toggleContainer}
                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                background: '#f8fafc',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0'
                            }}
                        >
                            {formData.isActive ? <ToggleRight size={32} color="var(--color-success)" /> : <ToggleLeft size={32} color="#94a3b8" />}
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{formData.isActive ? 'Active' : 'Disabled'}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{formData.isActive ? 'User can log in and perform actions.' : 'User is blocked from logging in.'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
