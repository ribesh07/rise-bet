'use client';

import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  ScrollText,
  RefreshCw,
  AlertTriangle,
  Search,
  Activity,
  AlertOctagon,
  FileCheck2,
  Clock,
  User as UserIcon,
  Target,
  Globe,
  Info,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  AlertCircle,
  ShieldCheck,
  Network,
  Calendar,
} from 'lucide-react';

import { GlassCard, GlassHeader } from '@/components/ui/GlassCard';
import { SkeletonRows } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { DataTable, type Column } from '@/components/ui/DataTable';

import { fetchLogs } from '@/lib/api';
import type { LogEntry } from '@/lib/types';
import { formatNumber, formatDateTime, relativeTime, cn } from '@/lib/utils';

type TabKey = 'activity' | 'errors' | 'audit';

const LOG_TABS = [
  { key: 'activity', label: 'Activity', icon: Activity },
  { key: 'errors', label: 'Errors', icon: AlertOctagon },
  { key: 'audit', label: 'Audit Trail', icon: FileCheck2 },
];

const SEVERITY_OPTIONS = [
  { value: '', label: 'All Severities' },
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
  { value: 'critical', label: 'Critical' },
];

const SEVERITY_VARIANT: Record<LogEntry['severity'], 'info' | 'warning' | 'danger' | 'muted'> = {
  info: 'info',
  warning: 'warning',
  error: 'danger',
  critical: 'danger',
};

const SEVERITY_ICON: Record<LogEntry['severity'], React.ComponentType<{ className?: string }>> = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  critical: AlertOctagon,
};

