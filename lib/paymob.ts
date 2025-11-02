import axios from 'axios';

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY || '';
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID || '';
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET || '';

const PAYMOB_BASE_URL = 'https://accept.paymob.com/api';

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

export async function authenticatePaymob(): Promise<string | null> {
  if (!PAYMOB_API_KEY) {
    console.error('Paymob API key not configured');
    return null;
  }

  try {
    const response = await axios.post<PaymobAuthResponse>(
      `${PAYMOB_BASE_URL}/auth/tokens`,
      { api_key: PAYMOB_API_KEY }
    );
    return response.data.token;
  } catch (error: any) {
    console.error('Paymob authentication failed:', error.message);
    return null;
  }
}

export async function createPaymobOrder(
  authToken: string,
  amount: number,
  currency: string = 'EGP'
): Promise<PaymobOrderResponse | null> {
  try {
    const response = await axios.post<PaymobOrderResponse>(
      `${PAYMOB_BASE_URL}/ecommerce/orders`,
      {
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: Math.round(amount * 100), // Convert to cents
        currency,
        merchant_order_id: `town-bakery-${Date.now()}`,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to create Paymob order:', error.message);
    return null;
  }
}

export async function createPaymentKey(
  authToken: string,
  orderId: number,
  customerInfo: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email?: string;
  },
  billingData?: any
): Promise<PaymobPaymentKeyResponse | null> {
  if (!PAYMOB_INTEGRATION_ID) {
    console.error('Paymob integration ID not configured');
    return null;
  }

  try {
    const response = await axios.post<PaymobPaymentKeyResponse>(
      `${PAYMOB_BASE_URL}/acceptance/payment_keys`,
      {
        auth_token: authToken,
        amount_cents: 0, // Will use order amount
        expiration: 3600,
        order_id: orderId,
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
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to create payment key:', error.message);
    return null;
  }
}

export function verifyPaymobHMAC(data: any, hmac: string): boolean {
  if (!PAYMOB_HMAC_SECRET) {
    console.warn('HMAC secret not configured, skipping verification');
    return true; // In development, allow without verification
  }

  const crypto = require('crypto');
  const orderedData = Object.keys(data)
    .sort()
    .reduce((acc: any, key) => {
      acc[key] = data[key];
      return acc;
    }, {});

  const message = Object.entries(orderedData)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');

  const calculatedHMAC = crypto
    .createHmac('sha512', PAYMOB_HMAC_SECRET)
    .update(message)
    .digest('hex');

  return calculatedHMAC === hmac;
}

