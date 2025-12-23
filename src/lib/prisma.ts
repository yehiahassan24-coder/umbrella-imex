import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL;

// Ensure we don't create a new pool/client connection on every reload in development
export const prisma = globalForPrisma.prisma || createPrismaClient();

function createPrismaClient() {
    if (!connectionString) {
        // In build time or if env not set, this might fail, so we warn.
        // But we return a dummy client or throw to fail fast?
        // Better to let Prisma handle the error when it tries to connect.
        console.warn('⚠️ DATABASE_URL is not defined');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
