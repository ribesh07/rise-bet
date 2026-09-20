'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  RefreshCw,
  Plus,
  Pencil,
  Users,
  Coins,
  TrendingUp,
  Activity,
  AlertTriangle,
  Save,
  Search,
  X,
  Target,
} from 'lucide-react';

import { GlassCard, GlassHeader } from '@/components/ui/GlassCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Switch } from '@/components/ui/Switch';

import { fetchGames } from '@/lib/api';
import type { GameSummary } from '@/lib/types';
import {
  formatNumber,
  formatCurrency,
  cn,
} from '@/lib/utils';

const GAME_CATEGORY_MAP: Record<string, { label: string; variant: 'success' | 'info' | 'warning' | 'default' | 'pill' | 'gold' }> = {
  slots: { label: 'Slots', variant: 'default' },
  slot: { label: 'Slots', variant: 'default' },
  table: { label: 'Table', variant: 'info' },
  live: { label: 'Live', variant: 'warning' },
  crash: { label: 'Crash', variant: 'success' },
  dice: { label: 'Dice', variant: 'pill' },
  sports: { label: 'Sports', variant: 'info' },
  virtuals: { label: 'Virtuals', variant: 'warning' },
  other: { label: 'Other', variant: 'pill' },
};

const CATEGORY_OPTIONS = [
  { value: 'slots', label: 'Slots' },
  { value: 'table', label: 'Table Games' },
  { value: 'live', label: 'Live Casino' },
  { value: 'crash', label: 'Crash' },
  { value: 'dice', label: 'Dice' },
  { value: 'sports', label: 'Sports' },
  { value: 'virtuals', label: 'Virtuals' },
  { value: 'other', label: 'Other' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' },
  { value: 'maintenance', label: 'Maintenance' },
];

interface EditGameForm {
  id: string;
  name: string;
  category: string;
  status: GameSummary['status'];
  rtp: number;
}

const statusBadge = (status: GameSummary['status']) => {
  switch (status) {
    case 'active':
      return <Badge variant="success">ACTIVE</Badge>;
    case 'disabled':
      return <Badge variant="danger">DISABLED</Badge>;
    case 'maintenance':
      return <Badge variant="warning">MAINTENANCE</Badge>;
  }
};

const cycleStatus = (status: GameSummary['status']): GameSummary['status'] => {
  if (status === 'active') return 'disabled';
  if (status === 'disabled') return 'maintenance';
  return 'active';
};

export default function GamesPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [games, setGames] = useState<GameSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<EditGameForm | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchGames();
      if (!res.success) {
        throw new Error(res.message || 'Failed to load games');
      }
      setGames(res.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error loading games';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredGames = games.filter((g) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.key.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.id.toLowerCase().includes(q)
    );
  });

  const handleRetry = () => {
    void loadData();
  };

  const handleToggleStatus = (game: GameSummary) => {
    const next = cycleStatus(game.status);
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, status: next } : g))
    );
    toast.success(`"${game.name}" status set to ${next.toUpperCase()}`);
  };

  const handleQuickToggle = (game: GameSummary, checked: boolean) => {
    const next: GameSummary['status'] = checked ? 'active' : 'disabled';
    if (game.status === next) return;
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, status: next } : g))
    );
    toast.success(`"${game.name}" ${next === 'active' ? 'enabled' : 'disabled'}`);
  };

  const openEdit = (game: GameSummary) => {
    setEditing({
      id: game.id,
      name: game.name,
      category: game.category,
      status: game.status,
      rtp: game.rtp,
    });
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditing({
      id: '',
      name: '',
      category: 'slots',
      status: 'active',
      rtp: 96,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSave = () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      toast.error('Game name is required');
      return;
    }
    if (editing.rtp < 50 || editing.rtp > 100) {
      toast.error('RTP must be between 50 and 100');
      return;
    }

    setSaving(true);
    try {
      if (editing.id) {
        setGames((prev) =>
          prev.map((g) =>
            g.id === editing.id
              ? {
                  ...g,
                  name: editing.name.trim(),
                  category: editing.category,
                  status: editing.status,
                  rtp: editing.rtp,
                }
              : g
          )
        );
        toast.success(`"${editing.name}" updated successfully`);
      } else {
        const newGame: GameSummary = {
          id: `game-${Date.now()}`,
          name: editing.name.trim(),
          key: editing.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          category: editing.category,
          rtp: editing.rtp,
          status: editing.status,
          bets24h: 0,
          volume24h: 0,
          playersNow: 0,
        };
        setGames((prev) => [newGame, ...prev]);
        toast.success(`"${editing.name}" created successfully`);
      }
      closeModal();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save game';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent gold-text">
            Games
          </h1>
          <p className="mt-1.5 text-muted text-sm sm:text-base">
            Manage game catalog, status, RTP settings and live performance.
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
            onClick={openAdd}
          >
            Add Game
          </Button>
        </div>
      </div>

      <GlassCard className="p-4 md:p-5">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <Input
            placeholder="Search games by name, category or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </GlassCard>

      {error && (
        <GlassCard className="border-danger/40">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-danger/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5.5 h-5.5 text-danger" />
              </div>
              <div className="min-w-0">
                <h4 className="text-white font-semibold">Failed to load games</h4>
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

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="glass-card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full shrink-0 ml-3" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-border/60">
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredGames.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No games match search' : 'No games found'}
          description={
            searchQuery
              ? 'Try a different search term or clear the search box.'
              : 'Add your first game to get started.'
          }
          action={
            searchQuery
              ? { text: 'Clear search', onClick: () => setSearchQuery('') }
              : { text: 'Add Game', onClick: openAdd }
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredGames.map((game) => {
            const cat =
              GAME_CATEGORY_MAP[game.category] ||
              ({ label: game.category, variant: 'pill' } as const);
            return (
              <GlassCard key={game.id} hoverable className="p-5 flex flex-col">
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-semibold leading-tight truncate">
                      {game.name}
                    </h3>
                    <div className="mt-1.5">
                      <Badge variant={cat.variant} size="sm">
                        {cat.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Switch
                      checked={game.status === 'active'}
                      onCheckedChange={(v) => handleQuickToggle(game, v)}
                      disabled={game.status === 'maintenance'}
                    />
                    <div
                      onClick={() => handleToggleStatus(game)}
                      className="cursor-pointer"
                      title="Click to cycle: active → disabled → maintenance"
                    >
                      {statusBadge(game.status)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-muted text-xs shrink-0">
                      <Activity className="w-3.5 h-3.5" />
                      <span>RTP</span>
                    </div>
                    <span className="text-white font-semibold text-sm">
                      {game.rtp.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-muted text-xs shrink-0">
                      <Target className="w-3.5 h-3.5" />
                      <span>24h Bets</span>
                    </div>
                    <span className="text-white font-medium text-sm">
                      {formatNumber(game.bets24h)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-muted text-xs shrink-0">
                      <Coins className="w-3.5 h-3.5" />
                      <span>24h Volume</span>
                    </div>
                    <span className="text-white font-medium text-sm">
                      {formatCurrency(game.volume24h)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-muted text-xs shrink-0">
                      <Users className="w-3.5 h-3.5" />
                      <span>Online</span>
                    </div>
                    <span
                      className={cn(
                        'font-medium text-sm',
                        game.playersNow > 100 ? 'text-success' : 'text-white'
                      )}
                    >
                      {formatNumber(game.playersNow)}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Pencil className="w-3.5 h-3.5" />}
                    onClick={() => openEdit(game)}
                    className="w-full"
                  >
                    Edit game
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing?.id ? 'Edit Game' : 'Add New Game'}
        description={
          editing?.id
            ? 'Update game configuration and status.'
            : 'Configure a new game entry in the catalog.'
        }
        maxWidthClass="max-w-lg"
      >
        {editing && (
          <div className="space-y-4">
            <Input
              label="Game Name"
              placeholder="e.g. Gates of Olympus"
              value={editing.name}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Category"
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Status"
                value={editing.status}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    status: e.target.value as GameSummary['status'],
                  })
                }
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            <Input
              label="RTP (%)"
              type="number"
              min={50}
              max={100}
              step={0.01}
              placeholder="96.00"
              value={editing.rtp.toString()}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  rtp: parseFloat(e.target.value) || 0,
                })
              }
            />
            <div className="pt-2">
              <div className="glass-card p-4 bg-card/50 border border-border/60 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-gold" />
                  <span className="text-sm font-medium text-white">
                    Live Metrics
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted text-xs">24h Bets</p>
                    <p className="text-white font-medium">
                      {editing.id
                        ? formatNumber(
                            games.find((g) => g.id === editing.id)?.bets24h ||
                              0
                          )
                        : '0'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted text-xs">24h Volume</p>
                    <p className="text-white font-medium">
                      {editing.id
                        ? formatCurrency(
                            games.find((g) => g.id === editing.id)?.volume24h ||
                              0
                          )
                        : '$0.00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted text-xs">Online</p>
                    <p className="text-white font-medium">
                      {editing.id
                        ? formatNumber(
                            games.find((g) => g.id === editing.id)
                              ?.playersNow || 0
                          )
                        : '0'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
              <Button
                variant="ghost"
                size="md"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                leftIcon={<Save className="w-4 h-4" />}
                onClick={handleSave}
                loading={saving}
              >
                {editing.id ? 'Save Changes' : 'Create Game'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
