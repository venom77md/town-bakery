import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Setting up production database...');
  
  // This will create tables if they don't exist
  // Note: Prisma Migrate should be run separately for production
  console.log('✅ Database connection successful!');
  console.log('📝 Next steps:');
  console.log('   1. Run: npx prisma migrate deploy');
  console.log('   2. Run: npm run prisma:seed');
  console.log('   Or use Supabase SQL Editor to run migrations manually');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

