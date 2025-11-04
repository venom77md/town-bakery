'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function OrderFailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error') || 'فشل في معالجة الطلب';

  return (
    <div className="py-12 px-4 bg-cream min-h-screen">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-light-yellow rounded-lg p-12 shadow-lg">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-4xl font-bold text-brown mb-6">عذراً، حدث خطأ</h1>
          <p className="text-xl text-light-brown mb-4">
            {error}
          </p>
          <p className="text-lg text-light-brown mb-8">
            يرجى المحاولة مرة أخرى أو التواصل معنا إذا استمرت المشكلة.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.back()}
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              العودة وإعادة المحاولة
            </button>
            <br />
            <Link
              href="/contact"
              className="inline-block bg-warm-brown text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary transition-colors"
            >
              التواصل معنا
            </Link>
            <br />
            <Link
              href="/products"
              className="inline-block text-primary underline hover:text-brown transition-colors"
            >
              تصفح المنتجات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderFailedPage() {
  return (
    <Suspense fallback={
      <div className="py-12 px-4 bg-cream min-h-screen">
        <div className="max-w-2xl mx-auto text-center">جاري التحميل...</div>
      </div>
    }>
      <OrderFailedContent />
    </Suspense>
  );
}

