export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';

export const permissions = {
    // Product permissions
    VIEW_PRODUCTS: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
    CREATE_PRODUCT: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
    UPDATE_PRODUCT: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
    DELETE_PRODUCT: ['SUPER_ADMIN', 'ADMIN'],

    // Inquiry permissions
    VIEW_INQUIRIES: ['SUPER_ADMIN', 'ADMIN'],
    MARK_INQUIRY_READ: ['SUPER_ADMIN', 'ADMIN'],
    DELETE_INQUIRY: ['SUPER_ADMIN'],

    // User management (SUPER_ADMIN ONLY)
    VIEW_USERS: ['SUPER_ADMIN'],
    MANAGE_USERS: ['SUPER_ADMIN'],
    EDIT_USER_ROLE: ['SUPER_ADMIN'],
    DELETE_USER: ['SUPER_ADMIN'],
};

export function hasPermission(role: string, permission: keyof typeof permissions): boolean {
    const allowedRoles = permissions[permission];
    return allowedRoles.includes(role as Role);
}

import { cookies } from "next/headers";
import { verifyJWT } from "./auth";
import { prisma } from "./prisma";

export async function requirePermission(req: Request, permission: keyof typeof permissions) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const payload = await verifyJWT(token);
    if (!payload) {
        throw new Error("Unauthorized");
    }

    // Secure Check: Fetch user to verify status and token version (Revocation support)
    const user = await prisma.user.findUnique({
        where: { id: payload.id as string },
        select: { isActive: true, tokenVersion: true, role: true }
    });

    if (!user || user.isActive === false || user.tokenVersion !== payload.tokenVersion) {
        throw new Error("Unauthorized");
    }

    if (!hasPermission(user.role, permission)) {
        throw new Error("Unauthorized");
    }

    return { user: { id: payload.id as string, email: payload.email as string, role: user.role } };
}
