"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RotateCcw, 
  Sparkles,
  Zap,
  Trash2
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import TopNavbar from "@/components/topnavbar";
import Sidebar from "@/components/sidebar";
import { apiRequest } from "@/utils/ApiHelper";

const KENO_NUMBERS = 40;
const MAX_SELECTION = 10;

const PAYTABLES: Record<number, number[]> = {
  1: [0, 3.8],
  2: [0, 1.7, 5.1],
  3: [0, 1.1, 2.5, 10],
  4: [0, 0, 2.1, 5, 25],
  5: [0, 0, 1.5, 3.5, 10, 50],
  6: [0, 0, 0, 2, 6, 25, 100],
  7: [0, 0, 0, 1.5, 4, 15, 50, 250],
  8: [0, 0, 0, 1.1, 2.5, 10, 35, 100, 500],
  9: [0, 0, 0, 1, 2, 6, 20, 60, 200, 750],
  10: [0, 0, 0, 0, 1.5, 4, 12, 40, 150, 500, 1000]
};

export default function KenoGame() {
  const [bet, setBet] = useState(10);
  const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(new Set());
  const [drawnNumbers, setDrawnNumbers] = useState<Set<number>>(new Set());
  const [gameState, setGameState] = useState<'idle' | 'drawing' | 'finished'>('idle');
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
        let initialWallet = wallets.find((w: any) => String(w.currency || w.symbol).toUpperCase() === String(currency || "").toUpperCase()) || wallets[0];
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

  const toggleNumber = (num: number) => {
    if (gameState === 'drawing') return;
    const newSelected = new Set(selectedNumbers);
    if (newSelected.has(num)) {
      newSelected.delete(num);
    } else if (newSelected.size < MAX_SELECTION) {
      newSelected.add(num);
    }
    setSelectedNumbers(newSelected);
    setGameState('idle');
    setDrawnNumbers(new Set());
  };

  const autoPick = () => {
    const newSelected = new Set<number>();
    while (newSelected.size < MAX_SELECTION) {
      newSelected.add(Math.floor(Math.random() * KENO_NUMBERS) + 1);
    }
    setSelectedNumbers(newSelected);
    setGameState('idle');
    setDrawnNumbers(new Set());
  };

  const clearSelection = () => {
    setSelectedNumbers(new Set());
    setDrawnNumbers(new Set());
    setGameState('idle');
  };

  const startGame = async () => {
    if (selectedNumbers.size === 0 || bet <= 0 || bet > balance) return;
    setBalance(prev => prev - bet);
    setGameState('drawing');
    setDrawnNumbers(new Set());

    const drawn = new Set<number>();
    while (drawn.size < 10) {
      const num = Math.floor(Math.random() * KENO_NUMBERS) + 1;
      if (!drawn.has(num)) {
        drawn.add(num);
        setDrawnNumbers(new Set(drawn));
        await new Promise(r => setTimeout(r, 150));
      }
    }

    const hits = Array.from(selectedNumbers).filter(n => drawn.has(n)).length;
    const multiplier = PAYTABLES[selectedNumbers.size][hits] || 0;
    
    if (multiplier > 0) {
      const win = bet * multiplier;
      setBalance(prev => prev + win);
    }
    setGameState('finished');
  };

  const hits = Array.from(selectedNumbers).filter(n => drawnNumbers.has(n)).length;
  const currentMultiplier = selectedNumbers.size > 0 ? (PAYTABLES[selectedNumbers.size][hits] || 0) : 0;

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
            
            {/* Controls */}
            <div className="bg-[#1a2c38] p-6 rounded-2xl shadow-xl border border-white/5 h-fit space-y-6">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Bet Amount</label>
                <div className="flex gap-2 bg-[#0f212e] p-2 rounded-xl border border-white/5">
                  <input 
                    type="number" 
                    value={bet} 
                    onChange={(e) => setBet(Number(e.target.value))}
                    className="bg-transparent w-full outline-none px-2 font-bold"
                    disabled={gameState === 'drawing'}
                  />
                  <div className="flex gap-1">
                    <button onClick={() => setBet(bet/2)} className="px-3 py-1 bg-[#2f4553] rounded-lg text-xs hover:bg-[#3d5a70]">1/2</button>
                    <button onClick={() => setBet(bet*2)} className="px-3 py-1 bg-[#2f4553] rounded-lg text-xs hover:bg-[#3d5a70]">2x</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={autoPick} disabled={gameState === 'drawing'} className="flex items-center justify-center gap-2 bg-[#2f4553] hover:bg-[#3d5a70] py-3 rounded-xl text-sm font-bold transition-all">
                  <Zap className="w-4 h-4 text-orange-400" /> Auto Pick
                </button>
                <button onClick={clearSelection} disabled={gameState === 'drawing'} className="flex items-center justify-center gap-2 bg-[#2f4553] hover:bg-[#3d5a70] py-3 rounded-xl text-sm font-bold transition-all">
                  <Trash2 className="w-4 h-4 text-red-400" /> Clear
                </button>
              </div>

              <button 
                onClick={startGame}
                disabled={gameState === 'drawing' || selectedNumbers.size === 0}
                className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/20"
              >
                {gameState === 'drawing' ? 'Drawing...' : 'Bet'}
              </button>

              {selectedNumbers.size > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Paytable</div>
                  <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                    {PAYTABLES[selectedNumbers.size].map((mult, i) => mult > 0 && (
                      <div key={i} className={`flex justify-between p-2 text-sm ${hits === i ? 'bg-emerald-500/20 text-emerald-400' : ''}`}>
                        <span>{i} Hits</span>
                        <span className="font-bold">{mult}x</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Keno Grid */}
            <div className="bg-[#1a2c38] p-4 md:p-8 rounded-2xl shadow-xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -z-10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 blur-[100px] -z-10" />

              <div className="grid grid-cols-5 md:grid-cols-8 gap-2 md:gap-3 max-w-[600px] mx-auto">
                {Array.from({ length: KENO_NUMBERS }, (_, i) => i + 1).map((num) => {
                  const isSelected = selectedNumbers.has(num);
                  const isDrawn = drawnNumbers.has(num);
                  const isHit = isSelected && isDrawn;

                  return (
                    <motion.button
                      key={num}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleNumber(num)}
                      className={`
                        aspect-square rounded-xl flex items-center justify-center font-bold text-lg md:text-xl transition-all duration-300 border
                        ${isHit ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/50 scale-110 z-10' : 
                          isDrawn ? 'bg-white border-white text-black' :
                          isSelected ? 'bg-orange-500 border-orange-400 text-black shadow-lg shadow-orange-500/50' :
                          'bg-[#0f212e] border-white/5 hover:border-white/20 text-gray-400'}
                      `}
                    >
                      {num}
                    </motion.button>
                  );
                })}
              </div>

              {gameState === 'finished' && currentMultiplier > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-emerald-400 text-2xl font-bold">
                    <Sparkles className="w-6 h-6" />
                    WIN {currentMultiplier}x ({(bet * currentMultiplier).toFixed(2)})
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
