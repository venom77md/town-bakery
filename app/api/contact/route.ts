import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  message: z.string().min(1),
});

// POST - Submit contact form
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    const contact = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'تم استلام رسالتك بنجاح!',
        id: contact.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('خطأ في إرسال الرسالة:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'فشل في إرسال الرسالة' },
      { status: 500 }
    );
  }
}

