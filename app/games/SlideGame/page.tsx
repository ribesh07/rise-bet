
// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { Users } from "lucide-react";
// import { useCurrency } from "@/context/CurrencyContext";
// import TopNavbar from "@/components/topnavbar";
// import { motion, AnimatePresence } from "framer-motion";
// import Sidebar from "@/components/sidebar";
// import MobileBottomBar from "@/components/mainmobilebuttombar";
// import RiseTopBar from "@/components/game/gamebottombar";
// import { apiRequest } from "@/utils/ApiHelper";

// /* ---------- HISTORY ---------- */
// const initialHistory = [
//   1.36, 1.42, 4.87, 2.35, 1.38, 1.28, 6.55, 1.04, 1.52, 0.0, 9.77, 2.68,
// ];

// /* ---------- SLIDES ---------- */
// const slides = [
//   { value: 2.24, color: "bg-slate-700" },
//   { value: 1.2, color: "bg-slate-700" },
//   { value: 1.75, color: "bg-slate-700" },
//   { value: 2.68, color: "bg-slate-600" },
//   { value: 3.16, color: "bg-slate-700" },
//   { value: 1.35, color: "bg-slate-700" },
//   { value: 18.76, color: "bg-yellow-700" },
// ];

// /* duplicate for infinite illusion */
// const EXTENDED = [...slides, ...slides, ...slides];

// export default function CrashSlideGame() {
//   const [betAmount, setBetAmount] = useState("0.00");
//   const [targetMultiplier, setTargetMultiplier] = useState("2.00");
  

//   const [nextRound, setNextRound] = useState(16);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [hasBet, setHasBet] = useState(false);

//   const [ballX, setBallX] = useState(0);
//   const [resultIndex, setResultIndex] = useState<number | null>(null);
//   const [showResult, setShowResult] = useState(false);
//   const [gameResult, setGameResult] = useState<"win" | "loss" | null>(null);

//   const [history, setHistory] = useState(initialHistory);

//   const slideRef = useRef<HTMLDivElement>(null);

//    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//       const [sidebarOpen, setSidebarOpen] = useState(false);
     
//         const { currency, setCurrency } = useCurrency();
//         const [balance, setBalance] = useState<number>(0);
//         const [loading, setLoading] = useState(true);
//          const [message, setMessage] = useState<string>("");
//           const [search, setSearch] = useState("");
//           const [dashboardDetails, setDashboardDetails] = useState<any>(null);
//           const [isMobile, setIsMobile] = useState(false);
//       const sidebarWidth = 64;
//       const collapsedWidth = 20;
//     const parseWalletBalance = (b: any) => {
//         console.log("🔍 Parsing wallet balance:", b);
//         if (b === null || b === undefined) return 0;
//         if (typeof b === "number") return b;
//         const n = parseFloat(String(b));
//         return isNaN(n) ? 0 : n;
//       };
    
//       const conversionRates: Record<string, number> = {
//         INR: 83.0,
//         USD: 1,
//         USDT: 1,
//         BTC: 1 / 60000,
//         ETH: 1 / 1800,
//         LTC: 1 / 90,
//         SOL: 1 / 100,
//         XRP: 1 / 0.5,
//         TRX: 1 / 0.07,
//         BNB: 1 / 300,
//         USDC: 1,
//       };
    
//       const currencySymbols: Record<string, { sym: string; decimals: number }> = {
//         INR: { sym: "₹", decimals: 2 },
//         USD: { sym: "$", decimals: 2 },
//         USDT: { sym: "$", decimals: 2 },
//         USDC: { sym: "$", decimals: 2 },
//         BTC: { sym: "₿", decimals: 8 },
//         ETH: { sym: "Ξ", decimals: 8 },
//         LTC: { sym: "Ł", decimals: 8 },
//         SOL: { sym: "◎", decimals: 8 },
//         XRP: { sym: "✕", decimals: 6 },
//         TRX: { sym: "T", decimals: 6 },
//         BNB: { sym: "🟡", decimals: 6 },
//       };
    
//       const formatCurrency = (value: number, cur = currency) => {
//         if (cur && currencySymbols[cur]) {
//           const { sym, decimals } = currencySymbols[cur];
//           return `${sym}${Number(value).toLocaleString(undefined, {
//             minimumFractionDigits: decimals,
//             maximumFractionDigits: decimals,
//           })}`;
//         }
//         return `${value.toLocaleString()}`;
//       };
    
