'use client';

const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours instead of 24 for better security
const ADMIN_TOKEN_KEY = 'admin_auth_token';
const ADMIN_AUTH_TIME_KEY = 'admin_auth_time';

// Generate a simple token (in production, use JWT)
function generateToken(): string {
  return btoa(`${Date.now()}-${Math.random().toString(36).substring(7)}`);
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    const authTime = sessionStorage.getItem(ADMIN_AUTH_TIME_KEY);
    
    if (!token || !authTime) return false;
    
    // Check if session is still valid
    const timeElapsed = Date.now() - parseInt(authTime);
    
    if (timeElapsed > SESSION_DURATION) {
      logoutAdmin();
      return false;
    }
    
    return true;
  } catch (error) {
    // If storage fails, deny access
    return false;
  }
}

export function setAdminAuthenticated(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const token = generateToken();
    sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    sessionStorage.setItem(ADMIN_AUTH_TIME_KEY, Date.now().toString());
  } catch (error) {
    // Storage might be disabled
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to set admin authentication:', error);
    }
  }
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_AUTH_TIME_KEY);
  } catch (error) {
    // Ignore errors on logout
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

