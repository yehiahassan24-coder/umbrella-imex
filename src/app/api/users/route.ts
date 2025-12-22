import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
    try {
        await requirePermission(req, "VIEW_USERS");

        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await requirePermission(req, "MANAGE_USERS");
        const body = await req.json();

        const existing = await prisma.user.findUnique({ where: { email: body.email } });
        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashed = await bcrypt.hash(body.password, 10);

        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: hashed,
                role: body.role,
                isActive: body.isActive ?? true,
            },
        });

        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "CREATE_USER",
                entity: "User",
                entityId: user.id,
                details: `Created user ${body.email} with role ${body.role}`,
            },
        });

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await requirePermission(req, "MANAGE_USERS");
        const { id, role, isActive, email, password } = await req.json();

        // ❌ self-protection
        if (id === session.user.id) {
            return NextResponse.json(
                { error: "You cannot modify your own account" },
                { status: 400 }
            );
        }

        const updateData: any = { role, isActive };
        if (email) updateData.email = email;
        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "UPDATE_USER",
                entity: "User",
                entityId: id,
                details: `Updated user ${user.email}`,
            },
        });

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await requirePermission(req, "DELETE_USER");
        const { id } = await req.json();

        if (id === session.user.id) {
            return NextResponse.json(
                { error: "You cannot delete yourself" },
                { status: 400 }
            );
        }

        const superAdmins = await prisma.user.count({
            where: { role: "SUPER_ADMIN", isActive: true },
        });

        const target = await prisma.user.findUnique({ where: { id } });

        if (target?.role === "SUPER_ADMIN" && superAdmins <= 1) {
            return NextResponse.json(
                { error: "Cannot delete last Super Admin" },
                { status: 400 }
            );
        }

        await prisma.user.delete({ where: { id } });

        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "DELETE_USER",
                entity: "User",
                entityId: id,
                details: `Deleted user ${target?.email}`,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
    }
}
