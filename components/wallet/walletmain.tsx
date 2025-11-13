
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, X } from "lucide-react";

import WalletOverview from "@/components/wallet/WalletOverview";
import WalletWithdraw from "@/components/wallet/WalletWithdraw";
import WalletDeposit from "@/components/wallet/WalletDeposit";
import WalletTip from "@/components/wallet/WalletTip";
import WalletSetting from "@/components/wallet/WalletSetting";
import WalletSuccess from "@/components/wallet/WalletSuccess";

const WalletPopup = ({ onClose }: { onClose: () => void }) => {
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [successType, setSuccessType] = useState<"withdraw" | "tip" | "deposit" | null>(null);

  const coins = [
    { symbol: "INR", icon: "/images/inr.png", name: "Indian Rupee" },
    { symbol: "BTC", icon: "/images/btc.png", name: "Bitcoin" },
    { symbol: "ETH", icon: "/images/eth.png", name: "Ethereum" },
    { symbol: "LTC", icon: "/images/ltc.png", name: "Litecoin" },
    { symbol: "USDT", icon: "/images/usdt.png", name: "Tether" },
    { symbol: "SOL", icon: "/images/sol.png", name: "Solana" },
    { symbol: "XRP", icon: "/images/xrp.png", name: "Ripple" },
    { symbol: "BNB", icon: "/images/bnb.png", name: "Binance Coin" },
    { symbol: "TRX", icon: "/images/trx.png", name: "Tron" },
    { symbol: "USDC", icon: "/images/usdc.png", name: "USD Coin" },
  ];

  const [balances, setBalances] = useState<Record<string, number>>({
    INR: 540.75,
    BTC: 0.0021,
    ETH: 0.052,
    LTC: 1.1,
    USDT: 20,
    SOL: 3.2,
    XRP: 210,
    BNB: 0.85,
    TRX: 150.0,
    USDC: 0.00,
  });

  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const currentBalance = balances[selectedCoin.symbol] || 0;

  const [hideZero, setHideZero] = useState(false);
  const [displayFiat, setDisplayFiat] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("INR");

  const updateCoinBalance = (
    symbol: string,
    newBalance: React.SetStateAction<number>
  ) => {
    setBalances((prev) => {
      const prevValue = prev[symbol] ?? 0;
      const value =
        typeof newBalance === "function"
          ? (newBalance as (prevVal: number) => number)(prevValue)
          : newBalance;
      return { ...prev, [symbol]: value };
    });
  };

  return (
    <motion.div
      className="bg-[#0C1A2A] w-[400px] rounded-2xl p-6 shadow-xl relative text-white"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 text-gray-400 hover:text-white"
      >
        <X size={20} />
      </button>

      <div className="text-xl font-semibold flex items-center mb-5">
        <Wallet size={24} className="mr-2" /> Wallet
      </div>

      {/* Tabs */}
      {!showWithdraw && !showDeposit && !successType && (
        <div className="flex bg-[#13283D] rounded-2xl mb-5 text-sm font-medium overflow-hidden">
          {["Overview", "Tip", "Setting"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 py-2 transition ${
                selectedTab === tab
                  ? "bg-[#1C2F45] text-white"
                  : "text-gray-400 hover:bg-[#1C2F45]/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {successType ? (
        <WalletSuccess
          type={successType}
          onBack={() => setSuccessType(null)}
          balance={currentBalance}
        />
      ) : showWithdraw ? (
        <WalletWithdraw
          balance={currentBalance}
          setBalance={(newBalance) =>
            updateCoinBalance(selectedCoin.symbol, newBalance)
          }
          onBack={() => setShowWithdraw(false)}
          onSuccess={() => setSuccessType("withdraw")}
          selectedCoin={selectedCoin}
        />
      ) : showDeposit ? (
        <WalletDeposit
          balance={currentBalance}
          setBalance={(newBalance) =>
            updateCoinBalance(selectedCoin.symbol, newBalance)
          }
          onBack={() => setShowDeposit(false)}
          onSuccess={() => setSuccessType("deposit")}
        />
      ) : selectedTab === "Overview" ? (
        <WalletOverview
          coins={coins}
          balances={balances}
          selectedCoin={selectedCoin}
          onSelectCoin={setSelectedCoin}
          onWithdraw={() => setShowWithdraw(true)}
          onDeposit={() => setShowDeposit(true)}
          hideZero={hideZero}
          displayFiat={displayFiat}
          selectedCurrency={selectedCurrency}
        />
      ) : selectedTab === "Tip" ? (
        <WalletTip
          balance={currentBalance}
          setBalance={(newBalance) =>
            updateCoinBalance(selectedCoin.symbol, newBalance)
          }
          selectedCoin={selectedCoin}
          onSuccess={() => setSuccessType("tip")}
        />
      ) : (
        <WalletSetting
          hideZero={hideZero}
          setHideZero={setHideZero}
          displayFiat={displayFiat}
          setDisplayFiat={setDisplayFiat}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
        />
      )}
    </motion.div>
  );
};

export default WalletPopup;
