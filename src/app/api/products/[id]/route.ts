import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await requirePermission(request, 'UPDATE_PRODUCT');
        const payload = session.user;
        const id = (await params).id;
        const body = await request.json();

        // Regenerate slug if needed, but usually keep existing unless explicitly changed
        // For now, accept whatever slug is sent if unique

        const product = await prisma.product.update({
            where: { id },
            data: {
                name_en: body.name_en,
                name_fr: body.name_fr,
                desc_en: body.desc_en,
                desc_fr: body.desc_fr,
                category: body.category,
                origin: body.origin,
                season: body.season,
                price: parseFloat(body.price),
                moq: parseInt(body.moq),
                quantity: parseInt(body.quantity),
                is_active: body.is_active,

                // New fields
                images: body.images,
                slug: body.slug,
                sku: body.sku,
                tags: body.tags,
                seoTitle: body.seoTitle,
                seoDesc: body.seoDesc,
                isFeatured: body.isFeatured
            }
        });

        await createAuditLog(payload.id as string, 'UPDATE', 'PRODUCT', product.id, `Updated product ${product.name_en}`);

        return NextResponse.json(product);
    } catch (error: any) {
        console.error('Update Product Error:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Product with this slug or SKU already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await requirePermission(request, 'DELETE_PRODUCT');
        const payload = session.user;
        const id = (await params).id;
        await prisma.product.delete({
            where: { id }
        });
        await createAuditLog(payload.id as string, 'DELETE', 'PRODUCT', id, `Deleted product ID ${id}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete Product Error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
