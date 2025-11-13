
"use client";
import React from "react";
import { motion } from "framer-motion";

interface Props {
  hideZero: boolean;
  setHideZero: (v: boolean) => void;
  displayFiat: boolean;
  setDisplayFiat: (v: boolean) => void;
  selectedCurrency: string;
  setSelectedCurrency: (v: string) => void;
}

const WalletSetting: React.FC<Props> = ({
  hideZero,
  setHideZero,
  displayFiat,
  setDisplayFiat,
  selectedCurrency,
  setSelectedCurrency,
}) => {
  const currencies = ["INR", "USD"];

  return (
    <div className="space-y-5">
      {/* Hide zero balances */}
      <SettingRow
        title="Hide Zero Balances"
        subtitle="Your zero balances won't appear in your wallet"
        checked={hideZero}
        onChange={setHideZero}
      />

      {/* Display in Fiat */}
      <SettingRow
        title="Display Crypto in Fiat"
        subtitle="Show equivalent fiat value next to crypto"
        checked={displayFiat}
        onChange={setDisplayFiat}
      />

      {/* Currency selector */}
      <div>
        <p className="text-sm font-semibold mb-2">Fiat Currency</p>
        <div className="grid grid-cols-2 gap-3">
          {currencies.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCurrency(c)}
              className={`p-3 rounded-lg font-medium transition ${
                selectedCurrency === c
                  ? "bg-[#1C2F45]"
                  : "bg-[#13283D] hover:bg-[#1C2F45]/60"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* 🔘 Reusable toggle row */
const SettingRow = ({
  title,
  subtitle,
  checked,
  onChange,
}: {
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-start justify-between py-3 border-b border-[#1B2A3A]">
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
    <AnimatedSwitch checked={checked} onChange={onChange} />
  </div>
);

const AnimatedSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 flex items-center rounded-full transition-colors duration-300 ease-in-out
      ${checked ? "bg-[#00C74D] shadow-[0_0_6px_#00C74D]" : "bg-[#2A3A4D]"}`}
  >
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`w-5 h-5 rounded-full bg-white shadow-md absolute left-0.5 top-0.5 ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

export default WalletSetting;
