
"use client";
import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Settings, Bell } from "lucide-react";
import Link from "next/link";
import UserDropdown from "./userdropdown";
import { Button } from "@/components/ui/button";

interface WalletData {
  symbol: string;
  balance: number | null | undefined;
  icon?: string;
}

interface TopNavbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

// ✅ Centralized list of wallet symbols + icons
const walletIcons = [
  { symbol: "INR", icon: "/coins/inr.png" },
  { symbol: "BTC", icon: "/coins/btc.png" },
  { symbol: "ETH", icon: "/coins/eth.png" },
  { symbol: "LTC", icon: "/coins/ltc.png" },
  { symbol: "USDT", icon:"/coins/usdt.png" },
  { symbol: "SOL", icon: "/coins/sol.png" },
  { symbol: "XRP", icon: "/coins/xrp.png" },
  { symbol: "TRX", icon: "/coins/trx.png" },
  { symbol: "BNB", icon: "/coins/bnb.png" },
  { symbol: "USDC", icon: "/coins/usdc.png" },
];

const TopNavbar: React.FC<TopNavbarProps> = ({ searchValue, onSearchChange }) => {
  // ✅ Static wallet data
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
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Format balance (INR → 2 decimals, others → 8)
  const formatBalance = (symbol: string, balance?: number | null) => {
    if (!balance || isNaN(balance))
      return symbol === "INR" ? "0.00" : "0.00000000";
    return symbol === "INR" ? balance.toFixed(2) : balance.toFixed(8);
  };

  // ✅ Load static wallet data + attach icons
  useEffect(() => {
    const withIcons = walletData.map((wallet) => {
      const found = walletIcons.find((w) => w.symbol === wallet.symbol);
      return { ...wallet, icon: found?.icon || "/coins/default.svg" };
    });

    const sorted = withIcons.sort((a, b) => (b.balance || 0) - (a.balance || 0));
    setWallets(sorted);
    setFilteredWallets(sorted);
    setSelectedWallet(sorted[0]);
  }, []);

  // ✅ Filter wallets
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

  return (
    <header className="relative top-0 z-[30] flex items-center justify-between px-3 md:px-6 py-2 bg-[#101b22dd] backdrop-blur-md">
      {/* 🔹 Left Section - Logo */}
      <div className="flex items-center">
        <Link href="/">
          <img
            src="/logo.png"
            alt="Logo"
            className="hidden md:block w-28 h-auto cursor-pointer"
          />
          <img
            src="/logomobile.png"
            alt="Logo Mobile"
            className="block md:hidden w-10 h-10 cursor-pointer"
          />
        </Link>
      </div>

      {/* 🔹 Center Section - Wallet Selector */}
      <div className="relative flex justify-center items-center">
        <div
          onClick={toggleDropdown}
          className="flex items-center gap-2 rounded-lg bg-[#0d1720] border border-[#2b3340] px-3 py-1.5 shadow-sm hover:border-[#4a9fff] transition-all duration-300 cursor-pointer"
        >
          {/* Balance */}
          <span className="text-neutral-200 text-sm font-semibold font-sans whitespace-nowrap overflow-hidden text-ellipsis max-w-[16ch]">
            {selectedWallet
              ? formatBalance(selectedWallet.symbol, selectedWallet.balance)
              : "0.00000000"}
          </span>

          {/* Icon + Symbol */}
          {selectedWallet && (
            <div className="flex items-center gap-1 text-white text-sm font-semibold">
              <img
                src={selectedWallet.icon}
                alt={selectedWallet.symbol}
                className="w-4 h-4"
              />
              <span className="truncate">{selectedWallet.symbol}</span>
            </div>
          )}

          <ChevronDown
            size={16}
            className={`text-white transition-transform duration-300 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />

          <Button
            variant="ghost"
            className="hidden md:inline bg-[#1e293b] hover:bg-[#263445] text-xs text-white px-3 py-1 rounded-full border border-[#2b3340]"
          >
            Wallet
          </Button>
        </div>

        {/* 🔹 Dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 
            bg-[#0d1720] border border-[#2b3340] rounded-xl 
            shadow-[0_0_15px_rgba(74,159,255,0.15)] w-80 
            overflow-hidden animate-fade-in z-50">
            
            {/* Search */}
            <div className="flex items-center px-3 py-2 border-b border-[#2b3340] bg-[#0f1a23]">
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search Currencies"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Wallet List */}
            <div className="max-h-72 overflow-y-auto custom-scrollbar">
              {filteredWallets.length === 0 ? (
                <p className="text-gray-400 text-center py-3 text-sm">No results</p>
              ) : (
                filteredWallets.map((wallet) => (
                  <div
                    key={wallet.symbol}
                    onClick={() => selectWallet(wallet)}
                    className={`flex justify-between items-center px-4 py-2 hover:bg-[#1a2633] cursor-pointer transition ${
                      selectedWallet?.symbol === wallet.symbol ? "bg-[#1a2633]" : ""
                    }`}
                  >
                    {/* Left: Coin Info */}
                    <div className="flex items-center gap-2 min-w-[90px]">
                      <img
                        src={wallet.icon}
                        alt={wallet.symbol}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="text-white text-sm font-medium">
                        {wallet.symbol}
                      </span>
                    </div>

                    {/* Right: Balance */}
                    <span className="text-sm text-gray-300 font-mono text-right min-w-[110px]">
                      {formatBalance(wallet.symbol, wallet.balance)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Wallet Settings */}
            <div className="border-t border-[#2b3340] bg-[#0f1a23] px-4 py-2 flex items-center justify-center hover:bg-[#1a2633] cursor-pointer transition">
              <Settings size={16} className="text-[#4a9fff] mr-2" />
              <span className="text-sm text-white font-medium">
                Wallet Settings
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 🔹 Right Section - User & Notifications */}
      <div className="flex items-center gap-3">
        <Search
          className="hidden md:block cursor-pointer hover:text-blue-400 transition"
          size={28}
        />
        <UserDropdown />
        <Bell className="cursor-pointer hover:text-blue-400 transition" size={28} />
      </div>
    </header>
  );
};

export default TopNavbar;
