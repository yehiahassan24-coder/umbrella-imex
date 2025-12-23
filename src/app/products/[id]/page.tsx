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

    // Fetch related products (same category, exclude current)
    const relatedProducts = await prisma.product.findMany({
        where: {
            category: product.category,
            id: { not: product.id }
        },
        take: 4,
        select: {
            id: true,
            name_en: true,
            price: true,
            images: true,
            category: true,
            slug: true,
        }
    });

    // Convert dates and handle nulls
    const serializedProduct = {
        ...product,
        createdAt: product.createdAt.toISOString(),
    };

    // SEO Structured Data (JSON-LD)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name_en,
        image: product.images,
        description: product.desc_en,
        sku: product.sku || product.id,
        brand: {
            '@type': 'Brand',
            name: 'Umbrella Import'
        },
        offers: {
            '@type': 'Offer',
            url: `https://umbrella-imex.vercel.app/products/${product.slug}`,
            priceCurrency: 'USD',
            price: product.price,
            availability: product.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition'
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetail product={serializedProduct} relatedProducts={relatedProducts} />
        </>
    );
}
