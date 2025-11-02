import Image from 'next/image';

export const metadata = {
  title: 'من نحن - Town Bakery',
  description: 'تعرف على قصة Town Bakery ورئيس الطهاة',
};

export default function AboutPage() {
  return (
    <div className="py-12 px-4 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Bakery Story */}
        <section className="mb-16">
          <h1 className="text-5xl font-bold text-brown text-center mb-12">قصتنا</h1>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/assets/hero-1.jpg"
                alt="مخبز Town Bakery"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-brown mb-6">تقليد عائلي</h2>
              <p className="text-lg text-light-brown mb-4">
                ولدت Town Bakery من شغف بالخبز التقليدي وحلم بمشاركة مخبوزات 
                استثنائية مع مجتمعنا. تأسست في عام 2015، بدأنا كمشروع عائلي صغير 
                بمهمة بسيطة: خلق مخبوزات لذيذة وطازجة باستخدام أفضل المكونات فقط.
              </p>
              <p className="text-lg text-light-brown mb-4">
                وصفاتنا موروثة عبر الأجيال، كل واحدة منها مصنوعة بعناية ومثالية مع 
                مرور الوقت. نؤمن بأن الخبز هو شكل من أشكال الفن، وكل قطعة تترك 
                مطبخنا مصنوعة بعناية وحب حقيقي للحرفة.
              </p>
              <p className="text-lg text-light-brown">
                اليوم، تستمر Town Bakery في النمو مع البقاء مخلصين لجذورنا. 
                نخبز طازج كل صباح، مما يضمن حصول كل عميل على منتجات عالية الجودة 
                أصبحت علامتنا التجارية.
              </p>
            </div>
          </div>
        </section>

        {/* Chef Section */}
        <section className="bg-light-yellow rounded-lg p-8 md:p-12">
          <h2 className="text-4xl font-bold text-brown text-center mb-12">رئيس الطهاة</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/assets/chef.jpg"
                alt="رئيس الطهاة"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-brown mb-4">الشيف ماريا رودريجيز</h3>
              <p className="text-lg text-light-brown mb-4">
                مع أكثر من 20 عاماً من الخبرة في الفنون الطهوية، تجلب الشيف ماريا 
                الخبرة والإبداع إلى Town Bakery. تدربت في معهد الطهي المرموق 
                في أمريكا وعملت في مخابز مشهورة في جميع أنحاء أوروبا قبل العودة 
                إلى الوطن لبدء Town Bakery.
              </p>
              <p className="text-lg text-light-brown mb-4">
                تتخصص الشيف ماريا في المعجنات الفرنسية، وصناعة الخبز الإيطالي، 
                والكلاسيكيات الأمريكية. تفانيها في الجودة والابتكار جعل Town Bakery 
                وجهة محبوبة لعشاق المخبوزات.
              </p>
              <p className="text-lg text-light-brown">
                "الخبز هو أكثر من مجرد مكونات،" تقول الشيف ماريا. "إنه عن خلق 
                الذكريات، وجمع العائلات معاً، ومشاركة الفرح من خلال شيء بسيط 
                ورائع مثل قطعة مخبوزة مثالية."
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

