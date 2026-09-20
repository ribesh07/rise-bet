'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Search,
  Ban,
  Clock,
  Wallet,
  FileText,
  Plus,
  Edit3,
  Calendar,
  User as UserIcon,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { GlassCard, GlassHeader } from '@/components/ui/GlassCard';
import { SkeletonRows } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

import { fetchResponsibleItems } from '@/lib/api';
import type { ResponsibleItem } from '@/lib/types';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

type TabKey = 'self-exclusion' | 'cooling-off' | 'deposit-limits' | 'content';

const RG_TABS = [
  { key: 'self-exclusion', label: 'Self-Exclusions', icon: Ban },
  { key: 'cooling-off', label: 'Cooling-Off', icon: Clock },
  { key: 'deposit-limits', label: 'Deposit Limits', icon: Wallet },
  { key: 'content', label: 'Content Editor', icon: FileText },
];

const RG_STATUS: Record<ResponsibleItem['status'], { label: string; variant: 'success' | 'warning' | 'muted' }> = {
  active: { label: 'Active', variant: 'warning' },
  ended: { label: 'Ended', variant: 'muted' },
  revoked: { label: 'Revoked', variant: 'success' },
};

interface ContentSection {
  id: string;
  title: string;
  body: string;
}

const INITIAL_CONTENT: ContentSection[] = [
  {
    id: 'intro',
    title: 'Introduction to Responsible Gambling',
    body: 'Gambling should be entertaining and not seen as a way to make money. Please gamble responsibly.',
  },
  {
    id: 'limits',
    title: 'Setting Limits',
    body: 'You can set deposit, wager, and loss limits from your account settings at any time.',
  },
  {
    id: 'selfexclusion',
    title: 'Self-Exclusion Program',
    body: 'If gambling is no longer fun, you can request a self-exclusion period of 6 months to 5 years.',
  },
];

interface FAQContent {
  id: string;
  question: string;
  answer: string;
}

const INITIAL_FAQS: FAQContent[] = [
  { id: 'faq-1', question: 'How do I set a deposit limit?', answer: 'Go to Account Settings > Responsible Gaming > Deposit Limits.' },
  { id: 'faq-2', question: 'Can I cancel my self-exclusion early?', answer: 'Early reactivation is possible after a 24-hour cooling-off period by contacting support.' },
];

