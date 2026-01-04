'use client';

import { apiRequest } from "@/utils/ApiHelper";
import React, { useEffect, useState } from "react";
// import Confetti from "react-confetti";
import { useCurrency } from "@/context/CurrencyContext";
import TopNavbar from "@/components/topnavbar";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/sidebar";
import MobileBottomBar from "@/components/mainmobilebuttombar";
import RiseTopBar from "@/components/game/gamebottombar";

type CoinSide = "HEAD" | "TAIL";

const FlipGame: React.FC = () => {
  const [selectedSide, setSelectedSide] = useState<CoinSide | null>(null);
  const [betAmount, setBetAmount] = useState<number>(1);
  const [result, setResult] = useState<CoinSide | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [search, setSearch] = useState("");
  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(2);
  const [streak, setStreak] = useState<number>(0);
  const { currency, setCurrency } = useCurrency();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [betHistory, setBetHistory] = useState<any[]>([]);
  
  // Sidebar states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Fetch Bet History
//   const fetchBetHistory = async () => {
//     console.log("📜 Fetching bet history...");
//     try {
//       const token = localStorage.getItem("token");
//       const res = await apiRequest("/game/coinflip/history", true, {
//         method: "GET",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       console.log("📥 Bet History Response:", res);
//       if (res.success && res.data) {
//         setBetHistory(res.data.slice(0, 10)); // Show last 10 bets
//       }
//     } catch (err) {
//       console.error("💥 Bet History Error:", err);
//     }
//   };

  useEffect(() => {
    fetchDashboardDetails();
    // fetchBetHistory();
  }, []);

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

  // API: Place Bet
  const placeBet = async () => {
    console.log("🎲 Placing coin flip bet...");
    console.log("📋 Bet details:", {
      choice: selectedSide,
      currency,
      amount: betAmount,
    });

    try {
      setApiError(null);
      const token = localStorage.getItem("token");

      const response = await apiRequest("/game/coinflip/bet", true, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          choice: selectedSide,
          currency: currency,
          amount: betAmount,
        }),
      });

      console.log("📥 Bet API Response:", response);

      if (response.success) {
        console.log("✅ Bet placed successfully!");
        return response.data;
      } else {
        console.error("❌ Bet failed:", response.message);
        setApiError(response.message || "Bet failed");
        return null;
      }
    } catch (err: any) {
      console.error("💥 Bet API Error:", err);
      setApiError(err.message || "Failed to place bet");
      return null;
    }
  };

  // Handle Flip
  const handleFlip = async () => {
    console.log("🪙 Flip button clicked");
    
    if (!selectedSide) {
      console.log("❌ No side selected");
      setMessage("Please select HEAD or TAIL");
      setApiError("Please select a side");
      return;
    }

    if (betAmount <= 0) {
      console.log("❌ Invalid bet amount");
      setMessage("Please enter a valid bet amount");
      setApiError("Invalid bet amount");
      return;
    }

    if (betAmount > balance) {
      console.log("❌ Insufficient balance");
      setMessage("Insufficient balance");
      setApiError("Insufficient balance");
      return;
    }

    console.log("✅ Starting flip...");
    setIsFlipping(true);
    setResult(null);
    setMessage("");
    setShowConfetti(false);
    setApiError(null);

    // Place bet
    const betResult = await placeBet();

    if (!betResult) {
      console.log("❌ Bet placement failed");
      setIsFlipping(false);
      return;
    }

    // Simulate flip animation
    console.log("🎬 Starting flip animation...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Set result from API
    console.log("🎯 Result from API:", betResult);
    const flipResult: CoinSide = betResult.result;
    setResult(flipResult);
    setIsFlipping(false);
    setCurrentMultiplier(betResult.multiplier || 2);
    setStreak(betResult.streak || 0);

    if (betResult.win) {
      console.log("🏆 WIN!");
      setMessage(
        `You won! 🎉 ${betResult.multiplier}x - Earned ${formatCurrency(
          betResult.payout,
          currency
        )}`
      );
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } else {
      console.log("😢 LOSE");
      setMessage(`You lost 😢 Streak reset!`);
    }

    // Refresh dashboard and history
    console.log("🔄 Refreshing dashboard and history...");
    await fetchDashboardDetails();
    // await fetchBetHistory();
  };

  const handleCurrencyChange = (currencyType: string) => {
    console.log("💱 Currency change requested:", currencyType);
    if (!currencyType) return;
    const symbol = currencyType.toString().toUpperCase();
    setCurrency(symbol);

    const wallets = dashboardDetails?.wallets || [];
    const found = wallets.find(
      (w: any) =>
        String(w.currency || w.symbol || w.asset).toUpperCase() === symbol
    );
    if (found) {
      const bal = parseWalletBalance(found.balance ?? found.amount ?? 0);
      setBalance(bal);
      console.log("✅ Currency changed, new balance:", bal);
    }
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
          <div className="flex flex-col lg:flex-row gap-4  min-h-screen">
            {/* Left Panel - Betting Controls */}
            <div className="w-full lg:w-80 bg-[#0f1e2e] rounded-xl p-4 space-y-4 order-2 lg:order-1">
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
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-md border border-purple-500/30">
                <div className="text-xs text-gray-300">Current Streak</div>
                <div className="text-2xl font-bold text-purple-300">
                  {streak} 🔥
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Next multiplier: {Math.pow(2, streak + 1)}x
                </div>
              </div>

              {/* Bet Amount */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs sm:text-sm text-gray-400">
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
                        if (!isNaN(num)) {
                          setBetAmount(num);
                        }
                      }
                    }}
                    disabled={isFlipping}
                    className="flex-1 bg-[#0a1628] p-2 rounded-l-md outline-none text-sm disabled:opacity-50 border border-emerald-500/20"
                  />
                  <button
                    onClick={() => setBetAmount(Math.max(0, betAmount / 2))}
                    disabled={isFlipping}
                    className="px-3 bg-[#1a2f4a] text-sm hover:bg-[#2a3f5a] disabled:opacity-50"
                  >
                    ½
                  </button>
                  <button
                    onClick={() => setBetAmount(betAmount * 2)}
                    disabled={isFlipping}
                    className="px-3 bg-[#1a2f4a] rounded-r-md text-sm hover:bg-[#2a3f5a] disabled:opacity-50"
                  >
                    2×
                  </button>
                </div>
              </div>

              {/* Side Selection */}
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Choose Side</div>
                <div className="flex gap-3">
                  {(["HEAD", "TAIL"] as CoinSide[]).map((side) => (
                    <button
                      key={side}
                      onClick={() => setSelectedSide(side)}
                      disabled={isFlipping}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${
                        selectedSide === side
                          ? "bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-lg scale-105 text-black"
                          : "bg-[#1a2f4a] hover:bg-[#2a3f5a] text-white"
                      } disabled:opacity-50`}
                    >
                      {side === "HEAD" ? "🦅 HEAD" : "🏛️ TAIL"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flip Button */}
              <button
                onClick={handleFlip}
                disabled={isFlipping}
                className="w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFlipping ? "FLIPPING..." : "🪙 FLIP COIN"}
              </button>

              {/* Result Message */}
              {message && (
                <div
                  className={`text-center text-sm font-bold p-3 rounded-lg ${
                    message.includes("won")
                      ? "bg-green-500/20 text-green-400 border border-green-500/50"
                      : "bg-red-500/20 text-red-400 border border-red-500/50"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>

            {/* Center - Coin Display */}
            <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-emerald-500/20 flip-header-bg bg-gradient-to-b from-[#0f1e2e] to-[#0a1628] py-10 lg:py-0 order-1 lg:order-2">
              <div className="relative w-64 h-64 perspective">
                {isFlipping && (
                  <div className="coin-flip animate-coin-flip bg-gradient-to-br from-yellow-400 to-yellow-600"></div>
                )}
                {!isFlipping && result && (
                  <div
                    className={`coin-flip flex items-center justify-center text-4xl font-bold shadow-2xl ${
                      result === "HEAD"
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                        : "bg-gradient-to-br from-gray-300 to-gray-500"
                    }`}
                  >
                    {result === "HEAD" ? "🦅" : "🏛️"}
                  </div>
                )}
                {!isFlipping && !result && (
                  <div className="coin-flip flex items-center justify-center text-4xl font-bold bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-2xl">
                    🪙
                  </div>
                )}
              </div>

              {result && (
                <div className="mt-8 text-center">
                  <div className="text-3xl font-bold mb-2">
                    {result === "HEAD" ? "🦅 HEAD" : "🏛️ TAIL"}
                  </div>
                  <div className="text-xl text-emerald-400">
                    {currentMultiplier}x Multiplier
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Bet History */}
          </div>

          {/* Bottom Stats Bar */}
          <div className="flex items-center pl-3 pr-3">
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

      {/* Styles */}
      <style jsx>{`
  .perspective {
    perspective: 1200px;
  }

  .coin-flip {
    width: 256px;
    height: 256px;
    border-radius: 50%;
    border: 8px solid white;
    box-shadow: 
      0 0 40px rgba(255, 215, 0, 0.6),
      inset 0 0 20px rgba(255,255,255,0.4);
    transform-style: preserve-3d;
    display: flex;
    align-items: center;
    justify-content: center;
    
  }

  @keyframes realisticCoinFlip {
    0% {
      transform: rotateX(0deg) rotateZ(0deg);
    }

    20% {
      transform: rotateX(720deg) rotateZ(10deg);
    }

    50% {
      transform: rotateX(1440deg) rotateZ(-10deg);
    }

    75% {
      transform: rotateX(1800deg) rotateZ(5deg);
    }

    90% {
      transform: rotateX(1860deg) rotateZ(-2deg);
    }

    100% {
      transform: rotateX(1980deg) rotateZ(0deg);
    }
  }

  .animate-coin-flip {
    animation: realisticCoinFlip 2.2s cubic-bezier(0.15, 0.6, 0.25, 1);
  }
`}</style>

    </div>
  );
};

export default FlipGame;