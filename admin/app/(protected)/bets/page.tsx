'use client';

import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  Search,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  X,
  Calendar,
  User,
} from 'lucide-react';

import { GlassCard, GlassHeader } from '@/components/ui/GlassCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Skeleton, SkeletonRows } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

import { fetchBets } from '@/lib/api';
import type { Bet } from '@/lib/types';
import {
  formatNumber,
  formatCurrency,
  relativeTime,
  cn,
} from '@/lib/utils';

const GAME_CATEGORY_MAP: Record<string, { label: string; variant: 'success' | 'info' | 'warning' | 'default' | 'pill' }> = {
  slot: { label: 'Slots', variant: 'default' },
  slots: { label: 'Slots', variant: 'default' },
  table: { label: 'Table', variant: 'info' },
  live: { label: 'Live', variant: 'warning' },
  crash: { label: 'Crash', variant: 'success' },
  dice: { label: 'Dice', variant: 'pill' },
  sports: { label: 'Sports', variant: 'info' },
  virtuals: { label: 'Virtuals', variant: 'warning' },
  other: { label: 'Other', variant: 'pill' },
};

const GAME_TYPE_OPTIONS = [
  { value: '', label: 'All Game Types' },
  { value: 'slot', label: 'Slots' },
  { value: 'table', label: 'Table Games' },
  { value: 'live', label: 'Live Casino' },
  { value: 'crash', label: 'Crash' },
  { value: 'dice', label: 'Dice' },
  { value: 'sports', label: 'Sports' },
  { value: 'virtuals', label: 'Virtuals' },
  { value: 'other', label: 'Other' },
];