//       // Fetch Dashboard Details
//       const fetchDashboardDetails = async () => {
//         console.log("📊 Fetching dashboard details...");
//         try {
//           const token = localStorage.getItem("token");
//           const id = localStorage.getItem("userId");
//           console.log("🔑 Token:", token ? "exists" : "missing");
//           console.log("👤 User ID:", id);
    
//           const res = await apiRequest(`/users/${id}/details`, true, {
//             method: "GET",
//             headers: { Authorization: `Bearer ${token}` },
//           });
    
//           console.log("📥 Dashboard API Response:", res);
    
//           if (res.success) {
//             setDashboardDetails(res.data);
//             const wallets = res.data.wallets || [];
//             let initialWallet = null;
//             if (wallets.length > 0) {
//               initialWallet =
//                 wallets.find(
//                   (w: any) =>
//                     String(w.currency || w.symbol).toUpperCase() ===
//                     String(currency || "").toUpperCase()
//                 ) || wallets[0];
//             }
    
//             if (initialWallet) {
//               const bal = parseWalletBalance(
//                 initialWallet.balance ?? initialWallet.amount ?? 0
//               );
//               setBalance(bal);
//               const curSymbol = (
//                 initialWallet.currency ||
//                 initialWallet.symbol ||
//                 initialWallet.asset ||
//                 ""
//               )
//                 .toString()
//                 .toUpperCase();
//               if (curSymbol) {
//                 setCurrency(curSymbol);
//               }
//             } else {
//               setBalance(0);
//             }
//           }
//         } catch (err) {
//           console.error("💥 Dashboard API Error:", err);
//         } finally {
//           setLoading(false);
//         }
//       };
//         useEffect(() => {
//           fetchDashboardDetails();
//           // fetchBetHistory();
//         }, []);
//         useEffect(() => {
//   const checkMobile = () => setIsMobile(window.innerWidth < 768);
//   checkMobile();
//   window.addEventListener("resize", checkMobile);
//   return () => window.removeEventListener("resize", checkMobile);
// }, []);
//   /* ---------- TIMER ---------- */
//   useEffect(() => {
//     if (!isPlaying && nextRound > 0) {
//       const t = setTimeout(() => setNextRound((p) => p - 1), 1000);
//       return () => clearTimeout(t);
//     }
//     if (!isPlaying && nextRound === 0) startRound();
//   }, [nextRound, isPlaying]);

//   /* ---------- WEIGHTED RANDOM ---------- */
//   const pickResult = () => {
//     const weights = slides.map((s) =>
//       s.value >= 10 ? 1 : s.value >= 5 ? 3 : s.value >= 2 ? 6 : 10
//     );
//     const total = weights.reduce((a, b) => a + b, 0);
//     let r = Math.random() * total;
//     for (let i = 0; i < weights.length; i++) {
//       r -= weights[i];
//       if (r <= 0) return i;
//     }
//     return 0;
//   };

//   /* ---------- ROUND ---------- */
//   const startRound = () => {
//     setIsPlaying(true);
//     setShowResult(false);
//     setGameResult(null);
//     setResultIndex(null);

//     const result = pickResult();
//     const slideWidth = slideRef.current?.offsetWidth || 800;

//     const ITEM_WIDTH = 112; // 96px + gap
//     const middleOffset = slideWidth / 2 - ITEM_WIDTH / 2;
//     const target =
//       slides.length * ITEM_WIDTH + result * ITEM_WIDTH + middleOffset;

//     const duration = 3000;
//     let start: number | null = null;

//     const animate = (time: number) => {
//       if (!start) start = time;
//       const progress = Math.min((time - start) / duration, 1);
//       const ease = 1 - Math.pow(1 - progress, 4);
//       setBallX(target * ease);

//       if (progress < 1) requestAnimationFrame(animate);
//       else finishRound(result);
//     };

//     requestAnimationFrame(animate);
//   };

//   /* ---------- FINISH ---------- */
//   const finishRound = (idx: number) => {
//     const mult = slides[idx].value;
//     setResultIndex(idx);
//     setShowResult(true);

//     if (hasBet) {
//       const bet = parseFloat(betAmount);
//       const target = parseFloat(targetMultiplier);

//       if (mult >= target) {
//         setGameResult("win");
//         setBalance((b) => b + bet * mult);
//       } else {
//         setGameResult("loss");
//       }
//     }

