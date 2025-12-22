import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { hasPermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';

async function getAuthPayload() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    if (!token) return null;
    return await verifyJWT(token);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const payload = await getAuthPayload();
    if (!payload || !hasPermission(payload.role as string, 'UPDATE_PRODUCT')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const id = (await params).id;
        const body = await request.json();

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
                is_active: body.is_active
            }
        });

        await createAuditLog(payload.id as string, 'UPDATE', 'PRODUCT', product.id, `Updated product ${product.name_en}`);

        return NextResponse.json(product);
    } catch (error) {
        console.error('Update Product Error:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const payload = await getAuthPayload();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!hasPermission(payload.role as string, 'DELETE_PRODUCT')) {
        return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    try {
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
