'use client';
import React, { useState, useEffect } from 'react';
import { SidebarWrapper } from '@/components/dashboard/sidebarwapper';
import TopNavbar from '@/components/dashboard/topnavbar';
import { HeroSection } from '@/components/dashboard/herosection';
import { TrendingGames } from '@/components/dashboard/trendinggame';
import { TrendingSports } from '@/components/dashboard/trendingsports';
import { Promotions } from '@/components/dashboard/pormotion';
import { RecentBets } from '@/components/dashboard/recentbet';
import MobileBottomBar from '@/components/mainmobilebuttombar';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/footer';
import { LoginForm } from '@/components/auths/loginform';
import { SignupForm } from '@/components/auths/signupform';
import Image from 'next/image';

// ---------------- Auth Modal ----------------
const AuthModal: React.FC<{
  open: boolean;
  onClose: () => void;
  initialType: 'login' | 'register';
  isMobile: boolean;
}> = ({ open, onClose, initialType, isMobile }) => {
  const [modalMode, setModalMode] = useState<'login' | 'register'>(initialType);

  useEffect(() => {
    if (open) setModalMode(initialType);
  }, [open, initialType]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            initial={{ scale: isMobile ? 1 : 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: isMobile ? 1 : 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div
              className={`relative z-50 w-full ${
                isMobile ? 'h-full rounded-none' : 'max-w-md max-h-screen rounded-xl'
              } overflow-auto bg-[#0f172a] p-6`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-32 h-15">
                  <Image src="/logo.png" alt="Logo" fill style={{ objectFit: 'contain' }} priority />
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white text-2xl leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Forms */}
              {modalMode === 'login' ? (
                <LoginForm onSuccess={onClose} onSwitch={() => setModalMode('register')} />
              ) : (
                <SignupForm onSuccess={onClose} onSwitch={() => setModalMode('login')} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ---------------- Dashboard ----------------
const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = 64;
  const collapsedWidth = 20;

  const handleSidebarToggle = () => {
    if (isMobile) setSidebarOpen((prev) => !prev);
    else setSidebarCollapsed((prev) => !prev);
  };

  const handleSidebarClose = () => {
    if (isMobile) setSidebarOpen(false);
  };

  // HeroSection event listener
  useEffect(() => {
    const handleHeroAuth = (event: any) => {
      setAuthType(event.detail);
      setAuthOpen(true);
    };
    window.addEventListener('openAuthModal', handleHeroAuth);
    return () => window.removeEventListener('openAuthModal', handleHeroAuth);
  }, []);

  // Navbar auth click handler
  const handleAuthClick = (type: 'login' | 'register') => {
    setAuthType(type);
    setAuthOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#141f27] text-white overflow-x-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.div
          animate={{ width: sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-screen bg-[#0f1420] shadow-lg overflow-hidden z-50 flex flex-col"
        >
          <SidebarWrapper sidebarOpen={!sidebarCollapsed} setSidebarOpen={handleSidebarToggle} />
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
        <TopNavbar  />
      </motion.div>

      {/* Main Content */}
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
        {/* <section>
          <TrendingSports />
        </section> */}
        <section>
          <Promotions />
        </section>
        <section>
          <RecentBets />
        </section>
        <Footer />
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
          <>
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] shadow-lg flex flex-col"
            >
              <SidebarWrapper sidebarOpen={sidebarOpen} setSidebarOpen={handleSidebarToggle} />
            </motion.div>

            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-40"
              onClick={handleSidebarClose}
            />
          </>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialType={authType}
        isMobile={isMobile}
      />
    </div>
  );
};

export default Dashboard;
