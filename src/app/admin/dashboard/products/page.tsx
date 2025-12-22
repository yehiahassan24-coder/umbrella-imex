import React from 'react';
import { prisma } from '@/lib/prisma';
import styles from '../dashboard.module.css';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import ProductListTable from './components/ProductListTable';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import PageHeader from '../components/PageHeader';

export const dynamic = 'force-dynamic';

export default async function ProductsAdminPage() {
    const token = (await cookies()).get('admin-token')?.value;
    const payload = token ? await verifyJWT(token) : null;
    const role = (payload?.role as string) || 'EDITOR';

    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name_en: true,
            category: true,
            price: true,
            quantity: true,
            is_active: true
        }
    });

    return (
        <div className={styles.dashboardPage}>
            <PageHeader
                title="Products"
                description="Inventory management and pricing"
            >
                <Link href="/admin/dashboard/products/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> Add Product
                </Link>
            </PageHeader>

            <div className={styles.card}>
                {products.length > 0 ? (
                    <ProductListTable products={products} role={role} />
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                        <p style={{ fontSize: '1.125rem' }}>No products found.</p>
                        <p style={{ fontSize: '0.875rem' }}>Start building your catalog by adding your first product.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
