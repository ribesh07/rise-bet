
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

  // --- Refs (no `null`, no `as any`) ---
  // Using browser environment: setInterval returns a number
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

  // House-edge crash point generator (keeps distribution reasonable)
  const generateCrashPoint = useCallback((): number => {
    const houseEdge = 0.01; // 1%
    // simple long-tail distribution:
    // higher tail but clamped to prevent absurd numbers
    const rand = Math.random(); // (0,1)
    // Use inverse transform of exponential-like distribution for variability
    // const raw = 1 + (1 - houseEdge) * (1 / Math.max(0.0001, rand)) * 0.02;
    const raw = 1 + (1 - houseEdge) * (1 / Math.max(0.0001, rand));
    const result = Math.max(1.01, Math.min(raw, 10000));
    return parseFloat(result.toFixed(2));
  }, []);

  // --- Clear all intervals (stable) ---
  const clearAllIntervals = useCallback(() => {
    safeClearInterval(gameIntervalRef);
    safeClearInterval(countdownIntervalRef);
  }, []);

  // Start new game (flying) - stable callback
  const startNewGame = useCallback(() => {
    clearAllIntervals();

    const newCrashPoint = generateCrashPoint();
    setCrashPoint(newCrashPoint);
    setCurrentMultiplier(1.0);
    setGameState('flying');
    setCashedOut(false);
    // keep playerBet until round ends
    gameStartTime.current = Date.now();

    setGameHash(Math.random().toString(36).slice(2, 11));

    // fake active players (you can replace with realtime data)
    setActivePlayers([
      { name: 'CryptoKing', bet: 50, multiplier: 10.5 },
      { name: 'MoonShot', bet: 25, multiplier: 5.0 },
      { name: 'DiamondHands', bet: 100, multiplier: 3.2 },
      { name: 'RocketMan', bet: 75, multiplier: 7.8 }
    ]);

    // multiplier progression loop
    // 50ms tick gives smooth updates
    gameIntervalRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - gameStartTime.current) / 1000;
      // exponential growth that feels like common crash games
      const rawMultiplier = Math.pow(1.00408, elapsed * 60);
      const newMultiplier = parseFloat(rawMultiplier.toFixed(2));

      // Crash detection
      if (newMultiplier >= newCrashPoint) {
        // crash
        setCurrentMultiplier(newCrashPoint);
        setGameState('crashed');

        safeClearInterval(gameIntervalRef);

        // push to history
        setHistory(prev => [newCrashPoint, ...prev].slice(0, 10));

        // if player had bet and didn't cash out -> lost (we keep playerBet to show lost)
        setTimeout(() => {
          // reset bet after showing results briefly
          setPlayerBet(null);
        }, 1000);

        // schedule next countdown
        setTimeout(() => {
          // start countdown to next game (7s)
          // reuse startCountdown below after we define it (we call it via ref to avoid dep cycle)
          startCountdown(7);
        }, 3000);
      } else {
        setCurrentMultiplier(newMultiplier);

        // random fake players cashing out logic (small chance)
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
  }, [clearAllIntervals, generateCrashPoint]); // intentionally limited deps

  // We need startCountdown to be defined after startNewGame is declared; using useCallback.
  const startCountdown = useCallback((duration = 7) => {
    clearAllIntervals();
    setCountdown(duration);
    setGameState('waiting');

    // clear any existing countdown just in case
    safeClearInterval(countdownIntervalRef);

    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          safeClearInterval(countdownIntervalRef);
          // immediately start new game
          startNewGame();
          return duration; // reset value for UI after next round started
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearAllIntervals, startNewGame]);

  // --- Betting ---
  const placeBet = useCallback(() => {
    // only allow placing in waiting phase with sufficient time
    if (gameState !== 'waiting' || betAmount > balance || countdown <= 3) return;

    setBalance(prev => prev - betAmount);
    setPlayerBet({ amount: betAmount });
    setCashedOut(false);
    // indicate temporarily a betting state if you want
    setGameState('waiting'); // keep showing waiting; actual flying will start by startNewGame
    // console.log('Bet placed:', { amount: betAmount, balance });
  }, [betAmount, balance, countdown, gameState]);

  // Perform cashout (manual or auto)
  const performCashOut = useCallback((multiplier: number) => {
    if (!playerBet || cashedOut || gameState !== 'flying') {
      return;
    }

    const winAmount = Math.round(playerBet.amount * multiplier * 100) / 100;

    setBalance(prev => parseFloat((prev + winAmount).toFixed(2)));
    setCashedOut(true);
    setPlayerBet(prev => (prev ? { ...prev, multiplier } : prev));

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setChatMessages(prev => [{ user: 'You', message: `Cashed out at ${multiplier}x`, time: timeString }, ...prev].slice(0, 10));
  }, [playerBet, cashedOut, gameState]);

  const cashOut = useCallback(() => {
    performCashOut(currentMultiplier);
  }, [currentMultiplier, performCashOut]);
