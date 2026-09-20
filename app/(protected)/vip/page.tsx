'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Crown,
  RefreshCw,
  AlertTriangle,
  Plus,
  Edit3,
  Coins,
  TrendingUp,
  Gift,
  CheckCircle2,
  Users,
  Target,
  Zap,
  Sparkles,
  Star,
  Award,
  ArrowUp,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { GlassCard, GlassHeader } from '@/components/ui/GlassCard';
import { SkeletonRows } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { DataTable, type Column } from '@/components/ui/DataTable';

import { fetchVIPTiers } from '@/lib/api';
import type { VIPTier } from '@/lib/types';
import { formatNumber, formatCurrency, cn } from '@/lib/utils';

interface WatchlistUser {
  id: string;
  username: string;
  currentVipLevel: number;
  currentVipName: string;
  nextVipLevel: number;
  nextVipName: string;
  wageringSoFar: number;
  wageringNeeded: number;
  remaining: number;
  progress: number;
}

interface TierForm {
  level: string;
  name: string;
  minWagering: string;
  cashbackPercent: string;
  rakebackPercent: string;
  weeklyBonus: string;
  perksText: string;
}

const emptyTierForm: TierForm = {
  level: '',
  name: '',
  minWagering: '',
  cashbackPercent: '',
  rakebackPercent: '',
  weeklyBonus: '',
  perksText: '',
};

const TIER_GRADIENTS: Record<number, string> = {
  0: 'from-amber-700/30 via-amber-600/20 to-amber-800/30',
  1: 'from-slate-400/30 via-slate-300/20 to-slate-500/30',
  2: 'from-slate-400/30 via-slate-300/20 to-slate-500/30',
  3: 'from-yellow-500/30 via-amber-400/20 to-yellow-600/30',
  4: 'from-yellow-500/30 via-amber-400/20 to-yellow-600/30',
  5: 'from-cyan-400/30 via-slate-300/20 to-sky-500/30',
  6: 'from-cyan-400/30 via-slate-300/20 to-sky-500/30',
  7: 'from-sky-400/30 via-blue-400/20 to-indigo-500/30',
  8: 'from-sky-400/30 via-blue-400/20 to-indigo-500/30',
  9: 'from-zinc-800/50 via-zinc-700/30 to-zinc-900/50',
  10: 'from-zinc-800/50 via-zinc-700/30 to-zinc-900/50',
};

const TIER_BADGE: Record<number, 'default' | 'pill' | 'gold' | 'info' | 'muted'> = {
  0: 'default',
  1: 'pill',
  2: 'pill',
  3: 'gold',
  4: 'gold',
  5: 'info',
  6: 'info',
  7: 'info',
  8: 'info',
  9: 'muted',
  10: 'muted',
};

const mockWatchlist = (tiers: VIPTier[]): WatchlistUser[] => {
  const sorted = [...tiers].sort((a, b) => a.level - b.level);
  const usernames = ['ShadowHunter', 'NightRider', 'DiamondKing', 'PlatinumQueen', 'StormBreaker', 'PhoenixRising', 'LuckyStrike', 'GoldenEagle', 'SilverWolf', 'RoyalFlush'];
  return usernames.map((u, i) => {
    const tierIdx = Math.min(Math.floor(i / 2), sorted.length - 2);
    const current = sorted[tierIdx];
    const next = sorted[Math.min(tierIdx + 1, sorted.length - 1)];
    const range = next.minWagering - current.minWagering;
    const progressRatio = 0.7 + Math.random() * 0.25;
    const soFar = current.minWagering + Math.round(range * progressRatio);
    const remaining = Math.max(0, next.minWagering - soFar);
    return {
      id: `wl-${i + 1}`,
      username: u,
      currentVipLevel: current.level,
      currentVipName: current.name,
      nextVipLevel: next.level,
      nextVipName: next.name,
      wageringSoFar: soFar,
      wageringNeeded: next.minWagering,
      remaining,
      progress: Math.min(99, Math.round(((soFar - current.minWagering) / Math.max(1, range)) * 100)),
    };
  });
};

