"use client";
import React from 'react';
import styles from '../../dashboard.module.css';
import { formatRelativeDate } from '@/lib/utils';
import { User, Activity, Database, Clock } from 'lucide-react';

interface LogEntry {
    id: string;
    action: string;
    entity: string;
    entityId: string | null;
    details: string | null;
    createdAt: string;
    user: {
        email: string;
        role: string;
    };
}

export default function LogsTable({ logs }: { logs: LogEntry[] }) {
    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE': return '#22c55e';
            case 'UPDATE': return '#3b82f6';
            case 'DELETE': return '#ef4444';
            default: return '#64748b';
        }
    };

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Entity</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log.id}>
                            <td style={{ whiteSpace: 'nowrap', color: '#64748b', fontSize: '0.875rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Clock size={14} />
                                    {new Date(log.createdAt).toLocaleString()}
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div className={styles.avatar} style={{ width: '24px', height: '24px', minWidth: '24px', fontSize: '0.7rem' }}>
                                        {log.user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{log.user.email}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{log.user.role}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span
                                    className={styles.statusBadge}
                                    style={{
                                        backgroundColor: `${getActionColor(log.action)}10`,
                                        color: getActionColor(log.action),
                                        border: `1px solid ${getActionColor(log.action)}30`
                                    }}
                                >
                                    {log.action}
                                </span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontWeight: 500 }}>
                                    <Database size={14} />
                                    {log.entity}
                                </div>
                            </td>
                            <td style={{ maxWidth: '300px' }}>
                                <div style={{ fontSize: '0.875rem', color: '#334155' }}>
                                    {log.details || 'No additional details'}
                                </div>
                                {log.entityId && (
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                                        ID: {log.entityId}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
