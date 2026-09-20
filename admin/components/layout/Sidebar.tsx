'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  ReceiptPoundSterling,
  Target,
  Gamepad2,
  Gift,
  UsersRound,
  Crown,
  ShieldCheck,
  Newspaper,
  MessageCircle,
  Headphones,
  ScrollText,
  Settings,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Users', href: '/users' },
  { icon: ReceiptPoundSterling, label: 'Transactions', href: '/transactions' },
  { icon: Target, label: 'Bets', href: '/bets' },
  { icon: Gamepad2, label: 'Games', href: '/games' },
  { icon: Gift, label: 'Promotions', href: '/promotions' },
  { icon: UsersRound, label: 'Affiliates', href: '/affiliates' },
  { icon: Crown, label: 'VIP', href: '/vip' },
  { icon: ShieldCheck, label: 'Responsible Gambling', href: '/responsible-gambling' },
  { icon: Newspaper, label: 'Blog', href: '/blog' },
  { icon: MessageCircle, label: 'Forum', href: '/forum' },
  { icon: Headphones, label: 'Support', href: '/support' },
  { icon: ScrollText, label: 'Logs', href: '/logs' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className={clsx(
        'fixed left-0 top-0 h-screen bg-surface/80 backdrop-blur-md border-r border-border z-40 flex flex-col shrink-0 hidden lg:flex'
      )}
    >
      <div className="relative flex items-center h-16 px-4 border-b border-border shrink-0">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <motion.span
            animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
            transition={{ duration: 0.2 }}
            className="gold-text font-bold text-lg whitespace-nowrap overflow-hidden"
          >
            RiseBet Admin
          </motion.span>
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-gold transition-colors"
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-gold-gradient text-black shadow-gold font-semibold'
                  : 'text-gray-300 hover:bg-gold/10 hover:text-gold'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <motion.span
                animate={{ opacity: collapsed ? 0 : 1, display: collapsed ? 'none' : 'inline' }}
                transition={{ duration: 0.15 }}
                className="whitespace-nowrap text-sm"
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border py-3 px-4 shrink-0">
        <motion.p
          animate={{ opacity: collapsed ? 0 : 1, display: collapsed ? 'none' : 'block' }}
          transition={{ duration: 0.15 }}
          className="text-xs text-muted text-center"
        >
          Admin v1.0
        </motion.p>
      </div>
    </motion.aside>
  );
}
