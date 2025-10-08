'use client';
import React from 'react';
import { TrendingUp } from 'lucide-react';

const trendingGames = [
  { id: 1, name: "Crash", players: 482, provider: "Pragmatic Play", image: "/images/crash.jpg" },
  { id: 2, name: "Plinko", players: 438, provider: "Pragmatic Play", image: "/images/plinko.jpg" },
  { id: 3, name: "Roulette", players: 307, provider: "Zeus Play", image: "/images/roulette.jpg" },
  { id: 4, name: "Mines", players: 422, provider: "Pragmatic Play", image: "/images/mines.jpg" },
  { id: 5, name: "Hi-Lo", players: 257, provider: "Hacksaw Gaming", image: "/images/hi_lo.jpg" },
  { id: 6, name: "Dice", players: 317, provider: "Pragmatic Play", image: "/images/dice.jpg" },
  { id: 7, name: "Baccarat", players: 129, provider: "Massive Studios", image: "/images/baccarat.jpg" },
  { id: 8, name: "Poker", players: 175, provider: "Pragmatic Play", image: "/images/poker.jpg" }
];

export const TrendingGames: React.FC = () => {
  return (
    <section>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-4 mb-4 flex items-center">
                  <TrendingUp className="mr-2 mt-4" size={20} /> Trending Games
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
                  {trendingGames.map((game) => (
                    <div
                      key={game.id}
                      className="bg-slate-800 rounded-xl p-3 sm:p-4 hover:bg-slate-700 transform hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer text-center"
                    >
                      <img src={game.image} alt={game.name} className="rounded-md mb-2" />
                      <div className="text-white font-medium text-xs sm:text-sm mb-1 truncate">{game.name}</div>
                      <div className="text-slate-400 text-[10px] sm:text-xs mb-1">{game.provider}</div>
                      <div className="flex items-center justify-center text-xs sm:text-sm text-green-400">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                        {game.players} playing
                      </div>
                    </div>
                  ))}
                </div>
              </section>
  );
};
