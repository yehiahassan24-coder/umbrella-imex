import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

async function checkAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    if (!token) return false;
    const payload = await verifyJWT(token);
    return !!payload;
}

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
    if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
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
                is_active: body.is_active ?? true
            }
        });
        return NextResponse.json(product);
    } catch (error) {
        console.error("Create Product Error:", error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
