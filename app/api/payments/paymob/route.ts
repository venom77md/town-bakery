import { NextResponse } from 'next/server';
import { authenticatePaymob, createPaymobOrder, createPaymentKey } from '@/lib/paymob';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const paymentRequestSchema = z.object({
  orderId: z.string(),
  customerInfo: z.object({
    first_name: z.string(),
    last_name: z.string(),
    phone_number: z.string(),
    email: z.string().optional(),
  }),
});

// POST - Initiate Paymob payment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, customerInfo } = paymentRequestSchema.parse(body);

    // Fetch order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    // Authenticate with Paymob
    const authToken = await authenticatePaymob();
    if (!authToken) {
      return NextResponse.json(
        { error: 'فشل في الاتصال بخدمة الدفع' },
        { status: 500 }
      );
    }

    // Create Paymob order
    const paymobOrder = await createPaymobOrder(
      authToken,
      order.total,
      order.currency
    );

    if (!paymobOrder) {
      return NextResponse.json(
        { error: 'فشل في إنشاء طلب الدفع' },
        { status: 500 }
      );
    }

    // Create payment key
    const paymentKey = await createPaymentKey(
      authToken,
      paymobOrder.id,
      customerInfo
    );

    if (!paymentKey) {
      return NextResponse.json(
        { error: 'فشل في إنشاء مفتاح الدفع' },
        { status: 500 }
      );
    }

    // Update order with Paymob order ID
    await prisma.order.update({
      where: { id: orderId },
      data: { paymobOrderId: paymobOrder.id.toString() },
    });

    return NextResponse.json({
      success: true,
      paymentToken: paymentKey.token,
      orderId: paymobOrder.id,
      iframeUrl: paymentKey.iframe_url,
    });
  } catch (error: any) {
    console.error('خطأ في عملية الدفع:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'فشل في عملية الدفع' },
      { status: 500 }
    );
  }
}

