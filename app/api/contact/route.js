import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const contactsFilePath = join(process.cwd(), 'data', 'contacts.json');

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Ensure data directory exists
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    let contacts = [];
    if (existsSync(contactsFilePath)) {
      try {
        const fileContents = await readFile(contactsFilePath, 'utf8');
        contacts = JSON.parse(fileContents);
      } catch (error) {
        console.error('Error reading contacts file:', error);
        contacts = [];
      }
    }

    const contactEntry = {
      id: `CONT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      email: data.email,
      message: data.message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    contacts.push(contactEntry);

    await writeFile(contactsFilePath, JSON.stringify(contacts, null, 2), 'utf8');

    console.log('تم حفظ رسالة الاتصال:', contactEntry.id);

    return NextResponse.json({ 
      success: true,
      message: 'تم استلام رسالتك بنجاح' 
    }, { status: 200 });
  } catch (error) {
    console.error('خطأ في معالجة نموذج الاتصال:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إرسال الرسالة' },
      { status: 500 }
    );
  }
}

