
"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

const chips = [10, 50, 100, 500, 1000];

export default function DicePage() {
  const [betAmount, setBetAmount] = useState(100);
  const [chance, setChance] = useState(50);
  const [rolled, setRolled] = useState<number | null>(null);
  const [win, setWin] = useState<boolean | null>(null);
  const [payout, setPayout] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [loading, setLoading] = useState(false);

  // For dice animation (1 to 6)
  const [diceFace, setDiceFace] = useState(1);
  const intervalRef = useRef<number | null>(null);

  const audioRoll = typeof Audio !== "undefined" ? new Audio('/sounds/rolling.mp3') : null;
  const audioClick = typeof Audio !== "undefined" ? new Audio('/sounds/click.mp3') : null;

  const rollDice = async () => {
    setLoading(true);
    setRolled(null);
    setWin(null);
    setPayout(0);
    setMultiplier(0);

    // Start dice animation: cycle diceFace from 1 to 6 every 100ms
   intervalRef.current = window.setInterval(() => {
    setDiceFace((prev) => (prev === 6 ? 1 : prev + 1));
  }, 100);

    audioRoll?.play();

    try {
      const res = await axios.post("/api/dice", {
        betAmount,
        chance,
      });
      if (res.status !== 200) {
        throw new Error("Failed to roll dice");
      }

      const { rolled, win, payout, payoutMultiplier } = res.data;

      // Stop animation and show final results after delay
      setTimeout(() => {
       if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
        // Map rolled number 1-100 to dice face 1-6 for final display
        const finalDiceFace = ((rolled - 1) % 6) + 1;
        setDiceFace(finalDiceFace);

        setRolled(rolled);
        setWin(win);
        setPayout(payout);
        setMultiplier(payoutMultiplier);
        setLoading(false);
      }, 3100);
    } catch (err: any) {
      if (intervalRef.current !== null) {
    window.clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
      alert(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  const handleChipClick = (value: number) => {
    audioClick?.play();
    setBetAmount(value);
  };

  return (
    <div className="flex min-h-screen sm:flex-row flex-col items-center justify-center bg-gray-950 text-white p-6 gap-8">
      {/* Left side: Dice animation */}
      <div className="w-full max-w-md sm:h-[530px] h-48 p-2 flex items-center justify-center bg-gray-800 rounded-xl shadow-lg">
        {/* Simple dice face as a big number, you can replace with dice images */}
        <div className="text-9xl select-none">
            <img src={`/dice/${diceFace}.svg`} alt={`${diceFace}`} className="w-24 h-24" />
        </div>
      </div>

      {/* Right side: betting UI */}
      <div className="bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">🎲 Dice Game</h1>

        <div className="mb-4">
          <label className="block mb-2">Select Chip</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {chips.map((chip) => (
              <div
                key={chip}
                onClick={() => handleChipClick(chip)}
                className={`cursor-pointer transition-transform transform hover:scale-110 ${
                  chip === betAmount ? "ring-4 ring-green-500 rounded-full" : ""
                }`}
              >
                <div className="bg-green-600 text-white px-4 py-2 border-2 rounded-full">
                  ${chip}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Chance (%)</label>
          <input
            type="number"
            value={chance}
            onChange={(e) => setChance(+e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 rounded-md text-white"
            min={1}
            max={99}
          />
        </div>

        <button
          onClick={rollDice}
          disabled={loading}
          className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-semibold"
        >
          {loading ? "Rolling..." : `Roll for $${betAmount}`}
        </button>

        {loading && (
          <div className="mt-6 text-center animate-pulse text-lg text-yellow-400">
            Rolling Dice...
          </div>
        )}

        {rolled !== null && !loading && (
          <div className="mt-6 text-center animate-fade-in">
            <p className="text-xl font-semibold">{win ? "🎉 You Win!" : "❌ You Lose!"}</p>
            <p className="mt-2">
              Rolled Number: <span className="font-bold">{rolled}</span>
            </p>
            <p>
              Multiplier: <span className="font-bold">{multiplier}x</span>
            </p>
            <p>
              Payout: <span className="font-bold text-green-400">${payout}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
