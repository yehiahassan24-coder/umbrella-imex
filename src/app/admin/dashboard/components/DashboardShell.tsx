"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from '../dashboard.module.css';
import {
    LayoutDashboard,
    Package,
    MessageSquare,
    LogOut,
    ShoppingBag,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Users,
    History,
    Sun,
    Moon
} from 'lucide-react';
import { ToastProvider } from './ToastContext';

interface DashboardShellProps {
    children: React.ReactNode;
    email: string;
    role: string;
}

export default function DashboardShell({ children, email, role }: DashboardShellProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem('admin-sidebar-collapsed');
        if (saved !== null) {
            setIsCollapsed(saved === 'true');
        }

        const savedTheme = localStorage.getItem('admin-theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('admin-theme', newTheme);
    };

    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('admin-sidebar-collapsed', String(newState));
    };

    const links = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/dashboard/products', label: 'Products', icon: Package },
        { href: '/admin/dashboard/inquiries', label: 'Inquiries', icon: MessageSquare },
    ];

    if (role === 'SUPER_ADMIN') {
        links.push({ href: '/admin/dashboard/users', label: 'Users', icon: Users });
        links.push({ href: '/admin/dashboard/logs', label: 'Activity', icon: History });
    }

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin');
    };

    if (!isMounted) return null;

    return (
        <ToastProvider>
            <div className={`${styles.layout} ${isCollapsed ? styles.collapsedLayout : ''}`}>
                {/* Mobile Header */}
                <div className={styles.mobileHeader}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontWeight: 'bold' }}>
                        <ShoppingBag size={20} /> Admin
                    </div>
                    <button onClick={() => setMobileOpen(!mobileOpen)} className={styles.menuBtn}>
                        {mobileOpen ? <X /> : <Menu />}
                    </button>
                </div>

                <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsedSidebar : ''} ${mobileOpen ? styles.mobileOpen : ''}`}>
                    <div className={styles.brand}>
                        <ShoppingBag size={isCollapsed ? 24 : 32} />
                        {!isCollapsed && <span>Umbrella Admin</span>}
                    </div>

                    <button onClick={toggleCollapse} className={styles.collapseToggle}>
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>

                    <div className={styles.adminInfo}>
                        <div className={styles.avatar}>
                            {email.charAt(0).toUpperCase()}
                        </div>
                        {!isCollapsed && (
                            <div className={styles.details}>
                                <p className={styles.email}>{email}</p>
                                <p className={styles.role}>{role.replace('_', ' ')}</p>
                            </div>
                        )}
                    </div>

                    <nav className={styles.nav}>
                        {links.map(link => {
                            const isActive = link.href === '/admin/dashboard'
                                ? pathname === link.href
                                : pathname.startsWith(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                                    onClick={() => setMobileOpen(false)}
                                    title={isCollapsed ? link.label : undefined}
                                >
                                    <link.icon size={20} />
                                    {!isCollapsed && <span>{link.label}</span>}
                                </Link>
                            )
                        })}
                    </nav>

                    <button
                        onClick={toggleTheme}
                        className={styles.logoutBtn}
                        style={{ marginTop: '0', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                        title={isCollapsed ? (theme === 'light' ? "Dark Mode" : "Light Mode") : undefined}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        {!isCollapsed && <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
                    </button>

                    <button
                        onClick={handleLogout}
                        className={styles.logoutBtn}
                        title={isCollapsed ? "Logout" : undefined}
                    >
                        <LogOut size={20} />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </aside>

                <main className={styles.main}>
                    {children}
                </main>
            </div>
        </ToastProvider>
    );
}
