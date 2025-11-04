'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  return (
    <div className="py-12 px-4 bg-cream min-h-screen">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-light-yellow rounded-lg p-12 shadow-lg">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-4xl font-bold text-brown mb-6">شكراً لك!</h1>
          <p className="text-xl text-light-brown mb-4">
            تم استلام طلبك بنجاح
          </p>
          {orderId && (
            <p className="text-lg text-primary font-semibold mb-8">
              رقم الطلب: #{orderId}
            </p>
          )}
          <p className="text-lg text-light-brown mb-8">
            {orderId ? (
              <>سنتواصل معك قريباً لتأكيد تفاصيل الطلب والتوصيل.</>
            ) : (
              <>تم إرسال طلبك بنجاح. سنتواصل معك قريباً.</>
            )}
          </p>
          <div className="space-y-4">
            <Link
              href="/home"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              العودة للصفحة الرئيسية
            </Link>
            <br />
            <Link
              href="/products"
              className="inline-block bg-warm-brown text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary transition-colors"
            >
              تصفح المزيد من المنتجات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="py-12 px-4 bg-cream min-h-screen">
        <div className="max-w-2xl mx-auto text-center">جاري التحميل...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}

