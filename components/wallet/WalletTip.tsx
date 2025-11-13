"use client";
import React, { useState } from "react";

interface WalletTipProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

const WalletTip: React.FC<WalletTipProps> = ({ balance, setBalance }) => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");

  const MIN_TIP = 1;

  const handleTip = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return setError("Enter valid amount");
    if (val < MIN_TIP) return setError(`Minimum tip is ₹${MIN_TIP}`);
    if (val > balance) return setError("Insufficient balance");
    if (!recipient) return setError("Enter Username / ID");

    setBalance((prev) => prev - val);
    setAmount("");
    setRecipient("");
  };

  return (
    <div>
      <label className="text-gray-400 text-sm">Amount*</label>
      <input
        type="number"
        className="bg-[#13283D] w-full rounded-lg p-3 mt-1 text-white outline-none"
        placeholder="Enter tip amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <label className="text-gray-400 text-sm mt-4 block">Recipient*</label>
      <input
        type="text"
        className="bg-[#13283D] w-full rounded-lg p-3 mt-1 text-white outline-none"
        placeholder="Enter Username / ID"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

      <button
        onClick={handleTip}
        className="w-full bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg text-sm font-semibold transition mt-5"
      >
        Tip
      </button>
    </div>
  );
};

export default WalletTip;
