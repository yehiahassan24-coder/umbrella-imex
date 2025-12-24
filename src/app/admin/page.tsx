"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            let data;
            try {
                data = await res.json();
            } catch (jsonError) {
                console.error('JSON Parse Error:', jsonError);
                // If it's not JSON, it's likely a Vercel 500 error page
                const text = await res.text().catch(() => 'No response body');
                console.error('Raw Response:', text);
                throw new Error(`Server Error (${res.status}): The server returned an invalid response.`);
            }

            if (res.ok) {
                // Debug: Check if client cookies are set
                console.log('Login OK. Current Cookies:', document.cookie);

                // Force a hard navigation to ensure cookies are sent and middleware re-runs
                window.location.href = '/admin/dashboard';
            } else {
                setError(data.error || 'Invalid credentials');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            // Show the actual error message if possible to help debugging
            setError(err.message || 'System error. Please check your connection or try again later.');
        } finally {
            setIsLoading(false);
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

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className={styles.formGroupPassword}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        className={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
