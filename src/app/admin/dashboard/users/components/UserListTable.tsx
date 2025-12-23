"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../dashboard.module.css';
import { Edit2, Trash2, Shield, User, ShieldCheck, Loader2, Search, Filter, Plus, XCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import UserForm from './UserForm';
import { authFetch } from '@/lib/api';

interface UserData {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    lastLogin: Date | null;
}

export default function UserListTable({ users, currentUserId }: { users: UserData[], currentUserId: string }) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | undefined>(undefined);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? user.isActive : !user.isActive);
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleCreate = () => {
        setEditingUser(undefined);
        setShowModal(true);
    };

    const handleEdit = (user: UserData) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleSuccess = () => {
        setShowModal(false);
        setEditingUser(undefined);
        router.refresh();
    };

    const handleDelete = async (id: string, email: string) => {
        if (id === currentUserId) return showToast('You cannot delete yourself', 'error');
        if (!confirm(`Are you sure you want to delete user ${email}?`)) return;

        setLoadingId(id);
        try {
            const res = await authFetch(`/api/users`, {
                method: 'DELETE',
                body: JSON.stringify({ id }),
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
            const res = await authFetch(`/api/users`, {
                method: 'PUT',
                body: JSON.stringify({ id, ...updates }),
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
                return <span className={styles.statusBadge} style={{ background: '#fefce8', color: '#854d0e', border: '1px solid #fef08a' }}><ShieldCheck size={14} style={{ marginRight: '4px' }} /> Super Admin</span>;
            case 'ADMIN':
                return <span className={styles.statusBadge} style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}><Shield size={14} style={{ marginRight: '4px' }} /> Admin</span>;
            default:
                return <span className={styles.statusBadge} style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}><User size={14} style={{ marginRight: '4px' }} /> Editor</span>;
        }
    };

    return (
        <div>
            {/* Toolbar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            className={styles.input}
                            placeholder="Search users..."
                            style={{ paddingLeft: '2.5rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Filter size={18} style={{ color: '#64748b' }} />
                        <select className={styles.select} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ width: '140px' }}>
                            <option value="ALL">All Roles</option>
                            <option value="SUPER_ADMIN">Super Admin</option>
                            <option value="ADMIN">Admin</option>
                            <option value="EDITOR">Editor</option>
                        </select>
                        <select className={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '130px' }}>
                            <option value="ALL">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="DISABLED">Disabled</option>
                        </select>
                    </div>
                </div>

                <button onClick={handleCreate} className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Plus size={18} /> Add User
                </button>
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Last Login</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => {
                            const isSelf = user.id === currentUserId;
                            return (
                                <tr key={user.id} style={!user.isActive ? { opacity: 0.6, background: '#f8fafc' } : {}}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: user.isActive ? '#e2e8f0' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#64748b', fontSize: '0.9rem' }}>
                                                {user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#0f172a' }}>{user.email}</div>
                                                {isSelf && <span style={{ fontSize: '10px', color: 'var(--color-gold)', textTransform: 'uppercase', fontWeight: 800 }}> (You)</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {isSelf ? getRoleBadge(user.role) : (
                                            <div className="group" style={{ position: 'relative', display: 'inline-block' }}>
                                                <select
                                                    className={styles.input}
                                                    style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto', background: 'transparent', border: 'none', fontWeight: 500, cursor: 'pointer' }}
                                                    value={user.role}
                                                    disabled={loadingId === user.id}
                                                    onChange={(e) => handleUpdate(user.id, { role: e.target.value })}
                                                >
                                                    <option value="SUPER_ADMIN">Super Admin</option>
                                                    <option value="ADMIN">Admin</option>
                                                    <option value="EDITOR">Editor</option>
                                                </select>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleUpdate(user.id, { isActive: !user.isActive })}
                                            disabled={isSelf || loadingId === user.id}
                                            className={styles.statusBadge}
                                            style={{
                                                border: '1px solid',
                                                borderColor: user.isActive ? '#bbf7d0' : '#fecaca',
                                                background: user.isActive ? '#f0fdf4' : '#fef2f2',
                                                color: user.isActive ? '#166534' : '#991b1b',
                                                cursor: isSelf ? 'not-allowed' : 'pointer',
                                                display: 'flex', alignItems: 'center', gap: '4px',
                                                appearance: 'none'
                                            }}
                                            title={isSelf ? "You cannot disable your own account" : "Click to toggle status"}
                                        >
                                            {user.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                            {user.isActive ? 'Active' : 'Disabled'}
                                        </button>
                                    </td>
                                    <td style={{ color: '#64748b', fontSize: '0.875rem' }}>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ color: '#64748b', fontSize: '0.875rem' }}>
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            {loadingId === user.id ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className={styles.iconBtn}
                                                        title={isSelf ? "You cannot modify your own details here" : "Edit User"}
                                                        disabled={isSelf}
                                                        style={isSelf ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id, user.email)}
                                                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                                                        title={isSelf ? "You cannot delete yourself" : "Delete User"}
                                                        disabled={isSelf}
                                                        style={isSelf ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                    No users found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <UserForm user={editingUser} onClose={() => setShowModal(false)} onSuccess={handleSuccess} />
            )}
        </div>
    );
}
