
"use client";
import { useState } from "react";

type DifficultyLevel = "Easy" | "Medium" | "Hard";

const DIFFICULTY_SETTINGS: Record<DifficultyLevel, { 
  maxMultiplier: number; 
  popChanceBase: number; 
  popChanceIncrease: number;
  millSvg: string;
  millBalloonSvg: string;
  multipliers: number[];
}> = {
  Easy: { 
    maxMultiplier: 50, 
    popChanceBase: 0.01, 
    popChanceIncrease: 0.008,
    millSvg: "/games/pump/easymill.svg",
    millBalloonSvg: "/games/pump/easymillballon.svg",
    multipliers: [1.00, 1.11, 1.23, 1.37, 1.52, 1.69, 1.88, 2.09, 2.33, 2.59, 2.88, 3.21]
  },
  Medium: { 
    maxMultiplier: 100, 
    popChanceBase: 0.02, 
    popChanceIncrease: 0.015,
    millSvg: "/games/pump/medium.svg",
    millBalloonSvg: "/games/pump/mediummillballon.svg",
    multipliers: [1.00, 1.23, 1.55, 1.98, 2.56, 3.36, 4.48, 6.05, 8.31, 11.54, 16.22, 23.09]
  },
  Hard: { 
    maxMultiplier: 200, 
    popChanceBase: 0.03, 
    popChanceIncrease: 0.025,
    millSvg: "/games/pump/hard.svg",
    millBalloonSvg: "/games/pump/hardmillballon.svg",
    multipliers: [1.00, 1.37, 1.98, 2.96, 4.69, 8.13, 15.36, 32.00, 75.52, 201.39, 645.12, 2580.48]
  },
};

