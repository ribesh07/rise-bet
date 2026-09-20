'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: string | number;
  deltaPositive?: boolean;
  icon: LucideIcon;
  currency?: string;
  accent?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  delta,
  deltaPositive,
  icon: Icon,
  currency,
  accent,
  className,
}: StatCardProps) {
  const isPositive =
    deltaPositive !== undefined ? deltaPositive : Number(delta ?? 0) >= 0;

  return (
    <GlassCard hoverable className={clsx(accent && 'ring-1 ring-gold/40', className)}>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
          <div
            className={clsx(
              'h-12 w-12 rounded-xl flex items-center justify-center',
              accent ? 'bg-gold-gradient text-black' : 'bg-gold/10 text-gold'
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted uppercase tracking-wide mb-1">{title}</p>
            <p className="text-2xl font-bold text-white truncate">
              {currency && <span className="text-muted text-lg mr-1">{currency}</span>}
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {delta !== undefined && (
              <div className="mt-1 inline-flex items-center gap-1">
                <span
                  className={clsx(
                    'text-xs font-medium',
                    isPositive ? 'text-success' : 'text-danger'
                  )}
                >
                  {isPositive ? '+' : ''}
                  {delta}%
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </GlassCard>
  );
}

export default StatCard;
