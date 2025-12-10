
// 'use client';
// import { useEffect, useRef, useState } from "react";
// import crypto from "crypto-js";

// export default function CrashGame() {
//   const canvasRef = useRef(null);

//   const [status, setStatus] = useState("waiting"); // waiting | running | crash
//   const [multiplier, setMultiplier] = useState(1.0);

//   const [balance, setBalance] = useState(1000);
//   const [betAmount, setBetAmount] = useState(10);
//   const [betPlaced, setBetPlaced] = useState(false);

//   const [autoCashout, setAutoCashout] = useState(null);

//   const [crashPoint, setCrashPoint] = useState(null);

//   const [serverSeed, setServerSeed] = useState("secret-server-seed");
//   const [clientSeed, setClientSeed] = useState("client-seed");

//   // ============================
//   //     FAIR CRASH ALGORITHM
//   // ============================
//   const generateCrashPoint = () => {
//   const hash = crypto.HmacSHA256(clientSeed, serverSeed).toString();
//   const int = parseInt(hash.slice(0, 52), 16);

//   // probability curve like real crash casinos:
//   const ratio = int / Math.pow(2, 52);

//   // map ratio to multiplier distribution
//   let crash = 1 / (1 - ratio);

//   if (crash > 20) crash = (crash / 10);   // prevent insane spikes
//   if (crash < 2.5) crash += Math.random() * 2; // guarantee 1.05–3.00 minimum

//   return parseFloat(crash.toFixed(2));
// };


//   // ============================
//   //       START GAME
//   // ============================
//   const startGame = () => {
//     if (!betPlaced) return;

//     const cp = generateCrashPoint();
//     setCrashPoint(cp);

//     setStatus("running");
//     runCurveAnimation(cp);
//   };

//   // Auto start after waiting phase
//   useEffect(() => {
//     let timer;
//     if (status === "waiting" && betPlaced) {
//       timer = setTimeout(() => startGame(), 2000);
//     }
//     return () => clearTimeout(timer);
//   }, [status, betPlaced]);

//   // ============================
//   //    FIXED CURVE ANIMATION
//   // ============================
//   const runCurveAnimation = (crashAt) => {
//   const canvas = canvasRef.current;
//   const ctx = canvas.getContext("2d");

//   const WIDTH = 700;
//   const HEIGHT = 350;

//   canvas.width = WIDTH;
//   canvas.height = HEIGHT;

//   let start = performance.now();
//   let frame;

//   function draw() {
//     const elapsed = (performance.now() - start) / 1000;

//     const growthRate = 1.15;
//     const m = Math.pow(growthRate, elapsed * 6);

//     setMultiplier(m.toFixed(2));

//     ctx.clearRect(0, 0, WIDTH, HEIGHT);

//     // ==== BACKGROUND ====
//     ctx.fillStyle = "#0f172a"; // slate-900
//     ctx.fillRect(0, 0, WIDTH, HEIGHT);

//     // ==== ORANGE FILL UNDER CURVE ====
//     ctx.beginPath();
//     ctx.moveTo(0, HEIGHT - 20);

//     let headX = 0;
//     let headY = 0;

//     for (let t = 0; t <= elapsed; t += 0.01) {
//       const mm = Math.pow(growthRate, t * 6);
//       const x = t * 180;
//       let y = HEIGHT - mm * 20;

//       if (y < 20) y = 20;
//       if (x > WIDTH) break;

//       ctx.lineTo(x, y);

//       headX = x;
//       headY = y;
//     }

//     ctx.lineTo(headX, HEIGHT);
//     ctx.closePath();

//     const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
//     gradient.addColorStop(0, "#ffb84d");
//     gradient.addColorStop(1, "#ff8800");
//     ctx.fillStyle = gradient;
//     ctx.fill();

//     // ==== MAIN CURVE STROKE (WHITE) ====
//     ctx.beginPath();
//     ctx.moveTo(0, HEIGHT - 20);

//     for (let t = 0; t <= elapsed; t += 0.01) {
//       const mm = Math.pow(growthRate, t * 6);
//       const x = t * 180;
//       let y = HEIGHT - mm * 20;

