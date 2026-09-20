'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  RefreshCw,
  Crown,
  Shield,
  Wallet,
  Calendar,
  Clock,
  Mail,
  User as UserIcon,
  Ban,
  Unlock,
  Edit,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  FileText,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Hash,
  Send,
  Eye,
} from 'lucide-react';

import { GlassCard, GlassHeader } from '@/components/ui/GlassCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';

import { fetchUserById } from '@/lib/api';
import type { User, Bet, Transaction } from '@/lib/types';
import { formatNumber, formatCurrency, relativeTime, cn } from '@/lib/utils';

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

const roleBadge = (role: User['role']) => {
  switch (role) {
    case 'superadmin':
      return <Badge variant="danger">SUPER ADMIN</Badge>;
    case 'admin':
      return <Badge variant="info">ADMIN</Badge>;
    default:
      return <Badge variant="pill">USER</Badge>;
  }
};

const mockUserBets = (userId: string): Bet[] => {
  const games = [
    { type: 'slot', id: 'sweet-bonanza', name: 'Sweet Bonanza' },
    { type: 'slot', id: 'gates-of-olympus', name: 'Gates of Olympus' },
    { type: 'table', id: 'blackjack', name: 'Blackjack Classic' },
    { type: 'table', id: 'baccarat', name: 'Baccarat Pro' },
    { type: 'live', id: 'live-roulette', name: 'Live Roulette' },
    { type: 'crash', id: 'aviator', name: 'Aviator' },
    { type: 'dice', id: 'dice-duel', name: 'Dice Duel' },
  ];
  const results: Bet['result'][] = ['win', 'loss', 'win', 'loss', 'loss', 'pending'];
  const bets: Bet[] = [];
  for (let i = 0; i < 15; i++) {
    const game = games[i % games.length];
    const result = results[Math.floor(Math.random() * results.length)];
    const amount = Math.round((Math.random() * 2000 + 10) * 100) / 100;
    const multiplier = result === 'win' ? Math.round((Math.random() * 15 + 1.1) * 100) / 100 : 0;
    const profitLoss = result === 'win'
      ? Math.round(amount * (multiplier - 1) * 100) / 100
      : result === 'loss' ? -amount : 0;
    bets.push({
      id: `ubet-${i + 1}`,
      userId,
      gameType: game.type,
      gameId: game.id,
      amount,
      multiplier,
      result,
      profitLoss,
      timestamp: new Date(Date.now() - i * 3600 * 1000 * (2 + Math.random() * 10)).toISOString(),
      currency: 'USDT',
    });
  }
  return bets;
};

const mockUserTransactions = (userId: string): Transaction[] => {
  const types: Transaction['type'][] = ['deposit', 'withdrawal', 'bonus', 'adjustment', 'raffle'];
  const statuses: Transaction['status'][] = ['completed', 'completed', 'pending', 'approved', 'rejected'];
  const methods = ['Bitcoin', 'Ethereum', 'USDT (TRC20)', 'USDT (ERC20)', 'Internal'];
  const txs: Transaction[] = [];
  for (let i = 0; i < 20; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    txs.push({
      id: `utx-${i + 1}`,
      userId,
      type,
      amount: Math.round((Math.random() * 3000 + 20) * 100) / 100,
      method: methods[Math.floor(Math.random() * methods.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      txHash: `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...`,
      note: i % 5 === 0 ? 'Admin adjustment' : undefined,
      createdAt: new Date(Date.now() - i * 86400 * 1000 * (1 + Math.random() * 2)).toISOString(),
      currency: 'USDT',
    });
  }
  return txs;
};

interface NoteItem {
  id: string;
  author: string;
  role: string;
  body: string;
  createdAt: string;
  pinned?: boolean;
}

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'n-1',
    author: 'Admin',
    role: 'Super Admin',
    body: 'VIP player with consistent high-volume wagering. Approved manual withdrawal last week due to security review flag — all checks passed.',
    createdAt: new Date(Date.now() - 86400 * 1000 * 4).toISOString(),
    pinned: true,
  },
  {
    id: 'n-2',
    author: 'Support Agent',
    role: 'Support',
    body: 'Player contacted support about delayed deposit. Identified as blockchain congestion, issued 5 USDT goodwill bonus.',
    createdAt: new Date(Date.now() - 86400 * 1000 * 11).toISOString(),
  },
];

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'bets', label: 'Bets' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'kyc', label: 'KYC' },
  { key: 'notes', label: 'Notes' },
  { key: 'actions', label: 'Actions' },
];

