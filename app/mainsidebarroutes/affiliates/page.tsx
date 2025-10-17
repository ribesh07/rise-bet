
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarWrapper } from '@/components/dashboard/sidebarwapper';
import { TopNavbar } from '@/components/dashboard/topnavbar';
import Footer from '@/components/footer';
import MobileBottomBar from '@/components/mobilebuttombar';
import Image from 'next/image';
import { LoginForm } from '@/components/auths/loginform';
import { SignupForm } from '@/components/auths/signupform';
import {
  PlayCircle,
  Percent,
  DollarSign,
  Settings,
  Globe2,
  Clock,
} from 'lucide-react';

// ✅ Shared Auth Modal
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
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
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
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-32 h-12">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white text-2xl leading-none"
                >
                  &times;
                </button>
              </div>

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

// ✅ Main Affiliate Program Page
const AffiliateProgram: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');

  // ✅ New: show content after tapping overview on mobile
  const [showFullMobileContent, setShowFullMobileContent] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = 64;
  const collapsedWidth = 16;

  const handleSidebarToggle = () => {
    if (isMobile) {
      setSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  const handleSidebarClose = () => {
    if (isMobile) setSidebarOpen(false);
  };

  useEffect(() => {
    const handleAuthEvent = (event: any) => {
      setAuthType(event.detail);
      setAuthOpen(true);
    };
    window.addEventListener('openAuthModal', handleAuthEvent);
    return () => window.removeEventListener('openAuthModal', handleAuthEvent);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
      {/* Sidebar (Desktop) */}
      {!isMobile && (
        <motion.div
          animate={{
            width: sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-screen bg-[#0f172a] shadow-lg overflow-hidden z-50 flex flex-col"
        >
          <SidebarWrapper sidebarOpen={!sidebarCollapsed} setSidebarOpen={handleSidebarToggle} />
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
          sidebarWidth={
            !isMobile
              ? sidebarCollapsed
                ? collapsedWidth * 4
                : sidebarWidth * 4
              : 0
          }
        />
      </motion.div>

      {/* Main Content */}
      <motion.main
        className="flex-1 flex flex-col overflow-auto pt-[112px] pb-16 px-3 md:px-8"
        animate={{
          marginLeft: !isMobile
            ? sidebarCollapsed
              ? collapsedWidth * 4
              : sidebarWidth * 4
            : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* ✅ Mobile: show only the overview card first */}
        {isMobile && !showFullMobileContent ? (
          <div
            className="bg-[#0f172a] border border-slate-700 rounded-xl p-4 mx-auto mt-4 w-full max-w-md shadow-md hover:border-green-500 transition-all duration-300 cursor-pointer"
            onClick={() => setShowFullMobileContent(true)}
          >
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              👥 Affiliate Program
            </h2>
            <div className="bg-[#1e293b] rounded-lg px-3 py-2 text-sm font-medium text-gray-100">
              Overview
            </div>
          </div>
        ) : (
          <>
            {/* Desktop + full mobile view */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
              {/* Sidebar (Overview) */}
              <aside className="w-full md:w-1/5 h-fit md:sticky md:top-6 bg-[#1e293b] rounded-2xl p-4 shadow-lg shadow-black/30">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  👥 Affiliate Program
                </h2>
                <div className="bg-[#0f172a] border-l-2 border-blue-500 rounded-r-lg px-3 py-2 text-sm font-medium text-gray-100 shadow-inner">
                  Overview
                </div>
              </aside>

              {/* Main Content */}
              <main className="flex-1 bg-[#1e293b] rounded-2xl p-6 space-y-6 shadow-lg shadow-black/40">
                <section>
                  <h1 className="text-2xl font-bold mb-2">Affiliate Program</h1>
                  <p className="text-gray-300 mb-4">
                    Earn commission for all bets placed by your referrals across Casino and Sportsbook.
                  </p>

                  <div className="flex flex-wrap gap-6 mt-4 text-center">
                    {[
                      { value: '35.8M', label: 'Worldwide Customers' },
                      { value: '42', label: 'Payment Methods' },
                      { value: '17', label: 'Languages Supported' },
                    ].map((item, i) => (
                      <div key={i} className="group cursor-default transition-transform hover:-translate-y-1">
                        <p className="text-3xl font-bold text-green-400 group-hover:text-green-300 transition-colors">
                          {item.value}
                        </p>
                        <p className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-gray-300 mt-6 leading-relaxed">
                    To register your interest in becoming a Stake Affiliate, please login to your Stake account.{' '}
                    Don’t have a Stake account yet? Tap the{' '}
                    <span
                      className="font-semibold text-blue-400 cursor-pointer hover:underline"
                      onClick={() => {
                        setAuthType('register');
                        setAuthOpen(true);
                      }}
                    >
                      'Register'
                    </span>{' '}
                    button below to get started.
                  </p>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => {
                        setAuthType('login');
                        setAuthOpen(true);
                      }}
                      className="bg-green-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-600 hover:shadow-[0_0_12px_#22c55e] transition-all duration-300"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setAuthType('register');
                        setAuthOpen(true);
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 hover:shadow-[0_0_12px_#3b82f6] transition-all duration-300"
                    >
                      Register Now
                    </button>
                  </div>

                  <div className="bg-[#0f172a] rounded-xl p-4 mt-6 flex items-center gap-4 border border-slate-700 hover:border-green-500 transition-colors duration-300">
                    <PlayCircle className="w-10 h-10 text-green-400" />
                    <div>
                      <p className="font-semibold">Stake.com Affiliate Program</p>
                      <p className="text-gray-400 text-sm">Creative Department</p>
                    </div>
                  </div>
                </section>

                {/* Advantages */}
                <section>
                  <h2 className="text-xl font-semibold mb-3">Exclusive Advantages</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { icon: DollarSign, title: 'Instant Payout', desc: 'Skip the wait. See earnings instantly.' },
                      { icon: Clock, title: 'Lifetime Commission', desc: 'Keep earning as your referrals play.' },
                      { icon: Percent, title: 'Top Market Rates', desc: 'Earn more with competitive commissions.' },
                      { icon: Settings, title: 'Customise Your Plan', desc: 'Choose the best commission model.' },
                      { icon: Globe2, title: 'Crypto & Local Currencies', desc: 'Earn in your preferred currency.' },
                      { icon: Globe2, title: '24/7 Multi Language Support', desc: 'Support in your language anytime.' },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-[#0f172a] p-4 rounded-xl flex gap-3 items-start border border-slate-700 hover:border-green-400 hover:shadow-[0_0_12px_#22c55e55] hover:-translate-y-1 transition-all duration-300"
                      >
                        <item.icon className="w-6 h-6 text-green-400 mt-1" />
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <section>
               <h2 className="text-xl font-semibold mb-3">Commission Rules</h2>
                <p className="text-gray-300">
                  Our default commission rate is <span className="font-semibold text-green-400">10%</span> but you can calculate specific rates for our products using the formulas below.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                {[
                {
                  title: "🎰 Casino",
                  desc: "All of our games have a different house edge. You can derive your commission using:",
                  formula: "(Edge as decimal * wagered / 2) * commission rate",
                },
                {
                  title: "🏈 Sportsbook",
                  desc: "All sports bets are applied at 3% theoretical house edge. Use:",
                  formula: "(0.03 * wagered / 2) * commission rate",
                },
                {
                  title: "♠️ Poker",
                  desc: "You collect a small % of each pot (Rake). Commission formula:",
                  formula: "Rake * commission rate",
                },
              ].map((rule, i) => (
                <div
                  key={i}
                  className="bg-[#0f172a] rounded-xl p-4 border border-slate-700 transition-all duration-300 hover:border-green-400 hover:shadow-[0_0_10px_#22c55e55] hover:-translate-y-1"
                >
                  <h3 className="font-semibold mb-1 text-green-400">{rule.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{rule.desc}</p>
                  <code className="bg-slate-800 p-2 rounded block text-sm text-gray-200">
                    {rule.formula}
                  </code>
                </div>
              ))}
            </div>
          </section>

          {/* Templates Banner */}
          <section>
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between text-white hover:shadow-[0_0_25px_#3b82f6aa] transition-all duration-300">
              <div>
                <h2 className="text-xl font-semibold">
                  Templates to Help Your Campaign Stand Out
                </h2>
                <p className="text-sm text-white/90 mt-1">
                  We've created digital banner templates to make it easier to promote your campaigns online.
                </p>
              </div>
              <img
                src="https://stake.com/_app/immutable/assets/affiliate-banner.png"
                alt="Stake Banner"
                className="w-48 mt-4 md:mt-0 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          </section>
              </main>
            </div>

            <Footer />
          </>
        )}
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

      {/* Mobile Sidebar Overlay */}
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

export default AffiliateProgram;
