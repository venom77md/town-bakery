'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getCart, updateCartItemQuantity, removeFromCart, getCartTotal, clearCart } from '@/lib/cart';
import Toast from '@/app/(components)/Toast';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryTime: '',
    paymentMethod: 'cash',
    notes: '',
  });

  useEffect(() => {
    const loadCart = () => {
      setCart(getCart());
    };
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    updateCartItemQuantity(id, newQuantity);
    setCart(getCart());
  };

  const removeItem = (id) => {
    removeFromCart(id);
    setCart(getCart());
    setToastMessage('تم حذف المنتج من السلة');
    setShowToast(true);
  };

  const getTotal = () => {
    return getCartTotal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const order = {
      ...formData,
      items: cart,
      total: getTotal(),
      orderDate: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        const { orderId } = await response.json();
        clearCart();
        router.push(`/order?orderId=${orderId}`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error submitting order:', error);
      }
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-12 px-4 bg-cream min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-brown mb-6">السلة</h1>
          <p className="text-xl text-light-brown mb-8">سلة التسوق فارغة</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            تصفح المنتجات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-brown text-center mb-12">السلة</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-light-yellow rounded-lg p-6 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center bg-cream rounded-lg p-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name_ar}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-brown">{item.name_ar}</h3>
                    <p className="text-light-brown">{item.price} {item.currency}</p>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-warm-brown text-white w-8 h-8 rounded-lg hover:bg-primary"
                      aria-label={`تقليل كمية ${item.name_ar}`}
                    >
                      <span aria-hidden="true">-</span>
                    </button>
                    <span className="text-xl font-bold text-brown w-10 text-center" aria-label={`الكمية: ${item.quantity}`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-warm-brown text-white w-8 h-8 rounded-lg hover:bg-primary"
                      aria-label={`زيادة كمية ${item.name_ar}`}
                    >
                      <span aria-hidden="true">+</span>
                    </button>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    {item.price * item.quantity} {item.currency}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`حذف ${item.name_ar} من السلة`}
                  >
                    <span aria-hidden="true">✕</span>
                  </button>
                </div>
              ))}
              <div className="border-t-2 border-warm-brown pt-4">
                <div className="flex justify-between items-center text-2xl font-bold text-brown">
                  <span>المجموع:</span>
                  <span>{getTotal()} EGP</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-light-yellow rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-brown mb-6">معلومات الطلب</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-brown font-semibold mb-2">الاسم</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-cream text-brown"
                />
              </div>
              <div>
                <label className="block text-brown font-semibold mb-2">الهاتف</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-cream text-brown"
                />
              </div>
              <div>
                <label className="block text-brown font-semibold mb-2">العنوان</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-cream text-brown resize-none"
                />
              </div>
              <div>
                <label className="block text-brown font-semibold mb-2">وقت التوصيل</label>
                <select
                  required
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-cream text-brown"
                >
                  <option value="">اختر الوقت</option>
                  <option value="asap">في أقرب وقت ممكن</option>
                  <option value="morning">صباحاً (9 ص - 12 ظ)</option>
                  <option value="afternoon">بعد الظهر (12 ظ - 5 م)</option>
                  <option value="evening">مساءً (5 م - 9 م)</option>
                </select>
              </div>
              <div>
                <label className="block text-brown font-semibold mb-2">طريقة الدفع</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-cream text-brown"
                >
                  <option value="cash">الدفع عند الاستلام</option>
                  <option value="fawry">فوري</option>
                  <option value="online">دفع إلكتروني</option>
                </select>
              </div>
              <div>
                <label className="block text-brown font-semibold mb-2">ملاحظات (اختياري)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-cream text-brown resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                تأكيد الطلب
              </button>
            </form>
          </div>
        </div>
      </div>
      <Toast
        message={toastMessage}
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

