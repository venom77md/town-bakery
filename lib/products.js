export const products = [
  {
    id: 1,
    name_ar: 'كوكيز الشوكولاتة',
    name_en: 'Chocolate Chip Cookies',
    price: 45,
    currency: 'EGP',
    image: '/assets/product-1.jpg',
    category: 'حلويات',
    description_ar: 'كوكيز طازجة محشوة برقائق الشوكولاتة عالية الجودة. ناعمة من الداخل وذهبية مقرمشة من الخارج. مثالية مع كوب القهوة أو الشاي.',
    description_en: 'Freshly baked cookies loaded with premium chocolate chips. Perfectly soft inside with a golden crispy exterior. Perfect with coffee or tea.',
    ingredients: ['دقيق', 'زبدة', 'سكر', 'شوكولاتة', 'بيض', 'فانيليا']
  },
  {
    id: 2,
    name_ar: 'كرواسان فرنسي',
    name_en: 'Classic Croissant',
    price: 35,
    currency: 'EGP',
    image: '/assets/product-2.jpg',
    category: 'معجنات',
    description_ar: 'كرواسان فرنسي تقليدي بطبقات رقيقة وزبدية. مخبوز يومياً ليقدم لك تجربة أصيلة من المخبوزات الفرنسية.',
    description_en: 'Traditional French croissant with flaky, buttery layers. Baked daily for an authentic French pastry experience.',
    ingredients: ['دقيق', 'زبدة', 'خميرة', 'ملح', 'سكر']
  },
  {
    id: 3,
    name_ar: 'كب كيك الفانيليا الحمراء',
    name_en: 'Red Velvet Cupcake',
    price: 30,
    currency: 'EGP',
    image: '/assets/product-3.jpg',
    category: 'حلويات',
    description_ar: 'كب كيك فاخر بالفانيليا الحمراء مع طبقة من كريمة الجبن الحلوة. كل قضمة تجلب لك السعادة.',
    description_en: 'Decadent red velvet cupcake topped with sweet cream cheese frosting. Every bite brings joy.',
    ingredients: ['دقيق', 'سكر', 'زيت', 'بيض', 'كاكاو', 'فانيليا', 'كريمة الجبن']
  },
  {
    id: 4,
    name_ar: 'خبز العجينة المخمرة',
    name_en: 'Artisan Sourdough Bread',
    price: 65,
    currency: 'EGP',
    image: '/assets/product-4.jpg',
    category: 'خبز',
    description_ar: 'خبز تقليدي بالعجينة المخمرة مع نكهة لاذعة وقشرة مقرمشة. مخمر لمدة 48 ساعة للحصول على أفضل نكهة.',
    description_en: 'Traditional sourdough bread with a tangy flavor and crispy crust. Fermented for 48 hours for the best taste.',
    ingredients: ['دقيق', 'ماء', 'ملح', 'خميرة طبيعية']
  },
  {
    id: 5,
    name_ar: 'لفائف القرفة',
    name_en: 'Cinnamon Roll',
    price: 32,
    currency: 'EGP',
    image: '/assets/product-5.jpg',
    category: 'حلويات',
    description_ar: 'لفائف معطرة بالقرفة والسكر ومغطاة بطبقة من الجبن الكريمي الحلو. دافئة ولذيذة ولا تقاوم.',
    description_en: 'Swirled with cinnamon sugar and topped with rich cream cheese icing. Warm, gooey, and irresistible.',
    ingredients: ['دقيق', 'سكر', 'قرفة', 'زبدة', 'كريمة الجبن', 'خميرة']
  },
  {
    id: 6,
    name_ar: 'فطيرة الليمون',
    name_en: 'Lemon Tart',
    price: 50,
    currency: 'EGP',
    image: '/assets/product-6.jpg',
    category: 'حلويات',
    description_ar: 'فطيرة بطبقة عجينة مقرمشة محشوة بكريمة الليمون الحلوة والمنعشة. حلوى مثالية لأيام الصيف.',
    description_en: 'Tart with crispy pastry shell filled with sweet and refreshing lemon cream. Perfect dessert for summer days.',
    ingredients: ['عجينة', 'ليمون', 'سكر', 'بيض', 'زبدة', 'كريمة']
  }
];

export const categories = ['الكل', 'حلويات', 'معجنات', 'خبز'];

export function getProductBySlug(slug) {
  return products.find(p => p.id === parseInt(slug)) || null;
}

export function getProductsByCategory(category) {
  if (category === 'الكل' || !category) return products;
  return products.filter(p => p.category === category);
}

