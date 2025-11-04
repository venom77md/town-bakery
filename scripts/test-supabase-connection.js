import { createClient } from '@supabase/supabase-js';
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
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  console.log('='.repeat(60));

  // Check environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials!');
    console.error('   SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
    console.error('   SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌');
    console.error('\n💡 Please check your .env.local file');
    process.exit(1);
  }

  console.log('📋 Connection Details:');
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Key: ${supabaseAnonKey.substring(0, 20)}...`);
  console.log('');

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Test 1: Basic connection
  console.log('Test 1: Testing basic connection...');
  try {
    // Try to access Supabase API (this will work even if database is empty)
    const { data, error } = await supabase
      .from('_prisma_migrations')
      .select('*')
      .limit(1);
    
    if (error) {
      // Check if it's a "table doesn't exist" error (which is OK for initial setup)
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        console.log('✅ Connection successful!');
        console.log('   ⚠️  Database tables not created yet (this is normal)');
        console.log('   💡 Run: npx prisma migrate dev --name init');
      } else if (error.code === 'PGRST301' || error.message.includes('JWT')) {
        console.error('❌ Authentication failed:', error.message);
        console.error('   💡 Check your SUPABASE_ANON_KEY');
        process.exit(1);
      } else {
        // Try a simple health check
        const healthCheck = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`
          }
        });
        
        if (healthCheck.ok) {
          console.log('✅ Connection successful!');
          console.log('   ⚠️  Database tables not created yet');
        } else {
          throw error;
        }
      }
    } else {
      console.log('✅ Connection successful (Prisma migrations table found)');
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n💡 Possible causes:');
    console.error('   1. Supabase project is paused or deleted');
    console.error('   2. Wrong URL or API key');
    console.error('   3. Network connectivity issues');
    console.error('   4. Database not initialized');
    process.exit(1);
  }
  console.log('');

  // Test 2: Check database tables
  console.log('Test 2: Checking database tables...');
  try {
    // Use PostgREST to check tables
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(10);

    if (error) {
      // Try alternative method
      const { data: altData, error: altError } = await supabase.rpc('exec_sql', {
        query: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' LIMIT 10"
      });
      
      if (altError) {
        console.log('⚠️  Could not list tables (may need permissions)');
        console.log('   This is normal if tables are not created yet');
      } else {
        console.log('✅ Database accessible');
      }
    } else {
      console.log(`✅ Found ${tables?.length || 0} table(s) in public schema`);
      if (tables && tables.length > 0) {
        tables.forEach(table => {
          console.log(`   - ${table.table_name}`);
        });
      }
    }
  } catch (error) {
    console.log('⚠️  Could not check tables:', error.message);
    console.log('   This is normal if database is not initialized');
  }
  console.log('');

  // Test 3: Check Prisma migrations
  console.log('Test 3: Checking Prisma setup...');
  try {
    const { data, error } = await supabase
      .from('_prisma_migrations')
      .select('migration_name, finished_at')
      .order('finished_at', { ascending: false })
      .limit(5);

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️  Prisma migrations table not found');
        console.log('   💡 Run: npx prisma migrate dev --name init');
      } else {
        console.log('⚠️  Could not check migrations:', error.message);
      }
    } else if (data && data.length > 0) {
      console.log(`✅ Found ${data.length} migration(s):`);
      data.forEach(m => {
        const date = m.finished_at ? new Date(m.finished_at).toLocaleDateString() : 'pending';
        console.log(`   - ${m.migration_name} (${date})`);
      });
    } else {
      console.log('⚠️  No migrations found');
      console.log('   💡 Run: npx prisma migrate dev --name init');
    }
  } catch (error) {
    console.log('⚠️  Could not check migrations');
  }
  console.log('');

  // Summary
  console.log('='.repeat(60));
  console.log('✅ Supabase connection test completed successfully!');
  console.log('\n💡 Next steps:');
  console.log('   1. Run migrations: npx prisma migrate dev --name init');
  console.log('   2. Seed database: npm run prisma:seed');
  console.log('   3. Test API: curl http://localhost:3000/api/products');
}

testConnection().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});

