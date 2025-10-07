
"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import UserVipCard from "@/components/form/vip";
import {
  User,
  CreditCard,
  Gift,
  PieChart,
  ListChecks,
  Lock,
  Settings,
  HeartHandshakeIcon,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UserDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showVipForm, setShowVipForm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown if clicked outside
 

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showVipForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showVipForm]);

  const menuItems = [
    { label: "Wallet Vault", icon: CreditCard },
    { label: "VIP", icon: Gift },
    { label: "Affiliate", icon: PieChart },
    { label: "Statistics", icon: ListChecks },
    { label: "Transaction", icon: CreditCard },
    { label: "My Bets", icon: Lock },
    { label: "Settings", icon: Settings },
    { label: "Stake Smart", icon: HeartHandshakeIcon },
    { label: "Live Support", icon: HelpCircle },
    { label: "Logout", icon: LogOut, route: "/" },
  ];

  const handleClick = (item: typeof menuItems[number]) => {
    if (item.label === "Logout") {
      localStorage.removeItem("token");
    }

    if (item.label === "VIP") {
      setShowVipForm(true);
    } else if (item.route) {
      router.push(item.route);
    }

    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User icon */}
      <User size={25} className="cursor-pointer" onClick={() => setOpen(!open)} />

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-gray-700 rounded-lg shadow-lg z-50">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              className="flex items-center gap-2 px-4 py-2 w-full text-left text-sm hover:bg-[#243249] transition-colors"
              onClick={() => handleClick(item)}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* VIP Modal Portal */}
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
                  if (e.target === e.currentTarget) {
                    setShowVipForm(false);
                  }
                }}
                // click on backdrop closes modal
              >
                  {/* Modal content */}
                  
                  <UserVipCard onClose={() => setShowVipForm(false)} />
                
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};

export default UserDropdown;
