import React from 'react';
import { prisma } from '@/lib/prisma';
import HomeContent, { Product } from '@/components/HomeContent';

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
  }));

  return <HomeContent products={serializedProducts} />;
}
