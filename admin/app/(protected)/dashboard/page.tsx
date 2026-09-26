'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  Coins,
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  UsersRound,
  Target,
  Gift,
  Headphones,
  RefreshCw,
  ChevronRight,
  AlertTriangle,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

import { GlassCard, GlassHeader } from '@/components/ui/GlassCard';
import { StatCard } from '@/components/ui/StatCard';
import { Skeleton, SkeletonStatCards, SkeletonRows } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChartLine, ChartBar } from '@/components/charts';

import { fetchDashboard, fetchBets, fetchUsers } from '@/lib/api';
import type { DashboardStats, Bet, User } from '@/lib/types';
import {
  formatNumber,
  formatCurrency,
  relativeTime,
  mockDailyRevenue,
  mockGamePopularity,
  cn,
} from '@/lib/utils';

interface TopWinner {
  rank: number;
  username: string;
  game: string;
  amount: number;
  collected: boolean;
}

const GAME_CATEGORY_MAP: Record<string, { label: string; variant: 'success' | 'info' | 'warning' | 'default' | 'pill' }> = {
  slot: { label: 'Slots', variant: 'default' },
  table: { label: 'Table', variant: 'info' },
  live: { label: 'Live', variant: 'warning' },
  crash: { label: 'Crash', variant: 'success' },
  dice: { label: 'Dice', variant: 'pill' },
  sports: { label: 'Sports', variant: 'info' },
  virtuals: { label: 'Virtuals', variant: 'warning' },
};

const mockTopWinners = (): TopWinner[] => [
  { rank: 1, username: 'CryptoKing', game: 'Gates of Olympus', amount: 24850.75, collected: true },
  { rank: 2, username: 'HighRoller99', game: 'Baccarat Pro', amount: 18230.40, collected: true },
  { rank: 3, username: 'LuckyDragon', game: 'Sweet Bonanza', amount: 12100.00, collected: true },
  { rank: 4, username: 'BlackjackPro', game: 'Blackjack Classic', amount: 9870.55, collected: true },
  { rank: 5, username: 'JackpotHunter', game: 'Aviator', amount: 7420.20, collected: true },
];

const DASHBOARD_STATS_DELTAS = {
  totalUsers: 12.4,
  activeUsersToday: 5.2,
  totalBets24h: -3.1,
  totalWagered24h: 8.7,
  netRevenue24h: 18.2,
  pendingWithdrawalsCount: -2.3,
  deposits24hCount: 14.9,
};

