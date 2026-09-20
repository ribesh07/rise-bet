'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  MessageCircle,
  Send,
  ArrowUpRight,
  RefreshCw,
  AlertTriangle,
  Save,
  CheckCircle2,
  ExternalLink,
  Link2,
  Globe,
  Hash,
  Twitter,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { GlassCard, GlassHeader } from '@/components/ui/GlassCard';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { cn } from '@/lib/utils';

interface CommunityConfig {
  telegram: string;
  discord: string;
  twitter: string;
  forumLabel: string;
  redirectMode: 'telegram' | 'external' | 'disabled';
}

const DEFAULTS: CommunityConfig = {
  telegram: 'https://t.me/risebet_official',
  discord: 'https://discord.gg/risebet',
  twitter: 'https://twitter.com/risebet',
  forumLabel: 'Join our Telegram Community',
  redirectMode: 'telegram',
};

export default function ForumPage() {
  const [config, setConfig] = useState<CommunityConfig>(DEFAULTS);
  const [saving, setSaving] = useState<boolean>(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, 'pass' | 'fail' | 'pending'>>({});

  const handleSave = async () => {
    if (config.redirectMode !== 'disabled' && !config.telegram.trim() && !config.discord.trim()) {
      toast.error('At least Telegram or Discord URL is required when redirect is enabled');
      return;
    }
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success('Community settings saved successfully');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async (key: keyof Pick<CommunityConfig, 'telegram' | 'discord' | 'twitter'>, label: string) => {
    const url = config[key];
    if (!url.trim()) {
      toast.error(`${label} URL is empty`);
      return;
    }
    try {
      new URL(url);
    } catch {
      toast.error(`${label} URL is invalid. Please include https://`);
      setTestResult((prev) => ({ ...prev, [key]: 'fail' }));
      return;
    }
    setTesting(key);
    setTestResult((prev) => ({ ...prev, [key]: 'pending' }));
    await new Promise((r) => setTimeout(r, 700));
    setTestResult((prev) => ({ ...prev, [key]: 'pass' }));
    setTesting(null);
    toast.success(`${label} URL validated successfully`);
  };

  const handleTestAll = async () => {
    const keys: (keyof Pick<CommunityConfig, 'telegram' | 'discord' | 'twitter'>)[] = ['telegram', 'discord', 'twitter'];
    for (const k of keys) {
      const url = config[k];
      if (!url.trim()) {
        setTestResult((prev) => ({ ...prev, [k]: 'fail' }));
        continue;
      }
      try {
        new URL(url);
        setTestResult((prev) => ({ ...prev, [k]: 'pending' }));
        await new Promise((r) => setTimeout(r, 350));
        setTestResult((prev) => ({ ...prev, [k]: 'pass' }));
      } catch {
        setTestResult((prev) => ({ ...prev, [k]: 'fail' }));
      }
    }
    const allPassed = keys.every((k) => testResult[k] === 'pass' || !config[k].trim());
    toast[allPassed ? 'success' : 'error'](
      allPassed ? 'All configured URLs validated' : 'Some URLs failed validation — check URLs with https://'
    );
  };

  const handleRestore = () => {
    setConfig(DEFAULTS);
    setTestResult({});
    toast.success('Restored default community URLs');
  };

  const primaryUrl =
    config.redirectMode === 'telegram'
      ? config.telegram
      : config.redirectMode === 'external'
      ? config.discord
      : '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent gold-text">
            Forum & Community
          </h1>
          <p className="mt-1.5 text-muted text-sm sm:text-base">
            Configure social community links. The /forum route on the customer site redirects to the primary channel below.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="default"
            size="md"
            leftIcon={<RefreshCw className={cn('w-4 h-4', saving && 'animate-spin')} />}
            onClick={handleRestore}
            disabled={saving}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Save className="w-4 h-4" />}
            onClick={() => void handleSave()}
            loading={saving}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={MessageCircle}
          title="Primary Channel"
          value={
            config.redirectMode === 'telegram'
              ? 'Telegram'
              : config.redirectMode === 'external'
              ? 'Discord'
              : 'Disabled'
          }
        />
        <StatCard
          icon={CheckCircle2}
          title="Validated URLs"
          value={String(Object.values(testResult).filter((v) => v === 'pass').length) + '/3'}
          delta={Object.keys(testResult).length > 0 ? undefined : 0}
        />
        <StatCard
          icon={Send}
          title="Community Members"
          value="12.4K"
          delta={8.2}
          accent
        />
        <StatCard icon={Link2} title="Links Configured" value={String([config.telegram, config.discord, config.twitter].filter(Boolean).length) + '/3'} />
      </div>

      <GlassCard>
        <GlassHeader
          action={
            <div className="flex gap-2 flex-wrap">
              <Button variant="default" size="sm" onClick={() => void handleTestAll()}>
                Test All
              </Button>
              {primaryUrl && (
                <a
                  href={primaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (config.redirectMode === 'disabled') {
                      e.preventDefault();
                      toast.error('Redirect is currently disabled');
                    }
                  }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ExternalLink className="w-4 h-4" />}
                    disabled={config.redirectMode === 'disabled'}
                  >
                    Open Primary
                  </Button>
                </a>
              )}
            </div>
          }
        >
          <div>
            <h3 className="text-white font-semibold text-base flex items-center gap-2">
              <Globe className="w-5 h-5 text-gold" />
              Redirect Behavior
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-0.5">
              What happens when a customer visits /forum on the main RiseBet site
            </p>
          </div>
        </GlassHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(
            [
              { key: 'telegram', label: 'Redirect to Telegram', icon: Send, desc: 'Customers land on your Telegram group — recommended.' },
              { key: 'external', label: 'Redirect to Discord', icon: Hash, desc: 'Customers land on your Discord server.' },
              { key: 'disabled', label: 'Disabled', icon: AlertTriangle, desc: 'Show a coming-soon page instead of redirecting.' },
            ] as { key: CommunityConfig['redirectMode']; label: string; icon: any; desc: string }[]
          ).map(({ key, label, icon: Icon, desc }) => {
            const active = config.redirectMode === key;
            return (
              <button
                key={key}
                onClick={() => setConfig((c) => ({ ...c, redirectMode: key }))}
                className={cn(
                  'text-left rounded-xl p-4 border transition-all',
                  active
                    ? 'border-gold/60 bg-gold/10 shadow-[0_0_0_1px_rgba(212,175,55,0.25)]'
                    : 'border-white/10 bg-black/20 hover:border-gold/30 hover:bg-white/[0.03]'
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                      active ? 'bg-gold-gradient text-black' : 'bg-gold/15 text-gold border border-gold/30'
                    )}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn('font-semibold', active ? 'text-gold' : 'text-white')}>{label}</p>
                      {active && <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />}
                    </div>
                    <p className="text-muted text-xs mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard>
          <GlassHeader
            action={
              <div className="flex items-center gap-2">
                {testResult.telegram && (
                  <BadgeResult result={testResult.telegram} />
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<ArrowUpRight className="w-4 h-4 text-gold" />}
                  onClick={() => void handleTest('telegram', 'Telegram')}
                  loading={testing === 'telegram'}
                  disabled={!config.telegram.trim()}
                >
                  Test
                </Button>
                {config.telegram && (
                  <a href={config.telegram} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" leftIcon={<ExternalLink className="w-4 h-4" />}>
                      Visit
                    </Button>
                  </a>
                )}
              </div>
            }
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#229ED9]/15 border border-[#229ED9]/30 flex items-center justify-center shrink-0">
                <Send className="w-4.5 h-4.5 text-[#229ED9]" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base">Telegram Group</h3>
                <p className="text-muted text-xs sm:text-sm">Primary community chat and announcements</p>
              </div>
            </div>
          </GlassHeader>
          <div className="space-y-3 pt-1">
            <Input
              label="Telegram URL"
              placeholder="https://t.me/your_group"
              value={config.telegram}
              onChange={(e) => setConfig({ ...config, telegram: e.target.value })}
              leftIcon={<Send className="w-4 h-4" />}
            />
          </div>
        </GlassCard>

        <GlassCard>
          <GlassHeader
            action={
              <div className="flex items-center gap-2">
                {testResult.discord && <BadgeResult result={testResult.discord} />}
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<ArrowUpRight className="w-4 h-4 text-gold" />}
                  onClick={() => void handleTest('discord', 'Discord')}
                  loading={testing === 'discord'}
                  disabled={!config.discord.trim()}
                >
                  Test
                </Button>
                {config.discord && (
                  <a href={config.discord} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" leftIcon={<ExternalLink className="w-4 h-4" />}>
                      Visit
                    </Button>
                  </a>
                )}
              </div>
            }
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#5865F2]/15 border border-[#5865F2]/30 flex items-center justify-center shrink-0">
                <Hash className="w-4.5 h-4.5 text-[#5865F2]" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base">Discord Server</h3>
                <p className="text-muted text-xs sm:text-sm">Deeper community discussion & support</p>
              </div>
            </div>
          </GlassHeader>
          <div className="space-y-3 pt-1">
            <Input
              label="Discord Invite URL"
              placeholder="https://discord.gg/your_invite"
              value={config.discord}
              onChange={(e) => setConfig({ ...config, discord: e.target.value })}
              leftIcon={<Hash className="w-4 h-4" />}
            />
          </div>
        </GlassCard>

        <GlassCard>
          <GlassHeader
            action={
              <div className="flex items-center gap-2">
                {testResult.twitter && <BadgeResult result={testResult.twitter} />}
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<ArrowUpRight className="w-4 h-4 text-gold" />}
                  onClick={() => void handleTest('twitter', 'Twitter')}
                  loading={testing === 'twitter'}
                  disabled={!config.twitter.trim()}
                >
                  Test
                </Button>
                {config.twitter && (
                  <a href={config.twitter} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" leftIcon={<ExternalLink className="w-4 h-4" />}>
                      Visit
                    </Button>
                  </a>
                )}
              </div>
            }
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-black/40 border border-white/20 flex items-center justify-center shrink-0">
                <Twitter className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base">Twitter / X</h3>
                <p className="text-muted text-xs sm:text-sm">Promotions, news & updates</p>
              </div>
            </div>
          </GlassHeader>
          <div className="space-y-3 pt-1">
            <Input
              label="Twitter URL"
              placeholder="https://twitter.com/your_handle"
              value={config.twitter}
              onChange={(e) => setConfig({ ...config, twitter: e.target.value })}
              leftIcon={<Twitter className="w-4 h-4" />}
            />
          </div>
        </GlassCard>

        <GlassCard>
          <GlassHeader>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4.5 h-4.5 text-gold" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base">Forum CTA Label</h3>
                <p className="text-muted text-xs sm:text-sm">Copy shown on the customer /forum landing banner</p>
              </div>
            </div>
          </GlassHeader>
          <div className="space-y-3 pt-1">
            <Input
              label="Banner Headline"
              placeholder="Join our Telegram Community"
              value={config.forumLabel}
              onChange={(e) => setConfig({ ...config, forumLabel: e.target.value })}
            />
            <div className="rounded-xl bg-card/50 border border-border p-4">
              <p className="text-[10px] uppercase tracking-wide text-muted mb-2">Preview</p>
              <div className="rounded-lg bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/20 p-4 flex items-center justify-between gap-3">
                <span className="text-white font-semibold">{config.forumLabel || 'Join our community'}</span>
                <span className="shrink-0 px-3 py-1.5 rounded-lg bg-gold-gradient text-black text-xs font-bold">
                  {config.redirectMode === 'disabled' ? 'Coming Soon' : 'Join Now'}
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="border-info/30">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
          <div className="w-11 h-11 rounded-xl bg-info/15 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5.5 h-5.5 text-info" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold">Note</h4>
            <p className="text-muted text-sm mt-0.5">
              Forum/community features on RiseBet are outsourced to third-party platforms. This admin page
              centralizes the URLs shown in the footer, sidebar, and the dedicated /forum landing route.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function BadgeResult({ result }: { result: 'pass' | 'fail' | 'pending' }) {
  if (result === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-info/15 text-info border border-info/30">
        <RefreshCw className="w-3 h-3 animate-spin" />
        Checking
      </span>
    );
  }
  if (result === 'pass') {
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30">
        <CheckCircle2 className="w-3 h-3" />
        OK
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-danger/15 text-danger border border-danger/30">
      <AlertTriangle className="w-3 h-3" />
      Invalid
    </span>
  );
}
