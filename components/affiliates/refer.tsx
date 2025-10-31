"use client";
import React from "react";
import { ChevronDown, Info, BarChart2, ArrowUpDown } from "lucide-react";

const ReferredUsers: React.FC = () => {
  return (
    <div className="bg-[#0d1b2a] text-white p-6 rounded-lg w-full max-w-3xl mx-auto">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-2">Referred Users</h2>
      <p className="text-gray-400 text-sm mb-4">
        Track all the users who joined through your referral link. Here you can
        see their activity and gameplay - making it easy to monitor the growth
        of your network and the benefits you’re gaining from referrals.
      </p>

      {/* Dropdown */}
      <div className="relative inline-block mb-4">
        <button className="bg-[#1b263b] border border-gray-700 text-white px-4 py-2 rounded flex items-center gap-2">
          shark491 (yFnQzATc)
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-[#1b263b] border border-gray-700 rounded-md p-4 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-xs mb-1 flex items-center justify-center gap-1">
              First Time Deposits (FTD)
              <Info className="w-3 h-3" />
            </p>
            <p className="text-lg font-bold">0</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1 flex items-center justify-center gap-1">
              Monthly FTD
              <Info className="w-3 h-3" />
            </p>
            <p className="text-lg font-bold">0</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1 flex items-center justify-center gap-1">
              Total Deposits
              <Info className="w-3 h-3" />
            </p>
            <p className="text-lg font-bold">0</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1 flex items-center justify-center gap-1">
              VIP Users
              <Info className="w-3 h-3" />
            </p>
            <p className="text-lg font-bold">0</p>
          </div>
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 mb-8">
        <ArrowUpDown className="w-4 h-4 text-gray-400" />
        <button className="bg-[#1b263b] border border-gray-700 px-4 py-2 rounded flex items-center gap-2">
          Sort: <span className="font-medium">Total Deposits: High to Low</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center text-gray-400 py-10">
        <BarChart2 className="w-10 h-10 mb-3 text-green-400" />
        <p>No Referred Users.</p>
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button className="bg-[#1b263b] border border-gray-700 px-4 py-2 rounded text-gray-400">
          Previous
        </button>
        <button className="bg-[#1b263b] border border-gray-700 px-4 py-2 rounded text-gray-400">
          Next
        </button>
      </div>
    </div>
  );
};

export default ReferredUsers;
