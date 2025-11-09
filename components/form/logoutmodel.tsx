"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ open, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative bg-[#0A0F1E]/90 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-[350px] text-center"
          >
            {/* Close X button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <X size={20} />
            </button>

            {/* Logo */}
            <img
              src="/logo.png"
              alt="Logo"
              className="w-20 h-auto mx-auto mb-3 opacity-90"
            />

            <h1 className="text-white text-xl font-semibold mb-2">
              Are you sure?
            </h1>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              You will be signed out of your account.
            </p>

            {/* ✅ Confirm Logout */}
            <button
              onClick={onConfirm}
              className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition duration-200 mb-2"
            >
              Yes, Logout
            </button>

            {/* ✅ Cancel */}
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition duration-200"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;
