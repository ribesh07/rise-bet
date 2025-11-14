
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useNotifications } from "@/context/NotificationContext";

interface Props {
  balance: number;
  setBalance: (v: number) => void;
  selectedCoin: {
    name: string;
    symbol: string;
    icon: string;
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
  const [error, setError] = useState("");

  const { pushNotification } = useNotifications(); // ✅ fixed

  const minAmount = selectedCoin.minAmount || 0.01;

  const handleTip = () => {
    const val = parseFloat(amount);

    // Validation
    if (!recipient.trim()) {
      setError("Enter recipient address");
      pushNotification({
        title: "Tip Failed",
        message: "Recipient address is missing.",
        type: "error",
        category: "transactions",

        url: undefined,
        date: ""
      });
      return;
    }

    if (!val || val <= 0) {
      setError("Enter valid amount");
      pushNotification({
        title: "Tip Failed",
        message: "Invalid tip amount.",
        type: "error",
        category: "transactions",

        url: undefined,
        date: ""
      });
      return;
    }

    if (val > balance) {
      setError("Insufficient balance");
      pushNotification({
        title: "Tip Failed",
        message: "You do not have enough balance.",
        type: "error",
        category: "transactions",

        url: undefined,
        date: ""
      });
      return;
    }

    // Reset error
    setError("");

    // Update balance
    setBalance(balance - val);

    // Parent success callback
    onSuccess();

    // Success notification
    pushNotification({
      title: "Tip Sent",
      message: `You tipped ${amount} ${selectedCoin.symbol} to ${recipient}.`,
      type: "success",
      category: "transactions",
      meta: { currency: selectedCoin.symbol, amount, to: recipient },

      url: undefined,
      date: ""
    });

    // Clear input
    setAmount("");
    setRecipient("");
  };

  const handleSetMin = () => setAmount(minAmount.toString());

  return (
    <div className="bg-[#0B1622] rounded-xl p-5 w-full max-w-md text-white border border-white/10">
      {/* Currency */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Currency</p>
        <div className="bg-[#12263A] rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={selectedCoin.icon}
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

      {/* Amount Input */}
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
            className="bg-[#1E3A55] text-xs px-4 py-3 rounded-r-lg hover:bg-[#274a6a] transition-all text-gray-200"
          >
            Min
          </button>
        </div>
      </div>

      {/* Recipient */}
      <div className="mb-5">
        <label className="text-xs text-gray-400 mb-1 block">
          Recipient <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter username or address"
          className="w-full bg-[#12263A] p-3 rounded-lg text-white outline-none placeholder:text-gray-500"
        />
      </div>

      {/* Error message */}
      {error && <p className="text-red-400 text-xs mb-3 text-center">{error}</p>}

      {/* Tip Button */}
      <button
        onClick={handleTip}
        className="w-full bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg font-semibold text-sm transition-all duration-200"
      >
        Tip {selectedCoin.symbol}
      </button>
    </div>
  );
};

export default WalletTip;