//       if (y < 20) y = 20;
//       if (x > WIDTH) break;

//       ctx.lineTo(x, y);
//     }

//     ctx.strokeStyle = "#ffffff";
//     ctx.lineWidth = 3;
//     ctx.shadowColor = "rgba(255,255,255,0.7)";
//     ctx.shadowBlur = 12;
//     ctx.stroke();
//     ctx.shadowBlur = 0;

//     // ==== MOVING HEAD DOT ====
//     ctx.beginPath();
//     ctx.arc(headX, headY, 7, 0, Math.PI * 2);
//     ctx.fillStyle = "#ffffff";
//     ctx.shadowColor = "white";
//     ctx.shadowBlur = 10;
//     ctx.fill();
//     ctx.shadowBlur = 0;

//     // ==== MULTIPLIER TEXT (CENTERED) ====
//     ctx.fillStyle = "#ffffff";
//     ctx.font = "bold 34px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText(`${m.toFixed(2)}x`, WIDTH / 2, HEIGHT / 2);

//     // ==== AXIS TICKS (STAKE STYLE) ====
//     ctx.strokeStyle = "rgba(255,255,255,0.2)";
//     ctx.lineWidth = 1;

//     for (let i = 1; i <= 7; i++) {
//       const y = HEIGHT - (i * 40);
//       ctx.beginPath();
//       ctx.moveTo(0, y);
//       ctx.lineTo(10, y);
//       ctx.stroke();
//     }

//     // ==== Auto Cashout ====
//     if (autoCashout && m >= autoCashout && betPlaced) {
//       cashout();
//       cancelAnimationFrame(frame);
//       return;
//     }

//     // ==== Crash ====
//     if (m >= crashAt) {
//       setStatus("crash");

//       ctx.fillStyle = "red";
//       ctx.font = "bold 28px Arial";
//       ctx.textAlign = "left";
//       ctx.fillText(`CRASH @ ${crashAt.toFixed(2)}x`, 30, 60);

//       return;
//     }

//     frame = requestAnimationFrame(draw);
//   }

//   draw();
// };


//   // ============================
//   // PLACE BET
//   // ============================
//   const placeBet = () => {
//     if (betAmount > balance) return alert("Not enough balance!");
//     setBalance(balance - betAmount);
//     setBetPlaced(true);
//   };

//   // ============================
//   // CASHOUT
//   // ============================
//   const cashout = () => {
//     if (!betPlaced) return;

//     const win = betAmount * multiplier;
//     setBalance(balance + win);

//     setBetPlaced(false);
//     setStatus("crash");
//   };

//   // ============================
//   // RESET AFTER CRASH
//   // ============================
//   useEffect(() => {
//     if (status === "crash") {
//       setTimeout(() => {
//         setMultiplier(1);
//         setStatus("waiting");
//         setBetPlaced(false);
//       }, 2500);
//     }
//   }, [status]);

//   return (
//   <div className="w-full min-h-screen bg-[#0f172a] text-white p-6 flex justify-center">
//     <div className="w-[900px]">

//       {/* ================= TOP MULTIPLIER CHIPS ================= */}
//       <div className="flex gap-3 mb-6">
//         {[29.34, 15.84, 3.65, 2.37].map((m, i) => (
//           <span
//             key={i}
//             className="px-5 py-2 rounded-full bg-[#22c55e] text-black font-bold shadow-md"
//           >
//             {m}×
//           </span>
//         ))}
//       </div>

//       {/* ================= CRASH GRAPH CARD ================= */}
//       <div className="bg-[#1e293b] rounded-xl p-4 shadow-xl relative">
//         <div className="relative w-full h-[360px]">
//           <canvas
//             ref={canvasRef}
//             className="rounded-xl bg-[#0b1120] w-full h-full"
//           ></canvas>

//           {/* live multiplier */}
//           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold drop-shadow-lg">
//             {multiplier}x
//           </div>

//           {/* network status */}
//           <div className="absolute right-3 bottom-3 flex items-center gap-2 text-xs opacity-70">
//             <span className="w-2 h-2 bg-green-400 rounded-full"></span>
//             Network Stable
//           </div>

