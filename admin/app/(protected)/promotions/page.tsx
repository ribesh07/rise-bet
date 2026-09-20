'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Gift,
  RefreshCw,
  Plus,
  AlertTriangle,
  Edit3,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Tag,
  Calendar,
  Users,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { GlassCard, GlassHeader } from '@/components/ui/GlassCard';
import { SkeletonRows } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

import { fetchPromotions } from '@/lib/api';
import type { Promotion } from '@/lib/types';
import { formatNumber, cn } from '@/lib/utils';

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

const TYPE_VARIANT: Record<Promotion['type'], { label: string; variant: 'gold' | 'success' | 'info' | 'warning' | 'pill' }> = {
  bonus: { label: 'Bonus', variant: 'gold' },
  freespin: { label: 'Free Spins', variant: 'success' },
  cashback: { label: 'Cashback', variant: 'info' },
  raffle: { label: 'Raffle', variant: 'warning' },
  other: { label: 'Other', variant: 'pill' },
};

const STATUS_VARIANT: Record<Promotion['status'], { label: string; variant: 'muted' | 'success' | 'danger' }> = {
  draft: { label: 'Draft', variant: 'muted' },
  active: { label: 'Active', variant: 'success' },
  expired: { label: 'Expired', variant: 'danger' },
};

const VIP_TIERS = [
  { level: 0, name: 'Bronze' },
  { level: 1, name: 'Silver' },
  { level: 2, name: 'Silver II' },
  { level: 3, name: 'Gold' },
  { level: 4, name: 'Gold II' },
  { level: 5, name: 'Platinum' },
  { level: 6, name: 'Platinum II' },
  { level: 7, name: 'Diamond' },
  { level: 8, name: 'Diamond II' },
  { level: 9, name: 'Black Diamond I' },
  { level: 10, name: 'Black Diamond II' },
];

interface PromotionForm {
  title: string;
  description: string;
  type: Promotion['type'];
  bonusAmount: string;
  wageringRequirement: string;
  eligibleVipTiers: number[];
  startAt: string;
  endAt: string;
  isBanner: boolean;
  sortOrder: string;
}

const emptyForm: PromotionForm = {
  title: '',
  description: '',
  type: 'bonus',
  bonusAmount: '',
  wageringRequirement: '',
  eligibleVipTiers: [],
  startAt: '',
  endAt: '',
  isBanner: false,
  sortOrder: '0',
};

