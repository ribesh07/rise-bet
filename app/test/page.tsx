"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ComingSoonModalProps {
  open: boolean;
  onClose: () => void;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ open, onClose }) => {
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
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-[#1E2B3A] text-center p-8 rounded-2xl shadow-xl border border-[#2E3C4A] w-[300px]"
          >
            <h1 className="text-white text-2xl font-semibold mb-2">
              Coming Soon
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              This feature is under development.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-[#2E3C4A] text-white hover:bg-[#354556] transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComingSoonModal;
