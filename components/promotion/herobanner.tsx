
import React from 'react';

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[220px] sm:h-[280px] bg-gradient-to-r from-[#14233D] to-[#0E192D] flex items-center justify-center overflow-hidden rounded-2xl">
      <img
        src="/images/hero-banner.png"
        alt="Promotions Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="relative z-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold font-[Lexend]">Promotions</h1>
        <p className="text-gray-300 text-sm mt-2">
          Explore the latest bonuses and events
        </p>
      </div>
    </div>
  );
}
