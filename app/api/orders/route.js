import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const ordersFilePath = join(process.cwd(), 'data', 'orders.json');

// Ensure data directory exists
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// GET - Fetch all orders
export async function GET() {
  try {
    if (!existsSync(ordersFilePath)) {
      await writeFile(ordersFilePath, JSON.stringify([], null, 2), 'utf8');
      return NextResponse.json([]);
    }
    const fileContents = await readFile(ordersFilePath, 'utf8');
    const orders = JSON.parse(fileContents);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('خطأ في قراءة الطلبات:', error);
    return NextResponse.json([]);
  }
}

// POST - Create new order
export async function POST(request) {
  try {
    let orders = [];
    if (existsSync(ordersFilePath)) {
      try {
        const fileContents = await readFile(ordersFilePath, 'utf8');
        orders = JSON.parse(fileContents);
      } catch (error) {
        console.error('خطأ في تحليل ملف الطلبات:', error);
        orders = [];
      }
    }

    const orderData = await request.json();
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newOrder = {
      id: orderId,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      orderDate: orderData.orderDate || new Date().toISOString(),
    };

    orders.push(newOrder);

    await writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');

    console.log('تم إنشاء طلب جديد:', orderId);

    return NextResponse.json({ 
      success: true, 
      id: orderId,
      orderId: orderId 
    }, { status: 201 });
  } catch (error) {
    console.error('خطأ في إنشاء الطلب:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء الطلب' },
      { status: 500 }
    );
  }
}

// PATCH - Update order status
export async function PATCH(request) {
  try {
    if (!existsSync(ordersFilePath)) {
      return NextResponse.json({ error: 'لا توجد طلبات' }, { status: 404 });
    }

    const fileContents = await readFile(ordersFilePath, 'utf8');
    let orders = JSON.parse(fileContents);
    
    const { id, status } = await request.json();
    const orderIndex = orders.findIndex(order => order.id === id);
    
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();

    await writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('خطأ في تحديث الطلب:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث الطلب' },
      { status: 500 }
    );
  }
}

