'use client';

import { usePathname } from 'next/navigation';
import Navbar from './(components)/Navbar';
import Footer from './(components)/Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const showLayout = !pathname?.includes('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {showLayout && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {showLayout && <Footer />}
    </div>
  );
}

