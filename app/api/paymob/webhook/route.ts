import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPaymobHMAC } from '@/lib/paymob';

/**
 * Paymob Webhook Handler
 * Handles payment success/failure callbacks from Paymob
 * 
 * Webhook URL: /api/paymob/webhook
 * Configure this URL in Paymob dashboard: Settings → Webhooks
 */

interface PaymobWebhookPayload {
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
    data?: {
      acquirer_response_code?: string;
      acquirer_response_message?: string;
      acquirer_response_status?: string;
    };
  };
  hmac: string;
}

export async function POST(request: Request) {
  try {
    const body: PaymobWebhookPayload = await request.json();
    const { obj, hmac } = body;

    // Verify HMAC signature for security
    if (!verifyPaymobHMAC(obj, hmac)) {
      console.error('⚠️ Paymob webhook HMAC verification failed');
      return NextResponse.json(
        { error: 'Unauthorized - HMAC verification failed' },
        { status: 401 }
      );
    }

    const {
      order: { id: paymobOrderId, merchant_order_id },
      transaction_id,
      success,
      pending,
      is_refunded,
      is_voided,
      is_void,
      amount_cents,
    } = obj;

    // Extract our order ID from merchant_order_id (format: town-bakery-{orderId}-{timestamp})
    const orderIdMatch = merchant_order_id?.match(/town-bakery-(\d+)-/);
    const orderId = orderIdMatch ? parseInt(orderIdMatch[1]) : null;

    // Try to find order by Paymob order ID or merchant order ID
    let order = null;
    if (orderId) {
      order = await prisma.order.findUnique({
        where: { id: orderId },
      });
    }

    if (!order) {
      // Fallback: find by Paymob order ID
      order = await prisma.order.findFirst({
        where: { paymobOrderId: paymobOrderId.toString() },
      });
    }

    if (!order) {
      console.error(`Order not found for Paymob order ID: ${paymobOrderId}, merchant_order_id: ${merchant_order_id}`);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Determine payment status
    let paymentStatus = 'pending';
    let orderStatus = order.status;

    if (is_refunded) {
      paymentStatus = 'refunded';
      orderStatus = 'cancelled';
    } else if (is_voided || is_void === true) {
      paymentStatus = 'voided';
      orderStatus = 'cancelled';
    } else if (success && !pending) {
      paymentStatus = 'paid';
      orderStatus = 'confirmed';
    } else if (pending) {
      paymentStatus = 'processing';
    } else {
      paymentStatus = 'failed';
      orderStatus = 'failed';
    }

    // Update order with payment status and transaction ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus,
        status: orderStatus,
        transactionId: transaction_id,
        paymobOrderId: paymobOrderId.toString(),
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Order ${order.id} updated: paymentStatus=${paymentStatus}, transactionId=${transaction_id}`);

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error: any) {
    console.error('❌ Error processing Paymob webhook:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// GET - Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Paymob webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}

