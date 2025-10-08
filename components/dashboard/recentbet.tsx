'use client';
import React from 'react';

const recentBets = [
  { game: "Crash", user: "Hidden", time: "3:36 PM", amount: "$1,000.10", multiplier: "1.01x", payout: "$1,010.10", win: true },
  { game: "Turkish VIP Blackjack 5", user: "Hidden", time: "3:36 PM", amount: "$210,940.81", multiplier: "2.06x", payout: "$433,600.56", win: true },
  { game: "Salon Privé Blackjack J", user: "Hidden", time: "3:36 PM", amount: "$3,999.60", multiplier: "2.00x", payout: "$7,999.20", win: true },
  { game: "Angel vs Sinner Etern...", user: "Hidden", time: "3:36 PM", amount: "$50.00", multiplier: "80.00x", payout: "$4,000.00", win: true },
  { game: "Sugar Rush 1000", user: "Hidden", time: "3:36 PM", amount: "$3,000.00", multiplier: "0.09x", payout: "-$2,736.60", win: false }
];

export const RecentBets: React.FC = () => (
  <section>
    <h2 className="text-xl sm:text-2xl font-bold text-white mt-4 mb-4">🎲 Recent Bets</h2>
    <div className="overflow-hidden relative bg-slate-800 rounded-xl p-2 sm:p-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {recentBets.map((bet, index) => (
          <div key={index} className="flex-shrink-0 px-4 sm:px-6 py-2 text-white border-r border-slate-700 last:border-r-0">
            <span className="font-bold">{bet.game}</span> {bet.amount} →{' '}
            <span className={bet.win ? 'text-green-400' : 'text-red-400'}>{bet.payout}</span>
          </div>
        ))}
      </div>
    </div>

    <style jsx>{`
      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      .animate-marquee {
        display: inline-flex;
        animation: marquee 25s linear infinite;
      }
    `}</style>
  </section>
);
