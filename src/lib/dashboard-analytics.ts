import { prisma } from "./prisma";

export async function getDashboardAnalytics() {
    const now = new Date();
    const last14Days = new Date();
    last14Days.setDate(now.getDate() - 14);

    const [
        totalProducts,
        activeProducts,
        totalInquiries,
        highPriorityLeads,
        overdueInquiries,
        inquiriesTrend,
        productsByCategory,
        inquiriesByStatus,
    ] = await Promise.all([
        prisma.product.count(),
        prisma.product.count({
            where: { is_active: true },
        }),
        prisma.inquiry.count(),

        // 🚨 High Priority Leads (High + Urgent)
        prisma.inquiry.count({
            where: { priority: { in: ['HIGH', 'URGENT'] as any } } as any
        }),

        // ⚠️ Overdue (New + Older than 24h)
        prisma.inquiry.count({
            where: {
                status: 'NEW',
                createdAt: { lte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
            }
        }),

        // 📈 Inquiries over time (last 14 days)
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

        // 📊 Conversion Funnel (Status breakdown)
        prisma.inquiry.groupBy({
            by: ["status"],
            _count: {
                id: true
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

    // Process Status data for Funnel
    const funnelData = inquiriesByStatus.map(is => ({
        name: is.status,
        value: is._count.id
    }));

    // SLA Performance (On-time vs Overdue)
    const slaData = [
        { name: 'On Time', value: totalInquiries - overdueInquiries },
        { name: 'SLA Breach', value: overdueInquiries }
    ];

    // New inquiries in last 7 days
    const last7DaysDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newInquiries = inquiriesTrend.filter(inq => new Date(inq.createdAt) >= last7DaysDate).length;

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
            conversionFunnel: funnelData,
            slaPerformance: slaData,
        },
    };
}
