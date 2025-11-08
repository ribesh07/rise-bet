
"use client";
import { X, BarChart3 } from "lucide-react";
import React, { useState } from "react";

interface ArchivedBet {
  id: number;
  date: string;
  count: number;
  game: string;
  wagered: string;
  profit: string;
  result: "Win" | "Lose" | "Pending";
}

const Archive: React.FC = () => {
  const [selectedBet, setSelectedBet] = useState<ArchivedBet | null>(null);

  // 🧩 Dynamic Data (replace or fetch from API)
  const archivedBets: ArchivedBet[] = [
    {
      id: 1,
      date: "2025-11-06",
      count: 5,
      game: "Crash",
      wagered: "$120.00",
      profit: "$45.00",
      result: "Win",
    },
    {
      id: 2,
      date: "2025-11-05",
      count: 2,
      game: "Roulette",
      wagered: "$60.00",
      profit: "-$20.00",
      result: "Lose",
    },
  ];

  return (
    <div className="relative bg-[#0f1d2b] text-gray-300 rounded-lg p-6 shadow-md border border-slate-700">
      {/* ✅ Scrollable Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[650px]">
          {/* Header */}
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] text-sm font-semibold text-gray-400 border-b border-slate-700 pb-3 mb-4">
            <div>Date</div>
            <div>Count</div>
            <div className="text-center">Action</div>
            <div className="text-right">Result</div>
          </div>

          {/* ✅ Content / Empty State */}
          {archivedBets.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="relative">
                <BarChart3 className="w-16 h-16 text-gray-500 opacity-30" />
                <span className="absolute top-[22%] left-[34%] w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e] animate-pulse" />
              </div>
              <p className="text-gray-400 mt-4 font-medium">No Bet Archives</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {archivedBets.map((bet) => (
                <div
                  key={bet.id}
                  className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center py-3 text-sm hover:bg-[#1e293b] transition-colors rounded-lg px-2"
                >
                  <div>{bet.date}</div>

                  <div>{bet.count}</div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => setSelectedBet(bet)}
                      className="px-3 py-1 text-sm font-semibold text-blue-400 border border-blue-500/30 
                        rounded-full bg-blue-500/10 hover:bg-blue-500/20 hover:shadow-[0_0_10px_#3b82f6aa] 
                        transition"
                    >
                      View
                    </button>
                  </div>

                  <div
                    className={`text-right font-semibold ${
                      bet.result === "Win"
                        ? "text-green-400"
                        : bet.result === "Lose"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {bet.result}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Modal */}
      {selectedBet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-[#1e293b] p-6 rounded-xl w-[90%] max-w-md shadow-lg border border-slate-700 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setSelectedBet(null)}
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-white">
              Bet Details
            </h3>

            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="text-gray-400">Date:</span> {selectedBet.date}
              </p>
              <p>
                <span className="text-gray-400">Game:</span> {selectedBet.game}
              </p>
              <p>
                <span className="text-gray-400">Bets Count:</span> {selectedBet.count}
              </p>
              <p>
                <span className="text-gray-400">Wagered:</span> {selectedBet.wagered}
              </p>
              <p>
                <span className="text-gray-400">Profit/Loss:</span>{" "}
                <span
                  className={`font-semibold ${
                    selectedBet.result === "Win"
                      ? "text-green-400"
                      : selectedBet.result === "Lose"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {selectedBet.profit}
                </span>
              </p>
              <p>
                <span className="text-gray-400">Result:</span>{" "}
                <span
                  className={`font-semibold ${
                    selectedBet.result === "Win"
                      ? "text-green-400"
                      : selectedBet.result === "Lose"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {selectedBet.result}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Archive;
