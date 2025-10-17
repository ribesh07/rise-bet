"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  RotateCcw, 
  Coins, 
  Bomb,
  Gem,
  DollarSign,
  Settings,
  TrendingUp,
  Sparkles
} from "lucide-react";

interface Cell {
  id: number;
  revealed: boolean;
  isMine: boolean;
  isGem: boolean;
  revealOrder?: number; // Order in which this gem was revealed
}

interface GameState {
  grid: Cell[];
  gameStatus: 'idle' | 'playing' | 'won' | 'lost';
  revealedCount: number;
  workingGemsCount: number; // Only count first few gems as "working"
  currentMultiplier: number;
  totalMines: number;
  isGameStarted: boolean;
}

export default function MinesGame() {
  const GRID_SIZE = 25; // 5x5 grid
  
  // Game state
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [minesCount, setMinesCount] = useState(3);
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    gameStatus: 'idle',
    revealedCount: 0,
    workingGemsCount: 0,
    currentMultiplier: 1,
    totalMines: 3,
    isGameStarted: false
  });
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [autoMode, setAutoMode] = useState(false);
  const [clickedCells, setClickedCells] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [previousMultiplier, setPreviousMultiplier] = useState(1);
  const [multiplierChanged, setMultiplierChanged] = useState(false);

  // Modified multiplier calculation with mines and Rise consideration
  const calculateMultiplier = useCallback((workingGems: number, totalMines: number, RiseAmount: number) => {
    console.log(`calculateMultiplier called: workingGems=${workingGems}, totalMines=${totalMines}, RiseAmount=${RiseAmount}`);
    
    if (workingGems === 0) return 1.00;
    
    const totalCells = GRID_SIZE;
    const safeCells = totalCells - totalMines;
    
    console.log(`totalCells=${totalCells}, safeCells=${safeCells}`);
    
    // Base multiplier calculation
    let multiplier = 1;
    for (let i = 0; i < workingGems; i++) {
      const remainingCells = totalCells - i;
      const remainingSafeCells = safeCells - i;
      const stepMultiplier = remainingCells / remainingSafeCells;
      multiplier = multiplier * stepMultiplier;
      console.log(`Step ${i + 1}: ${remainingCells}/${remainingSafeCells} = ${stepMultiplier}, cumulative = ${multiplier}`);
    }
    
    // Apply mines bonus - more mines = higher multiplier
    const minesBonus = 1 + (totalMines * 0.15); // 15% bonus per mine
    
    // Apply Rise bonus - higher Rises get slight multiplier boost
    const RiseBonus = 1 + Math.log10(Math.max(1, RiseAmount)) * 0.05; // Logarithmic Rise bonus
    
    console.log(`Base multiplier: ${multiplier}, Mines bonus: ${minesBonus}, Rise bonus: ${RiseBonus}`);
    
    // Apply house edge (1% - Rise's actual edge)
    const finalMultiplier = multiplier * minesBonus * RiseBonus * 0.99;
    
    console.log(`Final multiplier: ${finalMultiplier}`);
    
    return parseFloat(finalMultiplier.toFixed(4));
  }, []);

  // Initialize empty grid (Rise style - mines placed on first click)
  const initializeGame = useCallback(() => {
    const grid: Cell[] = Array.from({ length: GRID_SIZE }, (_, index) => ({
      id: index,
      revealed: false,
      isMine: false,
      isGem: false
    }));

    setGameState({
      grid,
      gameStatus: 'idle',
      revealedCount: 0,
      workingGemsCount: 0,
      currentMultiplier: 1.00,
      totalMines: minesCount,
      isGameStarted: false
    });
  }, [minesCount]);

  // Rise style - place bet and prepare for first click
  const startGame = useCallback(() => {
    if (bet <= 0 || bet > balance) return;
    
    // Deduct bet amount
    setBalance(prev => prev - bet);
    setLastWin(null);
    setClickedCells(new Set());
    setIsProcessing(false);
    setPreviousMultiplier(1);
    setMultiplierChanged(false);
    
    // Initialize empty grid
    initializeGame();
    setGameState(prev => ({ ...prev, gameStatus: 'playing', isGameStarted: true }));
  }, [bet, balance, initializeGame]);

  // Rise style - place mines on first click, ensure first click is never a mine
  const placeMines = useCallback((firstClickId: number, mineCount: number) => {
    const minePositions = new Set<number>();
    const availablePositions = Array.from({ length: GRID_SIZE }, (_, i) => i)
      .filter(i => i !== firstClickId); // Exclude first click position
    
    // Randomly place mines
    while (minePositions.size < mineCount) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      const position = availablePositions[randomIndex];
      minePositions.add(position);
      availablePositions.splice(randomIndex, 1);
    }
    
    return minePositions;
  }, []);

  // Reveal cell with Rise's exact behavior
  const revealCell = useCallback((cellId: number) => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;
      if (isProcessing) return prev;
      if (clickedCells.has(cellId)) return prev;
      
      const cell = prev.grid[cellId];
      if (!cell || cell.revealed) return prev;
      
      setIsProcessing(true);
      setClickedCells(prevCells => new Set([...prevCells, cellId]));
      let newGrid = [...prev.grid];
      
      // First click - place mines (only if it's actually the first click in the game)
      if (prev.revealedCount === 0 && prev.isGameStarted) {
        const minePositions = placeMines(cellId, prev.totalMines);
        newGrid = newGrid.map((cell, index) => ({
          ...cell,
          isMine: minePositions.has(index),
          isGem: !minePositions.has(index)
        }));
      }
      
      const targetCell = newGrid[cellId];
      if (targetCell.revealed) {
        setIsProcessing(false);
        return prev;
      }
      
      targetCell.revealed = true;
      
      if (targetCell.isMine) {
        // Game over - reveal all mines
        newGrid.forEach(c => {
          if (c.isMine) c.revealed = true;
        });
        
        setIsProcessing(false);
        
        // Rise style - no auto reset, show game over state
        return {
          ...prev,
          grid: newGrid,
          gameStatus: 'lost',
          isGameStarted: true
        };
      } else {
        // Gem revealed
        const newRevealedCount = prev.revealedCount + 1;
        
        // Set the reveal order for this gem
        targetCell.revealOrder = newRevealedCount;
        
        // Determine maximum working gems based on mines count
        const maxWorkingGems = Math.max(1, Math.floor((GRID_SIZE - prev.totalMines) / 2)); // Half of safe cells or minimum 1
        
        // All gems are working gems (like real Rise)
        const newWorkingGemsCount = newRevealedCount;
        
        console.log(`Debug: Revealed ${newRevealedCount}, All gems working: ${newWorkingGemsCount}`);
        
        const newMultiplier = calculateMultiplier(newWorkingGemsCount, prev.totalMines, bet);
        
        console.log(`Debug: Previous multiplier: ${prev.currentMultiplier}, New multiplier: ${newMultiplier}`);
        
        // Trigger multiplier change animation if multiplier actually changed
        if (newMultiplier !== prev.currentMultiplier) {
          setPreviousMultiplier(prev.currentMultiplier);
          setMultiplierChanged(true);
          setTimeout(() => setMultiplierChanged(false), 1000);
        }
        
        console.log(`Debug: New multiplier: ${newMultiplier}`);
        
        setIsProcessing(false);
        
        const newState = {
          ...prev,
          grid: newGrid,
          revealedCount: newRevealedCount,
          workingGemsCount: newWorkingGemsCount,
          currentMultiplier: newMultiplier,
          isGameStarted: true
        };
        
        console.log(`Debug: Returning new state with multiplier: ${newState.currentMultiplier}`);
        
        return newState;
      }
    });
  }, [isProcessing, clickedCells, calculateMultiplier, placeMines, bet]);

  // Rise style cash out
  const cashOut = useCallback(() => {
    setIsProcessing(false);
    
    setGameState(prevGameState => {
      if (prevGameState.gameStatus !== 'playing' || prevGameState.revealedCount === 0) {
        return prevGameState;
      }
      
      // Exact payout calculation
      const winAmount = parseFloat((bet * prevGameState.currentMultiplier).toFixed(2));
      
      setBalance(prev => parseFloat((prev + winAmount).toFixed(2)));
      setLastWin(prevGameState.currentMultiplier);
      
      return { ...prevGameState, gameStatus: 'won' };
    });
  }, [bet]);

  // Rise style reset
  const resetGame = useCallback(() => {
    setClickedCells(new Set());
    setIsProcessing(false);
    setLastWin(null);
    setPreviousMultiplier(1);
    setMultiplierChanged(false);
    initializeGame();
  }, [initializeGame]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Rise's bet values
  const chipValues = [0.1, 1, 10, 100];

  // Potential payout with exact precision
  const potentialPayout = useMemo(() => {
    return parseFloat((bet * gameState.currentMultiplier).toFixed(2));
  }, [bet, gameState.currentMultiplier]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-slate-100 flex items-center justify-center py-10">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="grid lg:grid-cols-[auto_400px] gap-8 w-full max-w-7xl px-4 relative z-10">
        {/* Game Board */}
        <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-700/50 relative overflow-hidden">
          {/* Card background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Bomb className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Mines</h1>
              </div>
              <div className="flex items-center gap-3 bg-slate-900/50 rounded-xl px-4 py-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-slate-300">Balance:</span>
                <span className="font-bold text-yellow-400">${balance.toLocaleString()}</span>
              </div>
            </div>

            {/* Game Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                <div className="text-xs text-slate-400 mb-1">Mines</div>
                <div className="text-2xl font-bold text-red-400">{gameState.totalMines}</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                <div className="text-xs text-slate-400 mb-1">Gems Found</div>
                <div className="text-2xl font-bold text-emerald-400">
                  {gameState.revealedCount}
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 relative overflow-hidden">
                <div className="text-xs text-slate-400 mb-1">Multiplier</div>
                <div className="relative">
                  <motion.div 
                    className="text-2xl font-bold text-blue-400"
                    animate={{
                      scale: multiplierChanged ? [1, 1.2, 1] : 1,
                      color: multiplierChanged ? ["#60a5fa", "#10b981", "#60a5fa"] : "#60a5fa"
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    {gameState.currentMultiplier.toFixed(2)}x
                  </motion.div>
                  <AnimatePresence>
                    {multiplierChanged && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: -25 }}
                        exit={{ opacity: 0, y: -35 }}
                        className="absolute top-0 left-0 text-sm font-bold text-emerald-400 pointer-events-none"
                      >
                        +{(gameState.currentMultiplier - previousMultiplier).toFixed(2)}x
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {multiplierChanged && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"
                    style={{ transformOrigin: "left" }}
                  />
                )}
              </div>
            </div>

            {/* Game Grid */}
            <div className="bg-slate-900/30 rounded-2xl p-6 border border-slate-700/30">
              <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
                {gameState.grid.map((cell) => (
                  <motion.button
                    key={cell.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!cell.revealed && gameState.gameStatus === 'playing') {
                        revealCell(cell.id);
                      }
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    disabled={cell.revealed || gameState.gameStatus !== 'playing'}
                    className={`
                      aspect-square rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all duration-200 select-none
                      ${cell.revealed 
                        ? cell.isMine 
                          ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                          : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' // All gems are working
                        : gameState.gameStatus === 'playing'
                          ? 'bg-slate-800/50 border-slate-600 hover:border-slate-500 hover:bg-slate-700/50 cursor-pointer'
                          : 'bg-slate-800/30 border-slate-700 cursor-not-allowed'
                      }
                    `}
                    whileHover={!cell.revealed && gameState.gameStatus === 'playing' ? { scale: 1.05 } : {}}
                    whileTap={!cell.revealed && gameState.gameStatus === 'playing' ? { scale: 0.95 } : {}}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: cell.id * 0.02 }}
                  >
                    <AnimatePresence>
                      {cell.revealed && (
                        <motion.div
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          {cell.isMine ? (
                            <Bomb className="w-6 h-6" />
                          ) : (
                            <Gem className="w-6 h-6" /> // All gems are working
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Game Status */}
            <div className="mt-6 text-center">
              {gameState.gameStatus === 'idle' && (
                <div className="text-slate-400">Place your bet and start the game!</div>
              )}
              {gameState.gameStatus === 'playing' && (
                <div className="text-blue-400">Click tiles to find gems. Cash out anytime!</div>
              )}
              {gameState.gameStatus === 'lost' && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-red-400 font-bold text-lg"
                >
                  💥 BOOM! You hit a mine!
                </motion.div>
              )}
              {gameState.gameStatus === 'won' && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-emerald-400 font-bold text-lg"
                >
                  🎉 Cashed out successfully!
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-700/50 relative overflow-hidden">
          {/* Card background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500" />
          
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Game Controls</h2>

            {/* Mines Count Setting */}
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-300 mb-3 block">Number of Mines</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 3, 5, 10, 15].map((count) => (
                  <button
                    key={count}
                    onClick={() => setMinesCount(count)}
                    disabled={gameState.gameStatus === 'playing'}
                    className={`
                      px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                      ${minesCount === count
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-slate-900/60 border border-slate-700 text-slate-200 hover:border-slate-600 hover:bg-slate-800/80'
                      }
                      ${gameState.gameStatus === 'playing' ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick bet buttons */}
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-300 mb-3 block">Quick Bet</label>
              <div className="grid grid-cols-4 gap-2">
                {chipValues.map((v) => (
                  <button
                    key={v}
                    onClick={() => setBet(v)}
                    disabled={gameState.gameStatus === 'playing'}
                    className={`
                      px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                      ${bet === v
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105'
                        : 'bg-slate-900/60 border border-slate-700 text-slate-200 hover:border-slate-600 hover:bg-slate-800/80'
                      }
                      ${gameState.gameStatus === 'playing' ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
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
                    step="0.01"
                    value={bet}
                    onChange={(e) => setBet(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                    disabled={gameState.gameStatus === 'playing'}
                    className="bg-transparent text-slate-100 font-medium text-lg w-full outline-none disabled:opacity-50"
                    min={0.01}
                  />
                </div>
                <div className="flex gap-1">
                  <button
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors disabled:opacity-50"
                    onClick={() => setBet((b) => Math.max(0.01, b / 2))}
                    disabled={gameState.gameStatus === 'playing'}
                  >
                    1/2
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors disabled:opacity-50"
                    onClick={() => setBet((b) => Math.min(balance, b * 2))}
                    disabled={gameState.gameStatus === 'playing'}
                  >
                    2x
                  </button>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {gameState.gameStatus === 'idle' && (
                <button
                  onClick={startGame}
                  disabled={bet <= 0 || bet > balance}
                  className="flex items-center justify-center gap-3 rounded-2xl px-6 py-4 font-bold text-lg shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 hover:shadow-xl hover:scale-105"
                >
                  <Play className="w-5 h-5" />
                  Start Game
                </button>
              )}
              
              {gameState.gameStatus === 'playing' && (
                <motion.button
                  onClick={() => cashOut()}
                  disabled={gameState.revealedCount === 0}
                  className="flex items-center justify-center gap-3 rounded-2xl px-6 py-4 font-bold text-lg shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 hover:shadow-xl hover:scale-105 relative overflow-hidden"
                  animate={{
                    scale: multiplierChanged ? [1, 1.05, 1] : 1,
                    boxShadow: multiplierChanged ? 
                      ["0 10px 25px rgba(0,0,0,0.3)", "0 15px 35px rgba(16, 185, 129, 0.4)", "0 10px 25px rgba(0,0,0,0.3)"] : 
                      "0 10px 25px rgba(0,0,0,0.3)"
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <DollarSign className="w-5 h-5" />
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <span>Cash Out</span>
                      <motion.span
                        className="font-bold"
                        animate={{
                          color: multiplierChanged ? ["#ffffff", "#10b981", "#ffffff"] : "#ffffff"
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        ${potentialPayout.toFixed(2)}
                      </motion.span>
                    </div>
                    <div className="text-xs opacity-75">
                      {gameState.currentMultiplier.toFixed(2)}x multiplier
                    </div>
                  </div>
                  {multiplierChanged && (
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      style={{ transform: "skewX(-20deg)" }}
                    />
                  )}
                </motion.button>
              )}

              {(gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && (
                <button
                  onClick={resetGame}
                  className="flex items-center justify-center gap-3 rounded-2xl px-6 py-4 font-bold text-lg shadow-lg transition-all duration-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-xl hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5" />
                  New Game
                </button>
              )}
            </div>

            {/* Result panel */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-2xl border border-slate-700/50 p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-300">Game Result</h3>
                {lastWin !== null && (
                  <div className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400">
                    ${(bet * lastWin).toFixed(2)}
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold tracking-tight">
                {gameState.gameStatus === 'idle' && <span className="text-slate-500">—</span>}
                {gameState.gameStatus === 'playing' && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                    <span className="text-blue-400">${potentialPayout.toFixed(2)}</span>
                  </div>
                )}
                {gameState.gameStatus === 'lost' && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-red-400">LOST</span>
                    <div className="px-3 py-1 rounded-lg text-sm font-medium bg-red-500/20 text-red-300">
                      -${bet.toFixed(2)}
                    </div>
                  </motion.div>
                )}
                {gameState.gameStatus === 'won' && lastWin !== null && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-emerald-400">{lastWin.toFixed(2)}x</span>
                    <div className="px-3 py-1 rounded-lg text-sm font-medium bg-emerald-500/20 text-emerald-300">
                      +${(bet * lastWin).toFixed(2)}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="text-xs text-slate-500 space-y-1">
              <p>• Click tiles to reveal gems and avoid mines</p>
              <p>• Each gem increases your multiplier</p>
              <p>• More mines = higher multiplier bonus</p>
              <p>• Higher Rises get multiplier boost</p>
              <p>• Cash out anytime to secure your winnings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
