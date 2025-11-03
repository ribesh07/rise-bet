
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
import {
  
  ChevronDown,
} from 'lucide-react';

// ✅ Import your affiliate subpages
import Overview from '@/components/affiliates/overview';
import Refer from '@/components/affiliates/campaigns';
import Commissions from '@/components/affiliates/commission';
import FAQ from '@/components/affiliates/faq';
import ReferredUsers from '@/components/affiliates/refer';

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
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Overview");
    const [search, setSearch] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = 52;
  const collapsedWidth = 20;

  const menuItems = [
    { label: "Overview"},
    { label: "Campaigns" },
    { label: "Commissions" },
    { label: "Referred Users" },
    { label: "FAQ" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white overflow-x-hidden relative flex-col">
      <div className="flex flex-1">
        {/* ✅ Sidebar (Desktop) */}
        {!isMobile && (
          <motion.div
            animate={{
              width: sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="h-screen bg-[#0f172a] shadow-lg overflow-hidden fixed left-0 top-0 z-50"
          >
            <Sidebar
              collapsed={sidebarCollapsed}
              setCollapsed={setSidebarCollapsed}
              open={true}
              setOpen={() => {}}
            />
          </motion.div>
        )}

        {/* ✅ Navbar */}
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
          <TopNavbar searchValue={search} onSearchChange={setSearch} />
        </motion.div>

        {/* ✅ Main Content */}
        <motion.main
          className="flex-1 flex flex-col overflow-auto pt-[112px] pb-16 px-3 py-12 md:px-8"
          animate={{
            marginLeft: !isMobile
              ? sidebarCollapsed
                ? collapsedWidth * 4
                : sidebarWidth * 4
              : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
            {/* Left Sidebar */}
            <>
              {/* 🖥️ Desktop Sidebar Menu */}
              <aside className="hidden md:flex md:flex-col md:w-1/5 h-fit md:sticky md:top-6 bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-100">
                  👥 Affiliate Program
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

              {/* 📱 Mobile Dropdown Menu */}
              <div className="md:hidden w-full bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-[0_0_10px_rgba(0,0,0,0.4)]">
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
                    {menuItems.map(({ label}) => (
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
            </>

            {/* ✅ Main Dynamic Section */}
           
            <main className="flex-1 bg-[#1e293b] rounded-2xl p-6 space-y-6 shadow-lg shadow-black/40 mb-3 w-fit">
              {active === "Overview" && (
                <Overview
                  onLogin={() => {
                    setAuthType('login');
                    setAuthOpen(true);
                  }}
                  onRegister={() => {
                    setAuthType('register');
                    setAuthOpen(true);
                  }}
                />
              )}
              {active === "Campaigns" && <Refer />}
              {active === "Commissions" && <Commissions />}
              {active === "Referred Users" && <ReferredUsers />}
              {active === "FAQ" && <FAQ />}
            </main>
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

export default AffiliateProgram;
