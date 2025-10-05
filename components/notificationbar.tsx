
"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface NotificationBarProps {
  message?: string;
  onClose?: () => void; // optional callback when closed
}

const NotificationBar: React.FC<NotificationBarProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
  };

  // Remove from DOM after transition
  useEffect(() => {
    if (closing) {
      const timeout = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 300); // match transition duration
      return () => clearTimeout(timeout);
    }
  }, [closing, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 overflow-hidden bg-[#131a26fc] border-b border-gray-700 text-gray-300 transition-all duration-300 flex items-center justify-between px-4 ${
        closing ? "h-0 py-0 opacity-0" : "h-12 py-3 opacity-100"
      }`}
    >
      <div className="text-sm font-semibold flex-1 text-center">
        {message ||
          "Withdrawal Only Mode - Verify Level 2 to activate Deposit, Buy Crypto and Tip."}
      </div>
      <button
        className="p-1 hover:text-white"
        onClick={handleClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default NotificationBar;
