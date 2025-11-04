'use client';

import { useState, useEffect } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  recentOrders: any[];
  topProducts: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      // Error handled silently in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching dashboard data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'إجمالي الطلبات',
      value: stats.totalOrders,
      icon: '📦',
      color: 'bg-blue-500',
      link: '/admin/dashboard/orders',
    },
    {
      title: 'طلبات قيد الانتظار',
      value: stats.pendingOrders,
      icon: '⏳',
      color: 'bg-yellow-500',
      link: '/admin/dashboard/orders?filter=pending',
    },
    {
      title: 'إجمالي الإيرادات',
      value: `${stats.totalRevenue.toFixed(2)} EGP`,
      icon: '💰',
      color: 'bg-green-500',
      link: '/admin/dashboard/orders',
    },
    {
      title: 'عدد المنتجات',
      value: stats.totalProducts,
      icon: '🍞',
      color: 'bg-purple-500',
      link: '/admin/dashboard/products',
    },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gradient-to-br from-cream via-light-yellow to-cream p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-brown mb-2">لوحة التحكم</h1>
          <p className="text-light-brown">مرحباً بك في لوحة تحكم مخبز تاون</p>
        </m.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <m.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link href={card.link}>
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-light-brown text-sm mb-1">{card.title}</p>
                      <p className="text-3xl font-bold text-brown">{card.value}</p>
                    </div>
                    <div className={`${card.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl`}>
                      {card.icon}
                    </div>
                  </div>
                </div>
              </Link>
            </m.div>
          ))}
        </div>

        {/* Quick Actions */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-brown mb-4">إجراءات سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/dashboard/products"
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors text-center"
            >
              إضافة منتج جديد
            </Link>
            <Link
              href="/admin/dashboard/orders"
              className="bg-warm-brown text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors text-center"
            >
              عرض جميع الطلبات
            </Link>
            <Link
              href="/admin/dashboard/messages"
              className="bg-brown text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors text-center"
            >
              الرسائل الواردة
            </Link>
          </div>
        </m.div>

        {/* Recent Orders & Quick Stats */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-brown">الطلبات الأخيرة</h2>
              <Link
                href="/admin/dashboard/orders"
                className="text-primary hover:underline text-sm"
              >
                عرض الكل
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.slice(0, 5).map((order, index) => (
                  <m.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-light-yellow rounded-lg hover:bg-warm-brown hover:text-white transition-colors"
                  >
                    <div>
                      <p className="font-semibold">{order.customerName}</p>
                      <p className="text-sm opacity-75">{order.total} EGP</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                      order.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </m.div>
                ))
              ) : (
                <p className="text-center text-light-brown py-8">لا توجد طلبات حديثة</p>
              )}
            </div>
          </m.div>

          {/* System Status */}
          <m.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-brown mb-4">حالة النظام</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-semibold">قاعدة البيانات</span>
                </div>
                <span className="text-green-600 font-semibold">متصل</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-semibold">بوابة الدفع</span>
                </div>
                <span className="text-green-600 font-semibold">نشط</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold">الموقع</span>
                </div>
                <span className="text-blue-600 font-semibold">يعمل بشكل طبيعي</span>
              </div>
            </div>
          </m.div>
        </div>
        </div>
      </div>
    </LazyMotion>
  );
}
