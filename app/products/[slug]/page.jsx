'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductBySlug } from '@/lib/products';
import { addToCart } from '@/lib/cart';
import ProductGallery from '@/app/(components)/ProductGallery';
import Toast from '@/app/(components)/Toast';
import Script from 'next/script';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const product = getProductBySlug(params.slug);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!product) {
      router.push('/products');
    }
  }, [product, router]);

  if (!product) {
    return null;
  }

  const images = [product.image, product.image, product.image]; // In real app, use multiple images

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    setToastMessage(`تم إضافة ${product.name_ar} إلى السلة`);
    setShowToast(true);
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name_ar,
    description: product.description_ar,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <Script
        id="product-detail-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="py-12 px-4 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 text-brown hover:text-primary font-semibold flex items-center space-x-2 space-x-reverse"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>العودة</span>
          </button>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <ProductGallery images={images} productName={product.name_ar} />

            {/* Product Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-brown mb-4">
                {product.name_ar}
              </h1>
              <p className="text-xl text-light-brown mb-6">
                {product.name_en}
              </p>
              <div className="text-4xl font-bold text-primary mb-6">
                {product.price} {product.currency}
              </div>
              <p className="text-lg text-light-brown mb-8 leading-relaxed">
                {product.description_ar}
              </p>

              {/* Ingredients */}
              {product.ingredients && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-brown mb-4">المكونات</h3>
                  <ul className="list-disc list-inside space-y-2 text-light-brown">
                    {product.ingredients.map((ingredient, idx) => (
                      <li key={idx}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-brown font-semibold mb-2">الكمية</label>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-warm-brown text-white w-10 h-10 rounded-lg hover:bg-primary transition-colors"
                    aria-label="تقليل الكمية"
                  >
                    <span aria-hidden="true">-</span>
                  </button>
                  <span className="text-2xl font-bold text-brown w-12 text-center" aria-label={`الكمية المحددة: ${quantity}`}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-warm-brown text-white w-10 h-10 rounded-lg hover:bg-primary transition-colors"
                    aria-label="زيادة الكمية"
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full bg-primary text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50"
                aria-label={`إضافة ${product.name_ar} إلى سلة التسوق`}
                aria-busy={isAdding}
              >
                {isAdding ? 'جاري الإضافة...' : 'أضف إلى السلة'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toast
        message={toastMessage}
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}

