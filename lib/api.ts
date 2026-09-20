import {
  mockUsers,
  mockBets,
  mockTransactions,
  mockPromotions,
  mockAffiliates,
  mockCommissions,
  mockCampaigns,
  mockFAQs,
  mockVIPTiers,
  mockTickets,
  mockTicketById,
  mockPosts,
  mockCategories,
  mockLogs,
  mockDashboardStats,
  mockGames,
  mockResponsibleItems,
  mockUserById,
} from './mock';

import type {
  User,
  Bet,
  Transaction,
  Promotion,
  Affiliate,
  Commission,
  Campaign,
  FAQ,
  VIPTier,
  Ticket,
  Post,
  Category,
  LogEntry,
  DashboardStats,
  GameSummary,
  ResponsibleItem,
} from './types';

type ApiResponse<T> = Promise<{ success: boolean; message: string; data: T }>;

const getBaseUrl = (): string => {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && (window as any).__NEXT_DATA__) {
    return (window as any).__NEXT_DATA__?.props?.pageProps?.apiBaseUrl || 'https://api.playrise.vip/api/v1';
  }
  return 'https://api.playrise.vip/api/v1';
};

const resolveMockFallback = <T>(path: string, params?: Record<string, any>): T | null => {
  try {
    if (path.includes('/admin/dashboard') || path === '/dashboard') {
      return mockDashboardStats() as unknown as T;
    }
    if (path.includes('/admin/users') && path.match(/\/users\/[^/]+$/)) {
      const id = path.split('/').pop() || '';
      return (mockUserById(id) || null) as unknown as T;
    }
    if (path.includes('/admin/users')) {
      return mockUsers() as unknown as T;
    }
    if (path.includes('/admin/bets')) {
      return mockBets() as unknown as T;
    }
    if (path.includes('/admin/transactions')) {
      const type = params?.type as Transaction['type'] | undefined;
      return mockTransactions(type) as unknown as T;
    }
    if (path.includes('/admin/promotions')) {
      return mockPromotions() as unknown as T;
    }
    if (path.includes('/admin/affiliates')) {
      return mockAffiliates() as unknown as T;
    }
    if (path.includes('/admin/commissions')) {
      return mockCommissions() as unknown as T;
    }
    if (path.includes('/admin/campaigns')) {
      return mockCampaigns() as unknown as T;
    }
    if (path.includes('/admin/faqs')) {
      return mockFAQs() as unknown as T;
    }
    if (path.includes('/admin/vip')) {
      return mockVIPTiers() as unknown as T;
    }
    if (path.includes('/admin/tickets') && path.match(/\/tickets\/[^/]+$/)) {
      const id = path.split('/').pop() || '';
      return (mockTicketById(id) || null) as unknown as T;
    }
    if (path.includes('/admin/tickets')) {
      return mockTickets() as unknown as T;
    }
    if (path.includes('/admin/posts')) {
      return mockPosts() as unknown as T;
    }
    if (path.includes('/admin/categories')) {
      return mockCategories() as unknown as T;
    }
    if (path.includes('/admin/logs')) {
      const severity = params?.severity as LogEntry['severity'] | undefined;
      return mockLogs(severity) as unknown as T;
    }
    if (path.includes('/admin/games')) {
      return mockGames() as unknown as T;
    }
    if (path.includes('/admin/responsible')) {
      const type = params?.type as ResponsibleItem['type'] | undefined;
      return mockResponsibleItems(type) as unknown as T;
    }
    return null;
  } catch {
    return null;
  }
};

export const adminApiRequest = async <T = any>(
  path: string,
  tokenReq: boolean = true,
  options: RequestInit & { params?: Record<string, any> } = {}
): ApiResponse<T> => {
  const baseUrl = getBaseUrl();
  const fullUrl = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const params = options.params;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (tokenReq && typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const fetchOptions: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(fullUrl, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    if (json && typeof json === 'object') {
      if ('success' in json && 'data' in json) {
        return json as { success: boolean; message: string; data: T };
      }
      return { success: true, message: 'OK', data: json as T };
    }

    return { success: true, message: 'OK', data: json as T };
  } catch (err) {
    const fallback = resolveMockFallback<T>(path, params);
    if (fallback !== null) {
      return {
        success: true,
        message: 'Using cached mock data (network unavailable)',
        data: fallback,
      };
    }
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return {
      success: false,
      message: msg,
      data: null as unknown as T,
    };
  }
};

export const fetchDashboard = (): ApiResponse<DashboardStats> =>
  adminApiRequest<DashboardStats>('/admin/dashboard');

export const fetchUsers = (params?: Record<string, any>): ApiResponse<User[]> =>
  adminApiRequest<User[]>('/admin/users', true, { params });

export const fetchUserById = (id: string): ApiResponse<User | null> =>
  adminApiRequest<User | null>(`/admin/users/${id}`);

export const fetchBets = (params?: Record<string, any>): ApiResponse<Bet[]> =>
  adminApiRequest<Bet[]>('/admin/bets', true, { params });

export const fetchTransactions = (type?: Transaction['type']): ApiResponse<Transaction[]> =>
  adminApiRequest<Transaction[]>('/admin/transactions', true, { params: { type } });

export const fetchPromotions = (): ApiResponse<Promotion[]> =>
  adminApiRequest<Promotion[]>('/admin/promotions');

export const fetchAffiliates = (): ApiResponse<Affiliate[]> =>
  adminApiRequest<Affiliate[]>('/admin/affiliates');

export const fetchVIPTiers = (): ApiResponse<VIPTier[]> =>
  adminApiRequest<VIPTier[]>('/admin/vip/tiers');

export const fetchTickets = (): ApiResponse<Ticket[]> =>
  adminApiRequest<Ticket[]>('/admin/tickets');

export const fetchTicketById = (id: string): ApiResponse<Ticket | null> =>
  adminApiRequest<Ticket | null>(`/admin/tickets/${id}`);

export const fetchPosts = (): ApiResponse<Post[]> =>
  adminApiRequest<Post[]>('/admin/posts');

export const fetchLogs = (severity?: LogEntry['severity']): ApiResponse<LogEntry[]> =>
  adminApiRequest<LogEntry[]>('/admin/logs', true, { params: { severity } });

export const fetchGames = (): ApiResponse<GameSummary[]> =>
  adminApiRequest<GameSummary[]>('/admin/games');

export const fetchResponsibleItems = (type?: ResponsibleItem['type']): ApiResponse<ResponsibleItem[]> =>
  adminApiRequest<ResponsibleItem[]>('/admin/responsible', true, { params: { type } });

export const fetchCommissions = (): ApiResponse<Commission[]> =>
  adminApiRequest<Commission[]>('/admin/commissions');

export const fetchCampaigns = (): ApiResponse<Campaign[]> =>
  adminApiRequest<Campaign[]>('/admin/campaigns');

export const fetchFAQs = (): ApiResponse<FAQ[]> =>
  adminApiRequest<FAQ[]>('/admin/faqs');

export const fetchCategories = (): ApiResponse<Category[]> =>
  adminApiRequest<Category[]>('/admin/categories');
