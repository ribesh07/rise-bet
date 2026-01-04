"use client";

import { GameHistoryItem } from "./types";

interface Props {
  gameHistory: GameHistoryItem[];
  getColorClass: (color: string) => string;
}

export default function GameHistory({
  gameHistory,
  getColorClass,
}: Props) {
  return (
      <div className="bg-white p-3">
      <div className="grid grid-cols-4 bg-amber-700 text-white font-semibold py-3 px-4 rounded-t-lg">
        <div className="text-sm">Period</div>
        <div className="text-sm text-center">Number</div>
        <div className="text-sm text-center">Big Small</div>
        <div className="text-sm text-center">Color</div>
      </div>
      <div className="divide-y">
        {gameHistory.map((item, idx) => (
          <div key={idx} className="grid grid-cols-4 py-3 px-4 items-center">
            <div className="text-xs text-gray-700">{item.period}</div>
            <div className="text-center">
              <span className={`text-2xl font-bold ${
                item.color === 'red' ? 'text-red-500' : 
                item.color === 'green' ? 'text-green-500' : 
                'text-purple-500'
              }`}>{item.number}</span>
            </div>
            <div className="text-xs text-center text-gray-700">{item.bigSmall}</div>
            <div className="flex justify-center">
              <div className={`w-6 h-6 rounded-full ${getColorClass(item.color)}`}></div>
              {item.number === 0 || item.number === 5 ? (
                <div className={`w-6 h-6 rounded-full ${item.number === 0 ? 'bg-purple-500' : 'bg-purple-500'} -ml-3`}></div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 py-4">
        <button className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
          <span className="text-gray-600">‹</span>
        </button>
        <span className="text-sm text-gray-600">1/50</span>
        <button className="w-10 h-10 rounded bg-amber-700 flex items-center justify-center">
          <span className="text-white">›</span>
        </button>
      </div>
    </div>
  );
}
