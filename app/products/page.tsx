import { prisma } from '@/lib/prisma';
import ProductsClient from './ProductsClient';
import bakeryImages from '@/bakery-product-images.json';

export const metadata = {
  title: 'المنتجات - Town Bakery | مخبز تاون',
  description: 'اكتشف مجموعتنا المتنوعة من المخبوزات الطازجة - حلويات، معجنات، وخبز عالي الجودة',
  keywords: 'منتجات, مخبوزات, حلويات, معجنات, خبز, Town Bakery, products, bakery items',
  openGraph: {
    title: 'المنتجات - Town Bakery',
    description: 'اكتشف مجموعتنا المتنوعة من المخبوزات الطازجة',
    type: 'website',
    images: [
      {
        url: 'https://town-bakery.vercel.app/assets/product-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Town Bakery - المنتجات',
      },
    ],
  },
};

export default async function ProductsPage() {
  // Fetch products and categories from database
  const products = await prisma.product.findMany({
    include: {
      category_rel: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  // Transform products for client component with dynamic images
  const productsData = products.map((p, index) => ({
    id: p.id,
    name: p.name,
    name_ar: p.name_ar || p.name,
    name_en: p.name_en || p.name,
    description: p.description,
    description_ar: p.description_ar || p.description,
    description_en: p.description_en || p.description,
    price: p.price,
    currency: p.currency,
    // Use dynamic images from JSON array, fallback to local assets
    image: bakeryImages[index % bakeryImages.length] || p.image || p.image_path || '/assets/product-1.jpg',
    category: p.category || p.category_rel?.name_ar || 'الكل',
    categoryId: p.categoryId,
    slug: p.slug || p.id.toString(),
    stock: p.stock,
    ingredients: p.ingredients ? JSON.parse(p.ingredients) : [],
  }));

  const categoriesData = ['الكل', ...categories.map((c) => c.name_ar || c.name)];

  return <ProductsClient products={productsData} categories={categoriesData} />;
}

