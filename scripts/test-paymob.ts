/**
 * Paymob Integration Test Script
 * 
 * Tests Paymob API connectivity and environment variable configuration
 * 
 * Usage: npx tsx scripts/test-paymob.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file explicitly
config({ path: resolve(process.cwd(), '.env.local') });
// Fallback to .env if .env.local doesn't exist
config({ path: resolve(process.cwd(), '.env') });

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY || '';
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID || '';
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID || '';
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET || process.env.PAYMOB_HMAC || '';
const PAYMOB_SANDBOX = process.env.PAYMOB_SANDBOX === 'true';
const PAYMOB_MOCK_MODE = process.env.PAYMOB_MOCK_MODE === 'true' || !PAYMOB_API_KEY;

// Determine base URL
const PAYMOB_BASE_URL = PAYMOB_SANDBOX
  ? 'https://accept.paymobsolutions.com/api'
  : 'https://accept.paymob.com/api';

console.log('🧪 Paymob Integration Test\n');
console.log('='.repeat(50));

// Display environment variables (safely)
console.log('\n📋 Environment Variables:');
console.log(`  PAYMOB_API_KEY: ${PAYMOB_API_KEY ? `${PAYMOB_API_KEY.substring(0, 4)}${'*'.repeat(Math.max(0, PAYMOB_API_KEY.length - 4))} (length: ${PAYMOB_API_KEY.length})` : '❌ NOT SET'}`);
console.log(`  PAYMOB_INTEGRATION_ID: ${PAYMOB_INTEGRATION_ID || '❌ NOT SET'}`);
console.log(`  PAYMOB_IFRAME_ID: ${PAYMOB_IFRAME_ID || '❌ NOT SET'}`);
console.log(`  PAYMOB_HMAC_SECRET: ${PAYMOB_HMAC_SECRET ? `${PAYMOB_HMAC_SECRET.substring(0, 4)}${'*'.repeat(Math.max(0, PAYMOB_HMAC_SECRET.length - 4))} (length: ${PAYMOB_HMAC_SECRET.length})` : '❌ NOT SET'}`);
console.log(`  PAYMOB_SANDBOX: ${PAYMOB_SANDBOX ? '✅ true (Sandbox Mode)' : '❌ false (Live Mode)'}`);
console.log(`  PAYMOB_MOCK_MODE: ${PAYMOB_MOCK_MODE ? '✅ true (Mock Mode)' : '❌ false (Real API)'}`);

console.log(`\n🌐 API Base URL: ${PAYMOB_BASE_URL}`);

// Check if API key is set
if (!PAYMOB_API_KEY) {
  console.log('\n⚠️  PAYMOB_API_KEY is not set. Mock mode will be used.');
  console.log('   To test real API, add your Paymob API key to .env.local');
  process.exit(0);
}

// Test authentication
console.log('\n🔐 Testing Paymob Authentication...');
console.log(`   Endpoint: ${PAYMOB_BASE_URL}/auth/tokens`);

try {
  const response = await fetch(`${PAYMOB_BASE_URL}/auth/tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: PAYMOB_API_KEY,
    }),
  });

  console.log(`   Status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.log(`   ❌ Authentication failed!`);
    console.log(`   Error: ${errorText}`);
    process.exit(1);
  }

  const data = await response.json();
  
  if (data.token) {
    console.log(`   ✅ Authentication successful!`);
    console.log(`   Token: ${data.token.substring(0, 20)}... (length: ${data.token.length})`);
    
    // Test creating an order (optional)
    console.log('\n📦 Testing Order Creation...');
    const orderResponse = await fetch(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: data.token,
        delivery_needed: false,
        amount_cents: 10000, // 100 EGP
        currency: 'EGP',
        merchant_order_id: `test-order-${Date.now()}`,
      }),
    });

    if (orderResponse.ok) {
      const orderData = await orderResponse.json();
      console.log(`   ✅ Order created successfully!`);
      console.log(`   Order ID: ${orderData.id}`);
      console.log(`   Amount: ${orderData.amount_cents / 100} EGP`);
    } else {
      const errorText = await orderResponse.text();
      console.log(`   ⚠️  Order creation failed: ${errorText}`);
    }
  } else {
    console.log(`   ❌ No token in response`);
    console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
    process.exit(1);
  }

  console.log('\n✅ All tests passed!');
  console.log('='.repeat(50));
  console.log('\n🎉 Paymob integration is configured correctly!');
  
} catch (error: any) {
  console.error('\n❌ Test failed with error:');
  console.error(`   ${error.message}`);
  if (error.cause) {
    console.error(`   Cause: ${error.cause}`);
  }
  process.exit(1);
}

