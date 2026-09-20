'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import { ElementType, ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  as?: ElementType;
  [key: string]: any;
}

export function GlassCard({
  children,
  className,
  hoverable,
  as: Tag = 'div',
  ...rest
}: GlassCardProps) {
  const Component = Tag as any;
  return (
    <Component
      className={clsx(
        'glass-card p-5 md:p-6',
        hoverable && 'hover:shadow-gold-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer',
        className
      )}
      {...rest}
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </Component>
  );
}

interface GlassHeaderProps {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}

export function GlassHeader({ title, subtitle, right, action, children }: GlassHeaderProps) {
  const content = right ?? action;
  if (children) {
    return (
      <div className="flex items-start justify-between mb-5 gap-4 flex-wrap px-5 md:px-6 pt-5 md:pt-6">
        {children}
        {content && <div>{content}</div>}
      </div>
    );
  }
  return (
    <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
      <div>
        {title && <h3 className="text-lg font-bold text-white mb-1">{title}</h3>}
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>
      {content && <div>{content}</div>}
    </div>
  );
}

export default GlassCard;
