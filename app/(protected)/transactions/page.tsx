'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Download,
  Search,
  CheckCircle2,
  XCircle,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Gift,
  Ticket,
  Trophy,
  MoreHorizontal,
  RefreshCw,
  AlertTriangle,
  CreditCard,
  CheckCheck,
} from 'lucide-react';

import { GlassCard, GlassHeader } from '@/components/ui/GlassCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { SkeletonRows } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

import { fetchTransactions } from '@/lib/api';
import type { Transaction } from '@/lib/types';
import { formatCurrency, relativeTime, cn } from '@/lib/utils';

type TabKey = 'deposits' | 'withdrawals' | 'bonuses' | 'raffles' | 'races' | 'others';

const TAB_TYPE_MAP: Record<TabKey, Transaction['type']> = {
  deposits: 'deposit',
  withdrawals: 'withdrawal',
  bonuses: 'bonus',
  raffles: 'raffle',
  races: 'race',
  others: 'other',
};

const TRANSACTION_TABS = [
  { key: 'deposits', label: 'Deposits', icon: ArrowDownCircle },
  { key: 'withdrawals', label: 'Withdrawals', icon: ArrowUpCircle },
  { key: 'bonuses', label: 'Bonuses', icon: Gift },
  { key: 'raffles', label: 'Raffles', icon: Ticket },
  { key: 'races', label: 'Races', icon: Trophy },
  { key: 'others', label: 'Others', icon: MoreHorizontal },
];

const STATUS_OPTIONS: Transaction['status'][] = ['pending', 'approved', 'completed', 'rejected', 'failed', 'cancelled'];

const statusBadge = (status: Transaction['status']) => {
  const variantMap: Record<Transaction['status'], 'success' | 'warning' | 'danger' | 'info' | 'muted'> = {
    pending: 'warning',
    approved: 'info',
    completed: 'success',
    rejected: 'danger',
    failed: 'danger',
    cancelled: 'muted',
  };
  return <Badge variant={variantMap[status]}>{status.toUpperCase()}</Badge>;
};

const avatarInitials = (name: string) => name.slice(0, 2).toUpperCase();

