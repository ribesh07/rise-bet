"use client";
import React, { useState } from "react";
import { X } from "lucide-react";

const NotificationBar: React.FC<{ message?: string }> = ({ message }) => {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 300); // Match transition duration
  };

  if (!visible) return null;

  return (
    <div
      className={`overflow-hidden bg-[#131a26fc] border-b border-gray-700 text-xs text-gray-300 transition-all duration-300 ${
        closing ? "h-0 py-0 opacity-0" : "h-12 py-1 opacity-100"
      } flex justify-between items-center px-4`}
    >
      <div className="flex items-center text-sm font-bold">
        {message || "Withdrawal Only Mode - Verify Level 2 to activate Deposit, Buy Crypto and Tip."}
      </div>
      <button
        className="p-1 hover:text-white"
        onClick={handleClose}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default NotificationBar;
