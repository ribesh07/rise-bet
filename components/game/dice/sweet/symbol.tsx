// Symbol.tsx
import React from "react";
import { SYMBOL_SIZE, SPRITE_COLS } from "./spriteConfig";

type Props = {
  symbol: string;
  frame: number; // which frame from sprite (0–24)
};

const Symbol: React.FC<Props> = ({ symbol, frame }) => {
  const x = (frame % SPRITE_COLS) * SYMBOL_SIZE;
  const y = Math.floor(frame / SPRITE_COLS) * SYMBOL_SIZE;

  return (
    <div
      className="symbol"
      style={{
        width: SYMBOL_SIZE,
        height: SYMBOL_SIZE,
        backgroundImage: `url(/games/sweetbonanza/${symbol}.png)`,
        backgroundPosition: `-${x}px -${y}px`,
        backgroundSize: `${SPRITE_COLS * SYMBOL_SIZE}px auto`,
      }}
    />
  );
};

export default Symbol;
