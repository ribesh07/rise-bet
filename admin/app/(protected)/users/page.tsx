'use client';

import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  Search,
  RefreshCw,
  Eye,
  Ban,
  Unlock,
  Wallet,
  Edit,
  KeyRound,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Crown,
  AlertTriangle,
} from 'lucide-react';

import { GlassCard, GlassHeader } from '@/components/ui/GlassCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Avatar } from '@/components/ui/Avatar';

import { fetchUsers } from '@/lib/api';
import type { User } from '@/lib/types';
import { formatNumber, formatCurrency, relativeTime, cn } from '@/lib/utils';

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'superadmin', label: 'Super Admin' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'banned', label: 'Banned' },
  { value: 'suspended', label: 'Suspended' },
];

const KYC_OPTIONS = [
  { value: '', label: 'All KYC' },
  { value: 'unverified', label: 'Unverified' },
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
];

const VIP_OPTIONS = [
  { value: '', label: 'All VIP Levels' },
  ...Array.from({ length: 11 }, (_, i) => ({ value: String(i), label: `Level ${i}` })),
];

const statusBadge = (status: User['status']) => {
  switch (status) {
    case 'active':
      return <Badge variant="success">ACTIVE</Badge>;
    case 'banned':
      return <Badge variant="danger">BANNED</Badge>;
    case 'suspended':
      return <Badge variant="warning">SUSPENDED</Badge>;
  }
};

const kycBadge = (kyc: User['kycStatus']) => {
  switch (kyc) {
    case 'verified':
      return <Badge variant="success">VERIFIED</Badge>;
    case 'pending':
      return <Badge variant="warning">PENDING</Badge>;
    case 'unverified':
      return <Badge variant="muted">UNVERIFIED</Badge>;
    case 'rejected':
      return <Badge variant="danger">REJECTED</Badge>;
  }
};

const vipBadge = (level: number) => (
  <Badge variant="gold" className="inline-flex items-center gap-1">
    <Crown className="w-3 h-3" />
    LVL {level}
  </Badge>
);

