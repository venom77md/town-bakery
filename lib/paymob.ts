/**
 * Paymob Payment Integration
 * Supports both live and sandbox environments
 * Falls back to mock mode when API keys are not configured
 */

import { createHmac } from 'node:crypto';

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY || '';
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID || '';
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID || '';
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET || process.env.PAYMOB_HMAC || '';
const PAYMOB_SANDBOX = process.env.PAYMOB_SANDBOX === 'true';
const PAYMOB_MOCK_MODE = process.env.PAYMOB_MOCK_MODE === 'true' || !PAYMOB_API_KEY;

// Determine base URL based on sandbox mode
const PAYMOB_BASE_URL = PAYMOB_SANDBOX
  ? 'https://accept.paymobsolutions.com/api'
  : 'https://accept.paymob.com/api';

// Type definitions
export interface PaymobAuthResponse {
  token: string;
}

export interface PaymobOrderResponse {
  id: number;
  amount_cents: number;
}

export interface PaymobPaymentKeyResponse {
  token: string;
  iframe_url?: string;
}

export interface PaymobWebhookData {
  obj: {
    id: number;
    amount_cents: number;
    order: {
      id: number;
      merchant_order_id: string;
    };
    transaction_id: string;
    success: boolean;
    pending: boolean;
    is_refunded: boolean;
    is_capture: boolean;
    is_voided: boolean;
    is_void: boolean;
    is_auth: boolean;
    is_standalone_payment: boolean;
    created_at: string;
    currency: string;
    merchant: {
      id: number;
      created_at: string;
      phones: string[];
      company_emails: string[];
      company_name: string;
      state: string;
      country: string;
      city: string;
      postal_code: string;
      street: string;
    };
    data: {
      acquirer_response_code?: string;
      acquirer_response_message?: string;
      acquirer_response_status?: string;
    };
    owner: number;
    source_data: {
      pan: string;
      type: string;
      sub_type: string;
    };
  };
}

/**
 * Authenticate with Paymob API
 * Returns authentication token for subsequent API calls
 */
export async function authenticatePaymob(): Promise<string | null> {
  // Mock mode for development/testing
  if (PAYMOB_MOCK_MODE) {
    console.log('🔶 Paymob Mock Mode: Using mock authentication token');
    return 'mock_auth_token_' + Date.now();
  }

  if (!PAYMOB_API_KEY) {
    console.error('Paymob API key not configured');
    return null;
  }

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Paymob authentication failed:', response.status, errorText);
      return null;
    }

    const data: PaymobAuthResponse = await response.json();
    return data.token;
  } catch (error: any) {
    console.error('Paymob authentication error:', error.message);
    return null;
  }
}

/**
 * Create an order in Paymob system
 * @param authToken - Authentication token from authenticatePaymob()
 * @param amount - Order amount in EGP
 * @param currency - Currency code (default: EGP)
 * @param merchantOrderId - Optional merchant order ID
 */
export async function createPaymobOrder(
  authToken: string,
  amount: number,
  currency: string = 'EGP',
  merchantOrderId?: string
): Promise<PaymobOrderResponse | null> {
  // Mock mode for development/testing
  if (PAYMOB_MOCK_MODE || authToken.startsWith('mock_')) {
    console.log('🔶 Paymob Mock Mode: Creating mock order');
    return {
      id: Math.floor(Math.random() * 1000000),
      amount_cents: Math.round(amount * 100),
    };
  }

  try {
    const response = await fetch(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: Math.round(amount * 100), // Convert to cents
        currency,
        merchant_order_id: merchantOrderId || `town-bakery-${Date.now()}`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create Paymob order:', response.status, errorText);
      return null;
    }

    const data: PaymobOrderResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error('Failed to create Paymob order:', error.message);
    return null;
  }
}

/**
 * Create a payment key for iframe integration
 * @param authToken - Authentication token
 * @param paymobOrderId - Paymob order ID from createPaymobOrder()
 * @param customerInfo - Customer information
 * @param billingData - Optional billing data
 */
