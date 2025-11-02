'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/assets/hero-1.jpg"
          alt="Town Bakery - مخبز تاون - خبز طازج يومياً"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-black/30"></div>
      </div>
      
      <div className="relative h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              تاون بيكري — خبز طازج يومياً
            </h1>
            <p className="text-2xl md:text-3xl text-light-yellow mb-8 drop-shadow-md">
              Town Bakery
            </p>
            <Link
              href="/products"
              className="inline-block bg-primary text-white px-10 py-4 rounded-lg text-xl font-bold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              اطلب الآن
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

