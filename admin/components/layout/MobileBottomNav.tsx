'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Target, Headphones, Settings } from 'lucide-react';
import clsx from 'clsx';

const items = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Users', href: '/users' },
  { icon: Target, label: 'Bets', href: '/bets' },
  { icon: Headphones, label: 'Support', href: '/support' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-xl border-t border-border z-40 lg:hidden safe-area-inset-bottom">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex flex-col items-center justify-center py-2.5 gap-1 border-t-2 transition-colors',
                isActive
                  ? 'text-gold border-gold'
                  : 'text-gray-400 border-transparent hover:text-gold'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
