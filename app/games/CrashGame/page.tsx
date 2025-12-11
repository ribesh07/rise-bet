
'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type GameState = 'waiting' | 'betting' | 'flying' | 'crashed';

type ActivePlayer = {
  name: string;
  bet: number;
  multiplier?: number;
};

type ChatMessage = {
  user: string;
  message: string;
  time: string;
};

type PlayerBet = {
  amount: number;
  multiplier?: number;
} | null;

const CrashGame: React.FC = () => {
  // --- State ---
  const [balance, setBalance] = useState<number>(1000);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [autoCashout, setAutoCashout] = useState<number>(2.0);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.0);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [crashPoint, setCrashPoint] = useState<number>(0);
  const [playerBet, setPlayerBet] = useState<PlayerBet>(null);
  const [cashedOut, setCashedOut] = useState<boolean>(false);
  const [history, setHistory] = useState<number[]>([2.34, 1.23, 5.67, 1.89, 3.45, 7.23, 1.02, 4.56]);
  const [countdown, setCountdown] = useState<number>(7);
  const [activePlayers, setActivePlayers] = useState<ActivePlayer[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showVideo, setShowVideo] = useState(true);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { user: 'Player123', message: 'Nice win!', time: '12:34' },
    { user: 'CrashMaster', message: 'Going for 10x', time: '12:33' },
    { user: 'LuckyGuy', message: 'Cashed out at 3.2x', time: '12:32' }
  ]);
  const [gameHash, setGameHash] = useState<string>('loading...');
  const [mounted, setMounted] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // --- Refs ---
  const gameIntervalRef = useRef<number | undefined>(undefined);
  const countdownIntervalRef = useRef<number | undefined>(undefined);
  const gameStartTime = useRef<number>(0);

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
    const result = Math.max(1.01, Math.min(raw, 10000));
    return parseFloat(result.toFixed(2));
  }, []);

  const clearAllIntervals = useCallback(() => {
    safeClearInterval(gameIntervalRef);
    safeClearInterval(countdownIntervalRef);
  }, []);

  const startNewGame = useCallback(() => {
    clearAllIntervals();
    const newCrashPoint = generateCrashPoint();
    setCrashPoint(newCrashPoint);
    setCurrentMultiplier(1.0);
    setGameState('flying');
    setCashedOut(false);
    gameStartTime.current = Date.now();
    setGameHash(Math.random().toString(36).slice(2, 11));

    setActivePlayers([
      { name: 'CryptoKing', bet: 50, multiplier: 10.5 },
      { name: 'MoonShot', bet: 25, multiplier: 5.0 },
      { name: 'DiamondHands', bet: 100, multiplier: 3.2 },
      { name: 'RocketMan', bet: 75, multiplier: 7.8 }
    ]);

    // smooth multiplier progression
    gameIntervalRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - gameStartTime.current) / 1000;
      const rawMultiplier = Math.pow(1.00148, elapsed * 60);
      const newMultiplier = parseFloat(rawMultiplier.toFixed(2));

      if (newMultiplier >= newCrashPoint) {
        setCurrentMultiplier(newCrashPoint);
        setGameState('crashed');
        safeClearInterval(gameIntervalRef);
        setHistory(prev => [newCrashPoint, ...prev].slice(0, 10));
        setTimeout(() => setPlayerBet(null), 1000);
        setTimeout(() => startCountdown(7), 3000);
      } else {
        setCurrentMultiplier(newMultiplier);
        setActivePlayers(prev =>
          prev.map(p => {
            if (!p.multiplier && Math.random() < 0.002) {
              return { ...p, multiplier: newMultiplier };
            }
            return p;
          })
        );
      }
    }, 50);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearAllIntervals, generateCrashPoint]);

  const startCountdown = useCallback((duration = 8) => {
    clearAllIntervals();
    setCountdown(duration);
    setGameState('waiting');
    safeClearInterval(countdownIntervalRef);
    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          safeClearInterval(countdownIntervalRef);
          startNewGame();
          return duration;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearAllIntervals, startNewGame]);

  // Betting
  const placeBet = useCallback(() => {
    if (gameState !== 'waiting' || betAmount > balance || countdown <= 3) return;
    setBalance(prev => prev - betAmount);
    setPlayerBet({ amount: betAmount });
    setCashedOut(false);
    setGameState('waiting');
  }, [betAmount, balance, countdown, gameState]);

  const performCashOut = useCallback((multiplier: number) => {
    if (!playerBet || cashedOut || gameState !== 'flying') return;
    const winAmount = Math.round(playerBet.amount * multiplier * 100) / 100;
    setBalance(prev => parseFloat((prev + winAmount).toFixed(2)));
    setCashedOut(true);
    setPlayerBet(prev => (prev ? { ...prev, multiplier } : prev));
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setChatMessages(prev => [{ user: 'You', message: `Cashed out at ${multiplier}x`, time: timeString }, ...prev].slice(0, 10));
  }, [playerBet, cashedOut, gameState]);

  const cashOut = useCallback(() => performCashOut(currentMultiplier), [currentMultiplier, performCashOut]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (gameState === "crashed") {
      setShowVideo(false);
    }
    if (gameState === "waiting") {
      setShowVideo(true);
      videoRef.current.currentTime = 0;
    }
  }, [gameState]);

  // Auto cashout
  useEffect(() => {
    if (gameState === 'flying' && playerBet && !cashedOut && autoCashout > 0 && currentMultiplier >= autoCashout) {
      performCashOut(autoCashout);
    }
  }, [gameState, playerBet, cashedOut, autoCashout, currentMultiplier, performCashOut]);

  // mount
  useEffect(() => {
    setMounted(true);
    setGameHash(Math.random().toString(36).slice(2, 11));
    startCountdown(7);
    return () => clearAllIntervals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMultiplierColor = () => {
    if (gameState === "crashed") return "text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.6)]";
    if (currentMultiplier >= 50) return "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500";
    if (currentMultiplier >= 20) return "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500";
    if (currentMultiplier >= 10) return "text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400";
    if (currentMultiplier >= 5) return "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500";
    if (currentMultiplier >= 2) return "text-green-400";
    return "text-yellow-300";
  };

  const getBetButtonText = () => {
    if (gameState === 'waiting') return countdown > 3 ? `BET $${betAmount.toFixed(2)}` : 'BETTING CLOSED';
    if (gameState === 'betting') return 'BETTING...';
    if (gameState === 'flying' && playerBet && !cashedOut) return 'CASH OUT';
    if (gameState === 'crashed') return 'ROUND FINISHED';
    return 'NEXT ROUND';
  };

  // small helpers
  const chipOptions = [1, 5, 10, 25, 50, 100];

  return (
    <div className="min-h-screen bg-[#071018] text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0b1320] to-[#071018] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-yellow-400">🚀 NovaCrash</div>
            <div className="text-sm text-gray-300 hidden sm:block">Fast, fair, and neon-stylish</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-300">Balance</div>
            <div className="px-3 py-1 bg-black/40 rounded-lg text-green-400 font-semibold">${balance.toLocaleString()}</div>
            <button
              onClick={() => setSidebarOpen(s => !s)}
              className="px-3 py-1 bg-gray-800/60 rounded-lg text-sm hover:bg-gray-700 transition"
            >
              {sidebarOpen ? 'Hide' : 'Show'} Sidebar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main / Left */}
          <section className="lg:col-span-8 space-y-6">
            {/* Video Card */}
            <div className="rounded-2xl overflow-hidden border border-gray-700 bg-gradient-to-b from-[#08121a] to-[#061016] shadow-2xl">
              <div className="relative">
                {/* Video container */}
                <div
                  className="relative w-full
                    h-[260px] sm:h-[320px] md:h-[420px] lg:h-[520px] xl:h-[600px]
                    bg-black"
                >
                  <video
                    ref={videoRef}
                    src="/animation/crash.mp4"
                    muted
                    loop
                    autoPlay
                    playsInline
                    // NO opacity fade, use scale+blur for entrance so video stays bright
                    className={`absolute inset-0 w-full h-full object-contain transition-all duration-600
                      ${showVideo ? 'scale-100 blur-0' : 'scale-105 blur-sm'}`}
                  />

                  {/* subtle vignette on edges (very small to preserve brightness) */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* multiplier / countdown overlay */}
                  <div className={`absolute z-20 inset-0 flex items-center justify-center px-4`}>
                    <div className="text-center">
                      {gameState === 'waiting' ? (
                        <>
                          <div className="text-sm text-gray-300 mb-2">Next round starts in</div>
                          {/* <div className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-yellow-400 animate-pulse">{countdown}</div> */}
                        </>
                      ) : gameState === 'crashed' ? (
                        <>
                          <div className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-red-500">CRASHED</div>
                          <div className="text-3xl text-red-400 mt-2">at {crashPoint}x</div>
                        </>
                      ) : (
                        <div className={`text-6xl sm:text-7xl md:text-8xl font-extrabold ${getMultiplierColor()}`}>
                          {currentMultiplier}x
                        </div>
                      )}
                    </div>
                  </div>

                  {/* top-left HUD */}
                  <div className="absolute top-4 left-4 z-30 text-xs text-gray-300 bg-black/40 px-3 py-1 rounded-lg border border-gray-700">
                    Hash #{gameHash}
                  </div>

                  {/* small crash emoji when crashed */}
                  {gameState === 'crashed' && (
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      <div className="text-7xl animate-bounce">💥</div>
                    </div>
                  )}
                </div>

                {/* bottom controls overlay */}
                <div className="p-4 md:p-6 bg-gradient-to-t from-transparent to-black/50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* chips & presets */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-300 mr-2">Chips</div>
                        {chipOptions.map(c => (
                          <button
                            key={c}
                            onClick={() => setBetAmount(prev => Math.min(c, balance))}
                            className="px-3 py-1 text-sm bg-gray-800/60 hover:bg-gray-700 rounded-md transition"
                          >
                            ${c}
                          </button>
                        ))}
                      </div>

                      <div className="hidden sm:flex items-center gap-2 ml-3">
                        <button onClick={() => setBetAmount(prev => Math.max(1, prev / 2))} className="px-3 py-1 bg-gray-800/60 rounded-md">½</button>
                        <button onClick={() => setBetAmount(prev => Math.min(prev * 2, balance))} className="px-3 py-1 bg-gray-800/60 rounded-md">2×</button>
                        <button onClick={() => setBetAmount(balance)} className="px-3 py-1 bg-gray-800/60 rounded-md">MAX</button>
                      </div>
                    </div>

                    {/* quick stats */}
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-gray-400">House Edge: <span className="text-yellow-400 ml-1">1%</span></div>
                      <div className="text-xs text-gray-400">Max Win: <span className="text-yellow-400 ml-1">10,000x</span></div>
                      <div className="text-xs text-gray-400 hidden sm:block">Players: <span className="text-green-400 ml-1">{activePlayers.length}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls Card */}
            <div className="rounded-2xl bg-[#071018] border border-gray-800 p-4 shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* left: bet controls */}
                <div className="col-span-1 md:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-300">Bet Amount</div>
                      <div className="text-xl font-semibold">${betAmount.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-300">Balance</div>
                      <div className="text-lg text-green-400 font-semibold">${balance.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="range"
                      min={1}
                      max={Math.max(1, balance)}
                      value={betAmount}
                      onChange={(e) => setBetAmount(Math.max(1, Math.round(Number(e.target.value))))}
                      className="w-full accent-yellow-400"
                    />
                    <div className="w-36 flex flex-col gap-2">
                      <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Math.max(1, Math.round(Number(e.target.value || 1))))}
                        className="px-3 py-2 bg-black/40 rounded-lg text-center"
                        min={1}
                        max={balance}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => setBetAmount(prev => Math.min(prev * 2, balance))} className="flex-1 py-2 rounded-lg bg-gray-800/60">2×</button>
                        <button onClick={() => setBetAmount(balance)} className="flex-1 py-2 rounded-lg bg-red-600">MAX</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* right: auto cashout quick */}
                <div className="col-span-1 space-y-3">
                  <div className="text-sm text-gray-300">Auto Cashout</div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={autoCashout}
                      onChange={(e) => setAutoCashout(Math.max(0, parseFloat(e.target.value || '0')))}
                      className="flex-1 px-3 py-2 bg-black/40 rounded-lg"
                      min={0}
                    />
                    <button onClick={() => setAutoCashout(0)} className="px-3 py-2 bg-gray-800/60 rounded-lg">OFF</button>
                  </div>
                  <div className="flex gap-2">
                    {[1.5, 2, 3, 5].map(m => (
                      <button key={m} onClick={() => setAutoCashout(m)} className="flex-1 py-2 rounded-lg bg-gray-800/60">{m}x</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* action */}
              <div className="mt-4">
                <button
                  onClick={gameState === 'waiting' && countdown > 3 ? placeBet : (gameState === 'flying' && playerBet && !cashedOut) ? cashOut : undefined}
                  disabled={
                    (gameState === 'waiting' && (betAmount > balance || countdown <= 3)) ||
                    gameState === 'betting' ||
                    (gameState === 'flying' && (!playerBet || cashedOut)) ||
                    gameState === 'crashed'
                  }
                  className={`w-full py-3 rounded-xl text-lg font-bold transition ${
                    gameState === 'flying' && playerBet && !cashedOut
                      ? 'bg-red-600 hover:bg-red-500'
                      : gameState === 'waiting' && countdown > 3
                      ? 'bg-emerald-500 hover:bg-emerald-400'
                      : 'bg-gray-700 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {getBetButtonText()}
                </button>
              </div>
            </div>
          </section>

          {/* Sidebar / Right */}
          <aside className={`lg:col-span-4 space-y-6 ${sidebarOpen ? '' : 'lg:block'}`}>
            <div className="rounded-2xl bg-[#071018] border border-gray-800 p-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">Game History</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {history.map((h, i) => (
                  <div key={i} className="min-w-[88px] px-3 py-2 bg-gray-900/60 rounded-md text-center">
                    <div className="text-xs text-gray-400">#{history.length - i}</div>
                    <div className={`font-bold ${h >= 10 ? 'text-purple-400' : h >= 5 ? 'text-yellow-400' : h >= 2 ? 'text-green-400' : 'text-red-400'}`}>
                      {h}x
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#071018] border border-gray-800 p-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">Active Players</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {activePlayers.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-900/40 px-3 py-2 rounded-md">
                    <div className="text-sm text-gray-200">{p.name}</div>
                    <div className="text-right">
                      <div className="text-sm text-green-400">${p.bet.toFixed(0)}</div>
                      {p.multiplier && <div className="text-xs text-yellow-400">{p.multiplier}x</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#071018] border border-gray-800 p-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">Chat</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto text-sm">
                {chatMessages.map((m, idx) => (
                  <div key={idx} className="px-2 py-1 rounded-md bg-gray-900/30">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="text-blue-300">{m.user}</div>
                      <div>{m.time}</div>
                    </div>
                    <div className="text-gray-200">{m.message}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <input placeholder="Say something..." className="flex-1 px-3 py-2 bg-black/40 rounded-lg" />
                <button className="px-3 py-2 bg-yellow-500 rounded-lg">Send</button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CrashGame;