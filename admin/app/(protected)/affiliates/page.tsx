'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Users,
  RefreshCw,
  AlertTriangle,
  DollarSign,
  Percent,
  Clock,
  CheckCircle2,
  XCircle,
  Edit3,
  Eye,
  Megaphone,
  Link2,
  MousePointerClick,
  TrendingUp,
  Wallet,
  CreditCard,
  Coins,
  ArrowUpRight,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { GlassCard, GlassHeader } from '@/components/ui/GlassCard';
import { SkeletonRows } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

import { fetchAffiliates, fetchCommissions, fetchCampaigns } from '@/lib/api';
import type { Affiliate, Commission, Campaign } from '@/lib/types';
import { formatNumber, formatCurrency, cn } from '@/lib/utils';

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

const AFF_STATUS: Record<Affiliate['status'], { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  active: { label: 'Active', variant: 'success' },
  paused: { label: 'Paused', variant: 'warning' },
  banned: { label: 'Banned', variant: 'danger' },
};

const CAMP_STATUS: Record<Campaign['status'], { label: string; variant: 'success' | 'warning' | 'muted' }> = {
  active: { label: 'Active', variant: 'success' },
  paused: { label: 'Paused', variant: 'warning' },
  ended: { label: 'Ended', variant: 'muted' },
};

interface PayoutItem {
  id: string;
  affiliateId: string;
  username: string;
  referralCode: string;
  amount: number;
  requestedAt: string;
  method: string;
  status: 'pending' | 'approved' | 'paid';
}

const mockPayouts = (affiliates: Affiliate[]): PayoutItem[] => {
  const methods = ['USDT (TRC20)', 'BTC', 'ETH', 'Bank Transfer'];
  return affiliates
    .filter((a) => a.pendingPayout > 50)
    .slice(0, 6)
    .map((a, i) => ({
      id: `payout-${i + 1}`,
      affiliateId: a.id,
      username: a.username,
      referralCode: a.referralCode,
      amount: a.pendingPayout,
      requestedAt: new Date(Date.now() - (i + 1) * 86400000 * Math.ceil(Math.random() * 5)).toISOString(),
      method: methods[i % methods.length],
      status: i < 2 ? 'approved' : 'pending',
    }));
};

