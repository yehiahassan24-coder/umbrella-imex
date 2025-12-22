"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../dashboard.module.css';
import { Edit2, Trash2, Shield, User, ShieldCheck, Power, PowerOff, Loader2 } from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import Link from 'next/link';

interface UserData {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
}

export default function UserListTable({ users, currentUserId }: { users: UserData[], currentUserId: string }) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleDelete = async (id: string, email: string) => {
        if (id === currentUserId) {
            showToast('You cannot delete yourself', 'error');
            return;
        }

        if (!confirm(`Are you sure you want to delete user ${email}?`)) return;

        setLoadingId(id);
        try {
            const res = await fetch(`/api/users`, {
                method: 'DELETE',
                body: JSON.stringify({ id }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                showToast('User deleted successfully', 'success');
                router.refresh();
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to delete user', 'error');
            }
        } catch {
            showToast('Error deleting user', 'error');
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdate = async (id: string, updates: Partial<UserData>) => {
        setLoadingId(id);
        try {
            const res = await fetch(`/api/users`, {
                method: 'PUT',
                body: JSON.stringify({ id, ...updates }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                showToast('User updated successfully', 'success');
                router.refresh();
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to update user', 'error');
            }
        } catch {
            showToast('Error updating user', 'error');
        } finally {
            setLoadingId(null);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return <span className={`${styles.statusBadge}`} style={{ backgroundColor: '#fefce8', color: '#854d0e', border: '1px solid #fef08a' }}><ShieldCheck size={14} style={{ marginRight: '4px' }} /> Super Admin</span>;
            case 'ADMIN':
                return <span className={`${styles.statusBadge}`} style={{ backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}><Shield size={14} style={{ marginRight: '4px' }} /> Admin</span>;
            default:
                return <span className={`${styles.statusBadge}`} style={{ backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}><User size={14} style={{ marginRight: '4px' }} /> Editor</span>;
        }
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => {
                        const isSelf = user.id === currentUserId;
                        return (
                            <tr key={user.id} style={!user.isActive ? { opacity: 0.6 } : {}}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{user.email}</div>
                                    {isSelf && <span style={{ fontSize: '10px', color: 'var(--color-gold)', textTransform: 'uppercase', fontWeight: 800 }}> (You)</span>}
                                </td>
                                <td>
                                    <select
                                        className={styles.input}
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', width: 'auto' }}
                                        value={user.role}
                                        disabled={isSelf || loadingId === user.id}
                                        onChange={(e) => handleUpdate(user.id, { role: e.target.value })}
                                        title={isSelf ? "You cannot modify your own role" : ""}
                                    >
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="EDITOR">Editor</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleUpdate(user.id, { isActive: !user.isActive })}
                                        disabled={isSelf || loadingId === user.id}
                                        className={`${styles.statusBadge} ${user.isActive ? styles.statusNew : styles.statusRead}`}
                                        style={{ border: 'none', cursor: isSelf ? 'not-allowed' : 'pointer', fontSize: '11px', appearance: 'none' }}
                                        title={isSelf ? "You cannot disable your own account" : ""}
                                    >
                                        {user.isActive ? '🟢 Active' : '🔴 Disabled'}
                                    </button>
                                </td>
                                <td style={{ color: '#64748b', fontSize: '0.875rem' }}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        {loadingId === user.id ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <>
                                                <Link
                                                    href={`/admin/dashboard/users/${user.id}/edit`}
                                                    className={styles.iconBtn}
                                                    title={isSelf ? "You cannot modify your own account" : "Edit User"}
                                                    style={isSelf ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                                                    onClick={(e) => isSelf && e.preventDefault()}
                                                >
                                                    <Edit2 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user.id, user.email)}
                                                    className={`${styles.iconBtn} ${styles.deleteBtn}`}
                                                    title={isSelf ? "You cannot delete yourself" : "Delete User"}
                                                    disabled={isSelf}
                                                    style={isSelf ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
