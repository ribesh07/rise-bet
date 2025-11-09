
'use client';
import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, ChevronDown, ChevronUp } from "lucide-react";

interface Order {
  id: string;
  date: string;
  type: string;
  amount: number;
  remark?: string;
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
    { id: "1", date: "2025-10-10", type: "Tip", amount: 5, category: "Tips Received", remark: "From User123" },
    { id: "2", date: "2025-10-12", type: "Campaign Withdrawal", amount: 200, category: "Campaign Withdrawal", remark: "User456" },
    { id: "3", date: "2025-10-15", type: "Rain Received", amount: 2, category: "Rain Received", remark: "User789" },
    // { id: "4", date: "2025-10-18", type: "Rain Sent", amount: -3, category: "Rain Sent", remark: "User101" },
    { id: "5", date: "2025-10-20", type: "Swap Deposit", amount: 50, category: "Swap Deposit", remark: "User112" },
    { id: "6", date: "2025-10-22", type: "Swap Withdrawal", amount: -25, category: "Swap Withdrawal", remark: "User131" },
  ];

  const filteredOrders =
    activeTab === "All Others"
      ? orderData
      : orderData.filter((order) => order.category === activeTab);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  // 🖱️ Drag-to-scroll (rise-style)
  const scrollRef = useRef<HTMLDivElement>(null);
  const onDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!scrollRef.current) return;
    const startX = "touches" in e ? e.touches[0].pageX : e.pageX;
    const scrollLeft = scrollRef.current.scrollLeft;

    const move = (moveEvent: any) => {
      const x = moveEvent.touches ? moveEvent.touches[0].pageX : moveEvent.pageX;
      const walk = x - startX;
      scrollRef.current!.scrollLeft = scrollLeft - walk;
    };

    const stop = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", stop);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
    document.addEventListener("touchmove", move);
    document.addEventListener("touchend", stop);
  };

  return (
    <div className="relative bg-[#0F1B2E] text-gray-200 p-4 rounded-xl shadow-lg w-full overflow-hidden transition-all duration-300 flex flex-col h-full">
      
      {/* ✅ rise-style Tabs */}
      <div
        ref={scrollRef}
        onMouseDown={onDrag}
        onTouchStart={onDrag}
        className="overflow-x-auto scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing mb-5 bg-[#13283D] rounded-2xl"
      >
        <div className="flex bg-[#13283D] rounded-2xl text-sm font-medium min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 w-[14%] px-3 py-3 transition text-center ${
                activeTab === tab
                  ? "bg-[#1C2F45] text-white"
                  : "text-gray-400 hover:bg-[#1C2F45]/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Card Container */}
      <Card className="flex-1 bg-[#0F1B2E] border border-gray-700 flex flex-col overflow-hidden">
        <CardContent className="p-0 flex-1 flex flex-col">
          
          {/* ✅ Desktop Table Header */}
          

          {/* ✅ Scrollable Body */}
          <div className="overflow-y-auto flex-1 rise-scrollbar">
           {/* ✅ Combined Table for Desktop */}
<div className="hidden sm:block overflow-y-auto flex-1 rise-scrollbar">
  <table className="min-w-[720px] w-full table-auto border-separate border-spacing-0">
    <thead className="sticky top-0 bg-[#0F1B2E] z-10">
      <tr className="text-sm text-gray-400 font-medium border-b border-gray-700">
        <th className="px-6 py-3 text-left w-1/3">Date</th>
        <th className="px-6 py-3 text-center w-1/3">Type</th>
        <th className="px-6 py-3 text-right w-1/3">Amount</th>
      </tr>
    </thead>
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
</div>


            {/* ✅ Mobile Expandable Cards */}
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

                    {expanded === order.id && (
                      <div className="mt-3 border-t border-gray-700 pt-3 space-y-1 text-sm text-gray-300">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="text-white">{order.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span className="text-white">{order.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Category:</span>
                          <span className="text-white">{order.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span
                            className={`${
                              order.amount > 0 ? "text-green-400" : "text-red-400"
                            } font-medium`}
                          >
                            {order.amount > 0 ? "+" : "-"}${Math.abs(order.amount)}
                          </span>
                        </div>
                        {order.remark && (<div className="flex justify-between">
                          <span>Remark:</span>
                          <span className="text-white">{order.remark}</span>
                      </div>
                      
                      )}
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
