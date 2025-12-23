import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
    {
        name_en: "Egyptian Red Onions",
        name_fr: "Oignons Rouges Égyptiens",
        desc_en: "Premium quality Egyptian Red Onions known for their distinct pungency and vibrant color. Ideal for both culinary use and long-term storage. Our onions are harvested and cured to ensure maximum shelf life.",
        desc_fr: "Oignons rouges égyptiens de première qualité, connus pour leur piquant distinct et leur couleur vibrante. Idéal pour un usage culinaire et un stockage à long terme.",
        category: "Vegetables",
        origin: "Egypt",
        season: "April - August",
        price: 350.00,
        moq: 24000, // 40ft Container
        quantity: 500000,
        images: ["https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?auto=format&fit=crop&q=80&w=1000"],
        slug: "egyptian-red-onions",
        sku: "VEG-ON-RED-001",
        tags: ["onion", "vegetables", "fresh", "bulk"],
        seoTitle: "Fresh Egyptian Red Onions | Bulk Export",
        seoDesc: "Import premium Egyptian Red Onions. High quality, long shelf life, and competitive bulk pricing. Available for global shipping.",
        isFeatured: true,
        is_active: true
    },
    {
        name_en: "Valencia Oranges",
        name_fr: "Oranges Valencia",
        desc_en: "Juicy and sweet Valencia oranges, perfect for juicing. Grown in the sunny orchards of Egypt, these oranges are renowned for their high juice content and balanced acidity.",
        desc_fr: "Oranges Valencia juteuses et sucrées, parfaites pour le jus. Cultivées dans les vergers ensoleillés d'Égypte.",
        category: "Fruits",
        origin: "Egypt",
        season: "January - May",
        price: 600.00,
        moq: 24000,
        quantity: 200000,
        images: ["https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80&w=1000"],
        slug: "valencia-oranges",
        sku: "FRU-OR-VAL-001",
        tags: ["citrus", "orange", "juicing", "vitaminc"],
        seoTitle: "Egypian Valencia Oranges for Juicing | Export",
        seoDesc: "Top grade Valencia oranges from Egypt. High juice content, available in mixed sizes. Request a quote today.",
        isFeatured: true,
        is_active: true
    },
    {
        name_en: "Fresh Garlic",
        name_fr: "Ail Frais",
        desc_en: "Aromatic and flavorful Egyptian fresh garlic. Available in various bulb sizes, our garlic is perfect for retail and wholesale markets requiring strong flavor profiles.",
        desc_fr: "Ail frais égyptien aromatique et savoureux. Disponible en différentes tailles de bulbes.",
        category: "Vegetables",
        origin: "Egypt",
        season: "February - April",
        price: 900.00,
        moq: 20000,
        quantity: 150000,
        images: ["https://images.unsplash.com/photo-1615477382229-272e0bf49fa6?auto=format&fit=crop&q=80&w=1000"],
        slug: "fresh-garlic",
        sku: "VEG-GAR-001",
        tags: ["garlic", "spices", "fresh"],
        seoTitle: "Fresh Egyptian Garlic | Bulk Supplier",
        seoDesc: "Wholesale fresh garlic from Egypt. Strong flavor and excellent quality. Contact us for FOB pricing.",
        isFeatured: false,
        is_active: true
    },
    {
        name_en: "Pomegranate (Wonderful)",
        name_fr: "Grenade (Wonderful)",
        desc_en: "The 'Wonderful' variety is famous for its large size, deep red arils, and sweet-tart taste. Provides high antioxidant content and excellent shelf appeal.",
        desc_fr: "La variété 'Wonderful' est célèbre pour sa grande taille, ses arilles rouge foncé et son goût sucré-acidulé.",
        category: "Fruits",
        origin: "Egypt",
        season: "September - November",
        price: 850.00,
        moq: 18000,
        quantity: 100000,
        images: ["https://images.unsplash.com/photo-1615486511484-92e172cc416d?auto=format&fit=crop&q=80&w=1000"],
        slug: "pomegranate-wonderful",
        sku: "FRU-POM-WON-001",
        tags: ["fruit", "superfood", "pomegranate"],
        seoTitle: "Wonderful Pomegranates Egypt | Export Quality",
        seoDesc: "Import Wonderful variety pomegranates. Deep red color and premium taste. Global logistics available.",
        isFeatured: true,
        is_active: true
    },
    {
        name_en: "IQF Frozen Strawberries",
        name_fr: "Fraises Surgelées IQF",
        desc_en: "Individually Quick Frozen (IQF) strawberries. Preserving the natural taste, texture, and nutrients. Perfect for jams, smoothies, and bakery applications.",
        desc_fr: "Fraises surgelées individuellement (IQF). Préservant le goût naturel, la texture et les nutriments.",
        category: "Frozen",
        origin: "Egypt",
        season: "All Year",
        price: 1100.00,
        moq: 22000,
        quantity: 300000,
        images: ["https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=1000"],
        slug: "iqf-frozen-strawberries",
        sku: "FRZ-STR-001",
        tags: ["frozen", "strawberry", "iqf", "berry"],
        seoTitle: "IQF Frozen Strawberries From Egypt | Bulk",
        seoDesc: "High quality IQF strawberries. Grade A for industrial and food service use. Frozen at peak ripeness.",
        isFeatured: false,
        is_active: true
    }
];

async function main() {
    console.log('🌱 Starting seed...');
    for (const p of products) {
        const exists = await prisma.product.findUnique({
            where: { slug: p.slug }
        });

        if (!exists) {
            await prisma.product.create({
                data: p
            });
            console.log(`✅ Created product: ${p.name_en}`);
        } else {
            console.log(`⏩ Skipping ${p.name_en} (already exists)`);
        }
    }
    console.log('🌿 Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