const RESULT_OPTIONS = [
  { value: '', label: 'All Results' },
  { value: 'win', label: 'Win' },
  { value: 'loss', label: 'Loss' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PAGE_SIZE = 12;

export default function BetsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userSearch, setUserSearch] = useState<string>('');
  const [gameTypeFilter, setGameTypeFilter] = useState<string>('');
  const [resultFilter, setResultFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBets();
      if (!res.success) {
        throw new Error(res.message || 'Failed to load bets');
      }
      setBets(res.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error loading bets';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, userSearch, gameTypeFilter, resultFilter, dateFrom, dateTo]);

  const filteredBets = useMemo(() => {
    return bets.filter((bet) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchId = bet.id.toLowerCase().includes(q);
        const matchGame = bet.gameType.toLowerCase().includes(q);
        const matchGameId = (bet.gameId || '').toLowerCase().includes(q);
        if (!matchId && !matchGame && !matchGameId) return false;
      }
      if (userSearch) {
        const q = userSearch.toLowerCase();
        const matchName = (bet.username || '').toLowerCase().includes(q);
        const matchUserId = bet.userId.toLowerCase().includes(q);
        if (!matchName && !matchUserId) return false;
      }
      if (gameTypeFilter && bet.gameType !== gameTypeFilter) return false;
      if (resultFilter && bet.result !== resultFilter) return false;
      if (dateFrom) {
        const betDate = new Date(bet.timestamp).getTime();
        const fromDate = new Date(dateFrom).getTime();
        if (betDate < fromDate) return false;
      }
      if (dateTo) {
        const betDate = new Date(bet.timestamp).getTime();
        const toDate = new Date(dateTo + 'T23:59:59').getTime();
        if (betDate > toDate) return false;
      }
      return true;
    });
  }, [bets, searchQuery, userSearch, gameTypeFilter, resultFilter, dateFrom, dateTo]);

  const handleRetry = () => {
    void loadData();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setUserSearch('');
    setGameTypeFilter('');
    setResultFilter('');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = searchQuery || userSearch || gameTypeFilter || resultFilter || dateFrom || dateTo;

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

  const columns: Column<Bet>[] = useMemo(
    () => [
      {
        key: 'game',
        header: 'Game',
        cell: (row) => (
          <div className="flex flex-col gap-1">
            {gameCategoryBadge(row.gameType)}
            <span className="text-xs text-muted truncate max-w-[140px]">
              {row.gameId || '—'}
            </span>
          </div>
        ),
      },
      {
        key: 'user',
        header: 'User',
        cell: (row) => (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-xs font-bold text-gold shrink-0">
              {avatarInitials(row.username || row.userId)}
            </div>
            <div className="min-w-0">
              <span className="text-white/90 truncate block">{row.username || row.userId}</span>
              <span className="text-[10px] text-muted truncate block">{row.currency}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'amount',
        header: 'Amount',
        className: 'text-right',
        cell: (row) => (
          <span className="text-white/90 font-medium">
            {formatCurrency(row.amount)}
          </span>
        ),
      },
      {
        key: 'multiplier',
        header: 'Multiplier',
        className: 'text-center',
        cell: (row) => (
          <span
            className={cn(
              'font-semibold',
              (row.multiplier ?? 0) >= 2
                ? 'text-success'
                : (row.multiplier ?? 0) > 1
                ? 'text-gold'
                : 'text-muted'
            )}
          >
            {(row.multiplier ?? 0).toFixed(2)}x
          </span>
        ),
      },
      {
        key: 'result',
        header: 'Result',
        className: 'text-center',
        cell: (row) => resultBadge(row.result),
      },
      {
        key: 'profitLoss',
        header: 'P/L',
        className: 'text-right',
        cell: (row) => (
          <div
            className={cn(
              'inline-flex items-center gap-0.5 font-semibold',
              row.profitLoss > 0
                ? 'text-success'
                : row.profitLoss < 0
                ? 'text-danger'
                : 'text-muted'
            )}
          >
            {row.profitLoss > 0 ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : row.profitLoss < 0 ? (
              <ArrowDownRight className="w-3.5 h-3.5" />
            ) : null}
            <span>
              {row.profitLoss === 0 ? '—' : formatCurrency(Math.abs(row.profitLoss))}
            </span>
          </div>
        ),
      },
      {
        key: 'timestamp',
        header: 'Time',
        className: 'text-right',
        cell: (row) => (
          <span className="text-muted text-xs">{relativeTime(row.timestamp)}</span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent gold-text">
            Bets
          </h1>
          <p className="mt-1.5 text-muted text-sm sm:text-base">
            Review and manage all player bets placed across the platform.
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
          <Button
            variant="outline"
            size="md"
            leftIcon={<Filter className="w-4 h-4" />}
            onClick={() => setShowFilters((s) => !s)}
          >
            {showFilters ? 'Hide Filters' : 'Filters'}
            {hasActiveFilters && (
              <Badge variant="gold" size="sm" className="ml-1">
                {[searchQuery, userSearch, gameTypeFilter, resultFilter, dateFrom || dateTo]
                  .filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <GlassCard className="p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <Input
              placeholder="Search bet ID, game type or game ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <Input
              placeholder="Search username or user ID..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Select
              label="Game Type"
              value={gameTypeFilter}
              onChange={(e) => setGameTypeFilter(e.target.value)}
            >
              {GAME_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
            <Select
              label="Result"
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
            >
              {RESULT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
            <Input
              label="Date From"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <Input
              label="Date To"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        )}

        {hasActiveFilters && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted">Active filters:</span>
            {searchQuery && (
              <Badge variant="pill" size="sm">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')} className="ml-1.5 hover:text-white">
                  <X className="w-3 h-3 inline" />
                </button>
              </Badge>
            )}
            {userSearch && (
              <Badge variant="pill" size="sm">
                User: {userSearch}
                <button onClick={() => setUserSearch('')} className="ml-1.5 hover:text-white">
                  <X className="w-3 h-3 inline" />
                </button>
              </Badge>
            )}
            {gameTypeFilter && (
              <Badge variant="pill" size="sm">
                Type: {GAME_CATEGORY_MAP[gameTypeFilter]?.label || gameTypeFilter}
                <button onClick={() => setGameTypeFilter('')} className="ml-1.5 hover:text-white">
                  <X className="w-3 h-3 inline" />
                </button>
              </Badge>
            )}
            {resultFilter && (
              <Badge variant="pill" size="sm">
                Result: {resultFilter.toUpperCase()}
                <button onClick={() => setResultFilter('')} className="ml-1.5 hover:text-white">
                  <X className="w-3 h-3 inline" />
                </button>
              </Badge>
            )}
            {(dateFrom || dateTo) && (
              <Badge variant="pill" size="sm">
                <Calendar className="w-3 h-3 inline mr-1" />
                {dateFrom || '...'} → {dateTo || '...'}
                <button
                  onClick={() => {
                    setDateFrom('');
                    setDateTo('');
                  }}
                  className="ml-1.5 hover:text-white"
                >
                  <X className="w-3 h-3 inline" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="ml-auto"
            >
              Clear all
            </Button>
          </div>
        )}
      </GlassCard>

      {error && (
        <GlassCard className="border-danger/40">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-danger/15 flex items-center justify-center shrink-0">
                <Filter className="w-5.5 h-5.5 text-danger" />
              </div>
              <div className="min-w-0">
                <h4 className="text-white font-semibold">Failed to load bets</h4>
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

      {loading ? (
        <div className="glass-card overflow-hidden">
          <div className="flex items-start justify-between p-5 border-b border-border gap-4 flex-wrap">
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <SkeletonRows count={8} columns={7} />
          <div className="flex items-center justify-between p-4 border-t border-border flex-wrap gap-3">
            <Skeleton className="h-4 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        </div>
      ) : filteredBets.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'No bets match filters' : 'No bets yet'}
          description={
            hasActiveFilters
              ? 'Try adjusting or clearing your search filters.'
              : 'When users place bets, they will appear here.'
          }
          action={hasActiveFilters ? { text: 'Clear filters', onClick: handleClearFilters } : undefined}
        />
      ) : (
        <DataTable<Bet>
          columns={columns}
          data={filteredBets}
          loading={false}
          rowKey={(row) => row.id}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          title={`All Bets (${formatNumber(filteredBets.length)})`}
        />
      )}
    </div>
  );
}
