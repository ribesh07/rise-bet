"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface WalletDepositProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  onBack: () => void;
  onSuccess: () => void;
}

const WalletDeposit: React.FC<WalletDepositProps> = ({
  balance,
  setBalance,
  onBack,
  onSuccess,
}) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleDeposit = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return setError("Enter valid amount");
    setError("");
    setBalance((prev) => prev + val);
    onSuccess();
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2500);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Deposit</h2>
        <button onClick={onBack} className="text-gray-400 hover:text-white text-sm">
          Back
        </button>
      </div>

      <div className="bg-[#13283D] rounded-xl p-4 flex justify-between items-center mb-5">
        <div>
          <p className="font-semibold">Balance</p>
          <p className="text-xs text-gray-400">Current: {balance.toFixed(2)}</p>
        </div>
      </div>

      <input
        type="number"
        className="bg-[#13283D] w-full rounded-lg p-3 text-white outline-none"
        placeholder="Enter deposit amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

      <button
        onClick={handleDeposit}
        className="w-full mt-5 bg-[#00C74D] hover:bg-[#03e15b] py-3 rounded-lg text-sm font-semibold transition"
      >
        Deposit
      </button>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#142A3E] px-6 py-5 rounded-2xl shadow-lg text-center"
            >
              <CheckCircle2 className="text-green-400 w-12 h-12 mb-2 mx-auto" />
              <h3 className="text-white font-semibold text-lg">Deposit Successful</h3>
              <p className="text-gray-400 text-sm mt-1">
                +{amount} added to your wallet.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletDeposit;
