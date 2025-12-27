
'use client';

import { useEffect, useRef, useState } from "react";
import "@/app/css/limbo.css";
import { Button } from "@/components/ui/button";
import TopNavbar from "@/components/topnavbar";
import { apiRequest } from "@/utils/ApiHelper";
import { useCurrency } from "@/context/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/sidebar";
import MobileBottomBar from "@/components/mainmobilebuttombar";
import RiseTopBar from "@/components/game/gamebottombar";
import GameDropdown from "@/components/game/gamedropup";


const LimboGame = () => {
  const [bet, setBet] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const [targetMultiplier, setTargetMultiplier] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<"WIN" | "LOSE" | null>(null);
  const [isAuto, setIsAuto] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
      const [sidebarOpen, setSidebarOpen] = useState(false);
       const [isMobile, setIsMobile] = useState(false);
  // ✅ AUTO STATES
  const [autoBets, setAutoBets] = useState(10);
  const [remainingBets, setRemainingBets] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const winChance = 99 / targetMultiplier;
  const profit = bet * targetMultiplier - bet;
    const [search, setSearch] = useState("");
    const [dashboardDetails, setDashboardDetails] = useState<any>(null);
     const sidebarWidth = 64;
  const collapsedWidth = 20;
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
  const generateMultiplier = () => {
    const r = Math.random();
    return Number(Math.min(100, (1 / (1 - r)) * 0.99).toFixed(2));
  };

  const playRound = () => {
    if (isPlaying) return;

    setIsPlaying(true);
    setResult(null);
    setMultiplier(1);

    let current = 1;
    const roll = generateMultiplier();

    const anim = setInterval(() => {
      current += 0.15;
      setMultiplier(Number(current.toFixed(2)));

      if (current >= roll) {
        clearInterval(anim);
        setMultiplier(roll);
        setResult(roll >= targetMultiplier ? "WIN" : "LOSE");
        setIsPlaying(false);

        // ✅ decrease auto bets
        setRemainingBets((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }, 20);
  };

  // ✅ MANUAL BET
  const handleManualBet = () => {
    if (!isPlaying) playRound();
  };


  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // ✅ AUTO BET START
  const handleAutoStart = () => {
    if (autoBets <= 0) return;
    setRemainingBets(autoBets);
  };

  // ✅ AUTO LOOP
  useEffect(() => {
    if (!isAuto || remainingBets <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      if (!isPlaying && remainingBets > 0) {
        playRound();
      }
    }, 1200);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuto, remainingBets, isPlaying]);

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
    <div className="flex min-h-screen bg-[#1a2c38] text-white overflow-x-hidden relative flex-col">
        <div className="flex flex-1">
        {/* Sidebar */}
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
          <AnimatePresence>
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 w-full z-30"
            >
              
            </motion.div>
          </AnimatePresence>
          <TopNavbar
            searchValue={search}
            onSearchChange={setSearch}
            wallets={dashboardDetails?.wallets || []}
          />
        </motion.div>

        {/* Main Content */}
        <motion.main
          className="flex-1 flex flex-col overflow-auto pt-[95px] pb-16  md:px-8"
          animate={{
            marginLeft: !isMobile
              ? sidebarCollapsed
                ? collapsedWidth * 4
                : sidebarWidth * 4
              : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >

  {/* MAIN CONTENT */}
  <div className="flex flex-col lg:flex-row gap-4 p-3 min-h-screen">

    {/* BET PANEL (Below multiplier on mobile) */}
    <div
      className="
        w-full lg:w-80
        bg-[#122733] rounded-xl p-4 space-y-4
        order-2 lg:order-1
      "
    >

      {/* Toggle */}
      <div className="flex bg-[#0b1c26] rounded-lg p-1">
        <button
          onClick={() => setIsAuto(false)}
          className={`flex-1 py-2 rounded-md text-sm ${
            !isAuto ? "bg-[#122733]" : "text-gray-400"
          }`}
        >
          Manual
        </button>
        <button
          onClick={() => setIsAuto(true)}
          className={`flex-1 py-2 rounded-md text-sm ${
            isAuto ? "bg-[#122733]" : "text-gray-400"
          }`}
        >
          Auto
        </button>
      </div>

      {/* Bet Amount */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs sm:text-sm text-gray-400">
          <span>Bet Amount</span>
          <span>{bet.toFixed(8)} BTC</span>
        </div>

        <div className="flex">
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            className="flex-1 bg-[#0b1c26] p-2 rounded-l-md outline-none text-sm"
          />
          <button
            onClick={() => setBet(bet / 2)}
            className="px-3 bg-[#1b3948] text-sm"
          >
            ½
          </button>
          <button
            onClick={() => setBet(bet * 2)}
            className="px-3 bg-[#1b3948] rounded-r-md text-sm"
          >
            2×
          </button>
        </div>
      </div>

      {/* Target Multiplier */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs sm:text-sm text-gray-400">
          <span>Target Multiplier</span>
          <span>{targetMultiplier.toFixed(2)}x</span>
        </div>

        <input
          type="number"
          step="0.01"
          value={targetMultiplier}
          onChange={(e) => setTargetMultiplier(Number(e.target.value))}
          className="w-full bg-[#0b1c26] p-2 rounded-md outline-none text-sm"
        />
      </div>

      {/* AUTO INPUT */}
      {isAuto && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs sm:text-sm text-gray-400">
            <span>Number of Bets</span>
            <span>{remainingBets || autoBets}</span>
          </div>

          <input
            type="number"
            min={1}
            value={autoBets}
            onChange={(e) => setAutoBets(Number(e.target.value))}
            className="w-full bg-[#0b1c26] p-2 rounded-md outline-none text-sm"
          />
        </div>
      )}

      {/* ACTION BUTTON */}
      <Button
        className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3"
        onClick={isAuto ? handleAutoStart : handleManualBet}
      >
        {isAuto ? "Start Auto" : "Bet"}
      </Button>

      {/* Profit Box */}
      <div className="bg-[#0b1c26] p-3 rounded-md text-sm">
        <div className="flex justify-between text-gray-400">
          <span>Total Profit ({targetMultiplier.toFixed(2)}x)</span>
          <span>{profit.toFixed(8)} BTC</span>
        </div>
        <div className="flex justify-between mt-1 items-center">
          <span className="text-base sm:text-lg">{profit.toFixed(2)}</span>
          <span className="bg-green-500 text-black px-2 rounded">$</span>
        </div>
      </div>
    </div>

    {/* MULTIPLIER (Top on mobile) */}
    {/* <div
      className="
        flex-1 flex items-center justify-center bg-[#0b1c26]
        py-10 lg:py-0
        order-1 lg:order-2
      "
    >
      <div
        className={`multiplier text-4xl sm:text-5xl lg:text-6xl font-bold ${
          result === "WIN" ? "win" : result === "LOSE" ? "lose" : ""
        }`}
      >
        {multiplier.toFixed(2)}x
      </div>
    </div> */}
    {/* MULTIPLIER (Top on mobile) */}
<div
  className="
    flex-1 flex items-center justify-center  rounded-2xl
      border border-white/10
      bg-gradient-to-b from-[#0f2a38] to-[#09161f]
    py-10 lg:py-0
    order-1 lg:order-2
  "
>
  <div
    className={`
      relative
      w-full max-w-md sm:max-w-lg lg:max-w-xl
      h-48 sm:h-56 lg:h-64
      rounded-2xl
      border border-white/10
      bg-gradient-to-b from-[#0f2a38] to-[#09161f]
      shadow-[0_0_30px_rgba(0,0,0,0.8)]
      flex items-center justify-center
      transition-all duration-300
      ${
        result === "WIN"
          ? "border-green-400 shadow-[0_0_40px_rgba(34,197,94,0.6)]"
          : result === "LOSE"
          ? "border-red-400 shadow-[0_0_40px_rgba(239,68,68,0.6)]"
          : ""
      }
    `}
  >
    {/* Decorative grid lines */}
     <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)]" /> 

    {/* Multiplier Text */}
     <div
      className={`
        relative z-10
        text-3xl sm:text-3xl lg:text-3xl
        font-extrabold tracking-tight
        ${
          result === "WIN"
            ? "text-green-400"
            : result === "LOSE"
            ? "text-red-400"
            : "text-white"
        }
      `}
    >
      {/* {multiplier.toFixed(2)}x */}
    </div> 

    {/* Status badge */}
     <div
        className={`multiplier text-4xl sm:text-5xl lg:text-6xl font-bold ${
          result === "WIN" ? "win" : result === "LOSE" ? "lose" : ""
        }`}
      >
        {multiplier.toFixed(2)}x
      </div>
  </div>
 
</div>  
 
</div>
<div className= "flex items-center pl-3 pr-3">
<RiseTopBar/>

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

export default LimboGame;
