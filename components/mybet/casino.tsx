
"use client";
import { BarChart3, Link, X } from "lucide-react";
import React, { useEffect, useState } from "react";

type CasinoBet = {
  id: string;
  game: string;
  date: string;
  amount: number;
  multiplier: number;
  payout: number;
};

const Casino = () => {
  const [bets, setBets] = useState<CasinoBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBet, setSelectedBet] = useState<CasinoBet | null>(null);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      // setBets([]); // Uncomment to show empty state
      setBets([
        {
          id: "C1001",
          game: "Roulette",
          date: "2025-11-07",
          amount: 50,
          multiplier: 2.5,
          payout: 125,
        },
        {
          id: "C1002",
          game: "Crash",
          date: "2025-11-06",
          amount: 100,
          multiplier: 1.8,
          payout: 180,
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-center py-10">Loading bets...</p>;
  }

  return (
    <div className="relative bg-[#0f1d2b] text-gray-300 rounded-lg p-6 shadow-md border border-slate-700">
      <div className="overflow-x-auto">
        <div className="min-w-[750px]">
          {/* ✅ Table Header */}
          <div className="grid grid-cols-[1.3fr_1.2fr_1.2fr_1fr_1fr_1fr] text-sm font-semibold text-gray-400 border-b border-slate-700 pb-3 mb-4">
            <div>Game</div>
            <div>Bet ID</div>
            <div>Date</div>
            <div className="text-center">Amount</div>
            <div className="text-center">Multiplier</div>
            <div className="text-right">Payout</div>
          </div>

          {/* ✅ Empty State */}
          {bets.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="relative">
                <BarChart3 className="w-16 h-16 text-gray-500 opacity-30" />
                <span className="absolute top-[22%] left-[34%] w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e] animate-pulse" />
              </div>
              <p className="text-gray-400 mt-4 font-medium">No Casino Bets</p>
              <Link
  href="/home"
  className="text-[#3BA55D] font-semibold mt-2 hover:underline"
>
  Start Playing Now!
</Link>

            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {bets.map((bet) => (
                <div
                  key={bet.id}
                  className="grid grid-cols-[1.3fr_1.2fr_1.2fr_1fr_1fr_1fr] items-center py-3 text-sm hover:bg-[#1e293b] transition-colors rounded-lg px-2"
                >
                  <div>{bet.game}</div>
                  <div>{bet.id}</div>
                  <div>{bet.date}</div>
                  <div className="text-center">${bet.amount}</div>
                  <div className="text-center">{bet.multiplier}x</div>
                  <div className="text-right font-semibold text-green-400">
                    ${bet.payout}
                  </div>

                  {/* View Button (Optional): could be inside last column */}
                  <div className="hidden">
                    <button
                      onClick={() => setSelectedBet(bet)}
                      className="px-3 py-1 text-sm font-semibold text-blue-400 border border-blue-500/30 rounded-full bg-blue-500/10 hover:bg-blue-500/20 transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Modal for Bet Details */}
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
                <span className="text-gray-400">Game:</span> {selectedBet.game}
              </p>
              <p>
                <span className="text-gray-400">Bet ID:</span> {selectedBet.id}
              </p>
              <p>
                <span className="text-gray-400">Date:</span> {selectedBet.date}
              </p>
              <p>
                <span className="text-gray-400">Bet Amount:</span> $
                {selectedBet.amount}
              </p>
              <p>
                <span className="text-gray-400">Multiplier:</span>{" "}
                {selectedBet.multiplier}x
              </p>
              <p>
                <span className="text-gray-400">Payout:</span>{" "}
                <span className="font-semibold text-green-400">
                  ${selectedBet.payout}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Casino;