export default function UsersPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [kycFilter, setKycFilter] = useState<string>('');
  const [vipFilter, setVipFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const [banDialogOpen, setBanDialogOpen] = useState<boolean>(false);
  const [targetUser, setTargetUser] = useState<User | null>(null);

  const [balanceModalOpen, setBalanceModalOpen] = useState<boolean>(false);
  const [balanceAmount, setBalanceAmount] = useState<string>('');
  const [balanceType, setBalanceType] = useState<'add' | 'subtract' | 'set'>('add');
  const [balanceNote, setBalanceNote] = useState<string>('');
  const [balanceSubmitting, setBalanceSubmitting] = useState<boolean>(false);

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editUsername, setEditUsername] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editFullName, setEditFullName] = useState<string>('');
  const [editRole, setEditRole] = useState<User['role']>('user');
  const [editVipLevel, setEditVipLevel] = useState<number>(0);
  const [editSubmitting, setEditSubmitting] = useState<boolean>(false);

  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordSubmitting, setPasswordSubmitting] = useState<boolean>(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchUsers();
      if (!res.success) {
        throw new Error(res.message || 'Failed to load users');
      }
      setUsers(res.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error loading users';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !u.username.toLowerCase().includes(q) &&
          !u.email.toLowerCase().includes(q) &&
          (u.fullName?.toLowerCase() || '').includes(q) === false &&
          !u.id.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (roleFilter && u.role !== roleFilter) return false;
      if (statusFilter && u.status !== statusFilter) return false;
      if (kycFilter && u.kycStatus !== kycFilter) return false;
      if (vipFilter && String(u.vipLevel) !== vipFilter) return false;
      if (dateFrom) {
        const from = new Date(dateFrom).getTime();
        if (new Date(u.registeredAt).getTime() < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo).getTime() + 24 * 60 * 60 * 1000;
        if (new Date(u.registeredAt).getTime() > to) return false;
      }
      return true;
    });
  }, [users, search, roleFilter, statusFilter, kycFilter, vipFilter, dateFrom, dateTo]);

  const handleRetry = () => {
    void loadData();
  };

  const clearFilters = () => {
    setSearch('');
    setRoleFilter('');
    setStatusFilter('');
    setKycFilter('');
    setVipFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const openBanDialog = (user: User) => {
    setTargetUser(user);
    setBanDialogOpen(true);
  };

  const handleBanToggle = () => {
    if (!targetUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === targetUser.id
          ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' }
          : u
      )
    );
    if (targetUser.status === 'banned') {
      toast.success(`User ${targetUser.username} has been unbanned`);
    } else {
      toast.success(`User ${targetUser.username} has been banned`);
    }
  };

  const openBalanceModal = (user: User) => {
    setTargetUser(user);
    setBalanceAmount('');
    setBalanceType('add');
    setBalanceNote('');
    setBalanceModalOpen(true);
  };

  const handleBalanceSubmit = () => {
    if (!targetUser) return;
    const amt = parseFloat(balanceAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setBalanceSubmitting(true);
    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== targetUser.id) return u;
          let newBalance = u.balance;
          if (balanceType === 'add') newBalance += amt;
          else if (balanceType === 'subtract') newBalance = Math.max(0, newBalance - amt);
          else if (balanceType === 'set') newBalance = amt;
          return { ...u, balance: newBalance };
        })
      );
      toast.success(`Balance adjusted for ${targetUser.username}`);
      setBalanceSubmitting(false);
      setBalanceModalOpen(false);
    }, 500);
  };

  const openEditModal = (user: User) => {
    setTargetUser(user);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditFullName(user.fullName || '');
    setEditRole(user.role);
    setEditVipLevel(user.vipLevel);
    setEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    if (!targetUser) return;
    if (!editUsername.trim() || !editEmail.trim()) {
      toast.error('Username and email are required');
      return;
    }
    setEditSubmitting(true);
    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUser.id
            ? {
                ...u,
                username: editUsername,
                email: editEmail,
                fullName: editFullName,
                role: editRole,
                vipLevel: editVipLevel,
              }
            : u
        )
      );
      toast.success(`Profile updated for ${targetUser.username}`);
      setEditSubmitting(false);
      setEditModalOpen(false);
    }, 500);
  };

  const openPasswordModal = (user: User) => {
    setTargetUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordModalOpen(true);
  };

  const handlePasswordSubmit = () => {
    if (!targetUser) return;
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setPasswordSubmitting(true);
    setTimeout(() => {
      toast.success(`Password reset for ${targetUser.username}`);
      setPasswordSubmitting(false);
      setPasswordModalOpen(false);
    }, 500);
  };

  const columns: Column<User>[] = [
    {
      key: 'user',
      header: 'User',
      width: '260px',
      className: 'px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted',
      cell: (row) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            src={row.avatar}
            name={row.fullName || row.username}
            size="md"
            ringColor={row.status === 'active' ? 'success' : row.status === 'banned' ? 'danger' : 'none'}
          />
          <div className="min-w-0">
            <p className="text-white font-medium truncate">{row.username}</p>
            <p className="text-muted text-xs truncate">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      className: 'px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted',
      cell: (row) => statusBadge(row.status),
    },
    {
      key: 'kycStatus',
      header: 'KYC',
      width: '120px',
      className: 'px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted',
      cell: (row) => kycBadge(row.kycStatus),
    },
    {
      key: 'vipLevel',
      header: 'VIP',
      width: '110px',
      className: 'px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted',
      cell: (row) => vipBadge(row.vipLevel),
    },
    {
      key: 'balance',
      header: 'Balance',
      width: '140px',
      className: 'px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted',
      cell: (row) => (
        <span className="text-white font-semibold">{formatCurrency(row.balance)}</span>
      ),
    },
    {
      key: 'registeredAt',
      header: 'Registered',
      width: '130px',
      className: 'px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted',
      cell: (row) => <span className="text-muted text-xs">{relativeTime(row.registeredAt)}</span>,
    },
    {
      key: 'lastLoginAt',
      header: 'Last Login',
      width: '130px',
      className: 'px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted',
      cell: (row) => (
        <span className="text-muted text-xs">
          {row.lastLoginAt ? relativeTime(row.lastLoginAt) : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '280px',
      className: 'px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5 flex-wrap">
          <Link href={`/users/${row.id}`} className="inline-flex">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Eye className="w-3.5 h-3.5" />}
            >
              View
            </Button>
          </Link>
          {row.status === 'banned' ? (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Unlock className="w-3.5 h-3.5 text-success" />}
              onClick={() => openBanDialog(row)}
            >
              Unban
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Ban className="w-3.5 h-3.5 text-danger" />}
              onClick={() => openBanDialog(row)}
            >
              Ban
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Wallet className="w-3.5 h-3.5 text-gold" />}
            onClick={() => openBalanceModal(row)}
          >
            Balance
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit className="w-3.5 h-3.5 text-info" />}
            onClick={() => openEditModal(row)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<KeyRound className="w-3.5 h-3.5 text-warning" />}
            onClick={() => openPasswordModal(row)}
          >
            Reset
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent gold-text">
            Users
          </h1>
          <p className="mt-1.5 text-muted text-sm sm:text-base">
            Manage player accounts, balances, permissions and KYC status.
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
                <h4 className="text-white font-semibold">Failed to load users</h4>
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

      <GlassCard>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2 lg:col-span-2">
              <Input
                placeholder="Search by username, email, name or ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-11"
                wrapperClassName="relative"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
            <Select
              value={kycFilter}
              onChange={(e) => {
                setKycFilter(e.target.value);
                setPage(1);
              }}
            >
              {KYC_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </div>

          {filtersOpen && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-border/60">
              <Select
                label="Role"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
              >
                {ROLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
              <Select
                label="VIP Level"
                value={vipFilter}
                onChange={(e) => {
                  setVipFilter(e.target.value);
                  setPage(1);
                }}
              >
                {VIP_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
              <Input
                type="date"
                label="Registered From"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
              />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300">Registered To</label>
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
            </div>
          )}
        </div>
      </GlassCard>

      {loading && !users.length ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <GlassCard key={i} className="p-5">
              <div className="grid grid-cols-[auto_1fr_100px_100px_100px_120px_120px_260px] gap-4 items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-64 rounded-lg" />
              </div>
            </GlassCard>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          title="No users found"
          description="Try adjusting your search or filters to see more results."
          action={{ text: 'Clear filters', onClick: clearFilters }}
        />
      ) : (
        <DataTable<User>
          columns={columns}
          data={filteredUsers}
          loading={loading}
          rowKey={(row) => row.id}
          page={page}
          pageSize={pageSize}
          totalItems={filteredUsers.length}
          onPageChange={setPage}
          className="!p-0"
        />
      )}

      <ConfirmDialog
        open={banDialogOpen}
        onClose={() => setBanDialogOpen(false)}
        onConfirm={handleBanToggle}
        title={targetUser?.status === 'banned' ? 'Unban User' : 'Ban User'}
        description={
          targetUser?.status === 'banned'
            ? `Are you sure you want to unban ${targetUser?.username}? They will be able to login and place bets again.`
            : `Are you sure you want to ban ${targetUser?.username}? They will no longer be able to login or access their account.`
        }
        confirmText={targetUser?.status === 'banned' ? 'Unban' : 'Ban'}
        confirmVariant={targetUser?.status === 'banned' ? 'primary' : 'danger'}
      />

      <Modal
        open={balanceModalOpen}
        onClose={() => setBalanceModalOpen(false)}
        title="Adjust Balance"
        description={targetUser ? `Adjusting balance for ${targetUser.username} (current: ${formatCurrency(targetUser.balance)})` : ''}
        maxWidthClass="max-w-md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {(['add', 'subtract', 'set'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setBalanceType(t)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm font-medium transition-all capitalize',
                  balanceType === t
                    ? 'bg-gold/20 border-gold/50 text-gold'
                    : 'border-border bg-background/50 text-gray-300 hover:text-white hover:border-border-hover'
                )}
              >
                {t === 'add' ? '+' : t === 'subtract' ? '−' : '='} {t}
              </button>
            ))}
          </div>
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={balanceAmount}
            onChange={(e) => setBalanceAmount(e.target.value)}
          />
          <Input
            label="Note (optional)"
            placeholder="Reason for adjustment..."
            value={balanceNote}
            onChange={(e) => setBalanceNote(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2 border-t border-border -mx-5 -mb-5 mt-5 px-5 py-4">
            <Button variant="ghost" onClick={() => setBalanceModalOpen(false)} disabled={balanceSubmitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleBalanceSubmit}
              loading={balanceSubmitting}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile"
        description={targetUser ? `Editing profile for ${targetUser.username}` : ''}
        maxWidthClass="max-w-lg"
      >
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Username"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </div>
          <Input
            label="Full Name"
            value={editFullName}
            onChange={(e) => setEditFullName(e.target.value)}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Role"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value as User['role'])}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </Select>
            <Select
              label="VIP Level"
              value={String(editVipLevel)}
              onChange={(e) => setEditVipLevel(parseInt(e.target.value, 10) || 0)}
            >
              {Array.from({ length: 11 }, (_, i) => (
                <option key={i} value={i}>Level {i}</option>
              ))}
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-border -mx-5 -mb-5 mt-5 px-5 py-4">
            <Button variant="ghost" onClick={() => setEditModalOpen(false)} disabled={editSubmitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEditSubmit}
              loading={editSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Reset Password"
        description={targetUser ? `Resetting password for ${targetUser.username}` : ''}
        maxWidthClass="max-w-md"
      >
        <div className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2 border-t border-border -mx-5 -mb-5 mt-5 px-5 py-4">
            <Button variant="ghost" onClick={() => setPasswordModalOpen(false)} disabled={passwordSubmitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handlePasswordSubmit}
              loading={passwordSubmitting}
            >
              Reset Password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
