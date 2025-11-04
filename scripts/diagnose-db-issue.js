import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dns from 'dns';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables
config({ path: join(projectRoot, '.env.local') });
config({ path: join(projectRoot, '.env') });

const dnsLookup = promisify(dns.lookup);

async function diagnoseConnection() {
  console.log('🔍 Database Connection Diagnostic\n');
  console.log('='.repeat(60));
  
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL not found');
    process.exit(1);
  }
  
  let url;
  try {
    url = new URL(dbUrl);
  } catch (error) {
    console.error('❌ Invalid DATABASE_URL format:', error.message);
    process.exit(1);
  }
  
  console.log('📋 Connection Information:');
  console.log(`   Hostname: ${url.hostname}`);
  console.log(`   Port: ${url.port || '5432'}`);
  console.log(`   Database: ${url.pathname.slice(1).split('?')[0]}`);
  console.log(`   User: ${url.username}`);
  console.log('');
  
  // Test 1: DNS Resolution
  console.log('Test 1: DNS Resolution...');
  try {
    const addresses = await dnsLookup(url.hostname);
    console.log(`✅ DNS resolved: ${url.hostname} → ${addresses.address}`);
    if (addresses.family === 6) {
      console.log(`   IPv6 address detected`);
    }
  } catch (error) {
    console.error(`❌ DNS resolution failed: ${error.message}`);
    console.error('\n💡 Possible causes:');
    console.error('   - Project may be paused or deleted');
    console.error('   - Wrong project reference in connection string');
    console.error('   - Network connectivity issues');
    return;
  }
  console.log('');
  
  // Test 2: Connection String Analysis
  console.log('Test 2: Connection String Analysis...');
  
  const issues = [];
  
  // Check for common issues
  if (url.hostname.includes('pooler') && url.port === '6543') {
    console.log('⚠️  Using Connection Pooler (port 6543)');
    console.log('   💡 For migrations, use Direct Connection (port 5432)');
    issues.push('Consider using Direct Connection for migrations');
  }
  
  if (url.username.includes('.')) {
    console.log('✅ Username format looks correct (Supabase format)');
  } else {
    console.log('⚠️  Username format may be incorrect');
    issues.push('Username format may need project reference');
  }
  
  if (!url.password) {
    console.error('❌ Password missing in connection string');
    issues.push('Password is required');
  } else {
    console.log('✅ Password present (hidden)');
  }
  
  if (url.pathname === '/postgres' || url.pathname === '/postgres?pgbouncer=true') {
    console.log('✅ Database name is correct');
  } else {
    console.log('⚠️  Database name may be incorrect');
    issues.push('Database should be "postgres"');
  }
  
  console.log('');
  
  // Test 3: Supabase Project Check
  console.log('Test 3: Supabase Project Reference...');
  const projectRef = url.username.split('.')[1] || url.hostname.split('.')[0];
  if (projectRef && projectRef.length > 10) {
    console.log(`✅ Project reference found: ${projectRef}`);
    console.log(`   💡 Verify in Supabase Dashboard: https://app.supabase.com/project/${projectRef}`);
  } else {
    console.log('⚠️  Could not extract project reference');
  }
  console.log('');
  
  // Recommendations
  console.log('='.repeat(60));
  console.log('💡 Recommendations:\n');
  
  if (issues.length > 0) {
    console.log('⚠️  Issues found:');
    issues.forEach(issue => console.log(`   - ${issue}`));
    console.log('');
  }
  
  console.log('1. Check Supabase Dashboard:');
  console.log('   - Go to https://app.supabase.com');
  console.log('   - Verify project is active (not paused)');
  console.log('   - Check Settings → Database → Connection string');
  console.log('');
  
  console.log('2. Get Fresh Connection String:');
  console.log('   - Settings → Database → Connection Pooling');
  console.log('   - For migrations: Use "Direct connection" (port 5432)');
  console.log('   - For app: Use "Connection Pooling" (port 6543)');
  console.log('');
  
  console.log('3. Verify Credentials:');
  console.log('   - Password should match Supabase project password');
  console.log('   - Project reference should match your project');
  console.log('');
  
  console.log('4. Test Connection:');
  console.log('   - Try: psql "DATABASE_URL" (if psql is installed)');
  console.log('   - Or use Supabase Dashboard → SQL Editor');
  console.log('');
  
  console.log('5. Network Check:');
  console.log('   - Check firewall settings');
  console.log('   - Verify network can reach Supabase servers');
  console.log('   - Try: ping db.ameindcpqwhjojovefho.supabase.co');
}

diagnoseConnection().catch(console.error);

