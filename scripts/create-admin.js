// Production Admin Setup Script
// Usage: node scripts/create-admin.js <email> <password>

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        // Get credentials and role from command line
        const email = process.argv[2];
        const password = process.argv[3];
        const inputRole = process.argv[4]; // Optional

        // Validation
        if (!email || !password) {
            console.error('❌ Usage: node scripts/create-admin.js <email> <password> [role]');
            console.error('Example: node scripts/create-admin.js admin@umbrella.com MyPass123! ADMIN');
            process.exit(1);
        }

        // Role validation
        const validRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'USER'];
        const role = inputRole ? inputRole.toUpperCase() : 'SUPER_ADMIN';

        if (!validRoles.includes(role)) {
            console.error(`❌ Invalid role. Must be one of: ${validRoles.join(', ')}`);
            process.exit(1);
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.error('❌ Invalid email format');
            process.exit(1);
        }

        // Password strength check
        if (password.length < 8) {
            console.error('❌ Password must be at least 8 characters long');
            process.exit(1);
        }

        console.log(`🔄 Creating user with role ${role}...`);

        // Check if user already exists
        const existing = await prisma.user.findUnique({
            where: { email }
        });

        if (existing) {
            console.error(`❌ User with email "${email}" already exists`);
            process.exit(1);
        }

        // Hash password
        console.log('🔐 Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const admin = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role,
                isActive: true
            }
        });

        console.log('\n✅ Admin account created successfully!\n');
        console.log('📧 Email:', admin.email);
        console.log('👤 Role:', admin.role);
        console.log('🆔 ID:', admin.id);
        console.log('📅 Created:', admin.createdAt);
        console.log('\n⚠️  IMPORTANT: Store these credentials securely!');
        console.log('🔗 Login at: https://your-domain.com/admin\n');

    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
