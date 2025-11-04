'use client';

import { useState, useEffect } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

const productSchema = z.object({
  name_ar: z.string().min(1, 'اسم المنتج بالعربي مطلوب'),
  name_en: z.string().optional(),
  description_ar: z.string().min(1, 'الوصف بالعربي مطلوب'),
  description_en: z.string().optional(),
  price: z.number().min(0, 'السعر يجب أن يكون موجب'),
  category: z.string().min(1, 'الفئة مطلوبة'),
  image: z.string().min(1, 'صورة المنتج مطلوبة'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Product {
  id: string;
  name_ar: string;
  name_en?: string;
  price: number;
  category: string;
  image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      // Error handled silently in production
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    // TODO: Implement product creation/update API
    setShowForm(false);
    reset();
    fetchProducts();
  };

  if (loading) {
    return <div className="text-center py-12">جاري التحميل...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-brown">المنتجات</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
            reset();
          }}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
        >
          إضافة منتج جديد
        </button>
      </div>

      {showForm && (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-light-yellow rounded-lg p-6 mb-8 shadow-md"
        >
          <h3 className="text-2xl font-bold text-brown mb-4">
            {editingProduct ? 'تعديل المنتج' : 'منتج جديد'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-brown font-semibold mb-2">الاسم بالعربي</label>
                <input
                  {...register('name_ar')}
                  className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-cream"
                />
                {errors.name_ar && (
                  <p className="text-red-600 text-sm mt-1">{errors.name_ar.message}</p>
                )}
              </div>
              <div>
                <label className="block text-brown font-semibold mb-2">الاسم بالإنجليزي</label>
                <input
                  {...register('name_en')}
                  className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-cream"
                />
              </div>
            </div>
            <div>
              <label className="block text-brown font-semibold mb-2">الوصف بالعربي</label>
              <textarea
                {...register('description_ar')}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-cream"
              />
              {errors.description_ar && (
                <p className="text-red-600 text-sm mt-1">{errors.description_ar.message}</p>
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-brown font-semibold mb-2">السعر (EGP)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-cream"
                />
                {errors.price && (
                  <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>
              <div>
                <label className="block text-brown font-semibold mb-2">الفئة</label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-cream"
                >
                  <option value="">اختر الفئة</option>
                  <option value="حلويات">حلويات</option>
                  <option value="معجنات">معجنات</option>
                  <option value="خبز">خبز</option>
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>
              <div>
                <label className="block text-brown font-semibold mb-2">رابط الصورة</label>
                <input
                  {...register('image')}
                  placeholder="/assets/product-1.jpg"
                  className="w-full px-4 py-2 rounded-lg border-2 border-warm-brown focus:border-primary focus:outline-none bg-cream"
                />
                {errors.image && (
                  <p className="text-red-600 text-sm mt-1">{errors.image.message}</p>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
              >
                {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  reset();
                }}
                className="bg-warm-brown text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
              >
                إلغاء
              </button>
            </div>
          </form>
        </m.div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <m.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-light-yellow rounded-lg overflow-hidden shadow-md"
          >
            <div className="relative h-48">
              <Image
                src={product.image || '/assets/product-1.jpg'}
                alt={product.name_ar}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-brown">{product.name_ar}</h3>
              <p className="text-primary font-bold text-lg">{product.price} EGP</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setShowForm(true);
                    reset({
                      name_ar: product.name_ar,
                      name_en: product.name_en,
                      description_ar: '',
                      description_en: '',
                      price: product.price,
                      category: product.category,
                      image: product.image,
                    });
                  }}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm"
                >
                  تعديل
                </button>
                <button
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  حذف
                </button>
              </div>
            </div>
          </m.div>
        ))}
      </div>
    </div>
  );
}

