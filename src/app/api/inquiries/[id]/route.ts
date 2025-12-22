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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const payload = await getAuthPayload();
    if (!payload || !hasPermission(payload.role as string, 'MARK_INQUIRY_READ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const id = (await params).id;
        const body = await request.json();

        // Allowed fields for update
        const data: any = {};
        if (body.is_read !== undefined) data.is_read = body.is_read;
        if (body.status !== undefined) data.status = body.status;

        const inquiry = await prisma.inquiry.update({
            where: { id },
            data
        });

        const actionDetail = body.status
            ? `Changed status to ${body.status}`
            : `Marked as ${body.is_read ? 'read' : 'unread'}`;

        await createAuditLog(payload.id as string, 'UPDATE', 'INQUIRY', inquiry.id, `Action: ${actionDetail} | User: ${inquiry.email}`);

        return NextResponse.json(inquiry);
    } catch {
        return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const payload = await getAuthPayload();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!hasPermission(payload.role as string, 'DELETE_INQUIRY')) {
        return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    try {
        const id = (await params).id;
        await prisma.inquiry.delete({
            where: { id }
        });
        await createAuditLog(payload.id as string, 'DELETE', 'INQUIRY', id, `Deleted inquiry ID ${id}`);

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
    }
}
