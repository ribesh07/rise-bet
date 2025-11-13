"use client";
import React from "react";
import { Card } from "@/components/ui/vipcard";

interface WalletOverviewProps {
  balance: number;
  onWithdraw: () => void;
}

const WalletOverview: React.FC<WalletOverviewProps> = ({
  balance,
  onWithdraw,
}) => {
  return (
    <>
      <div className="mb-4">
        <p className="text-sm text-gray-400">Balance</p>
        <p className="text-2xl font-semibold mt-1">₹{balance.toFixed(2)}</p>
      </div>

      <Card className="bg-[#13283D] border-none rounded-2xl shadow-inner p-4">
        <div className="flex justify-between mb-2 text-gray-400 text-sm">
          <p>Currency</p>
          <p>Value</p>
        </div>

        <div className="flex justify-between items-center border-t border-[#1C2F45]/60 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1C2F45] flex items-center justify-center rounded-full text-lg">
              ₹
            </div>
            <div>
              <p className="font-medium">INR</p>
              <p className="text-xs text-gray-400">Indian Rupee</p>
            </div>
          </div>
          <p className="font-semibold text-gray-200">₹{balance.toFixed(2)}</p>
        </div>
      </Card>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onWithdraw}
          className="flex-1 bg-[#1C2F45] hover:bg-[#264A7A] py-3 rounded-lg text-sm font-semibold transition"
        >
          Withdraw
        </button>
        <button className="flex-1 bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg text-sm font-semibold transition">
          Deposit
        </button>
      </div>
    </>
  );
};

export default WalletOverview;
