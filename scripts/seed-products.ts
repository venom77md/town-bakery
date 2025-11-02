import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    slug: 'chocolate-cookies',
    name_ar: 'كوكيز الشوكولاتة',
    name_en: 'Chocolate Chip Cookies',
    description_ar: 'كوكيز طازجة محشوة برقائق الشوكولاتة عالية الجودة. ناعمة من الداخل وذهبية مقرمشة من الخارج.',
    description_en: 'Freshly baked cookies loaded with premium chocolate chips. Perfectly soft inside with a golden crispy exterior.',
    price: 45,
    currency: 'EGP',
    category: 'حلويات',
    image: '/assets/product-1.jpg',
    ingredients: JSON.stringify(['دقيق', 'زبدة', 'سكر', 'شوكولاتة', 'بيض', 'فانيليا']),
    featured: true,
  },
  {
    slug: 'french-croissant',
    name_ar: 'كرواسان فرنسي',
    name_en: 'Classic Croissant',
    description_ar: 'كرواسان فرنسي تقليدي بطبقات رقيقة وزبدية. مخبوز يومياً ليقدم لك تجربة أصيلة من المخبوزات الفرنسية.',
    description_en: 'Traditional French croissant with flaky, buttery layers. Baked daily for an authentic French pastry experience.',
    price: 35,
    currency: 'EGP',
    category: 'معجنات',
    image: '/assets/product-2.jpg',
    ingredients: JSON.stringify(['دقيق', 'زبدة', 'خميرة', 'ملح', 'سكر']),
    featured: true,
  },
  {
    slug: 'red-velvet-cupcake',
    name_ar: 'كب كيك الفانيليا الحمراء',
    name_en: 'Red Velvet Cupcake',
    description_ar: 'كب كيك فاخر بالفانيليا الحمراء مع طبقة من كريمة الجبن الحلوة. كل قضمة تجلب لك السعادة.',
    description_en: 'Decadent red velvet cupcake topped with sweet cream cheese frosting. Every bite brings joy.',
    price: 30,
    currency: 'EGP',
    category: 'حلويات',
    image: '/assets/product-3.jpg',
    ingredients: JSON.stringify(['دقيق', 'سكر', 'زيت', 'بيض', 'كاكاو', 'فانيليا', 'كريمة الجبن']),
    featured: false,
  },
  {
    slug: 'sourdough-bread',
    name_ar: 'خبز العجينة المخمرة',
    name_en: 'Artisan Sourdough Bread',
    description_ar: 'خبز تقليدي بالعجينة المخمرة مع نكهة لاذعة وقشرة مقرمشة. مخمر لمدة 48 ساعة للحصول على أفضل نكهة.',
    description_en: 'Traditional sourdough bread with a tangy flavor and crispy crust. Fermented for 48 hours for the best taste.',
    price: 65,
    currency: 'EGP',
    category: 'خبز',
    image: '/assets/product-4.jpg',
    ingredients: JSON.stringify(['دقيق', 'ماء', 'ملح', 'خميرة طبيعية']),
    featured: true,
  },
  {
    slug: 'cinnamon-roll',
    name_ar: 'لفائف القرفة',
    name_en: 'Cinnamon Roll',
    description_ar: 'لفائف معطرة بالقرفة والسكر ومغطاة بطبقة من الجبن الكريمي الحلو. دافئة ولذيذة ولا تقاوم.',
    description_en: 'Swirled with cinnamon sugar and topped with rich cream cheese icing. Warm, gooey, and irresistible.',
    price: 32,
    currency: 'EGP',
    category: 'حلويات',
    image: '/assets/product-5.jpg',
    ingredients: JSON.stringify(['دقيق', 'سكر', 'قرفة', 'زبدة', 'كريمة الجبن', 'خميرة']),
    featured: false,
  },
  {
    slug: 'lemon-tart',
    name_ar: 'فطيرة الليمون',
    name_en: 'Lemon Tart',
    description_ar: 'فطيرة بطبقة عجينة مقرمشة محشوة بكريمة الليمون الحلوة والمنعشة. حلوى مثالية لأيام الصيف.',
    description_en: 'Tart with crispy pastry shell filled with sweet and refreshing lemon cream. Perfect dessert for summer days.',
    price: 50,
    currency: 'EGP',
    category: 'حلويات',
    image: '/assets/product-6.jpg',
    ingredients: JSON.stringify(['عجينة', 'ليمون', 'سكر', 'بيض', 'زبدة', 'كريمة']),
    featured: true,
  },
];

async function main() {
  console.log('🌱 بدء إضافة المنتجات إلى قاعدة البيانات...');

  for (const product of products) {
    try {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product,
      });
      console.log(`✅ تم إضافة: ${product.name_ar}`);
    } catch (error: any) {
      console.error(`❌ خطأ في إضافة ${product.name_ar}:`, error.message);
    }
  }

  console.log('✅ انتهى إضافة المنتجات');
}

main()
  .catch((e) => {
    console.error('خطأ عام:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