export default function VIPPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tiers, setTiers] = useState<VIPTier[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistUser[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<VIPTier | null>(null);
  const [form, setForm] = useState<TierForm>(emptyTierForm);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchVIPTiers();
      if (!res.success) throw new Error(res.message || 'Failed to load VIP tiers');
      const t = res.data || [];
      setTiers(t);
      setWatchlist(mockWatchlist(t));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error loading VIP program';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleRetry = () => {
    void loadData();
  };

  const openAdd = () => {
    const maxLevel = tiers.reduce((m, t) => Math.max(m, t.level), -1);
    setEditing(null);
    setForm({ ...emptyTierForm, level: String(maxLevel + 1) });
    setModalOpen(true);
  };

  const openEdit = (t: VIPTier) => {
    setEditing(t);
    setForm({
      level: String(t.level),
      name: t.name,
      minWagering: String(t.minWagering),
      cashbackPercent: String(t.cashbackPercent),
      rakebackPercent: String(t.rakebackPercent),
      weeklyBonus: String(t.weeklyBonus),
      perksText: t.perks.join('\n'),
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('Tier name is required');
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const perks = form.perksText.split('\n').map((p) => p.trim()).filter(Boolean);
      if (editing) {
        setTiers((prev) =>
          prev.map((t) =>
            t.id === editing.id
              ? {
                  ...t,
                  level: Number(form.level) || t.level,
                  name: form.name,
                  minWagering: Number(form.minWagering) || 0,
                  cashbackPercent: Number(form.cashbackPercent) || 0,
                  rakebackPercent: Number(form.rakebackPercent) || 0,
                  weeklyBonus: Number(form.weeklyBonus) || 0,
                  perks,
                }
              : t
          )
        );
        toast.success(`Tier "${form.name}" updated`);
      } else {
        const newTier: VIPTier = {
          id: `vip-new-${Date.now()}`,
          level: Number(form.level) || 0,
          name: form.name,
          minWagering: Number(form.minWagering) || 0,
          cashbackPercent: Number(form.cashbackPercent) || 0,
          rakebackPercent: Number(form.rakebackPercent) || 0,
          weeklyBonus: Number(form.weeklyBonus) || 0,
          perks,
          usersCount: 0,
          totalWagered: 0,
        };
        setTiers((prev) => [...prev, newTier].sort((a, b) => a.level - b.level));
        toast.success(`Tier "${form.name}" created`);
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save tier');
    } finally {
      setSubmitting(false);
    }
  };

  const sortedTiers = [...tiers].sort((a, b) => a.level - b.level);
  const totalVIPUsers = tiers.reduce((s, t) => s + t.usersCount, 0);
  const totalVIPWagered = tiers.reduce((s, t) => s + t.totalWagered, 0);

  const watchlistColumns: Column<WatchlistUser>[] = [
    {
      key: 'username',
      header: 'User',
      cell: (row) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-xs font-bold text-gold shrink-0">
            {row.username.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-white/90 truncate font-medium">{row.username}</span>
        </div>
      ),
    },
    {
      key: 'currentVip',
      header: 'Current VIP',
      cell: (row) => (
        <Badge variant={TIER_BADGE[row.currentVipLevel] ?? 'default'}>
          Lv{row.currentVipLevel} · {row.currentVipName}
        </Badge>
      ),
    },
    {
      key: 'wageringSoFar',
      header: 'Wagering So Far',
      className: 'text-right',
      cell: (row) => (
        <div className="text-right">
          <div className="text-white font-medium">{formatCurrency(row.wageringSoFar)}</div>
          <div className="text-[10px] text-muted mt-0.5">/ {formatCurrency(row.wageringNeeded)}</div>
        </div>
      ),
    },
    {
      key: 'progress',
      header: 'Progress',
      className: 'min-w-[180px]',
      cell: (row) => (
        <div className="w-full max-w-[220px]">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-xs">
              <ArrowUp className="w-3 h-3 text-gold" />
              <span className="text-gold font-semibold">→ {row.nextVipName}</span>
            </div>
            <span className="text-xs font-semibold text-white">{row.progress}%</span>
          </div>
          <div className="w-full h-2 bg-card rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-gold-gradient rounded-full transition-all"
              style={{ width: `${row.progress}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'remaining',
      header: 'Remaining',
      className: 'text-right',
      cell: (row) => (
        <div className="text-right">
          <span className="text-warning font-semibold">{formatCurrency(row.remaining)}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent gold-text">
            VIP Program
          </h1>
          <p className="mt-1.5 text-muted text-sm sm:text-base">
            Configure loyalty tiers, benefits, and monitor players approaching the next level.
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
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />} onClick={openAdd}>
            Add Tier
          </Button>
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
                <h4 className="text-white font-semibold">Failed to load VIP program</h4>
                <p className="text-muted text-sm mt-0.5 truncate">{error}</p>
              </div>
            </div>
            <Button variant="default" size="md" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </GlassCard>
      )}

      {loading && tiers.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <GlassCard key={i} className="p-5 md:p-6">
              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="skeleton h-12 w-12 rounded-xl" />
                <div className="space-y-2">
                  <div className="skeleton h-3 w-24" />
                  <div className="skeleton h-6 w-full max-w-[120px]" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Crown} title="VIP Tiers" value={formatNumber(tiers.length)} />
          <StatCard icon={Users} title="VIP Members" value={formatNumber(totalVIPUsers)} delta={6.3} />
          <StatCard icon={TrendingUp} title="VIP Total Wagered" value={formatCurrency(totalVIPWagered)} delta={18.9} accent />
          <StatCard icon={Gift} title="Weekly Bonus Pool" value={formatCurrency(tiers.reduce((s, t) => s + t.weeklyBonus * Math.max(1, t.usersCount), 0))} />
        </div>
      )}

      <div>
        <div className="flex items-end justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              Loyalty Tiers
            </h3>
            <p className="text-muted text-sm mt-0.5">
              Level up based on lifetime wagering · each tier unlocks enhanced rewards
            </p>
          </div>
        </div>

        {loading && tiers.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <GlassCard key={i} className="p-5 md:p-6">
                <div className="space-y-3">
                  <div className="skeleton h-8 w-32" />
                  <div className="skeleton h-4 w-40" />
                  <div className="skeleton h-20 w-full rounded-lg" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="skeleton h-12 rounded-lg" />
                    <div className="skeleton h-12 rounded-lg" />
                    <div className="skeleton h-12 rounded-lg" />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : tiers.length === 0 ? (
          <EmptyState
            icon={Crown}
            title="No VIP tiers configured"
            description="Add your first loyalty tier to start building the VIP program."
            action={{ text: 'Add Tier', onClick: openAdd }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedTiers.map((t) => {
              const gradient = TIER_GRADIENTS[t.level] || TIER_GRADIENTS[0];
              const variant = TIER_BADGE[t.level] || 'default';
              return (
                <GlassCard
                  key={t.id}
                  hoverable
                  className={cn(
                    'relative overflow-hidden',
                    t.level >= 9 && 'ring-1 ring-gold/40'
                  )}
                >
                  <div className={cn('absolute inset-0 bg-gradient-to-br opacity-60 -z-0 pointer-events-none', gradient)} />
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                            t.level >= 9 ? 'bg-gold-gradient text-black' : 'bg-gold/20 text-gold border border-gold/30'
                          )}>
                            {t.level >= 9 ? (
                              <Award className="w-5 h-5" />
                            ) : t.level >= 5 ? (
                              <Star className="w-5 h-5" />
                            ) : (
                              <Crown className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <Badge variant={variant} size="sm">
                              Level {t.level}
                            </Badge>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white truncate">{t.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted">
                          <Target className="w-3 h-3" />
                          <span>Min wagering: <span className="text-white font-semibold">{formatCurrency(t.minWagering)}</span></span>
                        </div>
                      </div>
                      <button
                        onClick={() => openEdit(t)}
                        className="p-2 rounded-lg hover:bg-white/10 text-muted hover:text-gold transition-colors shrink-0"
                        title="Edit tier"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="rounded-lg bg-black/20 backdrop-blur-sm p-2.5 border border-white/5">
                        <div className="flex items-center gap-1 text-[10px] text-muted uppercase tracking-wide mb-1">
                          <TrendingUp className="w-3 h-3" />
                          Cashback
                        </div>
                        <div className="text-lg font-bold text-success">{t.cashbackPercent}%</div>
                      </div>
                      <div className="rounded-lg bg-black/20 backdrop-blur-sm p-2.5 border border-white/5">
                        <div className="flex items-center gap-1 text-[10px] text-muted uppercase tracking-wide mb-1">
                          <Zap className="w-3 h-3" />
                          Rakeback
                        </div>
                        <div className="text-lg font-bold text-info">{t.rakebackPercent}%</div>
                      </div>
                      <div className="rounded-lg bg-black/20 backdrop-blur-sm p-2.5 border border-white/5">
                        <div className="flex items-center gap-1 text-[10px] text-muted uppercase tracking-wide mb-1">
                          <Gift className="w-3 h-3" />
                          Weekly
                        </div>
                        <div className="text-lg font-bold text-gold">{formatCurrency(t.weeklyBonus)}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-white uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                        Perks
                      </div>
                      <ul className="space-y-1.5">
                        {t.perks.slice(0, 4).map((perk, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-gold mt-0.5 shrink-0">▸</span>
                            <span className="leading-snug">{perk}</span>
                          </li>
                        ))}
                        {t.perks.length > 4 && (
                          <li className="text-xs text-muted pl-4">+{t.perks.length - 4} more</li>
                        )}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[10px] text-muted uppercase tracking-wide mb-0.5">Members</div>
                        <div className="flex items-center gap-1.5 text-white font-semibold">
                          <Users className="w-3.5 h-3.5 text-muted" />
                          {formatNumber(t.usersCount)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted uppercase tracking-wide mb-0.5">Total Wagered</div>
                        <div className="flex items-center gap-1.5 text-white font-semibold text-right justify-end">
                          <Coins className="w-3.5 h-3.5 text-gold" />
                          {formatCurrency(t.totalWagered)}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      <GlassCard>
        <GlassHeader
          action={
            <div className="flex items-center gap-2 text-sm text-muted">
              <Users className="w-4 h-4 text-gold" />
              <span>{watchlist.length} users approaching upgrade</span>
            </div>
          }
        >
          <div>
            <h3 className="text-white font-semibold text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold" />
              Progress Watchlist
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">
              Players close to unlocking the next VIP tier — nudge them with bonuses
            </p>
          </div>
        </GlassHeader>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                {watchlistColumns.map((col) => (
                  <th key={String(col.key)} className={col.className} style={col.width ? { width: col.width } : undefined}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && watchlist.length === 0
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={`skel-${i}`}>
                      {watchlistColumns.map((col, j) => (
                        <td key={String(col.key) + j} className="py-3 px-4">
                          <div className="skeleton h-4 w-full max-w-[120px] rounded-md" />
                        </td>
                      ))}
                    </tr>
                  ))
                : watchlist.length === 0
                ? (
                    <tr>
                      <td colSpan={watchlistColumns.length} className="text-center py-16 text-muted">
                        No VIP progress data yet
                      </td>
                    </tr>
                  )
                : watchlist.map((row) => (
                    <tr key={row.id}>
                      {watchlistColumns.map((col) => (
                        <td key={String(col.key)} className={col.className}>
                          <div className="cell-truncate">
                            {col.cell ? col.cell(row) : String((row as any)[col.key] ?? '')}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit Tier: ${editing.name}` : 'Add VIP Tier'}
        description={editing ? 'Update tier rewards, requirements and perks' : 'Configure a new VIP loyalty tier'}
        maxWidthClass="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Input
              label="Level"
              type="number"
              placeholder="0"
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
            />
            <Input
              label="Name"
              placeholder="Bronze"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              wrapperClassName="col-span-2 md:col-span-2"
            />
            <Input
              label="Min Wagering ($)"
              type="number"
              placeholder="0"
              value={form.minWagering}
              onChange={(e) => setForm({ ...form, minWagering: e.target.value })}
            />
            <Input
              label="Cashback %"
              type="number"
              placeholder="0"
              value={form.cashbackPercent}
              onChange={(e) => setForm({ ...form, cashbackPercent: e.target.value })}
            />
            <Input
              label="Rakeback %"
              type="number"
              placeholder="0"
              value={form.rakebackPercent}
              onChange={(e) => setForm({ ...form, rakebackPercent: e.target.value })}
            />
            <Input
              label="Weekly Bonus ($)"
              type="number"
              placeholder="0"
              value={form.weeklyBonus}
              onChange={(e) => setForm({ ...form, weeklyBonus: e.target.value })}
              wrapperClassName="col-span-2 md:col-span-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Perks (one per line)
            </label>
            <textarea
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all resize-y min-h-[120px]"
              placeholder={'5% cashback\nBirthday bonus\nPriority support\n...'}
              value={form.perksText}
              onChange={(e) => setForm({ ...form, perksText: e.target.value })}
            />
            <p className="mt-1 text-xs text-muted">
              Each line becomes a bullet-pointed perk displayed on the tier card
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-border">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void handleSubmit()} loading={submitting}>
              {editing ? 'Save Tier' : 'Create Tier'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
