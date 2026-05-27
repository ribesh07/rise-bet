"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  RotateCcw, 
  TrendingUp,
  Sparkles,
  Info,
  Gem
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import TopNavbar from "@/components/topnavbar";
import Sidebar from "@/components/sidebar";
import { apiRequest } from "@/utils/ApiHelper";

interface Tile {
  id: number;
  revealed: boolean;
  isDiamond: boolean;
}

export default function DiamondGame() {
  const GRID_SIZE = 25;
  const [bet, setBet] = useState(10);
  const [minesCount, setMinesCount] = useState(3);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [revealedCount, setRevealedCount] = useState(0);
  
  const [balance, setBalance] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  const { currency, setCurrency } = useCurrency();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchDashboardDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("userId");
      const res = await apiRequest(`/users/${id}/details`, true, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.success) {
        setDashboardDetails(res.data);
        const wallets = res.data.wallets || [];
        const initialWallet = wallets.find((w: any) => String(w.currency || w.symbol).toUpperCase() === String(currency || "").toUpperCase()) || wallets[0];
        if (initialWallet) {
          setBalance(parseFloat(initialWallet.balance || initialWallet.amount || 0));
          setCurrency(initialWallet.currency || initialWallet.symbol || "USD");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboardDetails();
  }, []);

  const initializeGrid = useCallback(() => {
    const newTiles = Array.from({ length: GRID_SIZE }, (_, i) => ({
      id: i,
      revealed: false,
      isDiamond: true
    }));
    setTiles(newTiles);
    setGameState('idle');
    setRevealedCount(0);
    setCurrentMultiplier(1.0);
  }, []);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const calculateMultiplier = (revealed: number, mines: number) => {
    const total = GRID_SIZE;
    const safe = total - mines;
    let multiplier = 1.0;
    for (let i = 0; i < revealed; i++) {
      multiplier *= (total - i) / (safe - i);
    }
    return parseFloat((multiplier * 0.98).toFixed(2)); // 2% house edge
  };

  const startGame = () => {
    if (bet <= 0 || bet > balance) return;
    setBalance(prev => prev - bet);
    
    const minePositions = new Set<number>();
    while (minePositions.size < minesCount) {
      minePositions.add(Math.floor(Math.random() * GRID_SIZE));
    }

    const newTiles = Array.from({ length: GRID_SIZE }, (_, i) => ({
      id: i,
      revealed: false,
      isDiamond: !minePositions.has(i)
    }));

    setTiles(newTiles);
    setGameState('playing');
    setRevealedCount(0);
    setCurrentMultiplier(1.0);
  };

  const revealTile = (id: number) => {
    if (gameState !== 'playing' || tiles[id].revealed) return;

    const newTiles = [...tiles];
    newTiles[id].revealed = true;
    setTiles(newTiles);

    if (!newTiles[id].isDiamond) {
      newTiles.forEach(tile => { if (!tile.isDiamond) tile.revealed = true; });
      setGameState('lost');
    } else {
      const newCount = revealedCount + 1;
      setRevealedCount(newCount);
      const newMult = calculateMultiplier(newCount, minesCount);
      setCurrentMultiplier(newMult);
      
      if (newCount === GRID_SIZE - minesCount) {
        setBalance(prev => prev + (bet * newMult));
        setGameState('won');
      }
    }
  };

  const cashOut = () => {
    if (gameState !== 'playing' || revealedCount === 0) return;
    setBalance(prev => prev + (bet * currentMultiplier));
    setGameState('won');
  };

  return (
    <div className="flex min-h-screen bg-[#0a1628] text-white flex-col">
      <div className="flex flex-1">
        {!isMobile && (
          <div className={`h-screen bg-[#0f172a] fixed left-0 top-0 z-50 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
            <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} open={true} setOpen={() => {}} />
          </div>
        )}

        <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${!isMobile ? (sidebarCollapsed ? 'ml-20' : 'ml-64') : ''}`}>
          <TopNavbar searchValue={search} onSearchChange={setSearch} wallets={dashboardDetails?.wallets || []} />
        </div>

        <main className={`flex-1 flex flex-col pt-24 pb-16 px-4 transition-all duration-300 ${!isMobile ? (sidebarCollapsed ? 'ml-20' : 'ml-64') : ''}`}>
          <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[350px_1fr] gap-6">
            
            {/* Sidebar Controls */}
            <div className="bg-[#1a2c38] p-6 rounded-2xl shadow-xl border border-white/5 h-fit space-y-6">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Bet Amount</label>
                <div className="flex gap-2 bg-[#0f212e] p-2 rounded-xl border border-white/5">
                  <input 
                    type="number" 
                    value={bet} 
                    onChange={(e) => setBet(Number(e.target.value))}
                    className="bg-transparent w-full outline-none px-2 font-bold"
                  />
                  <div className="flex gap-1">
                    <button onClick={() => setBet(bet/2)} className="px-3 py-1 bg-[#2f4553] rounded-lg text-xs hover:bg-[#3d5a70]">1/2</button>
                    <button onClick={() => setBet(bet*2)} className="px-3 py-1 bg-[#2f4553] rounded-lg text-xs hover:bg-[#3d5a70]">2x</button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Mines</label>
                <select 
                  value={minesCount}
                  onChange={(e) => setMinesCount(Number(e.target.value))}
                  className="w-full bg-[#0f212e] p-3 rounded-xl border border-white/5 outline-none font-bold"
                  disabled={gameState === 'playing'}
                >
                  {[1, 3, 5, 10, 15, 20, 24].map(n => (
                    <option key={n} value={n}>{n} Mines</option>
                  ))}
                </select>
              </div>

              {gameState === 'playing' ? (
                <button 
                  onClick={cashOut}
                  disabled={revealedCount === 0}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  Cashout ({(bet * currentMultiplier).toFixed(2)})
                </button>
              ) : (
                <button 
                  onClick={startGame}
                  disabled={bet > balance}
                  className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/20"
                >
                  Bet
                </button>
              )}

              {gameState !== 'idle' && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Multiplier</span>
                    <span className="font-bold text-emerald-400">{currentMultiplier}x</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Profit</span>
                    <span className="font-bold">{(bet * currentMultiplier - bet).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Game Grid */}
            <div className="bg-[#1a2c38] p-4 md:p-8 rounded-2xl shadow-xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -z-10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 blur-[100px] -z-10" />

              <div className="grid grid-cols-5 gap-2 md:gap-4 aspect-square max-w-[500px] mx-auto">
                {tiles.map((tile) => (
                  <motion.button
                    key={tile.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => revealTile(tile.id)}
                    disabled={tile.revealed || gameState !== 'playing'}
                    className={`
                      relative w-full h-full rounded-xl border-2 transition-all duration-300 flex items-center justify-center
                      ${tile.revealed 
                        ? (tile.isDiamond ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-red-500/20 border-red-500/50')
                        : 'bg-[#0f212e] border-white/5 hover:border-white/20'}
                    `}
                  >
                    <AnimatePresence>
                      {tile.revealed && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className={tile.isDiamond ? 'text-emerald-400' : 'text-red-500'}
                        >
                          {tile.isDiamond ? <Gem className="w-8 h-8 md:w-12 md:h-12" /> : <Sparkles className="w-8 h-8 md:w-12 md:h-12" />}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>

              {/* Game Over / Win Overlay */}
              {(gameState === 'won' || gameState === 'lost') && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-[#0a1628]/80 backdrop-blur-sm z-10 flex items-center justify-center p-6"
                >
                  <div className="bg-[#1a2c38] p-8 rounded-3xl border border-white/10 text-center space-y-4 max-w-sm w-full">
                    <h2 className={`text-4xl font-black ${gameState === 'won' ? 'text-emerald-400' : 'text-red-500'}`}>
                      {gameState === 'won' ? 'YOU WON!' : 'GAME OVER'}
                    </h2>
                    {gameState === 'won' && (
                      <p className="text-2xl font-bold">{(bet * currentMultiplier).toFixed(2)}</p>
                    )}
                    <button 
                      onClick={initializeGrid}
                      className="w-full bg-[#2f4553] hover:bg-[#3d5a70] py-3 rounded-xl font-bold"
                    >
                      Play Again
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
