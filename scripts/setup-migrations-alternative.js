import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables
config({ path: join(projectRoot, '.env.local') });
config({ path: join(projectRoot, '.env') });

console.log('🔧 Alternative Migration Setup\n');
console.log('='.repeat(60));

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ DATABASE_URL not found');
  process.exit(1);
}

console.log('📋 Current DATABASE_URL format:');
const url = new URL(dbUrl);
console.log(`   Host: ${url.hostname}`);
console.log(`   Port: ${url.port || '5432'}`);
console.log('');

console.log('💡 Solutions:\n');

console.log('Option 1: Use Supabase Dashboard (Recommended)');
console.log('   1. Go to: https://app.supabase.com/project/ameindcpqwhjojovefho');
console.log('   2. Check if project is paused → Click "Restore"');
console.log('   3. Wait 2-3 minutes');
console.log('   4. Go to Settings → Database');
console.log('   5. Copy "Direct connection" string');
console.log('   6. Update DATABASE_URL in .env.local');
console.log('   7. Run: npx prisma migrate dev --name init');
console.log('');

console.log('Option 2: Use Supabase SQL Editor');
console.log('   1. Go to: https://app.supabase.com/project/ameindcpqwhjojovefho');
console.log('   2. Go to SQL Editor');
console.log('   3. Run the SQL from prisma/migrations manually');
console.log('');

console.log('Option 3: Generate migration SQL without applying');
console.log('   Run: npx prisma migrate dev --create-only --name init');
console.log('   Then copy SQL from prisma/migrations/.../migration.sql');
console.log('   Paste into Supabase SQL Editor');
console.log('');

console.log('='.repeat(60));
console.log('\n🔍 Testing current connection...\n');

try {
  execSync('npx prisma db pull --print', {
    stdio: 'inherit',
    cwd: projectRoot,
  });
  console.log('\n✅ Connection successful! You can now run migrations.');
  console.log('   Run: npx prisma migrate dev --name init');
} catch (error) {
  console.log('\n❌ Connection failed. Please use Option 1 above.');
  console.log('   The project needs to be restored in Supabase Dashboard.');
}

