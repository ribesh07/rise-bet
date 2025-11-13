
"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft } from "lucide-react";

interface WalletSuccessProps {
  type: "withdraw" | "deposit" | "tip";
  onBack: () => void;
  balance: number;
}

const WalletSuccess: React.FC<WalletSuccessProps> = ({ type, onBack, balance }) => {
  const messages = {
    withdraw: {
      title: "Withdrawal Successful!",
      desc: "Your withdrawal has been processed successfully.",
      color: "#3175FF",
    },
    deposit: {
      title: "Deposit Successful!",
      desc: "Your deposit has been added to your wallet.",
      color: "#00C74D",
    },
    tip: {
      title: "Tip Sent!",
      desc: "Your tip has been successfully sent.",
      color: "#FFD700",
    },
  };

  const { title, desc, color } = messages[type];

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-3"
      >
        <CheckCircle2 size={70} style={{ color }} />
      </motion.div>

      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <p className="text-gray-400 text-sm mb-5">{desc}</p>

      <div className="bg-[#13283D] p-4 rounded-xl w-full text-left mb-6">
        <p className="text-sm text-gray-400 mb-1">Current Balance</p>
        <p className="text-lg font-semibold">{balance.toFixed(4)}</p>
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-2 bg-[#1C2F45] hover:bg-[#243B56] py-3 px-5 rounded-lg text-sm font-semibold transition"
      >
        <ArrowLeft size={16} />
        Back to Wallet
      </button>
    </motion.div>
  );
};

export default WalletSuccess;
