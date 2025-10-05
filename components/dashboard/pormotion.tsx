'use client';
import React from 'react';

const promotions = [
  { type: "Promotion", title: "Frankie's St Leger Raffle", description: "Share in $40,000", image: "🎟️" },
  { type: "Announcement", title: "Chicken", description: "New Stake Original!", image: "🐔" },
  { type: "Promotion", title: "EuroBasket", description: "Overtime Insurance", image: "🏀" }
];

export const Promotions: React.FC = () => (
  <section>
    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">🎁 Promotions</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {promotions.map((promo, index) => (
        <div key={index} className="bg-slate-800 rounded-xl p-4 sm:p-6 hover:bg-slate-700 transform hover:scale-105 hover:shadow-lg transition-all duration-300">
          <div className="text-3xl mb-3 animate-bounce">{promo.image}</div>
          <div className="text-xs text-blue-400 mb-1">{promo.type}</div>
          <div className="text-white font-bold mb-2">{promo.title}</div>
          <div className="text-slate-400 text-sm mb-3">{promo.description}</div>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-300">
            Read More
          </button>
        </div>
      ))}
    </div>
  </section>
);