export default function ResponsibleGamblingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('self-exclusion');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ResponsibleItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const [contentSections, setContentSections] = useState<ContentSection[]>(INITIAL_CONTENT);
  const [faqs, setFaqs] = useState<FAQContent[]>(INITIAL_FAQS);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [sectionForm, setSectionForm] = useState({ id: '', title: '', body: '' });
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQContent | null>(null);
  const [faqForm, setFaqForm] = useState({ id: '', question: '', answer: '' });
  const [savingContent, setSavingContent] = useState(false);

  const [confirm, setConfirm] = useState<{
    open: boolean;
    action: 'reactivate' | 'extend';
    item: ResponsibleItem | null;
    extraDays?: number;
  }>({ open: false, action: 'reactivate', item: null });

  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [extendDays, setExtendDays] = useState<string>('30');
  const [extendItem, setExtendItem] = useState<ResponsibleItem | null>(null);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchResponsibleItems();
      if (!res.success) throw new Error(res.message || 'Failed to load responsible gambling data');
      setItems(res.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
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
  }, [activeTab, statusFilter, search]);

  const handleRetry = () => void loadData();

  const tabItems = React.useMemo(() => {
    if (activeTab === 'content') return [];
    const typeMap: Record<Exclude<TabKey, 'content'>, ResponsibleItem['type']> = {
      'self-exclusion': 'self-exclusion',
      'cooling-off': 'cooling-off',
      'deposit-limits': 'deposit-limit',
    };
    return items.filter((i) => i.type === typeMap[activeTab as Exclude<TabKey, 'content'>]);
  }, [items, activeTab]);

  const filteredItems = React.useMemo(() => {
    return tabItems.filter((item) => {
      if (statusFilter && item.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!item.username.toLowerCase().includes(s) && !item.userId.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [tabItems, statusFilter, search]);

  const activeCount = tabItems.filter((i) => i.status === 'active').length;
  const totalsByTab = React.useMemo(() => {
    return {
      'self-exclusion': items.filter((i) => i.type === 'self-exclusion').length,
      'cooling-off': items.filter((i) => i.type === 'cooling-off').length,
      'deposit-limits': items.filter((i) => i.type === 'deposit-limit').length,
    };
  }, [items]);

  const userCol: Column<ResponsibleItem> = {
    key: 'user',
    header: 'User',
    width: '220px',
    cell: (row) => (
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-xs font-bold text-gold shrink-0">
          {row.username.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-white/90 truncate font-medium">{row.username}</p>
          <p className="text-muted text-xs truncate">ID: {row.userId}</p>
        </div>
      </div>
    ),
  };

  const reasonCol: Column<ResponsibleItem> = {
    key: 'reason',
    header: 'Reason',
    cell: (row) => (
      <span className="text-gray-300 text-sm">{row.reason || '—'}</span>
    ),
  };

  const dateCol = (key: 'startAt' | 'endAt', label: string): Column<ResponsibleItem> => ({
    key,
    header: label,
    width: '150px',
    cell: (row) => (
      <div className="flex items-center gap-1.5 text-sm text-gray-300">
        <Calendar className="w-3.5 h-3.5 text-muted shrink-0" />
        <span>{formatDate(row[key])}</span>
      </div>
    ),
  });

  const statusCol: Column<ResponsibleItem> = {
    key: 'status',
    header: 'Status',
    width: '120px',
    cell: (row) => {
      const s = RG_STATUS[row.status];
      return <Badge variant={s.variant}>{s.label}</Badge>;
    },
  };

  const limitCol: Column<ResponsibleItem> = {
    key: 'limitAmount',
    header: 'Limit Amount',
    width: '140px',
    className: 'text-right',
    cell: (row) => (
      <span className="text-white font-semibold text-right block">
        {activeTab === 'deposit-limits' && row.limitAmount ? formatCurrency(row.limitAmount) + ' / day' : '—'}
      </span>
    ),
  };

  const actionsCol: Column<ResponsibleItem> = {
    key: 'actions',
    header: 'Actions',
    width: '240px',
    className: 'text-right',
    cell: (row) => (
      <div className="flex items-center justify-end gap-1.5 flex-wrap">
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<CheckCircle2 className="w-4 h-4 text-success" />}
          disabled={row.status !== 'active'}
          onClick={(e) => {
            e.stopPropagation();
            setConfirm({ open: true, action: 'reactivate', item: row });
          }}
        >
          Reactivate
        </Button>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<Clock className="w-4 h-4 text-info" />}
          disabled={row.status !== 'active'}
          onClick={(e) => {
            e.stopPropagation();
            setExtendItem(row);
            setExtendDays('30');
            setExtendModalOpen(true);
          }}
        >
          Extend
        </Button>
      </div>
    ),
  };

  const baseColumns: Column<ResponsibleItem>[] = [
    userCol,
    ...(activeTab !== 'deposit-limits' ? [reasonCol] : []),
    dateCol('startAt', 'Start Date'),
    dateCol('endAt', 'End Date'),
    ...(activeTab === 'deposit-limits' ? [limitCol] : []),
    statusCol,
    actionsCol,
  ];

  const confirmReactivate = () => {
    const item = confirm.item;
    if (!item) return;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'revoked', endAt: new Date().toISOString() } : i))
    );
    toast.success(`User ${item.username} has been reactivated early`);
  };

  const handleExtendConfirm = () => {
    const item = extendItem;
    if (!item) return;
    const days = Number(extendDays);
    if (isNaN(days) || days <= 0) {
      toast.error('Please enter a valid number of days');
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== item.id) return i;
        const cur = new Date(i.endAt);
        cur.setDate(cur.getDate() + days);
        return { ...i, endAt: cur.toISOString() };
      })
    );
    toast.success(`Extended ${item.username}'s period by ${days} days`);
    setExtendModalOpen(false);
    setExtendItem(null);
  };

  const openAddSection = () => {
    setEditingSection(null);
    setSectionForm({ id: '', title: '', body: '' });
    setContentModalOpen(true);
  };

  const openEditSection = (sec: ContentSection) => {
    setEditingSection(sec);
    setSectionForm({ id: sec.id, title: sec.title, body: sec.body });
    setContentModalOpen(true);
  };

  const saveSection = async () => {
    if (!sectionForm.title.trim()) {
      toast.error('Section title is required');
      return;
    }
    setSavingContent(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      if (editingSection) {
        setContentSections((prev) =>
          prev.map((s) => (s.id === editingSection.id ? { ...s, title: sectionForm.title, body: sectionForm.body } : s))
        );
        toast.success('Section updated');
      } else {
        setContentSections((prev) => [
          ...prev,
          { id: `sec-${Date.now()}`, title: sectionForm.title, body: sectionForm.body },
        ]);
        toast.success('Section added');
      }
      setContentModalOpen(false);
    } finally {
      setSavingContent(false);
    }
  };

  const openAddFaq = () => {
    setEditingFaq(null);
    setFaqForm({ id: '', question: '', answer: '' });
    setFaqModalOpen(true);
  };

  const openEditFaq = (f: FAQContent) => {
    setEditingFaq(f);
    setFaqForm({ id: f.id, question: f.question, answer: f.answer });
    setFaqModalOpen(true);
  };

  const saveFaq = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      toast.error('Both question and answer are required');
      return;
    }
    setSavingContent(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      if (editingFaq) {
        setFaqs((prev) => prev.map((f) => (f.id === editingFaq.id ? { ...f, ...faqForm } : f)));
        toast.success('FAQ updated');
      } else {
        setFaqs((prev) => [...prev, { ...faqForm, id: `faq-${Date.now()}` }]);
        toast.success('FAQ added');
      }
      setFaqModalOpen(false);
    } finally {
      setSavingContent(false);
    }
  };

  const saveAllContent = async () => {
    setSavingContent(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success('Responsible gambling content saved successfully');
    } finally {
      setSavingContent(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent gold-text">
            Responsible Gambling
          </h1>
          <p className="mt-1.5 text-muted text-sm sm:text-base">
            Monitor self-exclusions, cooling-off periods, deposit limits, and RG content.
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

      {error && activeTab !== 'content' && (
        <GlassCard className="border-danger/40">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-danger/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5.5 h-5.5 text-danger" />
              </div>
              <div className="min-w-0">
                <h4 className="text-white font-semibold">Failed to load data</h4>
                <p className="text-muted text-sm mt-0.5 truncate">{error}</p>
              </div>
            </div>
            <Button variant="default" size="md" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </GlassCard>
      )}

      {activeTab !== 'content' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={ShieldCheck}
            title="Self Exclusions"
            value={String(totalsByTab['self-exclusion'])}
            delta={totalsByTab['self-exclusion'] > 0 ? 2.4 : undefined}
          />
          <StatCard
            icon={Clock}
            title="Cooling-Off"
            value={String(totalsByTab['cooling-off'])}
            delta={totalsByTab['cooling-off'] > 0 ? -1.2 : undefined}
          />
          <StatCard
            icon={Wallet}
            title="Deposit Limits"
            value={String(totalsByTab['deposit-limits'])}
            delta={totalsByTab['deposit-limits'] > 0 ? 5.1 : undefined}
          />
          <StatCard icon={UserIcon} title="Active Restrictions" value={String(activeCount)} accent />
        </div>
      )}

      <Tabs
        tabs={RG_TABS}
        activeKey={activeTab}
        onChange={(k) => setActiveTab(k as TabKey)}
        variant="pills"
      />

      {activeTab === 'content' ? (
        <div className="space-y-6">
          <GlassCard>
            <GlassHeader
              action={
                <div className="flex gap-2">
                  <Button variant="default" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={openAddSection}>
                    Add Section
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => void saveAllContent()} loading={savingContent}>
                    Save All
                  </Button>
                </div>
              }
            >
              <div>
                <h3 className="text-white font-semibold text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gold" />
                  Content Sections
                </h3>
                <p className="text-muted text-xs sm:text-sm mt-0.5">
                  Educational content shown on the Responsible Gaming public page
                </p>
              </div>
            </GlassHeader>
            <div className="space-y-3">
              {contentSections.map((sec) => (
                <div
                  key={sec.id}
                  className="rounded-xl bg-black/20 border border-white/5 p-4 flex items-start justify-between gap-4 hover:border-gold/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                      {sec.title}
                    </h4>
                    <p className="text-gray-300 text-sm mt-1.5 leading-relaxed">{sec.body}</p>
                  </div>
                  <button
                    onClick={() => openEditSection(sec)}
                    className="p-2 rounded-lg hover:bg-white/10 text-muted hover:text-gold transition-colors shrink-0"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {contentSections.length === 0 && (
                <EmptyState
                  icon={FileText}
                  title="No content sections yet"
                  description="Add your first educational section."
                  action={{ text: 'Add Section', onClick: openAddSection }}
                />
              )}
            </div>
          </GlassCard>

          <GlassCard>
            <GlassHeader
              action={
                <Button variant="default" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={openAddFaq}>
                  Add FAQ
                </Button>
              }
            >
              <div>
                <h3 className="text-white font-semibold text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gold" />
                  Responsible Gambling FAQs
                </h3>
                <p className="text-muted text-xs sm:text-sm mt-0.5">
                  Frequently asked questions displayed on the RG page
                </p>
              </div>
            </GlassHeader>
            <div className="space-y-2">
              {faqs.map((f) => (
                <div
                  key={f.id}
                  className="rounded-xl bg-black/20 border border-white/5 p-4 flex items-start justify-between gap-4 hover:border-gold/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-sm">{f.question}</h4>
                    <p className="text-gray-300 text-sm mt-1.5">{f.answer}</p>
                  </div>
                  <button
                    onClick={() => openEditFaq(f)}
                    className="p-2 rounded-lg hover:bg-white/10 text-muted hover:text-gold transition-colors shrink-0"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {faqs.length === 0 && (
                <EmptyState
                  icon={FileText}
                  title="No FAQs yet"
                  description="Add your first RG FAQ."
                  action={{ text: 'Add FAQ', onClick: openAddFaq }}
                />
              )}
            </div>
          </GlassCard>
        </div>
      ) : loading && filteredItems.length === 0 ? (
        <GlassCard>
          <GlassHeader title={RG_TABS.find((t) => t.key === activeTab)?.label + ' Records'} />
          <SkeletonRows count={8} columns={6} />
        </GlassCard>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No records found"
          description={
            tabItems.length === 0
              ? `No ${RG_TABS.find((t) => t.key === activeTab)?.label?.toLowerCase() || ''} entries yet.`
              : 'Try adjusting filters or search.'
          }
          action={
            tabItems.length === 0
              ? undefined
              : {
                  text: 'Clear filters',
                  onClick: () => {
                    setStatusFilter('');
                    setSearch('');
                  },
                }
          }
        />
      ) : (
        <>
          <GlassCard>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All statuses</option>
                {Object.entries(RG_STATUS).map(([val, { label }]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </Select>
              <Input
                label="Search User"
                placeholder="Username or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                wrapperClassName="lg:col-span-2"
              />
            </div>
          </GlassCard>

          <DataTable<ResponsibleItem>
            columns={baseColumns}
            data={filteredItems}
            rowKey={(row) => row.id}
            title={RG_TABS.find((t) => t.key === activeTab)?.label + ' Records'}
            page={page}
            pageSize={10}
            onPageChange={setPage}
            loading={loading}
            headerRight={
              <span className="text-sm text-muted">
                Total: <span className="text-white font-semibold">{filteredItems.length}</span>
              </span>
            }
          />
        </>
      )}

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, action: 'reactivate', item: null })}
        onConfirm={confirmReactivate}
        title="Reactivate User Early"
        description={
          confirm.item
            ? `Reactivate ${confirm.item.username} before their scheduled end date (${formatDate(confirm.item.endAt)})? A 24-hour cooling-off will be logged.`
            : ''
        }
        confirmText="Reactivate"
        confirmVariant="primary"
      />

      <Modal
        open={extendModalOpen}
        onClose={() => {
          setExtendModalOpen(false);
          setExtendItem(null);
        }}
        title="Extend Restriction Period"
        description={extendItem ? `Add more days to ${extendItem.username}'s current restriction.` : ''}
      >
        <div className="space-y-4">
          <Input
            label="Additional Days"
            type="number"
            placeholder="30"
            value={extendDays}
            onChange={(e) => setExtendDays(e.target.value)}
          />
          <div className="rounded-lg bg-black/30 border border-white/5 p-3 text-sm text-muted">
            {extendItem && (
              <>
                Current end date:{' '}
                <span className="text-white font-semibold">{formatDate(extendItem.endAt)}</span>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2.5 pt-2 border-t border-border">
            <Button variant="outline" onClick={() => setExtendModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleExtendConfirm}>
              Extend
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={contentModalOpen}
        onClose={() => setContentModalOpen(false)}
        title={editingSection ? `Edit Section: ${editingSection.title}` : 'Add Content Section'}
        description={editingSection ? 'Update the educational content' : 'Create a new educational section for the RG page'}
        maxWidthClass="max-w-2xl"
      >
        <div className="space-y-4">
          <Input
            label="Section Title"
            placeholder="e.g. Understanding Problem Gambling"
            value={sectionForm.title}
            onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Body Content</label>
            <Textarea
              placeholder="Write educational content here..."
              value={sectionForm.body}
              onChange={(e) => setSectionForm({ ...sectionForm, body: e.target.value })}
              rows={6}
            />
          </div>
          <div className="flex justify-end gap-2.5 pt-2 border-t border-border">
            <Button variant="outline" onClick={() => setContentModalOpen(false)} disabled={savingContent}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void saveSection()} loading={savingContent}>
              {editingSection ? 'Save Changes' : 'Create Section'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={faqModalOpen}
        onClose={() => setFaqModalOpen(false)}
        title={editingFaq ? 'Edit FAQ' : 'Add FAQ'}
        description={editingFaq ? 'Update the responsible gambling FAQ entry' : 'Create a new FAQ for the RG page'}
        maxWidthClass="max-w-2xl"
      >
        <div className="space-y-4">
          <Input
            label="Question"
            placeholder="e.g. How do I self-exclude?"
            value={faqForm.question}
            onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Answer</label>
            <Textarea
              placeholder="Provide a clear, helpful answer..."
              value={faqForm.answer}
              onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2.5 pt-2 border-t border-border">
            <Button variant="outline" onClick={() => setFaqModalOpen(false)} disabled={savingContent}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void saveFaq()} loading={savingContent}>
              {editingFaq ? 'Save Changes' : 'Add FAQ'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
