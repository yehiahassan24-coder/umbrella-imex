import React from 'react';
import { prisma } from '@/lib/prisma';
import ProductDetail from '@/components/ProductDetail';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const id = (await params).id;
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        return {
            title: 'Product Not Found | Umbrella Import',
        };
    }

    return {
        title: `${product.name_en} | Umbrella Import`,
        description: product.desc_en,
    };
}

export default async function Page({ params }: Props) {
    const id = (await params).id;
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        notFound();
    }

    // Convert dates and handle nulls
    const serializedProduct = {
        ...product,
        createdAt: product.createdAt.toISOString(),
    };

    return <ProductDetail product={serializedProduct} />;
}
