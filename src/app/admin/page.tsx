"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Check if we are already authenticated on mount
    useEffect(() => {
        // Simple client-side check for a non-HTTPOnly cookie
        if (document.cookie.includes('is-authenticated=true')) {
            console.log('Client: Already authenticated, redirecting to dashboard...');
            router.push('/admin/dashboard');
        }
    }, [router]);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setError('');
        setIsLoading(true);
        console.log('Client: Attempting login for:', email);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log('Client: Login success. Redirecting to dashboard...');
                // Use window.location.href for a clean state reload
                window.location.href = '/admin/dashboard';
            } else {
                console.error('Client: Login failed:', data.error);
                setError(data.error || 'Invalid credentials');
            }
        } catch (err: any) {
            console.error('Client: Network/System error during login:', err);
            setError('System error. Please try again or check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    // Allow Enter key to submit
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <Lock size={24} />
                    </div>
                    <h1 className={styles.title}>Admin Login</h1>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <div onKeyDown={handleKeyDown}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                            disabled={isLoading}
                            autoComplete="email"
                        />
                    </div>
                    <div className={styles.formGroupPassword}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                            disabled={isLoading}
                            autoComplete="current-password"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleLogin}
                        className={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <span>Verifying...</span>
                            </div>
                        ) : 'Sign In'}
                    </button>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#6b7280' }}>
                        Secured Administrative Access
                    </div>
                </div>
            </div>
        </div>
    );
}
