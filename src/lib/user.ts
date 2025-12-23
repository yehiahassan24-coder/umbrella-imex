import { cookies } from 'next/headers';
import { verifyJWT } from './auth';
import { prisma } from './prisma';

export async function getAuthUser() {
    try {
        const token = (await cookies()).get('admin-token')?.value;
        if (!token) return null;

        const payload = await verifyJWT(token);
        if (!payload) return null;

        const user = await prisma.user.findUnique({
            where: { id: payload.id as string },
            select: { id: true, email: true, role: true, isActive: true, tokenVersion: true }
        });

        if (!user || user.isActive === false || user.tokenVersion !== payload.tokenVersion) {
            return null;
        }

        return user;
    } catch (error) {
        return null;
    }
}
