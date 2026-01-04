
'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";
import TopNavbar from "@/components/topnavbar";
import Sidebar from "@/components/sidebar";
import MobileBottomBar from "@/components/mainmobilebuttombar";
import RiseTopBar from "@/components/game/gamebottombar";

// API Helper
const apiRequest = async (endpoint: string, auth: boolean, options: any) => {
  const baseUrl = "https://api.playrise.vip/api/v1";
  const response = await fetch(`${baseUrl}${endpoint}`, options);
  return response.json();
};

const CHOICES = [
  { id: "rock", icon: "✊", label: "Rock" },
  { id: "paper", icon: "✋", label: "Paper" },
  { id: "scissors", icon: "✌️", label: "Scissors" },
];

const MULTIPLIERS = [1.0, 1.96, 3.92, 7.84];

type GameStage = "idle" | "playing" | "ended";
type Result = "WON" | "LOST" | "DRAW";

export default function RockPaperScissorsRise() {
  // Game state
  const [stage, setStage] = useState<GameStage>("idle");
  const [betAmount, setBetAmount] = useState<number>(100);
  const [matchId, setMatchId] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [wins, setWins] = useState<number>(0);
  
  // Round state
  const [playerPick, setPlayerPick] = useState<string | null>(null);
  const [housePick, setHousePick] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCards, setShowCards] = useState(false);
  
  // Flipped cards state
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false, false]);
  const [lastFlippedIndex, setLastFlippedIndex] = useState<number | null>(null);
  
  // UI state
  const [message, setMessage] = useState<string>("");
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Dashboard & currency
  const [search, setSearch] = useState("");
  const { currency, setCurrency } = useCurrency();
  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  // Sidebar states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarWidth = 64;
  const collapsedWidth = 20;

   const parseWalletBalance = (b: any) => {
    console.log("🔍 Parsing wallet balance:", b);
    if (b === null || b === undefined) {
      console.log("❌ Balance is null/undefined, returning 0");
      return 0;
    }
    if (typeof b === "number") {
      console.log("✅ Balance is number:", b);
      return b;
    }
    const n = parseFloat(String(b));
    console.log("🔄 Parsed balance string to number:", n);
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
    
  // Symbol map & decimals
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
      return `${sym}${Number(value).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
    }
    return `${value.toLocaleString()}`;
  };
  
  const convertChipToCurrency = (chipBaseAmount: number, cur = currency) => {
    const rate = conversionRates[cur] ?? 1;
    return chipBaseAmount * rate;
  };
  // Fetch dashboard details
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
          console.log("✅ Dashboard details set:", res.data);
          
          const wallets = res.data.wallets || [];
          console.log("💰 Available wallets:", wallets);
          
          let initialWallet = null;
          if (wallets.length > 0) {
            initialWallet =
              wallets.find((w: any) => String(w.currency || w.symbol).toUpperCase() === String(currency || "").toUpperCase()) ||
              wallets[0];
            console.log("🎯 Selected wallet:", initialWallet);
          }
          
          if (initialWallet) {
            const bal = parseWalletBalance(initialWallet.balance ?? initialWallet.amount ?? 0);
            setBalance(bal);
            console.log("💵 Balance set to:", bal);
            
            const curSymbol = (initialWallet.currency || initialWallet.symbol || initialWallet.asset || "").toString().toUpperCase();
            console.log("💱 Currency symbol:", curSymbol);
            if (curSymbol) {
              setCurrency(curSymbol);
            }
          } else {
            console.log("⚠️ No wallet found, setting balance to 0");
            setBalance(0);
          }
        } else {
          console.error("❌ Dashboard API failed:", res);
        }
      } catch (err) {
        console.error("💥 Dashboard API Error:", err);
      } finally {
        setLoading(false);
        console.log("✅ Dashboard loading complete");
      }
    };
  
    useEffect(() => {
      console.log("🚀 Component mounted, fetching initial dashboard details");
      fetchDashboardDetails();
    }, []);

  const refreshDashboard = async () => {
  await fetchDashboardDetails();
};


  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentMultiplier = MULTIPLIERS[wins] ?? MULTIPLIERS[MULTIPLIERS.length - 1];

  // Start game - Place bet
  const handleBet = async () => {
    if (betAmount <= 0) {
      setApiError("Please enter a valid bet amount");
      return;
    }
    
    if (betAmount > balance) {
      setApiError("Insufficient balance");
      return;
    }

    setApiError(null);
    setStage("playing");
    setWins(0);
    setStreak(0);
    setFlipped([false, false, false, false]);
    setLastFlippedIndex(null);
    setMessage("");
    setMatchId(Date.now()); // Temporary match ID until first round
  };

  // Play a round with chosen move
  const playRound = async (pick: string) => {
    if (stage !== "playing" || isPlaying) return;

    setIsPlaying(true);
    setPlayerPick(pick);
    setApiError(null);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      
      const response = await apiRequest("/game/rps/play", true, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          choice: pick,
          amount: betAmount,
          currency: currency,
        }),
      });

      if (response.match) {
        setMatchId(response.match.id);
        setHousePick(response.house);
        setResult(response.result);
        setStreak(response.streak);
        
        // Show cards animation
        setShowCards(true);
        await new Promise((r) => setTimeout(r, 1000));

        // Flip the card
        if (response.result === "WON") {
          setFlipped((f) => {
            const nf = [...f];
            nf[wins] = true;
            return nf;
          });
          
          setLastFlippedIndex(wins);
          setWins((w) => w + 1);
          setMessage(`You won! ${MULTIPLIERS[wins + 1] || currentMultiplier}x`);
          await fetchDashboardDetails();
          await new Promise((r) => setTimeout(r, 800));
          setShowCards(false);
          setPlayerPick(null);
          setHousePick(null);
        } else if (response.result === "LOST") {
          setMessage("You lost! Game over.");
          await fetchDashboardDetails();
          await new Promise((r) => setTimeout(r, 1500));
          setStage("ended");
        } else if (response.result === "DRAW") {
          setMessage("Draw! Pick again.");
          await fetchDashboardDetails();
          await new Promise((r) => setTimeout(r, 1000));
          setShowCards(false);
          setPlayerPick(null);
          setHousePick(null);
        }
      } else {
        setApiError(response.message || "Failed to play round");
      }
    } catch (err: any) {
      console.error("Play round error:", err);
      setApiError(err.message || "Failed to play round");
    } finally {
      setIsPlaying(false);
    }
  };

  // Random pick
  const handleRandomPick = () => {
    const randomChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    playRound(randomChoice.id);
  };

  // Cash out
  const handleCashOut = async () => {
    if (!matchId || wins === 0) return;

    setLoading(true);
    setApiError(null);

    try {
      const token = localStorage.getItem("token");
      
      const response = await apiRequest("/game/rps/cashout", true, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          matchId: matchId,
        }),
      });

      if (response.success) {
        const payout = response.data.payout;
        setMessage(`Cashed out! Won ${formatCurrency(payout, currency)}`);
        setStage("ended");
        await fetchDashboardDetails();
      } else {
        setApiError(response.message || "Failed to cash out");
      }
    } catch (err: any) {
      console.error("Cashout error:", err);
      setApiError(err.message || "Failed to cash out");
    } finally {
      setLoading(false);
    }
  };

  // Reset game
  const resetGame = () => {
    setStage("idle");
    setMatchId(null);
    setWins(0);
    setStreak(0);
    setPlayerPick(null);
    setHousePick(null);
    setResult(null);
    setFlipped([false, false, false, false]);
    setLastFlippedIndex(null);
    setMessage("");
    setApiError(null);
  };
const handleCurrencyChange = (currencyType: string) => {
    console.log("💱 Currency change requested:", currencyType);
    if (!currencyType) return;
    const symbol = currencyType.toString().toUpperCase();
    console.log("🔄 Setting currency to:", symbol);
    setCurrency(symbol);
    
    const wallets = dashboardDetails?.wallets || [];
    const found = wallets.find(
      (w: any) => String(w.currency || w.symbol || w.asset).toUpperCase() === symbol
    );
    if (found) {
      const bal = parseWalletBalance(found.balance ?? found.amount ?? 0);
      setBalance(bal);
      console.log("✅ Currency changed, new balance:", bal);
    } else {
      console.log("⚠️ Wallet not found for currency:", symbol);
      setBalance((prev) => prev); 
    }
  };
  return (
    <div className="flex min-h-screen bg-[#0a1628] text-white overflow-x-hidden relative flex-col">
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
              ? sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4
              : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <TopNavbar
  searchValue={search}
  onSearchChange={setSearch}
  wallets={dashboardDetails?.wallets || []}
  onCurrencyChange={handleCurrencyChange}
/>

        </motion.div>

        {/* Main Content */}
        <motion.main
          className="flex-1 flex flex-col overflow-auto pt-[95px] pb-16 md:pb-0"
          animate={{
            marginLeft: !isMobile
              ? sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4
              : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex flex-col lg:flex-row gap-0 lg:gap-4 lg:p-3 min-h-screen">
            {/* Left Panel - Betting Controls */}
            <div className="w-full lg:w-80 bg-[#0f1e2e] lg:rounded-xl p-4 space-y-3 order-2 lg:order-1">
              {/* Error Display */}
              {apiError && (
                <div className="bg-red-500/20 border border-red-500 rounded-md p-2 text-sm text-red-400">
                  {apiError}
                </div>
              )}

              {/* Balance Display */}
              <div className="bg-[#0a1628] p-3 rounded-md border border-emerald-500/20">
                <div className="text-xs text-gray-400">Balance ({currency})</div>
                <div className="text-lg font-semibold text-emerald-400">
                  {formatCurrency(balance, currency)}
                </div>
              </div>

              {/* Streak Display */}
              {stage === "playing" && (
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-md border border-purple-500/30">
                  <div className="text-xs text-gray-300">Current Wins</div>
                  <div className="text-2xl font-bold text-purple-300">
                    {wins} 🔥
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Multiplier: {currentMultiplier.toFixed(2)}x
                  </div>
                </div>
              )}

              {/* Bet Amount */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Bet Amount</span>
                  <span>{formatCurrency(betAmount, currency)}</span>
                </div>

                <div className="flex">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={betAmount === 0 ? "0" : betAmount.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || value === ".") {
                        setBetAmount(0);
                        return;
                      }
                      const cleanValue = value.replace(/^0+(?=\d)/, "");
                      if (/^\d*\.?\d*$/.test(cleanValue)) {
                        const num = parseFloat(cleanValue);
                        if (!isNaN(num)) setBetAmount(num);
                      }
                    }}
                    disabled={stage === "playing"}
                    className="flex-1 bg-[#0a1628] p-2 rounded-l-md outline-none text-sm disabled:opacity-50 border border-emerald-500/20"
                  />
                  <button
                    onClick={() => setBetAmount(Math.max(0, betAmount / 2))}
                    disabled={stage === "playing"}
                    className="px-3 bg-[#1a2f4a] text-sm hover:bg-[#2a3f5a] disabled:opacity-50"
                  >
                    ½
                  </button>
                  <button
                    onClick={() => setBetAmount(betAmount * 2)}
                    disabled={stage === "playing"}
                    className="px-3 bg-[#1a2f4a] rounded-r-md text-sm hover:bg-[#2a3f5a] disabled:opacity-50"
                  >
                    2×
                  </button>
                </div>
              </div>

              {/* Main Action Button - Bet or Cashout */}
              {stage === "idle" ? (
                <button
                  onClick={handleBet}
                  disabled={loading || betAmount <= 0}
                  className="w-full py-3 rounded-xl font-bold text-base bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Place Bet
                </button>
              ) : stage === "playing" && wins > 0 ? (
                <button
                  onClick={handleCashOut}
                  disabled={loading || isPlaying}
                  className="w-full py-3 rounded-xl font-bold text-base bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all shadow-xl disabled:opacity-50"
                >
                  {loading ? "Cashing out..." : `Cash Out ${formatCurrency(betAmount * currentMultiplier, currency)}`}
                </button>
              ) : null}

              {/* Random Button - Only show during active game */}
              {stage === "playing" && (
                <button
                  onClick={handleRandomPick}
                  disabled={isPlaying}
                  className="w-full py-3 rounded-xl font-bold text-base bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span className="text-xl">🎲</span>
                  Random Pick
                </button>
              )}

              {/* Choice Buttons */}
              {stage === "playing" && (
                <div className="space-y-2">
                  <label className="block text-xs text-gray-400">Choose Your Move</label>
                  <div className="flex gap-2">
                    {CHOICES.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => playRound(choice.id)}
                        disabled={isPlaying}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                          playerPick === choice.id
                            ? "bg-yellow-500/20 border-yellow-500 scale-105"
                            : "bg-[#0a1628] border-emerald-500/20 hover:border-emerald-500/50"
                        } disabled:opacity-50`}
                      >
                        <div className="text-3xl">{choice.icon}</div>
                        <div className="text-xs mt-1">{choice.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Profit */}
              {stage === "playing" && (
                <div className="bg-[#0a1628] p-3 rounded-md border border-emerald-500/20">
                  <div className="text-xs text-gray-400 mb-1">
                    Potential Win ({currentMultiplier.toFixed(2)}x)
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-base font-bold text-emerald-400">
                      {formatCurrency(betAmount * currentMultiplier, currency)}
                    </div>
                    <div className="bg-emerald-500 text-black px-2 py-1 rounded text-xs font-bold">
                      +{formatCurrency(betAmount * (currentMultiplier - 1), currency)}
                    </div>
                  </div>
                </div>
              )}

              {/* Message */}
              {message && (
                <div className={`text-center text-sm font-bold p-3 rounded-lg ${
                  message.includes("won") || message.includes("Cashed")
                    ? "bg-green-500/20 text-green-400 border border-green-500/50"
                    : message.includes("lost")
                    ? "bg-red-500/20 text-red-400 border border-red-500/50"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                }`}>
                  {message}
                </div>
              )}
            </div>

            {/* Center - Game Area */}
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#0f1e2e] to-[#0a1628] lg:rounded-2xl border-t lg:border border-emerald-500/20 py-8 lg:py-0 order-1 lg:order-2 relative overflow-hidden min-h-[500px]">
              
              {/* Sliding House Card */}
              <AnimatePresence>
                {showCards && housePick && (
                  <motion.div
                    initial={{ y: -150, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 150, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute top-16 z-20 w-20 h-28 sm:w-24 sm:h-32 rounded-xl bg-gradient-to-br from-red-400 to-red-600 text-white flex flex-col items-center justify-center shadow-2xl"
                  >
                    <div className="text-3xl sm:text-4xl">
                      {CHOICES.find(c => c.id === housePick)?.icon}
                    </div>
                    <div className="text-xs mt-1">House</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sliding Player Card */}
              <AnimatePresence>
                {showCards && playerPick && (
                  <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -150, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute bottom-32 z-20 w-20 h-28 sm:w-24 sm:h-32 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-black flex flex-col items-center justify-center shadow-2xl"
                  >
                    <div className="text-3xl sm:text-4xl">
                      {CHOICES.find(c => c.id === playerPick)?.icon}
                    </div>
                    <div className="text-xs mt-1">You</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Multiplier Ladder */}
              <div className="flex gap-2 sm:gap-4 px-4">
                {MULTIPLIERS.map((m, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <motion.div
                      animate={{ rotateY: flipped[i] ? 180 : 0 }}
                      transition={{ duration: 0.6 }}
                      className={`w-24 h-32 sm:w-32 sm:h-40 lg:w-40 lg:h-48 rounded-xl border-4 relative ${
                        i === wins && stage === "playing"
                          ? "border-yellow-400 shadow-lg shadow-yellow-400/50"
                          : "border-emerald-500/30"
                      }`}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Front - Default Card */}
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a2f4a] to-[#0f1e2e] rounded-lg"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <div className="text-4xl sm:text-5xl lg:text-6xl opacity-30">🃏</div>
                      </div>

                      {/* Back - Revealed Card */}
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        {i === lastFlippedIndex && housePick && (
                          <>
                            <div className="text-3xl sm:text-4xl">
                              {CHOICES.find(c => c.id === housePick)?.icon}
                            </div>
                            <div className="text-xs mt-1 text-white/80">House</div>
                          </>
                        )}
                      </div>
                    </motion.div>

                    <div className={`text-xs sm:text-sm font-bold ${
                      i === wins && stage === "playing" ? "text-yellow-400" : "text-white/70"
                    }`}>
                      {m.toFixed(2)}x
                    </div>
                  </div>
                ))}
              </div>

              {/* Result Overlay */}
              <AnimatePresence>
                {stage === "ended" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm"
                    onClick={resetGame}
                  >
                    <div className="bg-[#0f1e2e] p-6 sm:p-8 rounded-2xl text-center border-2 border-emerald-500/30 max-w-sm mx-4">
                      <div className="text-2xl sm:text-3xl font-bold mb-4">
                        {result === "WON" || wins > 0 ? "🎉 You Won!" : "😢 Game Over"}
                      </div>

                      {wins > 0 && (
                        <>
                          <div className="text-yellow-400 text-xl sm:text-2xl font-bold mb-2">
                            {currentMultiplier.toFixed(2)}x Multiplier
                          </div>
                          <div className="text-green-400 text-2xl sm:text-3xl font-bold mb-4">
                            {formatCurrency(betAmount * currentMultiplier, currency)}
                          </div>
                        </>
                      )}

                      <div className="text-sm text-gray-400 mb-4">
                        Wins: {wins} | Streak: {streak}
                      </div>

                      <button
                        onClick={resetGame}
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl font-bold transition-all"
                      >
                        Play Again
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Stats Bar */}
          <div className="flex items-center px-3 pb-3 lg:pb-0">
            <RiseTopBar />
          </div>
        </motion.main>
      </div>

      {/* Mobile Bottom Bar */}
      {isMobile && (
        <div className="fixed bottom-0 w-full z-50 h-16">
          <MobileBottomBar onBrowseClick={() => setSidebarOpen(true)} />
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