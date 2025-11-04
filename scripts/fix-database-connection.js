import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables
config({ path: join(projectRoot, '.env.local') });
config({ path: join(projectRoot, '.env') });

const dbUrl = process.env.DATABASE_URL;

console.log('🔍 Database Connection Diagnostic\n');
console.log('='.repeat(60));

if (!dbUrl) {
  console.error('❌ DATABASE_URL not found in environment');
  process.exit(1);
}

// Parse connection string
let url;
try {
  url = new URL(dbUrl);
} catch (error) {
  console.error('❌ Invalid DATABASE_URL format:', error.message);
  process.exit(1);
}

const projectRef = url.username.split('.')[1] || url.hostname.split('.')[0];

console.log('📋 Current Connection:');
console.log(`   Host: ${url.hostname}`);
console.log(`   Port: ${url.port || '5432'}`);
console.log(`   Project: ${projectRef}`);
console.log('');

console.log('🔴 Problem:');
console.log('   Database connection is failing.');
console.log('   Error: P1001 - Can\'t reach database server');
console.log('');

console.log('💡 Most Likely Cause:');
console.log('   Your Supabase project is PAUSED.');
console.log('   Free tier projects pause after 7 days of inactivity.');
console.log('');

console.log('✅ Solution Steps:\n');
console.log('1. Go to Supabase Dashboard:');
console.log(`   https://app.supabase.com/project/${projectRef}`);
console.log('');
console.log('2. Check Project Status:');
console.log('   - If you see "Paused" or "Restore" button, click it');
console.log('   - Wait 2-3 minutes for project to activate');
console.log('');
console.log('3. Get Fresh Connection String:');
console.log('   - Go to Settings → Database');
console.log('   - Copy "Direct connection" string (port 5432)');
console.log('   - Update DATABASE_URL in .env.local');
console.log('');
console.log('4. Test Connection:');
console.log('   npm run test:supabase');
console.log('');
console.log('5. Run Migrations:');
console.log('   npx prisma migrate dev --name init');
console.log('');
console.log('='.repeat(60));
console.log('');
console.log('🔧 Alternative: Use Connection Pooler');
console.log('');
console.log('If Direct Connection doesn\'t work, try Pooler:');
console.log('   DATABASE_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@');
console.log('   aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true');
console.log('');
console.log('⚠️  Note: Pooler may not work with migrate dev');
console.log('   Use Direct Connection for migrations, Pooler for app runtime');
console.log('');

