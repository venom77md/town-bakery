import ContactForm from '../(components)/ContactForm';
import Image from 'next/image';

export const metadata = {
  title: 'اتصل بنا - Town Bakery',
  description: 'تواصل مع Town Bakery للحصول على معلومات أو طلبات مخصصة',
};

export default function ContactPage() {
  const phoneNumber = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+201234567890';
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;

  return (
    <div className="py-12 px-4 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-brown text-center mb-4">اتصل بنا</h1>
        <p className="text-xl text-light-brown text-center mb-12">
          نحن هنا للإجابة على أسئلتك! أرسل لنا رسالة أو تواصل معنا مباشرة.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-brown mb-6">معلومات التواصل</h2>
            <div className="space-y-4 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-brown mb-2">📍 العنوان</h3>
                <p className="text-light-brown">123 شارع المخبز<br />المدينة الحلوة، مصر</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-brown mb-2">📞 الهاتف</h3>
                <p className="text-light-brown">{phoneNumber}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-brown mb-2">✉️ البريد الإلكتروني</h3>
                <p className="text-light-brown">info@sweetcrust.com</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-brown mb-2">🕒 ساعات العمل</h3>
                <p className="text-light-brown">
                  الاثنين - الجمعة: 6:00 صباحاً - 6:00 مساءً<br />
                  السبت: 7:00 صباحاً - 5:00 مساءً<br />
                  الأحد: 8:00 صباحاً - 3:00 مساءً
                </p>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 space-x-reverse bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>تواصل عبر واتساب</span>
            </a>
          </div>

          <div className="bg-light-yellow rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-brown mb-6">أرسل لنا رسالة</h2>
            <ContactForm />
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-light-yellow rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-brown mb-4">موقعنا</h2>
          <div className="relative h-96 rounded-lg overflow-hidden bg-warm-brown flex items-center justify-center">
            <p className="text-cream text-xl">خريطة جوجل - سيتم إضافة رابط الخريطة هنا</p>
          </div>
        </div>
      </div>
    </div>
  );
}

