'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error);
    }
  }, [error]);

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
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <div className="text-9xl font-bold text-red-500 mb-4">⚠️</div>
          <div className="text-6xl mb-4">🍰</div>
        </m.div>
        
        <m.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-5xl font-bold text-brown mb-4"
        >
          حدث خطأ ما!
        </m.h1>
        
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-light-brown mb-8"
        >
          نعتذر عن الإزعاج. حدث خطأ غير متوقع أثناء تحميل الصفحة.
          يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
        </m.p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-right"
          >
            <p className="text-sm text-red-800 font-mono">{error.message}</p>
          </m.div>
        )}

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={reset}
            className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-opacity-90 transition-colors shadow-lg hover:shadow-xl"
          >
            إعادة المحاولة
          </button>
          <Link
            href="/"
            className="bg-white text-primary px-8 py-4 rounded-xl text-lg font-bold border-2 border-primary hover:bg-cream transition-colors shadow-lg hover:shadow-xl"
          >
            العودة للصفحة الرئيسية
          </Link>
        </m.div>
      </m.div>
    </div>
    </LazyMotion>
  );
}
