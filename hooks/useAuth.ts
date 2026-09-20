'use client';

type AdminRole = 'admin' | 'superadmin';

const TOKEN_KEY = 'admin_token';
const ROLE_KEY = 'admin_role';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = (): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(ROLE_KEY);
};

export const getRole = (): AdminRole | null => {
  if (typeof window === 'undefined') return null;
  const role = window.localStorage.getItem(ROLE_KEY);
  if (role === 'admin' || role === 'superadmin') {
    return role;
  }
  return null;
};

export const setRole = (role: AdminRole): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ROLE_KEY, role);
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};

export const logout = (): void => {
  clearToken();
  if (typeof window !== 'undefined') {
    window.location.replace('/login');
  }
};

const fakeJwt = (payload: Record<string, any>): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
    ...payload,
  }));
  const sig = Array.from({ length: 40 }, () =>
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'.charAt(
      Math.floor(Math.random() * 64)
    )
  ).join('');
  return `${header}.${body}.${sig}`;
};

export const mockLogin = async (email: string, password: string): Promise<{ token: string; role: AdminRole }> => {
  await new Promise(r => setTimeout(r, 600));

  const emailLc = email.trim().toLowerCase();

  if (emailLc === 'admin@risebet.com' && password === 'admin123') {
    const role: AdminRole = 'superadmin';
    const token = fakeJwt({ sub: 'admin-0', email: emailLc, role });
    setToken(token);
    setRole(role);
    return { token, role };
  }

  if (emailLc === 'moderator@risebet.com' && password === 'mod123') {
    const role: AdminRole = 'admin';
    const token = fakeJwt({ sub: 'admin-1', email: emailLc, role });
    setToken(token);
    setRole(role);
    return { token, role };
  }

  throw new Error('Invalid email or password');
};

export interface UseAuthReturn {
  token: string | null;
  role: AdminRole | null;
  authenticated: boolean;
  login: (email: string, password: string) => Promise<{ token: string; role: AdminRole }>;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const token = typeof window !== 'undefined' ? getToken() : null;
  const role = typeof window !== 'undefined' ? getRole() : null;
  return {
    token,
    role,
    authenticated: !!token,
    login: mockLogin,
    logout,
  };
};

export default useAuth;
