
import Image from "next/image";
import Link from "next/link";

const games = [
  { name: "Crash", image: "/images/crash.jpg", route: "/games/CrashGame" },
  { name: "Dice", image: "/images/dice.jpg", route: "/games/DiceGame" },
  { name: "Plinko", image: "/images/plinko.jpg", route: "/games/PlinkoGame" },
  { name: "Roulette", image: "/images/roulette.jpg", route: "/games/RouletteGame" },
  { name: "Mines", image: "/images/mines.jpg", route: "/games/MinesGame" },
  { name: "Hi-Lo", image: "/images/hi_lo.jpg", route: "/games/HiloGame" },
  { name: "Baccarat", image: "/images/baccarat.jpg", route: "/games/BaccaratGame" },
  { name: "Blackjack", image: "/images/blackjack.jpg", route: "/games/BlackjacksGame" },
  { name: "Poker", image: "/images/poker.jpg", route: "/games/PokerGame" },
  { name: "Big Bass Bonanza", image: "/images/Big_Bass_Bonanza.jpg", route: "/games/SlotsGame" },
  { name: "Sweet Bonanza", image: "/images/sweet_bonanza.jpg", route: "/games/SlotsGame" },
  { name: "Gate Of Olympus", image: "/images/Gates_of_olympus.jpg", route: "/games/SlotsGame" },
  { name: "Dual At Dawn", image: "/images/dual_at_dawn.jpg", route: "/games/SlotsGame" },

];

export default function GameGrid() {
  return (
    <section className="bg-gray-900 py-12 px-4">
      <h2 className="text-2xl md:text-3xl text-white font-semibold mb-8 text-center">
        Featured Games
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {games.map(({ name, image, route }, idx) => (
          <Link key={idx} href={route} className="block">
            <div className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition transform duration-300 cursor-pointer">
              <Image
                src={image}
                alt={name}
                width={300}
                height={200}
                className="w-full h-40 object-cover"
                priority={idx === 0}
              />
              <div className="p-4 text-center text-white font-medium">{name}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

