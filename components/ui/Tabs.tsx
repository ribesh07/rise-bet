'use client';

import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

type TabVariant = 'pills' | 'underline';

interface TabItem {
  key: string;
  label: string;
  icon?: LucideIcon;
}

interface TabsProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  variant?: TabVariant;
  className?: string;
}

export function Tabs({
  tabs,
  activeKey,
  onChange,
  variant = 'pills',
  className,
}: TabsProps) {
  return (
    <div
      className={clsx(
        variant === 'pills'
          ? 'flex flex-wrap gap-2 p-1 bg-card rounded-xl'
          : 'flex flex-wrap gap-1 border-b border-border',
        className
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={clsx(
              'inline-flex items-center gap-2 transition-all duration-200',
              variant === 'pills'
                ? clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    isActive
                      ? 'bg-gold-gradient text-black shadow-gold'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  )
                : clsx(
                    'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px',
                    isActive
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-border'
                  )
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
