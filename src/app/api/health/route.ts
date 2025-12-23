import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Simple database connectivity check
        await prisma.$queryRaw`SELECT 1`;

        // ✅ Minimal public response - no version or infrastructure details
        return NextResponse.json({
            status: 'ok',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        // Generic error - no internal details
        return NextResponse.json({
            status: 'error',
            timestamp: new Date().toISOString()
        }, { status: 503 });
    }
}
