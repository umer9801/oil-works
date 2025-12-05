import Cookies from 'js-cookie';

const AUTH_COOKIE_NAME = 'oil_works_auth';
const COOKIE_EXPIRY_DAYS = 7;

export const setAuthCookie = (isAuthenticated: boolean) => {
  if (typeof window === 'undefined') return;
  
  if (isAuthenticated) {
    Cookies.set(AUTH_COOKIE_NAME, 'true', { 
      expires: COOKIE_EXPIRY_DAYS,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    // Also set in localStorage as backup
    localStorage.setItem('isLoggedIn', 'true');
  } else {
    Cookies.remove(AUTH_COOKIE_NAME);
    localStorage.removeItem('isLoggedIn');
  }
};

export const getAuthCookie = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check cookie first
  const cookieAuth = Cookies.get(AUTH_COOKIE_NAME) === 'true';
  
  // Fallback to localStorage
  const localAuth = localStorage.getItem('isLoggedIn') === 'true';
  
  return cookieAuth || localAuth;
};

export const clearAuth = () => {
  if (typeof window === 'undefined') return;
  
  Cookies.remove(AUTH_COOKIE_NAME);
  localStorage.removeItem('isLoggedIn');
};