//     setHistory((h) => [mult, ...h.slice(0, 11)]);

//     setTimeout(() => {
//       setIsPlaying(false);
//       setHasBet(false);
//       setBallX(0);
//       setNextRound(16);
//       setShowResult(false);
//       setGameResult(null);
//     }, 3000);
//   };

//   /* ---------- BET ---------- */
//   const placeBet = () => {
//     const bet = parseFloat(betAmount);
//     if (bet <= 0 || bet > balance || hasBet || isPlaying) return;
//     setBalance((b) => b - bet);
//     setHasBet(true);
//   };

//   /* ---------- HISTORY COLOR ---------- */
//   const historyColor = (m: number) =>
//     m < 2 ? "bg-slate-700" : m < 5 ? "bg-blue-500" : m < 10 ? "bg-purple-500" : "bg-yellow-500";

//   return (
//      <div className="flex min-h-screen bg-[#0a1628] text-white overflow-x-hidden relative flex-col">
//       {/* {showConfetti && <Confetti numberOfPieces={200} recycle={false} />} */}

//       <div className="flex flex-1">
//         {/* Sidebar */}
//         {!isMobile && (
//           <motion.div
//             animate={{
//               width: sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4,
//             }}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className="h-screen bg-[#0f172a] shadow-lg overflow-hidden fixed left-0 top-0 z-50"
//           >
//             <Sidebar
//               collapsed={sidebarCollapsed}
//               setCollapsed={setSidebarCollapsed}
//               open={true}
//               setOpen={() => {}}
//             />
//           </motion.div>
//         )}

//         {/* Navbar */}
//         <motion.div
//           className="fixed top-0 left-0 right-0 z-40"
//           animate={{
//             marginLeft: !isMobile
//               ? sidebarCollapsed
//                 ? collapsedWidth * 4
//                 : sidebarWidth * 4
//               : 0,
//           }}
//           transition={{ type: "spring", stiffness: 300, damping: 30 }}
//         >
//           <TopNavbar
//             searchValue={search}
//             onSearchChange={setSearch}
//             wallets={dashboardDetails?.wallets || []}
//           />
//         </motion.div>

//         {/* Main Content */}
//         <motion.main
//           className="flex-1 flex flex-col overflow-auto pt-[95px] pb-16 md:px-8"
//           animate={{
//             marginLeft: !isMobile
//               ? sidebarCollapsed
//                 ? collapsedWidth * 4
//                 : sidebarWidth * 4
//               : 0,
//           }}
//           transition={{ type: "spring", stiffness: 300, damping: 30 }}
//         >
//     <div className="min-h-screen bg-gradient-to-b from-[#0f212e] to-[#0b1a24] text-white p-4">
//       <div className="max-w-7xl mx-auto">

//         <div className="grid lg:grid-cols-[320px_1fr] gap-6">

//           {/* LEFT PANEL */}
//           <div className="bg-slate-800/40 rounded-xl p-6 space-y-4">
//             <div className="flex gap-2">
//               <button className="flex-1 bg-slate-700 py-2 rounded-lg">Manual</button>
//               <button className="flex-1 bg-slate-900/50 py-2 rounded-lg">Auto</button>
//             </div>

//             <div>
//               <label className="text-sm text-gray-400">Bet Amount</label>
//               <input
//                 className="w-full bg-slate-900/50 p-3 rounded-lg text-xl font-bold"
//                 value={betAmount}
//                 onChange={(e) => setBetAmount(e.target.value)}
//                 disabled={isPlaying}
//               />
//             </div>

//             <div>
//               <label className="text-sm text-gray-400">Target Multiplier</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 className="w-full bg-slate-900/50 p-3 rounded-lg text-xl font-bold"
//                 value={targetMultiplier}
//                 onChange={(e) => setTargetMultiplier(e.target.value)}
//                 disabled={isPlaying}
//               />
//             </div>

//             <button
//               onClick={placeBet}
//               disabled={hasBet || isPlaying}
//               className={`w-full py-4 rounded-lg font-bold ${
//                 hasBet ? "bg-gray-600" : "bg-green-500 hover:bg-green-600"
//               }`}
//             >
//               {hasBet ? "Bet Placed" : "Bet"}
//             </button>

