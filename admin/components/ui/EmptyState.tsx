'use client';

import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    text: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title = 'No results',
  description = 'Try adjusting filters',
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className ?? ''}`}>
      <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-gold" />
      </div>
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-muted max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.text}</Button>
      )}
    </div>
  );
}

export default EmptyState;
