"use client";
import { useEffect, useRef } from "react";

type DiceProps = {
  rolling: boolean;
  value: 1 | 2 | 3 | 4 | 5 | 6;
};

export default function Dice({ rolling, value }: DiceProps) {
  const diceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = diceRef.current;
    if (!el) return;

    if (rolling) {
      // 🔁 CONTINUOUS SPRITE ROLL
      el.style.backgroundImage = "url('/dice-sprite.png')";
      el.style.backgroundSize = "100% auto";
      el.classList.add("rolling");
    } else {
      // 🎯 SNAP TO RESULT IMAGE
      el.classList.remove("rolling");
      el.style.backgroundImage = `url('/dice-${value}.png')`;
      el.style.backgroundSize = "contain";
    }
  }, [rolling, value]);

  return (
    <div className="dice-window">
      <div ref={diceRef} className="dice-face" />
    </div>
  );
}
