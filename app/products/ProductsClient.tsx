'use client';

import { useState, useEffect } from 'react';
import ProductGrid from '@/app/(components)/ProductGrid';
import { ProductGridSkeleton } from '@/app/(components)/LoadingSkeleton';
import Script from 'next/script';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import bakeryImages from '@/bakery-product-images.json';

interface Product {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  description: string;
  description_ar: string;
  description_en: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  categoryId?: number | null;
  slug: string;
  stock: number;
  ingredients: string[];
}

interface ProductsClientProps {
  products: Product[];
  categories: string[];
}

export default function ProductsClient({ products, categories: initialCategories }: ProductsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'الكل') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name_ar?.toLowerCase().includes(query) ||
          product.name_en?.toLowerCase().includes(query) ||
          product.description_ar?.toLowerCase().includes(query) ||
          product.description_en?.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
    setLoading(false);
  }, [selectedCategory, searchQuery, products]);

  // Generate structured data for SEO
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name_ar,
        description: product.description_ar,
        image: product.image,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency,
        },
      },
    })),
  };

  return (
    <LazyMotion features={domAnimation}>
    <>
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="py-12 px-4 bg-gradient-to-br from-cream via-light-yellow to-cream min-h-screen">
        <div className="max-w-7xl mx-auto">
          <m.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-brown text-center mb-4"
          >
            المنتجات
          </m.h1>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-light-brown text-center mb-12"
          >
            اكتشف مجموعتنا المتنوعة من المخبوزات الطازجة
          </m.p>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4 md:space-y-0 md:flex md:space-x-4 md:space-x-reverse items-center justify-between">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-light-yellow text-brown"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {initialCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-light-yellow text-brown hover:bg-warm-brown hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <ProductGrid products={filteredProducts} />
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-light-brown mb-4">لم يتم العثور على منتجات</p>
              <button
                onClick={() => {
                  setSelectedCategory('الكل');
                  setSearchQuery('');
                }}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                عرض جميع المنتجات
              </button>
            </div>
          )}
        </div>
      </div>
    </>
    </LazyMotion>
  );
}

