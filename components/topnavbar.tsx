
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Settings, Bell, X } from "lucide-react";
import Link from "next/link";
import UserDropdown from "./userdropdown";
import { Button } from "@/components/ui/button";
import WalletPopup from "@/components/wallet/walletmain";
import { useNotifications } from "@/context/NotificationContext";
// import { playNotificationSound } from "@/utils/notificationSound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface WalletData {
  symbol: string;
  balance: number | null | undefined;
  icon?: string;
}

interface TopNavbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const walletIcons = [
  { symbol: "INR", icon: "/images/inr.png" },
  { symbol: "BTC", icon: "/images/btc.png" },
  { symbol: "ETH", icon: "/images/eth.png" },
  { symbol: "LTC", icon: "/images/ltc.png" },
  { symbol: "USDT", icon: "/images/usdt.png" },
  { symbol: "SOL", icon: "/images/sol.png" },
  { symbol: "XRP", icon: "/images/xrp.png" },
  { symbol: "TRX", icon: "/images/trx.png" },
  { symbol: "BNB", icon: "/images/bnb.png" },
  { symbol: "USDC", icon: "/images/usdc.png" },
];

const TopNavbar: React.FC<TopNavbarProps> = ({ searchValue, onSearchChange }) => {
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();

  const walletData: WalletData[] = [
    { symbol: "BTC", balance: 0.0001234 },
    { symbol: "ETH", balance: 0.01234567 },
    { symbol: "LTC", balance: 0.00345678 },
    { symbol: "USDT", balance: 50.25 },
    { symbol: "SOL", balance: 1.23 },
    { symbol: "XRP", balance: 200.0012 },
    { symbol: "TRX", balance: 1000.456 },
    { symbol: "BNB", balance: 0.56 },
    { symbol: "USDC", balance: 25.5 },
    { symbol: "INR", balance: 5000.0 },
  ];

  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [filteredWallets, setFilteredWallets] = useState<WalletData[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    // playNotificationSound();
  };

  const formatBalance = (symbol: string, balance?: number | null) => {
    if (!balance || isNaN(balance))
      return symbol === "INR" ? "0.00" : "0.00000000";
    return symbol === "INR" ? balance.toFixed(2) : balance.toFixed(8);
  };

  useEffect(() => {
    const withIcons = walletData.map((wallet) => {
      const found = walletIcons.find((w) => w.symbol === wallet.symbol);
      return { ...wallet, icon: found?.icon || "/images/default.svg" };
    });
    const sorted = withIcons.sort((a, b) => (b.balance || 0) - (a.balance || 0));
    setWallets(sorted);
    setFilteredWallets(sorted);
    setSelectedWallet(sorted[0]);
  }, []);

  useEffect(() => {
    const filtered = wallets.filter((w) =>
      w.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWallets(filtered);
  }, [searchTerm, wallets]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const selectWallet = (wallet: WalletData) => {
    setSelectedWallet(wallet);
    setIsDropdownOpen(false);
  };
  const openWalletPopup = () => {
    setIsDropdownOpen(false);
    setShowWalletPopup(true);
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="relative top-0 z-[30] flex items-center justify-between px-3 md:px-6 py-2 bg-[#101b22dd] backdrop-blur-md">

        {/* Logo */}
        <div>
          <Link href="/">
            <img src="/logo.png" className="hidden md:block w-28 cursor-pointer" />
            <img src="/logomobile.png" className="block md:hidden w-10 h-10 cursor-pointer" />
          </Link>
        </div>

        {/* Wallet */}
        <div className="relative flex justify-center items-center">
          <div
            onClick={toggleDropdown}
            className="flex items-center gap-2 rounded-lg bg-[#0d1720] border border-[#2b3340] px-3 py-1.5 cursor-pointer"
          >
            <span className="text-neutral-200 text-sm font-semibold">
              {selectedWallet ? formatBalance(selectedWallet.symbol, selectedWallet.balance) : "0.00000000"}
            </span>

            {selectedWallet && (
              <div className="flex items-center gap-1 text-white text-sm font-semibold">
                <img src={selectedWallet.icon} alt="" className="w-4 h-4" />
                <span>{selectedWallet.symbol}</span>
              </div>
            )}

            <ChevronDown size={16} className={`text-white transition ${isDropdownOpen ? "rotate-180" : ""}`} />

            <Button variant="ghost" className="hidden md:inline bg-[#1e293b] text-xs text-white px-3">
              Wallet
            </Button>
          </div>

          {isDropdownOpen && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[#0d1720] border border-[#2b3340] rounded-xl w-80 z-50">

              <div className="flex items-center px-3 py-2 border-b border-[#2b3340] bg-[#0f1a23]">
                <Search size={16} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search Currencies"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm text-white"
                />
              </div>

              <div className="max-h-72 overflow-y-auto">
                {filteredWallets.map((wallet) => (
                  <div
                    key={wallet.symbol}
                    onClick={() => selectWallet(wallet)}
                    className="flex justify-between items-center px-4 py-2 hover:bg-[#1a2633]"
                  >
                    <div className="flex items-center gap-2">
                      <img src={wallet.icon} className="w-5 h-5" />
                      <span className="text-white text-sm">{wallet.symbol}</span>
                    </div>

                    <span className="text-sm text-gray-300 font-mono">
                      {formatBalance(wallet.symbol, wallet.balance)}
                    </span>
                  </div>
                ))}
              </div>

              <div
                onClick={openWalletPopup}
                className="border-t border-[#2b3340] bg-[#0f1a23] px-4 py-2 flex items-center justify-center hover:bg-[#1a2633] cursor-pointer"
              >
                <Settings size={16} className="text-blue-400 mr-2" />
                <span className="text-sm text-white font-medium">Wallet Settings</span>
              </div>
            </div>
          )}
        </div>

{/* Right Section */}
<div className="flex items-center gap-3">
  <Search size={28} className="hidden md:block cursor-pointer" />
  <UserDropdown />

  {/* NOTIFICATION BELL */}
  {/* NOTIFICATION DROPDOWN */}
  <div className="relative">
  <div
    onClick={() => setDrawerOpen((prev) => !prev)}
    className="cursor-pointer relative"
  >
    <Bell size={28} className="hover:text-blue-400" />

    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] px-1 rounded-full">
        {unreadCount}
      </span>
    )}
  </div>

  {/* DROPDOWN BOX */}
  {drawerOpen && (
    <div
      className="absolute right-0 mt-3 w-80 bg-[#0d1720] border border-[#2b3340] rounded-xl shadow-[0_0_15px_rgba(74,159,255,0.15)] z-50 animate-dropdown"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-[#2b3340]">
        <span className="text-white font-semibold text-sm">Notifications</span>
        <button onClick={() => setDrawerOpen(false)}>
          <X size={16} className="text-gray-400 hover:text-white" />
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-72 overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-400 py-4 text-sm">No new notifications</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markAsRead(n.id);
                setDrawerOpen(false);
              }}
              className="px-4 py-3 hover:bg-[#1a2633] cursor-pointer transition flex justify-between items-start border-b border-[#1b2635]"
            >
              <div className="pr-2">
                <p className="text-white text-sm font-medium">{n.title}</p>
                <p className="text-gray-400 text-xs mt-1">{n.message}</p>
                <p className="text-gray-500 text-[10px] mt-1">{n.timestamp}</p>
              </div>

              {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div
          onClick={() => {
            markAllRead();
            setDrawerOpen(false);
          }}
          className="text-center py-2 text-sm text-blue-400 hover:text-blue-300 border-t border-[#2b3340] cursor-pointer"
        >
          Mark All Read
        </div>
      )}
    </div>
)}
          </div>
        </div>
      </header>

      {/* SIDE DRAWER OVERLAY */}
      

      {/* NOTIFICATION DRAWER */}
     

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />

      {/* Wallet Popup */}
      {showWalletPopup && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-center">
          <WalletPopup onClose={() => setShowWalletPopup(false)} />
        </div>
      )}
    </>
  );
};

export default TopNavbar;
