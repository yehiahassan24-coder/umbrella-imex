import React from 'react';
import { prisma } from '@/lib/prisma';
import HomeContent from '@/components/HomeContent';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch products server side
  const products = await prisma.product.findMany({
    take: 4,
    where: { is_active: true },
    orderBy: { createdAt: 'desc' }
  });

  // Serialize dates
  const serializedProducts: Product[] = products.map((p: any) => ({
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Umbrella Import & Export",
    "url": "https://umbrella-imex.vercel.app",
    "description": "Premium agricultural import and export connecting global markets with Egyptian produce.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+20 100 000 0000",
      "contactType": "sales",
      "areaServed": "Global",
      "availableLanguage": ["English", "French"]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent products={serializedProducts} />
    </>
  );
}
