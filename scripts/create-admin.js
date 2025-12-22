// Production Admin Setup Script
// Usage: node scripts/create-admin.js <email> <password>

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        // Get credentials from command line or use defaults
        const email = process.argv[2];
        const password = process.argv[3];

        // Validation
        if (!email || !password) {
            console.error('❌ Usage: node scripts/create-admin.js <email> <password>');
            console.error('Example: node scripts/create-admin.js admin@umbrella.com MyStrongPass123!');
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

        console.log('🔄 Creating admin account...');

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

        // Create admin user
        const admin = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'SUPER_ADMIN',
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
