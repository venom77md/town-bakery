import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  try {
    // Try to create products - this will create the database if it doesn't exist
    await prisma.product.createMany({
      data: [
        { name: "Sourdough Bread", description: "Crispy artisan bread", price: 45, image: "/images/bread.jpg", stock: 15 },
        { name: "Chocolate Croissant", description: "Buttery, flaky and rich", price: 20, image: "/images/croissant.jpg", stock: 30 },
        { name: "Vanilla Cake", description: "Soft sponge with vanilla frosting", price: 60, image: "/images/cake.jpg", stock: 12 }
      ],
      skipDuplicates: true,
    });
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    // If schema doesn't exist, that's okay - migrations will handle it
    if (error.message.includes('does not exist')) {
      console.log('ℹ️  Database tables need to be created first. Run: npx prisma migrate dev');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();

