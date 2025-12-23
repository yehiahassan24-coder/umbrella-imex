import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/permissions';

export async function POST(request: Request) {
    try {
        const session = await requirePermission(request, 'MARK_INQUIRY_READ');
        const payload = session.user;

        const { action, ids, data } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'No items selected' }, { status: 400 });
        }

        let result;

        switch (action) {
            case 'delete':
                result = await prisma.inquiry.deleteMany({
                    where: { id: { in: ids } }
                });
                break;

            case 'update_status':
                result = await prisma.inquiry.updateMany({
                    where: { id: { in: ids } },
                    data: { status: data.status }
                });
                break;

            case 'mark_read':
                result = await prisma.inquiry.updateMany({
                    where: { id: { in: ids } },
                    data: { is_read: true }
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
                entity: 'Inquiry',
                entityId: 'multiple',
                details: `Affected ${result.count} items. IDs: ${ids.join(', ')}`
            }
        });

        return NextResponse.json({ success: true, count: result.count });

    } catch (error) {
        console.error('Bulk Inquiry Operation Error:', error);
        return NextResponse.json({ error: 'Bulk operation failed' }, { status: 500 });
    }
}
