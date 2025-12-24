
"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import GameCard from "@/components/game/gameinfo";

import {
  Users,
  BarChart2,
  Receipt,
  ClipboardList,
  Settings,
  User,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";




const GameDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow =
      showStats 
        ? "hidden"
        : "";
  }, [ showStats]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const menuItems = [
    
    
    { label: "Game info", icon: ClipboardList, popup: "GameCard" },
  
   
   
  ];

  const handleClick = (item: (typeof menuItems)[number]) => {
     if (item.popup === "GameCard") {
      setShowStats(true);
    }
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-4 text-[#8fa6b5]" ref={dropdownRef}>
      <Settings
        size={18}
        className="hover:text-white transition"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="relative left-0 top-0 mt-2 w-40 bg-white border border-gray-700 rounded-xl shadow-xl z-50 py-2">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm text-gray-800 hover:bg-gray-300 transition"
              onClick={() => handleClick(item)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}


      {/* ✅ GAME MODAL */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showStats && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.target === e.currentTarget && setShowStats(false)}
              >
                <GameCard onClose={() => setShowStats(false)} />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* ✅ WALLET MODAL */}
    

     
    
    </div>
  );
};

export default GameDropdown;
