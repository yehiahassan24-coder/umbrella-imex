import { SignJWT, jwtVerify } from 'jose';
// Encryption/decryption moved to lib/password.ts to keep this file edge-compatible

const SECRET_KEY = process.env.JWT_SECRET || 'umbrella-secret-key-change-me';
const key = new TextEncoder().encode(SECRET_KEY);

export async function signJWT(payload: Record<string, unknown>) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function verifyJWT(token: string) {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload;
    } catch {
        return null;
    }
}
