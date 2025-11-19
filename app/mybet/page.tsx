
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

import Sidebar from '@/components/sidebar';
import TopNavbar from '@/components/topnavbar';
import Footer from '@/components/footer';
import MobileBottomBar from '@/components/mobilebuttombar';

// Sub Pages
import Casino from '@/components/mybet/casino';
import Sports from '@/components/mybet/sport';
import Archive from '@/components/mybet/archive';
import { apiRequest } from '@/utils/ApiHelper';

const MyBetsPage = () => {
  const [activeTab, setActiveTab] = useState<'Casino' | 'Sports' | 'Archive'>('Casino');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [search, setSearch] = useState('');
  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
        const fetchDashboardDetails = async () => {
          try {
            const token = localStorage.getItem("token");
            const id = localStorage.getItem("userId");
    
            const res = await apiRequest(`/users/${id}/details`, true, {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            });
    
            if (res.success) setDashboardDetails(res.data);
          } catch (err) {
            console.error("AFFILIATE PAGE API ERROR:", err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchDashboardDetails();
      }, []);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = 62;
  const collapsedWidth = 20;

  return (
    <div className="flex flex-col pt-6 min-h-screen bg-[#0C1A24] text-white overflow-hidden relative">

      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.div
          animate={{ width: sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="h-screen bg-[#0F171F] shadow-xl overflow-hidden fixed left-0 top-0 z-50"
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            open={true}
            setOpen={() => {}}
          />
        </motion.div>
      )}

      {/* Top Navbar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-40"
        animate={{
          marginLeft: !isMobile
            ? sidebarCollapsed
              ? collapsedWidth * 4
              : sidebarWidth * 4
            : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <TopNavbar
          searchValue={search}
          onSearchChange={setSearch}
          wallets={dashboardDetails?.wallets || []}
        />
      </motion.div>

      {/* Main Content */}
      <motion.main
        className={clsx(
          "flex-1 flex flex-col pt-[80px] pb-24 px-2 sm:px-4 md:px-6 lg:px-8 transition-all duration-300 overflow-y-auto",
          "scrollbar-thin scrollbar-thumb-[#223344] scrollbar-track-transparent"
        )}
        animate={{
          marginLeft: !isMobile
            ? sidebarCollapsed
              ? collapsedWidth * 4
              : sidebarWidth * 4
            : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-6">

          {/* Tabs Sidebar (Desktop) */}
          <aside className="hidden md:flex flex-col w-52 bg-[#102030] rounded-xl border border-white/10 p-4 h-fit sticky top-24">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              ✅ My Bets
            </h2>

            <nav className="flex flex-col divide-y divide-white/5">
              {['Casino', 'Sports', 'Archive'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={clsx(
                    'text-left px-3 py-3 rounded font-medium transition-all',
                    activeTab === tab
                      ? 'bg-[#223344] text-white border-l-4 border-[#2B8EFF]'
                      : 'text-gray-300 hover:bg-[#223344]/60'
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </aside>

          {/* Tabs Selector (Mobile) */}
          <div className="flex md:hidden justify-between bg-[#102030] rounded-lg p-1 mb-4 border border-white/10">
            {['Casino', 'Sports', 'Archive'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={clsx(
                  'flex-1 py-2 text-sm font-medium rounded-md transition-all',
                  activeTab === tab
                    ? 'bg-[#2B8EFF] text-white'
                    : 'text-gray-300 hover:bg-[#223344]'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Main Panel */}
          <div className="flex-1 bg-[#10202B] rounded-xl border border-white/10 p-4 sm:p-6 shadow-lg min-h-[70vh]">
            {activeTab === 'Casino' && <Casino />}
            {activeTab === 'Sports' && <Sports />}
            {activeTab === 'Archive' && <Archive />}
          </div>
        </div>

        <Footer />
      </motion.main>

      {/* Mobile Bottom Bar */}
      {isMobile && (
        <div className="fixed bottom-0 w-full z-50">
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
            className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0F171F] shadow-xl"
          >
            <Sidebar collapsed={false} setCollapsed={() => {}} open={sidebarOpen} setOpen={setSidebarOpen} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBetsPage;
