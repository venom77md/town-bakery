import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables
config({ path: join(projectRoot, '.env.local') });
config({ path: join(projectRoot, '.env') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

async function checkSupabaseStatus() {
  console.log('🔍 Checking Supabase Project Status...\n');
  console.log('='.repeat(60));
  
  if (!supabaseUrl) {
    console.error('❌ SUPABASE_URL not found');
    process.exit(1);
  }
  
  console.log(`📋 Project URL: ${supabaseUrl}`);
  console.log(`   Project Reference: ${supabaseUrl.split('//')[1]?.split('.')[0] || 'unknown'}`);
  console.log('');
  
  // Extract project reference
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1];
  
  if (!projectRef) {
    console.error('❌ Could not extract project reference from URL');
    process.exit(1);
  }
  
  console.log('💡 Diagnosis:\n');
  console.log('The database connection is failing. This usually means:');
  console.log('');
  console.log('1. ⚠️  Project is PAUSED (most common for free tier)');
  console.log('   → Free tier projects pause after 7 days of inactivity');
  console.log('   → Solution: Go to Supabase Dashboard and click "Restore"');
  console.log('');
  console.log('2. ❌ Project was DELETED');
  console.log('   → Solution: Create a new project and update .env.local');
  console.log('');
  console.log('3. 🔒 Network/Firewall blocking');
  console.log('   → Solution: Check firewall settings, try different network');
  console.log('');
  console.log('4. 🔑 Wrong credentials');
  console.log('   → Solution: Get fresh connection string from Supabase Dashboard');
  console.log('');
  console.log('='.repeat(60));
  console.log('\n📋 Action Steps:\n');
  console.log('Step 1: Check Supabase Dashboard');
  console.log(`   → Go to: https://app.supabase.com/project/${projectRef}`);
  console.log('   → Check project status');
  console.log('');
  console.log('Step 2: If project is paused:');
  console.log('   → Click "Restore" or "Resume" button');
  console.log('   → Wait 2-3 minutes for project to activate');
  console.log('   → Try connection again');
  console.log('');
  console.log('Step 3: If project is active but connection fails:');
  console.log('   → Go to Settings → Database');
  console.log('   → Copy fresh "Direct connection" string');
  console.log('   → Update DATABASE_URL in .env.local');
  console.log('');
  console.log('Step 4: After fixing connection:');
  console.log('   → Run: npx prisma migrate dev --name init');
  console.log('   → Run: npm run prisma:seed');
  console.log('');
  console.log('='.repeat(60));
  console.log('\n🔧 Alternative: Use Supabase CLI\n');
  console.log('If dashboard access is not available, you can use Supabase CLI:');
  console.log('');
  console.log('1. Install: npm install -g supabase');
  console.log('2. Login: supabase login');
  console.log('3. Link: supabase link --project-ref ' + projectRef);
  console.log('4. Migrate: supabase db push');
  console.log('');
}

checkSupabaseStatus().catch(console.error);

