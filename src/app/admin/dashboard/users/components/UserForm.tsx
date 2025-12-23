"use client";
import React, { useState, useEffect } from 'react';
import styles from '../../dashboard.module.css';
import { useToast } from '../../components/ToastContext';
import { Save, X, Loader2, Shield, User, ShieldCheck } from 'lucide-react';
import { authFetch } from '@/lib/api';

interface UserData {
    id?: string;
    email: string;
    role: string;
    isActive: boolean;
    password?: string;
}

interface Props {
    user?: UserData;
    onClose: () => void;
    onSuccess: () => void;
}

export default function UserForm({ user, onClose, onSuccess }: Props) {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<UserData>({
        email: user?.email || '',
        role: user?.role || 'EDITOR',
        isActive: user?.isActive ?? true,
        password: '',
    });

    const isEdit = !!user;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!isEdit && !formData.password) {
            showToast('Password is required for new users', 'error');
            setLoading(false);
            return;
        }

        try {
            const url = '/api/users';
            const method = isEdit ? 'PUT' : 'POST';
            const payload = isEdit ? { ...formData, id: user.id } : formData;

            const res = await authFetch(url, {
                method,
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                showToast(isEdit ? 'User updated' : 'User created', 'success');
                onSuccess();
            } else {
                showToast(data.error || 'Operation failed', 'error');
            }
        } catch {
            showToast('Network error', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.detailsPanel} style={{ maxWidth: '500px' }}>
                <div className={styles.panelHeader}>
                    <h3>{isEdit ? 'Edit User' : 'Add New User'}</h3>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.panelContent}>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            className={styles.input}
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Password {isEdit && '(Leave blank to keep unchanged)'}</label>
                        <input
                            type="password"
                            className={styles.input}
                            value={formData.password || ''}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required={!isEdit}
                            placeholder={isEdit ? '••••••••' : 'Secret password'}
                        />
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Role</label>
                            <select
                                className={styles.select}
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="SUPER_ADMIN">Super Admin</option>
                                <option value="ADMIN">Admin</option>
                                <option value="EDITOR">Editor</option>
                            </select>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {formData.role === 'SUPER_ADMIN' && <><ShieldCheck size={14} color="#854d0e" /> Full Access to entire system</>}
                                {formData.role === 'ADMIN' && <><Shield size={14} color="#166534" /> Manage products, inquiries, settings</>}
                                {formData.role === 'EDITOR' && <><User size={14} color="#475569" /> Can manage content only</>}
                            </p>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Status</label>
                            <label className={styles.toggleTile} style={{ padding: '0.6rem' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <span style={{ fontWeight: 500 }}>
                                    {formData.isActive ? 'Active Account' : 'Account Disabled'}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className={styles.panelActions} style={{ marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn" style={{ border: '1px solid #e2e8f0', background: 'white' }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {isEdit ? 'Save Changes' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
