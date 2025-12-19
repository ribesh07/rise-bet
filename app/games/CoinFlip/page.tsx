"use client";

import { apiRequest } from "@/utils/ApiHelper";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useCurrency } from "@/context/CurrencyContext";
import TopNavbar from "@/components/topnavbar";

type CoinSide = "heads" | "tails";

const FlipGame: React.FC = () => {
  const [selectedSide, setSelectedSide] = useState<CoinSide | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [result, setResult] = useState<CoinSide | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState<string>("");
const [search, setSearch] = useState("");
  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  const multiplier = 2;
const { currency, setCurrency } = useCurrency();
const [balance, setBalance] = useState<number>(0);
const [loading, setLoading] = useState(true);

 const parseWalletBalance = (b: any) => {
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

  // Can make dynamic if needed
useEffect(() => {
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
          let initialWallet = null;
          if (wallets.length > 0) {
            initialWallet =
              wallets.find((w: any) => String(w.currency || w.symbol).toUpperCase() === String(currency || "").toUpperCase()) ||
              wallets[0];
          }
          if (initialWallet) {
            // try common keys
            const bal = parseWalletBalance(initialWallet.balance ?? initialWallet.amount ?? 0);
            setBalance(bal);
            const curSymbol = (initialWallet.currency || initialWallet.symbol || initialWallet.asset || "").toString().toUpperCase();
            if (curSymbol) {
              setCurrency(curSymbol);
            }
          } else {
            setBalance(0);
          }
        }
      } catch (err) {
        console.error("AFFILIATE PAGE API ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardDetails();
  }, []);
  const handleFlip = () => {
    if (!selectedSide || betAmount <= 0) {
      setMessage("Select a side and enter a valid bet.");
      return;
    }

    setIsFlipping(true);
    setResult(null);
    setMessage("");
    setShowConfetti(false);

    setTimeout(() => {
      const flipResult: CoinSide = Math.random() < 0.5 ? "heads" : "tails";
      setResult(flipResult);
      setIsFlipping(false);

      if (flipResult === selectedSide) {
        setMessage(`You won! 🎉 You earned ${(betAmount * multiplier).toFixed(2)}`);
        setShowConfetti(true);
      } else {
        setMessage("You lost 😢");
      }
    }, 2000); // 2s flip
  };

    const handleCurrencyChange = (currencyType: string) => {
    if (!currencyType) return;
    const symbol = currencyType.toString().toUpperCase();
    setCurrency(symbol);
    const wallets = dashboardDetails?.wallets || [];
    const found = wallets.find(
      (w: any) => String(w.currency || w.symbol || w.asset).toUpperCase() === symbol
    );
    if (found) {
      const bal = parseWalletBalance(found.balance ?? found.amount ?? 0);
      setBalance(bal);
    } else {
      // fallback: try to leave balance unchanged or set to 0
      setBalance((prev) => prev); 
    }
  };

  return (
     <div className="flex min-h-screen roulette-header-bg text-white overflow-x-hidden relative flex-col">
        {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
      <TopNavbar
        searchValue={search}
        onSearchChange={setSearch}
        wallets={dashboardDetails?.wallets || []}
        onCurrencyChange={(currencyType) => {
          handleCurrencyChange(currencyType);
          console.log("Selected Currency:", currencyType);
        }}
      />
    <div className="min-h-screen roulette-recent-header-bg flex items-center justify-center ">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
  <div className="relative w-[380px] rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 text-white">

    {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

    {/* Header */}
    <h2 className="text-center text-2xl font-extrabold tracking-wide mb-4">
      🪙 Coin Flip
    </h2>

    {/* Bet Input */}
    <div className="mb-4">
      <label className="text-sm text-gray-300">Bet Amount</label>
      <input
        type="number"
        placeholder="Enter bet"
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
        className="mt-1 w-full rounded-lg bg-black/40 border border-white/20 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>

    {/* Side Selection */}
    <div className="flex gap-3 mb-4">
      {(["heads", "tails"] as CoinSide[]).map((side) => (
        <button
          key={side}
          onClick={() => setSelectedSide(side)}
          className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300
            ${
              selectedSide === side
                ? "bg-gradient-to-r from-green-400 to-green-600 shadow-lg scale-105"
                : "bg-white/20 hover:bg-white/30"
            }`}
        >
          {side.toUpperCase()}
        </button>
      ))}
    </div>

    {/* Coin */}
    <div className="flex justify-center my-6">
      <div className="relative w-28 h-28 perspective">
        {isFlipping && (
          <div className="coin animate-coinFlip"></div>
        )}
        {!isFlipping && result && (
          <div
            className={`coin flex items-center justify-center text-xl font-bold
              ${result === "heads" ? "bg-yellow-400" : "bg-gray-300"}`}
          >
            {result.toUpperCase()}
          </div>
        )}
      </div>
    </div>

    {/* Flip Button */}
    <button
      onClick={handleFlip}
      disabled={isFlipping}
      className="w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition disabled:opacity-50 shadow-xl"
    >
      {isFlipping ? "FLIPPING..." : "FLIP"}
    </button>

    {/* Result */}
    {message && (
      <div
        className={`mt-4 text-center text-lg font-bold ${
          message.includes("Win") ? "text-green-400" : "text-red-400"
        }`}
      >
        {message}
      </div>
    )}

    {/* Multiplier */}
    <div className="mt-3 text-center text-sm text-gray-300">
      Multiplier: <span className="text-white font-bold">{multiplier}x</span>
    </div>

    {/* CSS */}
    <style jsx>{`
      .perspective {
        perspective: 1000px;
      }

      .coin {
        width: 112px;
        height: 112px;
        border-radius: 50%;
        background: gold;
        border: 4px solid white;
        box-shadow: 0 0 25px rgba(255, 215, 0, 0.6);
        transform-style: preserve-3d;
      }

      @keyframes coinFlip {
        0% {
          transform: rotateX(0deg);
        }
        100% {
          transform: rotateX(1440deg);
        }
      }

      .animate-coinFlip {
        animation: coinFlip 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
    `}</style>
  </div>
</div>
    </div>

  );
};

export default FlipGame;
