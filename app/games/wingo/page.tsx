"use client";
import React, { useState, useEffect } from 'react';
import "@/app/css/wingo.css";
import GameHistory from "@/components/game/wingo/GameHistory";
import Chart from "@/components/game/wingo/Chart";
import FollowStrategy from "@/components/game/wingo/FollowStrategy";
import MyHistory from "@/components/game/wingo/MyHistory";
import TopNavbar from "@/components/topnavbar";
import { apiRequest } from "@/utils/ApiHelper";
import { useCurrency } from "@/context/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/sidebar";
import MobileBottomBar from "@/components/mainmobilebuttombar";
import RiseTopBar from "@/components/game/gamebottombar";
import GameDropdown from "@/components/game/gamedropup";
import { MyHistoryItem } from '@/components/game/wingo/types';
import type { GameHistoryItem as ImportedGameHistoryItem } from "@/components/game/wingo/types";
type BetType = "color" | "number" | "bigSmall";

interface Bet {
  type: BetType;
  selection: string | number;
  amount: number;
  period: string;
  time: string;
}

export default function WinGoGame() {
  const DURATIONS = [30, 60, 180, 300];
  const DURATION_LABELS = ['30sec', '1 Min', '3 Min', '5 Min'];
  
  const [durationIndex, setDurationIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(DURATIONS[0]);
  const [selectedColor, setSelectedColor] = useState<"Green" | "Red" | "Violet" | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [betType, setBetType] = useState<"Big" | "Small" | null>(null);

  const [selectedMultiplier, setSelectedMultiplier] = useState('X1');
  const [activeTab, setActiveTab] = useState('My history');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<MyHistoryItem | null>(null);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [betQuantity, setBetQuantity] = useState(1);
  const [agreeToRules, setAgreeToRules] = useState(false);
  const [search, setSearch] = useState("");
  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  const sidebarWidth = 64;
  const collapsedWidth = 20;
  const { currency, setCurrency } = useCurrency();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // API states
  const [lastBetId, setLastBetId] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
    
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
    
  // ✅ Fetch Dashboard Details
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
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      console.log("📱 Screen size changed - isMobile:", mobile);
      setIsMobile(mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    console.log("🚀 Component mounted, fetching initial dashboard details");
    fetchDashboardDetails();
  }, []);
  
  type GameHistoryItem = ImportedGameHistoryItem;

  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([
    { period: '20251228152590', number: 2, bigSmall: 'Small', color: 'red' },
    { period: '20251228152589', number: 2, bigSmall: 'Small', color: 'red' },
    { period: '20251228152588', number: 6, bigSmall: 'Big', color: 'red' },
    { period: '20251228152587', number: 6, bigSmall: 'Big', color: 'red' },
    { period: '20251228152586', number: 4, bigSmall: 'Small', color: 'red' },
    { period: '20251228152585', number: 6, bigSmall: 'Big', color: 'red' },
    { period: '20251228152584', number: 1, bigSmall: 'Small', color: 'green' },
    { period: '20251228152583', number: 1, bigSmall: 'Small', color: 'green' },
    { period: '20251228152582', number: 5, bigSmall: 'Big', color: 'green' },
    { period: '20251228152581', number: 7, bigSmall: 'Big', color: 'green' },
  ]);

  const [myHistory, setMyHistory] = useState<MyHistoryItem[]>([
    { 
      id: '202512281000052513', 
      result: 3, 
      time: '2025-12-29 02:41:11', 
      status: 'Succeed' as const, 
      amount: 1.96,
      orderNumber: 'WG20251228205611126048225072407',
      period: '202512281000052513',
      purchaseAmount: 1.00,
      quantity: 1,
      amountAfterTax: 0.98,
      tax: 0.02,
      select: 'Green',
      bigSmall: 'Small',
      winLose: 1.96
    },
    { 
      id: '202512281000052513', 
      result: 1, 
      time: '2025-12-29 02:41:04', 
      status: 'Failed' as const, 
      amount: -1.00,
      orderNumber: 'WG20251228205611126048225072406',
      period: '202512281000052513',
      purchaseAmount: 1.00,
      quantity: 1,
      amountAfterTax: 0.98,
      tax: 0.02,
      select: 'Red',
      bigSmall: 'Big',
      winLose: -1.00
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) return DURATIONS[durationIndex];
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [durationIndex]);

  const getDigits = (num: number) => {
    const mins = Math.floor(num / 60);
    const secs = num % 60;
    return {
      mins: mins.toString().padStart(2, "0").split(""),
      secs: secs.toString().padStart(2, "0").split("")
    };
  };

  const getColorClass = (color: string) => {
    if (color === "red") return "bg-red-500";
    if (color === "green") return "bg-green-500";
    if (color === "violet") return "bg-purple-500";
    return "bg-gray-500";
  };

  const calculateWinnings = (bet: Bet, result: number) => {
    const amountAfterTax = bet.amount * 0.98;
    let multiplier = 0;
    let won = false;

    if (bet.type === "color") {
      if (bet.selection === "Green") {
        if ([1, 3, 7, 9].includes(result)) {
          multiplier = 2;
          won = true;
        } else if (result === 5) {
          multiplier = 1.5;
          won = true;
        }
      } else if (bet.selection === "Red") {
        if ([2, 4, 6, 8].includes(result)) {
          multiplier = 2;
          won = true;
        } else if (result === 0) {
          multiplier = 1.5;
          won = true;
        }
      } else if (bet.selection === "Violet") {
        if ([0, 5].includes(result)) {
          multiplier = 4.5;
          won = true;
        }
      }
    }

    if (bet.type === "number" && bet.selection === result) {
      multiplier = 9;
      won = true;
    }

    if (bet.type === "bigSmall") {
      if (bet.selection === "Big" && [5, 6, 7, 8, 9].includes(result)) {
        multiplier = 2;
        won = true;
      }
      if (bet.selection === "Small" && [0, 1, 2, 3, 4].includes(result)) {
        multiplier = 2;
        won = true;
      }
    }

    const winAmount = won ? amountAfterTax * multiplier : 0;
    const netProfit = won ? winAmount - bet.amount : -bet.amount;

    return {
      won,
      winAmount,
      netProfit,
      amountAfterTax
    };
  };

  const generateGameResult = () => {
    return Math.floor(Math.random() * 10);
  };

  const getResultColor = (num: number): "red" | "green" | "violet" => {
    if (num === 0 || num === 5) return "violet";
    if ([1, 3, 7, 9].includes(num)) return "green";
    return "red";
  };

  const openBetModal = (type: BetType, selection: string | number) => {
    if (timeRemaining <= 5) {
      alert('Betting closed! Wait for the next round.');
      return;
    }

    if (type === 'color') {
      setSelectedColor(selection as "Green" | "Red" | "Violet");
      setSelectedNumber(null);
      setBetType(null);
    } else if (type === 'number') {
      setSelectedNumber(selection as number);
      setSelectedColor(null);
      setBetType(null);
    } else if (type === 'bigSmall') {
      setBetType(selection as "Big" | "Small");
      setSelectedColor(null);
      setSelectedNumber(null);
    }

    setBetAmount(1);
    setBetQuantity(1);
    setSelectedMultiplier('X1');
    setAgreeToRules(false);
    setShowBetModal(true);
  };

  const confirmBet = () => {
    if (!agreeToRules) {
      alert('Please agree to the pre-sale rules');
      return;
    }

    const totalBet = betAmount * betQuantity;
    
    if (totalBet > balance) {
      alert('Insufficient balance!');
      return;
    }
    
    setBalance(prev => prev - totalBet);

    const currentPeriod = '202512281000052525';
    const bet: Bet = {
      type: selectedColor ? 'color' : selectedNumber !== null ? 'number' : 'bigSmall',
      selection: selectedColor || (selectedNumber !== null ? selectedNumber : betType!),
      amount: totalBet,
      period: currentPeriod,
      time: new Date().toLocaleString('en-GB', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      }).replace(/(\d{2})\/(\d{2})\/(\d{4}),/, '$3-$2-$1')
    };

    setTimeout(() => {
      const result = generateGameResult();
      const resultColor = getResultColor(result);
      const calculation = calculateWinnings(bet, result);

      if (calculation.won) {
        setBalance(prev => prev + calculation.winAmount);
      }

      const newHistoryItem: MyHistoryItem = {
        id: currentPeriod,
        result: result,
        time: bet.time,
        status: calculation.won ? 'Succeed' as const : 'Failed' as const,
        amount: calculation.netProfit,
        orderNumber: `WG${Date.now()}${Math.floor(Math.random() * 10000)}`,
        period: currentPeriod,
        purchaseAmount: bet.amount,
        quantity: 1,
        amountAfterTax: calculation.amountAfterTax,
        tax: bet.amount * 0.02,
        select: bet.type === 'color' ? String(bet.selection) : bet.type === 'number' ? `Number ${bet.selection}` : String(bet.selection),
        bigSmall: [5, 6, 7, 8, 9].includes(result) ? 'Big' : 'Small',
        winLose: calculation.netProfit
      };

      setMyHistory(prev => [newHistoryItem, ...prev]);

      const newGameHistory: GameHistoryItem = {
        period: currentPeriod,
        number: result,
        bigSmall: [5, 6, 7, 8, 9].includes(result) ? 'Big' : 'Small',
        color: resultColor
      };
      setGameHistory(prev => [newGameHistory, ...prev]);
    }, timeRemaining * 1000);

    setSelectedColor(null);
    setSelectedNumber(null);
    setBetType(null);
    setSelectedMultiplier('X1');
    setBetQuantity(1);
    setAgreeToRules(false);
    setShowBetModal(false);
  };

  const getModalColor = () => {
    if (selectedColor === 'Green') return '#22c55e';
    if (selectedColor === 'Red') return '#ef4444';
    if (selectedColor === 'Violet') return '#a855f7';
    if (selectedNumber !== null) {
      if ([1, 3, 7, 9].includes(selectedNumber)) return '#22c55e';
      if ([2, 4, 6, 8].includes(selectedNumber)) return '#ef4444';
      if ([0, 5].includes(selectedNumber)) return '#a855f7';
    }
    if (betType === 'Big') return '#fb923c';
    if (betType === 'Small') return '#60a5fa';
    return '#22c55e';
  };

  const getButtonColor = (isSelected: boolean) => {
    const baseColor = getModalColor();
    if (!isSelected) return 'bg-gray-100 text-gray-600';
    return `text-white`;
  };

  const digits = getDigits(timeRemaining);

  return (
    <div className="flex min-h-screen bg-[#1a2c38] text-white overflow-x-hidden relative flex-col">
       <div className="flex flex-1">
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
        <motion.main
          className="flex-1 flex flex-col overflow-auto pt-24.75 pb-16 md:px-8"
          animate={{
            marginLeft: !isMobile
              ? sidebarCollapsed
                ? collapsedWidth * 4
                : sidebarWidth * 4
              : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
    <div className="w-full max-w-md mx-auto bg-gray-50 min-h-screen flex flex-col p-2 rounded-2xl">
      {/* Time Selection Buttons */}
      <div className="flex gap-3 bg-white rounded-2xl shadow p-4 m-4">
        {DURATIONS.map((dur, i) => (
        <button 
            key={dur} 
            onClick={() => {
              setDurationIndex(i);
              setTimeRemaining(dur);
            }}
            
  
                className={`flex-1 flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all ${
                    i === durationIndex
                    ? 'bg-gold-gradient text-white'
                    : 'bg-white text-[#768096]'
                }`}
                >


            <img 
              src={`/color/${i === durationIndex ? 'time_active' : 'time-inactive'}.webp`} 
              className="w-10 h-10 object-contain mb-1" 
              alt="clock"
            />
            <span
                className={`flex flex-col text-xs leading-tight ${
                    i === durationIndex ? 'text-white' : 'text-[#768096]'
                }`}
                >
                WinGo
                <span>{DURATION_LABELS[i]}</span>
                </span>

          </button>
        ))}
      </div>
 {/* Game Info Section */}
      <div 
        className="mx-4 mb-4 rounded-2xl p-4 "
        style={{
          backgroundImage: 'url(/color/bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={() => setShowRulesModal(true)}
            className="bg-white/40 px-4 py-2 rounded-full text-white text-sm flex items-center gap-2 hover:bg-white/50 transition"
          >
            <span>📖</span> How to play
          </button>
          <div className="text-white font-semibold">Time remaining</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="text-white text-xs">
              WinGo {DURATION_LABELS[durationIndex]}
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} className="w-6 h-6 rounded-full bg-linear-to-br  flex items-center justify-center">
                  <img src={`/color/ball_${n}.webp`} alt={`ball ${n}`} className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-1">
            {digits.mins.map((digit, idx) => (
              <div key={`m${idx}`} className="w-8 h-10 bg-white rounded flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{digit}</span>
              </div>
            ))}
            <span className="text-white text-2xl font-bold mx-1">:</span>
            {digits.secs.map((digit, idx) => (
              <div key={`s${idx}`} className="w-8 h-10 bg-white rounded flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{digit}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-white text-xs text-right mt-1">202512281000052525</div>
      </div>
      {/* Color Selection */}
      <div className="flex gap-3 px-4 mb-4">
        <button 
          onClick={() => openBetModal('color', 'Green')}
          className="flex-1 py-3 rounded-lg text-white font-semibold transition bg-green-500 hover:bg-green-600 active:scale-95"
        >
          Green
        </button>
        <button 
          onClick={() => openBetModal('color', 'Violet')}
          className="flex-1 py-3 rounded-lg text-white font-semibold transition bg-purple-500 hover:bg-purple-600 active:scale-95"
        >
          Violet
        </button>
        <button 
          onClick={() => openBetModal('color', 'Red')}
          className="flex-1 py-3 rounded-lg text-white font-semibold transition bg-red-500 hover:bg-red-600 active:scale-95"
        >
          Red
        </button>
      </div>

      {/* Number Selection */}
      <div className="grid grid-cols-5 gap-3 px-4 mb-4 bg-white rounded-2xl shadow p-4">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
          const bgColor = num === 0 || num === 5 ? 'bg-purple-500' :
                         [1, 3, 7, 9].includes(num) ? 'bg-green-500' :
                         'bg-red-500';
          return (
            <button
              key={num}
              onClick={() => openBetModal('number', num)}
              className={`${bgColor} w-12 h-12 rounded-full text-white font-bold text-lg hover:scale-110 active:scale-95 transition-transform shadow-md`}
            >
              <img
        src={`/color/ball_${num}.webp`}
        alt={`ball ${num}`}
        className={`
          w-12 h-12 rounded-full transition-all
          
        `}
      />
            </button>
          );
        })}
      </div>

      {/* Big/Small Selection */}
      <div className="flex gap-0 px-4 mb-4">
        <button
          onClick={() => openBetModal('bigSmall', 'Big')}
          className="flex-1 py-4 font-semibold text-white rounded-l-full bg-orange-400 hover:bg-orange-500 active:scale-95 transition"
        >
          Big
        </button>
        <button
          onClick={() => openBetModal('bigSmall', 'Small')}
          className="flex-1 py-4 font-semibold text-white rounded-r-full bg-blue-400 hover:bg-blue-500 active:scale-95 transition"
        >
          Small
        </button>
      </div>

      {/* Balance Display */}
     

      {/* Bottom Tabs */}
      <div className="flex bg-[#F6F6F6] rounded-xl overflow-hidden mx-4 mb-2">
        <button 
          onClick={() => setActiveTab('Game history')}
          className={`flex-1 py-3 text-sm ${activeTab === 'Game history' ? 'text-white bg-[#b8926f] font-semibold rounded-xl' : 'text-gray-500'}`}
        >
          Game history
        </button>
        <button 
          onClick={() => setActiveTab('Chart')}
          className={`flex-1 py-3 text-sm ${activeTab === 'Chart' ? 'text-white bg-[#b8926f] font-semibold rounded-xl' : 'text-gray-500'}`}
        >
          Chart
        </button>
       
        <button 
          onClick={() => setActiveTab('Follow Strategy')}
          className={`flex-1 py-3 text-sm ${activeTab === 'Follow Strategy' ? 'text-white bg-[#b8926f] font-semibold rounded-xl' : 'text-gray-500'}`}
        >
         Follow Strategy
        </button>

        <button 
          onClick={() => setActiveTab('My history')}
          className={`flex-1 py-3 text-sm ${activeTab === 'My history' ? 'text-white bg-[#b8926f] font-semibold rounded-xl' : 'text-gray-500'}`}
        >
          My history
        </button>
      </div>

      {/* Tab Content */}
      
        {activeTab === "Game history" && (
          <GameHistory
            gameHistory={gameHistory}
            getColorClass={getColorClass}
          />
        )}
        
        {activeTab === "Chart" && <Chart gameHistory={gameHistory} />}
        
        {activeTab === "Follow Strategy" && <FollowStrategy />}
        
        {activeTab === "My history" && (
          <MyHistory
            myHistory={myHistory}
            selectedHistoryItem={selectedHistoryItem}
            setSelectedHistoryItem={setSelectedHistoryItem}
            getColorClass={getColorClass}
          />
        )}
      

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-linear-to-r from-yellow-500 to-orange-500 border-b p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">How to Play</h3>
              <button
                onClick={() => setShowRulesModal(false)}
                className="text-3xl text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 rounded-lg p-4 text-sm text-black space-y-3">
                <ol className="list-decimal list-inside space-y-3">
                  <li>
                    <span className="text-green-500 font-semibold">Select green:</span> If the result shows 
                    <span className="text-green-500 font-semibold"> 1, 3, 7, 9</span> you will get <span className="font-bold">₹196</span>;  
                    If the result shows <span className="text-green-500 font-semibold"> 5</span>, you will get <span className="font-bold">₹147</span>
                  </li>
                  <li>
                    <span className="text-red-500 font-semibold">Select red:</span> If the result shows 
                    <span className="text-red-500 font-semibold"> 2, 4, 6, 8</span>, you will get <span className="font-bold">₹196</span>;  
                    If the result shows <span className="text-red-500 font-semibold"> 0</span>, you will get <span className="font-bold">₹147</span>
                  </li>
                  <li>
                    <span className="text-purple-500 font-semibold">Select violet:</span> If the result shows 
                    <span className="text-purple-500 font-semibold"> 0 or 5</span>, you will get <span className="font-bold">₹441</span>
                  </li>
                  <li>
                    <span className="text-yellow-600 font-semibold">Select number:</span> If the result is the same as the number you selected, you will get <span className="font-bold">₹882</span>
                  </li>
                  <li>
                    <span className="text-orange-500 font-semibold">Select big:</span> If the result shows 
                    <span className="text-orange-500 font-semibold"> 5, 6, 7, 8, 9</span>, you will get <span className="font-bold">₹196</span>
                  </li>
                  <li>
                    <span className="text-blue-500 font-semibold">Select small:</span> If the result shows 
                    <span className="text-blue-500 font-semibold"> 0, 1, 2, 3, 4</span>, you will get <span className="font-bold">₹196</span>
                  </li>
                </ol>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <p className="font-semibold text-yellow-800">Note:</p>
                  <p className="text-yellow-700">All winnings are calculated after 2% tax deduction from your bet amount.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bet Confirmation Modal */}
      {showBetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center pb-10 z-50">
          <div 
            className="w-full max-w-md rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up"
            style={{ backgroundColor: getModalColor() }}
          >
            {/* Header */}
            <div className="text-center py-4 px-6 text-white">
              <h3 className="text-lg font-bold">WinGo 3 Min</h3>
              <div className="mt-2 bg-white rounded-lg py-2 px-4 text-gray-800 font-semibold">
                Select {selectedColor || (selectedNumber !== null ? selectedNumber : betType)}
              </div>
            </div>

            {/* White content area */}
            <div className="bg-white rounded-t-3xl p-6">
              {/* Balance Selection */}
              <div className="mb-6">
                <h4 className="text-gray-700 font-semibold mb-3">Balance</h4>
                <div className="flex gap-2">
                  {[1, 10, 100, 1000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      className={`flex-1 py-2 rounded-lg font-semibold transition ${
                        betAmount === amount ? 'text-white shadow-md' : 'bg-gray-100 text-gray-600'
                      }`}
                      style={betAmount === amount ? { backgroundColor: getModalColor() } : {}}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h4 className="text-gray-700 font-semibold mb-3">Quantity</h4>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setBetQuantity(Math.max(1, betQuantity - 1))}
                    className="w-10 h-10 rounded-lg font-bold text-xl text-gray-700 shadow-md"
                    style={{ backgroundColor: getModalColor() }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={betQuantity}
                    onChange={(e) => setBetQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center text-gray-700 border-2 border-gray-200 rounded-lg py-2 font-semibold"
                  />
                  <button
                    onClick={() => setBetQuantity(betQuantity + 1)}
                    className="w-10 h-10 rounded-lg font-bold text-xl text-white shadow-md"
                    style={{ backgroundColor: getModalColor() }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Multiplier Selection */}
              <div className="mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {['X1', 'X5', 'X10', 'X20', 'X50', 'X100'].map(mult => (
                    <button
                      key={mult}
                      onClick={() => setSelectedMultiplier(mult)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition ${
                        selectedMultiplier === mult ? 'text-white shadow-md' : 'bg-gray-100 text-gray-600'
                      }`}
                      style={selectedMultiplier === mult ? { backgroundColor: getModalColor() } : {}}
                    >
                      {mult}
                    </button>
                  ))}
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="mb-6 flex items-center gap-2">
                <button
                  onClick={() => setAgreeToRules(!agreeToRules)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    agreeToRules ? 'border-green-500' : 'border-gray-300'
                  }`}
                  style={agreeToRules ? { backgroundColor: getModalColor() } : {}}
                >
                  {agreeToRules && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className="text-sm text-gray-600">
                  I agree <span className="text-red-500">《Pre-sale rules》</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBetModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBet}
                  className="flex-1 py-3 rounded-lg font-semibold text-white transition shadow-md"
                  style={{ backgroundColor: getModalColor() }}
                >
                  Total amount ₹{(betAmount * betQuantity).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
     
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
}