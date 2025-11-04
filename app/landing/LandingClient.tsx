'use client';

import { LazyMotion, domAnimation, m, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import bakeryImages from '@/bakery-product-images.json';

interface Product {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  price: number;
  currency: string;
  image: string;
  slug: string;
}

interface LandingClientProps {
  featuredProducts: Product[];
}

export default function LandingClient({ featuredProducts }: LandingClientProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Parallax effect for hero image
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Hero background image (use first image from bakery images)
  const heroImage = bakeryImages[0] || '/assets/hero-1.jpg';

  return (
    <LazyMotion features={domAnimation}>
    <div className="min-h-screen bg-gradient-to-br from-cream via-light-yellow to-cream">
      {/* Floating Order Now Button */}
      <m.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        className="fixed bottom-8 left-8 z-50 hidden lg:block"
      >
        <Link href="/order">
          <m.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold hover:shadow-3xl transition-shadow"
          >
            <span className="text-lg">🍞</span>
            <span>اطلب الآن</span>
            <m.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              →
            </m.div>
          </m.div>
        </Link>
      </m.div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Parallax */}
        <m.div
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={heroImage}
            alt="Town Bakery - Freshly Baked Products"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-brown/80 via-primary/70 to-warm-brown/80"></div>
        </m.div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Badge */}
            <m.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-block bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm md:text-base font-semibold border border-white/30"              >
                🍞 مخبوزات طازجة يومياً
              </span>
            </m.div>

            {/* Main Title */}
            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-2xl leading-tight"
            >
              Town Bakery
              <br />
              <span className="text-4xl md:text-6xl lg:text-7xl">مخبز تاون</span>
            </m.h1>

            {/* Tagline */}
            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl lg:text-3xl text-light-yellow mb-8 drop-shadow-lg max-w-3xl mx-auto font-light"
            >
              Freshly Baked Every Day
              <br />
              <span className="text-lg md:text-xl lg:text-2xl">خبز طازج يومياً</span>
            </m.p>

            {/* CTA Buttons */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <m.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/order"
                  className="inline-block bg-white text-primary px-8 py-4 rounded-xl text-lg md:text-xl font-bold hover:bg-cream transition-colors shadow-2xl hover:shadow-3xl"
                >
                  Order Now | اطلب الآن
                </Link>
              </m.div>
              <m.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/products"
                  className="inline-block bg-primary/90 backdrop-blur-md text-white px-8 py-4 rounded-xl text-lg md:text-xl font-bold hover:bg-primary transition-colors shadow-2xl hover:shadow-3xl border-2 border-white/30"
                >
                  Explore Products | تصفح المنتجات
                </Link>
              </m.div>
            </m.div>
          </m.div>

          {/* Scroll Indicator */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <m.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-2"
            >
              <m.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-white rounded-full"
              />
            </m.div>
          </m.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-light-yellow to-cream">
        <div className="max-w-7xl mx-auto">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-brown text-center mb-4"
          >
            Featured Products | منتجات مميزة
          </m.h2>
          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-light-brown text-center mb-12 max-w-2xl mx-auto"
          >
            Discover our handcrafted selection of fresh baked goods
            <br />
            اكتشف مجموعتنا المختارة بعناية من المخبوزات الطازجة
          </m.p>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <m.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-warm-brown/20"
              >
                <Link href={`/products/${product.slug}`}>
                  <div className="relative h-64 w-full overflow-hidden group cursor-pointer">
                    <Image
                      src={product.image}
                      alt={`${product.name_ar} - ${product.name_en}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-brown mb-2">
                    {product.name_ar}
                  </h3>
                  <p className="text-light-brown mb-4 line-clamp-2 text-sm">
                    {product.description_ar}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">
                      {product.price} {product.currency}
                    </span>
                    <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href={`/products/${product.slug}`}
                        className="bg-gradient-to-r from-primary to-warm-brown text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all font-semibold inline-block"
                      >
                        View | عرض
                      </Link>
                    </m.div>
                  </div>
                </div>
              </m.div>
            ))}
          </div>

          {/* View All Products Button */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/products"
                className="inline-block bg-gradient-to-r from-primary to-warm-brown text-white px-10 py-4 rounded-xl text-lg font-bold hover:shadow-2xl transition-all"
              >
                View All Products | عرض جميع المنتجات
              </Link>
            </m.div>
          </m.div>
        </div>
      </section>

      {/* Quick Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-cream to-light-yellow">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🍞',
                title: 'Fresh Daily',
                titleAr: 'طازج يومياً',
                description: 'Baked fresh every morning',
                descriptionAr: 'مخبوز طازج كل صباح',
              },
              {
                icon: '🌿',
                title: 'Natural Ingredients',
                titleAr: 'مكونات طبيعية',
                description: '100% natural, high-quality ingredients',
                descriptionAr: 'مكونات طبيعية 100% عالية الجودة',
              },
              {
                icon: '🚚',
                title: 'Fast Delivery',
                titleAr: 'توصيل سريع',
                description: 'Quick and reliable delivery service',
                descriptionAr: 'خدمة توصيل سريعة وموثوقة',
              },
            ].map((feature, index) => (
              <m.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-brown mb-2">
                  {feature.title}
                  <br />
                  <span className="text-lg">{feature.titleAr}</span>
                </h3>
                <p className="text-light-brown">
                  {feature.description}
                  <br />
                  <span className="text-sm">{feature.descriptionAr}</span>
                </p>
              </m.div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </LazyMotion>
  );
}

