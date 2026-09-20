'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  User,
  Lock,
  ShieldCheck,
  SlidersHorizontal,
  Gift,
  Globe,
  RefreshCw,
  AlertTriangle,
  KeyRound,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Upload,
  Save,
  Bell,
  Moon,
  Sun,
  DollarSign,
  Clock,
  Languages,
  CheckCircle2,
  XCircle,
  FileCheck2,
  FileX2,
  TicketCheck,
  ToggleLeft,
  Activity,
  Trash2,
  Plus,
  X,
} from 'lucide-react';

import { GlassCard, GlassHeader } from '@/components/ui/GlassCard';
import { SkeletonRows } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Switch } from '@/components/ui/Switch';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Avatar } from '@/components/ui/Avatar';

import { fetchUsers, fetchLogs } from '@/lib/api';
import type { User as UserType, LogEntry } from '@/lib/types';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

type TabKey = 'account' | 'security' | 'verification' | 'preferences' | 'offers' | 'site';

const SETTINGS_TABS = [
  { key: 'account', label: 'Account', icon: User },
  { key: 'security', label: 'Security', icon: Lock },
  { key: 'verification', label: 'Verification', icon: ShieldCheck },
  { key: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { key: 'offers', label: 'Offers', icon: Gift },
  { key: 'site', label: 'Site Settings', icon: Globe },
];

const CURRENCY_OPTIONS = [
  { value: 'USDT', label: 'USDT (Tether)' },
  { value: 'BTC', label: 'BTC (Bitcoin)' },
  { value: 'ETH', label: 'ETH (Ethereum)' },
  { value: 'USD', label: 'USD (US Dollar)' },
  { value: 'EUR', label: 'EUR (Euro)' },
  { value: 'INR', label: 'INR (Indian Rupee)' },
];

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'Asia/Kolkata', label: 'IST (India Standard Time)' },
  { value: 'America/New_York', label: 'EST (Eastern Standard Time)' },
  { value: 'Europe/London', label: 'GMT (Greenwich Mean Time)' },
  { value: 'Asia/Singapore', label: 'SGT (Singapore Time)' },
  { value: 'Australia/Sydney', label: 'AEST (Australian Eastern)' },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
];

const THEME_OPTIONS = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

