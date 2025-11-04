import { NextResponse } from 'next/server';
import { initiatePaymobPayment } from '@/lib/paymob';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Support both formats: new simplified format and legacy format
const simplifiedPaymentSchema = z.object({
  orderId: z.union([z.string(), z.number()]).optional(),
  amount: z.number(),
  name: z.string(),
  phone: z.string(),
  address: z.string(),
});

const legacyPaymentSchema = z.object({
  orderId: z.union([z.string(), z.number()]),
  amount: z.number().optional(),
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
    
    let orderId: number | null = null;
    let amount: number;
    let customerInfo: {
      first_name: string;
      last_name: string;
      phone_number: string;
      email?: string;
    };
    let currency = 'EGP';

    // Try simplified format first
    try {
      const simplified = simplifiedPaymentSchema.parse(body);
      // Parse name into first and last name
      const nameParts = simplified.name.trim().split(' ');
      customerInfo = {
        first_name: nameParts[0] || simplified.name,
        last_name: nameParts.slice(1).join(' ') || '',
        phone_number: simplified.phone.replace(/[^0-9]/g, ''),
        email: '',
      };
      amount = simplified.amount;
      
      // If orderId is provided, fetch order to get currency and update it
      if (simplified.orderId) {
        const numericOrderId = typeof simplified.orderId === 'string' ? parseInt(simplified.orderId) : simplified.orderId;
        const order = await prisma.order.findUnique({
          where: { id: numericOrderId },
        });
        if (order) {
          orderId = numericOrderId;
          currency = order.currency;
        }
      }
    } catch {
      // Fall back to legacy format
      const legacy = legacyPaymentSchema.parse(body);
      const numericOrderId = typeof legacy.orderId === 'string' ? parseInt(legacy.orderId) : legacy.orderId;
      
      // Fetch order from database
      const order = await prisma.order.findUnique({
        where: { id: numericOrderId },
      });

      if (!order) {
        return NextResponse.json(
          { error: 'الطلب غير موجود' },
          { status: 404 }
        );
      }

      orderId = numericOrderId;
      amount = legacy.amount || order.total;
      currency = order.currency;
      customerInfo = legacy.customerInfo;
    }

    // Use the complete payment flow helper
    const merchantOrderId = orderId 
      ? `town-bakery-${orderId}-${Date.now()}`
      : `town-bakery-${Date.now()}`;
    
    const paymentResult = await initiatePaymobPayment(
      amount,
      currency,
      customerInfo,
      merchantOrderId
    );

    if (!paymentResult) {
      console.error('❌ Paymob error: Failed to initiate payment');
      return NextResponse.json(
        { error: 'فشل في إعداد الدفع. يرجى المحاولة مرة أخرى.' },
        { status: 500 }
      );
    }

    // Update order if orderId was provided
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymobOrderId: paymentResult.paymobOrderId.toString(),
          paymentStatus: 'processing',
          status: 'processing',
        },
      });
    }

    return NextResponse.json({
      success: true,
      redirectUrl: paymentResult.paymentUrl,
    });
  } catch (error: any) {
    console.error('❌ Paymob error:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error);
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'فشل في عملية الدفع' },
      { status: 500 }
    );
  }
}

