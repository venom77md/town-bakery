import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const contactsFilePath = join(process.cwd(), 'data', 'contacts.json');

export async function GET() {
  try {
    if (!existsSync(contactsFilePath)) {
      return NextResponse.json([]);
    }
    const fileContents = await readFile(contactsFilePath, 'utf8');
    const contacts = JSON.parse(fileContents);
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('خطأ في قراءة الرسائل:', error);
    return NextResponse.json([]);
  }
}

