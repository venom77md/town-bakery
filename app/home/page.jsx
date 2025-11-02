import Hero from '../(components)/Hero';
import ProductGrid from '../(components)/ProductGrid';
import { products } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'الرئيسية - Town Bakery',
  description: 'خبز طازج يومياً ومخبوزات عالية الجودة',
};

export default function HomePage() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      <Hero />
      
      {/* Featured Products */}
      <section className="py-16 px-4 bg-light-yellow">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-brown text-center mb-12">منتجات مميزة</h2>
          <ProductGrid products={featuredProducts} />
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              عرض جميع المنتجات
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-brown text-center mb-12">لماذا نحن</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-light-yellow rounded-lg p-8">
              <div className="text-6xl mb-4">🍞</div>
              <h3 className="text-2xl font-bold text-brown mb-4">طازج يومياً</h3>
              <p className="text-light-brown">
                نبدأ يومنا مبكراً لنخبز لك أجود أنواع الخبز والمخبوزات طازجة كل صباح
              </p>
            </div>
            <div className="text-center bg-light-yellow rounded-lg p-8">
              <div className="text-6xl mb-4">🌿</div>
              <h3 className="text-2xl font-bold text-brown mb-4">مكونات طبيعية</h3>
              <p className="text-light-brown">
                نستخدم فقط المكونات الطبيعية عالية الجودة بدون أي إضافات صناعية
              </p>
            </div>
            <div className="text-center bg-light-yellow rounded-lg p-8">
              <div className="text-6xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold text-brown mb-4">توصيل سريع</h3>
              <p className="text-light-brown">
                خدمة توصيل سريعة وموثوقة لتوصيل طلبك إلى باب منزلك في أسرع وقت
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 px-4 bg-gradient-to-b from-cream to-light-yellow">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-brown mb-6">قصتنا</h2>
              <p className="text-lg text-light-brown mb-4">
                منذ عام 2015، نقدم لكم مخبوزات عالية الجودة مصنوعة من الحب والشغف. 
                نستخدم وصفات تقليدية موروثة مع تقنيات حديثة لنقدم لك أفضل تجربة طعم.
              </p>
              <p className="text-lg text-light-brown mb-6">
                كل صباح، يستيقظ فريقنا مبكراً لتحضير الخبز الطازج والمعجنات التي تجلب 
                السعادة ليومك.
              </p>
              <Link
                href="/about"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                اعرف المزيد
              </Link>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/assets/hero-1.jpg"
                alt="مخبزنا"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">تواصل معنا</h2>
          <p className="text-xl mb-8 opacity-90">
            لديك سؤال أو تريد طلب مخصص؟ نحن هنا لخدمتك!
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-cream transition-colors"
          >
            اتصل بنا الآن
          </Link>
        </div>
      </section>
    </div>
  );
}

