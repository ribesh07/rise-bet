'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

type BadgeVariant = 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'default' | 'pill';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: 'bg-gold/20 text-gold',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  danger: 'bg-danger/20 text-danger',
  info: 'bg-info/20 text-info',
  muted: 'bg-muted/20 text-muted',
  default: 'bg-white/10 text-gray-300',
  pill: 'bg-card border border-border text-gray-300',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'badge font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
