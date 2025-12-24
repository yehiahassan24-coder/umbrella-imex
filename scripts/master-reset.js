
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function masterReset() {
    console.log('--- Master Reset Starting ---');

    const users = [
        {
            email: 'admin@umbrella.com',
            password: 'UmbrellaImport2025!',
            role: 'SUPER_ADMIN'
        },
        {
            email: 'super@test.com',
            password: 'SuperAdmin123!',
            role: 'SUPER_ADMIN'
        }
    ];

    for (const userData of users) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        try {
            await prisma.user.upsert({
                where: { email: userData.email },
                update: {
                    password: hashedPassword,
                    role: userData.role,
                    isActive: true,
                    failedLoginAttempts: 0,
                    lockedUntil: null,
                    tokenVersion: { increment: 1 }
                },
                create: {
                    email: userData.email,
                    password: hashedPassword,
                    role: userData.role,
                    isActive: true
                }
            });
            console.log(`Successfully updated/created: ${userData.email}`);
        } catch (e) {
            console.error(`Error for ${userData.email}:`, e);
        }
    }

    console.log('--- Master Reset Complete ---');
}

masterReset().finally(() => prisma.$disconnect());