interface ConfirmState {
  open: boolean;
  action: 'approve' | 'reject' | 'mark_paid';
  transaction: Transaction | null;
}

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('deposits');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [confirm, setConfirm] = useState<ConfirmState>({ open: false, action: 'approve', transaction: null });

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTransactions(TAB_TYPE_MAP[activeTab]);
      if (!res.success) {
        throw new Error(res.message || 'Failed to load transactions');
      }
      setTransactions(res.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error loading transactions';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, statusFilter, search, dateFrom, dateTo]);

  const handleRetry = () => {
    void loadData();
  };

  const handleExport = () => {
    toast.success('Export queued');
  };

  const handleAction = (action: ConfirmState['action'], tx: Transaction) => {
    setConfirm({ open: true, action, transaction: tx });
  };

  const confirmAction = () => {
    const tx = confirm.transaction;
    if (!tx) return;

    const actionLabel = {
      approve: 'Approved',
      reject: 'Rejected',
      mark_paid: 'Marked as paid',
    }[confirm.action];

    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== tx.id) return t;
        const newStatus: Transaction['status'] =
          confirm.action === 'reject' ? 'rejected' : confirm.action === 'mark_paid' ? 'completed' : 'approved';
        return { ...t, status: newStatus, updatedAt: new Date().toISOString() };
      })
    );

    toast.success(`${actionLabel} ${formatCurrency(tx.amount)} from ${tx.username || tx.userId}`);
  };

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((tx) => {
      if (statusFilter && tx.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        const matches =
          tx.username?.toLowerCase().includes(s) ||
          tx.userId.toLowerCase().includes(s) ||
          tx.id.toLowerCase().includes(s) ||
          (tx.method?.toLowerCase().includes(s) ?? false) ||
          (tx.walletAddress?.toLowerCase().includes(s) ?? false);
        if (!matches) return false;
      }
      if (dateFrom) {
        const from = new Date(dateFrom).getTime();
        if (new Date(tx.createdAt).getTime() < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo).getTime() + 24 * 60 * 60 * 1000;
        if (new Date(tx.createdAt).getTime() > to) return false;
      }
      return true;
    });
  }, [transactions, statusFilter, search, dateFrom, dateTo]);

  const baseColumns: Column<Transaction>[] = [
    {
      key: 'user',
      header: 'User',
      width: '200px',
      cell: (row) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-xs font-bold text-gold shrink-0">
            {avatarInitials(row.username || row.userId)}
          </div>
          <div className="min-w-0">
            <p className="text-white/90 truncate font-medium">{row.username || row.userId}</p>
            <p className="text-muted text-xs truncate">{row.currency}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      width: '140px',
      className: 'text-right',
      cell: (row) => (
        <div className="text-right">
          <span
            className={cn(
              'font-semibold',
              TAB_TYPE_MAP[activeTab] === 'withdrawal' ? 'text-danger' : 'text-success'
            )}
          >
            {TAB_TYPE_MAP[activeTab] === 'withdrawal' ? '-' : '+'}
            {formatCurrency(row.amount)}
          </span>
        </div>
      ),
    },
    {
      key: 'method',
      header: 'Method',
      width: '160px',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-muted shrink-0" />
          <span className="text-gray-300">{row.method || '—'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '140px',
      cell: (row) => statusBadge(row.status),
    },
    {
      key: 'timestamp',
      header: 'Date',
      width: '140px',
      className: 'text-right',
      cell: (row) => (
        <div className="text-right">
          <p className="text-white/80 text-sm">{relativeTime(row.createdAt)}</p>
        </div>
      ),
    },
  ];

  const withdrawalExtraColumn: Column<Transaction> = {
    key: 'walletAddress',
    header: 'Wallet Address',
    width: '220px',
    cell: (row) => (
      <div className="flex items-center gap-2 max-w-[220px]">
        <DollarSign className="w-4 h-4 text-muted shrink-0" />
        <span className="text-gray-300 text-xs font-mono truncate" title={row.walletAddress}>
          {row.walletAddress || '—'}
        </span>
      </div>
    ),
  };

  const actionsColumn: Column<Transaction> = {
    key: 'actions',
    header: 'Actions',
    width: '220px',
    className: 'text-right',
    cell: (row) => {
      const isPending = row.status === 'pending';
      const isWithdrawals = activeTab === 'withdrawals';
      const isDeposits = activeTab === 'deposits';

      if (isDeposits) {
        return (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<CheckCircle2 className="w-4 h-4 text-success" />}
              disabled={!isPending}
              onClick={(e) => {
                e.stopPropagation();
                handleAction('approve', row);
              }}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<XCircle className="w-4 h-4 text-danger" />}
              disabled={!isPending}
              onClick={(e) => {
                e.stopPropagation();
                handleAction('reject', row);
              }}
            >
              Reject
            </Button>
          </div>
        );
      }

      if (isWithdrawals) {
        return (
          <div className="flex items-center justify-end gap-1.5 flex-wrap">
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<CheckCircle2 className="w-4 h-4 text-success" />}
              disabled={!isPending}
              onClick={(e) => {
                e.stopPropagation();
                handleAction('approve', row);
              }}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<XCircle className="w-4 h-4 text-danger" />}
              disabled={!isPending}
              onClick={(e) => {
                e.stopPropagation();
                handleAction('reject', row);
              }}
            >
              Reject
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<CheckCheck className="w-4 h-4 text-info" />}
              disabled={row.status === 'completed' || row.status === 'rejected' || row.status === 'cancelled' || row.status === 'failed'}
              onClick={(e) => {
                e.stopPropagation();
                handleAction('mark_paid', row);
              }}
            >
              Mark Paid
            </Button>
          </div>
        );
      }

      return <span className="text-muted text-xs">—</span>;
    },
  };

  const columns: Column<Transaction>[] = React.useMemo(() => {
    const cols = [...baseColumns];
    if (activeTab === 'withdrawals') {
      cols.splice(3, 0, withdrawalExtraColumn);
    }
    cols.push(actionsColumn);
    return cols;
  }, [activeTab]);

  const confirmTitle =
    confirm.action === 'approve'
      ? 'Approve Transaction'
      : confirm.action === 'reject'
      ? 'Reject Transaction'
      : 'Mark as Paid';

  const confirmDesc = confirm.transaction
    ? `Are you sure you want to ${confirm.action === 'mark_paid' ? 'mark as paid' : confirm.action.toLowerCase()} ${formatCurrency(confirm.transaction.amount)} from ${confirm.transaction.username || confirm.transaction.userId}?`
    : '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent gold-text">
            Transactions
          </h1>
          <p className="mt-1.5 text-muted text-sm sm:text-base">
            Review and manage deposits, withdrawals, bonuses and adjustments.
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
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExport}
          >
            Export CSV
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
                <h4 className="text-white font-semibold">Failed to load transactions</h4>
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

      <Tabs
        tabs={TRANSACTION_TABS}
        activeKey={activeTab}
        onChange={(k) => setActiveTab(k as TabKey)}
        variant="pills"
      />

      <GlassCard>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <Input
            type="date"
            label="From Date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            type="date"
            label="To Date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Select>
          <Input
            label="Search"
            placeholder="User, ID, method, wallet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            wrapperClassName="lg:col-span-1"
          />
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExport}
              className="w-full sm:w-auto"
            >
              Export
            </Button>
          </div>
        </div>
      </GlassCard>

      {loading && filteredTransactions.length === 0 ? (
        <GlassCard>
          <GlassHeader title={TRANSACTION_TABS.find((t) => t.key === activeTab)?.label + ' Transactions'} />
          <SkeletonRows count={8} columns={activeTab === 'withdrawals' ? 7 : 6} />
        </GlassCard>
      ) : filteredTransactions.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No transactions found"
          description={transactions.length === 0 ? 'No transactions in this category yet.' : 'Try adjusting your filters or search query.'}
          action={transactions.length === 0 ? undefined : { text: 'Clear filters', onClick: () => { setDateFrom(''); setDateTo(''); setStatusFilter(''); setSearch(''); } }}
        />
      ) : (
        <DataTable<Transaction>
          columns={columns}
          data={filteredTransactions}
          rowKey={(row) => row.id}
          title={TRANSACTION_TABS.find((t) => t.key === activeTab)?.label + ' Transactions'}
          page={page}
          pageSize={10}
          onPageChange={setPage}
          loading={loading}
          headerRight={
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">
                Total: <span className="text-white font-semibold">{filteredTransactions.length}</span>
              </span>
            </div>
          }
        />
      )}

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, action: 'approve', transaction: null })}
        onConfirm={confirmAction}
        title={confirmTitle}
        description={confirmDesc}
        confirmText={confirm.action === 'approve' ? 'Approve' : confirm.action === 'reject' ? 'Reject' : 'Mark Paid'}
        confirmVariant={confirm.action === 'reject' ? 'danger' : 'primary'}
      />
    </div>
  );
}
