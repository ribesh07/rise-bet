
"use client";

import { useCurrency } from "@/context/CurrencyContext";
import TopNavbar from "@/components/topnavbar";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/sidebar";
import MobileBottomBar from "@/components/mainmobilebuttombar";
import RiseTopBar from "@/components/game/gamebottombar";
import { apiRequest } from "@/utils/ApiHelper";
import { useState, useEffect } from "react";

const multipliers = {
  easy: [0, 1.43, 5.7, 17.1],
  medium: [0, 2.1, 8.5, 25.5],
  hard: [0, 3.2, 12.8, 42.4],
};

type Mode = "easy" | "medium" | "hard";

export default function DiceGame() {
  
  const [betAmount, setBetAmount] = useState(1.0);
  const [mode, setMode] = useState<Mode>("easy");
  const [selectedMultiplier, setSelectedMultiplier] = useState(1);
  const [turboMode, setTurboMode] = useState(false);
  const [volume, setVolume] = useState(0);
  const [autoplayRounds, setAutoplayRounds] = useState<number | string>("");
  const [isRolling, setIsRolling] = useState(false);
const [isMobile, setIsMobile] = useState(false);

  const [yourDice, setYourDice] = useState([5, 6, 2]);
  const [resultDice, setResultDice] = useState([5, 4, 6]);
  const [matches, setMatches] = useState([true, false, false]);
  const [resultMessage, setResultMessage] = useState("1 Hit! 1.43x - Won $1.43");
  const [resultColor, setResultColor] = useState("#4caf50");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
      const [sidebarOpen, setSidebarOpen] = useState(false);
     
        const { currency, setCurrency } = useCurrency();
        const [balance, setBalance] = useState<number>(0);
        const [loading, setLoading] = useState(true);
         const [message, setMessage] = useState<string>("");
          const [search, setSearch] = useState("");
          const [dashboardDetails, setDashboardDetails] = useState<any>(null);
          
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
  const getMaxWin = () => {
    return multipliers[mode][3].toFixed(2);
  };

  const rollDice = async () => {
    if (isRolling || betAmount > balance) {
      if (betAmount > balance) alert("Insufficient balance!");
      return;
    }

    setIsRolling(true);

    const rollDuration = turboMode ? 500 : 1500;
    const intervalTime = 100;
    let elapsed = 0;

    // Animate dice rolling
    const interval = setInterval(() => {
      setYourDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
      setResultDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);

      elapsed += intervalTime;
      if (elapsed >= rollDuration) {
        clearInterval(interval);

        // Generate final results
        const finalYourDice = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ];
        const finalResultDice = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ];

        setYourDice(finalYourDice);
        setResultDice(finalResultDice);

        // Calculate matches
        const newMatches = finalYourDice.map(
          (dice, i) => dice === finalResultDice[i]
        );
        setMatches(newMatches);

        const hits = newMatches.filter((m) => m).length;
        const multiplier = multipliers[mode][hits];
        const winAmount = betAmount * multiplier;
        const profit = winAmount - betAmount;

        setBalance((prev) => Math.round((prev + profit) * 100) / 100);

        if (hits > 0 && multiplier > 0) {
          setResultColor("#4caf50");
          setResultMessage(
            `${hits} Hit${hits > 1 ? "s" : ""}! ${multiplier}x - Won $${winAmount.toFixed(2)}`
          );
        } else {
          setResultColor("#f44336");
          setResultMessage(`0 Hits! 0x - Lost $${betAmount.toFixed(2)}`);
        }

        setIsRolling(false);
      }
    }, intervalTime);
  };
useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener("resize", checkMobile);
  return () => window.removeEventListener("resize", checkMobile);
}, []);

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
          className="flex-1 flex flex-col overflow-auto pt-[95px] pb-16 md:px-8"
          animate={{
            marginLeft: !isMobile
              ? sidebarCollapsed
                ? collapsedWidth * 4
                : sidebarWidth * 4
              : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
    <div className="flex min-h-screen bg-[#0a0e1a] text-white p-5">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[300px_1fr] grid-cols-1 gap-5 w-full lg:h-[calc(100vh-40px)]">
        {/* Desktop: Left Sidebar | Mobile: Bottom Section */}
        <div className="bg-[rgba(20,25,40,0.6)] border border-white/10 rounded-xl p-5 flex flex-col gap-5 lg:order-1 order-2">
          {/* Mode */}
          <div>
            <div className="text-[#4fc3f7] text-xs font-semibold uppercase tracking-wider mb-2">
              MODE
            </div>
            <select
              className="w-full bg-[rgba(20,25,40,0.8)] border border-white/15 rounded-lg px-4 py-3 text-white text-sm appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%234fc3f7' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
                paddingRight: "40px",
              }}
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
            >
              <option value="easy">Easy (3 Dice)</option>
              <option value="medium">Medium (3 Dice)</option>
              <option value="hard">Hard (3 Dice)</option>
            </select>
          </div>

          {/* Bet Amount */}
          <div>
            <div className="text-[#4fc3f7] text-xs font-semibold uppercase tracking-wider mb-2">
              BET AMOUNT
            </div>
            <input
              type="number"
              className="w-full bg-[rgba(20,25,40,0.8)] border border-white/15 rounded-lg px-4 py-4 text-center text-xl font-semibold text-white focus:outline-none focus:border-[#4fc3f7]"
              value={betAmount}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setBetAmount(Math.max(0, Math.min(1000, value)));
              }}
              min="0"
              max="1000"
              step="0.01"
            />
          </div>

          {/* Continue Button */}
          <button
            onClick={rollDice}
            disabled={isRolling}
            className="bg-[#4caf50] rounded-lg py-4 text-white text-base font-bold uppercase hover:bg-[#45a049] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRolling ? "ROLLING..." : "ROLL DICE"}
          </button>

          {/* Autoplay */}
          <div>
            <div className="text-[#4fc3f7] text-xs font-semibold uppercase tracking-wider mb-2">
              AUTOPLAY
            </div>
            <input
              type="number"
              className="w-full bg-[rgba(20,25,40,0.8)] border border-white/15 rounded-lg px-4 py-3 text-white text-center text-sm"
              placeholder="Number of Rounds"
              min="0"
              value={autoplayRounds}
              onChange={(e) => setAutoplayRounds(e.target.value)}
            />
          </div>

          {/* Turbo Button */}
          <button
            onClick={() => setTurboMode(!turboMode)}
            className={`border-2 rounded-lg py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              turboMode
                ? "bg-[rgba(255,152,0,0.3)] border-[#ff9800] text-[#ff9800]"
                : "bg-[rgba(139,69,19,0.3)] border-[#ff9800] text-[#ff9800]"
            } hover:bg-[rgba(255,152,0,0.2)]`}
          >
            <span>⚡</span>
            <span>{turboMode ? "TURBO ON" : "TURBO"}</span>
          </button>

          {/* Menu */}
          <div>
            <div className="text-[#4fc3f7] text-xs font-semibold uppercase tracking-wider mb-2">
              MENU
            </div>
            <button className="w-full bg-[rgba(20,25,40,0.8)] border border-white/15 rounded-lg px-4 py-3 text-white text-sm hover:bg-white/5 transition-all">
              Game Info
            </button>
          </div>

          {/* Volume */}
          <div>
            <div className="text-[#4fc3f7] text-xs font-semibold uppercase tracking-wider mb-2">
              VOLUME
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                className="flex-1 h-1 rounded-full bg-white/15 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4fc3f7] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4fc3f7] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
              />
              <span className="text-[#4fc3f7] text-sm font-semibold min-w-[30px]">
                {volume}%
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-2 mt-auto pt-5 border-t border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Balance:</span>
              <span className="text-[#4fc3f7] font-semibold">
                ${balance.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Bet:</span>
              <span className="text-[#4fc3f7] font-semibold">
                ${betAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Max Win:</span>
              <span className="text-[#4fc3f7] font-semibold">
                {getMaxWin()}x
              </span>
            </div>
          </div>
        </div>

        {/* Main Game Area - Desktop: Right Side | Mobile: Top Section */}
        <div className="flex flex-col gap-5 lg:order-2 order-1">

          {/* Dice Section */}
          <div className="bg-[rgba(20,25,40,0.6)] border border-white/10 rounded-xl p-6 lg:p-10 flex-1 flex flex-col">
            {/* Your Dice */}
            <div className="text-[#4fc3f7] text-sm font-semibold uppercase tracking-wider text-center mb-6">
              YOUR DICE
            </div>
            <div className="flex justify-center gap-3 lg:gap-4 mb-8">
              {yourDice.map((dice, i) => (
                <div
                  key={`your-${i}`}
                  className={`w-20 h-20 lg:w-[100px] lg:h-[100px] rounded-xl flex items-center justify-center text-4xl lg:text-5xl font-bold transition-all ${
                    matches[i]
                      ? "bg-[#a8d5a8] text-[#2d4a2d]"
                      : "bg-[#e6b88f] text-[#4a3a2d]"
                  } ${isRolling ? "animate-pulse" : ""}`}
                >
                  {dice}
                </div>
              ))}
            </div>

            {/* Results */}
            <div className="text-[#4fc3f7] text-sm font-semibold uppercase tracking-wider text-center mb-6">
              RESULTS
            </div>
            <div className="flex justify-center gap-3 lg:gap-4 mb-6">
              {resultDice.map((dice, i) => (
                <div
                  key={`result-${i}`}
                  className={`w-20 h-20 lg:w-[100px] lg:h-[100px] rounded-xl flex items-center justify-center text-4xl lg:text-5xl font-bold transition-all ${
                    matches[i]
                      ? "bg-[#a8d5a8] text-[#2d4a2d]"
                      : "bg-[#e6b88f] text-[#4a3a2d]"
                  } ${isRolling ? "animate-pulse" : ""}`}
                >
                  {dice}
                </div>
              ))}
            </div>

            {/* Multiplier Options */}
            <div className="text-[#4fc3f7] text-xs font-semibold uppercase tracking-wider text-center mt-4 lg:mt-8 mb-4 lg:mb-6">
              MULTIPLIER {mode.toUpperCase()}
            </div>
           <div className="flex justify-center gap-2 lg:gap-3 flex-wrap">
              {multipliers[mode].map((mult, i) => {
                const hits = matches.filter((m) => m).length;
                const isWinningHit = !isRolling && hits === i;

                return (
                  <div
                    key={i}
                    className={`bg-[rgba(20,25,40,0.8)] border-2 rounded-lg py-2 lg:py-3 px-4 lg:px-5 transition-all min-w-[70px] lg:min-w-[100px] text-center cursor-default ${
                      isWinningHit
                        ? "border-[#4caf50] bg-[rgba(76,175,80,0.3)] ring-2 ring-[#4caf50]"
                        : "border-white/15 bg-[rgba(20,25,40,0.8)]"
                    }`}

                  >
                    <div className="text-[10px] lg:text-xs text-white/60 mb-1">
                      {i} Hit{i !== 1 ? "s" : ""}
                    </div>
                    <div
                      className={`text-sm lg:text-base font-bold ${
                        isWinningHit ? "text-[#4caf50]" : "text-white"
                      }`}
                    >
                      {mult}x
                    </div>
                  </div>
                );
              })}
            </div>


            {/* Result Message - Only show on desktop */}
             <div className="bg-[rgba(20,25,40,0.8)] border border-white/15 rounded-lg p-5 text-center mt-6">
              <div
                className="text-xl font-semibold"
                style={{ color: resultColor }}
              >
                {resultMessage}
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
}