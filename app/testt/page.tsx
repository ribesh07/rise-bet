
'use client';
import React, { useState, useEffect } from 'react';
import { SidebarWrapper } from '@/components/dashboard/sidebarwapper';
import { TopNavbar } from '@/components/dashboard/topnavbar';
import { HeroSection } from '@/components/dashboard/herosection';
import { TrendingGames } from '@/components/dashboard/trendinggame';
import { TrendingSports } from '@/components/dashboard/trendingsports';
import { Promotions } from '@/components/dashboard/pormotion';
import { RecentBets } from '@/components/dashboard/recentbet';
import MobileBottomBar from '@/components/mobilebuttombar';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop collapse
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile open/close
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = 64; // in Tailwind units (16px each)
  const collapsedWidth = 16;

  const handleSidebarToggle = () => {
    if (isMobile) {
      setSidebarOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  };

  const handleSidebarClose = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
      
      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.div
          animate={{ width: sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-screen bg-[#0f172a] shadow-lg overflow-hidden z-50 flex flex-col"
        >
          <SidebarWrapper
            sidebarOpen={!sidebarCollapsed}
            setSidebarOpen={handleSidebarToggle}
          />
        </motion.div>
      )}

      {/* Top Navbar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-40"
        animate={{
          marginLeft: !isMobile ? (sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4) : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <TopNavbar sidebarWidth={!isMobile ? (sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4) : 0} />
      </motion.div>

      {/* Main scrollable content */}
      <motion.main
        className="flex-1 flex flex-col overflow-auto pt-[112px] pb-16 px-3 md:px-8"
        animate={{
          marginLeft: !isMobile ? (sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4) : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <HeroSection />
        <section>
          <TrendingGames />
        </section>
        <section>
          <TrendingSports />
        </section>
        <section>
          <Promotions />
        </section>
        <section>
          <RecentBets />
        </section>
      </motion.main>

      {/* Mobile Bottom Bar */}
      {isMobile && (
        <div className="fixed bottom-0 w-full z-50 h-16">
          <MobileBottomBar onBrowseClick={() => setSidebarOpen(true)} />
        </div>
      )}

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] shadow-lg flex flex-col"
          >
            <SidebarWrapper sidebarOpen={sidebarOpen} setSidebarOpen={handleSidebarToggle} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile sidebar */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black z-40"
          onClick={handleSidebarClose}
        />
      )}
    </div>
  );
};

export default Dashboard;
