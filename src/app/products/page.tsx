import React from 'react';
import { prisma } from '@/lib/prisma';
import ProductList from '@/components/ProductList';
import { Product } from '@/types';

// Force dynamic rendering so we always get fresh data (or we can use revalidate)
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const rawProducts = await prisma.product.findMany({
        where: { is_active: true },
        orderBy: { createdAt: 'desc' }
    }).catch((e: unknown) => {
        console.error("Failed to fetch products:", e);
        return [];
    });

    // Serialize dates for Client Component
    const products: Product[] = rawProducts.map((p: any) => ({
        id: p.id,
        name_en: p.name_en,
        name_fr: p.name_fr,
        desc_en: p.desc_en,
        desc_fr: p.desc_fr,
        category: p.category,
        origin: p.origin,
        price: Number(p.price),
        season: p.season,
        moq: Number(p.moq),
        quantity: Number(p.quantity),
        images: p.images || [],
    }));

    return <ProductList products={products} />;
}
