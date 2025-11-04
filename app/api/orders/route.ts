import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const orderSchema = z.object({
  products: z.array(z.any()),
  total: z.number(),
  currency: z.string().default('EGP'),
  customerName: z.string(),
  phone: z.string(),
  address: z.string().optional(),
  deliveryTime: z.string().optional(),
  paymentMethod: z.string(),
  paymentStatus: z.string().default('pending'),
});

// GET - Fetch all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('خطأ في قراءة الطلبات:', error);
    }
    return NextResponse.json(
      { error: 'فشل في جلب الطلبات' },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = orderSchema.parse(body);

    const order = await prisma.order.create({
      data: {
        products: JSON.stringify(validatedData.products), // Store as JSON string
        total: validatedData.total,
        currency: validatedData.currency,
        customerName: validatedData.customerName,
        phone: validatedData.phone,
        address: validatedData.address,
        deliveryTime: validatedData.deliveryTime,
        paymentMethod: validatedData.paymentMethod,
        paymentStatus: validatedData.paymentStatus,
        status: 'new',
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: order.id,
        orderId: order.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('خطأ في إنشاء الطلب:', error);
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء الطلب' },
      { status: 500 }
    );
  }
}

// PATCH - Update order status
export async function PATCH(request: Request) {
  try {
    const { id, status, paymentStatus } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'معرّف الطلب مطلوب' },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('خطأ في تحديث الطلب:', error);
    }
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث الطلب' },
      { status: 500 }
    );
  }
}