export default function DashboardPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [topWinners] = useState<TopWinner[]>(mockTopWinners());
  const [dailyRevenue] = useState(mockDailyRevenue());
  const [gamePopularity] = useState(mockGamePopularity());

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, betsRes, usersRes] = await Promise.all([
        fetchDashboard(),
        fetchBets({ limit: 8 }),
        fetchUsers({ limit: 5 }),
      ]);

      if (!statsRes.success) {
        throw new Error(statsRes.message || 'Failed to load dashboard stats');
      }

      setStats(statsRes.data);
      setBets(betsRes.success ? (betsRes.data || []) : []);
      setUsers(usersRes.success ? (usersRes.data || []) : []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error loading dashboard';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRetry = () => {
    void loadData();
  };

  const resultBadge = (result: Bet['result']) => {
    switch (result) {
      case 'win':
        return <Badge variant="success">WIN</Badge>;
      case 'loss':
        return <Badge variant="danger">LOSS</Badge>;
      case 'pending':
        return <Badge variant="muted">PENDING</Badge>;
      case 'cancelled':
        return <Badge variant="muted">CANCELLED</Badge>;
    }
  };

  const gameCategoryBadge = (gameType: string) => {
    const cat = GAME_CATEGORY_MAP[gameType] || { label: gameType, variant: 'pill' as const };
    return <Badge variant={cat.variant}>{cat.label}</Badge>;
  };

  const avatarInitials = (name: string) =>
    name.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent gold-text">
            Dashboard
          </h1>
          <p className="mt-1.5 text-muted text-sm sm:text-base">
            Welcome back, here&apos;s what&apos;s happening across RiseBet today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="default"
            size="md"
            leftIcon={<RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />}
            onClick={handleRetry}
            disabled={loading}
          >
            Refresh
          </Button>
          <Link href="/promotions" className="inline-flex">
            <Button
              variant="outline"
              size="md"
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Go to Promotions
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <GlassCard className="border-danger/40">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-danger/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5.5 h-5.5 text-danger" />
              </div>
              <div className="min-w-0">
                <h4 className="text-white font-semibold">Failed to load dashboard</h4>
                <p className="text-muted text-sm mt-0.5 truncate">{error}</p>
              </div>
            </div>
            <Button
              variant="default"
              size="md"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={handleRetry}
            >
              Retry
            </Button>
          </div>
        </GlassCard>
      )}

      {loading && !stats ? (
        <SkeletonStatCards count={7} />
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
          <StatCard
            icon={Users}
            title="Total Users"
            value={formatNumber(stats.totalUsers)}
            delta={DASHBOARD_STATS_DELTAS.totalUsers}
          />
          <StatCard
            icon={UsersRound}
            title="Active Today"
            value={formatNumber(stats.activeUsersToday)}
            delta={DASHBOARD_STATS_DELTAS.activeUsersToday}
          />
          <StatCard
            icon={Target}
            title="Bets 24h"
            value={formatNumber(stats.totalBets24h)}
            delta={DASHBOARD_STATS_DELTAS.totalBets24h}
          />
          <StatCard
            icon={Coins}
            title="Wagered 24h"
            value={'$' + formatNumber(stats.totalWagered24h)}
            delta={DASHBOARD_STATS_DELTAS.totalWagered24h}
          />
          <StatCard
            icon={TrendingUp}
            title="Net Revenue 24h"
            value={'$' + formatNumber(stats.netRevenue24h)}
            delta={DASHBOARD_STATS_DELTAS.netRevenue24h}
            accent
          />
          <StatCard
            icon={Wallet}
            title="Pending Withdrawals"
            value={formatNumber(stats.pendingWithdrawalsCount)}
            delta={DASHBOARD_STATS_DELTAS.pendingWithdrawalsCount}
          />
          <StatCard
            icon={Receipt}
            title="Deposits 24h"
            value={formatNumber(stats.deposits24hCount)}
            delta={DASHBOARD_STATS_DELTAS.deposits24hCount}
          />
        </div>
      ) : null}

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <GlassCard className="lg:col-span-2">
          <GlassHeader>
          <div>
            <h3 className="text-white font-semibold text-base">Daily Revenue (7 days)</h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">All games · USD equivalent</p>
          </div>
          </GlassHeader>
          <div className="p-4 sm:p-5">
            <ChartLine
              data={dailyRevenue}
              xKey="date"
              series={[
                { key: 'revenue', label: 'Revenue', stroke: '#D4AF37', strokeWidth: 3 },
                { key: 'profit', label: 'Profit', stroke: '#10b981', strokeWidth: 2.5 },
              ]}
              height={300}
            />
          </div>
        </GlassCard>

        <GlassCard>
          <GlassHeader>
            <div>
              <h3 className="text-white font-semibold text-base">Game Popularity (24h)</h3>
              <p className="text-muted text-xs sm:text-sm mt-0.5">Bets per game</p>
            </div>
          </GlassHeader>
          <div className="p-4 sm:p-5">
            <ChartBar
              data={gamePopularity}
              xKey="name"
              series={[
                { key: 'value', label: 'Bets', fill: 'gold-gradient' },
              ]}
              height={300}
            />
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <GlassCard>
          <GlassHeader>
            <div>
              <h3 className="text-white font-semibold text-base">🏆 Top Winners</h3>
              <p className="text-muted text-xs sm:text-sm mt-0.5">Last 24h</p>
            </div>
          </GlassHeader>
          <div className="divide-y divide-border/40">
            {topWinners.map((w) => (
              <div
                key={w.rank}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02]"
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    w.rank === 1 && 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-background',
                    w.rank === 2 && 'bg-gradient-to-br from-slate-200 to-slate-400 text-background',
                    w.rank === 3 && 'bg-gradient-to-br from-amber-600 to-amber-800 text-white',
                    w.rank > 3 && 'bg-card text-muted'
                  )}
                >
                  {w.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white font-medium truncate">{w.username}</p>
                  <p className="text-xs text-muted truncate">{w.game}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-success">{formatCurrency(w.amount)}</p>
                  <div className="mt-0.5"><Badge variant="success">Collected</Badge></div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <GlassHeader
            action={
              <Link href="/bets" className="inline-flex">
                <Button variant="ghost" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  View all
                </Button>
              </Link>
            }
          >
            <div>
              <h3 className="text-white font-semibold text-base">Recent Bets</h3>
              <p className="text-muted text-xs sm:text-sm mt-0.5">Latest placed bets across all games</p>
            </div>
          </GlassHeader>
          {loading && !bets.length ? (
            <SkeletonRows count={6} columns={6} />
          ) : bets.length === 0 ? (
            <EmptyState
              title="No bets yet"
              description="When users place bets, they will appear here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-card/30">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Game</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">User</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Amount</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">Multiplier</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">Result</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">P/L</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {bets.slice(0, 8).map((bet) => (
                    <tr key={bet.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {gameCategoryBadge(bet.gameType)}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-xs font-bold text-gold shrink-0">
                            {avatarInitials(bet.username || bet.userId)}
                          </div>
                          <span className="text-white/90 truncate">{bet.username || bet.userId}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap text-white/90 font-medium">
                        {formatCurrency(bet.amount)}
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        <span className={cn(
                          'font-semibold',
                          (bet.multiplier ?? 0) >= 2 ? 'text-success' : (bet.multiplier ?? 0) > 1 ? 'text-gold' : 'text-muted'
                        )}>
                          {(bet.multiplier ?? 0).toFixed(2)}x
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        {resultBadge(bet.result)}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className={cn(
                          'inline-flex items-center gap-0.5 font-semibold',
                          bet.profitLoss > 0 ? 'text-success' : bet.profitLoss < 0 ? 'text-danger' : 'text-muted'
                        )}>
                          {bet.profitLoss > 0 ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : bet.profitLoss < 0 ? (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          ) : null}
                          <span>
                            {bet.profitLoss === 0 ? '—' : formatCurrency(Math.abs(bet.profitLoss))}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap text-muted text-xs">
                        {relativeTime(bet.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-4 gap-4 mt-6">
        <Link href="/users" className="block">
          <GlassCard hoverable className="h-full">
            <div className="p-5 h-full flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0 text-gold">
                <Users className="w-5.5 h-5.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold">Manage Users</h4>
                <p className="text-muted text-sm mt-0.5">View, edit, and manage player accounts</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted shrink-0" />
            </div>
          </GlassCard>
        </Link>

        <Link href="/transactions" className="block">
          <GlassCard hoverable className="h-full">
            <div className="p-5 h-full flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-info/15 border border-info/30 flex items-center justify-center shrink-0 text-info">
                <Receipt className="w-5.5 h-5.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold">Review Transactions</h4>
                <p className="text-muted text-sm mt-0.5">Deposits, withdrawals and adjustments</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted shrink-0" />
            </div>
          </GlassCard>
        </Link>

        <Link href="/promotions" className="block">
          <GlassCard hoverable className="h-full">
            <div className="p-5 h-full flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/15 border border-success/30 flex items-center justify-center shrink-0 text-success">
                <Gift className="w-5.5 h-5.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold">Create Promotion</h4>
                <p className="text-muted text-sm mt-0.5">Bonuses, freespins, raffles and more</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted shrink-0" />
            </div>
          </GlassCard>
        </Link>

        <Link href="/support" className="block">
          <GlassCard hoverable className="h-full">
            <div className="p-5 h-full flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/15 border border-warning/30 flex items-center justify-center shrink-0 text-warning">
                <Headphones className="w-5.5 h-5.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold">Support Queue</h4>
                <p className="text-muted text-sm mt-0.5">Open tickets and player inquiries</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted shrink-0" />
            </div>
          </GlassCard>
        </Link>
      </div>
    </div>
  );
}
