import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAdminNotification, sendCustomerAutoReply } from '@/lib/mail';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const lang = body.lang || 'en';

        // Basic validation
        if (!body.name || !body.email || !body.message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Fetch product name if productId is provided for the email
        let productName = undefined;
        if (body.productId) {
            const product = await prisma.product.findUnique({
                where: { id: body.productId },
                select: { name_en: true }
            });
            productName = product?.name_en;
        }

        const inquiry = await prisma.inquiry.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone || '',
                message: body.message,
                productId: body.productId || null,
                status: 'NEW' as any
            },
        });

        // Trigger Phase 5 Email Notifications (Async)
        try {
            await sendAdminNotification({
                name: body.name,
                email: body.email,
                phone: body.phone || 'N/A',
                message: body.message,
                productName
            });

            await sendCustomerAutoReply(body.email, body.name, lang);
        } catch (mailError) {
            console.error('Mail notification failed:', mailError);
            // We don't block the response if mail fails, but we log it
        }

        return NextResponse.json({ success: true, id: inquiry.id });
    } catch (error) {
        console.error('Inquiry Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
