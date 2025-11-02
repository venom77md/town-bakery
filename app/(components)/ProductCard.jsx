'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-light-yellow rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative h-64 w-full cursor-pointer">
          <Image
            src={product.image || '/assets/product-1.jpg'}
            alt={`${product.name_ar} - ${product.name_en}`}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="p-6">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-2xl font-bold text-brown mb-2 hover:text-primary transition-colors cursor-pointer">
            {product.name_ar}
          </h3>
        </Link>
        <p className="text-light-brown mb-4 line-clamp-2 text-sm">
          {product.description_ar}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">
            {product.price} {product.currency}
          </span>
          <Link
            href={`/products/${product.id}`}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
          >
            اطلب
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

