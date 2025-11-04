import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables
config({ path: join(projectRoot, '.env.local') });
config({ path: join(projectRoot, '.env') });

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testConnection() {
  console.log('🔍 Testing Database Connection...\n');
  console.log('='.repeat(60));
  
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL not found in environment');
    process.exit(1);
  }
  
  // Parse connection string (safely)
  try {
    const url = new URL(dbUrl);
    console.log('📋 Connection Details:');
    console.log(`   Host: ${url.hostname}`);
    console.log(`   Port: ${url.port || '5432'}`);
    console.log(`   Database: ${url.pathname.slice(1).split('?')[0]}`);
    console.log(`   User: ${url.username}`);
    
    if (url.hostname.includes('pooler')) {
      console.log(`   Type: Connection Pooler (pgbouncer)`);
    } else {
      console.log(`   Type: Direct Connection`);
    }
    console.log('');
  } catch (error) {
    console.error('⚠️  Could not parse DATABASE_URL:', error.message);
    console.log('');
  }
  
  // Test 1: Connection
  console.log('Test 1: Establishing connection...');
  try {
    await prisma.$connect();
    console.log('✅ Connection established successfully\n');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nPossible causes:');
    console.error('  1. Database server is not reachable');
    console.error('  2. Wrong connection string');
    console.error('  3. Firewall blocking connection');
    console.error('  4. Supabase project is paused');
    console.error('  5. Using Connection Pooler with migrate dev (not supported)');
    console.error('\n💡 Try using Direct Connection instead of Pooler for migrations');
    await prisma.$disconnect();
    process.exit(1);
  }
  
  // Test 2: Query
  console.log('Test 2: Executing query...');
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test, version() as pg_version`;
    console.log('✅ Query executed successfully');
    console.log(`   PostgreSQL Version: ${result[0].pg_version.split(' ')[0]}\n`);
  } catch (error) {
    console.error('❌ Query failed:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
  
  // Test 3: Check tables
  console.log('Test 3: Checking database tables...');
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    if (tables.length === 0) {
      console.log('⚠️  No tables found in database');
      console.log('   💡 Run migrations: npx prisma migrate dev --name init');
    } else {
      console.log(`✅ Found ${tables.length} table(s):`);
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    }
    console.log('');
  } catch (error) {
    console.error('❌ Failed to check tables:', error.message);
  }
  
  // Test 4: Check Prisma migrations table
  console.log('Test 4: Checking Prisma migrations...');
  try {
    const migrations = await prisma.$queryRaw`
      SELECT migration_name, finished_at 
      FROM _prisma_migrations 
      ORDER BY finished_at DESC 
      LIMIT 5;
    `;
    
    if (migrations.length === 0) {
      console.log('⚠️  No migrations found');
      console.log('   💡 Run: npx prisma migrate dev --name init');
    } else {
      console.log(`✅ Found ${migrations.length} migration(s):`);
      migrations.forEach(m => {
        console.log(`   - ${m.migration_name} (${m.finished_at ? new Date(m.finished_at).toLocaleDateString() : 'pending'})`);
      });
    }
    console.log('');
  } catch (error) {
    if (error.message.includes('does not exist') || error.message.includes('_prisma_migrations')) {
      console.log('⚠️  Prisma migrations table not found');
      console.log('   💡 Run: npx prisma migrate dev --name init');
    } else {
      console.error('❌ Failed to check migrations:', error.message);
    }
  }
  
  // Summary
  console.log('='.repeat(60));
  console.log('✅ All connection tests passed!');
  console.log('💡 Next steps:');
  console.log('   1. Run migrations: npx prisma migrate dev --name init');
  console.log('   2. Seed database: npm run prisma:seed');
  console.log('   3. Test API: curl http://localhost:3000/api/products');
  
  await prisma.$disconnect();
}

testConnection().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});

