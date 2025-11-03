
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from "@/components/sidebar";
import TopNavbar from '@/components/topnavbar';
import Footer from '@/components/footer';
import MobileBottomBar from '@/components/mobilebuttombar';
import Image from 'next/image';
import { LoginForm } from '@/components/auths/loginform';
import { SignupForm } from '@/components/auths/signupform';
import { ChevronDown } from 'lucide-react';

// ✅ Import transaction tables
import DepositTable from '@/components/transactions/deposit';
import WithdrawalsTable from '@/components/transactions/withdrawal';
import RaffleTable from '@/components/transactions/raffle';
import RaceTable from '@/components/transactions/race';
import BonusHistory from '@/components/transactions/bonus';
import OtherHistory from '@/components/transactions/other';

// ✅ Auth Modal
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
                isMobile ? 'h-full rounded-none' : 'max-w-md rounded-xl'
              } overflow-auto bg-[#0f172a] p-6`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-32 h-12">
                  <Image src="/logo.png" alt="Logo" fill style={{ objectFit: 'contain' }} priority />
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

// ✅ Main Transactions Page
const Transactions: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Deposits");
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = 256;
  const collapsedWidth = 80;

  const menuItems = [
    { label: "Deposits" },
    { label: "Withdrawals" },
    { label: "Bonuses" },
    { label: "Raffles" },
    { label: "Races" },
    { label: "Others" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white overflow-hidden relative flex-col">
      {/* ✅ Top Navbar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-40"
        animate={{
          marginLeft: !isMobile
            ? sidebarCollapsed
              ? collapsedWidth
              : sidebarWidth
            : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <TopNavbar searchValue={search} onSearchChange={setSearch} />
      </motion.div>

      <div className="flex flex-1 pt-[80px]">
        {/* ✅ Sidebar (Desktop) */}
        {!isMobile && (
          <motion.aside
            animate={{
              width: sidebarCollapsed ? collapsedWidth : sidebarWidth,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full bg-[#0f172a] shadow-lg z-50"
          >
            <Sidebar
              collapsed={sidebarCollapsed}
              setCollapsed={setSidebarCollapsed}
              open={true}
              setOpen={() => {}}
            />
          </motion.aside>
        )}

        {/* ✅ Main Content */}
        <motion.main
          className="flex-1 flex flex-col overflow-y-auto md:overflow-y-visible px-3 md:px-8 pb-20"
          animate={{
            marginLeft: !isMobile
              ? sidebarCollapsed
                ? collapsedWidth
                : sidebarWidth
              : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex flex-col md:flex-row gap-6 w-full h-full">
            {/* Sidebar Menu (Transactions Tabs) */}
            <div className="w-full md:w-64 shrink-0">
              {/* Desktop Menu */}
              <aside className="hidden md:flex flex-col bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-100">
                  👥 Transactions
                </h2>
                <nav className="flex flex-col space-y-2">
                  {menuItems.map(({ label }) => (
                    <button
                      key={label}
                      onClick={() => setActive(label)}
                      className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-300 ease-in-out
                        ${
                          active === label
                            ? "bg-blue-600/50 text-white border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                            : "text-gray-300 bg-[#0f172a]/60 hover:bg-[#1e3a8a]/40 hover:text-white hover:border-blue-500 border-transparent"
                        }`}
                    >
                      <span>{label}</span>
                    </button>
                  ))}
                </nav>
              </aside>

              {/* Mobile Dropdown Menu */}
              <div className="md:hidden bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-lg">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center justify-between w-full px-4 py-2 rounded-lg text-gray-100 font-medium bg-[#0f172a]/60 hover:bg-[#1e3a8a]/40 transition-all duration-300"
                >
                  <span>{active}</span>
                  <ChevronDown
                    className={`transform transition-transform duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                    size={18}
                  />
                </button>
                {open && (
                  <div className="mt-3 flex flex-col space-y-2">
                    {menuItems.map(({ label }) => (
                      <button
                        key={label}
                        onClick={() => {
                          setActive(label);
                          setOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-300 ease-in-out
                          ${
                            active === label
                              ? "bg-blue-600/50 text-white border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                              : "text-gray-300 bg-[#0f172a]/60 hover:bg-[#1e3a8a]/40 hover:text-white hover:border-blue-500 border-transparent"
                          }`}
                      >
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ✅ Dynamic Section (FULL HEIGHT) */}
            <div className="flex-1 bg-[#1e293b] rounded-2xl p-6 space-y-6 shadow-lg shadow-black/40 w-full flex flex-col min-h-[calc(100vh-160px)]">
              <div className="flex-1 w-full overflow-auto">
                {active === "Deposits" && (
                  <div className="h-full w-full flex flex-col">
                    <DepositTable />
                  </div>
                )}
                {active === "Withdrawals" && (
                  <div className="h-full w-full flex flex-col">
                    <WithdrawalsTable />
                  </div>
                )}
                {active === "Bonuses" && (
                  <div className="h-full w-full flex flex-col">
                    <BonusHistory />
                  </div>
                )}
                {active === "Raffles" && (
                  <div className="h-full w-full flex flex-col">
                    <RaffleTable />
                  </div>
                )}
                {active === "Races" && (
                  <div className="h-full w-full flex flex-col">
                    <RaceTable />
                  </div>
                )}
                {active === "Others" && (
                  <div className="h-full w-full flex items-center justify-center text-gray-300">
                    <OtherHistory />
                  </div>
                )}
              </div>
            </div>
          </div>

          <Footer />
        </motion.main>
      </div>

      {/* ✅ Mobile Bottom Bar */}
      {isMobile && (
        <div className="fixed bottom-0 w-full z-50 h-16">
          <MobileBottomBar onBrowseClick={() => setSidebarOpen(true)} />
        </div>
      )}

      {/* ✅ Mobile Sidebar */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] shadow-lg"
          >
            <Sidebar
              collapsed={false}
              setCollapsed={() => {}}
              open={sidebarOpen}
              setOpen={setSidebarOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Auth Modal */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialType={authType}
        isMobile={isMobile}
      />
    </div>
  );
};

export default Transactions;
