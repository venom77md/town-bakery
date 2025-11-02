import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all contact messages
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(contacts);
  } catch (error: any) {
    console.error('خطأ في جلب الرسائل:', error);
    // Fallback to local data if DB not configured
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const contactsFilePath = path.join(process.cwd(), 'data', 'contacts.json');
      try {
        const fileContents = await fs.readFile(contactsFilePath, 'utf8');
        const contacts = JSON.parse(fileContents);
        return NextResponse.json(contacts);
      } catch {
        return NextResponse.json([]);
      }
    } catch {
      return NextResponse.json([]);
    }
  }
}

