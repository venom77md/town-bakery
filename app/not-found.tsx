'use client';

import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';

export default function NotFound() {
  return (
    <LazyMotion features={domAnimation}>
    <div className="min-h-screen bg-gradient-to-br from-cream via-light-yellow to-cream flex items-center justify-center px-4">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto"
      >
        <m.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <div className="text-9xl font-bold text-primary mb-4">404</div>
          <div className="text-6xl mb-4">🍞</div>
        </m.div>
        
        <m.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-5xl font-bold text-brown mb-4"
        >
          عذراً! لم نجد هذه الصفحة
        </m.h1>
        
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-light-brown mb-8"
        >
          يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها.
          لكن لا تقلق! لا يزال بإمكانك الاستمتاع بمخبوزاتنا الطازجة.
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/"
            className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-opacity-90 transition-colors shadow-lg hover:shadow-xl"
          >
            العودة للصفحة الرئيسية
          </Link>
          <Link
            href="/products"
            className="bg-white text-primary px-8 py-4 rounded-xl text-lg font-bold border-2 border-primary hover:bg-cream transition-colors shadow-lg hover:shadow-xl"
          >
            تصفح المنتجات
          </Link>
        </m.div>
      </m.div>
    </div>
    </LazyMotion>
  );
}
