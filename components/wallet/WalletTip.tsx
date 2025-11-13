
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface Props {
  balance: number;
  setBalance: (v: number) => void;
  selectedCoin: {
    name: string;
    symbol: string;
    icon: string; // ✅ fixed property name
    inrValue?: number;
    minAmount?: number;
  };
  onSuccess: () => void;
}

const WalletTip: React.FC<Props> = ({
  balance,
  setBalance,
  selectedCoin,
  onSuccess,
}) => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");

  const minAmount = selectedCoin.minAmount || 0.01;

  const handleTip = () => {
    const val = parseFloat(amount);
    if (!recipient.trim()) return setError("Enter recipient address");
    if (!val || val <= 0) return setError("Enter valid amount");
    if (val > balance) return setError("Insufficient balance");

    setError("");
    setBalance(balance - val);
    setShowPopup(true);
    onSuccess();
    setTimeout(() => setShowPopup(false), 2500);
  };

  const handleSetMin = () => {
    setAmount(minAmount.toString());
  };

  return (
    <div className="bg-[#0B1622] rounded-xl p-5 w-full max-w-md text-white border border-white/10">
      {/* 💰 Currency Section */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Currency</p>
        <div className="bg-[#12263A] rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={selectedCoin.icon} // ✅ using correct property
              width={28}
              height={28}
              alt={selectedCoin.symbol}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold text-sm">{selectedCoin.symbol}</p>
              <p className="text-xs text-gray-400">{selectedCoin.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm">
              {balance.toFixed(8)} {selectedCoin.symbol}
            </p>
            <p className="text-xs text-gray-400">
              ₹{((selectedCoin.inrValue || 90) * balance).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* 💵 Amount Input */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 mb-1 block">
          Amount <span className="text-red-400">*</span>
        </label>
        <div className="relative flex items-center">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-[#12263A] p-3 rounded-l-lg text-white outline-none placeholder:text-gray-500"
          />
          <button
            type="button"
            onClick={handleSetMin}
            className="relative bg-[#1E3A55] text-xs px-4 py-3 rounded-r-lg hover:bg-[#274a6a] transition-all text-gray-200"
          >
            Min
          </button>
        </div>
      </div>

      {/* 👤 Recipient Input */}
      <div className="mb-5">
        <label className="text-xs text-gray-400 mb-1 block">
          Recipient <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter recipient username or address"
          className="w-full bg-[#12263A] p-3 rounded-lg text-white outline-none placeholder:text-gray-500"
        />
      </div>

      {error && (
        <p className="text-red-400 text-xs mb-3 text-center">{error}</p>
      )}

      {/* 🪙 Tip Button */}
      <button
        onClick={handleTip}
        className="w-full bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg font-semibold text-sm transition-all duration-200"
      >
        Tip {selectedCoin.symbol}
      </button>

      {/* ✅ Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#142A3E] px-6 py-5 rounded-2xl shadow-lg flex flex-col items-center text-center max-w-xs"
            >
              <CheckCircle2 className="text-green-400 w-12 h-12 mb-2" />
              <h3 className="text-white font-semibold text-lg">
                Tip Sent Successfully
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                You tipped {amount} {selectedCoin.symbol}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletTip;
