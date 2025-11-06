
'use client';
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, ChevronDown, ChevronUp } from "lucide-react";

interface Order {
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

const OrderHistory: React.FC = () => {
  const tabs: Order["category"][] = [
    "All Others",
    "Tips Received",
    "Campaign Withdrawal",
    "Rain Received",
    "Rain Sent",
    "Swap Deposit",
    "Swap Withdrawal",
  ];

  const [activeTab, setActiveTab] = useState<Order["category"]>("All Others");
  const [expanded, setExpanded] = useState<string | null>(null);

  const orderData: Order[] = [
    { id: "1", date: "2025-10-10", type: "Tip", amount: 5, category: "Tips Received" },
    { id: "2", date: "2025-10-12", type: "Campaign Withdrawal", amount: 200, category: "Campaign Withdrawal" },
    { id: "3", date: "2025-10-15", type: "Rain Received", amount: 2, category: "Rain Received" },
    { id: "4", date: "2025-10-18", type: "Rain Sent", amount: -3, category: "Rain Sent" },
    { id: "5", date: "2025-10-20", type: "Swap Deposit", amount: 50, category: "Swap Deposit" },
    { id: "6", date: "2025-10-22", type: "Swap Withdrawal", amount: -25, category: "Swap Withdrawal" },
  ];

  const filteredOrders =
    activeTab === "All Others"
      ? orderData
      : orderData.filter((order) => order.category === activeTab);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  // ✅ Scroll fade effect for Stake-style scrollbar
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    let timeout: NodeJS.Timeout;
    const showScrollbar = () => {
      el.style.opacity = "1";
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        el.style.opacity = "0";
      }, 1000);
    };

    el.addEventListener("scroll", showScrollbar);
    return () => el.removeEventListener("scroll", showScrollbar);
  }, []);

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

      {/* ✅ Card Container */}
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

          {/* ✅ Scrollable Body */}
          <div
            ref={scrollContainerRef}
            className="overflow-y-auto flex-1 stake-scrollbar transition-opacity duration-300"
          >
            {/* Desktop Table */}
            <table className="hidden sm:table min-w-[720px] w-full table-auto border-separate border-spacing-0">
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="bg-[#16263D] hover:bg-[#1e3553] transition-colors duration-200"
                    >
                      <td className="px-6 py-3 text-sm">{order.date}</td>
                      <td className="px-6 py-3 text-sm text-center">{order.type}</td>
                      <td
                        className={`px-6 py-3 text-sm text-right ${
                          order.amount > 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {order.amount > 0 ? "+" : "-"}${Math.abs(order.amount)}
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

            {/* ✅ Mobile Expandable Card View */}
            <div className="sm:hidden space-y-3 p-1">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#16263D] rounded-xl p-3 transition-all duration-300 hover:bg-[#1e3553]"
                  >
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="w-full flex justify-between items-center"
                    >
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">{order.type}</p>
                        <p className="text-xs text-gray-400">{order.date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`${
                            order.amount > 0 ? "text-green-400" : "text-red-400"
                          } font-semibold text-sm`}
                        >
                          {order.amount > 0 ? "+" : "-"}${Math.abs(order.amount)}
                        </span>
                        {expanded === order.id ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Info */}
                    {expanded === order.id && (
                      <div className="mt-3 rounded-xl bg-[#1a1b1f] border border-[#2b2d31] p-3 text-sm text-gray-300 hover:bg-[#222429] transition-colors duration-200 w-full sm:w-auto">
                        <div className="grid grid-cols-2 gap-y-2 sm:gap-y-1 sm:gap-x-6 text-gray-400">
                          <div className="flex justify-between sm:justify-start sm:space-x-3">
                            <span>Type:</span>
                            <span className="text-white">{order.type}</span>
                          </div>
                          <div className="flex justify-between sm:justify-start sm:space-x-3">
                            <span>Date:</span>
                            <span className="text-white">{order.date}</span>
                          </div>
                          <div className="flex justify-between sm:justify-start sm:space-x-3">
                            <span>Category:</span>
                            <span className="text-white">{order.category}</span>
                          </div>
                          <div className="flex justify-between sm:justify-start sm:space-x-3">
                            <span>Amount:</span>
                            <span
                              className={`${
                                order.amount > 0 ? "text-green-400" : "text-red-400"
                              } font-medium`}
                            >
                              {order.amount > 0 ? "+" : "-"}${Math.abs(order.amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
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

export default OrderHistory;
