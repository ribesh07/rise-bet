
// "use client";
// import React, { useRef } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { ChevronRight } from "lucide-react";

// interface Game {
//   name: string;
//   image: string;
//   playing: number;
// }

// interface GameGridProps {
//   search: string;
// }

// const GameGrid: React.FC<GameGridProps> = ({ search }) => {
//   const games: Game[] = [
//     { name: "Crash", image: "/images/crash.jpg", playing: 1738 },
//     { name: "Dice", image: "/images/dice.jpg", playing: 384 },
//     { name: "Plinko", image: "/images/plinko.jpg", playing: 436 },
//     { name: "Roulette", image: "/images/roulette.jpg", playing: 202 },
//     { name: "Mines", image: "/images/mines.jpg", playing: 370 },
//     { name: "Hi-Lo", image: "/images/hi_lo.jpg", playing: 232 },
//   { name: "Baccarat", image: "/images/baccarat.jpg", playing: 191 },
//   { name: "Blackjack", image: "/images/blackjack.jpg", playing: 284 },
//   { name: "Poker", image: "/images/poker.jpg", playing: 436 },
//   { name: "Big Bass Bonanza", image: "/images/Big_Bass_Bonanza.jpg", playing: 1738 },
//   { name: "Sweet Bonanza", image: "/images/sweet_bonanza.jpg", playing: 384 },
//   { name: "Gate Of Olympus", image: "/images/Gates_of_olympus.jpg", playing: 0 },
//   { name: "Dual At Dawn", image: "/images/dual_at_dawn.jpg", playing: 0 },
//   ];

//   const filteredGames = games.filter((game) =>
//     game.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const scrollContainerRef = useRef<HTMLDivElement>(null);

//   const scrollRight = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({
//         left: 200, // Adjust scroll step as needed
//         behavior: "smooth",
//       });
//     }
//   };

//   return (
//     <div className="relative w-full">
//       {/* Scroll Button (Top Right) */}
//       <button
//         onClick={scrollRight}
//         className="absolute right-2 top-2 z-10 bg-[#1e293b] hover:bg-[#243249] text-white p-2 rounded-full shadow"
//       >
//         <ChevronRight size={20} />
//       </button>

//       {/* Scrollable Container */}
//       <div
//         ref={scrollContainerRef}
//         className="flex overflow-x-auto no-scrollbar gap-2 pr-10" // pr-10 so button won't overlap last card
//       >
//         {filteredGames.map((game, index) => (
//           <Card
//             key={index}
//             className="bg-[#1e293b] hover:bg-[#243249] transition-colors cursor-pointer flex-shrink-0 w-[110px] h-[180px] md:w-[160px] md:h-[220px]"
//           >
//             <CardContent className="p-0 h-full flex flex-col">
//               <img
//                 src={game.image}
//                 alt={game.name}
//                 className="rounded-t-lg w-full h-[70%] object-cover"
//               />
//               <div className="p-2 flex flex-col items-center justify-center h-[30%]">
//                 <p className="text-xs md:text-sm font-semibold text-center line-clamp-2">
//                   {game.name}
//                 </p>
//                 <span className="text-green-400 text-xs mt-1">
                  
//                 </span>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GameGrid;
"use client";
import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface Game {
  name: string;
  image: string;
  playing: number;
}

interface GameGridProps {
  search: string;
}

const GameGrid: React.FC<GameGridProps> = ({ search }) => {
  const games: Game[] = [
    { name: "Crash", image: "/images/crash.jpg", playing: 1738 },
    { name: "Dice", image: "/images/dice.jpg", playing: 384 },
    { name: "Plinko", image: "/images/plinko.jpg", playing: 436 },
    { name: "Roulette", image: "/images/roulette.jpg", playing: 202 },
    { name: "Mines", image: "/images/mines.jpg", playing: 370 },
    { name: "Hi-Lo", image: "/images/hi_lo.jpg", playing: 232 },
    { name: "Baccarat", image: "/images/baccarat.jpg", playing: 191 },
    { name: "Blackjack", image: "/images/blackjack.jpg", playing: 284 },
    { name: "Poker", image: "/images/poker.jpg", playing: 436 },
    { name: "Big Bass Bonanza", image: "/images/Big_Bass_Bonanza.jpg", playing: 1738 },
    { name: "Sweet Bonanza", image: "/images/sweet_bonanza.jpg", playing: 384 },
    { name: "Gate Of Olympus", image: "/images/Gates_of_olympus.jpg", playing: 0 },
    { name: "Dual At Dawn", image: "/images/dual_at_dawn.jpg", playing: 0 },
  ];

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(search.toLowerCase())
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200, // Adjust scroll step as needed
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Scroll Button (Top Right) */}
      <button
        onClick={scrollRight}
        className="absolute right-2 top-2 z-10 bg-[#1e293b] hover:bg-[#243249] text-white p-2 rounded-full shadow"
      >
        <ChevronRight size={20} />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-2 pr-10 scroll-container"
      >
        {filteredGames.map((game, index) => (
          <Card
            key={index}
            className="bg-[#1e293b] hover:bg-[#243249] transition-colors cursor-pointer flex-shrink-0 w-[110px] h-[180px] md:w-[160px] md:h-[220px]"
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
    </div>
  );
};

export default GameGrid;
