'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAdminAuthenticated, logoutAdmin } from '@/lib/admin-auth';
import Link from 'next/link';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
    }
  }, [router]);

  if (!isAdminAuthenticated()) {
    return null;
  }

  const handleLogout = () => {
    logoutAdmin();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-cream">
      <nav className="bg-brown text-cream shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">لوحة تحكم Town Bakery</h1>
            <button
              onClick={handleLogout}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
          <div className="flex space-x-4 space-x-reverse border-t border-warm-brown pt-4 pb-4">
            <Link
              href="/admin/dashboard/orders"
              className={`px-4 py-2 rounded-lg transition-colors ${
                pathname === '/admin/dashboard/orders'
                  ? 'bg-primary text-white'
                  : 'text-cream hover:bg-warm-brown'
              }`}
            >
              الطلبات
            </Link>
            <Link
              href="/admin/dashboard/products"
              className={`px-4 py-2 rounded-lg transition-colors ${
                pathname === '/admin/dashboard/products'
                  ? 'bg-primary text-white'
                  : 'text-cream hover:bg-warm-brown'
              }`}
            >
              المنتجات
            </Link>
            <Link
              href="/admin/dashboard/messages"
              className={`px-4 py-2 rounded-lg transition-colors ${
                pathname === '/admin/dashboard/messages'
                  ? 'bg-primary text-white'
                  : 'text-cream hover:bg-warm-brown'
              }`}
            >
              الرسائل
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

