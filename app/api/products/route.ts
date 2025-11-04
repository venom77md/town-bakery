import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    // Log only in development, fallback to local data if DB not configured
    if (process.env.NODE_ENV === 'development') {
      console.error('خطأ في جلب المنتجات:', error);
    }
    // Fallback to local data if DB not configured
    try {
      const { products } = await import('@/lib/products');
      return NextResponse.json(products);
    } catch {
      return NextResponse.json(
        { error: 'فشل في جلب المنتجات' },
        { status: 500 }
      );
    }
  }
}

