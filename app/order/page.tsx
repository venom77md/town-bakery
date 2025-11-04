'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCart, getCartTotal, clearCart } from '@/lib/cart';
import Toast from '@/app/(components)/Toast';
import { LazyMotion, domAnimation, m } from 'framer-motion';

export default function OrderPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('error');
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    paymentMethod: 'cash', // 'cash' or 'paymob'
  });

  useEffect(() => {
    const cartItems = getCart();
    if (cartItems.length === 0) {
      router.push('/products');
      return;
    }
    setCart(cartItems);
    setTotal(getCartTotal());
  }, [router]);

  const validatePhone = (phone: string): boolean => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/[^0-9]/g, '');
    // Check if it's a valid Egyptian phone number (10-11 digits)
    return cleaned.length >= 10 && cleaned.length <= 11;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.customerName.trim()) {
      setToastMessage('الرجاء إدخال الاسم الكامل');
      setToastType('error');
      setShowToast(true);
      return;
    }

    if (!formData.phone.trim() || !validatePhone(formData.phone)) {
      setToastMessage('الرجاء إدخال رقم هاتف صحيح (10-11 رقم)');
      setToastType('error');
      setShowToast(true);
      return;
    }

    if (!formData.address.trim()) {
      setToastMessage('الرجاء إدخال عنوان التوصيل');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: cart,
          total,
          currency: 'EGP',
          customerName: formData.customerName,
          phone: formData.phone,
          address: formData.address,
          paymentMethod: formData.paymentMethod,
          paymentStatus: formData.paymentMethod === 'cash' ? 'pending' : 'pending',
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderResult.error || 'فشل في إنشاء الطلب');
      }

      // If Paymob payment
      if (formData.paymentMethod === 'paymob') {
        // Call Paymob API with simplified format (includes orderId for database update)
        const paymentResponse = await fetch('/api/payments/paymob', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderResult.id, // Include orderId to update database
            amount: total,
            name: formData.customerName,
            phone: formData.phone,
            address: formData.address,
          }),
        });

        const paymentResult = await paymentResponse.json();

        if (!paymentResponse.ok) {
          throw new Error(paymentResult.error || 'فشل في إعداد الدفع');
        }

        // Redirect to Paymob payment page
        if (paymentResult.redirectUrl) {
          window.location.href = paymentResult.redirectUrl;
          return;
        }
        
        // If no redirectUrl (should not happen, but handle gracefully)
        if (process.env.NODE_ENV === 'development') {
          console.error('No redirectUrl in payment response:', paymentResult);
        }
        throw new Error('لم يتم الحصول على رابط الدفع. يرجى المحاولة مرة أخرى.');
      } else {
        // Cash on delivery - clear cart and redirect to success
        clearCart();
        router.push(`/order-success?orderId=${orderResult.id}`);
      }
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Order error:', error);
      }
      setToastMessage(error.message || 'حدث خطأ أثناء معالجة الطلب');
      setToastType('error');
      setShowToast(true);
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-12 px-4 bg-cream min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-brown mb-4">السلة فارغة</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            تصفح المنتجات
          </button>
        </div>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
    <div className="py-12 px-4 bg-gradient-to-br from-cream via-light-yellow to-cream min-h-screen">
      <div className="max-w-4xl mx-auto">
        <m.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-brown text-center mb-8"
        >
          إتمام الطلب
        </m.h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-light-yellow to-cream rounded-xl p-6 shadow-lg border border-warm-brown/20"
          >
            <h2 className="text-2xl font-bold text-brown mb-4">ملخص الطلب</h2>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b border-warm-brown pb-2">
                  <div className="flex-1">
                    <span className="text-brown font-semibold">
                      {item.name_ar || item.name} × {item.quantity}
                    </span>
                  </div>
                  <span className="text-primary font-bold">
                    {(item.price * item.quantity).toFixed(2)} {item.currency || 'EGP'}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-warm-brown pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span className="text-brown">المجموع:</span>
                <span className="text-primary">{total.toFixed(2)} EGP</span>
              </div>
            </div>
          </m.div>

          {/* Order Form */}
          <m.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-light-yellow to-cream rounded-xl p-6 shadow-lg space-y-4 border border-warm-brown/20"
          >
            <h2 className="text-2xl font-bold text-brown mb-4">معلومات التوصيل</h2>

            <div>
              <label className="block text-brown font-semibold mb-2">
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-white"
                placeholder="أدخل الاسم الكامل"
              />
            </div>

            <div>
              <label className="block text-brown font-semibold mb-2">
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-white"
                placeholder="01xxxxxxxxx"
              />
              <p className="text-sm text-light-brown mt-1">10-11 رقم (مثال: 01234567890)</p>
            </div>

            <div>
              <label className="block text-brown font-semibold mb-2">
                عنوان التوصيل <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-white resize-none"
                placeholder="أدخل العنوان الكامل للتوصيل"
              />
            </div>

            <div>
              <label className="block text-brown font-semibold mb-2">
                طريقة الدفع <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-white"
              >
                <option value="cash">الدفع عند الاستلام (Cash on Delivery)</option>
                <option value="paymob">الدفع الإلكتروني (Paymob)</option>
              </select>
            </div>

            <m.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-primary text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري المعالجة...
                </span>
              ) : (
                'تأكيد الطلب'
              )}
            </m.button>
          </m.form>
        </div>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
    </LazyMotion>
  );
}

