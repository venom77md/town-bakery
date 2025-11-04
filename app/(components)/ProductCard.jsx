'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  // Handle both DB schema (with name_ar, name_en) and local data format
  const displayName = product.name_ar || product.name || 'Product';
  const displayDescription = product.description_ar || product.description || '';
  const displayCurrency = product.currency || 'EGP';
  const productId = product.id || product.slug;
  
  return (
    <LazyMotion features={domAnimation}>
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-gradient-to-br from-light-yellow to-cream rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-warm-brown/20"
    >
      <Link href={`/products/${productId}`}>
        <div className="relative h-64 w-full cursor-pointer overflow-hidden group">
          <Image
            src={product.image || '/assets/product-1.jpg'}
            alt={`${displayName} من Town Bakery - مخبز تاون`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>
      <div className="p-6">
        <Link href={`/products/${productId}`}>
          <h3 className="text-2xl font-bold text-brown mb-2 hover:text-primary transition-colors cursor-pointer">
            {displayName}
          </h3>
        </Link>
        <p className="text-light-brown mb-4 line-clamp-2 text-sm leading-relaxed">
          {displayDescription}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">
            {product.price} {displayCurrency}
          </span>
          <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={`/products/${productId}`}
              className="bg-gradient-to-r from-primary to-warm-brown text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all font-semibold inline-block"
            >
              اطلب
            </Link>
          </m.div>
        </div>
      </div>
    </m.div>
    </LazyMotion>
  );
}

