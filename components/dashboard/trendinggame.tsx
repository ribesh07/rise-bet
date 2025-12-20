
'use client';
import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import ComingSoonModal from '@/components/form/loginmodel'; // <----- IMPORTANT

const trendingGames = [
  { id: 1, name: "Crash", players: 482, provider: "Rise Bet", image: "/images/crash.jpg" },
  { id: 2, name: "Plinko", players: 438, provider: "Rise Bet", image: "/images/plinko.jpg" },
  { id: 3, name: "Roulette", players: 307, provider: "Rise Bet", image: "/images/roulette.jpg" },
  { id: 4, name: "Mines", players: 422, provider: "Rise Bet", image: "/images/mines.jpg" },
  { id: 5, name: "Hi-Lo", players: 257, provider: "Rise Bet", image: "/images/hi_lo.jpg" },
  { id: 6, name: "Dice", players: 317, provider: "Rise Bet", image: "/images/dice.jpg" },
  { id: 7, name: "Baccarat", players: 129, provider: "Rise Bet", image: "/images/baccarat.jpg" },
  { id: 8, name: "Poker", players: 175, provider: "Rise Bet", image: "/images/poker.jpg" },
  { id: 9, name: "Blackjack", players: 198, provider: "Rise Bet", image: "/images/blackjack.jpg" },
  { id: 10, name: "Wingo", players: 290, provider: "Rise Bet", image: "/images/wingo.jpg" },
  { id: 11, name: "Coin Flip", players: 1738, provider: "Rise Bet", image: "/games/flip/avove.jpeg" },
  { id: 12, name: "Dragon Tower", players: 384, provider: "Rise Bet", image: "/games/dragontower/avove.jpeg" },
  { id: 13, name: "Rock paper", players: 0, provider: "Rise Bet", image: "/games/rockpaper/avove.jpeg" },
  { id: 14, name: "Chicken", players: 0, provider: "Rise Bet", image: "/games/chicken/avove.png" },
];

export const TrendingGames: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleGameClick = () => {
    setOpenModal(true);
  };

  return (
    <section>
      {/* ✅ Modal */}
      <ComingSoonModal
        open={openModal}
        onClose={() => setOpenModal(false)}
       
      />

      <h2 className="text-xl sm:text-2xl font-bold text-white mt-4 mb-4 flex items-center">
        <TrendingUp className="mr-2 mt-4" size={20} />
        Trending Games
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {trendingGames.map((game) => (
          <div
            key={game.id}
            onClick={handleGameClick} // ✅ Open modal on click
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
