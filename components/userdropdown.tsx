
"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import VaultINR from "@/components/vault/vaultmain";
import UserVipCard from "@/components/form/vip";
import ShowStatistics from "@/components/statistics/statisticsmain";
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

/** ✅ NEW LOGOUT MODAL COMPONENT INSIDE THE SAME FILE */
const LogoutModal = ({
  open,
  onConfirm,
  onClose,
}: {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
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
            <img src="/logo.png" className="w-20 h-auto mx-auto mb-3 opacity-90" />

            <h2 className="text-white text-xl font-semibold mb-2">Are you sure?</h2>
            <p className="text-gray-400 text-sm mb-6">
              You will be logged out from your account.
            </p>

            <button
              onClick={onConfirm}
              className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition mb-2"
            >
              Yes, Logout
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const UserDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showVipForm, setShowVipForm] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showLogout, setShowLogout] = useState(false); // ✅ Logout modal state

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow =
      showVipForm || showVault || showStats || showWallet || showLogout
        ? "hidden"
        : "";
  }, [showVipForm, showVault, showStats, showWallet, showLogout]);

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
    { label: "Wallet", icon: Wallet, popup: "wallet" },
    { label: "Vault", icon: Vault, popup: "vault" },
    { label: "VIP", icon: Trophy, popup: "vip" },
    { label: "Affiliate", icon: Users, route: "/homesidebarroutes/affiliates" },
    { label: "Statistics", icon: BarChart2, popup: "statistics" },
    { label: "Transactions", icon: Receipt, route: "/transactions" },
    { label: "My Bets", icon: ClipboardList, route: "/mybet" },
    { label: "Settings", icon: Settings, route: "/setting" },
    { label: "Rise Smart", icon: ShieldCheck, route: "/homesidebarroutes/responsiblegambling" },
    { label: "Live Support", icon: Headphones, route: "/support" },
    { label: "Logout", icon: LogOut, popup: "logout" },
  ];

  const handleClick = (item: (typeof menuItems)[number]) => {
    if (item.popup === "logout") {
      setShowLogout(true);
    } else if (item.popup === "vip") {
      setShowVipForm(true);
    } else if (item.popup === "vault") {
      setShowVault(true);
    } else if (item.popup === "statistics") {
      setShowStats(true);
    } else if (item.popup === "wallet") {
      setShowWallet(true);
    } else if (item.route) {
      router.push(item.route);
    }
    setOpen(false);
  };

  const logoutConfirm = () => {
    localStorage.removeItem("token");
    setShowLogout(false);
    router.push("/");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <User
        size={25}
        className="cursor-pointer text-gray-200 hover:text-white"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-700 rounded-xl shadow-xl z-50 py-2">
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

      {/* ✅ VIP MODAL */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showVipForm && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.target === e.currentTarget && setShowVipForm(false)}
              >
                <UserVipCard onClose={() => setShowVipForm(false)} />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* ✅ VAULT MODAL */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showVault && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.target === e.currentTarget && setShowVault(false)}
              >
                <VaultINR onClose={() => setShowVault(false)} />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* ✅ STATISTICS MODAL */}
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
                <ShowStatistics onClose={() => setShowStats(false)} />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* ✅ WALLET MODAL */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showWallet && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.target === e.currentTarget && setShowWallet(false)}
              >
                <WalletPopup onClose={() => setShowWallet(false)} />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* ✅ LOGOUT CONFIRM MODAL */}
      {typeof window !== "undefined" &&
        createPortal(
          <LogoutModal
            open={showLogout}
            onClose={() => setShowLogout(false)}
            onConfirm={logoutConfirm}
          />,
          document.body
        )}
    </div>
  );
};

export default UserDropdown;
