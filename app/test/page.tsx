"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ComingSoonModalProps {
  open: boolean;
  onClose: () => void;
  onLogin?: () => void;
  onRegister?: () => void;
}

const LoginModal: React.FC<ComingSoonModalProps> = ({
  open,
  onClose,
  onLogin,
  onRegister,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative bg-[#1E2B3A] text-center p-8 rounded-2xl shadow-xl border border-[#2E3C4A] w-[330px]"
          >
            {/* Close X Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-300 hover:text-white transition"
            >
              ✕
            </button>

            <h1 className="text-white text-2xl font-semibold mb-2">
              Login Required
            </h1>

            <p className="text-gray-400 text-sm mb-6">
              You must sign in to play this game.
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={onLogin}
                className="w-full py-2 rounded-xl bg-[#2E3C4A] text-white hover:bg-[#354556] transition font-medium"
              >
                Login
              </button>

              <button
                onClick={onRegister}
                className="w-full py-2 rounded-xl bg-white text-black hover:bg-gray-200 transition font-medium"
              >
                Register
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
