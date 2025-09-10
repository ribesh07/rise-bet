import Image from "next/image";
import React from "react";

const games = [
  { name: "Crash", image: "/images/crash.jpg"},
  { name: "Dice", image: "/images/dice.jpg" },
  { name: "Plinko", image: "/images/plinko.jpg" },
  { name: "Roulette", image: "/images/roulette.jpg" },
  { name: "Mines", image: "/images/mines.jpg" },
  { name: "Hi-Lo", image: "/images/hi_lo.jpg" },
  { name: "Baccarat", image: "/images/baccarat.jpg" },
  { name: "Blackjack", image: "/images/blackjack.jpg" },
  { name: "Poker", image: "/images/poker.jpg"},
  { name: "Big Bass Bonanza", image: "/images/Big_Bass_Bonanza.jpg" },
  { name: "Sweet Bonanza", image: "/images/sweet_bonanza.jpg"},
  { name: "Gate Of Olympus", image: "/images/Gates_of_olympus.jpg"},
  { name: "Dual At Dawn", image: "/images/dual_at_dawn.jpg" },
];

const GameGrid = () => {
  return (
    <section className="bg-gray-900 py-12 px-4">
      <h2 className="text-2xl md:text-3xl text-white font-semibold mb-8 text-center">
        Featured Games
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {games.map((game, idx) => (
          <div
            key={idx}
            className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition transform duration-300"
          >
            <Image
              src={game.image}
              alt={game.name}
              width={300}
              height={200}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 text-center text-white font-medium">
              {game.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GameGrid;

