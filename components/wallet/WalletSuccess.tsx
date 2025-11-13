"use client";
import React from "react";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface WalletSuccessProps {
  type: "withdraw" | "tip";
  balance: number;
  onBack: () => void;
}

const WalletSuccess: React.FC<WalletSuccessProps> = ({ type, balance, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center text-center py-6"
    >
      <CheckCircle size={70} className="text-green-400 mb-3" />
      <h2 className="text-xl font-semibold mb-1">
        {type === "tip" ? "Tip Successful!" : "Withdrawal Successful!"}
      </h2>

      <div className="bg-[#13283D] p-4 rounded-xl w-full mt-5">
        <p className="text-sm text-gray-400">Remaining Balance</p>
        <p className="text-2xl font-bold mt-1">₹{balance.toFixed(2)}</p>
      </div>

      <button
        onClick={onBack}
        className="w-full bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg text-sm font-semibold transition mt-6"
      >
        Back to Wallet
      </button>
    </motion.div>
  );
};

export default WalletSuccess;
