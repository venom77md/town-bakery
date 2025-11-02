'use client';

import Hero from '../(components)/Hero';
import ProductGrid from '../(components)/ProductGrid';
import { products } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const metadata = {
  title: 'الرئيسية - Town Bakery',
  description: 'خبز طازج يومياً ومخبوزات عالية الجودة',
};

const testimonials = [
  {
    id: 1,
    name: 'أحمد محمد',
    role: 'عميل دائم',
    text: 'أفضل مخبز في المنطقة! الخبز طازج دائماً والطعم لا يُقاوم.',
    avatar: '/assets/chef.jpg',
  },
  {
    id: 2,
    name: 'فاطمة علي',
    role: 'أم لثلاثة أطفال',
    text: 'أطفالي يحبون الكرواسان من هنا. الطعم الأصيل يذكرني بباريس!',
    avatar: '/assets/chef.jpg',
  },
  {
    id: 3,
    name: 'محمود حسن',
    role: 'رجل أعمال',
    text: 'أطلب منهم كل صباح. خدمة ممتازة وتوصيل سريع.',
    avatar: '/assets/chef.jpg',
  },
];

export default function HomePage() {
  const featuredProducts = products.slice(0, 4);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-cream">
      <Hero />

      {/* Featured Products Section */}
      <section className="py-16 px-4 bg-light-yellow">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-brown text-center mb-12"
          >
            منتجات مميزة
          </motion.h2>
          <ProductGrid products={featuredProducts} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/products"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              عرض جميع المنتجات
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-brown text-center mb-12"
          >
            لماذا نحن
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center bg-light-yellow rounded-lg p-8"
            >
              <div className="text-6xl mb-4">🍞</div>
              <h3 className="text-2xl font-bold text-brown mb-4">طازج يومياً</h3>
              <p className="text-light-brown">
                نبدأ يومنا مبكراً لنخبز لك أجود أنواع الخبز والمخبوزات طازجة كل صباح
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center bg-light-yellow rounded-lg p-8"
            >
              <div className="text-6xl mb-4">🌿</div>
              <h3 className="text-2xl font-bold text-brown mb-4">مكونات طبيعية</h3>
              <p className="text-light-brown">
                نستخدم فقط المكونات الطبيعية عالية الجودة بدون أي إضافات صناعية
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center bg-light-yellow rounded-lg p-8"
            >
              <div className="text-6xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold text-brown mb-4">توصيل سريع</h3>
              <p className="text-light-brown">
                خدمة توصيل سريعة وموثوقة لتوصيل طلبك إلى باب منزلك في أسرع وقت
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-cream to-light-yellow">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-brown text-center mb-12"
          >
            ماذا يقول عملاؤنا
          </motion.h2>
          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg p-8 shadow-lg text-center"
            >
              <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-lg text-light-brown mb-4 italic">
                "{testimonials[currentTestimonial].text}"
              </p>
              <h4 className="text-xl font-bold text-brown">{testimonials[currentTestimonial].name}</h4>
              <p className="text-light-brown">{testimonials[currentTestimonial].role}</p>
            </motion.div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    idx === currentTestimonial ? 'bg-primary' : 'bg-warm-brown'
                  }`}
                  aria-label={`شهادة ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-brown text-center mb-12"
          >
            معرضنا
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative h-48 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <Image
                  src={`/assets/product-${((idx - 1) % 6) + 1}.jpg`}
                  alt={`معرض ${idx}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-cream to-light-yellow">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-brown mb-6">قصتنا</h2>
              <p className="text-lg text-light-brown mb-4 leading-relaxed">
                منذ عام 2015، نقدم لكم مخبوزات عالية الجودة مصنوعة من الحب والشغف.
                نستخدم وصفات تقليدية موروثة مع تقنيات حديثة لنقدم لك أفضل تجربة طعم.
              </p>
              <p className="text-lg text-light-brown mb-6">
                كل صباح، يستيقظ فريقنا مبكراً لتحضير الخبز الطازج والمعجنات التي تجلب
                السعادة ليومك.
              </p>
              <Link
                href="/about"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                اعرف المزيد
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-80 rounded-lg overflow-hidden shadow-lg"
            >
              <Image
                src="/assets/hero-1.jpg"
                alt="مخبزنا"
                fill
                className="object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Order CTA Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-6">هل أنت جاهز للطلب؟</h2>
          <p className="text-xl mb-8 opacity-90">
            استمتع بأشهى المخبوزات الطازجة مع توصيل سريع وآمن
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-cream transition-colors shadow-lg"
            >
              تصفح القائمة
            </Link>
            <Link
              href="/cart"
              className="bg-cream text-brown px-8 py-4 rounded-lg font-bold hover:bg-white transition-colors shadow-lg"
            >
              اطلب الآن
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

