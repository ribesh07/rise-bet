
"use client";
import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Game {
  name: string;
  image: string;
  playing: number;
  route: string;
}

interface GameGridProps {
  search: string;
}

// Expose scroll function to parent using ref
export interface GameGridHandles {
  scroll: (direction: "left" | "right") => void;
}

const GamingGrid = forwardRef<GameGridHandles, GameGridProps>(({ search }, ref) => {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tableId = "roulette_1"; // Replace with actual table ID logic if needed

  const games: Game[] = [
    { name: "Wingo", image: "/images/wingo.jpg", playing: 340, route: "/games/wingo"  },
    { name: "Crash", image: "/images/crash.jpg", playing: 1738, route: "/games/CrashGame" },
    { name: "Dice", image: "/images/dice.jpg", playing: 384, route: "/games/DiceGame" },
    { name: "Plinko", image: "/images/plinko.jpg", playing: 436, route: "/games/PlinkoGame" },
    { name: "Roulette", image: "/images/roulette.jpg", playing: 202, route: `/games/RouletteGame/${tableId}` },
    { name: "Mines", image: "/images/mines.jpg", playing: 370, route: "/games/MinesGame" },
    { name: "Hi-Lo", image: "/images/hi_lo.jpg", playing: 232, route: "/games/HiloGame" },
    { name: "Baccarat", image: "/images/baccarat.jpg", playing: 191, route: "/games/BaccaratGame" },
    { name: "Blackjack", image: "/images/blackjack.jpg", playing: 284, route: "/games/BlackjacksGame" },
    { name: "Poker", image: "/images/poker.jpg", playing: 436, route: "/games/PokerGame" },
    { name: "Coin Flip", image: "/games/flip/avove.jpeg", playing: 1738, route: "/games/CoinFlip" },
    { name: "Dragon Tower", image: "/games/dragontower/avove.jpeg", playing: 384, route: "/games/Dragon_tower" },
    { name: "Rock paper", image: "/games/rockpaper/avove.jpeg", playing: 0, route: "/games/Rock_paper" },
    { name: "Chicken", image: "/games/chicken/avove.png", playing: 0, route: "/games/Chicken" },
  ];

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(search.toLowerCase())
  );

  // Scroll function
  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 250; // pixels
    scrollContainerRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  // Expose scroll to parent
  useImperativeHandle(ref, () => ({ scroll }));

  return (
    <div
      ref={scrollContainerRef}
      className="flex overflow-x-auto gap-2 pr-10 scroll-container"
    >
      {filteredGames.map((game, index) => (
        <Card
          key={index}
          className="bg-[#1e293b] hover:bg-[#243249] transition-colors cursor-pointer flex-shrink-0 w-[110px] h-[180px] md:w-[160px] md:h-[220px]"
          onClick={() => router.push(game.route)}
        >
          <CardContent className="p-0 h-full flex flex-col">
            <img
              src={game.image}
              alt={game.name}
              className="rounded-t-lg w-full h-[70%] object-cover"
            />
            <div className="p-2 flex flex-col items-center justify-center h-[30%]">
              <p className="text-xs md:text-sm font-semibold text-center line-clamp-2">
                {game.name}
              </p>
              <span className="text-green-400 text-xs mt-1"></span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

GamingGrid.displayName = "GamingGrid";

export default GamingGrid;
