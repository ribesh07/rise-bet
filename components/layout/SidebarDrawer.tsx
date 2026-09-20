'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
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
} from 'lucide-react';
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

interface SidebarDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function SidebarDrawer({ open, onClose }: SidebarDrawerProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed left-0 top-0 h-screen w-72 bg-surface/95 backdrop-blur-xl border-r border-border z-50 flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-border shrink-0">
              <Link href="/" className="flex items-center gap-3" onClick={onClose}>
                <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center">
                  <Shield className="w-5 h-5 text-black" />
                </div>
                <span className="gold-text font-bold text-lg">RiseBet Admin</span>
              </Link>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
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
                    onClick={onClose}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-gold-gradient text-black shadow-gold font-semibold'
                        : 'text-gray-300 hover:bg-gold/10 hover:text-gold'
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="whitespace-nowrap text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-border py-3 px-4 shrink-0">
              <p className="text-xs text-muted text-center">Admin v1.0</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
