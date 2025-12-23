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

  const educationSchema = {
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "What is the Minimum Order Quantity (MOQ)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our typical MOQ is one 20ft container (approx 10-12 tons) depending on the crop. We can consolidate mixed pallets for trial orders."
      }
    }, {
      "@type": "Question",
      "name": "Do you have certification for EU markets?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we hold Global G.A.P, ISO 9001:2015, and organic certifications compliant with strict EU import standards."
      }
    }, {
      "@type": "Question",
      "name": "What are your shipping terms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer flexible IncoTerms including FOB, CIF, and DDP to major global ports in Europe, Middle East, and Asia."
      }
    }, {
      "@type": "Question",
      "name": "Can you provide private labeling?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we offer custom packaging and private labeling services for supermarkets and distributors."
      }
    }]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([educationSchema, faqSchema]) }}
      />
      <HomeContent products={serializedProducts} />
    </>
  );
}
