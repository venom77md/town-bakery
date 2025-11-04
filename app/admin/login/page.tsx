'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LazyMotion, domAnimation, m } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

    if (password === adminPassword) {
      // Use improved auth function
      const { setAdminAuthenticated } = await import('@/lib/admin-auth');
      setAdminAuthenticated();
      router.push('/admin/dashboard');
    } else {
      setError('كلمة المرور غير صحيحة');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-light-yellow rounded-lg shadow-lg p-8 max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-brown text-center mb-8">
          تسجيل الدخول - لوحة التحكم
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-center"
            >
              {error}
            </m.p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>
        <p className="text-sm text-light-brown text-center mt-6">
          كلمة المرور الافتراضية: admin123
        </p>
      </m.div>
    </div>
  );
}