useEffect(() => {
  if (!videoRef.current) return;

  if (gameState === "crashed") {
    // Just hide the video visually
    setShowVideo(false);
  }

  if (gameState === "waiting") {
    // Show video again
    setShowVideo(true);

    // Reset to beginning WITHOUT calling play()
    videoRef.current.currentTime = 0;
  }
}, [gameState]);


  // Auto cashout effect
  useEffect(() => {
    if (gameState === 'flying' && playerBet && !cashedOut && autoCashout > 0 && currentMultiplier >= autoCashout) {
      performCashOut(autoCashout);
    }
  }, [gameState, playerBet, cashedOut, autoCashout, currentMultiplier, performCashOut]);

  // Initial mount: generate gameHash and start countdown
  useEffect(() => {
    setMounted(true);
    setGameHash(Math.random().toString(36).slice(2, 11));
    startCountdown(7);

    return () => {
      clearAllIntervals();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // UI helper functions
  const getMultiplierColor = () => {
  if (gameState === "crashed")
    return "text-red-700 drop-shadow-[0_0_10px_rgba(255,0,0,0.6)]";

  if (currentMultiplier >= 50)
    return "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-[0_0_12px_rgba(255,100,0,0.9)]";

  if (currentMultiplier >= 20)
    return "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_0_10px_rgba(180,0,255,0.8)]";

  if (currentMultiplier >= 10)
    return "text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 drop-shadow-[0_0_12px_rgba(140,0,255,0.7)]";

  if (currentMultiplier >= 5)
    return "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 drop-shadow-[0_0_10px_rgba(255,180,0,0.8)]";

  if (currentMultiplier >= 2)
    return "text-green-500 drop-shadow-[0_0_6px_rgba(0,255,100,0.5)]";

  return "text-yellow-300 drop-shadow-[0_0_5px_rgba(255,255,150,0.6)]";
};


  const getBetButtonText = () => {
    if (gameState === 'waiting') return countdown > 3 ? `BET $${betAmount.toFixed(2)}` : 'BETTING CLOSED';
    if (gameState === 'betting') return 'BETTING...';
    if (gameState === 'flying' && playerBet && !cashedOut) return 'CASH OUT';
    if (gameState === 'crashed') return 'ROUND FINISHED';
    return 'NEXT ROUND';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white px-2 sm:px-4">

      {/* Header */}
      <div className="bg-gray-800 border-b-2 border-yellow-500 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-yellow-400">🚀 CRASH</h1>
            <div className="text-lg">Balance: <span className="text-green-400">${balance.toLocaleString()}</span></div>
          </div>
          <div className="flex gap-4">
            <div className="text-sm">House Edge: <span className="text-yellow-400">1%</span></div>
            <div className="text-sm">Max Win: <span className="text-yellow-400">10,000x</span></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-3">
            {/* Game Display */}
            <div className="bg-gray-800 rounded-lg border-1 border-gray-600 p-3 mb-6">
              <div className="relative h-68 sm:h-80 md:h-96 lg:h-[32rem] xl:h-[32rem] rounded-lg overflow-hidden border-2 border-gray-500">



  {/* FULL SCREEN VIDEO BACKGROUND */}
<video
  ref={videoRef}
  src="/animation/animation.mp4"
  muted
  loop
  autoPlay
  playsInline
 className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
  showVideo ? "opacity-100" : "opacity-0"
}`}

/>



  {/* Dark overlay so multiplier text is readable */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* Multiplier Display */}
<div
  className={`absolute z-20 
    ${
      gameState === "flying"
        ? "top-4 right-4"  // TOP-RIGHT for flying
        : "inset-0 flex items-center justify-center"
    }`}
>
  <div
    className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold 
      ${getMultiplierColor()} 
      transition-colors duration-300`}
  >
    {gameState === "waiting" ? (
      <div className="text-center">
        <div className="text-3xl text-gray-200 mb-4">Next Round Starting In</div>
        <div className="text-5xl sm:text-6xl md:text-7xl text-yellow-400 animate-pulse">
          {countdown}
        </div>
        <div className="text-lg text-gray-300 mt-4">Place your bets!</div>
      </div>
    ) : gameState === "crashed" ? (
      <div className="text-center animate-pulse">
        <div className="text-4xl sm:text-5xl md:text-6xl text-red-500 mb-2">
          CRASHED!
        </div>
        <div className="text-4xl text-red-400">at {crashPoint}x</div>
      </div>
    ) : (
      `${currentMultiplier}x`
    )}
  </div>
</div>



  {/* Crash effect */}
  {gameState === 'crashed' && (
    <div className="absolute inset-0 flex items-center justify-center z-30">
      <div className="text-6xl animate-bounce">💥</div>
    </div>
  )}

  {/* Game stats */}
  <div className="absolute top-4 left-4 text-sm text-gray-300 z-30">
    Game Hash: #{gameHash}
  </div>
</div>


              {/* Player Status */}
              {playerBet && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-300">Your Bet: </span>
                      <span className="text-green-400 font-bold">${playerBet.amount.toFixed(2)}</span>
                      {autoCashout > 0 && gameState === 'flying' && !cashedOut && (
                        <div className="text-xs text-blue-400 mt-1">
                          Auto cashout at {autoCashout}x
                        </div>
                      )}
                    </div>
                    <div>
                      {cashedOut ? (
                        <div className="text-green-400">
                          <span className="font-bold">Won: ${(playerBet.amount * (playerBet.multiplier ?? 0)).toFixed(2)}</span>
                          <span className="ml-2">@ {playerBet.multiplier}x</span>
                        </div>
                      ) : gameState === 'crashed' ? (
                        <span className="text-red-400 font-bold">Lost ${playerBet.amount.toFixed(2)}</span>
                      ) : (
                        <div className="text-yellow-400">
                          <span className="ml-2">@ {currentMultiplier}x</span>
                          {autoCashout > 0 && currentMultiplier >= autoCashout * 0.9 && (
                            <div className="text-xs text-orange-400 mt-1 animate-pulse">
                              Auto cashout approaching!
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-gray-800 rounded-lg border-2 border-gray-600 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                {/* Bet Amount */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Bet Amount</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Math.max(1, Math.floor(parseFloat(e.target.value || '1'))))}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                      min={1}
                      max={balance}
                    />
                    <button
                      onClick={() => setBetAmount(prev => Math.min(prev * 2, balance))}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                    >
                      2×
                    </button>
                    <button
                      onClick={() => setBetAmount(balance)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[10, 50, 100, 500].map(amount => (
                      <button
                        key={amount}
                        onClick={() => setBetAmount(amount)}
                        className="flex-1 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                        disabled={amount > balance}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto Cashout */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Auto Cashout</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={autoCashout}
                      onChange={(e) => setAutoCashout(Math.max(0, parseFloat(e.target.value || '0')))}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                      min={0}
                    />
                    <button
                      onClick={() => setAutoCashout(0)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors text-sm"
                    >
                      OFF
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[2, 3, 5, 10].map(multiplier => (
                      <button
                        key={multiplier}
                        onClick={() => setAutoCashout(multiplier)}
                        className="flex-1 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                      >
                        {multiplier}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={gameState === 'waiting' && countdown > 3 ? placeBet : (gameState === 'flying' && playerBet && !cashedOut) ? cashOut : undefined}
                disabled={
                  (gameState === 'waiting' && (betAmount > balance || countdown <= 3)) ||
                  gameState === 'betting' ||
                  (gameState === 'flying' && (!playerBet || cashedOut)) ||
                  gameState === 'crashed'
                }
                className={`w-full mt-4 py-3 text-xl sm:text-2xl font-bold rounded-lg transition-all duration-300 ${
                  gameState === 'flying' && playerBet && !cashedOut
                    ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                    : gameState === 'waiting' && countdown > 3
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : gameState === 'waiting' && countdown <= 3
                    ? 'bg-orange-600 text-white cursor-not-allowed'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {getBetButtonText()}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* History */}
            <div className="bg-gray-800 rounded-lg border-2 border-gray-600 p-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">Game History</h3>
              <div className="space-y-2">
                {history.map((crash, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                    <span className="text-sm text-gray-300">#{history.length - idx}</span>
                    <span className={`font-bold ${
                      crash >= 10 ? 'text-purple-400' :
                      crash >= 5 ? 'text-yellow-400' :
                      crash >= 2 ? 'text-green-400' :
                      'text-red-400'
                    }`}>
                      {crash}x
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Players */}
            <div className="bg-gray-800 rounded-lg border-2 border-gray-600 p-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">Active Players</h3>
              <div className="space-y-2">
                {activePlayers.map((player, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-700 rounded text-sm">
                    <span className="text-gray-300">{player.name}</span>
                    <div className="text-right">
                      <div className="text-green-400">${player.bet.toFixed(2)}</div>
                      {player.multiplier && (
                        <div className="text-yellow-400">{player.multiplier}x</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="bg-gray-800 rounded-lg border-2 border-gray-600 p-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">Chat</h3>
              <div className="space-y-2 h-32 overflow-y-auto">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="text-blue-400">{msg.user}</span>
                    <span className="text-gray-400 ml-2">{msg.time}</span>
                    <div className="text-gray-300">{msg.message}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrashGame;
