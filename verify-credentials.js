const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function verifyCredentials() {
    const email = 'super@test.com';
    const password = 'SuperAdmin123!';

    console.log(`Checking credentials for: ${email}`);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error('❌ User not found!');
        return;
    }

    console.log('User found:', { id: user.id, email: user.email, role: user.role, isActive: user.isActive });
    console.log('Stored Hash:', user.password);

    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
        console.log('✅ Password Match! The credentials are valid.');
    } else {
        console.error('❌ Password Mismatch! The password in DB does NOT match "SuperAdmin123!"');
        const newHash = await bcrypt.hash(password, 10);
        console.log('If we hashed "SuperAdmin123!" now, it would be:', newHash);
    }
}

verifyCredentials()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
