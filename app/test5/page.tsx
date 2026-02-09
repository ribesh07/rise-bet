'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type GameState = 'waiting' | 'betting' | 'flying' | 'crashed';

type PlayerBet = {
  amount: number;
  multiplier?: number;
} | null;

const CrashGame: React.FC = () => {
  // --- State ---
  const [balance, setBalance] = useState<number>(13009.49);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [autoCashout, setAutoCashout] = useState<number>(2.0);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.0);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [crashPoint, setCrashPoint] = useState<number>(0);
  const [playerBet, setPlayerBet] = useState<PlayerBet>(null);
  const [cashedOut, setCashedOut] = useState<boolean>(false);
  const [history, setHistory] = useState<number[]>([16.84, 4.18, 2.16, 3.66, 1.06, 1.08, 2.93, 1.02, 1.09, 2.67, 1.70]);
  const [countdown, setCountdown] = useState<number>(6);
  const [activePlayers, setActivePlayers] = useState<number>(218);
  const [totalBetPool, setTotalBetPool] = useState<number>(485.62);
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [graphPoints, setGraphPoints] = useState<{x: number, y: number}[]>([]);

  // --- Refs ---
  const gameIntervalRef = useRef<number | undefined>(undefined);
  const countdownIntervalRef = useRef<number | undefined>(undefined);
  const gameStartTime = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Utilities ---
  const safeClearInterval = (idRef: React.MutableRefObject<number | undefined>) => {
    if (typeof idRef.current !== 'undefined') {
      window.clearInterval(idRef.current);
      idRef.current = undefined;
    }
  };

  const generateCrashPoint = useCallback((): number => {
    const houseEdge = 0.01;
    const rand = Math.random();
    const raw = 1 + (1 - houseEdge) * (1 / Math.max(0.0001, rand));
    const result = Math.max(1.01, Math.min(raw, 100));
    return parseFloat(result.toFixed(2));
  }, []);

  const clearAllIntervals = useCallback(() => {
    safeClearInterval(gameIntervalRef);
    safeClearInterval(countdownIntervalRef);
  }, []);

  // Draw graph on canvas
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate scales
    // X axis: Time (seconds). Y axis: Multiplier (x).
    
    // Determine Max Y and Max X based on current state
    const currentTime = graphPoints.length > 0 ? graphPoints[graphPoints.length - 1].x : 0;
    // Ensure we always show at least 10 seconds or current + padding
    const maxTime = Math.max(10, currentTime * 1.1); 
    // Ensure we always show at least 2x or current + padding
    const maxY = Math.max(2, currentMultiplier * 1.1); 

    // Helper to map logic coordinates to canvas coordinates
    // padding: left 50, right 20, bottom 30, top 40
    const paddingLeft = 50;
    const paddingRight = 20;
    const paddingBottom = 30;
    const paddingTop = 40;
    const graphWidth = width - paddingLeft - paddingRight;
    const graphHeight = height - paddingBottom - paddingTop;

    const mapX = (val: number) => paddingLeft + (val / maxTime) * graphWidth;
    // Map Y: 1.0 is at bottom, maxY is at top
    const mapY = (val: number) => (height - paddingBottom) - ((val - 1) / (maxY - 1)) * graphHeight;

    // Draw Grid and Labels
    ctx.fillStyle = '#b1bad3'; 
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    // Y-axis labels (Multiplier)
    // We want fixed steps like 1.2, 1.4, 1.6 etc if range is small
    // Or dynamic steps if range is large
    const yRange = maxY - 1;
    let yStep = 0.2;
    if (yRange > 2) yStep = 0.5;
    if (yRange > 5) yStep = 1;
    if (yRange > 10) yStep = 2;
    if (yRange > 50) yStep = 10;
    if (yRange > 100) yStep = 50;
    if (yRange > 1000) yStep = 200;

    for (let val = 1 + yStep; val < maxY; val += yStep) {
        const y = mapY(val);
        ctx.fillText(`${val.toFixed(1)}×`, paddingLeft - 10, y);
    }
    // Always draw 1.0x? Usually not needed if it's the baseline.
    // Let's draw it for clarity
    ctx.fillText(`1.0×`, paddingLeft - 10, mapY(1));

    // X-axis labels (Time)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const xStep = Math.ceil(maxTime / 5 / 2) * 2; // Step size 2, 4, 6...
    for (let t = 2; t < maxTime; t += xStep) {
        const x = mapX(t);
        ctx.fillText(`${t}s`, x, height - paddingBottom + 8);
    }

    // Draw curve
    if (graphPoints.length > 0) {
      ctx.beginPath();
      ctx.moveTo(mapX(graphPoints[0].x), mapY(graphPoints[0].y));

      for (let i = 1; i < graphPoints.length; i++) {
          ctx.lineTo(mapX(graphPoints[i].x), mapY(graphPoints[i].y));
      }

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 170, 0, 0.8)';
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow for other elements

      // Fill area under curve
      // Orange gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      if (gameState === 'crashed') {
          // On crash, maybe just red tint or keep orange but fade?
          // Screenshot shows orange even when active (implied).
          // If crashed, maybe gray out? Or red?
          // User asked for "match screenshot". Screenshot shows orange fill.
          gradient.addColorStop(0, 'rgba(255, 165, 0, 0.5)'); // Orange
          gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
      } else {
          gradient.addColorStop(0, 'rgba(255, 170, 0, 0.6)'); // Bright Orange
          gradient.addColorStop(1, 'rgba(255, 170, 0, 0.05)');
      }
      
      // Close path for fill
      ctx.lineTo(mapX(graphPoints[graphPoints.length - 1].x), height - paddingBottom);
      ctx.lineTo(mapX(graphPoints[0].x), height - paddingBottom);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw the "Rocket" / End Point
      const lastPoint = graphPoints[graphPoints.length - 1];
      const cx = mapX(lastPoint.x);
      const cy = mapY(lastPoint.y);

      // Glow
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fill();

      // Dot
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

  }, [graphPoints, currentMultiplier, gameState]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
        if (containerRef.current && canvasRef.current) {
            canvasRef.current.width = containerRef.current.clientWidth;
            canvasRef.current.height = containerRef.current.clientHeight;
            drawGraph();
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [drawGraph]);

  // Update Graph Effect
  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  const startNewGame = useCallback(() => {
    clearAllIntervals();
    const newCrashPoint = generateCrashPoint();
    setCrashPoint(newCrashPoint);
    setCurrentMultiplier(1.0);
    setGameState('flying');
    setCashedOut(false);
    setGraphPoints([{x: 0, y: 1.0}]);
    gameStartTime.current = Date.now();

    // Random active players
    setActivePlayers(Math.floor(Math.random() * 100) + 150);
    setTotalBetPool(Math.floor(Math.random() * 10000) + 1000);

    // Game Loop
    gameIntervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const elapsed = (now - gameStartTime.current) / 1000; // seconds
      
      // Slower growth formula: 
      // k = 0.05 to reach ~1.65x in 10s (very gradual).
      const k = 0.05; 
      const rawMultiplier = Math.pow(Math.E, k * elapsed); 
      const newMultiplier = parseFloat(rawMultiplier.toFixed(2));

      if (newMultiplier >= newCrashPoint) {
        setCurrentMultiplier(newCrashPoint);
        setGraphPoints(prev => [...prev, {x: elapsed, y: newCrashPoint}]);
        setGameState('crashed');
        safeClearInterval(gameIntervalRef);
        setHistory(prev => [newCrashPoint, ...prev].slice(0, 12));
        setTimeout(() => setPlayerBet(null), 1000);
        setTimeout(() => startCountdown(6), 2000);
      } else {
        setCurrentMultiplier(newMultiplier);
        setGraphPoints(prev => [...prev, {x: elapsed, y: newMultiplier}]);
        
        // Auto cashout check
        if (playerBet && !cashedOut && autoCashout > 0 && newMultiplier >= autoCashout) {
             // Effect handles this mostly, but for precision we might miss it in effect if interval is fast
             // But effect is reactive to currentMultiplier state change, so it's fine.
        }
      }
    }, 30); // 30ms update rate
  }, [clearAllIntervals, generateCrashPoint, playerBet, cashedOut, autoCashout]);

  // Auto cashout Effect
  useEffect(() => {
    if (gameState === 'flying' && playerBet && !cashedOut && autoCashout > 0 && currentMultiplier >= autoCashout) {
        performCashOut(autoCashout);
    }
  }, [currentMultiplier, gameState, playerBet, cashedOut, autoCashout]);

  const startCountdown = useCallback((duration = 6) => {
    clearAllIntervals();
    setCountdown(duration);
    setGameState('waiting');
    setGraphPoints([]);
    safeClearInterval(countdownIntervalRef);
    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0.1) {
          safeClearInterval(countdownIntervalRef);
          startNewGame();
          return 0;
        }
        return parseFloat((prev - 0.1).toFixed(1));
      });
    }, 100);
  }, [clearAllIntervals, startNewGame]);

  // Betting
  const placeBet = useCallback(() => {
    if (gameState !== 'waiting' || betAmount > balance || betAmount <= 0) return;
    setBalance(prev => prev - betAmount);
    setPlayerBet({ amount: betAmount });
    setCashedOut(false);
  }, [betAmount, balance, gameState]);

  const performCashOut = useCallback((multiplier: number) => {
    setBalance(prev => parseFloat((prev + (playerBet!.amount * multiplier)).toFixed(2)));
    setCashedOut(true);
    setPlayerBet(prev => (prev ? { ...prev, multiplier } : prev));
  }, [playerBet]);

  const cashOut = useCallback(() => {
      if (!playerBet || cashedOut || gameState !== 'flying') return;
      performCashOut(currentMultiplier);
  }, [currentMultiplier, playerBet, cashedOut, gameState, performCashOut]);

  // Initial Mount
  useEffect(() => {
    startCountdown(6);
    return () => clearAllIntervals();
  }, []);

  // --- Render Helpers ---

  const getMultiplierColor = () => {
    if (gameState === "crashed") return "text-[#ff4d4d]";
    return "text-white";
  };

  const getHistoryPill = (val: number) => {
      let className = "px-3 py-1 rounded-full text-xs font-bold transition-all ";
      if (val >= 10) className += "bg-[#ffaa00] text-black"; // Gold
      else if (val >= 2) className += "bg-[#00e701] text-black"; // Green
      else className += "bg-[#b1bad3] text-[#0f212e]"; // Gray
      return className;
  }

  return (
    <div className="min-h-screen bg-[#0f212e] text-white font-sans selection:bg-[#00e701] selection:text-black">
      <div className="max-w-[1400px]  p-4 md:p-6">
        {/* Responsive Grid: On Mobile, Game Canvas (col-2) comes before Controls (col-1) */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[350px_1fr] gap-4">
          
          {/* --- Sidebar (Betting Controls) --- */}
          <div className="bg-[#213743] rounded-lg flex flex-col h-fit lg:h-[600px]">
            {/* Tabs */}
            <div className="flex p-2 bg-[#0f212e] rounded-t-lg mx-4 mt-4 mb-2 rounded-full">
              <button
                onClick={() => setMode('manual')}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                  mode === 'manual'
                    ? 'bg-[#213743] text-white shadow-md'
                    : 'text-[#b1bad3] hover:text-white'
                }`}
              >
                Manual
              </button>
              <button
                onClick={() => setMode('auto')}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                  mode === 'auto'
                    ? 'bg-[#213743] text-white shadow-md'
                    : 'text-[#b1bad3] hover:text-white'
                }`}
              >
                Auto
              </button>
            </div>

            <div className="p-4 flex flex-col gap-4 flex-1">
                {/* Bet Amount */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[#b1bad3] font-semibold">
                        <span>Bet Amount</span>
                        <span>0.00000000 BTC</span>
                    </div>
                    <div className="flex group bg-[#0f212e] border border-[#2f4553] hover:border-[#b1bad3] focus-within:border-[#00e701] rounded-md transition-all overflow-hidden">
                        <div className="pl-3 py-2 flex items-center gap-2 flex-1">
                            <span className="text-[#b1bad3]">$</span>
                            <input 
                                type="number" 
                                value={betAmount}
                                onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                                className="bg-transparent w-full outline-none text-white font-semibold text-sm"
                                placeholder="0.00"
                            />
                            <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" className="w-5 h-auto rounded-sm opacity-80" alt="US" />
                        </div>
                        <div className="flex border-l border-[#2f4553]">
                            <button onClick={() => setBetAmount(b => b/2)} className="px-3 hover:bg-[#2f4553] transition-colors text-[#b1bad3] text-xs font-bold">½</button>
                            <div className="w-[1px] bg-[#2f4553]"></div>
                            <button onClick={() => setBetAmount(b => b*2)} className="px-3 hover:bg-[#2f4553] transition-colors text-[#b1bad3] text-xs font-bold">2×</button>
                        </div>
                    </div>
                </div>

                {/* Cashout At */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[#b1bad3] font-semibold">
                        <span>Cashout At</span>
                    </div>
                    <div className="flex bg-[#0f212e] border border-[#2f4553] hover:border-[#b1bad3] focus-within:border-[#00e701] rounded-md transition-all overflow-hidden">
                        <div className="pl-3 py-2 flex items-center gap-2 flex-1">
                            <input 
                                type="number" 
                                value={autoCashout}
                                onChange={(e) => setAutoCashout(parseFloat(e.target.value) || 0)}
                                className="bg-transparent w-full outline-none text-white font-semibold text-sm"
                            />
                        </div>
                         <div className="flex border-l border-[#2f4553]">
                            <button className="px-3 hover:bg-[#2f4553] transition-colors text-[#b1bad3]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <div className="w-[1px] bg-[#2f4553]"></div>
                            <button className="px-3 hover:bg-[#2f4553] transition-colors text-[#b1bad3]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Big Bet Button */}
                <button
                    onClick={gameState === 'flying' && playerBet && !cashedOut ? cashOut : placeBet}
                    disabled={(gameState === 'waiting' && betAmount > balance) || (gameState === 'flying' && (!playerBet || cashedOut))}
                    className={`w-full py-3.5 rounded-md font-bold text-base transition-all shadow-lg ${
                        gameState === 'flying' && playerBet && !cashedOut
                            ? 'bg-[#ffffff] text-[#0f212e] hover:bg-gray-100' 
                            : 'bg-[#00e701] text-[#013e01] hover:bg-[#00c701] disabled:bg-[#2f4553] disabled:text-[#55657e] disabled:cursor-not-allowed'
                    }`}
                >
                    {gameState === 'flying' && playerBet && !cashedOut 
                        ? `Cashout ${(playerBet.amount * currentMultiplier).toFixed(2)}` 
                        : (gameState === 'waiting' ? 'Bet (Next Round)' : 'Bet')}
                </button>

                {/* Profit on Win */}
                 <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[#b1bad3] font-semibold">
                        <span>Profit on Win</span>
                        <span>0.00000000 BTC</span>
                    </div>
                    <div className="flex bg-[#0f212e] border border-[#2f4553] rounded-md px-3 py-2 items-center">
                        <span className="text-[#b1bad3] mr-2">$</span>
                        <input 
                            readOnly
                            value={playerBet && cashedOut 
                                ? (playerBet.amount * (playerBet.multiplier || 1) - playerBet.amount).toFixed(2) 
                                : (betAmount * autoCashout - betAmount).toFixed(2)
                            }
                            className="bg-transparent w-full outline-none text-white font-semibold text-sm cursor-default"
                        />
                         <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" className="w-5 h-auto rounded-sm opacity-80" alt="US" />
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="flex items-center justify-between text-sm text-[#b1bad3] font-medium">
                         <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#00e701] animate-pulse"></span>
                            <span>{activePlayers} Players</span>
                         </div>
                         <div className="flex items-center gap-1.5">
                            <span className="text-[#ffaa00]">₿</span>
                            <span>${totalBetPool.toLocaleString()}</span>
                         </div>
                    </div>
                </div>
            </div>
          </div>

          {/* --- Main Game Area --- */}
          <div className="flex flex-col gap-4">
            
            {/* History Bar */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                {history.map((val, idx) => (
                    <div key={idx} className={getHistoryPill(val)}>
                        {val.toFixed(2)}x
                    </div>
                ))}
                <div className="ml-auto flex items-center gap-2 text-[#b1bad3] text-xs font-semibold px-2 bg-[#213743] rounded-full py-1 cursor-pointer hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>History</span>
                </div>
            </div>

            {/* Canvas Container */}
            <div className="relative bg-[#0f212e] border-2 border-[#213743] rounded-lg w-full h-[300px] md:h-[450px] lg:h-[600px] flex flex-col" ref={containerRef}>
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />
                
                {/* Center Stats / Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                    
                    {/* Multiplier Big Text */}
                    {gameState !== 'waiting' && (
                        <div className={`text-6xl md:text-8xl font-black tabular-nums tracking-tighter ${getMultiplierColor()} drop-shadow-2xl`}>
                            {currentMultiplier.toFixed(2)}x
                        </div>
                    )}

                    {/* Crashed Overlay */}
                    {gameState === 'crashed' && (
                        <div className="mt-4 bg-[#1a2c3d]/90 px-6 py-2 rounded-md border border-[#ff4d4d]/30 backdrop-blur-sm animate-bounce">
                            <span className="text-[#ff4d4d] font-bold text-lg uppercase tracking-wider">Crashed</span>
                        </div>
                    )}

                    {/* Waiting / Countdown Overlay */}
                    {gameState === 'waiting' && (
                         <div className="flex flex-col items-center gap-4 w-[280px]">
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                1.00x
                            </div>
                            <div className="w-full bg-[#1a2c3d] rounded-md p-4 flex flex-col items-center gap-2 border border-[#2f4553]">
                                <span className="text-[#b1bad3] font-bold text-sm uppercase tracking-wide">Starting in</span>
                                <div className="text-2xl font-black text-white">{countdown.toFixed(1)}s</div>
                                {/* Progress Bar */}
                                <div className="w-full h-1.5 bg-[#0f212e] rounded-full overflow-hidden mt-1">
                                    <div 
                                        className="h-full bg-[#ffaa00] transition-all ease-linear duration-100" 
                                        style={{ width: `${(countdown / 6) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Bar (Top Left) */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
                   {/* Network status or other indicators could go here */}
                </div>

            </div>
            
            {/* Footer Stats (Optional, maybe user balance) */}
            <div className="bg-[#213743] p-3 rounded-lg flex justify-between items-center text-sm">
                <div className="text-[#b1bad3]">
                    <span className="mr-2">Your Balance:</span>
                    <span className="text-white font-bold">${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                 <div className="flex gap-4">
                     {/* Footer links or controls */}
                 </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CrashGame;
