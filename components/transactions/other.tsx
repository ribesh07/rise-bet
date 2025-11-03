'use client';
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, ChevronDown, ChevronUp } from "lucide-react";

interface Other {
  id: string;
  date: string;
  type: string;
  amount: number;
  category:
    | "All Others"
    | "Tips Received"
    | "Campaign Withdrawal"
    | "Rain Received"
    | "Rain Sent"
    | "Swap Deposit"
    | "Swap Withdrawal";
}

const OtherHistory: React.FC = () => {
  const tabs: Other["category"][] = [
    "All Others",
    "Tips Received",
    "Campaign Withdrawal",
    "Rain Received",
    "Rain Sent",
    "Swap Deposit",
    "Swap Withdrawal",
  ];

  const [activeTab, setActiveTab] = useState<Other["category"]>("All Others");
  const [expanded, setExpanded] = useState<string | null>(null);

  const otherData: Other[] = [
    { id: "1", date: "2025-10-10", type: "Tip", amount: 5, category: "Tips Received" },
    { id: "2", date: "2025-10-12", type: "Campaign Withdrawal", amount: 200, category: "Campaign Withdrawal" },
    { id: "3", date: "2025-10-15", type: "Rain Received", amount: 2, category: "Rain Received" },
    { id: "4", date: "2025-10-18", type: "Swap Deposit", amount: 50, category: "Swap Deposit" },
  ];

  const filteredOthers =
    activeTab === "All Others"
      ? otherData
      : otherData.filter((item) => item.category === activeTab);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative bg-[#0F1B2E] text-gray-200 p-4 rounded-xl shadow-lg w-full overflow-hidden transition-all duration-300 flex flex-col h-full">
      {/* ✅ Scrollable Tabs */}
      <div className="overflow-x-auto flex gap-2 pb-2 stake-scrollbar">
        <div className="flex space-x-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-300 ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-[#1E2A44] text-gray-300 hover:bg-blue-500/20 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Main Card Container */}
      <Card className="flex-1 mt-4 bg-[#0F1B2E] border border-gray-700 flex flex-col overflow-hidden">
        <CardContent className="p-0 flex-1 flex flex-col">
          {/* ✅ Desktop Table Header */}
          <div className="hidden sm:block overflow-x-auto stake-scrollbar w-full">
            <table className="min-w-[720px] w-full table-auto border-separate border-spacing-0">
              <thead>
                <tr className="text-sm text-gray-400 font-medium border-b border-gray-700 sticky top-0 bg-[#0F1B2E] z-10">
                  <th className="px-6 py-3 text-left w-1/3">Date</th>
                  <th className="px-6 py-3 text-center w-1/3">Type</th>
                  <th className="px-6 py-3 text-right w-1/3">Amount</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* ✅ Scrollable Table Section */}
          <div className="overflow-y-auto flex-1 stake-scrollbar">
            {/* Desktop Table */}
            <table className="hidden sm:table min-w-[720px] w-full table-auto border-separate border-spacing-0">
              <tbody>
                {filteredOthers.length > 0 ? (
                  filteredOthers.map((item) => (
                    <tr
                      key={item.id}
                      className="bg-[#16263D] hover:bg-[#1e3553] transition-colors duration-200"
                    >
                      <td className="px-6 py-3 text-sm">{item.date}</td>
                      <td className="px-6 py-3 text-sm text-center">{item.type}</td>
                      <td className="px-6 py-3 text-sm text-right text-green-400">
                        +${item.amount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <BarChart3 className="h-10 w-10 text-gray-500 mb-2" />
                        <p>No entries.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* ✅ Mobile Expandable Cards (Animated) */}
            <div className="sm:hidden space-y-3 p-1">
              {filteredOthers.length > 0 ? (
                filteredOthers.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#16263D] rounded-xl p-3 transition-all duration-300 hover:bg-[#1e3553]"
                  >
                    {/* Header (Clickable) */}
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="w-full flex justify-between items-center"
                    >
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">{item.type}</p>
                        <p className="text-xs text-gray-400">{item.date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-green-400 font-semibold text-sm">
                          +${item.amount}
                        </span>
                        {expanded === item.id ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* ✅ Animated Expansion */}
                    <AnimatePresence initial={false}>
                      {expanded === item.id && (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="mt-3 border-t border-gray-700 pt-3 space-y-1 text-sm text-gray-300">
                            <div className="flex justify-between">
                              <span>Type:</span>
                              <span className="text-white">{item.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Date:</span>
                              <span className="text-white">{item.date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Category:</span>
                              <span className="text-white">{item.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Amount:</span>
                              <span className="text-green-400">+${item.amount}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 py-12">
                  <BarChart3 className="h-10 w-10 text-gray-500 mb-2" />
                  <p>No entries.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtherHistory;