const avatarInitials = (name: string) => name.slice(0, 2).toUpperCase();

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('activity');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [search, setSearch] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLogs();
      if (!res.success) {
        throw new Error(res.message || 'Failed to load logs');
      }
      setLogs(res.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error loading logs';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, search, severityFilter, actionFilter, dateFrom, dateTo]);

  const handleRetry = () => {
    void loadData();
  };

  const clearFilters = () => {
    setSearch('');
    setSeverityFilter('');
    setActionFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const uniqueActions = useMemo(() => {
    const actions = new Set(logs.map((l) => l.action));
    return Array.from(actions).sort();
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (activeTab === 'errors' && l.severity !== 'error' && l.severity !== 'critical') return false;
      if (activeTab === 'audit' && l.actorRole !== 'admin' && l.actorRole !== 'superadmin' && l.actorRole !== 'system') {
        const adminActions = [
          'USER_BANNED', 'USER_SUSPENDED', 'WITHDRAWAL_APPROVED', 'WITHDRAWAL_REJECTED',
          'PROMO_CREATED', 'PROMO_UPDATED', 'SETTINGS_CHANGED', 'ROLE_UPDATED',
          'KYC_APPROVED', 'KYC_REJECTED',
        ];
        if (!adminActions.includes(l.action)) return false;
      }
      if (severityFilter && l.severity !== severityFilter) return false;
      if (actionFilter && l.action !== actionFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !l.action.toLowerCase().includes(q) &&
          !l.actorName.toLowerCase().includes(q) &&
          !(l.targetId?.toLowerCase().includes(q) ?? false) &&
          !l.targetType.toLowerCase().includes(q) &&
          !l.ip.includes(q)
        ) {
          return false;
        }
      }
      if (dateFrom) {
        const from = new Date(dateFrom).getTime();
        if (new Date(l.createdAt).getTime() < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo).getTime() + 24 * 60 * 60 * 1000;
        if (new Date(l.createdAt).getTime() > to) return false;
      }
      return true;
    });
  }, [logs, activeTab, severityFilter, actionFilter, search, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const tabLogs = activeTab === 'errors'
      ? logs.filter((l) => l.severity === 'error' || l.severity === 'critical')
      : activeTab === 'audit'
      ? logs.filter((l) => l.actorRole === 'admin' || l.actorRole === 'superadmin' || l.actorRole === 'system')
      : logs;
    return {
      total: tabLogs.length,
      info: tabLogs.filter((l) => l.severity === 'info').length,
      warnings: tabLogs.filter((l) => l.severity === 'warning').length,
      errors: tabLogs.filter((l) => l.severity === 'error' || l.severity === 'critical').length,
    };
  }, [logs, activeTab]);

  const columns: Column<LogEntry>[] = [
    {
      key: 'timestamp',
      header: 'Time',
      width: '170px',
      cell: (row) => (
        <div className="flex items-start gap-2 min-w-0">
          <Clock className="w-3.5 h-3.5 text-muted mt-0.5 shrink-0" />
          <div className="min-w-0">
            <div className="text-white/85 text-sm font-medium whitespace-nowrap">
              {formatDateTime(row.createdAt)}
            </div>
            <div className="text-[10px] text-muted mt-0.5 whitespace-nowrap">
              {relativeTime(row.createdAt)}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      width: '120px',
      cell: (row) => {
        const Icon = SEVERITY_ICON[row.severity];
        return (
          <Badge variant={SEVERITY_VARIANT[row.severity]} className="inline-flex items-center gap-1">
            <Icon className="w-3 h-3" />
            {row.severity.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      key: 'action',
      header: 'Action',
      width: '200px',
      cell: (row) => (
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0" />
          <code className="text-sm text-white/90 font-mono bg-card/60 border border-border rounded-md px-2 py-0.5 truncate max-w-[180px]">
            {row.action}
          </code>
        </div>
      ),
    },
    {
      key: 'actor',
      header: 'Actor',
      width: '170px',
      cell: (row) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-xs font-bold text-gold shrink-0">
            {avatarInitials(row.actorName)}
          </div>
          <div className="min-w-0">
            <div className="text-white/90 font-medium truncate text-sm">{row.actorName}</div>
            <div className="text-[10px] text-muted uppercase tracking-wide truncate">
              {row.actorRole}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'target',
      header: 'Target',
      width: '170px',
      cell: (row) => (
        <div className="flex items-center gap-2 min-w-0">
          <Target className="w-3.5 h-3.5 text-info shrink-0" />
          <div className="min-w-0">
            <div className="text-white/90 font-medium text-sm capitalize">{row.targetType}</div>
            <div className="text-[10px] text-muted font-mono truncate">{row.targetId || '—'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'ip',
      header: 'IP Address',
      width: '150px',
      cell: (row) => (
        <div className="flex items-center gap-2 min-w-0">
          <Network className="w-3.5 h-3.5 text-muted shrink-0" />
          <span className="text-gray-300 font-mono text-xs whitespace-nowrap">{row.ip}</span>
        </div>
      ),
    },
    {
      key: 'metadata',
      header: 'Details',
      cell: (row) =>
        row.metadata ? (
          <div className="max-w-[240px] truncate text-xs text-muted">
            {typeof row.metadata.detail === 'string' ? row.metadata.detail : JSON.stringify(row.metadata)}
          </div>
        ) : (
          <span className="text-muted/50 text-xs italic">No extra context</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent gold-text">
            System Logs
          </h1>
          <p className="mt-1.5 text-muted text-sm sm:text-base">
            Monitor activity, errors, and admin audit trail across RiseBet.
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
            leftIcon={filtersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <Filter className="w-4 h-4" />
            Filters
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
                <h4 className="text-white font-semibold">Failed to load logs</h4>
                <p className="text-muted text-sm mt-0.5 truncate">{error}</p>
              </div>
            </div>
            <Button variant="default" size="md" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </GlassCard>
      )}

      {loading && filteredLogs.length === 0 ? (
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
          <StatCard icon={ScrollText} title="Total Events" value={formatNumber(stats.total)} />
          <StatCard icon={Info} title="Info" value={formatNumber(stats.info)} />
          <StatCard icon={AlertTriangle} title="Warnings" value={formatNumber(stats.warnings)} accent />
          <StatCard icon={AlertOctagon} title="Errors / Critical" value={formatNumber(stats.errors)} delta={stats.errors > 0 ? -stats.errors * 2 : 0} />
        </div>
      )}

      <Tabs
        tabs={LOG_TABS}
        activeKey={activeTab}
        onChange={(k) => setActiveTab(k as TabKey)}
        variant="pills"
      />

      <GlassCard>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2 lg:col-span-2 relative">
              <Input
                placeholder="Search action, actor, target ID, or IP address..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-11"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>
            <Select
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value);
                setPage(1);
              }}
            >
              {SEVERITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <Select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Actions</option>
              {uniqueActions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </div>

          {filtersOpen && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-border/60">
              <Input
                type="date"
                label="From Date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
              />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300">To Date</label>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-muted hover:text-danger transition-colors inline-flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Clear all
                  </button>
                </div>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="flex items-end">
                <div className="text-xs text-muted flex items-center gap-2 p-2 bg-card/40 rounded-lg border border-border/60 w-full">
                  <Calendar className="w-4 h-4 text-gold shrink-0" />
                  <span>
                    Showing <span className="text-white font-semibold">{filteredLogs.length}</span> of{' '}
                    <span className="text-white font-semibold">{logs.length}</span> events for &quot;
                    <span className="text-gold font-medium capitalize">{activeTab}</span>&quot;
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {loading && filteredLogs.length === 0 ? (
        <GlassCard>
          <GlassHeader title={LOG_TABS.find((t) => t.key === activeTab)?.label + ' Log'} />
          <SkeletonRows count={10} columns={7} />
        </GlassCard>
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title={logs.length === 0 ? 'No log events yet' : 'No events match your filters'}
          description={
            logs.length === 0
              ? 'Log events will appear here as system activity occurs.'
              : 'Try adjusting your search, severity filter, or date range.'
          }
          action={
            logs.length === 0
              ? { text: 'Refresh', onClick: handleRetry }
              : { text: 'Clear filters', onClick: clearFilters }
          }
        />
      ) : (
        <DataTable<LogEntry>
          columns={columns}
          data={filteredLogs}
          rowKey={(row) => row.id}
          title={LOG_TABS.find((t) => t.key === activeTab)?.label + ' Log'}
          page={page}
          pageSize={pageSize}
          totalItems={filteredLogs.length}
          onPageChange={setPage}
          loading={loading}
          headerRight={
            <div className="flex items-center gap-2 text-sm">
              <UserIcon className="w-4 h-4 text-muted" />
              <span className="text-muted">
                Actors: <span className="text-white font-semibold">{new Set(filteredLogs.map((l) => l.actorName)).size}</span>
              </span>
            </div>
          }
          className="!p-0"
        />
      )}
    </div>
  );
}
