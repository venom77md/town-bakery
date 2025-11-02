'use client';

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const authenticated = sessionStorage.getItem('admin_authenticated');
  const authTime = sessionStorage.getItem('admin_auth_time');
  
  if (!authenticated || !authTime) return false;
  
  // Check if session is still valid (24 hours)
  const timeElapsed = Date.now() - parseInt(authTime);
  const twentyFourHours = 24 * 60 * 60 * 1000;
  
  if (timeElapsed > twentyFourHours) {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_auth_time');
    return false;
  }
  
  return authenticated === 'true';
}

export function logoutAdmin() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('admin_authenticated');
  sessionStorage.removeItem('admin_auth_time');
}

