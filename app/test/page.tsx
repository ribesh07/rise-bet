"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* =======================================================
    INLINE CLOUD ASSET (Base64 PNG)
======================================================= */
const CLOUD_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAABL0lEQVR42u2WsQ2DMAyFT3a1uFSpgQdCq1sgcRQeAtxAi8uKXu95syEHCqB6f+GO6zkRgZNpm52dE7YQDUIrjTiMQuILzfoalGoVYBoNvAQmJsteVEhDWUpAJZciV06Pq4jG3Ejj6inUeJ8V+YA7cRUW2KIiMzFxDBI0X58F3RDeo63HgNbUsVTN4ltpwh28ykVfoCkb0zjLxyzKDn5i7xL7sRKqzZo4PM5XsfS5aXoaZySUdkGFUTkOcJCIZy9FHn5Vf3L7hIwrKyYVJZZzKzbwQ6vurIWBLL8GMDIS9ZhDJW60Agw7P3cu6UytzszbmWzxubAEANe0yoyWZMhUlCT3VkOITkkpFmS6r30YIOCQM7DDDeWGPAHDLcGRIDcN+xr3aMcMBXNIN1qQEbfkWf9eKJeNEqXWiwxupCSvJzpuG1HsfrN7kYM/qf+oCuWHa3gwAAAABJRU5ErkJggg==";

/* =======================================================
    SPACEX STYLE ROCKET SVG (works correctly)
======================================================= */
const Rocket = () => (
  <svg
    width="140"
    height="260"
    viewBox="0 0 140 260"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="body" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#f8f8f8" />
        <stop offset="100%" stopColor="#d0d0d0" />
      </linearGradient>
    </defs>

    {/* BODY */}
    <rect x="55" y="40" width="30" height="140" rx="15" fill="url(#body)" />

    {/* NOSE */}
    <polygon points="70,0 50,40 90,40" fill="#eeeeee" />

    {/* LEFT FIN */}
    <polygon points="50,140 20,180 50,180" fill="#cccccc" />

    {/* RIGHT FIN */}
    <polygon points="90,140 120,180 90,180" fill="#cccccc" />

    {/* ENGINE */}
    <rect x="60" y="180" width="20" height="30" fill="#b0b0b0" />
  </svg>
);

/* =======================================================
    MAIN CRASH GAME COMPONENT
======================================================= */
export default function CrashGame() {
  const [multiplier, setMultiplier] = useState(1);
  const [crashed, setCrashed] = useState(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    startGame();
    return () => clearInterval(intervalRef.current);
  }, []);

  const startGame = () => {
    clearInterval(intervalRef.current);
    setMultiplier(1);
    setCrashed(false);

    intervalRef.current = setInterval(() => {
      setMultiplier((prev) => {
        const next = parseFloat((prev + 0.01).toFixed(2));
        if (next >= 5.5) {
          setCrashed(true);
          clearInterval(intervalRef.current);
        }
        return next;
      });
    }, 50);
  };

  return (
    <div className="w-full h-screen relative overflow-hidden bg-gradient-to-b from-[#00111A] to-[#003344]">
      {/* =======================================================
          STARS BACKGROUND
      ======================================================== */}
      <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(circle,#ffffff_1px,transparent_2px)] bg-[length:20px_20px]" />

      {/* =======================================================
          CLOUDS (PARALLAX)
      ======================================================== */}
      <img
        src={CLOUD_BASE64}
        className="absolute left-10 top-20 w-72 opacity-40 z-10 animate-cloud"
      />
      <img
        src={CLOUD_BASE64}
        className="absolute left-60 top-48 w-96 opacity-30 z-10 animate-cloud2"
      />

      {/* =======================================================
          ROCKET + FLAME
      ======================================================== */}
      <motion.div
        animate={
          crashed
            ? { y: -20, rotate: -20 }
            : { y: [-2, 2, -2], transition: { repeat: Infinity, duration: 1 } }
        }
        className="absolute left-1/2 -translate-x-1/2 bottom-32 z-20"
      >
        <Rocket />

        {/* FLAME */}
        {!crashed && (
          <div className="absolute left-1/2 -translate-x-1/2 top-[185px] z-30">
            <div className="w-6 h-10 bg-yellow-300 blur-md animate-flame"></div>
          </div>
        )}
      </motion.div>

      {/* =======================================================
          MULTIPLIER TEXT
      ======================================================== */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-white text-5xl font-bold z-40 drop-shadow-lg">
        {crashed ? "💥 CRASHED!" : `${multiplier.toFixed(2)}x`}
      </div>

      {/* =======================================================
          RESTART BUTTON
      ======================================================== */}
      {crashed && (
        <button
          onClick={startGame}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-white text-black rounded-xl font-semibold shadow-lg z-40"
        >
          Restart
        </button>
      )}

      {/* =======================================================
          ANIMATION STYLES
      ======================================================== */}
      <style jsx>{`
        @keyframes cloudMove {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-200px);
          }
        }

        .animate-cloud {
          animation: cloudMove 20s linear infinite;
        }
        .animate-cloud2 {
          animation: cloudMove 30s linear infinite;
        }

        @keyframes flameFlicker {
          0% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.4);
          }
          100% {
            transform: scaleY(1);
          }
        }

        .animate-flame {
          animation: flameFlicker 0.15s infinite;
        }
      `}</style>
    </div>
  );
}
