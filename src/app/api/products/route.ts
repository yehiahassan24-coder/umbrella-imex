import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/permissions';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await requirePermission(request, 'CREATE_PRODUCT');
        const body = await request.json();

        // Basic slug generation if not provided
        let slug = body.slug;
        if (!slug && body.name_en) {
            slug = body.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        if (!slug) slug = `product-${Date.now()}`;

        const product = await prisma.product.create({
            data: {
                name_en: body.name_en,
                name_fr: body.name_fr,
                desc_en: body.desc_en,
                desc_fr: body.desc_fr,
                category: body.category,
                origin: body.origin,
                season: body.season,
                moq: parseInt(body.moq) || 0,
                price: parseFloat(body.price) || 0,
                quantity: parseInt(body.quantity) || 0,
                is_active: body.is_active ?? true,

                // New Fields
                images: body.images || [],
                slug: slug,
                sku: body.sku || null,
                tags: body.tags || [],
                seoTitle: body.seoTitle || null,
                seoDesc: body.seoDesc || null,
                isFeatured: body.isFeatured || false
            }
        });

        // ✅ Audit Logging
        const { createAuditLog } = await import('@/lib/audit');
        await createAuditLog(session.user.id, 'CREATE', 'PRODUCT', product.id, `Created product ${product.name_en}`);

        return NextResponse.json(product);
    } catch (error: any) {
        console.error("Create Product Error:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Product with this slug or SKU already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
