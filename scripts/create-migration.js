import { execSync } from 'child_process';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables
config({ path: join(projectRoot, '.env.local') });
config({ path: join(projectRoot, '.env') });

console.log('🚀 Creating Prisma Migration...\n');
console.log('='.repeat(60));

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment');
  console.error('   Please set DATABASE_URL in .env.local');
  process.exit(1);
}

// Parse connection string
try {
  const url = new URL(process.env.DATABASE_URL);
  console.log('📋 Connection Details:');
  console.log(`   Host: ${url.hostname}`);
  console.log(`   Port: ${url.port || '5432'}`);
  
  if (url.hostname.includes('pooler')) {
    console.log('   Type: Connection Pooler');
    console.log('\n⚠️  WARNING: Connection Pooler may not work with migrations!');
    console.log('   💡 Consider using Direct Connection for migrations:');
    console.log('      DATABASE_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres');
    console.log('');
  }
} catch (error) {
  console.error('⚠️  Could not parse DATABASE_URL');
}

// Check if migrations folder exists
const { existsSync } = await import('fs');
const migrationsPath = join(projectRoot, 'prisma', 'migrations');

if (existsSync(migrationsPath)) {
  console.log('✅ Migrations folder exists');
  const { readdirSync } = await import('fs');
  const migrations = readdirSync(migrationsPath);
  if (migrations.length > 0) {
    console.log(`   Found ${migrations.length} existing migration(s)`);
  }
  console.log('');
} else {
  console.log('📁 Migrations folder will be created');
  console.log('');
}

// Run migration
console.log('🔄 Running migration...\n');

try {
  execSync('npx prisma migrate dev --name init', {
    stdio: 'inherit',
    cwd: projectRoot,
  });
  
  console.log('\n✅ Migration created successfully!');
  console.log('\n💡 Next steps:');
  console.log('   1. Verify tables in Supabase Dashboard');
  console.log('   2. Seed database: npm run prisma:seed');
  console.log('   3. Test API: curl http://localhost:3000/api/products');
} catch (error) {
  console.error('\n❌ Migration failed!');
  console.error('\nPossible solutions:');
  console.error('  1. Use Direct Connection instead of Pooler');
  console.error('  2. Check if Supabase project is active');
  console.error('  3. Verify connection string in Supabase Dashboard');
  console.error('  4. Test connection: node scripts/test-db-connection.js');
  process.exit(1);
}

