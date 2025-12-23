import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signJWT } from '@/lib/auth';
import { comparePassword } from '@/lib/password';
import crypto from 'crypto';
import { rateLimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';

export async function POST(request: Request) {
    try {
        // --- Rate Limiting ---
        const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
        const limitResult = await rateLimit(`login:${ip}`, 5, 60);

        if (!limitResult.success) {
            return NextResponse.json({
                error: 'Too many login attempts. Please try again later.'
            }, { status: 429 });
        }

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Generic error to prevent email enumeration
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 1. Check Account Lockout
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            const minutesLeft = Math.ceil((user.lockedUntil.getTime() - new Date().getTime()) / 60000);
            return NextResponse.json({
                error: `Account is temporarily locked. Try again in ${minutesLeft} minutes.`
            }, { status: 423 });
        }

        if (!user.isActive) {
            return NextResponse.json({ error: 'Account is disabled. Please contact support.' }, { status: 403 });
        }

        const isValid = await comparePassword(password, user.password);

        if (!isValid) {
            // 2. Handle Failed Attempt
            const newAttempts = user.failedLoginAttempts + 1;
            const lockoutMinutes = 15;
            const lockedUntil = newAttempts >= 5 ? new Date(Date.now() + lockoutMinutes * 60000) : null;

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    failedLoginAttempts: newAttempts,
                    lockedUntil: lockedUntil
                }
            });

            // Audit the failed attempt if it results in lockout
            if (lockedUntil) {
                await prisma.auditLog.create({
                    data: {
                        userId: user.id,
                        action: 'ACCOUNT_LOCKOUT',
                        entity: 'User',
                        entityId: user.id,
                        details: `Account locked for ${lockoutMinutes} mins after ${newAttempts} failed attempts.`
                    }
                });
            }

            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 3. Success - Reset Lockout & Attempts
        const token = await signJWT({
            id: user.id,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            tokenVersion: user.tokenVersion
        });

        // 4. CSRF Token Generation
        const csrfToken = crypto.randomUUID();

        const response = NextResponse.json({
            success: true,
            user: {
                email: user.email,
                role: user.role
            }
            // ✅ CSRF token NOT sent in body - only in httpOnly cookie
        });

        // Admin Token (HTTP-Only)
        response.cookies.set('admin-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        // CSRF Token Cookie (HTTP-Only for server validation)
        response.cookies.set('csrf-token', csrfToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

        // Set a non-httpOnly flag cookie so the client knows it has a valid session
        response.cookies.set('is-authenticated', 'true', {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

        // Update last login and reset attempts
        await prisma.user.update({
            where: { id: user.id },
            data: {
                lastLogin: new Date(),
                failedLoginAttempts: 0,
                lockedUntil: null
            }
        });

        return response;

    } catch (error) {
        console.error('Fatal Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
