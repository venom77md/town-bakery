// Quick script to verify environment variables are loaded
console.log('🔍 Checking environment variables...\n');

const required = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'DATABASE_URL',
  'PAYMOB_API_KEY',
  'PAYMOB_INTEGRATION_ID',
];

required.forEach(key => {
  const value = process.env[key];
  if (value) {
    // Mask sensitive values
    const display = key.includes('KEY') || key.includes('PASSWORD') 
      ? value.substring(0, 10) + '...' 
      : value;
    console.log(`✅ ${key}: ${display}`);
  } else {
    console.log(`❌ ${key}: NOT SET`);
  }
});

console.log('\n⚠️  Note: If you see placeholder values (your-project-id, your_anon_public_key_here, etc.),');
console.log('   please replace them with your actual Supabase and Paymob credentials.\n');

