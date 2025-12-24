'use client';
import { JSX, useState } from "react";

import { Button } from "@/components/ui/button";

const ROWS = 9;
const COLS = 3;

// Rise-style multiplier ladder (bottom → top)
const MULTIPLIERS = [1.2, 1.5, 1.9, 2.4, 3.1, 4.2, 6.0, 9.0];

// Difficulty → win chance per pick
const DIFFICULTY_ODDS: Record<string, number> = {
  Easy: 0.75,
  Medium: 0.6,
  Hard: 0.45,
  Expert: 0.32,
  Master: 0.22,
};

interface PathItem {
  row: number;
  col: number;
  safe: boolean;
}

export default function DragonTowerGame(): JSX.Element {
  const [activeRow, setActiveRow] = useState<number>(ROWS - 1);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [path, setPath] = useState<PathItem[]>([]);

  const [bet, setBet] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string>("Medium");
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1);
  const [started, setStarted] = useState<boolean>(false);

  const handlePick = (col: number): void => {
    if (!started || gameOver) return;

    const winChance = DIFFICULTY_ODDS[difficulty];
    const isSafe = Math.random() < winChance;

    if (isSafe) {
      setPath((prev) => [...prev, { row: activeRow, col, safe: true }]);

      const nextMultiplier = MULTIPLIERS[ROWS - 1 - activeRow];
      setCurrentMultiplier(nextMultiplier);

      setActiveRow((prev) => {
        if (prev === 0) {
          setGameOver(true);
          return prev;
        }
        return prev - 1;
      });
    } else {
      setPath((prev) => [...prev, { row: activeRow, col, safe: false }]);
      setCurrentMultiplier(0);
      setGameOver(true);
    }
  };

  const startGame = (): void => {
    if (bet <= 0) return;
    setStarted(true);
    setGameOver(false);
    setPath([]);
    setActiveRow(ROWS - 1);
    setCurrentMultiplier(1);
  };

  const cashout = (): void => {
    if (!started || gameOver) return;
    setGameOver(true);
  };

  const profit = bet * currentMultiplier;

  return (
    <div className="min-h-screen bg-[#0b1c26] text-white flex gap-6 p-6">
      {/* LEFT PANEL – Rise style */}
      <div className="w-80 bg-[#122733] rounded-xl p-4 space-y-4">
        <div className="flex bg-[#0b1c26] rounded-lg p-1">
          <button className="flex-1 py-2 rounded-md bg-[#122733]">Manual</button>
          <button className="flex-1 py-2 rounded-md text-gray-400">Auto</button>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Bet Amount</span>
            <span>{bet.toFixed(8)} BTC</span>
          </div>

          <div className="flex">
            <input
              type="number"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              className="flex-1 bg-[#0b1c26] p-2 rounded-l-md outline-none"
              placeholder="0.00"
            />
            <button className="px-3 bg-[#1b3948]">½</button>
            <button className="px-3 bg-[#1b3948] rounded-r-md">2×</button>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-1">Difficulty</p>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full bg-[#0b1c26] p-2 rounded-md outline-none"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
            <option>Expert</option>
            <option>Master</option>
          </select>
        </div>

        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
          onClick={started ? cashout : startGame}
        >
          {started && !gameOver ? "Cashout" : "Bet"}
        </Button>

        <button
          className="w-full py-2 rounded-md bg-[#1b3948] text-gray-400 cursor-not-allowed"
          disabled
        >
          Random Pick
        </button>

        <div className="bg-[#0b1c26] p-3 rounded-md text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Total Profit ({currentMultiplier.toFixed(2)}x)</span>
            <span>{profit.toFixed(8)} BTC</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-lg">{profit.toFixed(2)}</span>
            <span className="bg-green-500 text-black px-2 rounded">$</span>
          </div>
        </div>
      </div>

      {/* GAME BOARD */}
      <div className="dragontower-header-bg flex-1 flex justify-center">
  <div className="relative flex flex-col items-center w-full max-w-[900px]">

    {/* DRAGON BODY */}
    <img
      src="/games/dragontower/body.svg"
      className="w-full pointer-events-none select-none"
    />

    {/* GAME BOARD */}
    <div className="relative -mt-24 z-20">
      {/* your board */}
       {/* 🧱 OUTER FRAME */}
    <div
      className="
        relative
        bg-[#2a4c5d]
        rounded-xl
        
        border-[10px]
        border-[#2a4c5d]
        shadow-[0_0_40px_rgba(0,0,0,0.7)]
        overflow-visible
      "
    >
     
      {/* 🐉 DRAGON HEAD (IN FRONT OF WALL) */}
      <img
        src="/games/dragontower/dragon.svg"
        alt="Dragon Head"
        className="
          absolute
          left-1/2
          -translate-x-1/2
          -top-[92px]
          w-[96px]
          z-60
          pointer-events-none
          select-none
        "
      />

      {/* 🧱 INNER BOARD */}
      <div className=" bg-[#182433]  ">
         <div
        className="
          absolute
          left-0
          -top-[64px]
          w-full
          h-full
          z-20
          pointer-events-none
          select-none
        "
        style={{
          backgroundImage: "url(/games/dragontower/top.svg)",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "top left",
          backgroundSize: "auto 64px",
        }}
      />
    
        {/* SPACE SO WALL DOESN'T OVERLAP TILES */}
        <div className="pt-10 grid gap-2">
          {Array.from({ length: ROWS }).map((_, r) => (
            <div key={r} className="grid grid-cols-3 gap-2">
              {Array.from({ length: COLS }).map((_, c) => {
                const revealed = path.find(
                  (p: any) => p.row === r && p.col === c
                );
                const isActive = started && r === activeRow && !gameOver;

                return (
                  <button
  key={c}
  disabled={!isActive}
  onClick={() => handlePick(c)}
  className={`
    relative h-16 w-28 
    
    flex items-center justify-center
    
    ${
      isActive
        ? "hover:bg-[#1e3a4d]"
        : "opacity-40 cursor-not-allowed"
    }
    ]
  `}
>
  {/* DEFAULT EGG */}
  {!revealed && (
    <img
      src="/games/dragontower/button.png"
      alt="Default"
      className="w-max h-max select-none pointer-events-none"
    />
  )}

  {/* SAFE PICK */}
  {revealed?.safe && (
    <img
      src="/games/dragontower/egg.svg"
      alt="Safe"
      className="w-8 h-10 scale-110]"
    />
  )}

  {/* LOSE PICK */}
  {revealed && !revealed.safe && (
    <>
      {/* Red background */}
      <div className="absolute inset-1 rounded-md bg-red-700" />

      {/* Green flame */}
      <img
        src="/games/dragontower/flame.png"
        className="absolute -top-3 w-10 animate-pulse"
        alt=""
      />

      {/* Skull */}
      <img
        src="/games/dragontower/skull.svg"
        alt="Lose"
        className="relative w-8 z-10"
      />
    </>
  )}
</button>

                );
              })}
            </div>
          ))}
        </div>

      </div>
    </div>
    </div>

  </div>
</div>

</div>
     
   
  );
}