const ACTIVE_CURRENCIES = ['USDT', 'BTC', 'ETH', 'USDC', 'BNB', 'SOL', 'INR'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('account');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingUsers, setPendingUsers] = useState<UserType[]>([]);
  const [verificationPage, setVerificationPage] = useState<number>(1);
  const [verifySearch, setVerifySearch] = useState<string>('');
  const [confirm, setConfirm] = useState<{
    open: boolean;
    action: 'approve' | 'reject';
    user: UserType | null;
  }>({ open: false, action: 'approve', user: null });

  // Account form state
  const [accountForm, setAccountForm] = useState({
    fullName: 'Admin Master',
    email: 'admin@risebet.com',
    phone: '+1 555 012 3456',
    username: 'superadmin',
    address: '123 Gaming Street, Suite 100',
  });

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // Preferences state
  const [theme, setTheme] = useState('dark');
  const [displayCurrency, setDisplayCurrency] = useState('USDT');
  const [timezone, setTimezone] = useState('UTC');
  const [language, setLanguage] = useState('en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Offers state
  const [welcomeBonusEnabled, setWelcomeBonusEnabled] = useState(true);
  const [welcomeBonusAmount, setWelcomeBonusAmount] = useState('200');
  const [welcomeBonusMax, setWelcomeBonusMax] = useState('1000');
  const [cashbackEnabled, setCashbackEnabled] = useState(true);
  const [cashbackPercent, setCashbackPercent] = useState('15');
  const [weeklyReloadEnabled, setWeeklyReloadEnabled] = useState(true);
  const [freeSpinsEnabled, setFreeSpinsEnabled] = useState(true);
  const [referralBonusEnabled, setReferralBonusEnabled] = useState(true);

  // Site settings state
  const [siteName, setSiteName] = useState('RiseBet');
  const [siteDescription, setSiteDescription] = useState(
    'The ultimate destination for premium online betting and casino gaming.'
  );
  const [supportEmail, setSupportEmail] = useState('support@risebet.com');
  const [seoKeywords, setSeoKeywords] = useState(
    'casino, betting, slots, sports, live casino, crypto'
  );
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [enabledCurrencies, setEnabledCurrencies] = useState<string[]>([
    'USDT', 'BTC', 'ETH', 'USDC',
  ]);
  const [newCurrency, setNewCurrency] = useState('');

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes] = await Promise.all([
        fetchUsers(),
      ]);
      if (!usersRes.success) throw new Error(usersRes.message || 'Failed to load data');
      const pending = (usersRes.data || []).filter(
        (u) => u.kycStatus === 'pending' || u.kycStatus === 'unverified'
      );
      setPendingUsers(pending);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error loading settings';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleRetry = () => void loadData();

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success(`${SETTINGS_TABS.find((t) => t.key === activeTab)?.label} settings saved successfully`);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyAction = (action: 'approve' | 'reject', user: UserType) => {
    setConfirm({ open: true, action, user });
  };

  const confirmVerify = () => {
    const user = confirm.user;
    if (!user) return;
    const newKyc = confirm.action === 'approve' ? 'verified' : 'rejected';
    setPendingUsers((prev) => prev.filter((u) => u.id !== user.id));
    toast.success(
      confirm.action === 'approve'
        ? `KYC approved for ${user.username}`
        : `KYC rejected for ${user.username}`
    );
    setPendingUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, kycStatus: newKyc as UserType['kycStatus'] } : u))
    );
  };

  const toggleCurrency = (currency: string) => {
    setEnabledCurrencies((prev) =>
      prev.includes(currency)
        ? prev.filter((c) => c !== currency)
        : [...prev, currency]
    );
  };

  const addCurrency = () => {
    if (!newCurrency || enabledCurrencies.includes(newCurrency)) return;
    setEnabledCurrencies((prev) => [...prev, newCurrency]);
    setNewCurrency('');
    toast.success(`Added ${newCurrency} as active currency`);
  };

  // ---- Account Tab ----
  const renderAccountTab = () => (
    <div className="space-y-6">
      <GlassCard>
        <GlassHeader>
          <div>
            <h3 className="text-white font-semibold text-base flex items-center gap-2">
              <User className="w-5 h-5 text-gold" />
              Admin Profile
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">
              Update your personal admin account information
            </p>
          </div>
        </GlassHeader>
        <div className="p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative shrink-0">
              <Avatar size="xl" fallback="AM" />
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gold-gradient text-black flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
                <Upload className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 flex-1 min-w-0">
              <h4 className="text-white font-semibold text-lg">{accountForm.fullName}</h4>
              <p className="text-muted text-sm flex items-center gap-2">
                <Badge variant="gold" className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Super Admin
                </Badge>
                <span>Last login: 2 hours ago</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              leftIcon={<User className="w-4 h-4 text-muted" />}
              value={accountForm.fullName}
              onChange={(e) => setAccountForm({ ...accountForm, fullName: e.target.value })}
            />
            <Input
              label="Username"
              leftIcon={<User className="w-4 h-4 text-muted" />}
              value={accountForm.username}
              onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              leftIcon={<Mail className="w-4 h-4 text-muted" />}
              value={accountForm.email}
              onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
            />
            <Input
              label="Phone"
              leftIcon={<Phone className="w-4 h-4 text-muted" />}
              value={accountForm.phone}
              onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
            />
            <div className="sm:col-span-2">
              <Input
                label="Address"
                leftIcon={<MapPin className="w-4 h-4 text-muted" />}
                value={accountForm.address}
                onChange={(e) => setAccountForm({ ...accountForm, address: e.target.value })}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="flex justify-end">
        <Button variant="primary" onClick={() => void handleSave()} loading={saving} leftIcon={<Save className="w-4 h-4" />}>
          Save Changes
        </Button>
      </div>
    </div>
  );

  // ---- Security Tab ----
  const renderSecurityTab = () => (
    <div className="space-y-6">
      <GlassCard>
        <GlassHeader>
          <div>
            <h3 className="text-white font-semibold text-base flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-gold" />
              Change Password
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">
              Update your admin password regularly for security
            </p>
          </div>
        </GlassHeader>
        <div className="p-5 space-y-4">
          <div className="relative">
            <Input
              label="Current Password"
              type={showCurrentPw ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPw(!showCurrentPw)}
              className="absolute right-3 top-9 text-muted hover:text-gold transition-colors"
            >
              {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label="New Password"
                type={showNewPw ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-9 text-muted hover:text-gold transition-colors"
              >
                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <Input
                label="Confirm New Password"
                type={showConfirmPw ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute right-3 top-9 text-muted hover:text-gold transition-colors"
              >
                {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="primary" onClick={() => void handleChangePassword()} loading={saving} leftIcon={<Lock className="w-4 h-4" />}>
              Update Password
            </Button>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <GlassHeader>
          <div>
            <h3 className="text-white font-semibold text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold" />
              Two-Factor Authentication
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">
              Add an extra layer of security to your admin account
            </p>
          </div>
        </GlassHeader>
        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between rounded-xl bg-black/20 border border-white/5 p-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5 text-gold" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-white font-semibold">Enable 2FA (Authenticator App)</h4>
                  <Badge variant={twoFAEnabled ? 'success' : 'warning'}>
                    {twoFAEnabled ? 'ENABLED' : 'DISABLED'}
                  </Badge>
                </div>
                <p className="text-muted text-sm mt-1">
                  Use Google Authenticator, Authy, or any TOTP app for one-time codes.
                </p>
              </div>
            </div>
            <Switch checked={twoFAEnabled} onCheckedChange={setTwoFAEnabled} />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-black/20 border border-white/5 p-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-info/15 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-info" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-white font-semibold">New Login Alerts</h4>
                  <Badge variant={loginAlerts ? 'success' : 'muted'}>
                    {loginAlerts ? 'ON' : 'OFF'}
                  </Badge>
                </div>
                <p className="text-muted text-sm mt-1">
                  Receive email alerts when a new login occurs on your account.
                </p>
              </div>
            </div>
            <Switch checked={loginAlerts} onCheckedChange={setLoginAlerts} />
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <GlassHeader>
          <div>
            <h3 className="text-white font-semibold text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-gold" />
              Active Sessions
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">
              Review and manage active login sessions
            </p>
          </div>
        </GlassHeader>
        <div className="space-y-3 p-5">
          {[
            { id: 's1', device: 'Chrome on Windows', location: 'New York, USA', ip: '203.0.113.42', current: true, date: new Date().toISOString() },
            { id: 's2', device: 'Safari on iOS', location: 'London, UK', ip: '198.51.100.17', current: false, date: new Date(Date.now() - 86400000).toISOString() },
            { id: 's3', device: 'Firefox on macOS', location: 'Berlin, DE', ip: '192.0.2.88', current: false, date: new Date(Date.now() - 3 * 86400000).toISOString() },
          ].map((session) => (
            <div
              key={session.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-black/20 border border-white/5 p-4 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                  session.current ? 'bg-success/15' : 'bg-muted/20'
                )}>
                  <Activity className={cn('w-5 h-5', session.current ? 'text-success' : 'text-muted')} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-white font-medium">{session.device}</h4>
                    {session.current && <Badge variant="success">CURRENT</Badge>}
                  </div>
                  <p className="text-muted text-sm mt-0.5 truncate">
                    {session.location} · IP: {session.ip} · {formatDate(session.date)}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Trash2 className="w-4 h-4 text-danger" />}
                disabled={session.current}
                onClick={() => toast.success('Session terminated')}
              >
                Terminate
              </Button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );

  // ---- Verification Tab ----
  const filteredPending = React.useMemo(() => {
    if (!verifySearch) return pendingUsers;
    const s = verifySearch.toLowerCase();
    return pendingUsers.filter(
      (u) =>
        u.username.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.id.toLowerCase().includes(s)
    );
  }, [pendingUsers, verifySearch]);

  const kycBadge = (status: UserType['kycStatus']) => {
    switch (status) {
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

  const verifyColumns: Column<UserType>[] = [
    {
      key: 'user',
      header: 'User',
      width: '240px',
      cell: (row) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar fallback={row.username.slice(0, 2).toUpperCase()} size="sm" />
          <div className="min-w-0">
            <p className="text-white/90 truncate font-medium">{row.username}</p>
            <p className="text-muted text-xs truncate">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'kyc',
      header: 'KYC Status',
      width: '140px',
      cell: (row) => kycBadge(row.kycStatus),
    },
    {
      key: 'balance',
      header: 'Balance',
      width: '140px',
      className: 'text-right',
      cell: (row) => (
        <span className="text-white font-semibold text-right block">
          {formatCurrency(row.balance)}
        </span>
      ),
    },
    {
      key: 'registered',
      header: 'Registered',
      width: '140px',
      cell: (row) => <span className="text-gray-300 text-sm">{formatDate(row.registeredAt)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '220px',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<CheckCircle2 className="w-4 h-4 text-success" />}
            disabled={row.kycStatus === 'verified'}
            onClick={(e) => {
              e.stopPropagation();
              handleVerifyAction('approve', row);
            }}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<XCircle className="w-4 h-4 text-danger" />}
            disabled={row.kycStatus === 'rejected'}
            onClick={(e) => {
              e.stopPropagation();
              handleVerifyAction('reject', row);
            }}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  const renderVerificationTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/15 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div className="min-w-0">
              <p className="text-muted text-xs">Pending</p>
              <p className="text-white font-bold text-xl">{pendingUsers.filter(u => u.kycStatus === 'pending').length}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/15 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5 text-success" />
            </div>
            <div className="min-w-0">
              <p className="text-muted text-xs">Verified</p>
              <p className="text-white font-bold text-xl">{loading ? '—' : Math.floor(Math.random() * 4000 + 10000)}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-danger/15 flex items-center justify-center shrink-0">
              <FileX2 className="w-5 h-5 text-danger" />
            </div>
            <div className="min-w-0">
              <p className="text-muted text-xs">Rejected</p>
              <p className="text-white font-bold text-xl">{Math.floor(Math.random() * 200 + 50)}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted/20 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-muted" />
            </div>
            <div className="min-w-0">
              <p className="text-muted text-xs">Unverified</p>
              <p className="text-white font-bold text-xl">{pendingUsers.filter(u => u.kycStatus === 'unverified').length}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
          <Input
            label="Search Users"
            placeholder="Username, email, or ID..."
            value={verifySearch}
            onChange={(e) => setVerifySearch(e.target.value)}
            leftIcon={<User className="w-4 h-4 text-muted" />}
          />
          <div className="flex justify-end">
            <Button
              variant="default"
              size="md"
              leftIcon={<RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />}
              onClick={handleRetry}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Refresh
            </Button>
          </div>
        </div>
      </GlassCard>

      {loading && filteredPending.length === 0 ? (
        <GlassCard>
          <GlassHeader title="KYC Verification Queue" />
          <SkeletonRows count={8} columns={5} />
        </GlassCard>
      ) : filteredPending.length === 0 ? (
        <EmptyState
          icon={TicketCheck}
          title="No pending verifications"
          description={
            pendingUsers.length === 0
              ? 'All users have been reviewed. Great job!'
              : 'Try adjusting your search query.'
          }
        />
      ) : (
        <DataTable<UserType>
          columns={verifyColumns}
          data={filteredPending}
          rowKey={(row) => row.id}
          title="KYC Verification Queue"
          page={verificationPage}
          pageSize={10}
          onPageChange={setVerificationPage}
          loading={loading}
          headerRight={
            <span className="text-sm text-muted">
              Total: <span className="text-white font-semibold">{filteredPending.length}</span>
            </span>
          }
        />
      )}

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, action: 'approve', user: null })}
        onConfirm={confirmVerify}
        title={confirm.action === 'approve' ? 'Approve KYC Verification' : 'Reject KYC Verification'}
        description={
          confirm.user
            ? `${confirm.action === 'approve' ? 'Approve' : 'Reject'} KYC for user ${confirm.user.username} (${confirm.user.email})?`
            : ''
        }
        confirmText={confirm.action === 'approve' ? 'Approve' : 'Reject'}
        confirmVariant={confirm.action === 'approve' ? 'primary' : 'danger'}
      />
    </div>
  );

  // ---- Preferences Tab ----
  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <GlassCard>
        <GlassHeader>
          <div>
            <h3 className="text-white font-semibold text-base flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-gold" />
              Display & Localization
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">
              Personalize your admin dashboard appearance and formats
            </p>
          </div>
        </GlassHeader>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-gold" /> : <Sun className="w-4 h-4 text-gold" />}
              Theme
            </label>
            <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
              {THEME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gold" />
              Display Currency
            </label>
            <Select value={displayCurrency} onChange={(e) => setDisplayCurrency(e.target.value)}>
              {CURRENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              Timezone
            </label>
            <Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
              {TIMEZONE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-2">
              <Languages className="w-4 h-4 text-gold" />
              Language
            </label>
            <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <GlassHeader>
          <div>
            <h3 className="text-white font-semibold text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-gold" />
              Notifications
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">
              Configure in-app and browser notifications
            </p>
          </div>
        </GlassHeader>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-black/20 border border-white/5 p-4">
            <div className="min-w-0 pr-4">
              <h4 className="text-white font-medium">Push Notifications</h4>
              <p className="text-muted text-sm mt-0.5">Receive browser push notifications for alerts.</p>
            </div>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-black/20 border border-white/5 p-4">
            <div className="min-w-0 pr-4">
              <h4 className="text-white font-medium">Sound Effects</h4>
              <p className="text-muted text-sm mt-0.5">Play sounds on alerts, toasts, and actions.</p>
            </div>
            <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
          </div>
        </div>
      </GlassCard>

      <div className="flex justify-end">
        <Button variant="primary" onClick={() => void handleSave()} loading={saving} leftIcon={<Save className="w-4 h-4" />}>
          Save Preferences
        </Button>
      </div>
    </div>
  );

  // ---- Offers Tab ----
  const renderOffersTab = () => (
    <div className="space-y-6">
      <GlassCard>
        <GlassHeader>
          <div>
            <h3 className="text-white font-semibold text-base flex items-center gap-2">
              <Gift className="w-5 h-5 text-gold" />
              Welcome Bonus
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">
              Configure the new player welcome bonus package
            </p>
          </div>
        </GlassHeader>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-black/20 border border-white/5 p-4">
            <div className="min-w-0 pr-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-white font-medium">Enable Welcome Bonus</h4>
                <Badge variant={welcomeBonusEnabled ? 'success' : 'muted'}>
                  {welcomeBonusEnabled ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>
              <p className="text-muted text-sm mt-0.5">First deposit match for newly registered users.</p>
            </div>
            <Switch checked={welcomeBonusEnabled} onCheckedChange={setWelcomeBonusEnabled} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Match Percentage (%)"
              type="number"
              value={welcomeBonusAmount}
              onChange={(e) => setWelcomeBonusAmount(e.target.value)}
              leftIcon={<PercentBadge />}
            />
            <Input
              label="Maximum Bonus (USDT)"
              type="number"
              value={welcomeBonusMax}
              onChange={(e) => setWelcomeBonusMax(e.target.value)}
              leftIcon={<DollarSign className="w-4 h-4 text-muted" />}
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <GlassHeader>
          <div>
            <h3 className="text-white font-semibold text-base flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gold" />
              Cashback & Reload Bonuses
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">
              Configure recurring bonus programs
            </p>
          </div>
        </GlassHeader>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-black/20 border border-white/5 p-4">
            <div className="min-w-0 pr-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-white font-medium">Weekly Cashback</h4>
                <Badge variant={cashbackEnabled ? 'success' : 'muted'}>
                  {cashbackEnabled ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>
              <p className="text-muted text-sm mt-0.5">Loss-based cashback credited every Monday.</p>
            </div>
            <Switch checked={cashbackEnabled} onCheckedChange={setCashbackEnabled} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Cashback Rate (%)"
              type="number"
              value={cashbackPercent}
              onChange={(e) => setCashbackPercent(e.target.value)}
              leftIcon={<PercentBadge />}
            />
            <div></div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-black/20 border border-white/5 p-4">
            <div className="min-w-0 pr-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-white font-medium">Weekend Reload Bonus</h4>
                <Badge variant={weeklyReloadEnabled ? 'success' : 'muted'}>
                  {weeklyReloadEnabled ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>
              <p className="text-muted text-sm mt-0.5">Saturday & Sunday deposit match bonus.</p>
            </div>
            <Switch checked={weeklyReloadEnabled} onCheckedChange={setWeeklyReloadEnabled} />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-black/20 border border-white/5 p-4">
            <div className="min-w-0 pr-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-white font-medium">Free Spins Friday</h4>
                <Badge variant={freeSpinsEnabled ? 'success' : 'muted'}>
                  {freeSpinsEnabled ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>
              <p className="text-muted text-sm mt-0.5">Weekly free spins on featured slots.</p>
            </div>
            <Switch checked={freeSpinsEnabled} onCheckedChange={setFreeSpinsEnabled} />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-black/20 border border-white/5 p-4">
            <div className="min-w-0 pr-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-white font-medium">Referral Bonus</h4>
                <Badge variant={referralBonusEnabled ? 'success' : 'muted'}>
                  {referralBonusEnabled ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>
              <p className="text-muted text-sm mt-0.5">Rewards for referring new registered users.</p>
            </div>
            <Switch checked={referralBonusEnabled} onCheckedChange={setReferralBonusEnabled} />
          </div>
        </div>
      </GlassCard>

      <div className="flex justify-end">
        <Button variant="primary" onClick={() => void handleSave()} loading={saving} leftIcon={<Save className="w-4 h-4" />}>
          Save Offers
        </Button>
      </div>
    </div>
  );

  // ---- Site Settings Tab ----
  const renderSiteTab = () => (
    <div className="space-y-6">
      <GlassCard>
        <GlassHeader>
          <div>
            <h3 className="text-white font-semibold text-base flex items-center gap-2">
              <Globe className="w-5 h-5 text-gold" />
              Site Information
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">
              Global site identity, branding, and contact details
            </p>
          </div>
        </GlassHeader>
        <div className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gold-gradient flex items-center justify-center text-black font-black text-3xl shadow-gold">
                RB
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gold-gradient text-black flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
                <Upload className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <h4 className="text-white font-semibold text-xl">{siteName}</h4>
              <p className="text-muted text-sm line-clamp-2">{siteDescription}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Site Name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              leftIcon={<Globe className="w-4 h-4 text-muted" />}
            />
            <Input
              label="Support Email"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-muted" />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Site Description</label>
            <Textarea
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">SEO Keywords (comma separated)</label>
            <Textarea
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <GlassHeader>
          <div>
            <h3 className="text-white font-semibold text-base flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gold" />
              Active Currencies
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">
              Select which deposit/withdrawal currencies are enabled on the platform
            </p>
          </div>
        </GlassHeader>
        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {ACTIVE_CURRENCIES.map((currency) => {
              const active = enabledCurrencies.includes(currency);
              return (
                <button
                  key={currency}
                  type="button"
                  onClick={() => toggleCurrency(currency)}
                  className={cn(
                    'px-4 py-2 rounded-xl border transition-all font-medium text-sm',
                    active
                      ? 'bg-gold-gradient text-black border-gold shadow-gold/30 shadow'
                      : 'bg-black/20 text-muted border-white/10 hover:border-gold/50 hover:text-gold'
                  )}
                >
                  {currency}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <Select
                label="Add Custom Currency"
                value={newCurrency}
                onChange={(e) => setNewCurrency(e.target.value)}
              >
                <option value="">Select a currency...</option>
                {['XRP', 'ADA', 'DOGE', 'TRX', 'LTC', 'MATIC', 'DOT'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </div>
            <Button
              variant="default"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={addCurrency}
              disabled={!newCurrency || enabledCurrencies.includes(newCurrency)}
              className="w-full sm:w-auto"
            >
              Add
            </Button>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <GlassHeader>
          <div>
            <h3 className="text-white font-semibold text-base flex items-center gap-2">
              <ToggleLeft className="w-5 h-5 text-gold" />
              Maintenance & Status
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">
              Control site-wide availability and maintenance mode
            </p>
          </div>
        </GlassHeader>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-black/20 border border-white/5 p-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                maintenanceMode ? 'bg-danger/15' : 'bg-success/15'
              )}>
                <AlertTriangle className={cn('w-5 h-5', maintenanceMode ? 'text-danger' : 'text-success')} />
              </div>
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-white font-medium">Maintenance Mode</h4>
                  <Badge variant={maintenanceMode ? 'danger' : 'success'}>
                    {maintenanceMode ? 'ACTIVE' : 'OFF'}
                  </Badge>
                </div>
                <p className="text-muted text-sm mt-0.5">
                  {maintenanceMode
                    ? 'Public site shows maintenance page. Only admins can access.'
                    : 'Site is fully operational for all users.'}
                </p>
              </div>
            </div>
            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          </div>
        </div>
      </GlassCard>

      <div className="flex justify-end">
        <Button variant="primary" onClick={() => void handleSave()} loading={saving} leftIcon={<Save className="w-4 h-4" />}>
          Save Site Settings
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent gold-text">
            Settings
          </h1>
          <p className="mt-1.5 text-muted text-sm sm:text-base">
            Configure admin account, security, verification queue, preferences, offers, and site-wide options.
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

      {error && activeTab === 'verification' && (
        <GlassCard className="border-danger/40">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-danger/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5.5 h-5.5 text-danger" />
              </div>
              <div className="min-w-0">
                <h4 className="text-white font-semibold">Failed to load settings</h4>
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
        tabs={SETTINGS_TABS}
        activeKey={activeTab}
        onChange={(k) => setActiveTab(k as TabKey)}
        variant="pills"
      />

      {activeTab === 'account' && renderAccountTab()}
      {activeTab === 'security' && renderSecurityTab()}
      {activeTab === 'verification' && renderVerificationTab()}
      {activeTab === 'preferences' && renderPreferencesTab()}
      {activeTab === 'offers' && renderOffersTab()}
      {activeTab === 'site' && renderSiteTab()}
    </div>
  );
}

function PercentBadge() {
  return <span className="text-muted font-bold">%</span>;
}
