import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPaymobHMAC } from '@/lib/paymob';

// POST - Paymob callback/webhook
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hmac, obj } = body;

    // Verify HMAC
    if (!verifyPaymobHMAC(obj, hmac)) {
      if (process.env.NODE_ENV === 'development') {
        console.error('⚠️ Paymob callback HMAC verification failed');
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { order_id, success, amount_cents, transaction_id } = obj;

    // Find order by Paymob order ID
    const order = await prisma.order.findFirst({
      where: { paymobOrderId: order_id?.toString() },
    });

    if (!order) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Order not found for Paymob order ID: ${order_id}`);
      }
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Determine payment status
    let paymentStatus = 'pending';
    let orderStatus = order.status;

    if (success) {
      paymentStatus = 'paid';
      orderStatus = 'confirmed';
    } else {
      paymentStatus = 'failed';
      orderStatus = 'failed';
    }

    // Update order payment status with transaction ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus,
        status: orderStatus,
        transactionId: transaction_id?.toString(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('خطأ في معالجة callback الدفع:', error);
    }
    return NextResponse.json(
      { error: 'فشل في معالجة callback' },
      { status: 500 }
    );
  }
}