export async function createPaymentKey(
  authToken: string,
  paymobOrderId: number,
  customerInfo: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email?: string;
  },
  billingData?: any
): Promise<PaymobPaymentKeyResponse | null> {
  // Mock mode for development/testing
  if (PAYMOB_MOCK_MODE || authToken.startsWith('mock_')) {
    console.log('🔶 Paymob Mock Mode: Creating mock payment key');
    const mockToken = `mock_payment_token_${Date.now()}`;
    const iframeUrl = PAYMOB_IFRAME_ID
      ? `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${mockToken}`
      : undefined;
    return {
      token: mockToken,
      iframe_url: iframeUrl,
    };
  }

  if (!PAYMOB_INTEGRATION_ID) {
    console.error('Paymob integration ID not configured');
    return null;
  }

  try {
    const response = await fetch(`${PAYMOB_BASE_URL}/acceptance/payment_keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: 0, // Will use order amount
        expiration: 3600, // 1 hour
        order_id: paymobOrderId,
        billing_data: billingData || {
          first_name: customerInfo.first_name,
          last_name: customerInfo.last_name,
          phone_number: customerInfo.phone_number,
          email: customerInfo.email || '',
          apartment: 'NA',
          floor: 'NA',
          street: 'NA',
          building: 'NA',
          city: 'Cairo',
          state: 'Cairo',
          country: 'EG',
          postal_code: 'NA',
        },
        currency: 'EGP',
        integration_id: parseInt(PAYMOB_INTEGRATION_ID),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create payment key:', response.status, errorText);
      return null;
    }

    const data: PaymobPaymentKeyResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error('Failed to create payment key:', error.message);
    return null;
  }
}

/**
 * Generate payment URL for redirect
 * @param paymentToken - Payment token from createPaymentKey()
 */
export function generatePaymentUrl(paymentToken: string): string {
  if (!PAYMOB_IFRAME_ID) {
    throw new Error('Paymob iframe ID not configured');
  }

  const baseUrl = PAYMOB_SANDBOX
    ? 'https://accept.paymobsolutions.com/api/acceptance/iframes'
    : 'https://accept.paymob.com/api/acceptance/iframes';

  return `${baseUrl}/${PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;
}

/**
 * Verify Paymob webhook HMAC signature
 * @param data - Webhook data object
 * @param hmac - HMAC signature from Paymob
 */
export function verifyPaymobHMAC(data: any, hmac: string): boolean {
  if (!PAYMOB_HMAC_SECRET) {
    console.warn('HMAC secret not configured, skipping verification');
    // In development/mock mode, allow without verification
    return PAYMOB_MOCK_MODE;
  }

  try {
    // Sort keys alphabetically
    const orderedData = Object.keys(data)
      .sort()
      .reduce((acc: any, key) => {
        acc[key] = data[key];
        return acc;
      }, {});

    // Build message string
    const message = Object.entries(orderedData)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    // Calculate HMAC
    const calculatedHMAC = createHmac('sha512', PAYMOB_HMAC_SECRET)
      .update(message)
      .digest('hex');

    return calculatedHMAC === hmac;
  } catch (error: any) {
    console.error('HMAC verification error:', error.message);
    return false;
  }
}

/**
 * Complete payment flow: authenticate, create order, and generate payment URL
 * @param amount - Order amount
 * @param currency - Currency code
 * @param customerInfo - Customer information
 * @param merchantOrderId - Optional merchant order ID
 */
export async function initiatePaymobPayment(
  amount: number,
  currency: string = 'EGP',
  customerInfo: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email?: string;
  },
  merchantOrderId?: string
): Promise<{ paymentUrl: string; paymobOrderId: number } | null> {
  // Step 1: Authenticate
  const authToken = await authenticatePaymob();
  if (!authToken) {
    return null;
  }

  // Step 2: Create Paymob order
  const paymobOrder = await createPaymobOrder(authToken, amount, currency, merchantOrderId);
  if (!paymobOrder) {
    return null;
  }

  // Step 3: Create payment key
  const paymentKey = await createPaymentKey(authToken, paymobOrder.id, customerInfo);
  if (!paymentKey) {
    return null;
  }

  // Step 4: Generate payment URL
  try {
    const paymentUrl = paymentKey.iframe_url || generatePaymentUrl(paymentKey.token);
    return {
      paymentUrl,
      paymobOrderId: paymobOrder.id,
    };
  } catch (error: any) {
    console.error('Failed to generate payment URL:', error.message);
    return null;
  }
}
