"use client";

import { MyHistoryItem } from "./types";

interface Props {
  myHistory: MyHistoryItem[];
  selectedHistoryItem: MyHistoryItem | null;
  setSelectedHistoryItem: (item: MyHistoryItem | null) => void;
  getColorClass: (color: string) => string;
}

export default function MyHistory({
  myHistory,
  selectedHistoryItem,
  setSelectedHistoryItem,
  getColorClass,
}: Props) {
  if (selectedHistoryItem) {
      return (
        <div className="bg-white p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-lg ${getColorClass('green')} flex items-center justify-center`}>
              <span className="text-white text-xl font-bold">{selectedHistoryItem.result}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{selectedHistoryItem.id}</span>
                <span className="text-xs">▼</span>
              </div>
              <div className="text-xs text-gray-500">{selectedHistoryItem.time}</div>
            </div>
            <div className="text-right">
              <div className={`text-xs font-semibold px-3 py-1 rounded ${selectedHistoryItem.status === 'Succeed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {selectedHistoryItem.status}
              </div>
              <div className={`text-sm font-semibold ${selectedHistoryItem.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {selectedHistoryItem.amount > 0 ? '+' : ''}₹{Math.abs(selectedHistoryItem.amount).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-semibold text-gray-800 mb-3">Details</div>
            
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Order number</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">{selectedHistoryItem.orderNumber}</span>
                <button className="text-gray-400">📋</button>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Period</span>
              <span className="text-sm text-gray-800">{selectedHistoryItem.period}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Purchase amount</span>
              <span className="text-sm text-gray-800">₹{selectedHistoryItem.purchaseAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Quantity</span>
              <span className="text-sm text-gray-800">{selectedHistoryItem.quantity}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Amount after tax</span>
              <span className="text-sm text-orange-500">₹{selectedHistoryItem.amountAfterTax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Tax</span>
              <span className="text-sm text-orange-500">₹{selectedHistoryItem.tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Result</span>
              <span className="text-sm">
                <span className="font-bold">{selectedHistoryItem.result}</span>
                <span className="text-green-600 ml-2">{selectedHistoryItem.select}</span>
                <span className="text-gray-600 ml-2">{selectedHistoryItem.bigSmall}</span>
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Select</span>
              <span className="text-sm text-gray-600">{selectedHistoryItem.select}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Status</span>
              <span className="text-sm text-green-600 font-semibold">{selectedHistoryItem.status}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Win/lose</span>
              <span className={`text-sm font-semibold ${selectedHistoryItem.winLose > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {selectedHistoryItem.winLose > 0 ? '+' : ''}₹{Math.abs(selectedHistoryItem.winLose).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Order time</span>
              <span className="text-sm text-gray-800">{selectedHistoryItem.time}</span>
            </div>
          </div>

          <button 
            onClick={() => setSelectedHistoryItem(null)}
            className="mt-6 w-full py-3 bg-gray-100 text-gray-600 rounded-lg font-semibold"
          >
            Back to History
          </button>
        </div>
      );
    }

    return (
      <div className="px-4 py-4 space-y-3 bg-white">
        {myHistory.map((item, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
            onClick={() => setSelectedHistoryItem(item)}
          >
            <div className={`w-12 h-12 rounded-lg ${getColorClass('green')} flex items-center justify-center`}>
              <span className="text-white text-xl font-bold">{item.result}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{item.id}</span>
                <span className="text-xs">▼</span>
              </div>
              <div className="text-xs text-gray-500">{item.time}</div>
            </div>
            <div className="text-right">
              <div className={`text-xs font-semibold px-3 py-1 rounded ${item.status === 'Succeed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {item.status}
              </div>
              <div className={`text-sm font-semibold ${item.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {item.amount > 0 ? '+' : ''}₹{Math.abs(item.amount).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-center gap-4 py-4">
          <button className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600">‹</span>
          </button>
          <span className="text-sm text-gray-600">1/1</span>
          <button className="w-10 h-10 rounded bg-amber-700 flex items-center justify-center">
            <span className="text-white">›</span>
          </button>
        </div>
      </div>
    );
}
