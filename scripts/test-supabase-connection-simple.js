import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  const { data, error } = await supabase.from('products').select('*').limit(1);
  
  if (error) {
    console.error('❌ Connection failed:', error.message);
    
    // Check if it's a "table doesn't exist" error (which is OK for initial setup)
    if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
      console.log('✅ Supabase connection successful!');
      console.log('⚠️  Database tables not created yet (this is normal)');
      console.log('💡 Run: npx prisma migrate dev --name init');
    } else {
      console.error('\n💡 Possible causes:');
      console.error('   1. Supabase project is paused or deleted');
      console.error('   2. Wrong URL or API key');
      console.error('   3. Network connectivity issues');
      process.exit(1);
    }
  } else {
    console.log('✅ Connection successful. Sample data:', data);
  }
}

testConnection();

