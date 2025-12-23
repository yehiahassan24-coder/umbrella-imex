import { Redis } from '@upstash/redis';

// Initialize Redis client for rate limiting
// Falls back to in-memory if Redis not configured
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

// In-memory fallback for development (not production-safe for distributed systems)
const memoryStore = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(key: string, limit: number, windowSeconds: number) {
    const now = Date.now();

    // Use Redis if available (production)
    if (redis) {
        try {
            const current = await redis.incr(key);

            // Set expiry on first increment
            if (current === 1) {
                await redis.expire(key, windowSeconds);
            }

            const ttl = await redis.ttl(key);
            const resetAt = new Date(now + (ttl * 1000));

            if (current > limit) {
                return {
                    success: false,
                    remaining: 0,
                    resetAt
                };
            }

            return {
                success: true,
                remaining: limit - current,
                resetAt
            };
        } catch (error) {
            console.error('Redis rate limit error:', error);
            // Fall through to memory store on Redis failure
        }
    }

    // Fallback: In-memory store (development only)
    const record = memoryStore.get(key);
    const resetTime = now + (windowSeconds * 1000);

    if (!record || record.resetAt < now) {
        // Create or reset
        memoryStore.set(key, { count: 1, resetAt: resetTime });
        return {
            success: true,
            remaining: limit - 1,
            resetAt: new Date(resetTime)
        };
    }

    if (record.count >= limit) {
        return {
            success: false,
            remaining: 0,
            resetAt: new Date(record.resetAt)
        };
    }

    // Atomic increment in memory
    record.count += 1;
    memoryStore.set(key, record);

    return {
        success: true,
        remaining: limit - record.count,
        resetAt: new Date(record.resetAt)
    };
}

// Cleanup function for memory store (call periodically)
export function cleanupExpiredRateLimits() {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
        if (record.resetAt < now) {
            memoryStore.delete(key);
        }
    }
}