//           {/* total players */}
//           <div className="absolute right-3 top-3 text-sm opacity-70">
//             Total: 8k
//           </div>
//         </div>
//       </div>

//       {/* ================= BET PANEL ================= */}
//       <div className="bg-[#1e293b] rounded-xl p-5 mt-5 shadow-xl">
//         <button
//           onClick={() => (betPlaced ? cashout() : placeBet())}
//           className={`
//             w-full py-3 text-lg font-semibold rounded-lg mb-4 
//             transition-all 
//             ${betPlaced ? "bg-green-500" : "bg-[#22c55e] text-black hover:bg-green-400"}
//           `}
//         >
//           {betPlaced ? "CASHOUT" : status === "waiting" ? "Bet (Next Round)" : "Bet"}
//         </button>

//         {/* ============= Bet Inputs ============= */}
//         <div className="grid grid-cols-2 gap-4">

//           {/* BET AMOUNT */}
//           <div>
//             <label className="uppercase text-xs opacity-70">Bet Amount</label>
//             <div className="flex items-center mt-1 bg-[#0f172a] p-2 rounded-lg">
//               <input
//                 type="number"
//                 value={betAmount}
//                 onChange={(e) => setBetAmount(Number(e.target.value))}
//                 className="bg-transparent flex-1 focus:outline-none"
//               />
//               <button
//                 onClick={() => setBetAmount(betAmount / 2)}
//                 className="px-3 py-1 bg-[#1e293b] rounded mx-1"
//               >
//                 ½
//               </button>
//               <button
//                 onClick={() => setBetAmount(betAmount * 2)}
//                 className="px-3 py-1 bg-[#1e293b] rounded"
//               >
//                 2×
//               </button>
//             </div>
//           </div>

//           {/* AUTO CASHOUT */}
//           <div>
//             <label className="uppercase text-xs opacity-70">Cashout At</label>
//             <div className="flex items-center mt-1 bg-[#0f172a] p-2 rounded-lg">
//               <input
//                 type="number"
//                 value={autoCashout || ""}
//                 onChange={(e) => setAutoCashout(parseFloat(e.target.value))}
//                 className="bg-transparent flex-1 focus:outline-none"
//               />
//             </div>
//           </div>
//         </div>

//         {/* PROFIT */}
//         <div className="mt-4">
//           <label className="uppercase text-xs opacity-70">Profit on Win</label>
//           <div className="bg-[#0f172a] p-2 rounded-lg mt-1">
//             ${(betAmount * multiplier).toFixed(2)}
//           </div>
//         </div>

//         {/* PLAYER LIST & BALANCE */}
//         <div className="flex justify-between items-center mt-4">

//           {/* Fake player count */}
//           <div className="flex items-center gap-2 opacity-70">
//             <span className="text-xl">👥</span>
//             <span>225 players</span>
//           </div>

//           {/* BALANCE */}
//           <div className="flex items-center gap-2 opacity-80">
//             <span className="text-xl">🪙</span>
//             <span>${balance.toFixed(2)}</span>
//           </div>
//         </div>

//         {/* MANUAL / AUTO TABS */}
//         <div className="flex mt-6 gap-3">
//           <button className="w-full bg-[#0f172a] py-2 rounded-lg text-lg">
//             Manual
//           </button>
//           <button className="w-full bg-[#0f172a] py-2 rounded-lg text-lg opacity-60">
//             Auto
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// }
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * CrashGame.tsx
 * Single-file React + TypeScript component that implements a frontend-only Crash game.
 * - Tailwind CSS for styling
 * - Framer Motion for smooth multiplier animation
 * - Auto-cashout at 1x enabled by default ("like 1x bet")
 *
 * Usage: drop this file into a Next.js / React project and import it in a page.
 * Tailwind must be configured in the project for styling to work.
 */

type RoundState = "idle" | "countdown" | "running" | "finished";

const RNG = (seed = Math.random()) => {
  // simple pseudo RNG wrapper for repeatability if needed
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
};

