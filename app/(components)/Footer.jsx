import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const phoneNumber = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+201234567890';
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;

  return (
    <footer className="bg-brown text-cream mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 space-x-reverse mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/assets/logo.png"
                  alt="Town Bakery"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold">Town Bakery</h3>
            </div>
            <p className="text-light-yellow mb-4">
              مخبزنا يقدم لكم خبز طازج يومياً ومخبوزات عالية الجودة مصنوعة من أفضل المكونات الطبيعية.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 space-x-reverse bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>واتساب</span>
            </a>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/home" className="text-cream hover:text-light-yellow transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-cream hover:text-light-yellow transition-colors">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-cream hover:text-light-yellow transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-cream hover:text-light-yellow transition-colors">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">معلومات التواصل</h4>
            <p className="text-cream mb-2">123 شارع المخبز</p>
            <p className="text-cream mb-2">المدينة الحلوة، مصر</p>
            <p className="text-cream mb-2">الهاتف: {phoneNumber}</p>
            <p className="text-cream">البريد: info@sweetcrust.com</p>
          </div>
        </div>
        
        <div className="border-t border-warm-brown mt-8 pt-8 text-center text-light-yellow">
          <p>&copy; {new Date().getFullYear()} Town Bakery. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}