//             <div className="flex justify-between bg-slate-900/50 p-3 rounded-lg">
//               <div className="flex gap-2 items-center">
//                 <Users size={16} /> 93
//               </div>
//               <div className="font-bold">${balance.toFixed(2)}</div>
//             </div>
//           </div>

//           {/* GAME */}
//           <div className="bg-slate-800/30 rounded-xl p-8 overflow-hidden">
//            <div className="flex gap-2 ">
//           {history.map((m, i) => (
//             <div
//               key={i}
//               className={`px-4 py-2 rounded-lg font-bold text-sm ${historyColor(m)} ${
//                 i === 0 ? "ring-2 ring-blue-400 scale-110" : ""
//               }`}
//             >
//               {m.toFixed(2)}×
//             </div>
//           ))}
//         </div>
//             <div ref={slideRef} className="relative h-96 overflow-hidden">

//               {/* POINTER */}
//               <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
//                 <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
//               </div>

//               {/* SLIDES */}
//               <div
//                 className="absolute top-20 flex gap-4"
//                 style={{ transform: `translateX(${-(ballX)}px)` }}
//               >
//                 {EXTENDED.map((s, i) => (
//                   <div key={i} className="flex flex-col items-center gap-2">
//                     <div
//                       className={`w-24 h-24 flex items-center justify-center font-bold text-lg border ${
//                         showResult && resultIndex === i % slides.length
//                           ? "border-white shadow-[0_0_25px_rgba(255,255,255,0.7)] scale-110"
//                           : "border-slate-600"
//                       } ${s.color}`}
//                       style={{
//                         clipPath:
//                           "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
//                       }}
//                     >
//                       {s.value.toFixed(2)}×
//                     </div>
//                     <div className={`w-24 h-32 ${s.color}`} />
//                   </div>
//                 ))}
//               </div>

//               {/* RESULT */}
//               {showResult && resultIndex !== null && (
//                 <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
//                   <div className="text-6xl font-bold animate-pulse">
//                     {slides[resultIndex].value.toFixed(2)}×
//                   </div>
//                   {gameResult && (
//                     <div
//                       className={`text-4xl font-bold mt-4 ${
//                         gameResult === "win" ? "text-green-400" : "text-red-400"
//                       }`}
//                     >
//                       {gameResult === "win" ? "YOU WIN!" : "YOU LOSE!"}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             <div className="mt-6 flex justify-between text-sm text-gray-400">
//               <span>Next round in: {nextRound}s</span>
//               <span>Bets: 93</span>
//             </div>

//             <div className="mt-2 bg-slate-700 h-1.5 rounded-full overflow-hidden">
//               <div
//                 className="bg-blue-500 h-full transition-all duration-1000"
//                 style={{ width: `${((16 - nextRound) / 16) * 100}%` }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//      {/* Bottom Stats Bar */}
//           <div className="flex items-center ">
//             <RiseTopBar />
//           </div>
//         </motion.main>
//       </div>

//       {/* Mobile Bottom Bar */}
//       {isMobile && (
//         <div className="fixed bottom-0 w-full z-50 h-16">
//           <MobileBottomBar onBrowseClick={() => setSidebarOpen(false)} />
//         </div>
//       )}

//       {/* Mobile Sidebar */}
//       <AnimatePresence>
//         {isMobile && sidebarOpen && (
//           <motion.div
//             initial={{ x: -256 }}
//             animate={{ x: 0 }}
//             exit={{ x: -256 }}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] shadow-lg"
//           >
//             <Sidebar
//               collapsed={false}
//               setCollapsed={() => {}}
//               open={sidebarOpen}
//               setOpen={setSidebarOpen}
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {isMobile && sidebarOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 0.3 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.2 }}
//           className="fixed inset-0 bg-black z-40"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// }
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Users } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import TopNavbar from "@/components/topnavbar";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/sidebar";
import MobileBottomBar from "@/components/mainmobilebuttombar";
import RiseTopBar from "@/components/game/gamebottombar";
import { apiRequest } from "@/utils/ApiHelper";

/* ---------- HISTORY ---------- */
const initialHistory = [
  1.36, 1.42, 4.87, 2.35, 1.38, 1.28, 6.55, 1.04, 1.52, 0.0, 9.77, 2.68,
];

