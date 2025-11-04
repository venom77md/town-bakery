import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed categories
  const categories = [
    { name: 'Sweets', name_ar: 'حلويات', name_en: 'Sweets', slug: 'sweets' },
    { name: 'Pastries', name_ar: 'معجنات', name_en: 'Pastries', slug: 'pastries' },
    { name: 'Bread', name_ar: 'خبز', name_en: 'Bread', slug: 'bread' },
  ];

  const createdCategories = await Promise.all(
    categories.map(cat => prisma.category.create({ data: cat }))
  );

  const sweetsCategory = createdCategories.find(c => c.slug === 'sweets');
  const pastriesCategory = createdCategories.find(c => c.slug === 'pastries');
  const breadCategory = createdCategories.find(c => c.slug === 'bread');

  // Seed products with comprehensive bakery data
  const products = [
    {
      name: "Chocolate Chip Cookies",
      name_ar: "كوكيز الشوكولاتة",
      name_en: "Chocolate Chip Cookies",
      description: "Freshly baked cookies loaded with premium chocolate chips",
      description_ar: "كوكيز طازجة محشوة برقائق الشوكولاتة عالية الجودة. ناعمة من الداخل وذهبية مقرمشة من الخارج. مثالية مع كوب القهوة أو الشاي.",
      description_en: "Freshly baked cookies loaded with premium chocolate chips. Perfectly soft inside with a golden crispy exterior. Perfect with coffee or tea.",
      price: 45,
      currency: "EGP",
      image: "/assets/product-1.jpg",
      slug: "chocolate-chip-cookies",
      category: "حلويات",
      categoryId: sweetsCategory?.id,
      price_cents: 4500,
      stock: 50,
      ingredients: JSON.stringify(["دقيق", "زبدة", "سكر", "شوكولاتة", "بيض", "فانيليا"])
    },
    {
      name: "Classic Croissant",
      name_ar: "كرواسان فرنسي",
      name_en: "Classic Croissant",
      description: "Traditional French croissant with flaky, buttery layers",
      description_ar: "كرواسان فرنسي تقليدي بطبقات رقيقة وزبدية. مخبوز يومياً ليقدم لك تجربة أصيلة من المخبوزات الفرنسية.",
      description_en: "Traditional French croissant with flaky, buttery layers. Baked daily for an authentic French pastry experience.",
      price: 35,
      currency: "EGP",
      image: "/assets/product-2.jpg",
      slug: "classic-croissant",
      category: "معجنات",
      categoryId: pastriesCategory?.id,
      price_cents: 3500,
      stock: 40,
      ingredients: JSON.stringify(["دقيق", "زبدة", "خميرة", "ملح", "سكر"])
    },
    {
      name: "Red Velvet Cupcake",
      name_ar: "كب كيك الفانيليا الحمراء",
      name_en: "Red Velvet Cupcake",
      description: "Decadent red velvet cupcake topped with sweet cream cheese frosting",
      description_ar: "كب كيك فاخر بالفانيليا الحمراء مع طبقة من كريمة الجبن الحلوة. كل قضمة تجلب لك السعادة.",
      description_en: "Decadent red velvet cupcake topped with sweet cream cheese frosting. Every bite brings joy.",
      price: 30,
      currency: "EGP",
      image: "/assets/product-3.jpg",
      slug: "red-velvet-cupcake",
      category: "حلويات",
      categoryId: sweetsCategory?.id,
      price_cents: 3000,
      stock: 35,
      ingredients: JSON.stringify(["دقيق", "سكر", "زيت", "بيض", "كاكاو", "فانيليا", "كريمة الجبن"])
    },
    {
      name: "Artisan Sourdough Bread",
      name_ar: "خبز العجينة المخمرة",
      name_en: "Artisan Sourdough Bread",
      description: "Traditional sourdough bread with a tangy flavor and crispy crust",
      description_ar: "خبز تقليدي بالعجينة المخمرة مع نكهة لاذعة وقشرة مقرمشة. مخمر لمدة 48 ساعة للحصول على أفضل نكهة.",
      description_en: "Traditional sourdough bread with a tangy flavor and crispy crust. Fermented for 48 hours for the best taste.",
      price: 65,
      currency: "EGP",
      image: "/assets/product-4.jpg",
      slug: "artisan-sourdough-bread",
      category: "خبز",
      categoryId: breadCategory?.id,
      price_cents: 6500,
      stock: 25,
      ingredients: JSON.stringify(["دقيق", "ماء", "ملح", "خميرة طبيعية"])
    },
    {
      name: "Cinnamon Roll",
      name_ar: "لفائف القرفة",
      name_en: "Cinnamon Roll",
      description: "Swirled with cinnamon sugar and topped with rich cream cheese icing",
      description_ar: "لفائف معطرة بالقرفة والسكر ومغطاة بطبقة من الجبن الكريمي الحلو. دافئة ولذيذة ولا تقاوم.",
      description_en: "Swirled with cinnamon sugar and topped with rich cream cheese icing. Warm, gooey, and irresistible.",
      price: 32,
      currency: "EGP",
      image: "/assets/product-5.jpg",
      slug: "cinnamon-roll",
      category: "حلويات",
      categoryId: sweetsCategory?.id,
      price_cents: 3200,
      stock: 30,
      ingredients: JSON.stringify(["دقيق", "سكر", "قرفة", "زبدة", "كريمة الجبن", "خميرة"])
    },
    {
      name: "Lemon Tart",
      name_ar: "فطيرة الليمون",
      name_en: "Lemon Tart",
      description: "Tart with crispy pastry shell filled with sweet and refreshing lemon cream",
      description_ar: "فطيرة بطبقة عجينة مقرمشة محشوة بكريمة الليمون الحلوة والمنعشة. حلوى مثالية لأيام الصيف.",
      description_en: "Tart with crispy pastry shell filled with sweet and refreshing lemon cream. Perfect dessert for summer days.",
      price: 50,
      currency: "EGP",
      image: "/assets/product-6.jpg",
      slug: "lemon-tart",
      category: "حلويات",
      categoryId: sweetsCategory?.id,
      price_cents: 5000,
      stock: 20,
      ingredients: JSON.stringify(["عجينة", "ليمون", "سكر", "بيض", "زبدة", "كريمة"])
    },
    {
      name: "Bagel with Sesame",
      name_ar: "خبز الباجل بالسمسم",
      name_en: "Bagel with Sesame",
      description: "Fresh bagel with sesame seeds, perfect for breakfast",
      description_ar: "خبز باجل طازج مع بذور السمسم، مثالي لفطور الصباح. مقرمش من الخارج وطري من الداخل.",
      description_en: "Fresh bagel with sesame seeds, perfect for breakfast. Crispy outside and soft inside.",
      price: 15,
      currency: "EGP",
      image: "/assets/product-7.jpg",
      slug: "bagel-sesame",
      category: "خبز",
      categoryId: breadCategory?.id,
      price_cents: 1500,
      stock: 60,
      ingredients: JSON.stringify(["دقيق", "ماء", "خميرة", "سمسم", "ملح"])
    },
    {
      name: "Chocolate Eclair",
      name_ar: "إكلير الشوكولاتة",
      name_en: "Chocolate Eclair",
      description: "Classic French pastry filled with vanilla cream and topped with chocolate",
      description_ar: "معجنات فرنسية كلاسيكية محشوة بكريمة الفانيليا ومغطاة بالشوكولاتة. حلوى فاخرة ولذيذة.",
      description_en: "Classic French pastry filled with vanilla cream and topped with chocolate. Luxurious and delicious dessert.",
      price: 40,
      currency: "EGP",
      image: "/assets/product-8.jpg",
      slug: "chocolate-eclair",
      category: "حلويات",
      categoryId: sweetsCategory?.id,
      price_cents: 4000,
      stock: 28,
      ingredients: JSON.stringify(["دقيق", "زبدة", "بيض", "كريمة الفانيليا", "شوكولاتة"])
    },
    {
      name: "Whole Wheat Bread",
      name_ar: "خبز القمح الكامل",
      name_en: "Whole Wheat Bread",
      description: "Healthy whole wheat bread, rich in fiber and nutrients",
      description_ar: "خبز صحي من القمح الكامل، غني بالألياف والعناصر الغذائية. مثالي لصحة أفضل.",
      description_en: "Healthy whole wheat bread, rich in fiber and nutrients. Perfect for better health.",
      price: 55,
      currency: "EGP",
      image: "/assets/product-9.jpg",
      slug: "whole-wheat-bread",
      category: "خبز",
      categoryId: breadCategory?.id,
      price_cents: 5500,
      stock: 35,
      ingredients: JSON.stringify(["دقيق القمح الكامل", "ماء", "خميرة", "ملح", "عسل"])
    },
    {
      name: "Apple Pie",
      name_ar: "فطيرة التفاح",
      name_en: "Apple Pie",
      description: "Traditional apple pie with cinnamon and brown sugar",
      description_ar: "فطيرة تفاح تقليدية بالقرفة والسكر البني. دافئة ومليئة بالنكهات الطبيعية للتفاح.",
      description_en: "Traditional apple pie with cinnamon and brown sugar. Warm and full of natural apple flavors.",
      price: 70,
      currency: "EGP",
      image: "/assets/product-10.jpg",
      slug: "apple-pie",
      category: "حلويات",
      categoryId: sweetsCategory?.id,
      price_cents: 7000,
      stock: 15,
      ingredients: JSON.stringify(["عجينة", "تفاح", "قرفة", "سكر بني", "زبدة"])
    },
    {
      name: "Danish Pastry",
      name_ar: "معجنات دانماركية",
      name_en: "Danish Pastry",
      description: "Buttery, flaky Danish pastry with fruit filling",
      description_ar: "معجنات دانماركية زبدية وطبقات رقيقة مع حشوة الفواكه. مخبوزة طازجة كل يوم.",
      description_en: "Buttery, flaky Danish pastry with fruit filling. Freshly baked every day.",
      price: 38,
      currency: "EGP",
      image: "/assets/product-11.jpg",
      slug: "danish-pastry",
      category: "معجنات",
      categoryId: pastriesCategory?.id,
      price_cents: 3800,
      stock: 32,
      ingredients: JSON.stringify(["دقيق", "زبدة", "فواكه", "سكر", "بيض"])
    },
    {
      name: "Brioche",
      name_ar: "خبز البريوش",
      name_en: "Brioche",
      description: "Rich and tender brioche bread, perfect for French toast",
      description_ar: "خبز بريوش غني وطري، مثالي للخبز الفرنسي المحمص. طعم زبدي فاخر.",
      description_en: "Rich and tender brioche bread, perfect for French toast. Luxurious buttery taste.",
      price: 48,
      currency: "EGP",
      image: "/assets/product-12.jpg",
      slug: "brioche",
      category: "خبز",
      categoryId: breadCategory?.id,
      price_cents: 4800,
      stock: 27,
      ingredients: JSON.stringify(["دقيق", "زبدة", "بيض", "سكر", "خميرة", "ملح"])
    }
  ];

  await prisma.product.createMany({
    data: products,
  });

  console.log(`✅ Seeded ${products.length} products`);
  console.log("🌱 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

