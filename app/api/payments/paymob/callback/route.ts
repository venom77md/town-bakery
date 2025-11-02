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
      console.error('⚠️ Paymob callback HMAC verification failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { order_id, success, amount_cents, transaction_id } = obj;

    // Find order by Paymob order ID
    const order = await prisma.order.findFirst({
      where: { paymobOrderId: order_id?.toString() },
    });

    if (!order) {
      console.error(`Order not found for Paymob order ID: ${order_id}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order payment status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: success ? 'paid' : 'failed',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('خطأ في معالجة callback الدفع:', error);
    return NextResponse.json(
      { error: 'فشل في معالجة callback' },
      { status: 500 }
    );
  }
}

