'use client';

import { Settings, LayoutGrid, Maximize2, Check, TrendingUpIcon } from "lucide-react";
import GameDropdown from "./gamedropup";

export default function RiseTopBar() {
  return (
    <div className="w-full h-12 p-3 bg-gradient-to-b from-[#0f212e] to-[#0b1a24] flex items-center justify-between px-4 border-b border-[#1c2e3a] rounded-2xl">
      
      {/* Left icons */}
      <div className="flex items-center gap-4 text-[#8fa6b5]">
        <button className="hover:text-white transition">
          <GameDropdown/>
         </button>
        <button className="hover:text-white transition">
          <TrendingUpIcon size={18} />
        </button>
     
      </div>

      {/* Center logo */}
      <div className="text-white font-bold text-lg tracking-wide">
         <img src="/logo.png" alt="Rise Logo" className="hidden md:block w-10" />
      </div>

      {/* Right Fairness button */}
      <button className="flex items-center gap-2 bg-[#09161f] hover:bg-[#223a49] transition px-3 py-1.5 rounded-md text-sm text-white">
        <Check size={16} className="text-green-400" />
        Rise Original
      </button>
    </div>
  );
}
