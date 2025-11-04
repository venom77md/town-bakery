#!/usr/bin/env node
/**
 * Finish Database Setup Script
 * 
 * This script applies database migrations and seeds the database.
 * Run this after ensuring no other processes are using the database.
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Finishing database setup...\n');

try {
  console.log('1️⃣  Applying database migrations...');
  execSync('npx dotenv-cli -e .env.local prisma migrate deploy', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Migrations applied successfully!\n');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.log('\n💡 Try running manually:');
  console.log('   npx dotenv-cli -e .env.local prisma migrate deploy');
  console.log('\n   Or if that fails:');
  console.log('   npx dotenv-cli -e .env.local prisma migrate dev --name init\n');
  process.exit(1);
}

try {
  console.log('2️⃣  Seeding database with sample products...');
  execSync('npx dotenv-cli -e .env.local tsx prisma/seed.ts', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Database seeded successfully!\n');
} catch (error) {
  console.error('❌ Seeding failed:', error.message);
  console.log('\n💡 Try running manually:');
  console.log('   npx dotenv-cli -e .env.local tsx prisma/seed.ts\n');
  process.exit(1);
}

console.log('✅ Setup complete! You can now run:');
console.log('   npm run dev');
console.log('\n🎉 Visit http://localhost:3000 to see your products!');

