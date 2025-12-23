import { prisma } from "./prisma";

export async function getDashboardAnalytics() {
    const now = new Date();
    const last14Days = new Date();
    last14Days.setDate(now.getDate() - 14);

    const [
        totalProducts,
        activeProducts,
        totalInquiries,
        newInquiries,
        inquiriesTrend,
        productsByCategory,
        highPriorityLeads,
        overdueInquiries,
    ] = await Promise.all([
        prisma.product.count(),
        prisma.product.count({
            where: { quantity: { gt: 0 } },
        }),
        prisma.inquiry.count(),
        prisma.inquiry.count({
            where: { createdAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } },
        }),

        // 📈 Inquiries over time (last 14 days)
        // Using Prisma findMany for better database portability, then grouping in JS
        prisma.inquiry.findMany({
            where: {
                createdAt: { gte: last14Days },
            },
            select: {
                createdAt: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        }),

        // 🧺 Products by category
        prisma.product.groupBy({
            by: ["category"],
            _count: {
                id: true
            },
        }),
        // 🚨 High Priority Leads (High + Urgent)
        prisma.inquiry.count({
            where: { priority: { in: ['HIGH', 'URGENT'] as any } }
        }),

        // ⚠️ Overdue (New + Older than 24h)
        prisma.inquiry.count({
            where: {
                status: 'NEW',
                createdAt: { lte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
            }
        }),
    ]);

    // Process inquiries into daily buckets for the chart
    const dailyMap = new Map();
    for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        dailyMap.set(dateStr, 0);
    }

    inquiriesTrend.forEach(inq => {
        const dateStr = new Date(inq.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        if (dailyMap.has(dateStr)) {
            dailyMap.set(dateStr, dailyMap.get(dateStr) + 1);
        }
    });

    const chartData = Array.from(dailyMap).map(([name, total]) => ({ name, total }));

    const categoryData = productsByCategory.map(pc => ({
        name: pc.category,
        value: pc._count.id
    }));

    return {
        kpis: {
            totalProducts,
            activeProducts,
            totalInquiries,
            newInquiries,
            highPriorityLeads,
            overdueInquiries,
        },
        charts: {
            inquiriesTrend: chartData,
            productsByCategory: categoryData,
        },
    };
}
