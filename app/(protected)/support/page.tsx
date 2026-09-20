'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Headphones,
  RefreshCw,
  AlertTriangle,
  Search,
  Eye,
  User as UserIcon,
  Calendar,
  Tag,
  Flag,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

import { GlassCard, GlassHeader } from '@/components/ui/GlassCard';
import { SkeletonRows } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/DataTable';

import { fetchTickets } from '@/lib/api';
import type { Ticket } from '@/lib/types';
import { formatNumber, formatDate, formatDateTime, cn } from '@/lib/utils';

const PRIORITY: Record<Ticket['priority'], { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  low: { label: 'Low', variant: 'success' },
  medium: { label: 'Medium', variant: 'warning' },
  high: { label: 'High', variant: 'danger' },
};

const STATUS: Record<Ticket['status'], { label: string; variant: 'warning' | 'info' | 'success' | 'muted' }> = {
  open: { label: 'Open', variant: 'warning' },
  'in-progress': { label: 'In Progress', variant: 'info' },
  resolved: { label: 'Resolved', variant: 'success' },
  closed: { label: 'Closed', variant: 'muted' },
};

const CATEGORIES = ['Account', 'Deposit', 'Withdrawal', 'Bonus', 'Technical', 'Game Issue'];

export default function SupportPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTickets();
      if (!res.success) throw new Error(res.message || 'Failed to load tickets');
      setTickets(res.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error loading support tickets';
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
  }, [search, categoryFilter, priorityFilter, statusFilter, assigneeFilter]);

  const handleRetry = () => void loadData();

  const filtered = React.useMemo(() => {
    return tickets.filter((t) => {
      if (search) {
        const s = search.toLowerCase();
        if (
          !t.subject.toLowerCase().includes(s) &&
          !t.username.toLowerCase().includes(s) &&
          !t.id.toLowerCase().includes(s) &&
          !t.userId.toLowerCase().includes(s)
        ) {
          return false;
        }
      }
      if (categoryFilter && t.category !== categoryFilter) return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      if (statusFilter && t.status !== statusFilter) return false;
      if (assigneeFilter === 'unassigned' && t.assignee) return false;
      if (assigneeFilter && assigneeFilter !== 'unassigned' && t.assignee !== assigneeFilter) return false;
      return true;
    });
  }, [tickets, search, categoryFilter, priorityFilter, statusFilter, assigneeFilter]);

  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in-progress').length;
  const highCount = tickets.filter((t) => t.priority === 'high' && t.status !== 'closed' && t.status !== 'resolved').length;
  const unassigned = tickets.filter((t) => !t.assignee && t.status !== 'closed' && t.status !== 'resolved').length;

  const assignees = Array.from(new Set(tickets.map((t) => t.assignee).filter(Boolean) as string[]));

  const columns: Column<Ticket>[] = [
    {
      key: 'ticket',
      header: 'Ticket',
      width: '340px',
      cell: (row) => (
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
              row.priority === 'high'
                ? 'bg-danger/15 border border-danger/30'
                : row.priority === 'medium'
                ? 'bg-warning/15 border border-warning/30'
                : 'bg-gold/15 border border-gold/30'
            )}
          >
            <Headphones
              className={cn(
                'w-4.5 h-4.5',
                row.priority === 'high' ? 'text-danger' : row.priority === 'medium' ? 'text-warning' : 'text-gold'
              )}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-semibold truncate">{row.subject}</p>
            <p className="text-muted text-xs truncate">
              <span className="font-mono text-gold/80">{row.id.toUpperCase()}</span> · {row.category}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'User',
      width: '180px',
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
      key: 'priority',
      header: 'Priority',
      width: '110px',
      cell: (row) => {
        const p = PRIORITY[row.priority];
        return (
          <Badge variant={p.variant}>
            <Flag className="w-3 h-3 mr-1" />
            {p.label}
          </Badge>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '130px',
      cell: (row) => {
        const s = STATUS[row.status];
        return (
          <Badge variant={s.variant}>
            <Clock className="w-3 h-3 mr-1" />
            {s.label}
          </Badge>
        );
      },
    },
    {
      key: 'assignee',
      header: 'Assignee',
      width: '150px',
      cell: (row) =>
        row.assignee ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-info/15 border border-info/30 flex items-center justify-center text-[10px] font-bold text-info shrink-0">
              {row.assignee.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-gray-300 text-sm">{row.assignee}</span>
          </div>
        ) : (
          <Badge variant="muted" size="sm">
            <UserIcon className="w-3 h-3 mr-1" />
            Unassigned
          </Badge>
        ),
    },
    {
      key: 'opened',
      header: 'Opened',
      width: '160px',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-sm text-gray-300">
          <Calendar className="w-3.5 h-3.5 text-muted shrink-0" />
          <span>{formatDateTime(row.createdAt)}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '120px',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end">
          <Link href={`/support/${row.id}`} className="inline-flex">
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Eye className="w-4 h-4 text-gold" />}
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              View
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent gold-text">
            Support Tickets
          </h1>
          <p className="mt-1.5 text-muted text-sm sm:text-base">
            Respond to customer inquiries, manage priorities and assignments.
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
                <h4 className="text-white font-semibold">Failed to load tickets</h4>
                <p className="text-muted text-sm mt-0.5 truncate">{error}</p>
              </div>
            </div>
            <Button variant="default" size="md" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={AlertTriangle} title="Open Tickets" value={formatNumber(openCount)} delta={highCount > 0 ? 0.8 : undefined} />
        <StatCard icon={Clock} title="In Progress" value={formatNumber(inProgressCount)} delta={1.5} />
        <StatCard icon={Flag} title="High Priority" value={formatNumber(highCount)} accent />
        <StatCard icon={UserIcon} title="Unassigned" value={formatNumber(unassigned)} />
      </div>

      <GlassCard>
        <GlassHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gold" />
            <span className="text-white font-semibold text-sm">Filters</span>
          </div>
        </GlassHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <Select
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select
            label="Priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All priorities</option>
            {(['low', 'medium', 'high'] as Ticket['priority'][]).map((p) => (
              <option key={p} value={p}>
                {PRIORITY[p].label}
              </option>
            ))}
          </Select>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            {(['open', 'in-progress', 'resolved', 'closed'] as Ticket['status'][]).map((s) => (
              <option key={s} value={s}>
                {STATUS[s].label}
              </option>
            ))}
          </Select>
          <Select
            label="Assignee"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="unassigned">Unassigned</option>
            {assignees.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
          <Input
            label="Search"
            placeholder="Subject, ID, user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </GlassCard>

      {loading && filtered.length === 0 ? (
        <GlassCard>
          <GlassHeader title="Tickets" />
          <SkeletonRows count={8} columns={7} />
        </GlassCard>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Headphones}
          title="No tickets found"
          description={
            tickets.length === 0
              ? 'No support tickets yet. The queue is empty!'
              : 'Try adjusting filters or clear search.'
          }
          action={
            tickets.length === 0
              ? undefined
              : {
                  text: 'Clear filters',
                  onClick: () => {
                    setCategoryFilter('');
                    setPriorityFilter('');
                    setStatusFilter('');
                    setAssigneeFilter('');
                    setSearch('');
                  },
                }
          }
        />
      ) : (
        <DataTable<Ticket>
          columns={columns}
          data={filtered}
          rowKey={(row) => row.id}
          title="Tickets"
          page={page}
          pageSize={10}
          onPageChange={setPage}
          loading={loading}
          headerRight={
            <span className="text-sm text-muted">
              Total: <span className="text-white font-semibold">{filtered.length}</span>
            </span>
          }
        />
      )}
    </div>
  );
}
