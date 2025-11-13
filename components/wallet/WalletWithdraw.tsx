"use client";
import React, { useState } from "react";

interface WalletWithdrawProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  onBack: () => void;
  onSuccess: () => void;
}

const WalletWithdraw: React.FC<WalletWithdrawProps> = ({
  balance,
  setBalance,
  onBack,
  onSuccess,
}) => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const MIN_WITHDRAW = 100;
  const FEE = 5;

  const handleWithdraw = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return setError("Enter valid amount");
    if (val < MIN_WITHDRAW)
      return setError(`Minimum withdrawal is ₹${MIN_WITHDRAW}`);
    if (val + FEE > balance)
      return setError("Insufficient balance (including fee)");
    if (!address) return setError("Enter a valid address / UPI ID");

    setBalance((prev) => prev - (val + FEE));
    onSuccess();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Withdraw</h2>
        <button onClick={onBack} className="text-gray-400 hover:text-white text-sm">
          Back
        </button>
      </div>

      <div className="bg-[#13283D] rounded-xl p-4 flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <span className="bg-[#1C2F45] rounded-full w-7 h-7 flex items-center justify-center">
            ₹
          </span>
          <div>
            <p className="font-semibold">INR</p>
            <p className="text-xs text-gray-400">Balance: ₹{balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <label className="text-gray-400 text-sm">Amount*</label>
      <input
        type="number"
        className="bg-[#13283D] w-full rounded-lg p-3 mt-1 text-white outline-none"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <label className="text-gray-400 text-sm mt-4 block">Address / UPI ID*</label>
      <input
        type="text"
        className="bg-[#13283D] w-full rounded-lg p-3 mt-1 text-white outline-none"
        placeholder="Enter your address / UPI ID"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

      <div className="bg-[#13283D] p-4 rounded-xl mt-5 text-sm text-gray-400 space-y-2">
        <p>
          Minimum Withdraw: <span className="text-white font-medium">₹{MIN_WITHDRAW}</span>
        </p>
        <p>
          Transaction Fee: <span className="text-white font-medium">₹{FEE}</span>
        </p>
      </div>

      <button
        onClick={handleWithdraw}
        className="w-full bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg text-sm font-semibold transition mt-5"
      >
        Withdraw
      </button>
    </div>
  );
};

export default WalletWithdraw;
