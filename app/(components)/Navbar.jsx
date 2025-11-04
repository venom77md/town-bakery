'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const updateCartCount = () => {
      if (typeof window !== 'undefined') {
        const { getCartCount } = require('@/lib/cart');
        setCartCount(getCartCount());
      }
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  return (
    <nav className="bg-cream border-b-2 border-warm-brown shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/home" className="flex items-center space-x-3 space-x-reverse">
            <div className="relative w-12 h-12">
              <Image
                src="/assets/logo.png"
                alt="Town Bakery"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-brown">Town Bakery</span>
          </Link>
          
          <div className="hidden md:flex space-x-8 space-x-reverse items-center">
            <Link href="/home" className="text-brown hover:text-primary font-medium transition-colors">
              الرئيسية
            </Link>
            <Link href="/products" className="text-brown hover:text-primary font-medium transition-colors">
              المنتجات
            </Link>
            <Link href="/about" className="text-brown hover:text-primary font-medium transition-colors">
              من نحن
            </Link>
            <Link href="/contact" className="text-brown hover:text-primary font-medium transition-colors">
              اتصل بنا
            </Link>
            <Link 
              href="/cart" 
              className="relative bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
              aria-label={`السلة - ${cartCount > 0 ? `${cartCount} منتج` : 'فارغة'}`}
            >
              السلة
              {cartCount > 0 && (
                <span className="absolute -top-2 -left-2 bg-brown text-cream rounded-full w-6 h-6 flex items-center justify-center text-xs" aria-label={`عدد المنتجات: ${cartCount}`}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-4 space-x-reverse">
            <Link href="/cart" className="relative" aria-label={`السلة - ${cartCount > 0 ? `${cartCount} منتج` : 'فارغة'}`}>
              <svg className="w-6 h-6 text-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs" aria-label={`عدد المنتجات في السلة: ${cartCount}`}>
                  {cartCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-brown hover:text-primary"
              aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden pb-4 space-y-2" role="menu">
            <Link 
              href="/home" 
              className="block text-brown hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              الرئيسية
            </Link>
            <Link 
              href="/products" 
              className="block text-brown hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              المنتجات
            </Link>
            <Link 
              href="/about" 
              className="block text-brown hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              من نحن
            </Link>
            <Link 
              href="/contact" 
              className="block text-brown hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              اتصل بنا
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

