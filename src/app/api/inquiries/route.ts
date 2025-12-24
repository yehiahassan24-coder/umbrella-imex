import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAdminNotification, sendCustomerAutoReply } from '@/lib/mail';
import { rateLimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';
import { sanitizeInput, isValidEmail } from '@/lib/sanitize';

export async function POST(request: Request) {
    try {
        // --- Rate Limiting ---
        const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
        const limitResult = await rateLimit(`inquiry:${ip}`, 10, 60);

        if (!limitResult.success) {
            return NextResponse.json({
                error: 'Too many inquiries. Please wait a moment before sending another.'
            }, { status: 429 });
        }

        const body = await request.json();
        const lang = body.lang || 'en';

        // Basic size protection
        if (JSON.stringify(body).length > 10000) {
            return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
        }

        // Field validation
        if (!body.name || !body.email || !body.message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (body.name.length > 100 || body.email.length > 100 || body.message.length > 5000) {
            return NextResponse.json({ error: 'Input too long' }, { status: 400 });
        }

        // Email format check with utility
        if (!isValidEmail(body.email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // ✅ SANITIZE ALL USER INPUTS to prevent XSS
        const sanitizedName = sanitizeInput(body.name);
        const sanitizedEmail = sanitizeInput(body.email);
        const sanitizedPhone = sanitizeInput(body.phone || '');
        const sanitizedMessage = sanitizeInput(body.message);

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
                name: sanitizedName,
                email: sanitizedEmail,
                phone: sanitizedPhone,
                message: sanitizedMessage,
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

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: { 'Allow': 'POST, OPTIONS, GET' } });
}

export async function GET() {
    return NextResponse.json({ status: 'API Online' }, { status: 200 });
}

export const dynamic = 'force-dynamic';
