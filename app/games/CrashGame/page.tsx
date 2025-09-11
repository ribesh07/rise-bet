
'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

const CrashGame = () => {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashout, setAutoCashout] = useState(2.00);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [gameState, setGameState] = useState('waiting'); // waiting, betting, flying, crashed
  const [crashPoint, setCrashPoint] = useState(0);
  const [playerBet, setPlayerBet] = useState(null);
  const [cashedOut, setCashedOut] = useState(false);
  const [history, setHistory] = useState([2.34, 1.23, 5.67, 1.89, 3.45, 7.23, 1.02, 4.56]);
  const [countdown, setCountdown] = useState(7);
  const [activePlayers, setActivePlayers] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { user: 'Player123', message: 'Nice win!', time: '12:34' },
    { user: 'CrashMaster', message: 'Going for 10x', time: '12:33' },
    { user: 'LuckyGuy', message: 'Cashed out at 3.2x', time: '12:32' }
  ]);
  const [gameHash, setGameHash] = useState('loading...');
  const [mounted, setMounted] = useState(false);

  const gameIntervalRef = useRef(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameStartTime = useRef(0);

  // Generate crash point using house edge algorithm
  const generateCrashPoint = () => {
    const houseEdge = 0.01;
    const random = Math.random();
    const result = Math.floor((100 / (100 * random)) * (1 - houseEdge) * 100) / 100;
    return Math.max(1.01, parseFloat(result.toFixed(2))); // Ensure minimum 1.01x and 2 decimal places
  };

  // Clear all intervals
  const clearAllIntervals = useCallback(() => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  // Start countdown for next game
  const startCountdown = useCallback((duration = 7) => {
    clearAllIntervals();
    setCountdown(duration);
    setGameState('waiting');
    
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
          startNewGame();
          return duration;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Start new game
  const startNewGame = useCallback(() => {
    clearAllIntervals();
    
    const newCrashPoint = generateCrashPoint();
    setCrashPoint(newCrashPoint);
    setCurrentMultiplier(1.00);
    setGameState('flying');
    setCashedOut(false);
    // Don't reset playerBet here - it should only be reset after the game ends
    gameStartTime.current = Date.now();
    
    // Generate a new game hash for each game
    setGameHash(Math.random().toString(36).substr(2, 9));
    
    // Generate fake active players
    setActivePlayers([
      { name: 'CryptoKing', bet: 50, multiplier: null },
      { name: 'MoonShot', bet: 25, multiplier: null },
      { name: 'DiamondHands', bet: 100, multiplier: null },
      { name: 'RocketMan', bet: 75, multiplier: null },
    ]);

    // Start multiplier animation
    gameIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - gameStartTime.current) / 1000;
      const rawMultiplier = Math.pow(1.00408, elapsed * 60);
      const newMultiplier = parseFloat(rawMultiplier.toFixed(2)); // Round to 2 decimal places
      
      if (newMultiplier >= newCrashPoint) {
        setCurrentMultiplier(newCrashPoint);
        setGameState('crashed');
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
        
        // Auto-add to history
        setHistory(prev => [newCrashPoint, ...prev.slice(0, 9)]);
        
        // Reset player bet when game crashes
        setTimeout(() => {
          setPlayerBet(null); // Reset here after game is over
        }, 1000);
        
        // Start countdown for next game after a delay
        setTimeout(() => {
          startCountdown(7);
        }, 3000);
      } else {
        setCurrentMultiplier(newMultiplier);
        
        // Update fake players cashing out
        setActivePlayers(prev => prev.map(player => {
          if (!player.multiplier && Math.random() < 0.002) {
            return { ...player, multiplier: newMultiplier };
          }
          return player;
        }));
      }
    }, 50);
  }, [clearAllIntervals, startCountdown]);

  // Place bet
  const placeBet = useCallback(() => {
    if (gameState !== 'waiting' || betAmount > balance || countdown <= 3) return;
    
    setBalance(prev => prev - betAmount);
    setPlayerBet({ amount: betAmount, multiplier: null });
    console.log('Bet placed:', { amount: betAmount, balance });
  }, [gameState, betAmount, balance, countdown]);

  // Cash out function
  const performCashOut = useCallback((multiplier) => {
    console.log('performCashOut called:', { playerBet, cashedOut, gameState, multiplier });
    
    if (!playerBet || cashedOut || gameState !== 'flying') {
      console.log('Cash out blocked:', { hasPlayerBet: !!playerBet, cashedOut, gameState });
      return;
    }
    
    const winAmount = playerBet.amount * multiplier;
    console.log('Cashing out:', { winAmount, betAmount: playerBet.amount, multiplier });
    
    setBalance(prev => {
      console.log('Balance update:', { prev, winAmount, newBalance: prev + winAmount });
      return prev + winAmount;
    });
    setCashedOut(true);
    setPlayerBet(prev => ({ ...prev, multiplier: multiplier }));
    
    // Add chat message
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setChatMessages(prev => [{
      user: 'You',
      message: `Cashed out at ${multiplier}x`,
      time: timeString
    }, ...prev.slice(0, 9)]);
  }, [playerBet, cashedOut, gameState]);

  // Manual cash out
  const cashOut = useCallback(() => {
    performCashOut(currentMultiplier);
  }, [currentMultiplier, performCashOut]);

  // Auto cashout effect
  useEffect(() => {
    if (gameState === 'flying' && playerBet && !cashedOut && autoCashout > 0 && currentMultiplier >= autoCashout) {
      console.log('Auto cashout triggered!', {
        currentMultiplier,
        autoCashout,
        playerBet,
        cashedOut
      });
      performCashOut(autoCashout);
    }
  }, [gameState, playerBet, cashedOut, autoCashout, currentMultiplier, performCashOut]);

  // Initialize game with proper startup delay
  useEffect(() => {
    setMounted(true);
    // Generate a stable game hash on client mount
    setGameHash(Math.random().toString(36).substr(2, 9));
    
    // Start initial countdown
    startCountdown(7);

    return () => {
      clearAllIntervals();
    };
  }, [startCountdown, clearAllIntervals]);

  const getMultiplierColor = () => {
    if (gameState === 'crashed') return 'text-red-500';
    if (currentMultiplier >= 10) return 'text-purple-400';
    if (currentMultiplier >= 5) return 'text-yellow-400';
    if (currentMultiplier >= 2) return 'text-green-400';
    return 'text-white';
  };

  const getBetButtonText = () => {
    if (gameState === 'waiting') return countdown > 3 ? `BET $${betAmount.toFixed(2)}` : 'BETTING CLOSED';
    if (gameState === 'betting') return 'BETTING...';
    if (gameState === 'flying' && playerBet && !cashedOut) return 'CASH OUT';
    if (gameState === 'crashed') return 'ROUND FINISHED';
    return 'NEXT ROUND';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
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

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-3">
            {/* Game Display */}
            <div className="bg-gray-800 rounded-lg border-2 border-gray-600 p-6 mb-6">
              <div className="relative h-96 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg overflow-hidden border-2 border-gray-500">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4ade80" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Multiplier Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`text-8xl font-bold ${getMultiplierColor()} transition-colors duration-300`}>
                    {gameState === 'waiting' ? (
                      <div className="text-center">
                        <div className="text-3xl text-gray-400 mb-4">Next Round Starting In</div>
                        <div className="text-7xl text-yellow-400 animate-pulse">{countdown}</div>
                        <div className="text-lg text-gray-500 mt-4">Place your bets!</div>
                      </div>
                    ) : gameState === 'crashed' ? (
                      <div className="text-center animate-pulse">
                        <div className="text-6xl text-red-500 mb-2">CRASHED!</div>
                        <div className="text-4xl text-red-400">at {crashPoint}x</div>
                        <div className="text-lg text-gray-400 mt-4">Preparing next round...</div>
                      </div>
                    ) : (
                      `${currentMultiplier}x`
                    )}
                  </div>
                </div>

                {/* Rocket Animation */}
                {gameState === 'flying' && (
                  <div 
                    className="absolute bottom-10 left-10 text-4xl transition-all duration-300 ease-out"
                    style={{
                      transform: `translate(${(currentMultiplier - 1) * 50}px, ${-(currentMultiplier - 1) * 20}px) rotate(${Math.min((currentMultiplier - 1) * 10, 45)}deg)`
                    }}
                  >
                    🚀
                  </div>
                )}

                {/* Crash Effect */}
                {gameState === 'crashed' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl animate-bounce">💥</div>
                  </div>
                )}

                {/* Game Stats */}
                <div className="absolute top-4 left-4">
                  <div className="text-sm text-gray-300">Game Hash: #{mounted ? gameHash : 'loading...'}</div>
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
                          <span className="font-bold">Won: ${(playerBet.amount * playerBet.multiplier)}</span>
                          <span className="ml-2">@ {playerBet.multiplier}x</span>
                        </div>
                      ) : gameState === 'crashed' ? (
                        <span className="text-red-400 font-bold">Lost ${playerBet.amount.toFixed(2)}</span>
                      ) : (
                        <div className="text-yellow-400">
                          {/* <span className="font-bold">Potential: ${(playerBet.amount * currentMultiplier).toFixed(2)}</span> */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bet Amount */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Bet Amount</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                      min="1"
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
                      onChange={(e) => setAutoCashout(parseFloat(e.target.value) || 0)}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                      min="1.1"
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
                className={`w-full mt-6 py-4 text-2xl font-bold rounded-lg transition-all duration-300 ${
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
