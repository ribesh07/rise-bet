'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Headphones,
  RefreshCw,
  AlertTriangle,
  ArrowLeft,
  User as UserIcon,
  Calendar,
  Tag,
  Flag,
  Clock,
  Send,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Edit3,
  Save,
  UserCheck,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { GlassCard, GlassHeader } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/Skeleton';

import { fetchTicketById } from '@/lib/api';
import type { Ticket, TicketMessage } from '@/lib/types';
import { formatDate, formatDateTime, cn } from '@/lib/utils';

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
const ASSIGNEES = ['Sarah Support', 'Mike Admin', 'Alex Manager', 'Unassign'];

export default function SupportTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = String(params?.id || '');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState<string>('');
  const [internalNote, setInternalNote] = useState<string>('');
  const [showInternal, setShowInternal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<'reply' | 'note' | null>(null);

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<{
    status: Ticket['status'];
    priority: Ticket['priority'];
    assignee: string;
    category: string;
  }>({ status: 'open', priority: 'medium', assignee: '', category: 'Account' });
  const [savingEdit, setSavingEdit] = useState<boolean>(false);

  const [confirmClose, setConfirmClose] = useState<boolean>(false);
  const [messages, setMessages] = useState<TicketMessage[]>([]);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTicketById(ticketId);
      if (!res.success || !res.data) {
        throw new Error(res.message || `Ticket ${ticketId} not found`);
      }
      const t = res.data;
      setTicket(t);
      setMessages(t.messages || []);
      setEditForm({
        status: t.status,
        priority: t.priority,
        assignee: t.assignee || 'Unassign',
        category: t.category,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error loading ticket';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    if (ticketId) void loadData();
  }, [loadData, ticketId]);

  const handleRetry = () => void loadData();

  const handleSendReply = async () => {
    if (!reply.trim()) {
      toast.error('Please enter a reply message');
      return;
    }
    setSubmitting('reply');
    try {
      await new Promise((r) => setTimeout(r, 500));
      const newMsg: TicketMessage = {
        id: `msg-${Date.now()}`,
        ticketId,
        authorName: 'Admin',
        authorRole: 'admin',
        body: reply.trim(),
        createdAt: new Date().toISOString(),
        internal: false,
      };
      setMessages((prev) => [...prev, newMsg]);
      setTicket((prev) =>
        prev ? { ...prev, status: 'in-progress', updatedAt: new Date().toISOString() } : prev
      );
      setReply('');
      toast.success('Reply sent to customer');
    } finally {
      setSubmitting(null);
    }
  };

  const handleAddNote = async () => {
    if (!internalNote.trim()) {
      toast.error('Please enter a note');
      return;
    }
    setSubmitting('note');
    try {
      await new Promise((r) => setTimeout(r, 400));
      const newMsg: TicketMessage = {
        id: `msg-${Date.now()}`,
        ticketId,
        authorName: 'Admin',
        authorRole: 'admin',
        body: '[INTERNAL] ' + internalNote.trim(),
        createdAt: new Date().toISOString(),
        internal: true,
      };
      setMessages((prev) => [...prev, newMsg]);
      setInternalNote('');
      toast.success('Internal note added');
    } finally {
      setSubmitting(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!ticket) return;
    setSavingEdit(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              status: editForm.status,
              priority: editForm.priority,
              assignee: editForm.assignee === 'Unassign' ? undefined : editForm.assignee,
              category: editForm.category,
              updatedAt: new Date().toISOString(),
            }
          : prev
      );
      setEditModalOpen(false);
      toast.success('Ticket details updated');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!ticket) return;
    try {
      await new Promise((r) => setTimeout(r, 400));
      setTicket((prev) =>
        prev ? { ...prev, status: 'closed', updatedAt: new Date().toISOString() } : prev
      );
      toast.success('Ticket has been closed');
    } finally {
      setConfirmClose(false);
    }
  };

  const handleReopen = async () => {
    if (!ticket) return;
    try {
      await new Promise((r) => setTimeout(r, 400));
      setTicket((prev) =>
        prev ? { ...prev, status: 'open', updatedAt: new Date().toISOString() } : prev
      );
      toast.success('Ticket has been reopened');
    } catch {}
  };

  const handleResolve = async () => {
    if (!ticket) return;
    try {
      await new Promise((r) => setTimeout(r, 400));
      setTicket((prev) =>
        prev ? { ...prev, status: 'resolved', updatedAt: new Date().toISOString() } : prev
      );
      toast.success('Ticket marked as resolved');
    } catch {}
  };

  if (loading && !ticket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => router.push('/support')}>
            Back
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <GlassCard>
          <div className="space-y-4 p-4">
            <Skeleton className="h-8 w-full max-w-md" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => router.push('/support')}>
            Back to Tickets
          </Button>
        </div>
        <GlassCard className="border-danger/40">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-xl bg-danger/15 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-danger" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg">Could not load ticket</h3>
              <p className="text-muted mt-1">{error}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="default" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={handleRetry}>
                Retry
              </Button>
              <Button variant="outline" onClick={() => router.push('/support')}>
                All Tickets
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!ticket) return null;

  const statusMeta = STATUS[ticket.status];
  const priorityMeta = PRIORITY[ticket.priority];
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const isClosed = ticket.status === 'closed';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => router.push('/support')}>
            Back
          </Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
                {ticket.id.toUpperCase()}
              </span>
              <Badge variant={statusMeta.variant}>
                <Clock className="w-3 h-3 mr-1" />
                {statusMeta.label}
              </Badge>
              <Badge variant={priorityMeta.variant}>
                <Flag className="w-3 h-3 mr-1" />
                {priorityMeta.label}
              </Badge>
              <Badge variant="pill">
                <Tag className="w-3 h-3 mr-1" />
                {ticket.category}
              </Badge>
            </div>
            <h1 className="mt-2 text-xl sm:text-2xl font-bold text-white truncate">{ticket.subject}</h1>
            <p className="mt-1 text-muted text-xs sm:text-sm flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5" />
                From: <span className="text-white/80 font-medium">{ticket.username}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Opened: {formatDateTime(ticket.createdAt)}
              </span>
              {ticket.assignee && (
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  Assigned: <span className="text-white/80 font-medium">{ticket.assignee}</span>
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="default"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={handleRetry}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit3 className="w-4 h-4 text-gold" />}
            onClick={() => setEditModalOpen(true)}
          >
            Edit
          </Button>
          {isClosed ? (
            <Button
              variant="default"
              size="sm"
              leftIcon={<Unlock className="w-4 h-4" />}
              onClick={() => void handleReopen()}
            >
              Reopen
            </Button>
          ) : (
            <>
              {ticket.status !== 'resolved' && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<CheckCircle2 className="w-4 h-4 text-success" />}
                  onClick={() => void handleResolve()}
                >
                  Resolve
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                leftIcon={<XCircle className="w-4 h-4" />}
                onClick={() => setConfirmClose(true)}
              >
                Close Ticket
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <GlassHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gold" />
                <span className="text-white font-semibold">Conversation</span>
                <Badge variant="muted" size="sm">
                  {sortedMessages.length} messages
                </Badge>
              </div>
            </GlassHeader>
            <div className="space-y-4 p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
              {sortedMessages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-muted mx-auto mb-3 opacity-50" />
                  <p className="text-muted">No messages yet.</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {sortedMessages.map((msg, idx) => {
                    const isAdmin = msg.authorRole === 'admin';
                    const isInternal = msg.internal;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.4) }}
                        className={cn(
                          'flex gap-3',
                          isAdmin ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {!isAdmin && (
                          <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-xs font-bold text-gold shrink-0 mt-1">
                            {ticket.username.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div
                          className={cn(
                            'max-w-[85%] rounded-2xl px-4 py-3 border',
                            isInternal
                              ? 'bg-warning/5 border-warning/30 border-dashed w-full max-w-full'
                              : isAdmin
                              ? 'bg-gold-gradient/15 border-gold/30'
                              : 'bg-card border-border'
                          )}
                        >
                          <div
                            className={cn(
                              'flex items-center gap-2 mb-2 flex-wrap',
                              isAdmin && !isInternal ? 'justify-end' : 'justify-between'
                            )}
                          >
                            <div className="flex items-center gap-2 flex-wrap">
                              {isInternal && (
                                <Badge variant="warning" size="sm">
                                  <Lock className="w-3 h-3 mr-1" />
                                  Internal Note
                                </Badge>
                              )}
                              <span
                                className={cn(
                                  'text-sm font-semibold',
                                  isInternal ? 'text-warning' : isAdmin ? 'text-gold' : 'text-white'
                                )}
                              >
                                {msg.authorName}
                              </span>
                              <span className="text-[11px] text-muted">
                                {msg.authorRole}
                              </span>
                            </div>
                            <span className="text-[11px] text-muted">{formatDateTime(msg.createdAt)}</span>
                          </div>
                          <p
                            className={cn(
                              'text-sm leading-relaxed whitespace-pre-wrap',
                              isInternal ? 'text-gray-300' : 'text-white/90'
                            )}
                          >
                            {msg.body}
                          </p>
                        </div>
                        {isAdmin && !isInternal && (
                          <div className="w-9 h-9 rounded-full bg-info/15 border border-info/30 flex items-center justify-center text-xs font-bold text-info shrink-0 mt-1">
                            AD
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            <div className="border-t border-border p-4 space-y-3">
              {!isClosed && (
                <>
                  <div className="rounded-xl bg-black/20 border border-white/5 p-3">
                    <label className="flex items-center gap-2 text-xs text-muted mb-2 font-medium">
                      <Send className="w-3.5 h-3.5" />
                      Reply to customer (visible to user)
                    </label>
                    <Textarea
                      placeholder="Type your reply..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Send className="w-4 h-4" />}
                        onClick={() => void handleSendReply()}
                        loading={submitting === 'reply'}
                        disabled={!reply.trim()}
                      >
                        Send Reply
                      </Button>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowInternal((v) => !v)}
                    className="w-full flex items-center justify-center gap-2 text-sm text-muted hover:text-gold transition-colors py-1.5"
                  >
                    {showInternal ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        Hide internal note
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Add internal note (hidden from user)
                      </>
                    )}
                  </button>

                  {showInternal && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-xl bg-warning/5 border border-warning/20 border-dashed p-3 overflow-hidden"
                    >
                      <label className="flex items-center gap-2 text-xs text-warning mb-2 font-medium">
                        <Lock className="w-3.5 h-3.5" />
                        Internal Note — never visible to customer
                      </label>
                      <Textarea
                        placeholder="Add a private note for the team..."
                        value={internalNote}
                        onChange={(e) => setInternalNote(e.target.value)}
                        rows={2}
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<FileText className="w-4 h-4 text-warning" />}
                          onClick={() => void handleAddNote()}
                          loading={submitting === 'note'}
                          disabled={!internalNote.trim()}
                        >
                          Save Note
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
              {isClosed && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/10 border border-border">
                  <Lock className="w-5 h-5 text-muted shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">This ticket is closed</p>
                    <p className="text-muted text-sm">No further replies can be sent. Reopen to continue the conversation.</p>
                  </div>
                  <Button variant="default" size="sm" leftIcon={<Unlock className="w-4 h-4" />} onClick={() => void handleReopen()}>
                    Reopen
                  </Button>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <GlassHeader>
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-gold" />
                <span className="text-white font-semibold">Customer Info</span>
              </div>
            </GlassHeader>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center font-bold text-black">
                  {ticket.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold truncate">{ticket.username}</p>
                  <p className="text-xs text-muted truncate">ID: {ticket.userId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-border">
                <div className="rounded-lg bg-black/20 border border-white/5 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted">Opened</p>
                  <p className="text-sm text-white font-semibold mt-0.5">{formatDate(ticket.createdAt)}</p>
                </div>
                <div className="rounded-lg bg-black/20 border border-white/5 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted">Last Update</p>
                  <p className="text-sm text-white font-semibold mt-0.5">{formatDate(ticket.updatedAt)}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <GlassHeader>
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-gold" />
                  <span className="text-white font-semibold">Quick Actions</span>
                </div>
              </div>
            </GlassHeader>
            <div className="p-4 space-y-2.5">
              <button
                onClick={() => setEditModalOpen(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-black/20 border border-white/5 hover:border-gold/30 hover:bg-white/5 transition-colors text-left"
              >
                <Edit3 className="w-4 h-4 text-gold shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">Change Status / Assignee</p>
                  <p className="text-[11px] text-muted">Update ticket metadata</p>
                </div>
              </button>
              {ticket.status !== 'resolved' && !isClosed && (
                <button
                  onClick={() => void handleResolve()}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-black/20 border border-white/5 hover:border-success/40 hover:bg-success/5 transition-colors text-left"
                >
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">Mark as Resolved</p>
                    <p className="text-[11px] text-muted">Issue has been addressed</p>
                  </div>
                </button>
              )}
              {!isClosed && (
                <button
                  onClick={() => setConfirmClose(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-black/20 border border-white/5 hover:border-danger/40 hover:bg-danger/5 transition-colors text-left"
                >
                  <XCircle className="w-4 h-4 text-danger shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">Close Ticket</p>
                    <p className="text-[11px] text-muted">No further action required</p>
                  </div>
                </button>
              )}
              {isClosed && (
                <button
                  onClick={() => void handleReopen()}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-black/20 border border-white/5 hover:border-info/40 hover:bg-info/5 transition-colors text-left"
                >
                  <Unlock className="w-4 h-4 text-info shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">Reopen Ticket</p>
                    <p className="text-[11px] text-muted">Continue conversation</p>
                  </div>
                </button>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Ticket"
        description="Update status, priority, assignee and category"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Ticket['status'] })}
            >
              {(['open', 'in-progress', 'resolved', 'closed'] as Ticket['status'][]).map((s) => (
                <option key={s} value={s}>
                  {STATUS[s].label}
                </option>
              ))}
            </Select>
            <Select
              label="Priority"
              value={editForm.priority}
              onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as Ticket['priority'] })}
            >
              {(['low', 'medium', 'high'] as Ticket['priority'][]).map((p) => (
                <option key={p} value={p}>
                  {PRIORITY[p].label}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assignee"
              value={editForm.assignee}
              onChange={(e) => setEditForm({ ...editForm, assignee: e.target.value })}
            >
              {ASSIGNEES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
            <Select
              label="Category"
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex justify-end gap-2.5 pt-2 border-t border-border">
            <Button variant="outline" onClick={() => setEditModalOpen(false)} disabled={savingEdit}>
              Cancel
            </Button>
            <Button variant="primary" leftIcon={<Save className="w-4 h-4" />} onClick={() => void handleSaveEdit()} loading={savingEdit}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        onConfirm={handleCloseTicket}
        title="Close Ticket"
        description={`Are you sure you want to close "${ticket.subject}"? No further replies can be sent until reopened.`}
        confirmText="Close Ticket"
        confirmVariant="danger"
      />
    </div>
  );
}
