// 'use client';
// import React, { useEffect, useState } from 'react';
// import { BarChart3 } from 'lucide-react';

// type CasinoBet = {
//   id: string;
//   game: string;
//   date: string;
//   amount: number;
//   multiplier: number;
//   payout: number;
// };

// const Casino = () => {
//   const [bets, setBets] = useState<CasinoBet[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate data fetching
//     setTimeout(() => {
//       // setBets([]); // Uncomment to show empty state
//       setBets([
//         {
//           id: 'C1001',
//           game: 'Roulette',
//           date: '2025-11-07',
//           amount: 50,
//           multiplier: 2.5,
//           payout: 125,
//         },
//       ]);
//       setLoading(false);
//     }, 800);
//   }, []);

//   if (loading) {
//     return <p className="text-gray-400 text-center py-10">Loading bets...</p>;
//   }

//   if (bets.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center text-center py-20 text-gray-400">
//         <BarChart3 className="w-10 h-10 mb-3 text-green-400" />
//         <p className="text-sm mb-2">No Casino Bets</p>
//         <button className="text-[#2b8eff] font-semibold hover:underline">
//           Start Playing Now!
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="grid grid-cols-6 text-sm font-semibold text-gray-300 border-b border-[#243447] pb-3 mb-5">
//         <div>Game</div>
//         <div>Bet ID</div>
//         <div>Date</div>
//         <div>Bet Amount</div>
//         <div>Multiplier</div>
//         <div>Payout</div>
//       </div>

//       {bets.map((bet) => (
//         <div
//           key={bet.id}
//           className="grid grid-cols-6 text-sm text-gray-200 py-2 border-b border-[#1f2d3a]"
//         >
//           <div>{bet.game}</div>
//           <div>{bet.id}</div>
//           <div>{bet.date}</div>
//           <div>${bet.amount}</div>
//           <div>{bet.multiplier}x</div>
//           <div>${bet.payout}</div>
//         </div>
//       ))}
//     </>
//   );
// };

// export default Casino;
"use client";

import React, { useState } from "react";
import Image from "next/image";
import emptyIcon from "@/public/images/empty-bets.png"; // replace your icon here

interface Bet {
  id: number;
  match: string;
  amount: number;
  odds: number;
  status: "Active" | "Settled";
  result?: "Won" | "Lost"; // only for settled
}

const SportsBets: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Active" | "Settled">("Active");

  // ✅ Example Bets
  const bets: Bet[] = [
    // Remove these to test empty screen
    // {
    //   id: 1,
    //   match: "Team A vs Team B",
    //   amount: 50,
    //   odds: 2.3,
    //   status: "Active",
    // },
    // {
    //   id: 2,
    //   match: "Team C vs Team D",
    //   amount: 75,
    //   odds: 1.8,
    //   status: "Settled",
    //   result: "Won",
    // },
  ];

  const filteredBets = bets.filter((b) => b.status === activeTab);

  return (
    <div className="w-full bg-[#0c1b29] rounded-xl p-6 text-white min-h-[350px] flex flex-col">

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-6">
        {["Active", "Settled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "Active" | "Settled")}
            className={`px-6 py-2 rounded-full transition ${
              activeTab === tab
                ? "bg-[#102A44] border border-[#3BA55D]"
                : "bg-transparent border border-transparent opacity-70"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ✅ If No Bets → Show Empty Screen */}
      {filteredBets.length === 0 ? (
        <div className="flex flex-col flex-1 items-center justify-center gap-3 py-10">
          <Image src={emptyIcon} alt="No Bets" width={80} height={80} />
          <p className="text-gray-300 text-sm">No {activeTab} Bets</p>
          <p className="text-[#3BA55D] font-semibold text-sm cursor-pointer hover:underline">
            Start Betting Now!
          </p>

          <div className="flex items-center gap-4 mt-10">
            <button className="bg-[#102A44] px-6 py-2 rounded-lg text-sm opacity-50 cursor-not-allowed">
              Previous
            </button>
            <button className="bg-[#102A44] px-6 py-2 rounded-lg text-sm opacity-50 cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ✅ Bets Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-300 border-b border-white/10">
                  <th className="py-2 text-left">Match</th>
                  <th className="py-2 text-left">Amount</th>
                  <th className="py-2 text-left">Odds</th>
                  {activeTab === "Settled" && <th className="py-2 text-left">Result</th>}
                </tr>
              </thead>
              <tbody>
                {filteredBets.map((bet) => (
                  <tr key={bet.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3">{bet.match}</td>
                    <td className="py-3">${bet.amount}</td>
                    <td className="py-3">{bet.odds}</td>
                    {activeTab === "Settled" && (
                      <td
                        className={`py-3 font-semibold ${
                          bet.result === "Won" ? "text-[#3BA55D]" : "text-red-400"
                        }`}
                      >
                        {bet.result}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination (static for now) */}
          <div className="flex justify-center gap-4 mt-6">
            <button className="bg-[#102A44] px-6 py-2 rounded-lg text-sm opacity-70">
              Previous
            </button>
            <button className="bg-[#102A44] px-6 py-2 rounded-lg text-sm opacity-70">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SportsBets;
