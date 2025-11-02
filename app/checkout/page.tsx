'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCart, getCartTotal, clearCart } from '@/lib/cart';
import Toast from '../(components)/Toast';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    deliveryTime: '',
    paymentMethod: 'cash',
  });

  useEffect(() => {
    const cartItems = getCart();
    if (cartItems.length === 0) {
      router.push('/cart');
      return;
    }
    setCart(cartItems);
    setTotal(getCartTotal());
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          deliveryTime: formData.deliveryTime,
          paymentMethod: formData.paymentMethod,
          paymentStatus: 'pending',
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderResult.error || 'فشل في إنشاء الطلب');
      }

      // If Paymob payment
      if (formData.paymentMethod === 'paymob') {
        const paymentResponse = await fetch('/api/payments/paymob', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderResult.id,
            customerInfo: {
              first_name: formData.customerName.split(' ')[0] || formData.customerName,
              last_name: formData.customerName.split(' ').slice(1).join(' ') || '',
              phone_number: formData.phone.replace(/[^0-9]/g, ''),
              email: '',
            },
          }),
        });

        const paymentResult = await paymentResponse.json();

        if (!paymentResponse.ok) {
          throw new Error(paymentResult.error || 'فشل في إعداد الدفع');
        }

        // Redirect to Paymob iframe
        if (paymentResult.iframeUrl) {
          window.location.href = paymentResult.iframeUrl;
          return;
        }
      } else {
        // Cash on delivery - clear cart and redirect
        clearCart();
        router.push(`/order?id=${orderResult.id}`);
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      setToastMessage(error.message || 'حدث خطأ أثناء معالجة الطلب');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="py-12 px-4 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-brown text-center mb-8">إتمام الطلب</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-light-yellow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-brown mb-4">ملخص الطلب</h2>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-brown">
                    {item.name_ar} x {item.quantity}
                  </span>
                  <span className="text-primary font-bold">
                    {item.price * item.quantity} {item.currency}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-warm-brown pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span className="text-brown">المجموع:</span>
                <span className="text-primary">{total} EGP</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="bg-light-yellow rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold text-brown mb-4">معلومات التوصيل</h2>

            <div>
              <label className="block text-brown font-semibold mb-2">الاسم الكامل</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-brown font-semibold mb-2">رقم الهاتف</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-brown font-semibold mb-2">العنوان</label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-brown font-semibold mb-2">وقت التوصيل</label>
              <select
                required
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none"
              >
                <option value="">اختر الوقت</option>
                <option value="asap">في أسرع وقت</option>
                <option value="morning">الصباح (9 ص - 12 ظ)</option>
                <option value="afternoon">بعد الظهر (12 ظ - 4 م)</option>
                <option value="evening">المساء (4 م - 9 م)</option>
              </select>
            </div>

            <div>
              <label className="block text-brown font-semibold mb-2">طريقة الدفع</label>
              <select
                required
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none"
              >
                <option value="cash">الدفع عند الاستلام</option>
                <option value="paymob">الدفع الإلكتروني (Paymob)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {loading ? 'جاري المعالجة...' : 'تأكيد الطلب'}
            </button>
          </form>
        </div>
      </div>

      <Toast
        message={toastMessage}
        type={showToast && toastMessage.includes('خطأ') ? 'error' : 'success'}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

