import { prisma } from '@/lib/prisma';
import LandingClient from './LandingClient';
import bakeryImages from '@/bakery-product-images.json';

export const metadata = {
  title: 'Town Bakery - مخبز تاون | Freshly Baked Every Day',
  description: 'خبز طازج يومياً ومخبوزات عالية الجودة من Town Bakery. طلبك متاح الآن!',
  keywords: 'مخبز, خبز طازج, معجنات, حلويات, Town Bakery, تاون بيكري, bakery, fresh bread, pastries',
  authors: [{ name: 'Town Bakery' }],
  openGraph: {
    title: 'Town Bakery - مخبز تاون | Freshly Baked Every Day',
    description: 'خبز طازج يومياً ومخبوزات عالية الجودة. اطلب الآن واحصل على توصيل سريع!',
    type: 'website',
    locale: 'ar_EG',
    siteName: 'Town Bakery',
    images: [
      {
        url: 'https://town-bakery.vercel.app/assets/hero-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Town Bakery - مخبز تاون',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Town Bakery - مخبز تاون',
    description: 'خبز طازج يومياً ومخبوزات عالية الجودة. اطلب الآن واحصل على توصيل سريع!',
    images: ['https://town-bakery.vercel.app/assets/hero-1.jpg'],
  },
};

export default async function LandingPage() {
  // Fetch featured products for the showcase section
  const products = await prisma.product.findMany({
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      category_rel: true,
    },
  });

  // Transform products with dynamic images
  const featuredProducts = products.map((p: typeof products[0], index: number) => ({
    id: p.id,
    name_ar: p.name_ar || p.name,
    name_en: p.name_en || p.name,
    description_ar: p.description_ar || p.description,
    price: p.price,
    currency: p.currency,
    image: bakeryImages[index % bakeryImages.length] || p.image || p.image_path || '/assets/product-1.jpg',
    slug: p.slug || p.id.toString(),
  }));

  return <LandingClient featuredProducts={featuredProducts} />;
}

