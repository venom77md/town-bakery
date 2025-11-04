'use client';

import { useState, useEffect } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import Link from 'next/link';

interface Order {
  id: string;
  customerName: string;
  phone: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'preparing' | 'delivered'>('all');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      // Log only in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching orders:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      fetchOrders();
    } catch (error) {
      // Log only in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating order:', error);
      }
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) {
    return <div className="text-center py-12">جاري التحميل...</div>;
  }

  return (
    <LazyMotion features={domAnimation}>
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-brown">الطلبات</h2>
        <div className="flex gap-2">
          {(['all', 'new', 'preparing', 'delivered'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-light-yellow text-brown hover:bg-warm-brown hover:text-white'
              }`}
            >
              {f === 'all' ? 'الكل' : f === 'new' ? 'جديدة' : f === 'preparing' ? 'قيد التحضير' : 'تم التوصيل'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order, index) => (
          <m.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-light-yellow rounded-lg p-6 shadow-md"
          >
            <div className="grid md:grid-cols-4 gap-4 items-center">
              <div>
                <p className="font-bold text-brown">{order.customerName}</p>
                <p className="text-light-brown">{order.phone}</p>
                <p className="text-sm text-light-brown">
                  {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                </p>
              </div>
              <div>
                <p className="text-xl font-bold text-primary">{order.total} EGP</p>
                <p className={`text-sm ${
                  order.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {order.paymentStatus === 'paid' ? 'مدفوع' : 'غير مدفوع'}
                </p>
              </div>
              <div>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-cream"
                >
                  <option value="new">جديدة</option>
                  <option value="preparing">قيد التحضير</option>
                  <option value="delivered">تم التوصيل</option>
                  <option value="canceled">ملغاة</option>
                </select>
              </div>
              <div>
                <Link
                  href={`/admin/dashboard/orders/${order.id}`}
                  className="text-primary hover:underline"
                >
                  عرض التفاصيل
                </Link>
              </div>
            </div>
          </m.div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 text-light-brown">
          لا توجد طلبات
        </div>
      )}
    </div>
    </LazyMotion>
  );
}

