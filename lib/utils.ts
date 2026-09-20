import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (!isFinite(n)) return '0';
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return Math.floor(n).toString();
}

export function formatCurrency(n: number, currency: string = '$'): string {
  if (!isFinite(n)) return currency + '0.00';
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (n < 0 ? '-' : '') + currency + formatted;
}

export function relativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`;
    if (diffDay < 365) return `${Math.floor(diffDay / 30)}mo ago`;
    return `${Math.floor(diffDay / 365)}y ago`;
  } catch {
    return dateStr;
  }
}

export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export interface DailyRevenuePoint {
  date: string;
  revenue: number;
  profit: number;
}

export function mockDailyRevenue(): DailyRevenuePoint[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const ordered = [...days.slice(dayOfWeek === 0 ? 6 : dayOfWeek - 1), ...days.slice(0, dayOfWeek === 0 ? 6 : dayOfWeek - 1)];

  const baseRevenue = 180000;
  const baseProfit = 28000;

  return ordered.slice(-7).map((day, i) => {
    const variation = 0.75 + (i * 0.07) + Math.random() * 0.35;
    const revenue = Math.round(baseRevenue * variation);
    const profitRatio = 0.12 + (Math.random() * 0.08);
    const profit = Math.round(revenue * profitRatio);
    return { date: day, revenue, profit };
  });
}

export interface GamePopularityPoint {
  name: string;
  value: number;
}

export function mockGamePopularity(): GamePopularityPoint[] {
  return [
    { name: 'Baccarat', value: 4820 },
    { name: 'Blackjack', value: 3945 },
    { name: 'Crash', value: 6210 },
    { name: 'Mines', value: 3105 },
    { name: 'Limbo', value: 2480 },
    { name: 'Dice', value: 4115 },
  ];
}
