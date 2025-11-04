'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/app/(components)/Navbar';
import Footer from '@/app/(components)/Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const showLayout = !pathname?.includes('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {showLayout && <Navbar />}
      <main id="main-content" className="flex-grow" tabIndex={-1}>
        {children}
      </main>
      {showLayout && <Footer />}
    </div>
  );
}

