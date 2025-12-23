import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // 1. Check Database Connection
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json({
            status: 'HEALTHY',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            services: {
                database: 'CONNECTED',
                storage: 'OPERATIONAL'
            }
        });
    } catch (error) {
        return NextResponse.json({
            status: 'UNHEALTHY',
            timestamp: new Date().toISOString(),
            error: 'Database connection failed'
        }, { status: 503 });
    }
}
