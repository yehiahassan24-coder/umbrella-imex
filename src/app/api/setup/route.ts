import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

export async function GET() {
    // 🔒 PRODUCTION SAFETY: Disable this endpoint in production
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Setup endpoint is disabled in production' }, { status: 403 });
    }

    try {
        const count = await prisma.user.count();
        if (count > 0) {
            return NextResponse.json({
                message: 'Database already has users',
                warning: 'Use this endpoint only for development. Delete this file before production deployment.'
            });
        }

        const password = await hashPassword('admin123');

        await prisma.user.createMany({
            data: [
                { email: 'super@umbrella.com', password, role: 'SUPER_ADMIN', isActive: true },
                { email: 'admin@umbrella.com', password, role: 'ADMIN', isActive: true },
                { email: 'editor@umbrella.com', password, role: 'EDITOR', isActive: true }
            ]
        });

        // Create some sample products
        await prisma.product.createMany({
            data: [
                {
                    name_en: 'Premium Red Apples',
                    name_fr: 'Pommes Rouges Premium',
                    desc_en: 'Crisp and sweet red apples from Okanagan Valley.',
                    desc_fr: 'Pommes rouges croquantes et sucrées de la vallée de l\'Okanagan.',
                    category: 'Fruits',
                    origin: 'Canada',
                    season: 'Fall',
                    price: 2.50,
                    moq: 1000,
                    quantity: 5000,
                    is_active: true
                },
                {
                    name_en: 'Organic Carrots',
                    name_fr: 'Carottes Biologiques',
                    desc_en: 'Fresh organic carrots, bulk packaging.',
                    desc_fr: 'Carottes biologiques fraîches, emballage en vrac.',
                    category: 'Vegetables',
                    origin: 'Canada',
                    season: 'Year-round',
                    price: 0.80,
                    moq: 500,
                    quantity: 10000,
                    is_active: true
                }
            ]
        });

        return NextResponse.json({
            message: 'Setup complete. All test users created with password: admin123',
            warning: '⚠️ IMPORTANT: Delete this endpoint before deploying to production!',
            users: [
                'super@umbrella.com (SUPER_ADMIN)',
                'admin@umbrella.com (ADMIN)',
                'editor@umbrella.com (EDITOR)'
            ]
        });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
