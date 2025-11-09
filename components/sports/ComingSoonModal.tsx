
"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ComingSoonModalProps {
  open: boolean;
  onClose: () => void;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ duration: 0.35, type: "spring", stiffness: 120 }}
            className="relative bg-[#101b22dd]  text-center p-8 rounded-2xl shadow-2xl border border-[#273341]/60 w-[330px]"
          >
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <Image
                src="/logo.png"
                alt="logo"
                width={55}
                height={55}
                className="drop-shadow-md"
              />
            </div>

            <h1 className="text-white text-2xl font-semibold mb-1 tracking-wide">
              Coming Soon
            </h1>

            <motion.p
              className="text-gray-400 text-sm mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              This feature is being built with care. Stay tuned!
            </motion.p>

            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-xl bg-[#2E3C4A] text-white hover:bg-[#3d4c60] transition shadow-md"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComingSoonModal;
