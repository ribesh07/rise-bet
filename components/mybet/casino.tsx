'use client';
import React, { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';

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

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      // setBets([]); // Uncomment to show empty state
      setBets([
        {
          id: 'C1001',
          game: 'Roulette',
          date: '2025-11-07',
          amount: 50,
          multiplier: 2.5,
          payout: 125,
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-center py-10">Loading bets...</p>;
  }

  if (bets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 text-gray-400">
        <BarChart3 className="w-10 h-10 mb-3 text-green-400" />
        <p className="text-sm mb-2">No Casino Bets</p>
        <button className="text-[#2b8eff] font-semibold hover:underline">
          Start Playing Now!
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-6 text-sm font-semibold text-gray-300 border-b border-[#243447] pb-3 mb-5">
        <div>Game</div>
        <div>Bet ID</div>
        <div>Date</div>
        <div>Bet Amount</div>
        <div>Multiplier</div>
        <div>Payout</div>
      </div>

      {bets.map((bet) => (
        <div
          key={bet.id}
          className="grid grid-cols-6 text-sm text-gray-200 py-2 border-b border-[#1f2d3a]"
        >
          <div>{bet.game}</div>
          <div>{bet.id}</div>
          <div>{bet.date}</div>
          <div>${bet.amount}</div>
          <div>{bet.multiplier}x</div>
          <div>${bet.payout}</div>
        </div>
      ))}
    </>
  );
};

export default Casino;
