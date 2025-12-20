
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const LANES = 4;
const MULTIPLIERS = [1.15, 1.37, 1.64, 2.0];

const VEHICLES = [
  { src: "/games/chicken/red-car.svg", speed: 2.4 },
  { src: "/games/chicken/taxi.svg", speed: 3 },
  { src: "/games/chicken/truck.svg", speed: 1.9 },
  { src: "/games/chicken/f1.svg", speed: 4.2 },
  { src: "/games/chicken/police.svg", speed: 3.1 },
];

const LANE_X_START = 180;   // where road starts
const LANE_WIDTH = 120;
const CHICKEN_Y = 320;
const MIN_VEHICLE_GAP = 140; // prevents overlap
const CHICKEN_X_OFFSET = -10; // move left
const CHICKEN_Y_OFFSET = -165; // move up

// -----------------------------
// TYPES
// -----------------------------
type MovingVehicle = {
  id: number;
  src: string;
  lane: number;
  y: number;
  speed: number;
};

export default function ChickenRoadExact() {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [vehicles, setVehicles] = useState<MovingVehicle[]>([]);

  const start = () => {
    if (bet > balance || bet <= 0) return;

    setBalance((b) => b - bet);
    setStep(0);
    setCrashed(false);
    setRunning(true);

    // spawn vehicles with safe spacing
    const spawned: MovingVehicle[] = Array.from({ length: 3 }).map((_, i) => {
      const v = VEHICLES[Math.floor(Math.random() * VEHICLES.length)];
      return {
        id: i,
        src: v.src,
        speed: v.speed,
        lane: Math.floor(Math.random() * LANES),
        y: -i * MIN_VEHICLE_GAP - 100,
      };
    });

    setVehicles(spawned);
  };

  const jump = () => {
    if (!running) return;
    const next = step + 1;
    setStep(next);
    if (next === LANES) cashout(next);
  };

  const cashout = (s = step) => {
    const win = bet * MULTIPLIERS[s - 1];
    setBalance((b) => b + win);
    setRunning(false);
  };

  // -----------------------------
  // VEHICLE MOVEMENT + COLLISION
  // -----------------------------
  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          let newY = v.y + v.speed;

          if (newY > 460) {
            // pick lane with spacing safety
            const usedLanes = prev.map((p) => p.lane);
            const freeLanes = Array.from({ length: LANES }, (_, i) => i).filter(
              (l) => !usedLanes.includes(l)
            );

            return {
              ...v,
              lane:
                freeLanes[Math.floor(Math.random() * freeLanes.length)] ??
                Math.floor(Math.random() * LANES),
              y: -MIN_VEHICLE_GAP,
            };
          }

          // collision check
          const chickenX = 40 + step * 140;
          const vehicleX = LANE_X_START + v.lane * LANE_WIDTH;

          const hitX = Math.abs(chickenX - vehicleX) < 60;
          const hitY = Math.abs(CHICKEN_Y - newY) < 45;

          if (hitX && hitY) {
            setCrashed(true);
            setRunning(false);
          }

          return { ...v, y: newY };
        })
      );
    }, 16);

    return () => clearInterval(id);
  }, [running, step]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1c26]">
      <Card className="w-[760px] p-4 rounded-2xl bg-[#0e2533] text-white">
        <div className="flex justify-between mb-3">
          <span>Balance</span>
          <span className="font-bold">${balance.toFixed(2)}</span>
        </div>

        {/* ROAD */}
        <div className="relative h-[570px] bg-[#081822] rounded-xl overflow-hidden">
          <img
            src="/games/chicken/start.svg"
            className="absolute left-0 top-0 h-full z-0"
          />

          {/* LANE DIVIDERS */}
       {/* LANE DIVIDERS (VERTICAL, EVEN WIDTH) */}
{Array.from({ length: LANES - 1 }).map((_, i) => (
  <div
    key={i}
    className="absolute border-l border-dashed border-white/25"
    style={{
      left: LANE_X_START + (i + 1) * LANE_WIDTH,
      top: 0,
      bottom: 0,
    }}
  />
))}



          {/* VEHICLES */}
          {vehicles.map((v) => (
            <img
              key={v.id}
              src={v.src}
              className="absolute w-28 z-10"
              style={{
                left: `${LANE_X_START + v.lane * LANE_WIDTH}px`,
                top: v.y,
              }}
            />
          ))}

          {/* CHICKEN */}
          <motion.img
  src="/games/chicken/chicken.png"
  className="absolute w-30 z-20"
  animate={{
    x:
      step === 0
        ? 40 + CHICKEN_X_OFFSET
        : LANE_X_START +
          (step - 1) * LANE_WIDTH +
          LANE_WIDTH / 2 -
          32 +
          CHICKEN_X_OFFSET,
    y: CHICKEN_Y_OFFSET,
  }}
  transition={{ type: "spring", stiffness: 260 }}
  style={{ bottom: 40 }}
/>


          {crashed && (
            <div className="absolute inset-0 bg-red-600/50 flex items-center justify-center text-2xl font-bold z-30">
              💥 CRASHED
            </div>
          )}
        </div>

        {/* MULTIPLIERS */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {MULTIPLIERS.map((m, i) => (
            <div
              key={i}
              className={`rounded-lg py-2 text-center font-semibold transition-all ${
                step === i + 1 ? "bg-green-500" : "bg-[#132f40]"
              }`}
            >
              {m.toFixed(2)}x
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="mt-4 space-y-2">
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(+e.target.value)}
            className="w-full p-2 rounded bg-[#132f40]"
            disabled={running}
          />

          {!running ? (
            <Button className="w-full" onClick={start}>
              Start
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={jump}>Jump</Button>
              <Button variant="secondary" onClick={() => cashout()}>
                Cash Out
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
