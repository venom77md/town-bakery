import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Simple authentication middleware for API routes
 * Checks for admin password in headers or cookies
 */
export function requireAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cookieAuth = request.cookies.get('admin-auth');
  
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
  
  // Check authorization header
  if (authHeader === `Bearer ${adminPassword}`) {
    return true;
  }
  
  // Check cookie
  if (cookieAuth?.value === adminPassword) {
    return true;
  }
  
  return false;
}

/**
 * Middleware wrapper for protected API routes
 */
export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    if (!requireAuth(req)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return handler(req);
  };
}
