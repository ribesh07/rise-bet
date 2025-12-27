"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const MULTIPLIERS = [
  1.00, 1.11, 1.27, 1.46, 1.69, 1.98, 2.33, 2.75, 3.25,
];

export default function PumpGame() {
  const [active, setActive] = useState(0);

  return (
    <div className="min-h-screen bg-[#0b1f2a] flex items-end justify-center">
      <div className="relative w-full max-w-6xl h-[420px] overflow-hidden rounded-t-3xl bg-[#0b1f2a] border border-[#163545]">

        {/* 🌊 Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2b3a] to-[#0b1f2a]" />

        {/* 🏗 Ground Base */}
        

        {/* 🏭 Pump / Easy Mill */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
          <motion.img
            src="/games/pump/easymill.svg"
            alt="Pump Mill"
            className="w-[520px] max-w-none select-none"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            draggable={false}
          />
        </div>

        {/* 🔵 Indicator dots (left) */}
        

        {/* 🎯 Multiplier Row */}
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {MULTIPLIERS.map((m, i) => {
              const isActive = i === active;
              return (
                <motion.button
                  key={i}
                  onClick={() => setActive(i)}
                  whileTap={{ scale: 0.94 }}
                  className={`min-w-[92px] py-3 rounded-xl text-sm font-semibold transition
                    ${
                      isActive
                        ? "bg-[#3bb4ff] text-[#08202c]"
                        : "bg-[#132f3d] text-[#a7c3d3]"
                    }
                    shadow-inner`}
                >
                  {m.toFixed(2)}x
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
