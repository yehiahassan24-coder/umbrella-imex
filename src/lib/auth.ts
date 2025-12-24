import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET is not set in production environment');
    }
}
const key = new TextEncoder().encode(SECRET_KEY || 'development-only-secret');

export async function signJWT(payload: Record<string, unknown>) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer('umbrella-corp')
        .setAudience('umbrella-admin')
        .setExpirationTime('4h')
        .sign(key);
}

export async function verifyJWT(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            issuer: 'umbrella-corp',
            audience: 'umbrella-admin',
        });
        return payload;
    } catch (error) {
        console.error('JWT Verification Failed:', error);
        return null;
    }
}
