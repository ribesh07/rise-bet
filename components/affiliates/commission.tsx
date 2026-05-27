
'use client';
import React, { useState } from "react";
import { FaSortAmountDown, FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const CommissionPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 bg-[#101b22dd] rounded-2xl p-6 space-y-6 shadow-lg shadow-black/40">
      <h1 className="text-2xl font-semibold mb-3">Commission</h1>
      <p className="text-gray-300 mb-6 text-sm sm:text-base">
        View and track the earnings you&apos;ve generated through your referrals. This section provides a clear breakdown of your commissions and payouts, keeping you in control of your earnings.
      </p>

      {/* Sort + Filter + Transfer */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mb-6">
        <div className="flex items-center bg-[#162238] px-4 py-2 rounded-lg w-full sm:w-auto">
          <FaSortAmountDown className="mr-2 text-gray-400" />
          <select
            className="bg-transparent text-sm outline-none text-gray-300 w-full sm:w-auto"
            defaultValue="Lifetime Commission: High to Low"
          >
            <option className="bg-[#162238]">Lifetime Commission: High to Low</option>
            <option className="bg-[#162238]">Lifetime Commission: Low to High</option>
          </select>
        </div>

        <button className="flex items-center justify-center gap-2 bg-[#162238] px-4 py-2 rounded-lg text-gray-300 w-full sm:w-auto">
          <FaFilter />
          <span className="sm:hidden text-sm">Filter</span>
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-medium w-full sm:w-auto"
        >
          Transfer to Balance
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full bg-[#162238] rounded-lg">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-gray-700">
              <th className="text-left py-3 px-6">Currency</th>
              <th className="text-left py-3 px-6">Available Commission</th>
              <th className="text-left py-3 px-6">Withdrawn Commission</th>
              <th className="text-left py-3 px-6">Lifetime Commission</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-700 text-sm hover:bg-[#1b2b45] transition-colors">
              <td className="py-3 px-6">USD</td>
              <td className="py-3 px-6 text-gray-300">$0.00000000</td>
              <td className="py-3 px-6 text-gray-300">$0.00000000</td>
              <td className="py-3 px-6 text-gray-300">$0.00000000</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        <div className="bg-[#162238] border border-gray-700 rounded-xl p-4 text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Currency:</span>
            <span className="text-white font-medium">USD</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Available Commission:</span>
            <span className="text-gray-200">$0.00000000</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Withdrawn Commission:</span>
            <span className="text-gray-200">$0.00000000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Lifetime Commission:</span>
            <span className="text-gray-200">$0.00000000</span>
          </div>
        </div>
      </div>

      {/* rise-Style Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Box */}
            <motion.div
              className="fixed z-50 inset-0 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="bg-[#162238] rounded-2xl p-6 sm:p-8 w-full max-w-sm shadow-2xl border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Transfer to Balance</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Enter the amount you want to transfer to your main balance.
                </p>

                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full bg-[#0d1b2a] border border-gray-700 rounded-lg px-4 py-2 mb-5 outline-none focus:border-blue-500 text-white"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg py-2 text-sm font-medium"
                  >
                    Confirm Transfer
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommissionPage;
