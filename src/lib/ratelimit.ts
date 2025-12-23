import { prisma } from "./prisma";

export async function rateLimit(key: string, limit: number, windowSeconds: number) {
    const now = new Date();

    // Cleanup expired limits occasionally (simplified: every call checks its own)
    // In production, you'd have a cron job for this.

    const record = await prisma.rateLimit.findUnique({
        where: { key }
    });

    if (!record || record.resetAt < now) {
        // Create or Reset
        await prisma.rateLimit.upsert({
            where: { key },
            create: {
                key,
                count: 1,
                resetAt: new Date(now.getTime() + windowSeconds * 1000)
            },
            update: {
                count: 1,
                resetAt: new Date(now.getTime() + windowSeconds * 1000)
            }
        });
        return { success: true, remaining: limit - 1 };
    }

    if (record.count >= limit) {
        return { success: false, remaining: 0, resetAt: record.resetAt };
    }

    const updated = await prisma.rateLimit.update({
        where: { key },
        data: { count: { increment: 1 } }
    });

    return { success: true, remaining: limit - updated.count };
}
