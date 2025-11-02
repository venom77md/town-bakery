'use client';

import { useState, useEffect } from 'react';
import ProductGrid from '../(components)/ProductGrid';
import { products, categories, getProductsByCategory } from '@/lib/products';
import Script from 'next/script';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    let filtered = getProductsByCategory(selectedCategory);
    
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name_ar.includes(searchQuery) ||
        product.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description_ar.includes(searchQuery)
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery]);

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
    <>
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="py-12 px-4 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-brown text-center mb-4">المنتجات</h1>
          <p className="text-xl text-light-brown text-center mb-12">
            اكتشف مجموعتنا المتنوعة من المخبوزات الطازجة
          </p>

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
              {categories.map((category) => (
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

          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </>
  );
}