export default function CrashGame() {
  const [balance, setBalance] = useState<number>(1000);
  const [bet, setBet] = useState<number>(10);
  const [autoCashout1x, setAutoCashout1x] = useState<boolean>(true);
  const [isBetPlaced, setIsBetPlaced] = useState<boolean>(false);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.0);
  const [roundState, setRoundState] = useState<RoundState>("idle");
  const [message, setMessage] = useState<string>("");
  const [roundResult, setRoundResult] = useState<number | null>(null);

  const tickRef = useRef<number | null>(null);
  const startTsRef = useRef<number | null>(null);
  const crashAtRef = useRef<number>(0);
  const rng = useMemo(() => RNG(Math.random()), []);

  // Generate a random crash multiplier for each run.
  function generateCrashMultiplier() {
    // Using a simple provably-fair-like formula: curve = floor(100 * (1 / (1 - r))) / 100
    // But cap it reasonably and add some distribution skew so many rounds crash near 1.0.
    const r = rng();
    // produce more 1.x outcomes: stretch r
    const skewed = Math.pow(r, 3); // more small values
    const mult = Math.max(1.00, Math.round((1 + skewed * 30) * 100) / 100); // 1.00 -> up to ~31x
    return mult;
  }

  useEffect(() => {
    // cleanup on unmount
    return () => {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
    };
  }, []);

  function placeBet() {
    if (bet <= 0) {
      setMessage("Bet must be greater than 0");
      return;
    }
    if (bet > balance) {
      setMessage("Not enough balance");
      return;
    }
    setIsBetPlaced(true);
    setMessage("Bet placed: " + bet.toFixed(2));
  }

  function startRound() {
    if (roundState !== "idle") return;
    // if bet placed, deduct funds now (typical for these games)
    if (isBetPlaced) setBalance((b) => +(b - bet).toFixed(2));

    // prepare round
    setRoundResult(null);
    setCurrentMultiplier(1.0);
    setRoundState("countdown");
    setMessage("Get ready...");

    // countdown for 3 seconds
    setTimeout(() => {
      crashAtRef.current = generateCrashMultiplier();
      setRoundState("running");
      setMessage("Running — cashout before crash!");
      startTsRef.current = performance.now();
      runTicker();
    }, 3000);
  }

  function runTicker() {
    // stop existing
    if (tickRef.current) cancelAnimationFrame(tickRef.current);

    const start = performance.now();
    startTsRef.current = start;

    function frame(now: number) {
      const t = (now - (startTsRef.current ?? start)) / 1000; // seconds
      // multiplier grows exponentially-ish: m(t) = 1.0 + 0.2 * e^(t * speed)
      // tuned to feel like a Crash game
      const speed = 0.9; // tweak for pace
      const m = Math.max(1, +(1.0 + 0.25 * Math.exp(t * speed)).toFixed(2));
      setCurrentMultiplier(m);

      // auto crash
      if (m >= crashAtRef.current) {
        // crashed
        finishRound(crashAtRef.current);
        return;
      }

      // auto cashout at 1x option
      if (autoCashout1x && isBetPlaced && m >= 1.0 && roundState === "running") {
        // If the user opted auto-cashout at 1x we cash them out immediately (this makes it like 1x bet)
        // cashing at multiplier 1.0 returns bet (no profit) — but we deduct earlier so we must return bet
        cashout(1.0);
        return;
      }

      tickRef.current = requestAnimationFrame(frame);
    }

    tickRef.current = requestAnimationFrame(frame);
  }

  function cashout(mult: number) {
    if (!isBetPlaced) return;
    // payout = bet * mult
    const payout = +(bet * mult).toFixed(2);
    setBalance((b) => +(b + payout).toFixed(2));
    setMessage(`Cashed out at ${mult.toFixed(2)}x — payout ${payout.toFixed(2)}`);
    setRoundResult(mult);
    setIsBetPlaced(false);
    setRoundState("finished");
    if (tickRef.current) cancelAnimationFrame(tickRef.current);
  }

  function finishRound(crashMult: number) {
    // round crashed at crashMult
    setMessage(`Crashed at ${crashMult.toFixed(2)}x`);
    setRoundResult(null);
    setIsBetPlaced(false);
    setRoundState("finished");
    setCurrentMultiplier(crashMult);
    if (tickRef.current) cancelAnimationFrame(tickRef.current);
  }

  function quickBet(amount: number) {
    setBet((_) => Math.max(0.01, amount));
  }

  function resetRound() {
    setRoundState("idle");
    setMessage("");
    setRoundResult(null);
    setCurrentMultiplier(1);
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white/90 dark:bg-slate-900/80 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Crash — frontend demo</h2>
          <p className="text-sm text-muted-foreground">Auto-cashout at 1x is on by default ("like 1x bet").</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Balance</div>
          <div className="font-mono text-lg">${balance.toFixed(2)}</div>
        </div>
      </div>

      {/* Visual multiplier + curve area */}
      <div className="w-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">Round state: <span className="font-semibold">{roundState}</span></div>
          <div className="text-sm text-gray-500">Crash target: <span className="font-semibold">{crashAtRef.current ? crashAtRef.current.toFixed(2) + 'x' : '—'}</span></div>
        </div>

        <div className="flex items-center justify-center h-36">
          <motion.div
            animate={{ scale: 1 }}
            className="text-center"
          >
            <div className="text-4xl font-bold font-mono">{currentMultiplier.toFixed(2)}x</div>
            <div className="text-xs text-gray-500 mt-1">{message}</div>
          </motion.div>
        </div>

        {/* Simple SVG curve preview */}
        <div className="mt-4 h-24 w-full">
          <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#0ea5e9"
              strokeWidth={0.6}
              points={generateCurvePoints(currentMultiplier)}
            />
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
          <div className="text-xs text-gray-500 mb-2">Bet amount</div>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            className="w-full p-2 rounded-md border"
          />

          <div className="flex gap-2 mt-2">
            <button onClick={() => quickBet(1)} className="px-3 py-1 rounded bg-gray-100">$1</button>
            <button onClick={() => quickBet(5)} className="px-3 py-1 rounded bg-gray-100">$5</button>
            <button onClick={() => quickBet(10)} className="px-3 py-1 rounded bg-gray-100">$10</button>
            <button onClick={() => quickBet(balance)} className="px-3 py-1 rounded bg-gray-100">All</button>
          </div>

          <div className="flex items-center gap-2 mt-3 text-sm">
            <input id="auto1x" checked={autoCashout1x} onChange={(e) => setAutoCashout1x(e.target.checked)} type="checkbox" />
            <label htmlFor="auto1x">Auto cashout at 1x</label>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg flex flex-col justify-between">
          <div>
            <div className="text-xs text-gray-500">Actions</div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={placeBet}
                disabled={isBetPlaced}
                className="px-4 py-2 rounded bg-emerald-500 text-white disabled:opacity-50"
              >
                Place Bet
              </button>

              <button
                onClick={() => startRound()}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Start Round
              </button>

              <button
                onClick={() => {
                  if (isBetPlaced && roundState === "running") cashout(currentMultiplier);
                }}
                disabled={!isBetPlaced || roundState !== "running"}
                className="px-4 py-2 rounded bg-yellow-400 text-black disabled:opacity-50"
              >
                Cashout
              </button>

              <button onClick={resetRound} className="px-3 py-2 rounded bg-gray-200">Reset</button>
            </div>
          </div>

          <div className="mt-3 text-sm">
            <div>Last result: <span className="font-mono">{roundResult ? `${roundResult.toFixed(2)}x` : '—'}</span></div>
          </div>
        </div>
      </div>

    </div>
  );
}

// Helper: create a simple chain of points for SVG polyline so the curve shape changes with multiplier
function generateCurvePoints(mult: number) {
  // We'll create 20 points across the X axis. The Y value will be inversely related to the multiplier so it "rises".
  const pts: string[] = [];
  const maxDisplay = Math.min(mult, 10); // cap for visual scale
  for (let i = 0; i <= 20; i++) {
    const x = (i / 20) * 100;
    // y in range 18 (bottom) to 2 (top)
    const progress = i / 20;
    const y = 18 - Math.pow(progress, 1.2) * (Math.log(1 + maxDisplay) * 5);
    pts.push(`${x},${Math.max(2, Math.min(18, y))}`);
  }
  return pts.join(" ");
}