export default function AffiliatesPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [affRes, commRes, campRes] = await Promise.all([
        fetchAffiliates(),
        fetchCommissions(),
        fetchCampaigns(),
      ]);
      if (!affRes.success) throw new Error(affRes.message || 'Failed to load affiliates');
      const affs = affRes.data || [];
      setAffiliates(affs);
      setCommissions(commRes.success ? (commRes.data || []) : []);
      setCampaigns(campRes.success ? (campRes.data || []) : []);
      setPayouts(mockPayouts(affs));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error loading affiliates';
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

  const totalAffiliates = affiliates.length;
  const totalReferrals = affiliates.reduce((s, a) => s + a.referralsCount, 0);
  const totalCommEarned = affiliates.reduce((s, a) => s + a.totalEarned, 0);
  const pendingPayoutTotal = affiliates.reduce((s, a) => s + a.pendingPayout, 0);
  const pendingCount = payouts.filter((p) => p.status === 'pending').length;

  const avatarInitials = (name: string) => name.slice(0, 2).toUpperCase();

  const handleApprovePayout = (p: PayoutItem) => {
    setPayouts((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: 'approved' } : x)));
    toast.success(`Payout for ${p.username} approved`);
  };

  const handleMarkPaid = (p: PayoutItem) => {
    setPayouts((prev) => prev.filter((x) => x.id !== p.id));
    setAffiliates((prev) =>
      prev.map((a) =>
        a.id === p.affiliateId
          ? { ...a, pendingPayout: Math.max(0, a.pendingPayout - p.amount), totalPaid: a.totalPaid + p.amount }
          : a
      )
    );
    toast.success(`Payout of ${formatCurrency(p.amount)} to ${p.username} marked as paid`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent gold-text">
            Affiliates
          </h1>
          <p className="mt-1.5 text-muted text-sm sm:text-base">
            Manage partners, referral codes, commissions, marketing campaigns and payouts.
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
                <h4 className="text-white font-semibold">Failed to load affiliates</h4>
                <p className="text-muted text-sm mt-0.5 truncate">{error}</p>
              </div>
            </div>
            <Button variant="default" size="md" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </GlassCard>
      )}

      {loading && affiliates.length === 0 ? (
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
          <StatCard icon={Users} title="Total Affiliates" value={formatNumber(totalAffiliates)} delta={8.4} />
          <StatCard icon={Link2} title="Total Referrals" value={formatNumber(totalReferrals)} delta={15.2} />
          <StatCard icon={DollarSign} title="Commissions Paid" value={formatCurrency(totalCommEarned)} delta={22.7} accent />
          <StatCard icon={Clock} title="Pending Payouts" value={`${pendingCount} · ${formatCurrency(pendingPayoutTotal)}`} delta={-4.1} />
        </div>
      )}

      <GlassCard>
        <GlassHeader
          action={
            <div className="flex items-center gap-2 text-sm text-muted">
              <Users className="w-4 h-4 text-gold" />
              <span>{affiliates.length} partners</span>
            </div>
          }
        >
          <div>
            <h3 className="text-white font-semibold text-base">Affiliates</h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">All registered affiliate partners</p>
          </div>
        </GlassHeader>

        {loading && affiliates.length === 0 ? (
          <SkeletonRows count={6} columns={8} />
        ) : affiliates.length === 0 ? (
          <EmptyState icon={Users} title="No affiliates yet" description="Affiliates will appear here once they sign up." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/30">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">User</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Referral Code</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Referrals</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Rate</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Total Earned</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Pending</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {affiliates.map((a) => {
                  const s = AFF_STATUS[a.status];
                  return (
                    <tr key={a.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-xs font-bold text-gold shrink-0">
                            {avatarInitials(a.username)}
                          </div>
                          <span className="text-white/90 truncate">{a.username}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <code className="px-2 py-1 rounded bg-card border border-border text-gold font-mono text-xs">{a.referralCode}</code>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap text-white/90 font-medium">{formatNumber(a.referralsCount)}</td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 text-gold font-semibold">
                          <Percent className="w-3 h-3" />
                          {a.commissionRate}%
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 text-success font-semibold">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          {formatCurrency(a.totalEarned)}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap text-warning font-medium">
                        {formatCurrency(a.pendingPayout)}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Badge variant={s.variant}>{s.label}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-info transition-colors" title="View details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-gold transition-colors" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Coins} title="This Week" value={formatCurrency(commissions.filter((c) => new Date(c.periodEnd) > new Date(Date.now() - 7 * 86400000)).reduce((s, c) => s + c.amount, 0))} />
        <StatCard icon={TrendingUp} title="This Month" value={formatCurrency(commissions.filter((c) => new Date(c.periodEnd) > new Date(Date.now() - 30 * 86400000)).reduce((s, c) => s + c.amount, 0))} accent />
        <StatCard icon={CheckCircle2} title="Paid Total" value={formatCurrency(commissions.filter((c) => c.status === 'paid').reduce((s, c) => s + c.amount, 0))} />
        <StatCard icon={Clock} title="Pending Total" value={formatCurrency(commissions.filter((c) => c.status === 'pending').reduce((s, c) => s + c.amount, 0))} />
      </div>

      <GlassCard>
        <GlassHeader
          action={
            <div className="flex items-center gap-2 text-sm text-muted">
              <CreditCard className="w-4 h-4 text-gold" />
              <span>{commissions.length} periods</span>
            </div>
          }
        >
          <div>
            <h3 className="text-white font-semibold text-base">Commissions Overview</h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">Weekly commission settlements</p>
          </div>
        </GlassHeader>

        {loading && commissions.length === 0 ? (
          <SkeletonRows count={5} columns={4} />
        ) : commissions.length === 0 ? (
          <EmptyState icon={CreditCard} title="No commissions yet" description="Weekly commission runs will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/30">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Period</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Paid At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {commissions.slice(0, 8).map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="text-white/90 font-medium">
                        {formatDate(c.periodStart)} → {formatDate(c.periodEnd)}
                      </div>
                      <div className="text-xs text-muted mt-0.5">Weekly settlement</div>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap text-white/90 font-semibold">
                      {formatCurrency(c.amount)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {c.status === 'paid' ? (
                        <Badge variant="success">Paid</Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-muted text-xs">
                      {c.paidAt ? formatDate(c.paidAt) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      <GlassCard>
        <GlassHeader
          action={
            <div className="flex items-center gap-2 text-sm text-muted">
              <Megaphone className="w-4 h-4 text-gold" />
              <span>{campaigns.length} campaigns</span>
            </div>
          }
        >
          <div>
            <h3 className="text-white font-semibold text-base">Marketing Campaigns</h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">Track ad spend, clicks and conversion performance</p>
          </div>
        </GlassHeader>

        {loading && campaigns.length === 0 ? (
          <SkeletonRows count={5} columns={7} />
        ) : campaigns.length === 0 ? (
          <EmptyState icon={Megaphone} title="No campaigns yet" description="Create marketing campaigns to track performance." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/30">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Campaign</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Clicks</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Conversions</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Conv Rate</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Commission</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {campaigns.map((c) => {
                  const rate = c.clicks > 0 ? ((c.conversions / c.clicks) * 100).toFixed(2) : '0';
                  const s = CAMP_STATUS[c.status];
                  return (
                    <tr key={c.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-5 py-3.5">
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate flex items-center gap-2">
                            <MousePointerClick className="w-3.5 h-3.5 text-gold shrink-0" />
                            {c.name}
                          </p>
                          <p className="text-xs text-muted truncate max-w-sm">{c.description}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap text-white/90 font-medium">{formatNumber(c.clicks)}</td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap text-white/90 font-medium">{formatNumber(c.conversions)}</td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <span className={cn('font-semibold', Number(rate) >= 3 ? 'text-success' : Number(rate) >= 1.5 ? 'text-gold' : 'text-muted')}>
                          {rate}%
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 text-gold font-semibold">
                          <Percent className="w-3 h-3" />
                          {c.commissionRate}%
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Badge variant={s.variant}>{s.label}</Badge>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-muted">
                        {formatDate(c.startAt)} → {formatDate(c.endAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      <GlassCard>
        <GlassHeader
          action={
            <div className="flex items-center gap-2 text-sm text-muted">
              <Wallet className="w-4 h-4 text-gold" />
              <span>{pendingCount} pending</span>
            </div>
          }
        >
          <div>
            <h3 className="text-white font-semibold text-base">Payout Queue</h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">Approve and process pending affiliate withdrawals</p>
          </div>
        </GlassHeader>

        {loading && payouts.length === 0 ? (
          <SkeletonRows count={4} columns={6} />
        ) : payouts.length === 0 ? (
          <EmptyState icon={Wallet} title="No pending payouts" description="All caught up! Payout requests will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/30">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Affiliate</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Method</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Requested</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {payouts.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-xs font-bold text-gold shrink-0">
                          {avatarInitials(p.username)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-white/90 truncate block">{p.username}</span>
                          <code className="text-[10px] text-muted font-mono">{p.referralCode}</code>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-white/90">{p.method}</td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap text-white/90 font-bold">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-muted">{formatDate(p.requestedAt)}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {p.status === 'paid' ? (
                        <Badge variant="success">Paid</Badge>
                      ) : p.status === 'approved' ? (
                        <Badge variant="info">Approved</Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {p.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                            onClick={() => handleApprovePayout(p)}
                          >
                            Approve
                          </Button>
                        )}
                        {p.status !== 'paid' && (
                          <Button
                            size="sm"
                            variant="primary"
                            leftIcon={<DollarSign className="w-3.5 h-3.5" />}
                            onClick={() => handleMarkPaid(p)}
                          >
                            Mark Paid
                          </Button>
                        )}
                        {p.status === 'pending' && (
                          <button
                            className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-danger transition-colors"
                            title="Reject"
                            onClick={() => {
                              setPayouts((prev) => prev.filter((x) => x.id !== p.id));
                              toast.error(`Payout for ${p.username} rejected`);
                            }}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