export default function PumpGame() {
  const [betAmount, setBetAmount] = useState("0.00");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Hard");
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [multiplier, setMultiplier] = useState(1.0);
  const [profit, setProfit] = useState(0);
  const [balloonSize, setBalloonSize] = useState(1.0);
  const [isAnimating, setIsAnimating] = useState(false);

  const settings = DIFFICULTY_SETTINGS[difficulty];

  const startGame = () => {
    const bet = parseFloat(betAmount) || 0;
    if (bet <= 0) return;
    
    setGameState("playing");
    setMultiplier(1.0);
    setProfit(0);
    setBalloonSize(1.0);
  };

  const pump = () => {
    if (gameState !== "playing" || isAnimating) return;
    
    setIsAnimating(true);
    
    // Calculate pop chance
    const popChance = settings.popChanceBase + (multiplier - 1.0) * settings.popChanceIncrease;
    const willPop = Math.random() < popChance;
    
    if (willPop) {
      // Balloon pops!
      setGameState("lost");
      setBalloonSize(0);
      setTimeout(() => setIsAnimating(false), 500);
    } else {
      // Animate: First expand slightly, then return to normal
      setBalloonSize(1.15);
      
      setTimeout(() => {
        setBalloonSize(1.0);
        const newMultiplier = multiplier + 0.1;
        setMultiplier(newMultiplier);
        
        const bet = parseFloat(betAmount) || 0;
        setProfit(bet * (newMultiplier - 1.0));
        
        setTimeout(() => setIsAnimating(false), 200);
      }, 150);
    }
  };

  const cashOut = () => {
    if (gameState !== "playing") return;
    setGameState("won");
  };

  const reset = () => {
    setGameState("idle");
    setMultiplier(1.0);
    setProfit(0);
    setBalloonSize(1.0);
  };

  return (
    <div className="min-h-screen bg-[#0b1f2a] flex">
      
      {/* Left Panel - Controls */}
      <div className="w-72 bg-[#0d2433] p-6 space-y-4 shadow-2xl border-r border-[#1a3a4a]">
        
        {/* Manual/Auto Toggle */}
        <div className="flex gap-2 bg-[#0a1721] rounded-lg p-1">
          <button className="flex-1 py-2 rounded-md bg-[#1e4057] text-white font-semibold text-sm">
            Manual
          </button>
          <button className="flex-1 py-2 rounded-md text-gray-400 font-semibold text-sm hover:text-white transition">
            Auto
          </button>
        </div>

        {/* Bet Amount */}
        <div>
          <label className="text-gray-400 text-xs mb-2 block">Bet Amount</label>
          <div className="flex items-center gap-2 bg-[#0a1721] rounded-lg p-3 border border-[#1a3a4a]">
            <input
              type="text"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              disabled={gameState === "playing"}
              className="flex-1 bg-transparent text-white outline-none"
              placeholder="0.00"
            />
            <span className="text-gray-500 text-sm">BTC</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">≈ 0.00000000 BTC</div>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => setBetAmount((parseFloat(betAmount) / 2 || 0).toFixed(8))}
              className="flex-1 py-2 bg-[#0a1721] hover:bg-[#1a3a4a] rounded text-white text-sm font-medium transition"
            >
              ½
            </button>
            <button 
              onClick={() => setBetAmount((parseFloat(betAmount) * 2 || 0).toFixed(8))}
              className="flex-1 py-2 bg-[#0a1721] hover:bg-[#1a3a4a] rounded text-white text-sm font-medium transition"
            >
              2×
            </button>
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="text-gray-400 text-xs mb-2 block">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
            disabled={gameState === "playing"}
            className="w-full bg-[#0a1721] text-white rounded-lg p-3 outline-none border border-[#1a3a4a] cursor-pointer"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Action Buttons */}
        {gameState === "idle" && (
          <button
            onClick={startGame}
            className="w-full py-3 bg-[#00e701] hover:bg-[#00cc01] text-black rounded-lg font-bold text-base transition shadow-lg"
          >
            Bet
          </button>
        )}

        {gameState === "playing" && (
          <>
            <button
              onClick={pump}
              disabled={isAnimating}
              className="w-full py-3 bg-[#1e4a63] hover:bg-[#2a5d7a] disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-bold text-base transition shadow-lg"
            >
              Pump
            </button>
            <button
              onClick={cashOut}
              className="w-full py-3 bg-[#00e701] hover:bg-[#00cc01] text-black rounded-lg font-bold text-base transition shadow-lg"
            >
              Cash Out
            </button>
          </>
        )}

        {(gameState === "won" || gameState === "lost") && (
          <button
            onClick={reset}
            className="w-full py-3 bg-[#00e701] hover:bg-[#00cc01] text-black rounded-lg font-bold text-base transition shadow-lg"
          >
            New Game
          </button>
        )}

        {/* Profit Display */}
        <div className="bg-[#0a1721] rounded-lg p-4 border border-[#1a3a4a]">
          <div className="text-gray-400 text-xs mb-1">Total Profit ({multiplier.toFixed(2)}×)</div>
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-white">
              {profit.toFixed(8)}
            </div>
            <div className="w-6 h-6 rounded-full bg-[#00e701] flex items-center justify-center text-black text-xs font-bold">
              $
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Game Area */}
      <div className="flex-1 relative overflow-hidden">
        
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2b3a] to-[#0b1f2a]" />

        {/* Main Game Scene */}
        <div className="relative h-full flex flex-col">
          
          {/* Top area - Result Display */}
          <div className="flex-1 flex items-center justify-center relative">

            {/* Win Result - Green bordered box like Stake */}
            {gameState === "won" && (
              <div className="bg-[#0d1f2a] border-[3px] border-[#00e701] rounded-xl px-10 py-6 min-w-[220px] text-center">
                <div className="text-[#00e701] font-bold text-5xl mb-2">
                  {multiplier.toFixed(2)}×
                </div>
                <div className="w-full h-[1px] bg-gray-600 my-3"></div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[#00e701] font-bold text-2xl">
                    ${profit.toFixed(2)}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">₿</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Loss Result - Red text with Pop button like Stake */}
            {gameState === "lost" && (
              <div className="text-center">
                <div className="text-[#ff0a3a] font-bold text-7xl mb-5">
                  {multiplier.toFixed(2)}×
                </div>
                <button
                  onClick={reset}
                  className="px-10 py-3 bg-[#2d4a5e] hover:bg-[#3a5c72] text-white rounded-lg font-semibold text-lg transition"
                >
                  Pop
                </button>
              </div>
            )}
          </div>

          {/* Bottom area - Mill and multiplier buttons */}
          <div className="relative pb-4">
            
            {/* Mill SVG - switches based on game state and shows result overlay */}
            <div className="flex justify-center mb-4 relative">
              {(gameState === "idle" || gameState === "won" || gameState === "lost") && (
                <img 
                  src={settings.millSvg} 
                  alt="Pump Mill" 
                  className="w-full max-w-2xl select-none"
                  draggable={false}
                />
              )}
              
              {gameState === "playing" && (
                <div className="relative w-full max-w-2xl">
                  <img 
                    src={settings.millBalloonSvg} 
                    alt="Pump Mill with Balloon" 
                    className="w-full select-none transition-all duration-150 ease-out"
                    style={{
                      transform: `scale(${balloonSize})`,
                      transformOrigin: 'center 70%'
                    }}
                    draggable={false}
                  />
                  
                  {/* Multiplier text inside the balloon */}
                  <div 
                    className="absolute transition-all duration-150 ease-out pointer-events-none"
                    style={{
                      top: '25%',
                      left: '50%',
                      transform: `translate(-50%, -50%)`,
                    }}
                  >
                    <div className="text-white font-bold text-5xl drop-shadow-2xl">
                      {multiplier.toFixed(2)}×
                    </div>
                  </div>
                  
                  {/* Green fill overlay for the circled area */}
                  <svg 
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    viewBox="0 0 1280 800"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Green fill circle that grows */}
                    <circle 
                      cx="640" 
                      cy="360"
                      r={50 + (multiplier - 1.0) * 80}
                      fill="rgba(0, 231, 1, 0.3)"
                      className="transition-all duration-300"
                      style={{
                        filter: 'blur(20px)'
                      }}
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Multiplier buttons */}
            <div className="px-6">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {settings.multipliers.map((mult, i) => {
                  const isActive = multiplier >= mult && multiplier < (i < settings.multipliers.length - 1 ? settings.multipliers[i + 1] : 9999);
                  return (
                    <button
                      key={i}
                      className={`min-w-[90px] py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-[#3b82f6] text-white shadow-lg scale-105"
                          : "bg-[#132f3d] text-[#6b8a9a] hover:bg-[#1a3a4a]"
                      }`}
                    >
                      {mult.toFixed(2)}×
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}