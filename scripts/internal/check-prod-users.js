
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({
            select: { email: true, role: true, isActive: true, failedLoginAttempts: true, lockedUntil: true }
        });
        console.log('--- Production Users ---');
        console.log(JSON.stringify(users, null, 2));
    } catch (e) {
        console.error('Error listing users:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
