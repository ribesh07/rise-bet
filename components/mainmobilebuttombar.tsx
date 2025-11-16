
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Home, Wallet, User, MessageSquare, Menu, ClipboardList, X } from "lucide-react";
import WalletMain from "@/components/wallet/walletmain"; // ✅ Import your WalletMain popup

interface MobileBottomBarProps {
  onBrowseClick: () => void;
}

const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onBrowseClick }) => {
  const [showWallet, setShowWallet] = useState(false);

  return (
    <>
      {/* ✅ Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1e293b] border-t border-gray-700 flex justify-around items-center py-2 sm:hidden z-50">
        {/* Browse (Opens Sidebar) */}
        <button
          onClick={onBrowseClick}
          className="flex flex-col items-center text-gray-300 hover:text-white"
        >
          <Menu size={22} />
          <span className="text-xs">Browse</span>
        </button>

        <Link href="/" className="flex flex-col items-center text-gray-300 hover:text-white">
          <Home size={22} />
          <span className="text-xs">Home</span>
        </Link>

        <Link href="#" className="flex flex-col items-center text-gray-300 hover:text-white">
          <ClipboardList size={22} />
          <span className="text-xs">Bets</span>
        </Link>

        {/* ✅ Wallet opens popup */}
        {/* <button
          onClick={() => setShowWallet(true)}
          className="flex flex-col  items-center text-gray-300 hover:text-white"
        >
          <Wallet size={22} />
          <span className="text-xs">Wallet</span>
        </button> */}

        <Link href="#" className="flex flex-col items-center text-gray-300 hover:text-white">
          <MessageSquare size={22} />
          <span className="text-xs">Chat</span>
        </Link>
      </div>

      {/* ✅ Wallet Popup Modal */}
      {showWallet && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex justify-center items-center p-4">
          <div className="relative p-4">
            <WalletMain onClose={() => setShowWallet(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default MobileBottomBar;
