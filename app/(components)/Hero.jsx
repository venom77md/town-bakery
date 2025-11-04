'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <LazyMotion features={domAnimation}>
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/assets/hero-1.jpg"
          alt="Town Bakery - مخبز تاون - خبز طازج يومياً - مخبوزات عالية الجودة"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-black/30"></div>
      </div>
      
      <div className="relative h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-4"
            >
              <span className="inline-block bg-primary/90 text-white px-4 py-2 rounded-full text-sm md:text-base font-semibold mb-4">
                🍞 مخبوزات طازجة يومياً
              </span>
            </m.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              تاون بيكري — خبز طازج يومياً
            </h1>
            
            <m.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-light-yellow mb-6 drop-shadow-md max-w-2xl mx-auto"
            >
              مخبوزات عالية الجودة مصنوعة بالحب. توصيل سريع إلى باب منزلك
            </m.p>

            {/* Trust Badges */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-8 text-white/90"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <span className="text-sm md:text-base">توصيل مجاني للطلبات فوق 200 جنيه</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚚</span>
                <span className="text-sm md:text-base">توصيل خلال 30 دقيقة</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span className="text-sm md:text-base">4.8/5 تقييم العملاء</span>
              </div>
            </m.div>

            {/* CTAs */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/products"
                className="inline-block bg-primary text-white px-10 py-4 rounded-lg text-xl font-bold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                aria-label="اطلب الآن - تصفح جميع المنتجات"
              >
                اطلب الآن
              </Link>
              <Link
                href="/products"
                className="inline-block bg-white/10 backdrop-blur-sm text-white border-2 border-white px-10 py-4 rounded-lg text-xl font-bold hover:bg-white/20 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                aria-label="عرض القائمة الكاملة للمنتجات"
              >
                عرض القائمة
              </Link>
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
    </LazyMotion>
  );
}

