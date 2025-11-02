'use client';

import { useState, useEffect } from 'react';
import { products } from '@/lib/products';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('admin_authenticated');
      if (saved === 'true') {
        setIsAuthenticated(true);
        loadData();
      }
    }
  }, []);

  const loadData = async () => {
    await Promise.all([loadOrders(), loadContacts()]);
  };

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('خطأ في تحميل الطلبات:', error);
    }
  };

  const loadContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('خطأ في تحميل الرسائل:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      
      if (response.ok) {
        loadOrders();
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة الطلب:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      loadData();
      setError('');
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-light-yellow rounded-lg p-8 shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-brown text-center mb-6">لوحة التحكم</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-brown font-semibold mb-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-cream text-brown"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-brown">لوحة التحكم</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 space-x-reverse mb-6 border-b-2 border-warm-brown">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'border-b-2 border-primary text-primary'
                : 'text-light-brown hover:text-brown'
            }`}
          >
            الطلبات ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'products'
                ? 'border-b-2 border-primary text-primary'
                : 'text-light-brown hover:text-brown'
            }`}
          >
            المنتجات ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'contacts'
                ? 'border-b-2 border-primary text-primary'
                : 'text-light-brown hover:text-brown'
            }`}
          >
            الرسائل ({contacts.length})
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-light-yellow rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-brown mb-4">الطلبات</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-warm-brown">
                    <th className="text-right py-3 text-brown font-semibold">رقم الطلب</th>
                    <th className="text-right py-3 text-brown font-semibold">العميل</th>
                    <th className="text-right py-3 text-brown font-semibold">المبلغ</th>
                    <th className="text-right py-3 text-brown font-semibold">الحالة</th>
                    <th className="text-right py-3 text-brown font-semibold">التاريخ</th>
                    <th className="text-right py-3 text-brown font-semibold">التفاصيل</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-light-brown">
                        لا توجد طلبات بعد
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="border-b border-warm-brown">
                        <td className="py-3 text-brown font-semibold">#{order.id}</td>
                        <td className="py-3">
                          <div>
                            <div className="font-semibold text-brown">{order.name}</div>
                            <div className="text-sm text-light-brown">{order.phone}</div>
                          </div>
                        </td>
                        <td className="py-3 text-primary font-bold">{order.total} EGP</td>
                        <td className="py-3">
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="px-3 py-1 rounded border-2 border-warm-brown bg-cream text-brown text-sm"
                          >
                            <option value="pending">قيد الانتظار</option>
                            <option value="confirmed">مؤكد</option>
                            <option value="preparing">قيد التحضير</option>
                            <option value="out_for_delivery">قيد التوصيل</option>
                            <option value="delivered">تم التسليم</option>
                            <option value="cancelled">ملغي</option>
                          </select>
                        </td>
                        <td className="py-3 text-sm text-light-brown">
                          {new Date(order.orderDate || order.createdAt).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="py-3">
                          <div className="text-sm">
                            <div className="text-light-brown">{order.items?.length || 0} منتج</div>
                            <div className="text-light-brown">
                              {order.paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 
                               order.paymentMethod === 'fawry' ? 'فوري' : 'دفع إلكتروني'}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-light-yellow rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-brown mb-4">المنتجات</h2>
            <div className="mb-4">
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                + إضافة منتج جديد
              </button>
              <p className="text-sm text-light-brown mt-2">(CRUD - قيد التطوير)</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-cream rounded-lg p-4">
                  <h3 className="font-bold text-brown mb-2">{product.name_ar}</h3>
                  <p className="text-sm text-light-brown mb-2">{product.name_en}</p>
                  <p className="text-lg font-bold text-primary mb-2">
                    {product.price} {product.currency}
                  </p>
                  <div className="flex space-x-2 space-x-reverse mt-3">
                    <button className="text-sm bg-warm-brown text-white px-3 py-1 rounded hover:bg-primary transition-colors">
                      تعديل
                    </button>
                    <button className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors">
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-light-yellow rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-brown mb-4">الرسائل</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {contacts.length === 0 ? (
                <p className="text-light-brown text-center py-8">لا توجد رسائل بعد</p>
              ) : (
                contacts.map((contact) => (
                  <div key={contact.id} className={`bg-cream rounded-lg p-4 ${!contact.read ? 'border-r-4 border-primary' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-brown">{contact.name}</h3>
                        <p className="text-sm text-light-brown">{contact.email}</p>
                      </div>
                      <span className="text-xs text-light-brown">
                        {new Date(contact.timestamp).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                    <p className="text-light-brown">{contact.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
