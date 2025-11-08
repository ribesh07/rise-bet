
"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import VaultINR from "@/components/vault/vaultmain";
import UserVipCard from "@/components/form/vip";
import ShowStatistics from "@/components/statistics/statisticsmain"; // ✅ Correct import
import WalletPopup from "@/components/wallet/walletmain";

import {
  Wallet,
  Vault,
  Trophy,
  Users,
  BarChart2,
  Receipt,
  ClipboardList,
  Settings,
  ShieldCheck,
  Headphones,
  LogOut,
  User,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

const UserDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showVipForm, setShowVipForm] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [showStats, setShowStats] = useState(false); // ✅ added state for statistics modal
  const [showWallet, setShowWallet] = useState(false); // ✅ added state for wallet modal
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Prevent background scroll when modals open
  useEffect(() => {
    document.body.style.overflow =
      showVipForm || showVault || showStats || showWallet  ? "hidden" : "";
  }, [showVipForm, showVault, showStats, showWallet]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const menuItems = [
    { label: "Wallet", icon: Wallet, popup: "wallet" },
    { label: "Vault", icon: Vault, popup: "vault" },
    { label: "VIP", icon: Trophy, popup: "vip" },
    { label: "Affiliate", icon: Users, route: "/homesidebarroutes/affiliates" },
    { label: "Statistics", icon: BarChart2, popup: "statistics" },
    { label: "Transactions", icon: Receipt, route: "/transactions" },
    { label: "My Bets", icon: ClipboardList, route: "/mybet" },
    { label: "Settings", icon: Settings, route: "/settings" },
    { label: "Rise Smart", icon: ShieldCheck, route: "/homesidebarroutes/responsiblegambling" },
    { label: "Live Support", icon: Headphones, route: "/support" },
    { label: "Logout", icon: LogOut, route: "/" },
  ];

  const handleClick = (item: (typeof menuItems)[number]) => {
    if (item.label === "Logout") {
      localStorage.removeItem("token");
      router.push("/");
    } else if (item.popup === "vip") {
      setShowVipForm(true);
    } else if (item.popup === "vault") {
      setShowVault(true);
    } else if (item.popup === "statistics") {
      setShowStats(true); // ✅ show statistics modal
       } else if (item.popup === "wallet") {
      setShowWallet(true);
    } else if (item.route) {
      router.push(item.route);
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Icon */}
      <User
        size={25}
        className="cursor-pointer text-gray-200 hover:text-white"
        onClick={() => setOpen(!open)}
      />

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-[#1e293b] border border-gray-700 rounded-xl shadow-xl z-50 py-2">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm text-gray-200 hover:bg-[#243249] transition-colors"
              onClick={() => handleClick(item)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* VIP MODAL */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showVipForm && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowVipForm(false);
                }}
              >
                <UserVipCard onClose={() => setShowVipForm(false)} />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* VAULT MODAL */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showVault && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowVault(false);
                }}
              >
                <VaultINR onClose={() => setShowVault(false)} />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* STATISTICS MODAL ✅ */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showStats && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowStats(false);
                }}
              >
                <ShowStatistics onClose={() => setShowStats(false)} />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      {/* WALLET MODAL ✅ */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showWallet && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowWallet(false);
                }}
              >
                <WalletPopup onClose={() => setShowWallet(false)} />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};

export default UserDropdown;
