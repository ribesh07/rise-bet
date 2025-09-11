"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/ApiHelper";
import toast from "react-hot-toast";
import { ArrowDownCircle, ArrowUpCircle, History } from "lucide-react";

export default function WalletPage() {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view wallet");
        return;
      }
      try {
        const res = await apiRequest("/auth/me", true, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.success && res.data) {
          setBalance(Number(res.data.balance) || 0);
        } else {
          toast.error(res.message || "Failed to fetch balance");
        }
      } catch (error) {
        console.error("Wallet fetch error:", error);
        toast.error("Error fetching wallet info");
      }
    };

    fetchBalance();
  }, []);

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white flex justify-center items-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-900 rounded-2xl shadow-xl p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-6">My Wallet</h1>

        {/* Balance */}
        <div className="bg-gray-800 rounded-xl p-6 text-center mb-8">
          <h2 className="text-gray-400 text-sm">Total Balance</h2>
          <p className="text-4xl font-bold text-green-400">
            ${balance.toFixed(2)}
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-3 rounded-xl font-semibold transition">
            <ArrowDownCircle size={20} /> <span>Deposit</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl font-semibold transition">
            <ArrowUpCircle size={20} /> <span>Withdraw</span>
          </button>
        </div>

        {/* History */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-xl font-semibold transition">
            <History size={20} /> <span>Deposit History</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-xl font-semibold transition">
            <History size={20} /> <span>Withdraw History</span>
          </button>
        </div>
      </div>
    </main>
  );
}
