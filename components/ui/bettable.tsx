'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button"; // optional

export default function LimboLeftPanel() {
  const [bet, setBet] = useState(1);
  const [targetMultiplier, setTargetMultiplier] = useState(2);
  const [isAuto, setIsAuto] = useState(false);
  const [autoBets, setAutoBets] = useState(10);

  const profit = bet * targetMultiplier - bet;

  return (
    <div className="w-80 bg-[#122733] rounded-xl p-4 space-y-4 text-white">

      {/* Manual / Auto Toggle */}
      <div className="flex bg-[#0b1c26] rounded-lg p-1">
        <button
          onClick={() => setIsAuto(false)}
          className={`flex-1 py-2 rounded-md ${
            !isAuto ? "bg-[#122733]" : "text-gray-400"
          }`}
        >
          Manual
        </button>
        <button
          onClick={() => setIsAuto(true)}
          className={`flex-1 py-2 rounded-md ${
            isAuto ? "bg-[#122733]" : "text-gray-400"
          }`}
        >
          Auto
        </button>
      </div>

      {/* Bet Amount */}
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
          <button
            onClick={() => setBet(bet / 2)}
            className="px-3 bg-[#1b3948]"
          >
            ½
          </button>
          <button
            onClick={() => setBet(bet * 2)}
            className="px-3 bg-[#1b3948] rounded-r-md"
          >
            2×
          </button>
        </div>
      </div>

      {/* Target Multiplier */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Target Multiplier</span>
          <span>{targetMultiplier.toFixed(2)}x</span>
        </div>

        <input
          type="number"
          step="0.01"
          value={targetMultiplier}
          onChange={(e) => setTargetMultiplier(Number(e.target.value))}
          className="w-full bg-[#0b1c26] p-2 rounded-md outline-none"
        />
      </div>

      {/* AUTO MODE INPUT */}
      {isAuto && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Number of Bets</span>
            <span>{autoBets}</span>
          </div>

          <input
            type="number"
            min={1}
            value={autoBets}
            onChange={(e) => setAutoBets(Number(e.target.value))}
            className="w-full bg-[#0b1c26] p-2 rounded-md outline-none"
          />
        </div>
      )}

      {/* Bet Button */}
      <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold">
        {isAuto ? "Start Auto" : "Bet"}
      </Button>

      {/* Disabled button */}
      <button
        className="w-full py-2 rounded-md bg-[#1b3948] text-gray-400 cursor-not-allowed"
        disabled
      >
        Random Pick
      </button>

      {/* Profit Box */}
      <div className="bg-[#0b1c26] p-3 rounded-md text-sm">
        <div className="flex justify-between text-gray-400">
          <span>Total Profit ({targetMultiplier.toFixed(2)}x)</span>
          <span>{profit.toFixed(8)} BTC</span>
        </div>
        <div className="flex justify-between mt-1 items-center">
          <span className="text-lg">{profit.toFixed(2)}</span>
          <span className="bg-green-500 text-black px-2 rounded">$</span>
        </div>
      </div>

    </div>
  );
}
