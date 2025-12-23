import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requirePermission(req, "CREATE_PRODUCT");
        const { id } = params;

        // 1. Fetch original product
        const original = await prisma.product.findUnique({
            where: { id },
        });

        if (!original) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // 2. Prepare duplicate data
        // Remove ID and unique fields like slug, sku
        const { id: _, slug, sku, createdAt, ...baseData } = original;

        const timestamp = Date.now();
        const duplicate = await prisma.product.create({
            data: {
                ...baseData,
                name_en: `${original.name_en} (Copy)`,
                name_fr: `${original.name_fr} (Copie)`,
                slug: `${slug}-copy-${timestamp}`,
                sku: sku ? `${sku}-COPY-${timestamp}` : null,
                is_active: false, // Start as hidden
            },
        });

        // 3. Log the action
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "DUPLICATE_PRODUCT",
                entity: "Product",
                entityId: duplicate.id,
                details: `Duplicated from product ${original.id}`,
            },
        });

        return NextResponse.json(duplicate);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: error.message === "Unauthorized" ? 401 : 500 }
        );
    }
}
