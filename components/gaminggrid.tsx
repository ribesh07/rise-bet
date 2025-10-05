
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

  const games: Game[] = [
    { name: "Crash", image: "/images/crash.jpg", playing: 1738, route: "/games/crash" },
    { name: "Dice", image: "/images/dice.jpg", playing: 384, route: "/games/dice" },
    { name: "Plinko", image: "/images/plinko.jpg", playing: 436, route: "/games/plinko" },
    { name: "Roulette", image: "/images/roulette.jpg", playing: 202, route: "/games/roulette" },
    { name: "Mines", image: "/images/mines.jpg", playing: 370, route: "/games/mines" },
    { name: "Hi-Lo", image: "/images/hi_lo.jpg", playing: 232, route: "/games/hi_lo" },
    { name: "Baccarat", image: "/images/baccarat.jpg", playing: 191, route: "/games/baccarat" },
    { name: "Blackjack", image: "/images/blackjack.jpg", playing: 284, route: "/games/blackjack" },
    { name: "Poker", image: "/images/poker.jpg", playing: 436, route: "/games/poker" },
    { name: "Big Bass Bonanza", image: "/images/Big_Bass_Bonanza.jpg", playing: 1738, route: "/games/big_bass_bonanza" },
    { name: "Sweet Bonanza", image: "/images/sweet_bonanza.jpg", playing: 384, route: "/games/sweet_bonanza" },
    { name: "Gate Of Olympus", image: "/images/Gates_of_olympus.jpg", playing: 0, route: "/games/gates_of_olympus" },
    { name: "Dual At Dawn", image: "/images/dual_at_dawn.jpg", playing: 0, route: "/games/dual_at_dawn" },
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
