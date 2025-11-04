import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch statistics
    const [totalOrders, pendingOrders, allOrders, totalProducts] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          customerName: true,
          total: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.product.count(),
    ]);

    // Calculate total revenue (sum of all completed orders)
    const completedOrders = await prisma.order.findMany({
      where: { status: { in: ['confirmed', 'delivered'] } },
      select: { total: true },
    });

    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      totalRevenue,
      totalProducts,
      recentOrders: allOrders,
      topProducts: [], // Can be populated later
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}

