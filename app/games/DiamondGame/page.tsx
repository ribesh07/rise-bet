"use client";
import React, { useState, useEffect } from 'react';
import { Diamond, Bomb, DollarSign } from 'lucide-react';
import { useCurrency } from "@/context/CurrencyContext";
import TopNavbar from "@/components/topnavbar";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/sidebar";
import MobileBottomBar from "@/components/mainmobilebuttombar";
import RiseTopBar from "@/components/game/gamebottombar";
import { apiRequest } from "@/utils/ApiHelper";

interface Tile {
  id: number;
  revealed: boolean;
  isDiamond: boolean;
}

const DiamondGame: React.FC = () => {
  
  const [betAmount, setBetAmount] = useState<number>(10);
  const [minesCount, setMinesCount] = useState<number>(3);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.00);
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);

  const GRID_SIZE = 25;
   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
      const [sidebarOpen, setSidebarOpen] = useState(false);
     
        const { currency, setCurrency } = useCurrency();
        const [balance, setBalance] = useState<number>(0);
        const [loading, setLoading] = useState(true);
         const [message, setMessage] = useState<string>("");
          const [search, setSearch] = useState("");
          const [dashboardDetails, setDashboardDetails] = useState<any>(null);
          const [isMobile, setIsMobile] = useState(false);
      const sidebarWidth = 64;
      const collapsedWidth = 20;
    const parseWalletBalance = (b: any) => {
        console.log("🔍 Parsing wallet balance:", b);
        if (b === null || b === undefined) return 0;
        if (typeof b === "number") return b;
        const n = parseFloat(String(b));
        return isNaN(n) ? 0 : n;
      };
    
      const conversionRates: Record<string, number> = {
        INR: 83.0,
        USD: 1,
        USDT: 1,
        BTC: 1 / 60000,
        ETH: 1 / 1800,
        LTC: 1 / 90,
        SOL: 1 / 100,
        XRP: 1 / 0.5,
        TRX: 1 / 0.07,
        BNB: 1 / 300,
        USDC: 1,
      };
    
      const currencySymbols: Record<string, { sym: string; decimals: number }> = {
        INR: { sym: "₹", decimals: 2 },
        USD: { sym: "$", decimals: 2 },
        USDT: { sym: "$", decimals: 2 },
        USDC: { sym: "$", decimals: 2 },
        BTC: { sym: "₿", decimals: 8 },
        ETH: { sym: "Ξ", decimals: 8 },
        LTC: { sym: "Ł", decimals: 8 },
        SOL: { sym: "◎", decimals: 8 },
        XRP: { sym: "✕", decimals: 6 },
        TRX: { sym: "T", decimals: 6 },
        BNB: { sym: "🟡", decimals: 6 },
      };
    
      const formatCurrency = (value: number, cur = currency) => {
        if (cur && currencySymbols[cur]) {
          const { sym, decimals } = currencySymbols[cur];
          return `${sym}${Number(value).toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}`;
        }
        return `${value.toLocaleString()}`;
      };
    
      // Fetch Dashboard Details
      const fetchDashboardDetails = async () => {
        console.log("📊 Fetching dashboard details...");
        try {
          const token = localStorage.getItem("token");
          const id = localStorage.getItem("userId");
          console.log("🔑 Token:", token ? "exists" : "missing");
          console.log("👤 User ID:", id);
    
          const res = await apiRequest(`/users/${id}/details`, true, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
    
          console.log("📥 Dashboard API Response:", res);
    
          if (res.success) {
            setDashboardDetails(res.data);
            const wallets = res.data.wallets || [];
            let initialWallet = null;
            if (wallets.length > 0) {
              initialWallet =
                wallets.find(
                  (w: any) =>
                    String(w.currency || w.symbol).toUpperCase() ===
                    String(currency || "").toUpperCase()
                ) || wallets[0];
            }
    
            if (initialWallet) {
              const bal = parseWalletBalance(
                initialWallet.balance ?? initialWallet.amount ?? 0
              );
              setBalance(bal);
              const curSymbol = (
                initialWallet.currency ||
                initialWallet.symbol ||
                initialWallet.asset ||
                ""
              )
                .toString()
                .toUpperCase();
              if (curSymbol) {
                setCurrency(curSymbol);
              }
            } else {
              setBalance(0);
            }
          }
        } catch (err) {
          console.error("💥 Dashboard API Error:", err);
        } finally {
          setLoading(false);
        }
      };
        useEffect(() => {
          fetchDashboardDetails();
          // fetchBetHistory();
        }, []);
        useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener("resize", checkMobile);
  return () => window.removeEventListener("resize", checkMobile);
}, []);
  const initializeGame = () => {
    const newTiles: Tile[] = [];
    const minePositions = new Set<number>();

    while (minePositions.size < minesCount) {
      minePositions.add(Math.floor(Math.random() * GRID_SIZE));
    }

    for (let i = 0; i < GRID_SIZE; i++) {
      newTiles.push({
        id: i,
        revealed: false,
        isDiamond: !minePositions.has(i)
      });
    }

    setTiles(newTiles);
    setRevealedCount(0);
    setCurrentMultiplier(1.00);
    setGameOver(false);
    setWon(false);
  };

  const calculateMultiplier = (revealed: number, mines: number): number => {
    const totalTiles = GRID_SIZE;
    const safeTiles = totalTiles - mines;
    let multiplier = 1.0;

    for (let i = 0; i < revealed; i++) {
      const remainingSafe = safeTiles - i;
      const remainingTotal = totalTiles - i;
      multiplier *= (remainingTotal / remainingSafe) * 0.97;
    }

    return multiplier;
  };

  const startGame = () => {
    if (betAmount > balance || betAmount <= 0) return;
    setBalance(balance - betAmount);
    initializeGame();
    setGameActive(true);
  };

  const handleTileClick = (id: number) => {
    if (!gameActive || gameOver || tiles[id].revealed) return;

    const tile = tiles[id];
    const newTiles = [...tiles];
    newTiles[id].revealed = true;
    setTiles(newTiles);

    if (!tile.isDiamond) {
      setGameOver(true);
      setGameActive(false);
      newTiles.forEach((t, i) => {
        if (!t.isDiamond) newTiles[i].revealed = true;
      });
      setTiles(newTiles);
    } else {
      const newRevealedCount = revealedCount + 1;
      setRevealedCount(newRevealedCount);
      const newMultiplier = calculateMultiplier(newRevealedCount, minesCount);
      setCurrentMultiplier(newMultiplier);

      if (newRevealedCount === GRID_SIZE - minesCount) {
        setWon(true);
        setGameOver(true);
        setGameActive(false);
        setBalance(balance + betAmount * newMultiplier);
      }
    }
  };

  const cashOut = () => {
    if (!gameActive || revealedCount === 0) return;
    const winAmount = betAmount * currentMultiplier;
    setBalance(balance + winAmount);
    setGameActive(false);
    setGameOver(true);
    setWon(true);
  };

  return (
     <div className="flex min-h-screen bg-[#0a1628] text-white overflow-x-hidden relative flex-col">
      {/* {showConfetti && <Confetti numberOfPieces={200} recycle={false} />} */}

      <div className="flex flex-1">
        {/* Sidebar */}
        {!isMobile && (
          <motion.div
            animate={{
              width: sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-screen bg-[#0f172a] shadow-lg overflow-hidden fixed left-0 top-0 z-50"
          >
            <Sidebar
              collapsed={sidebarCollapsed}
              setCollapsed={setSidebarCollapsed}
              open={true}
              setOpen={() => {}}
            />
          </motion.div>
        )}

        {/* Navbar */}
        <motion.div
          className="fixed top-0 left-0 right-0 z-40"
          animate={{
            marginLeft: !isMobile
              ? sidebarCollapsed
                ? collapsedWidth * 4
                : sidebarWidth * 4
              : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <TopNavbar
            searchValue={search}
            onSearchChange={setSearch}
            wallets={dashboardDetails?.wallets || []}
          />
        </motion.div>

        {/* Main Content */}
        <motion.main
          className="flex-1 flex flex-col overflow-auto pt-[95px] pb-12 md:px-8"
          animate={{
            marginLeft: !isMobile
              ? sidebarCollapsed
                ? collapsedWidth * 4
                : sidebarWidth * 4
              : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
    <div className="min-h-screen bg-gradient-to-b from-[#0f212e] to-[#0b1a24] md:p-4 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-3 md:p-6">

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Controls Panel - Bottom on mobile, Left on desktop */}
            <div className="lg:col-span-1 space-y-3 md:space-y-4 lg:order-1 order-2">
              <div className="bg-gray-700 p-3 md:p-4 rounded-lg">
                <label className="text-xs md:text-sm text-gray-300 block mb-2">Bet Amount</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  disabled={gameActive}
                  className="w-full bg-gray-600 text-white px-2 md:px-3 py-2 rounded border border-gray-500 focus:border-purple-500 outline-none text-sm md:text-base"
                />
              </div>

              <div className="bg-gray-700 p-3 md:p-4 rounded-lg">
                <label className="text-xs md:text-sm text-gray-300 block mb-2">Mines</label>
                <select
                  value={minesCount}
                  onChange={(e) => setMinesCount(Number(e.target.value))}
                  disabled={gameActive}
                  className="w-full bg-gray-600 text-white px-2 md:px-3 py-2 rounded border border-gray-500 focus:border-purple-500 outline-none text-sm md:text-base"
                >
                  {[1, 2, 3, 5, 7, 10, 15, 20].map(n => (
                    <option key={n} value={n}>{n} Mines</option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-700 p-3 md:p-4 rounded-lg">
                <div className="text-xs md:text-sm text-gray-300 mb-1">Total Profit</div>
                <div className="text-xl md:text-2xl font-bold text-green-400">
                  ${(betAmount * currentMultiplier - betAmount).toFixed(2)}
                </div>
                <div className="text-xs md:text-sm text-gray-400 mt-1">
                  {currentMultiplier.toFixed(2)}x
                </div>
              </div>

              {!gameActive ? (
                <button
                  onClick={startGame}
                  disabled={betAmount > balance || betAmount <= 0}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2.5 md:py-3 rounded-lg transition text-sm md:text-base"
                >
                  Bet ${betAmount.toFixed(2)}
                </button>
              ) : (
                <button
                  onClick={cashOut}
                  disabled={revealedCount === 0}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2.5 md:py-3 rounded-lg transition text-sm md:text-base"
                >
                  Cash Out ${(betAmount * currentMultiplier).toFixed(2)}
                </button>
              )}

              {gameOver && (
                <div className={`p-3 md:p-4 rounded-lg text-center font-bold text-sm md:text-base ${won ? 'bg-green-600' : 'bg-red-600'}`}>
                  {won ? `You Won $${(betAmount * currentMultiplier).toFixed(2)}!` : 'Game Over!'}
                </div>
              )}
            </div>

            {/* Game Grid - Top on mobile, Right on desktop */}
            <div className="lg:col-span-3 lg:order-2 order-1">
              <div className="bg-gray-700 p-3 md:p-6 rounded-lg">
                <div className="grid grid-cols-5 gap-1.5 md:gap-2">
                  {tiles.map((tile) => (
                    <button
                      key={tile.id}
                      onClick={() => handleTileClick(tile.id)}
                      disabled={!gameActive || tile.revealed || gameOver}
                      className={`aspect-square rounded-md md:rounded-lg font-bold text-lg transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed
                        ${tile.revealed
                          ? tile.isDiamond
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                            : 'bg-gradient-to-br from-red-600 to-red-800'
                          : 'bg-gray-600 hover:bg-gray-500 active:bg-gray-400'
                        }`}
                    >
                      {tile.revealed && (
                        tile.isDiamond 
                          ? <Diamond className="w-full h-full p-1 md:p-2 text-white" />
                          : <Bomb className="w-full h-full p-1 md:p-2 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
     {/* Bottom Stats Bar */}
          <div className="flex items-center ">
            <RiseTopBar />
          </div>
        </motion.main>
      </div>

      {/* Mobile Bottom Bar */}
      {isMobile && (
        <div className="fixed bottom-0 w-full z-50 h-16">
          <MobileBottomBar onBrowseClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] shadow-lg"
          >
            <Sidebar
              collapsed={false}
              setCollapsed={() => {}}
              open={sidebarOpen}
              setOpen={setSidebarOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DiamondGame;