/* ---------- SLIDES ---------- */
const slides = [
  { value: 2.24, color: "bg-slate-700" },
  { value: 1.2, color: "bg-slate-700" },
  { value: 1.75, color: "bg-slate-700" },
  { value: 2.68, color: "bg-slate-600" },
  { value: 3.16, color: "bg-slate-700" },
  { value: 1.35, color: "bg-slate-700" },
  { value: 18.76, color: "bg-yellow-700" },
];

/* duplicate for infinite illusion */
const EXTENDED = [...slides, ...slides, ...slides];

export default function CrashSlideGame() {
  const [betAmount, setBetAmount] = useState("0.00");
  const [targetMultiplier, setTargetMultiplier] = useState("2.00");
  

  const [nextRound, setNextRound] = useState(16);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasBet, setHasBet] = useState(false);

  const [ballX, setBallX] = useState(0);
  const [resultIndex, setResultIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameResult, setGameResult] = useState<"win" | "loss" | null>(null);

  const [history, setHistory] = useState(initialHistory);

  const slideRef = useRef<HTMLDivElement>(null);

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
  /* ---------- TIMER ---------- */
  useEffect(() => {
    if (!isPlaying && nextRound > 0) {
      const t = setTimeout(() => setNextRound((p) => p - 1), 1000);
      return () => clearTimeout(t);
    }
    if (!isPlaying && nextRound === 0) startRound();
  }, [nextRound, isPlaying]);

  /* ---------- WEIGHTED RANDOM ---------- */
  const pickResult = () => {
    const weights = slides.map((s) =>
      s.value >= 10 ? 1 : s.value >= 5 ? 3 : s.value >= 2 ? 6 : 10
    );
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i];
      if (r <= 0) return i;
    }
    return 0;
  };

  /* ---------- ROUND ---------- */
  const startRound = () => {
    setIsPlaying(true);
    setShowResult(false);
    setGameResult(null);
    setResultIndex(null);

    const result = pickResult();
    const slideWidth = slideRef.current?.offsetWidth || 800;

    // Adjust ITEM_WIDTH based on screen size
    const ITEM_WIDTH = isMobile ? 72 : 112; // 64px + gap for mobile, 96px + gap for desktop
    const middleOffset = slideWidth / 2 - ITEM_WIDTH / 2;
    const target =
      slides.length * ITEM_WIDTH + result * ITEM_WIDTH + middleOffset;

    const duration = 3000;
    let start: number | null = null;

    const animate = (time: number) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setBallX(target * ease);

      if (progress < 1) requestAnimationFrame(animate);
      else finishRound(result);
    };

    requestAnimationFrame(animate);
  };

  /* ---------- FINISH ---------- */
  const finishRound = (idx: number) => {
    const mult = slides[idx].value;
    setResultIndex(idx);
    setShowResult(true);

    if (hasBet) {
      const bet = parseFloat(betAmount);
      const target = parseFloat(targetMultiplier);

      if (mult >= target) {
        setGameResult("win");
        setBalance((b) => b + bet * mult);
      } else {
        setGameResult("loss");
      }
    }

    setHistory((h) => [mult, ...h.slice(0, 11)]);

    setTimeout(() => {
      setIsPlaying(false);
      setHasBet(false);
      setBallX(0);
      setNextRound(16);
      setShowResult(false);
      setGameResult(null);
    }, 3000);
  };

  /* ---------- BET ---------- */
  const placeBet = () => {
    const bet = parseFloat(betAmount);
    if (bet <= 0 || bet > balance || hasBet || isPlaying) return;
    setBalance((b) => b - bet);
    setHasBet(true);
  };

  /* ---------- HISTORY COLOR ---------- */
  const historyColor = (m: number) =>
    m < 2 ? "bg-slate-700" : m < 5 ? "bg-blue-500" : m < 10 ? "bg-purple-500" : "bg-yellow-500";

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
    <div className="min-h-screen bg-gradient-to-b from-[#0f212e] to-[#0b1a24] text-white p-2 md:p-4">
      <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-[320px_1fr] grid-cols-1 gap-4 md:gap-6">

          {/* LEFT PANEL - Shows at bottom on mobile */}
          <div className="bg-slate-800/40 rounded-xl p-4 md:p-6 space-y-3 md:space-y-4 lg:order-1 order-2">
            <div className="flex gap-2">
              <button className="flex-1 bg-slate-700 py-2 rounded-lg text-sm md:text-base font-semibold">Manual</button>
              <button className="flex-1 bg-slate-900/50 py-2 rounded-lg text-sm md:text-base font-semibold">Auto</button>
            </div>

            <div>
              <label className="text-xs md:text-sm text-gray-400 block mb-1">Bet Amount</label>
              <input
                type="number"
                className="w-full bg-slate-900/50 p-2 md:p-3 rounded-lg text-lg md:text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                disabled={isPlaying}
              />
            </div>

            <div>
              <label className="text-xs md:text-sm text-gray-400 block mb-1">Target Multiplier</label>
              <input
                type="number"
                step="0.01"
                className="w-full bg-slate-900/50 p-2 md:p-3 rounded-lg text-lg md:text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={targetMultiplier}
                onChange={(e) => setTargetMultiplier(e.target.value)}
                disabled={isPlaying}
              />
            </div>

            <button
              onClick={placeBet}
              disabled={hasBet || isPlaying}
              className={`w-full py-3 md:py-4 rounded-lg font-bold text-sm md:text-base transition-all ${
                hasBet ? "bg-gray-600 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {hasBet ? "Bet Placed" : "Place Bet"}
            </button>

            <div className="flex justify-between bg-slate-900/50 p-2 md:p-3 rounded-lg text-sm md:text-base">
              <div className="flex gap-2 items-center">
                <Users size={isMobile ? 14 : 16} /> 
                <span className="text-xs md:text-sm">93</span>
              </div>
              <div className="font-bold">{formatCurrency(balance)}</div>
            </div>
          </div>

          {/* GAME - Shows at top on mobile */}
          <div className="bg-slate-800/30 rounded-xl p-4 md:p-8 overflow-hidden lg:order-2 order-1">
            {/* History - Scrollable on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {history.map((m, i) => (
                <div
                  key={i}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm whitespace-nowrap flex-shrink-0 ${historyColor(m)} ${
                    i === 0 ? "ring-2 ring-blue-400 scale-105 md:scale-110" : ""
                  }`}
                >
                  {m.toFixed(2)}×
                </div>
              ))}
            </div>

            {/* Game Area - Adjusted height for mobile */}
            <div ref={slideRef} className="relative h-64 md:h-96 overflow-hidden mt-4">

              {/* POINTER */}
              <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-20">
                <div className="w-0 h-0 border-l-[6px] md:border-l-[8px] border-r-[6px] md:border-r-[8px] border-t-[6px] md:border-t-[8px] border-l-transparent border-r-transparent border-t-white" />
              </div>

              {/* SLIDES - Smaller on mobile */}
              <div
                className="absolute top-12 md:top-20 flex gap-2 md:gap-4"
                style={{ transform: `translateX(${-(ballX)}px)` }}
              >
                {EXTENDED.map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 md:gap-2">
                    <div
                      className={`w-16 h-16 md:w-24 md:h-24 flex items-center justify-center font-bold text-sm md:text-lg border ${
                        showResult && resultIndex === i % slides.length
                          ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.5)] md:shadow-[0_0_25px_rgba(255,255,255,0.7)] scale-110"
                          : "border-slate-600"
                      } ${s.color}`}
                      style={{
                        clipPath:
                          "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
                      }}
                    >
                      {s.value.toFixed(2)}×
                    </div>
                    <div className={`w-16 h-20 md:w-24 md:h-32 ${s.color}`} />
                  </div>
                ))}
              </div>

              {/* RESULT - Responsive text size */}
              {showResult && resultIndex !== null && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/50 backdrop-blur-sm">
                  <div className="text-4xl md:text-6xl font-bold animate-pulse text-white">
                    {slides[resultIndex].value.toFixed(2)}×
                  </div>
                  {gameResult && (
                    <div
                      className={`text-2xl md:text-4xl font-bold mt-2 md:mt-4 ${
                        gameResult === "win" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {gameResult === "win" ? "YOU WIN! 🎉" : "YOU LOSE! 😞"}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Timer and Progress - Responsive text */}
            <div className="mt-4 md:mt-6 flex justify-between text-xs md:text-sm text-gray-400">
              <span className="font-semibold">Next round: <span className="text-blue-400">{nextRound}s</span></span>
              <span className="font-semibold">Players: <span className="text-blue-400">93</span></span>
            </div>

            <div className="mt-2 bg-slate-700 h-1.5 md:h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-1000"
                style={{ width: `${((16 - nextRound) / 16) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add scrollbar hide style */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
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