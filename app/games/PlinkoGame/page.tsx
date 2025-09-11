"use client";
import React, { useEffect, useRef, useState } from "react";
import * as Matter from "matter-js";
const { Engine, Render, Runner, Bodies, Composite, Body, Events } = Matter;
import { motion } from "framer-motion";
import { Play, RotateCcw, Coins } from "lucide-react";

// --- Utility types
interface SlotDef {
  x: number; // left edge
  width: number;
  multiplier: number;
}

// --- Default exportable component
export default function PlinkoGame() {
  // Dimensions for the board canvas
  const BOARD_W = 420;
  const BOARD_H = 680;

  // Peg layout
  const ROWS = 12; // number of rows of pegs
  const PEG_R = 4.5;
  const ROW_SPACING = 48;
  const COL_SPACING = 32;
  const TOP_OFFSET = 80; // space at top for ball spawn
  const SIDE_PADDING = 28; // left/right padding to walls

  // Slots (bins) setup — symmetric multipliers
  const multipliers = React.useMemo(() => [0.5, 1, 1.5, 2, 5, 2.5, 2, 1.5, 1, 0.5], []);
  const SLOT_COUNT = multipliers.length;

  // UI state
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [entryX, setEntryX] = useState(BOARD_W / 2);
  const [dropping, setDropping] = useState(false);
  const [lastWin, setLastWin] = useState<number | null>(null);

  const sceneRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const renderRef = useRef<Render | null>(null);
  const runnerRef = useRef<Runner | null>(null);
  const ballRef = useRef<Body | null>(null);
  const worldRef = useRef<Matter.World | null>(null);

  // Build the physics world once
  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Engine.create({ enableSleeping: true });
    engine.gravity.y = 1.0; // gravity strength
    const world = engine.world;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine,
      options: {
        width: BOARD_W,
        height: BOARD_H,
        background: "transparent",
        wireframes: false,
        pixelRatio: typeof window !== "undefined" ? window.devicePixelRatio : 1,
      },
    });

    // Add walls
    const thickness = 40;
    const leftWall = Bodies.rectangle(SIDE_PADDING - thickness / 2, BOARD_H / 2, thickness, BOARD_H, {
      isStatic: true,
      render: { fillStyle: "#0f172a" },
    });
    const rightWall = Bodies.rectangle(BOARD_W - SIDE_PADDING + thickness / 2, BOARD_H / 2, thickness, BOARD_H, {
      isStatic: true,
      render: { fillStyle: "#0f172a" },
    });
    const floor = Bodies.rectangle(BOARD_W / 2, BOARD_H - 20, BOARD_W, 40, {
      isStatic: true,
      render: { fillStyle: "#0f172a" },
    });

    Composite.add(world, [leftWall, rightWall, floor]);

    // Create pegs grid
    const pegs: Body[] = [];
    const usableW = BOARD_W - SIDE_PADDING * 2;
    const colsMax = Math.floor(usableW / COL_SPACING);

    for (let row = 0; row < ROWS; row++) {
      const y = TOP_OFFSET + row * ROW_SPACING;
      const isOffset = row % 2 === 1;
      const cols = colsMax - (isOffset ? 1 : 0);
      for (let c = 0; c < cols; c++) {
        const x = SIDE_PADDING + (isOffset ? COL_SPACING / 2 : 0) + c * COL_SPACING;
        const peg = Bodies.circle(x, y, PEG_R, {
          isStatic: true,
          restitution: 0.5,
          friction: 0.02,
          render: { fillStyle: "#94a3b8" },
        });
        pegs.push(peg);
      }
    }
    Composite.add(world, pegs);

    // Create slot dividers and compute slots
    const slots: SlotDef[] = [];
    const slotAreaTop = TOP_OFFSET + ROWS * ROW_SPACING + 40;
    const slotAreaH = BOARD_H - slotAreaTop - 40;
    const slotWidth = (BOARD_W - SIDE_PADDING * 2) / SLOT_COUNT;

    for (let i = 0; i <= SLOT_COUNT; i++) {
      const x = SIDE_PADDING + i * slotWidth;
      // Divider
      const divider = Bodies.rectangle(x, slotAreaTop + slotAreaH / 2, 6, slotAreaH, {
        isStatic: true,
        chamfer: { radius: 3 },
        render: { fillStyle: "#0f172a" },
      });
      Composite.add(world, divider);

      if (i < SLOT_COUNT) {
        slots.push({ x, width: slotWidth, multiplier: multipliers[i] });
      }
    }

    // Bouncy floor just above the actual floor to help settle balls
    const settle = Bodies.rectangle(BOARD_W / 2, BOARD_H - 60, BOARD_W - SIDE_PADDING * 2, 10, {
      isStatic: true,
      chamfer: { radius: 5 },
      render: { fillStyle: "#0f172a" },
    });
    Composite.add(world, settle);

    // Store refs
    engineRef.current = engine;
    worldRef.current = world;
    renderRef.current = render;

    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Win detection loop
    const onAfterUpdate = () => {
      const ball = ballRef.current;
      if (!ball) return;

      const isLow = ball.position.y > BOARD_H - 100;
      const speed = Math.hypot(ball.velocity.x, ball.velocity.y);
      const isSlow = speed < 0.35;
      if (isLow && isSlow) {
        // Determine slot index by x
        const localX = Math.min(Math.max(ball.position.x, SIDE_PADDING + 1), BOARD_W - SIDE_PADDING - 1);
        const idx = Math.min(
          SLOT_COUNT - 1,
          Math.max(0, Math.floor((localX - SIDE_PADDING) / slotWidth))
        );
        const mult = slots[idx].multiplier;
        // Update balance and clean up
        setBalance((prevBalance) => prevBalance + Math.round(bet * mult));
        console.log('Ball landed in slot with multiplier:', mult, 'Payout:', Math.round(bet * mult));
        setLastWin(mult);
        setDropping(false);
        // Remove ball
        Composite.remove(world, ball);
        ballRef.current = null;
      }
    };

    Events.on(engine, "afterUpdate", onAfterUpdate);

    // Cleanup on unmount
    return () => {
      Events.off(engine, "afterUpdate", onAfterUpdate);
      if (renderRef.current) {
        Render.stop(renderRef.current);
   
        renderRef.current.canvas.remove();
        
        renderRef.current.textures = {};
      }
      if (runnerRef.current) Runner.stop(runnerRef.current);
      if (engineRef.current) Engine.clear(engineRef.current);
      engineRef.current = null;
      renderRef.current = null;
      runnerRef.current = null;
      worldRef.current = null;
      ballRef.current = null;
    };
  }, []);

  // Drop a ball
  const drop = () => {
    console.log('Drop function called');
    if (dropping) {
      console.log('Already dropping, returning');
      return;
    }
    if (bet <= 0 || bet > balance) {
      console.log('Invalid bet amount:', bet, 'Balance:', balance);
      return;
    }
    if (!worldRef.current) {
      console.log('World not initialized');
      return;
    }

    console.log('Creating ball at position:', entryX);
    setBalance((b) => b - bet);
    setDropping(true);
    setLastWin(null);

    const spawnX = Math.min(Math.max(entryX, SIDE_PADDING + 20), BOARD_W - SIDE_PADDING - 20);
    console.log('Spawn position:', spawnX);

    const ball = Bodies.circle(spawnX, 24, 8, {
      restitution: 0.35,
      friction: 0.002,
      frictionAir: 0.001,
      density: 0.002,
      render: { fillStyle: "#22d3ee" },
    });

    console.log('Ball created:', ball);

    // Small random nudge for natural variation
    Body.setVelocity(ball, { x: (Math.random() - 0.5) * 0.5, y: 0 });

    Composite.add(worldRef.current, ball);
    ballRef.current = ball;
    
    console.log('Ball added to world');
  };

  const reset = () => {
    // remove ball if exists
    if (worldRef.current && ballRef.current) {
      Composite.remove(worldRef.current, ballRef.current);
      ballRef.current = null;
    }
    setDropping(false);
    setLastWin(null);
  };

  const chipValues = [1, 5, 10, 25, 50, 100, 250];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-slate-100 flex items-center justify-center py-10">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="grid lg:grid-cols-[auto_400px] gap-8 w-full max-w-7xl px-4 relative z-10">
        {/* Game Card */}
        <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-700/50 relative overflow-hidden">
          {/* Card background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between px-2 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Plinko</h1>
              </div>
              <div className="flex items-center gap-3 bg-slate-900/50 rounded-xl px-4 py-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-slate-300">Balance:</span>
                <span className="font-bold text-yellow-400">${balance.toLocaleString()}</span>
              </div>
            </div>

            {/* Board wrapper */}
            <div className="relative mx-auto rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-slate-700/50 w-[460px] h-[720px] overflow-hidden shadow-2xl">
              {/* Board background effects */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/3 to-pink-500/5" />
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)`,
              }} />

            {/* Canvas mount */}
            <div ref={sceneRef} className="absolute inset-0" />

            {/* Slot labels */}
            <SlotLabels
              width={BOARD_W}
              sidePadding={SIDE_PADDING}
              slotCount={SLOT_COUNT}
              multipliers={multipliers}
              top={TOP_OFFSET + ROWS * ROW_SPACING + 40}
            />

            {/* Entry indicator */}
            <div
              className="absolute top-2 -translate-x-1/2 z-20"
              style={{ left: `${entryX + 20}px` }}
            >
              <motion.div
                className="flex flex-col items-center"
                animate={{ y: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg" />
                <div className="w-0.5 h-4 bg-gradient-to-b from-cyan-400 to-transparent mt-0.5" />
              </motion.div>
            </div>
          </div>
          </div>

          {/* Multipliers display */}
          <div className="mt-4 px-2">
            <div className="text-xs text-slate-400 mb-2 text-center">Multipliers</div>
            <div className="flex justify-between">
              {multipliers.map((mult, i) => (
                <div
                  key={i}
                  className={
                    "px-1.5 py-0.5 rounded text-xs font-bold " +
                    (mult >= 5
                      ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                      : mult >= 2
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : mult >= 1
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30")
                  }
                >
                  {mult}x
                </div>
              ))}
            </div>
          </div>

          {/* Entry slider */}
          <div className="mt-4">
            <label className="text-xs uppercase tracking-wide text-slate-400 mb-2 block">Entry Position: {Math.round(((entryX - SIDE_PADDING) / (BOARD_W - SIDE_PADDING * 2)) * 100)}%</label>
            <div className="relative">
              <input
                type="range"
                min={SIDE_PADDING}
                max={BOARD_W - SIDE_PADDING}
                value={entryX}
                onChange={(e) => setEntryX(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
                style={{
                  background: `linear-gradient(to right, 
                    #14b8a6 0%, 
                    #14b8a6 ${((entryX - SIDE_PADDING) / (BOARD_W - SIDE_PADDING * 2)) * 100}%, 
                    #374151 ${((entryX - SIDE_PADDING) / (BOARD_W - SIDE_PADDING * 2)) * 100}%, 
                    #374151 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Left</span>
              <span>Center</span>
              <span>Right</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-700/50 relative overflow-hidden">
          {/* Card background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500" />
          
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Bet Controls</h2>

            {/* Quick bet buttons */}
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-300 mb-3 block">Quick Bet</label>
              <div className="grid grid-cols-4 gap-2">
                {chipValues.map((v) => (
                  <button
                    key={v}
                    onClick={() => setBet(v)}
                    className={
                      "px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 " +
                      (bet === v
                        ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105"
                        : "bg-slate-900/60 border border-slate-700 text-slate-200 hover:border-slate-600 hover:bg-slate-800/80")
                    }
                  >
                    ${v}
                  </button>
                ))}
              </div>
            </div>

            {/* Bet amount input */}
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-300 mb-3 block">Bet Amount</label>
              <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-1 flex">
                <div className="flex-1 flex items-center px-3">
                  <span className="text-slate-400 mr-2">$</span>
                  <input
                    type="number"
                    value={bet}
                    onChange={(e) => setBet(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
                    className="bg-transparent text-slate-100 font-medium text-lg w-full outline-none"
                    min={1}
                  />
                </div>
                <div className="flex gap-1">
                  <button
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                    onClick={() => setBet((b) => Math.max(1, Math.floor(b / 2)))}
                  >
                    1/2
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                    onClick={() => setBet((b) => Math.max(1, Math.floor(b * 2)))}
                  >
                    2x
                  </button>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={drop}
                disabled={dropping || bet <= 0 || bet > balance}
                className={
                  "flex items-center justify-center gap-3 rounded-2xl px-6 py-4 font-bold text-lg shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed " +
                  (dropping || bet > balance
                    ? "bg-slate-700 text-slate-400"
                    : "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 hover:shadow-xl hover:scale-105")
                }
              >
                <Play className="w-5 h-5" />
                {dropping ? "Dropping..." : "Drop Ball"}
              </button>
              <button
                onClick={reset}
                className="flex items-center justify-center gap-3 rounded-2xl px-6 py-4 font-bold text-lg bg-slate-900/60 border-2 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800/80 transition-all duration-200"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>

            {/* Result panel */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-2xl border border-slate-700/50 p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-300">Last Result</h3>
                {lastWin !== null && (
                  <div className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400">
                    ${Math.round(bet * lastWin)}
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold tracking-tight">
                {dropping && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <span className="text-slate-400">Dropping...</span>
                  </div>
                )}
                {!dropping && lastWin == null && <span className="text-slate-500">—</span>}
                {!dropping && lastWin != null && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <span className={lastWin >= 2 ? "text-emerald-400" : lastWin >= 1 ? "text-blue-400" : "text-red-400"}>
                      {lastWin}x
                    </span>
                    <div className={
                      "px-3 py-1 rounded-lg text-sm font-medium " +
                      (lastWin >= 2 ? "bg-emerald-500/20 text-emerald-300" : lastWin >= 1 ? "bg-blue-500/20 text-blue-300" : "bg-red-500/20 text-red-300")
                    }>
                      {lastWin >= 1 ? "WIN" : "LOSS"}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="text-xs text-slate-500 space-y-1">
              <p>• Adjust entry position with the slider above</p>
              <p>• Higher multipliers are harder to hit</p>
              <p>• Physics simulation creates realistic ball movement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlotLabels({
  width,
  sidePadding,
  slotCount,
  multipliers,
  top,
}: {
  width: number;
  sidePadding: number;
  slotCount: number;
  multipliers: number[];
  top: number;
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-10" style={{ height: '80px' }}>
      <div className="flex h-full" style={{ marginLeft: sidePadding, width: width - sidePadding * 2 }}>
        {Array.from({ length: slotCount }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-center relative">
            {/* Multiplier display */}
            <div
              className={
                "px-2 py-1 rounded-lg text-xs font-bold border-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 " +
                (multipliers[i] >= 5
                  ? "bg-gradient-to-br from-yellow-500/30 to-orange-500/20 text-yellow-200 border-yellow-400/70 shadow-yellow-500/25"
                  : multipliers[i] >= 2
                  ? "bg-gradient-to-br from-emerald-500/30 to-green-500/20 text-emerald-200 border-emerald-400/70 shadow-emerald-500/25"
                  : multipliers[i] >= 1
                  ? "bg-gradient-to-br from-blue-500/30 to-indigo-500/20 text-blue-200 border-blue-400/70 shadow-blue-500/25"
                  : "bg-gradient-to-br from-red-500/30 to-rose-500/20 text-red-200 border-red-400/70 shadow-red-500/25")
              }
              style={{ minWidth: 36, textAlign: "center" }}
            >
              {multipliers[i]}x
            </div>
            {/* Slot indicator dot */}
            <div className="mt-1 w-1.5 h-1.5 bg-slate-400 rounded-full opacity-60"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