const txBadge = (type: Transaction['type']) => {
  switch (type) {
    case 'deposit':
      return <Badge variant="success">DEPOSIT</Badge>;
    case 'withdrawal':
      return <Badge variant="warning">WITHDRAWAL</Badge>;
    case 'bonus':
      return <Badge variant="gold">BONUS</Badge>;
    case 'raffle':
      return <Badge variant="info">RAFFLE</Badge>;
    case 'race':
      return <Badge variant="info">RACE</Badge>;
    case 'adjustment':
      return <Badge variant="muted">ADJUSTMENT</Badge>;
    default:
      return <Badge variant="pill">OTHER</Badge>;
  }
};

const txStatusBadge = (status: Transaction['status']) => {
  switch (status) {
    case 'completed':
    case 'approved':
      return <Badge variant="success">COMPLETED</Badge>;
    case 'pending':
      return <Badge variant="warning">PENDING</Badge>;
    case 'rejected':
    case 'failed':
      return <Badge variant="danger">REJECTED</Badge>;
    case 'cancelled':
      return <Badge variant="muted">CANCELLED</Badge>;
  }
};

const betResultBadge = (result: Bet['result']) => {
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

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = params.id;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<string>('overview');

  const [bets] = useState<Bet[]>(() => mockUserBets(userId || ''));
  const [transactions] = useState<Transaction[]>(() => mockUserTransactions(userId || ''));
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [noteDraft, setNoteDraft] = useState<string>('');

  const [banDialogOpen, setBanDialogOpen] = useState<boolean>(false);
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
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchUserById(userId);
      if (!res.success) {
        throw new Error(res.message || 'Failed to load user');
      }
      setUser(res.data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error loading user';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRetry = () => {
    void loadData();
  };

  const handleBanToggle = () => {
    if (!user) return;
    setUser((prev: User | null) =>
      prev ? { ...prev, status: prev.status === 'banned' ? 'active' : 'banned' } : prev
    );
    if (user.status === 'banned') {
      toast.success(`User ${user.username} has been unbanned`);
    } else {
      toast.success(`User ${user.username} has been banned`);
    }
  };

  const handleBalanceSubmit = () => {
    if (!user) return;
    const amt = parseFloat(balanceAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setBalanceSubmitting(true);
    setTimeout(() => {
      setUser((prev: User | null) => {
        if (!prev) return prev;
        let newBalance = prev.balance;
        if (balanceType === 'add') newBalance += amt;
        else if (balanceType === 'subtract') newBalance = Math.max(0, newBalance - amt);
        else if (balanceType === 'set') newBalance = amt;
        return { ...prev, balance: newBalance };
      });
      toast.success(`Balance adjusted for ${user.username}`);
      setBalanceSubmitting(false);
      setBalanceModalOpen(false);
    }, 500);
  };

  const openEditModal = () => {
    if (!user) return;
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditFullName(user.fullName || '');
    setEditRole(user.role);
    setEditVipLevel(user.vipLevel);
    setEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    if (!user) return;
    if (!editUsername.trim() || !editEmail.trim()) {
      toast.error('Username and email are required');
      return;
    }
    setEditSubmitting(true);
    setTimeout(() => {
      setUser((prev: User | null) =>
        prev
          ? {
              ...prev,
              username: editUsername,
              email: editEmail,
              fullName: editFullName,
              role: editRole,
              vipLevel: editVipLevel,
            }
          : prev
      );
      toast.success('Profile updated successfully');
      setEditSubmitting(false);
      setEditModalOpen(false);
    }, 500);
  };

  const handlePasswordSubmit = () => {
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
      toast.success('Password reset successfully');
      setPasswordSubmitting(false);
      setPasswordModalOpen(false);
    }, 500);
  };

  const addNote = () => {
    if (!noteDraft.trim()) return;
    const newNote: NoteItem = {
      id: `n-${Date.now()}`,
      author: 'Admin',
      role: 'Super Admin',
      body: noteDraft.trim(),
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setNoteDraft('');
    toast.success('Note added');
  };

  const approveKYC = () => {
    if (!user) return;
    setUser({ ...user, kycStatus: 'verified' });
    toast.success('KYC approved');
  };

  const rejectKYC = () => {
    if (!user) return;
    setUser({ ...user, kycStatus: 'rejected' });
    toast.success('KYC rejected');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => router.back()}
            className="shrink-0"
          >
            Back
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent gold-text truncate">
              {loading || !user ? 'Loading...' : user.username}
            </h1>
            <p className="mt-1.5 text-muted text-sm sm:text-base truncate">
              {loading || !user ? 'Fetching user profile' : `User ID: ${user.id}`}
            </p>
          </div>
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
                <h4 className="text-white font-semibold">Failed to load user</h4>
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

      {loading && !user ? (
        <GlassCard>
          <div className="grid md:grid-cols-[auto_1fr_auto] gap-5 items-start">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" />
              <div className="flex flex-wrap gap-2 pt-1">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-9 w-28 rounded-lg" />
              <Skeleton className="h-9 w-28 rounded-lg" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-28" />
              </div>
            ))}
          </div>
        </GlassCard>
      ) : !user ? (
        <EmptyState
          title="User not found"
          description="The requested user could not be loaded."
          action={{ text: 'Back to users', onClick: () => router.push('/users') }}
        />
      ) : (
        <>
          <GlassCard>
            <div className="grid md:grid-cols-[auto_1fr_auto] gap-5 items-start">
              <Avatar
                src={user.avatar}
                name={user.fullName || user.username}
                size="2xl"
                ringColor={user.status === 'active' ? 'success' : user.status === 'banned' ? 'danger' : 'none'}
              />
              <div className="min-w-0">
                <div className="flex items-start gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                  {roleBadge(user.role)}
                  {statusBadge(user.status)}
                  {kycBadge(user.kycStatus)}
                  <Badge variant="gold" className="inline-flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    VIP {user.vipLevel}
                  </Badge>
                </div>
                <p className="text-muted mt-2 text-sm">{user.fullName || 'No full name set'}</p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-sm text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                  {user.referralCode && (
                    <span className="inline-flex items-center gap-1.5">
                      <Hash className="w-4 h-4" />
                      REF: <span className="text-white font-medium">{user.referralCode}</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Wallet className="w-4 h-4 text-gold" />}
                  onClick={() => setBalanceModalOpen(true)}
                >
                  Adjust Balance
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Edit className="w-4 h-4 text-info" />}
                  onClick={openEditModal}
                >
                  Edit Profile
                </Button>
                {user.status === 'banned' ? (
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<Unlock className="w-4 h-4" />}
                    onClick={() => setBanDialogOpen(true)}
                  >
                    Unban
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    size="md"
                    leftIcon={<Ban className="w-4 h-4" />}
                    onClick={() => setBanDialogOpen(true)}
                  >
                    Ban
                  </Button>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted mb-1.5">Balance</p>
                <p className="text-xl font-bold text-white">{formatCurrency(user.balance)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted mb-1.5">Total Wagered</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(user.totalWagered ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted mb-1.5">Total Profit</p>
                <p className={cn(
                  'text-xl font-bold',
                  (user.totalProfit ?? 0) >= 0 ? 'text-success' : 'text-danger'
                )}>
                  {(user.totalProfit ?? 0) >= 0 ? '+' : ''}
                  {formatCurrency(user.totalProfit ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted mb-1.5">Currency</p>
                <p className="text-xl font-bold text-white">{user.currency}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-border text-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-card flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="text-muted text-xs">Registered</p>
                  <p className="text-white font-medium">
                    {new Date(user.registeredAt).toLocaleString()}
                    <span className="text-muted ml-2">({relativeTime(user.registeredAt)})</span>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-card flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-info" />
                </div>
                <div>
                  <p className="text-muted text-xs">Last Login</p>
                  <p className="text-white font-medium">
                    {user.lastLoginAt
                      ? `${new Date(user.lastLoginAt).toLocaleString()} (${relativeTime(user.lastLoginAt)})`
                      : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          <Tabs
            tabs={TABS}
            activeKey={tab}
            onChange={setTab}
            variant="underline"
          />

          {tab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-4">
              <GlassCard className="lg:col-span-2">
                <GlassHeader
                  title="Account Summary"
                  subtitle="Core account details and statistics"
                />
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted mb-2">Account</p>
                      <div className="space-y-2.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted">User ID</span>
                          <span className="text-white font-mono">{user.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Username</span>
                          <span className="text-white">{user.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Email</span>
                          <span className="text-white truncate max-w-[50%]">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Full Name</span>
                          <span className="text-white">{user.fullName || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Role</span>
                          <span>{roleBadge(user.role)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted mb-2">Status</p>
                      <div className="space-y-2.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted">Account</span>
                          <span>{statusBadge(user.status)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">KYC</span>
                          <span>{kycBadge(user.kycStatus)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">VIP Level</span>
                          <span>
                            <Badge variant="gold" className="inline-flex items-center gap-1">
                              <Crown className="w-3 h-3" /> LVL {user.vipLevel}
                            </Badge>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted mb-2">Wallets</p>
                      <div className="space-y-2.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted">Currency</span>
                          <span className="text-white">{user.currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Available Balance</span>
                          <span className="text-white font-semibold">{formatCurrency(user.balance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Total Wagered</span>
                          <span className="text-white">{formatCurrency(user.totalWagered ?? 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Total Profit</span>
                          <span className={cn(
                            'font-semibold',
                            (user.totalProfit ?? 0) >= 0 ? 'text-success' : 'text-danger'
                          )}>
                            {(user.totalProfit ?? 0) >= 0 ? '+' : ''}
                            {formatCurrency(user.totalProfit ?? 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted mb-2">Dates</p>
                      <div className="space-y-2.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted">Registered At</span>
                          <span className="text-white">{new Date(user.registeredAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Last Login</span>
                          <span className="text-white">
                            {user.lastLoginAt ? relativeTime(user.lastLoginAt) : 'Never'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Referral Code</span>
                          <span className="text-white font-mono">{user.referralCode || '—'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <GlassHeader
                  title="Quick Stats"
                  subtitle="Recent activity snapshot"
                />
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-card/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-success/15 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="text-xs text-muted">Total Bets</p>
                        <p className="text-lg font-bold text-white">{formatNumber(bets.length)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-card/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-info/15 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-info" />
                      </div>
                      <div>
                        <p className="text-xs text-muted">Transactions</p>
                        <p className="text-lg font-bold text-white">{formatNumber(transactions.length)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-card/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-warning/15 flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 text-warning" />
                      </div>
                      <div>
                        <p className="text-xs text-muted">Win Rate</p>
                        <p className="text-lg font-bold text-white">
                          {formatNumber(Math.round(
                            (bets.filter((b) => b.result === 'win').length / Math.max(1, bets.filter((b) => b.result !== 'pending').length)) * 100
                          ))}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-card/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <p className="text-xs text-muted">Notes</p>
                        <p className="text-lg font-bold text-white">{formatNumber(notes.length)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {tab === 'bets' && (
            <GlassCard>
              <GlassHeader
                title={`Recent Bets (${bets.length})`}
                subtitle="Full bet history for this user"
              />
              {bets.length === 0 ? (
                <EmptyState
                  title="No bets yet"
                  description="When this user places bets, they will appear here."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/60 bg-card/30">
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Game</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Amount</th>
                        <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">Multiplier</th>
                        <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">Result</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">P/L</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {bets.map((bet) => (
                        <tr key={bet.id} className="transition-colors hover:bg-white/[0.02]">
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="min-w-0">
                              <p className="text-white font-medium capitalize truncate">{bet.gameId || bet.gameType}</p>
                              <p className="text-xs text-muted truncate">{bet.gameType}</p>
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
                            {betResultBadge(bet.result)}
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
          )}

          {tab === 'transactions' && (
            <GlassCard>
              <GlassHeader
                title={`Transactions (${transactions.length})`}
                subtitle="Deposits, withdrawals, bonuses and adjustments"
              />
              {transactions.length === 0 ? (
                <EmptyState
                  title="No transactions"
                  description="Transaction history will appear here."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/60 bg-card/30">
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Type</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Method</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Amount</th>
                        <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Reference</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="transition-colors hover:bg-white/[0.02]">
                          <td className="px-5 py-3.5 whitespace-nowrap">{txBadge(tx.type)}</td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-white/90">{tx.method || '—'}</td>
                          <td className={cn(
                            'px-5 py-3.5 whitespace-nowrap text-right font-semibold',
                            tx.type === 'deposit' || tx.type === 'bonus' ? 'text-success' : tx.type === 'withdrawal' ? 'text-danger' : 'text-white'
                          )}>
                            {(tx.type === 'deposit' || tx.type === 'bonus' || tx.type === 'raffle' || tx.type === 'race') ? '+' : tx.type === 'withdrawal' ? '−' : ''}
                            {formatCurrency(tx.amount)}
                          </td>
                          <td className="px-5 py-3.5 text-center whitespace-nowrap">{txStatusBadge(tx.status)}</td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="min-w-0">
                              <p className="text-white/90 font-mono text-xs truncate max-w-[180px]">
                                {tx.txHash || '—'}
                              </p>
                              {tx.note && (
                                <p className="text-xs text-muted truncate max-w-[180px]">{tx.note}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-right text-muted text-xs">
                            {relativeTime(tx.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          )}

          {tab === 'kyc' && (
            <div className="grid lg:grid-cols-2 gap-4">
              <GlassCard>
                <GlassHeader
                  title="KYC Status"
                  subtitle="Identity verification progress"
                />
                <div className="space-y-5">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-card/40">
                    <div className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center shrink-0',
                      user.kycStatus === 'verified' ? 'bg-success/15' :
                      user.kycStatus === 'pending' ? 'bg-warning/15' :
                      user.kycStatus === 'rejected' ? 'bg-danger/15' : 'bg-muted/15'
                    )}>
                      {user.kycStatus === 'verified' && <CheckCircle2 className="w-7 h-7 text-success" />}
                      {user.kycStatus === 'pending' && <Clock3 className="w-7 h-7 text-warning" />}
                      {user.kycStatus === 'rejected' && <XCircle className="w-7 h-7 text-danger" />}
                      {user.kycStatus === 'unverified' && <UserIcon className="w-7 h-7 text-muted" />}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg capitalize">{user.kycStatus}</p>
                      <p className="text-muted text-sm">
                        {user.kycStatus === 'verified' && 'User identity has been successfully verified.'}
                        {user.kycStatus === 'pending' && 'Verification is currently under review by our team.'}
                        {user.kycStatus === 'rejected' && 'Verification was rejected. See reason below.'}
                        {user.kycStatus === 'unverified' && 'User has not submitted KYC documents yet.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl border border-border/60 bg-background/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted text-sm">Government ID</span>
                        <Badge variant={user.kycStatus === 'verified' ? 'success' : user.kycStatus === 'pending' ? 'warning' : 'muted'}>
                          {user.kycStatus === 'verified' ? 'APPROVED' : user.kycStatus === 'unverified' ? 'MISSING' : 'REVIEW'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted">Passport / Driver license / National ID</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border/60 bg-background/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted text-sm">Proof of Address</span>
                        <Badge variant={user.kycStatus === 'verified' ? 'success' : user.kycStatus === 'pending' ? 'warning' : 'muted'}>
                          {user.kycStatus === 'verified' ? 'APPROVED' : user.kycStatus === 'unverified' ? 'MISSING' : 'REVIEW'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted">Utility bill / Bank statement (last 3 months)</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border/60 bg-background/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted text-sm">Selfie</span>
                        <Badge variant={user.kycStatus === 'verified' ? 'success' : user.kycStatus === 'pending' ? 'warning' : 'muted'}>
                          {user.kycStatus === 'verified' ? 'APPROVED' : user.kycStatus === 'unverified' ? 'MISSING' : 'REVIEW'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted">Live photo with ID document</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border/60 bg-background/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted text-sm">Source of Wealth</span>
                        <Badge variant={user.kycStatus === 'verified' ? 'success' : 'muted'}>
                          {user.kycStatus === 'verified' ? 'APPROVED' : 'OPTIONAL'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted">Required for high-value withdrawals</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    {user.kycStatus !== 'verified' && (
                      <Button
                        variant="primary"
                        size="md"
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                        onClick={approveKYC}
                      >
                        Approve KYC
                      </Button>
                    )}
                    {user.kycStatus !== 'rejected' && user.kycStatus !== 'unverified' && (
                      <Button
                        variant="danger"
                        size="md"
                        leftIcon={<XCircle className="w-4 h-4" />}
                        onClick={rejectKYC}
                      >
                        Reject KYC
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <GlassHeader
                  title="Submitted Documents"
                  subtitle="Files uploaded by the user"
                />
                {user.kycStatus === 'unverified' ? (
                  <EmptyState
                    title="No documents submitted"
                    description="This user has not uploaded any KYC documents yet."
                  />
                ) : (
                  <div className="space-y-3">
                    {[
                      { name: 'government-id-front.jpg', size: '1.8 MB' },
                      { name: 'government-id-back.jpg', size: '1.6 MB' },
                      { name: 'proof-of-address.pdf', size: '840 KB' },
                      { name: 'selfie-with-id.jpg', size: '2.3 MB' },
                    ].map((doc) => (
                      <div
                        key={doc.name}
                        className="flex items-center justify-between p-4 rounded-xl bg-card/40 hover:bg-card/60 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-gold" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-muted">{doc.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          )}

          {tab === 'notes' && (
            <div className="grid lg:grid-cols-3 gap-4">
              <GlassCard className="lg:col-span-2">
                <GlassHeader
                  title={`Admin Notes (${notes.length})`}
                  subtitle="Internal notes visible to staff only"
                />
                <div className="space-y-4 mb-5">
                  <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
                    <Textarea
                      placeholder="Add an internal note about this user..."
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <Button
                        variant="primary"
                        size="md"
                        leftIcon={<Send className="w-4 h-4" />}
                        onClick={addNote}
                        disabled={!noteDraft.trim()}
                      >
                        Add Note
                      </Button>
                    </div>
                  </div>
                </div>

                {notes.length === 0 ? (
                  <EmptyState
                    title="No notes yet"
                    description="Add notes about this user for other staff members."
                  />
                ) : (
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className={cn(
                          'rounded-xl border p-4',
                          note.pinned
                            ? 'border-gold/30 bg-gold/5'
                            : 'border-border/60 bg-card/30'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={note.author} size="sm" ringColor="none" />
                            <div>
                              <p className="text-white font-medium text-sm">{note.author}</p>
                              <p className="text-xs text-muted">
                                {note.role} · {relativeTime(note.createdAt)}
                              </p>
                            </div>
                          </div>
                          {note.pinned && (
                            <Badge variant="gold" size="sm">PINNED</Badge>
                          )}
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                          {note.body}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>

              <GlassCard>
                <GlassHeader
                  title="Note Guidelines"
                  subtitle="Good notes make support faster"
                />
                <div className="space-y-3 text-sm text-muted">
                  <div className="flex gap-3">
                    <MessageSquare className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <p>Record player contacts, disputes and resolution outcomes.</p>
                  </div>
                  <div className="flex gap-3">
                    <Shield className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <p>Flag suspicious behavior or multi-account patterns.</p>
                  </div>
                  <div className="flex gap-3">
                    <Wallet className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <p>Log manual adjustments, bonuses and goodwill gestures.</p>
                  </div>
                  <div className="flex gap-3">
                    <TrendingDown className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <p>Document responsible gambling interactions and limits.</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {tab === 'actions' && (
            <div className="grid md:grid-cols-2 gap-4">
              <GlassCard>
                <GlassHeader
                  title="Account Actions"
                  subtitle="Core account management tools"
                />
                <div className="space-y-3">
                  <button
                    onClick={() => setBalanceModalOpen(true)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card/30 hover:bg-card/60 hover:border-gold/30 transition-all text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                      <Wallet className="w-5 h-5 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold">Adjust Balance</p>
                      <p className="text-muted text-sm">Add, subtract or set user balance</p>
                    </div>
                  </button>

                  <button
                    onClick={openEditModal}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card/30 hover:bg-card/60 hover:border-info/30 transition-all text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-info/15 flex items-center justify-center shrink-0">
                      <Edit className="w-5 h-5 text-info" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold">Edit Profile</p>
                      <p className="text-muted text-sm">Update username, email, role, VIP</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setPasswordModalOpen(true)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card/30 hover:bg-card/60 hover:border-warning/30 transition-all text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-warning/15 flex items-center justify-center shrink-0">
                      <KeyRound className="w-5 h-5 text-warning" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold">Reset Password</p>
                      <p className="text-muted text-sm">Set a new temporary password</p>
                    </div>
                  </button>

                  {user.status === 'banned' ? (
                    <button
                      onClick={() => setBanDialogOpen(true)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card/30 hover:bg-card/60 hover:border-success/30 transition-all text-left"
                    >
                      <div className="w-11 h-11 rounded-xl bg-success/15 flex items-center justify-center shrink-0">
                        <Unlock className="w-5 h-5 text-success" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold">Unban Account</p>
                        <p className="text-muted text-sm">Restore login and gameplay access</p>
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => setBanDialogOpen(true)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card/30 hover:bg-card/60 hover:border-danger/30 transition-all text-left"
                    >
                      <div className="w-11 h-11 rounded-xl bg-danger/15 flex items-center justify-center shrink-0">
                        <Ban className="w-5 h-5 text-danger" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold">Ban Account</p>
                        <p className="text-muted text-sm">Revoke login and gameplay access</p>
                      </div>
                    </button>
                  )}
                </div>
              </GlassCard>

              <GlassCard>
                <GlassHeader
                  title="Moderation Tools"
                  subtitle="Player safety and responsible gambling"
                />
                <div className="space-y-3">
                  <button
                    onClick={() => toast.success('Self-exclusion dialog triggered')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card/30 hover:bg-card/60 hover:border-danger/30 transition-all text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-danger/15 flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-danger" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold">Self-Exclusion</p>
                      <p className="text-muted text-sm">Apply or revoke cooling-off period</p>
                    </div>
                  </button>

                  <button
                    onClick={() => toast.success('Deposit limit dialog triggered')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card/30 hover:bg-card/60 hover:border-warning/30 transition-all text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-warning/15 flex items-center justify-center shrink-0">
                      <TrendingDown className="w-5 h-5 text-warning" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold">Set Deposit Limit</p>
                      <p className="text-muted text-sm">Daily / weekly / monthly cap</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setUser((prev: User | null) => prev ? { ...prev, kycStatus: 'pending' } : prev);
                      toast.success('KYC reset to pending');
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card/30 hover:bg-card/60 hover:border-info/30 transition-all text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-info/15 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-info" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold">Reset KYC</p>
                      <p className="text-muted text-sm">Request user to re-submit documents</p>
                    </div>
                  </button>

                  <button
                    onClick={() => toast.success('Logout sessions triggered')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card/30 hover:bg-card/60 hover:border-muted/30 transition-all text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-muted/15 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold">Logout All Sessions</p>
                      <p className="text-muted text-sm">Invalidate all active auth tokens</p>
                    </div>
                  </button>
                </div>
              </GlassCard>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={banDialogOpen}
        onClose={() => setBanDialogOpen(false)}
        onConfirm={handleBanToggle}
        title={user?.status === 'banned' ? 'Unban User' : 'Ban User'}
        description={
          user?.status === 'banned'
            ? `Are you sure you want to unban ${user?.username}? They will be able to login and place bets again.`
            : `Are you sure you want to ban ${user?.username}? They will no longer be able to login or access their account.`
        }
        confirmText={user?.status === 'banned' ? 'Unban' : 'Ban'}
        confirmVariant={user?.status === 'banned' ? 'primary' : 'danger'}
      />

      <Modal
        open={balanceModalOpen}
        onClose={() => setBalanceModalOpen(false)}
        title="Adjust Balance"
        description={user ? `Adjusting balance for ${user.username} (current: ${formatCurrency(user.balance)})` : ''}
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
        description={user ? `Editing profile for ${user.username}` : ''}
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
        description={user ? `Resetting password for ${user.username}` : ''}
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