function formatDateInput(date: string): string {
  if (!date) return '';
  const d = new Date(date);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function PromotionsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [form, setForm] = useState<PromotionForm>(emptyForm);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPromotions();
      if (!res.success) throw new Error(res.message || 'Failed to load promotions');
      setPromotions(res.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error loading promotions';
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

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p: Promotion) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      type: p.type,
      bonusAmount: String(p.bonusAmount),
      wageringRequirement: String(p.wageringRequirement ?? ''),
      eligibleVipTiers: [...p.eligibleVipTiers],
      startAt: formatDateInput(p.startAt),
      endAt: formatDateInput(p.endAt),
      isBanner: p.isBanner,
      sortOrder: String(p.sortOrder),
    });
    setModalOpen(true);
  };

  const toggleTier = (level: number) => {
    setForm((f) => ({
      ...f,
      eligibleVipTiers: f.eligibleVipTiers.includes(level)
        ? f.eligibleVipTiers.filter((l) => l !== level)
        : [...f.eligibleVipTiers, level],
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      if (editing) {
        setPromotions((prev) =>
          prev.map((p) =>
            p.id === editing.id
              ? {
                  ...p,
                  title: form.title,
                  description: form.description,
                  type: form.type,
                  bonusAmount: Number(form.bonusAmount) || 0,
                  wageringRequirement: form.wageringRequirement ? Number(form.wageringRequirement) : undefined,
                  eligibleVipTiers: form.eligibleVipTiers,
                  startAt: form.startAt ? new Date(form.startAt).toISOString() : p.startAt,
                  endAt: form.endAt ? new Date(form.endAt).toISOString() : p.endAt,
                  isBanner: form.isBanner,
                  sortOrder: Number(form.sortOrder) || 0,
                }
              : p
          )
        );
        toast.success('Promotion updated successfully');
      } else {
        const newPromo: Promotion = {
          id: `promo-new-${Date.now()}`,
          title: form.title,
          description: form.description,
          type: form.type,
          bonusAmount: Number(form.bonusAmount) || 0,
          wageringRequirement: form.wageringRequirement ? Number(form.wageringRequirement) : undefined,
          eligibleVipTiers: form.eligibleVipTiers,
          startAt: form.startAt ? new Date(form.startAt).toISOString() : new Date().toISOString(),
          endAt: form.endAt ? new Date(form.endAt).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
          status: 'draft',
          claimedCount: 0,
          isBanner: form.isBanner,
          sortOrder: Number(form.sortOrder) || 0,
        };
        setPromotions((prev) => [newPromo, ...prev]);
        toast.success('Promotion created successfully');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save promotion');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (p: Promotion) => {
    setPromotions((prev) => prev.filter((x) => x.id !== p.id));
    toast.success(`Promotion "${p.title}" deleted`);
  };

  const handleToggleStatus = (p: Promotion) => {
    const next: Promotion['status'] = p.status === 'active' ? 'draft' : 'active';
    setPromotions((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: next } : x)));
    toast.success(`Promotion marked as ${next}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent gold-text">
            Promotions
          </h1>
          <p className="mt-1.5 text-muted text-sm sm:text-base">
            Manage bonuses, freespins, cashbacks, raffles and promotional campaigns.
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
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={openCreate}
          >
            Create Promotion
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
                <h4 className="text-white font-semibold">Failed to load promotions</h4>
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
        <GlassHeader
          action={
            <div className="flex items-center gap-2 text-sm text-muted">
              <Tag className="w-4 h-4 text-gold" />
              <span>{promotions.length} total</span>
            </div>
          }
        >
          <div>
            <h3 className="text-white font-semibold text-base">All Promotions</h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">Create, edit and publish player promotions</p>
          </div>
        </GlassHeader>

        {loading && !promotions.length ? (
          <SkeletonRows count={8} columns={7} />
        ) : promotions.length === 0 ? (
          <EmptyState
            icon={Gift}
            title="No promotions yet"
            description="Create your first promotion to start engaging players."
            action={{ text: 'Create Promotion', onClick: openCreate }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/30">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Title</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Claimed</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Date Range</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {promotions.map((p) => {
                  const t = TYPE_VARIANT[p.type];
                  const s = STATUS_VARIANT[p.status];
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-5 py-3.5">
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate flex items-center gap-2">
                            {p.isBanner && <span className="text-gold">★</span>}
                            {p.title}
                          </p>
                          <p className="text-xs text-muted truncate max-w-xs">{p.description}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Badge variant={t.variant}>{t.label}</Badge>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Badge variant={s.variant}>{s.label}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 text-white/90 font-medium">
                          <Users className="w-3.5 h-3.5 text-muted" />
                          {formatNumber(p.claimedCount)}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 text-xs text-muted">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(p.startAt)} → {formatDate(p.endAt)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleToggleStatus(p)}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-gold transition-colors"
                            title={p.status === 'active' ? 'Pause' : 'Activate'}
                          >
                            {p.status === 'active' ? (
                              <ToggleRight className="w-4 h-4 text-success" />
                            ) : (
                              <ToggleLeft className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-info transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEdit(p)}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-gold transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-danger transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Promotion' : 'Create Promotion'}
        description={editing ? 'Update promotion details and settings' : 'Configure a new player promotion'}
        maxWidthClass="max-w-3xl"
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title"
              placeholder="Welcome Bonus 200%"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              wrapperClassName="md:col-span-2"
            />
            <Textarea
              label="Description"
              placeholder="Short description shown to players..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              wrapperClassName="md:col-span-2"
            />
            <Select
              label="Promotion Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as Promotion['type'] })}
            >
              <option value="bonus">Bonus (Match / Reload)</option>
              <option value="freespin">Free Spins</option>
              <option value="cashback">Cashback</option>
              <option value="raffle">Raffle / Tournament</option>
              <option value="other">Other</option>
            </Select>
            <Select
              label="Banner Promotion"
              value={form.isBanner ? 'yes' : 'no'}
              onChange={(e) => setForm({ ...form, isBanner: e.target.value === 'yes' })}
            >
              <option value="no">No - regular listing</option>
              <option value="yes">Yes - featured banner</option>
            </Select>
            <Input
              label="Bonus Amount / Value"
              type="number"
              placeholder="1000"
              value={form.bonusAmount}
              onChange={(e) => setForm({ ...form, bonusAmount: e.target.value })}
            />
            <Input
              label="Wagering Requirement (x)"
              type="number"
              placeholder="40"
              value={form.wageringRequirement}
              onChange={(e) => setForm({ ...form, wageringRequirement: e.target.value })}
            />
            <Input
              label="Start Date"
              type="datetime-local"
              value={form.startAt}
              onChange={(e) => setForm({ ...form, startAt: e.target.value })}
            />
            <Input
              label="End Date"
              type="datetime-local"
              value={form.endAt}
              onChange={(e) => setForm({ ...form, endAt: e.target.value })}
            />
            <Input
              label="Sort Order"
              type="number"
              placeholder="1"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            />
            <div />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Eligible VIP Tiers
            </label>
            <div className="bg-background/50 border border-border rounded-lg p-3 flex flex-wrap gap-2">
              {VIP_TIERS.map((t) => {
                const on = form.eligibleVipTiers.includes(t.level);
                return (
                  <button
                    key={t.level}
                    type="button"
                    onClick={() => toggleTier(t.level)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-colors border',
                      on
                        ? 'bg-gold/20 text-gold border-gold/40'
                        : 'bg-card text-muted border-border hover:border-gold/30 hover:text-white'
                    )}
                  >
                    Lv{t.level} · {t.name}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-xs text-muted">
              Multi-select · leave empty for all tiers · currently {form.eligibleVipTiers.length} selected
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-border">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void handleSubmit()} loading={submitting}>
              {editing ? 'Save Changes' : 'Create Promotion'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
