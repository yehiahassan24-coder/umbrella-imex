import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const token = (await cookies()).get('admin-token')?.value;
        const payload = token ? await verifyJWT(token) : null;

        if (!payload || (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { action, ids, data } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'No items selected' }, { status: 400 });
        }

        let result;

        switch (action) {
            case 'delete':
                result = await prisma.product.deleteMany({
                    where: { id: { in: ids } }
                });
                break;

            case 'update':
                result = await prisma.product.updateMany({
                    where: { id: { in: ids } },
                    data: data
                });
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Log the action
        await prisma.auditLog.create({
            data: {
                userId: payload.id as string,
                action: action === 'delete' ? 'BULK_DELETE' : 'BULK_UPDATE',
                entity: 'Product',
                entityId: 'multiple',
                details: `Affected ${result.count} items. IDs: ${ids.join(', ')}`
            }
        });

        return NextResponse.json({ success: true, count: result.count });

    } catch (error) {
        console.error('Bulk Operation Error:', error);
        return NextResponse.json({ error: 'Bulk operation failed' }, { status: 500 });
    }
}
