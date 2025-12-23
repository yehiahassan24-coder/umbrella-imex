import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
    { slug: 'egyptian-red-onions', image: '/images/products/onions.png' },
    { slug: 'valencia-oranges', image: '/images/products/oranges.png' },
    { slug: 'fresh-garlic', image: '/images/products/garlic.png' },
    { slug: 'pomegranate-wonderful', image: '/images/products/pomegranate.png' },
    { slug: 'iqf-frozen-strawberries', image: '/images/products/strawberries.png' }
];

async function main() {
    console.log('🖼️ Updating product images...');
    for (const update of updates) {
        try {
            await prisma.product.update({
                where: { slug: update.slug },
                data: {
                    images: [update.image]
                }
            });
            console.log(`✅ Updated image for ${update.slug}`);
        } catch (e) {
            console.log(`⚠️ Could not update ${update.slug} (might not exist)`);
        }
    }
    console.log('🏁 Image update finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
