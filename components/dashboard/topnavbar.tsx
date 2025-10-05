
'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from '@/components/auths/loginform';
import { SignupForm } from '@/components/auths/signupform';

const AuthModal: React.FC<{
  open: boolean;
  onClose: () => void;
  initialType: 'login' | 'register';
  isMobile: boolean;
}> = ({ open, onClose, initialType, isMobile }) => {
  const [modalMode, setModalMode] = useState<'login' | 'register'>(initialType);

  useEffect(() => {
    setModalMode(initialType);
  }, [initialType]);

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
          {/* Dark overlay */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Centered Modal */}
          <motion.div
            className={`fixed inset-0 flex items-center justify-center p-4 z-50`}
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

              {/* Forms */}
              {modalMode === 'login' ? (
                <LoginForm
                  onSuccess={onClose}
                  onSwitch={() => setModalMode('register')}
                />
              ) : (
                <SignupForm
                  onSuccess={onClose}
                  onSwitch={() => setModalMode('login')}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const TopNavbar: React.FC<{ sidebarWidth: number }> = ({ sidebarWidth }) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAuthClick = (type: 'login' | 'register') => {
    setAuthType(type);
    setAuthOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-[20] flex justify-between items-center px-3 md:px-4 py-2 border-b border-gray-700 bg-[#0f172a]/95 backdrop-blur-md">
        <div className="flex items-center justify-between w-full">
          <div className="relative w-28 h-10 px-2">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleAuthClick('register')}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl px-6 py-2 rounded-lg text-white font-medium transition-all duration-300"
            >
              Register
            </button>
            <button
              onClick={() => handleAuthClick('login')}
              className="text-slate-400 hover:text-white transition-colors duration-300"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialType={authType}
        isMobile={isMobile}
      />
    </>
  );
};
