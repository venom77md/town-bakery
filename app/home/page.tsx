import { prisma } from '@/lib/prisma';
import HomeClient from './HomeClient';
import bakeryImages from '@/bakery-product-images.json';

export default async function HomePage() {
  // Fetch featured products from database
  const products = await prisma.product.findMany({
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      category_rel: true,
    },
  });

  // Transform products for client component with dynamic images
  const featuredProducts = products.map((p: typeof products[0], index: number) => ({
    id: p.id,
    name: p.name,
    name_ar: p.name_ar || p.name,
    name_en: p.name_en || p.name,
    price: p.price,
    currency: p.currency,
    // Use dynamic images from JSON array
    image: bakeryImages[index % bakeryImages.length] || p.image || p.image_path || '/assets/product-1.jpg',
    description_ar: p.description_ar || p.description,
    description: p.description,
    slug: p.slug || p.id.toString(),
  }));

  return <HomeClient featuredProducts={featuredProducts} />;
}
