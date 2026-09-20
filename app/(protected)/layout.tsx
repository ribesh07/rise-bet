'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useProtectedRoute();
  const pathname = usePathname();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Topbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex-1 px-4 md:px-8 pt-6 pb-28 lg:pb-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <MobileBottomNav />
      </div>
    </div>
  );
}
