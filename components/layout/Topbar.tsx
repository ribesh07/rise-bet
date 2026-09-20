'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
  UserCircle,
  Inbox,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { logout, getRole } from '@/hooks/useAuth';
import SidebarDrawer from './SidebarDrawer';

const notifications = [
  { id: 1, message: 'New user registered', unread: true },
  { id: 2, message: 'Withdrawal #124 pending', unread: true },
  { id: 3, message: 'Bet won $1.2k', unread: true },
];

export default function Topbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setRole(getRole());
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('admin_role');
    toast.success('Logged out');
    router.replace('/login');
  };

  return (
    <>
      <header className="sticky top-0 bg-surface/70 backdrop-blur-xl border-b border-border z-30 px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-gold transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative flex-1 max-w-xl hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-background/50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setUserOpen(false);
                }}
                className="relative p-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-gold transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 glass-card p-2 z-50">
                  <div className="p-3 border-b border-border">
                    <p className="font-semibold text-sm">Notifications</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                          <Inbox className="w-4 h-4 text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-200">{n.message}</p>
                        </div>
                        {n.unread && (
                          <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))}
                  </div>
                  <button className="w-full p-3 text-sm text-gold hover:bg-white/5 rounded-lg mt-1 border-t border-border">
                    View all notifications
                  </button>
                </div>
              )}
            </div>

            <div className="relative" ref={userRef}>
              <button
                onClick={() => {
                  setUserOpen(!userOpen);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center ring-2 ring-gold/30">
                  <User className="w-4 h-4 text-black" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white leading-tight">Alex Carter</p>
                  <span
                    className={clsx(
                      'badge',
                      role === 'superadmin'
                        ? 'bg-gold/20 text-gold'
                        : 'bg-info/20 text-info'
                    )}
                  >
                    {role === 'superadmin' ? 'Superadmin' : 'Admin'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted hidden md:block" />
              </button>

              {userOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 glass-card p-2 z-50">
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-left">
                    <UserCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-200">Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-left">
                    <SettingsIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-200">Settings</span>
                  </button>
                  <div className="border-t border-border my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-danger/10 text-left text-danger"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <SidebarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
