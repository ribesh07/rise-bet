
"use client";
import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Settings, Bell, X } from "lucide-react";
import Link from "next/link";
import UserDropdown from "./userdropdown";
import { Button } from "@/components/ui/button";
import WalletPopup from "@/components/wallet/walletmain";
import { useNotifications } from "@/context/NotificationContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCurrency } from "@/context/CurrencyContext";

interface WalletData {
  symbol: string;
  balance: number | null | undefined;
  icon?: string;
}

interface TopNavbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  wallets: any[];
  onCurrencyChange?: (currency: string) => void;
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

const FIAT = ["INR", "USD", "EUR"];

/* 🔥 Rise-STYLE BALANCE FORMAT */
const formatBalance = (symbol: string, balance?: number | null) => {
  if (!balance || isNaN(balance)) return "0";

  // Fiat → 2 decimals
  if (FIAT.includes(symbol)) {
    return balance.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Crypto → up to 8 decimals, trim zeros
  return balance
    .toFixed(8)
    .replace(/\.?0+$/, "");
};

const TopNavbar: React.FC<TopNavbarProps> = ({
  searchValue,
  onSearchChange,
  wallets: walletsProp,
  onCurrencyChange,
}) => {
  const { notifications, unreadCount, markAsRead, markAllRead } =
    useNotifications();
  const { setCurrency } = useCurrency();

  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [filteredWallets, setFilteredWallets] = useState<WalletData[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletData | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!walletsProp?.length) return;

    const converted = walletsProp.map((w: any) => ({
      symbol: w.currency,
      balance: Number(w.balance || 0),
      icon:
        walletIcons.find((i) => i.symbol === w.currency)?.icon ||
        "/images/default.svg",
    }));

    converted.sort((a, b) => (b.balance || 0) - (a.balance || 0));

    setWallets(converted);
    setFilteredWallets(converted);

    if (!selectedWallet && converted.length) {
      setSelectedWallet(converted[0]);
      setCurrency(converted[0].symbol);
      onCurrencyChange?.(converted[0].symbol);
    }
  }, [walletsProp]);

  useEffect(() => {
    setFilteredWallets(
      wallets.filter((w) =>
        w.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, wallets]);

  const selectWallet = (wallet: WalletData) => {
    setSelectedWallet(wallet);
    setCurrency(wallet.symbol);
    onCurrencyChange?.(wallet.symbol);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <header className="relative z-[30] flex items-center justify-between px-3 md:px-6 py-2 bg-[#101b22dd] backdrop-blur-md">
        {/* LOGO */}
        <Link href="/">
          <img src="/logo.png" className="hidden md:block w-28" />
          <img src="/logomobile.png" className="md:hidden w-10 h-10" />
        </Link>

        {/* WALLET */}
        <div className="relative">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-[#0d1720] border border-[#2b3340] rounded-lg px-3 py-1.5 cursor-pointer"
          >
            <span className="text-sm text-white font-semibold">
              {selectedWallet
                ? formatBalance(
                    selectedWallet.symbol,
                    selectedWallet.balance
                  )
                : "0"}
            </span>

            {selectedWallet && (
              <div className="flex items-center gap-1 text-white text-sm font-semibold">
                <img src={selectedWallet.icon} className="w-4 h-4" />
                <span>{selectedWallet.symbol}</span>
              </div>
            )}

            <ChevronDown
              size={16}
              className={`transition ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />

            <Button
              variant="ghost"
              className="hidden md:inline bg-[#1e293b] text-xs text-white px-3"
            >
              Wallet
            </Button>
          </div>

          {isDropdownOpen && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-80 bg-[#0d1720] border border-[#2b3340] rounded-xl z-50">
              <div className="flex items-center px-3 py-2 border-b border-[#2b3340]">
                <Search size={16} className="text-gray-400 mr-2" />
                <input
                  placeholder="Search Currencies"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent w-full text-sm text-white outline-none"
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
                      <span className="text-white text-sm">
                        {wallet.symbol}
                      </span>
                    </div>
                    <span className="text-gray-300 text-sm font-mono">
                      {formatBalance(wallet.symbol, wallet.balance)}
                    </span>
                  </div>
                ))}
              </div>

              <div
                onClick={() => {
                  setIsDropdownOpen(false);
                  setShowWalletPopup(true);
                }}
                className="border-t border-[#2b3340] px-4 py-2 text-center text-sm text-blue-400 hover:bg-[#1a2633] cursor-pointer"
              >
                <Settings size={16} className="inline mr-2" />
                Wallet Settings
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <Search size={26} className="hidden md:block" />
          <UserDropdown />

          <div className="relative">
            <Bell
              size={26}
              className="cursor-pointer"
              onClick={() => setDrawerOpen(!drawerOpen)}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] px-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </header>

      <ToastContainer position="top-right" autoClose={2500} theme="dark" />

      {showWalletPopup && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center">
          <WalletPopup onClose={() => setShowWalletPopup(false)} />
        </div>
      )}
    </>
  );
};

export default TopNavbar;
