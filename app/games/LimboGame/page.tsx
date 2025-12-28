// 'use client';

// import { useEffect, useRef, useState } from "react";
// import "@/app/css/limbo.css";
// import { Button } from "@/components/ui/button";
// import TopNavbar from "@/components/topnavbar";
// import { apiRequest } from "@/utils/ApiHelper";
// import { useCurrency } from "@/context/CurrencyContext";
// import { motion, AnimatePresence } from "framer-motion";
// import Sidebar from "@/components/sidebar";
// import MobileBottomBar from "@/components/mainmobilebuttombar";
// import RiseTopBar from "@/components/game/gamebottombar";
// import GameDropdown from "@/components/game/gamedropup";


// const LimboGame = () => {
//   const [bet, setBet] = useState(1);
//   const [multiplier, setMultiplier] = useState(1);
//   const [targetMultiplier, setTargetMultiplier] = useState(2);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [result, setResult] = useState<"WIN" | "LOSE" | null>(null);
//   const [isAuto, setIsAuto] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
  
//   // ✅ AUTO STATES
//   const [autoBets, setAutoBets] = useState(10);
//   const [remainingBets, setRemainingBets] = useState(0);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const isAutoPlayingRef = useRef(false);
  
//   const winChance = 99 / targetMultiplier;
//   const profit = bet * targetMultiplier - bet;
//   const [search, setSearch] = useState("");
//   const [dashboardDetails, setDashboardDetails] = useState<any>(null);
//   const sidebarWidth = 64;
//   const collapsedWidth = 20;
//   const { currency, setCurrency } = useCurrency();
//   const [balance, setBalance] = useState<number>(0);
//   const [loading, setLoading] = useState(true);
  
//   // API states
//   const [lastBetId, setLastBetId] = useState<number | null>(null);
//   const [apiError, setApiError] = useState<string | null>(null);
    
//   const parseWalletBalance = (b: any) => {
//     if (b === null || b === undefined) return 0;
//     if (typeof b === "number") return b;
//     const n = parseFloat(String(b));
//     return isNaN(n) ? 0 : n;
//   };
    
//   const conversionRates: Record<string, number> = {
//     INR: 83.0, 
//     USD: 1,
//     USDT: 1,
//     BTC: 1 / 60000, 
//     ETH: 1 / 1800, 
//     LTC: 1 / 90,
//     SOL: 1 / 100,
//     XRP: 1 / 0.5,
//     TRX: 1 / 0.07,
//     BNB: 1 / 300,
//     USDC: 1,
//   };
    
//   // Symbol map & decimals
//   const currencySymbols: Record<string, { sym: string; decimals: number }> = {
//     INR: { sym: "₹", decimals: 2 },
//     USD: { sym: "$", decimals: 2 },
//     USDT: { sym: "$", decimals: 2 },
//     USDC: { sym: "$", decimals: 2 },
//     BTC: { sym: "₿", decimals: 8 },
//     ETH: { sym: "Ξ", decimals: 8 },
//     LTC: { sym: "Ł", decimals: 8 },
//     SOL: { sym: "◎", decimals: 8 },
//     XRP: { sym: "✕", decimals: 6 },
//     TRX: { sym: "T", decimals: 6 },
//     BNB: { sym: "🟡", decimals: 6 },
//   };
    
//   const formatCurrency = (value: number, cur = currency) => {
//     if (cur && currencySymbols[cur]) {
//       const { sym, decimals } = currencySymbols[cur];
//       return `${sym}${Number(value).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
//     }
//     return `${value.toLocaleString()}`;
//   };
  
//   const convertChipToCurrency = (chipBaseAmount: number, cur = currency) => {
//     const rate = conversionRates[cur] ?? 1;
//     return chipBaseAmount * rate;
//   };
    
//   useEffect(() => {
//     const fetchDashboardDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const id = localStorage.getItem("userId");
//         const res = await apiRequest(`/users/${id}/details`, true, {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.success) {
//           setDashboardDetails(res.data);        
//           const wallets = res.data.wallets || [];
//           let initialWallet = null;
//           if (wallets.length > 0) {
//             initialWallet =
//               wallets.find((w: any) => String(w.currency || w.symbol).toUpperCase() === String(currency || "").toUpperCase()) ||
//               wallets[0];
//           }
//           if (initialWallet) {
//             const bal = parseWalletBalance(initialWallet.balance ?? initialWallet.amount ?? 0);
//             setBalance(bal);
//             const curSymbol = (initialWallet.currency || initialWallet.symbol || initialWallet.asset || "").toString().toUpperCase();
//             if (curSymbol) {
//               setCurrency(curSymbol);
//             }
//           } else {
//             setBalance(0);
//           }
//         }
//       } catch (err) {
//         console.error("Dashboard API Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboardDetails();
//   }, []);

//   // ✅ API: Place Bet
//   const placeBet = async () => {
//     try {
//       setApiError(null);
//       const token = localStorage.getItem("token");
      
//       const response = await apiRequest("/game/limbo/bet", true, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           targetMultiplier: targetMultiplier,
//           currency: currency,
//           amount: bet,
//         }),
//       });

//       if (response.success) {
//         setLastBetId(response.data.betId);
//         return true;
//       } else {
//         setApiError(response.message || "Bet failed");
//         return false;
//       }
//     } catch (err: any) {
//       console.error("Bet API Error:", err);
//       setApiError(err.message || "Failed to place bet");
//       return false;
//     }
//   };

//   // ✅ API: Get Result
//   const getResult = async () => {
//     try {
//       const token = localStorage.getItem("token");
      
//       const response = await apiRequest("/game/limbo/result", true, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.success && response.data) {
//         return {
//           result: response.data.result,
//           roll: response.data.roll,
//           payout: response.data.payout,
//           profit: response.data.profit,
//         };
//       }
//       return null;
//     } catch (err) {
//       console.error("Result API Error:", err);
//       return null;
//     }
//   };

//   // ✅ Updated Play Round with API
//   const playRound = async () => {
//     if (isPlaying) return;

//     setIsPlaying(true);
//     setResult(null);
//     setMultiplier(1);
//     setApiError(null);

//     // Place bet first
//     const betSuccess = await placeBet();
//     if (!betSuccess) {
//       setIsPlaying(false);
//       return;
//     }

//     // Animate multiplier going up
//     let current = 1;
//     const animInterval = setInterval(() => {
//       current += 0.15;
//       setMultiplier(Number(current.toFixed(2)));
//     }, 20);

//     // Wait a bit for animation
//     await new Promise(resolve => setTimeout(resolve, 1500));

//     // Get result from API
//     const apiResult = await getResult();
    
//     clearInterval(animInterval);

//     if (apiResult) {
//       const finalMultiplier = apiResult.roll || apiResult.payout / bet || targetMultiplier;
//       setMultiplier(Number(finalMultiplier.toFixed(2)));
//       setResult(apiResult.result as "WIN" | "LOSE");
      
//       // Update balance based on profit/loss
//       setBalance(prev => prev + apiResult.profit);
//     } else {
//       // Fallback if API fails
//       setMultiplier(targetMultiplier);
//       setResult("LOSE");
//     }

//     setIsPlaying(false);

//     // ✅ Decrease auto bets
//     if (isAuto) {
//       setRemainingBets((prev) => (prev > 0 ? prev - 1 : 0));
//     }
//   };

//   // ✅ MANUAL BET
//   const handleManualBet = () => {
//     if (!isPlaying && bet > 0 && bet <= balance) {
//       playRound();
//     } else if (bet > balance) {
//       setApiError("Insufficient balance");
//     }
//   };

//   // Responsive check
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // ✅ AUTO BET START
//   const handleAutoStart = () => {
//     if (autoBets <= 0) return;
//     if (bet <= 0 || bet > balance) {
//       setApiError("Invalid bet amount");
//       return;
//     }
//     setRemainingBets(autoBets);
//     isAutoPlayingRef.current = true;
//   };

//   // ✅ AUTO BET STOP
//   const handleAutoStop = () => {
//     setRemainingBets(0);
//     isAutoPlayingRef.current = false;
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//   };

//   // ✅ AUTO LOOP
//   useEffect(() => {
//     if (!isAuto || remainingBets <= 0) {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//       isAutoPlayingRef.current = false;
//       return;
//     }

//     if (!intervalRef.current) {
//       intervalRef.current = setInterval(() => {
//         if (!isPlaying && remainingBets > 0 && bet <= balance) {
//           playRound();
//         } else if (bet > balance) {
//           handleAutoStop();
//           setApiError("Insufficient balance");
//         }
//       }, 2000);
//     }

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//     };
//   }, [isAuto, remainingBets, isPlaying, bet, balance]);

//   const handleCurrencyChange = (currencyType: string) => {
//     if (!currencyType) return;
//     const symbol = currencyType.toString().toUpperCase();
//     setCurrency(symbol);
//     const wallets = dashboardDetails?.wallets || [];
//     const found = wallets.find(
//       (w: any) => String(w.currency || w.symbol || w.asset).toUpperCase() === symbol
//     );
//     if (found) {
//       const bal = parseWalletBalance(found.balance ?? found.amount ?? 0);
//       setBalance(bal);
//     } else {
//       setBalance((prev) => prev); 
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#1a2c38] text-white overflow-x-hidden relative flex-col">
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
//           {/* MAIN CONTENT */}
//           <div className="flex flex-col lg:flex-row gap-4 p-3 min-h-screen">
//             {/* BET PANEL */}
//             <div className="w-full lg:w-80 bg-[#122733] rounded-xl p-4 space-y-4 order-2 lg:order-1">
//               {/* Error Display */}
//               {apiError && (
//                 <div className="bg-red-500/20 border border-red-500 rounded-md p-2 text-sm text-red-400">
//                   {apiError}
//                 </div>
//               )}

//               {/* Balance Display */}
//               <div className="bg-[#0b1c26] p-3 rounded-md">
//                 <div className="text-xs text-gray-400">Balance</div>
//                 <div className="text-lg font-semibold">
//                   {formatCurrency(balance, currency)}
//                 </div>
//               </div>

//               {/* Toggle */}
//               <div className="flex bg-[#0b1c26] rounded-lg p-1">
//                 <button
//                   onClick={() => {
//                     setIsAuto(false);
//                     handleAutoStop();
//                   }}
//                   className={`flex-1 py-2 rounded-md text-sm ${
//                     !isAuto ? "bg-[#122733]" : "text-gray-400"
//                   }`}
//                 >
//                   Manual
//                 </button>
//                 <button
//                   onClick={() => setIsAuto(true)}
//                   className={`flex-1 py-2 rounded-md text-sm ${
//                     isAuto ? "bg-[#122733]" : "text-gray-400"
//                   }`}
//                 >
//                   Auto
//                 </button>
//               </div>

//               {/* Bet Amount */}
//               <div className="space-y-1">
//                 <div className="flex justify-between text-xs sm:text-sm text-gray-400">
//                   <span>Bet Amount</span>
//                   <span>{formatCurrency(bet, currency)}</span>
//                 </div>

//                 <div className="flex">
//                   <input
//                     type="text"
//                     inputMode="decimal"
//                     value={bet === 0 ? '0' : bet.toString()}
//                     onChange={(e) => {
//                       const value = e.target.value;
                      
//                       if (value === '' || value === '.') {
//                         setBet(0);
//                         return;
//                       }
                      
//                       const cleanValue = value.replace(/^0+(?=\d)/, '');
                      
//                       if (/^\d*\.?\d*$/.test(cleanValue)) {
//                         const num = parseFloat(cleanValue);
//                         if (!isNaN(num)) {
//                           setBet(num);
//                         } else if (cleanValue === '.') {
//                           setBet(0);
//                         }
//                       }
//                     }}
//                     onFocus={(e) => {
//                       if (bet === 0) {
//                         e.target.select();
//                       }
//                     }}
//                     onBlur={() => {
//                       if (bet < 0 || isNaN(bet)) setBet(0);
//                     }}
//                     disabled={isPlaying || (isAuto && remainingBets > 0)}
//                     className="flex-1 bg-[#0b1c26] p-2 rounded-l-md outline-none text-sm disabled:opacity-50"
//                   />
//                   <button
//                     onClick={() => setBet(Math.max(0, bet / 2))}
//                     disabled={isPlaying || (isAuto && remainingBets > 0)}
//                     className="px-3 bg-[#1b3948] text-sm disabled:opacity-50"
//                   >
//                     ½
//                   </button>
//                   <button
//                     onClick={() => setBet(bet * 2)}
//                     disabled={isPlaying || (isAuto && remainingBets > 0)}
//                     className="px-3 bg-[#1b3948] rounded-r-md text-sm disabled:opacity-50"
//                   >
//                     2×
//                   </button>
//                 </div>
//               </div>

//               {/* Target Multiplier */}
//               <div className="space-y-1">
//                 <div className="flex justify-between text-xs sm:text-sm text-gray-400">
//                   <span>Target Multiplier</span>
//                   <span>{targetMultiplier.toFixed(2)}x</span>
//                 </div>

//                 <input
//                   type="text"
//                   inputMode="decimal"
//                   value={targetMultiplier.toString()}
//                   onChange={(e) => {
//                     const value = e.target.value;
                    
//                     if (value === '' || value === '.') {
//                       setTargetMultiplier(0);
//                       return;
//                     }
                    
//                     const cleanValue = value.replace(/^0+(?=\d)/, '');
                    
//                     if (/^\d*\.?\d*$/.test(cleanValue)) {
//                       const num = parseFloat(cleanValue);
//                       if (!isNaN(num)) {
//                         setTargetMultiplier(num);
//                       }
//                     }
//                   }}
//                   onFocus={(e) => {
//                     e.target.select();
//                   }}
//                   onBlur={() => {
//                     if (targetMultiplier < 1.01 || isNaN(targetMultiplier)) {
//                       setTargetMultiplier(1.01);
//                     }
//                   }}
//                   disabled={isPlaying || (isAuto && remainingBets > 0)}
//                   className="w-full bg-[#0b1c26] p-2 rounded-md outline-none text-sm disabled:opacity-50"
//                 />
//               </div>

//               {/* AUTO INPUT */}
//               {isAuto && (
//                 <div className="space-y-1">
//                   <div className="flex justify-between text-xs sm:text-sm text-gray-400">
//                     <span>Number of Bets</span>
//                     <span>{remainingBets || autoBets}</span>
//                   </div>

//                   <input
//                     type="text"
//                     inputMode="numeric"
//                     value={autoBets === 0 ? '0' : autoBets.toString()}
//                     onChange={(e) => {
//                       const value = e.target.value;
                      
//                       if (value === '') {
//                         setAutoBets(0);
//                         return;
//                       }
                      
//                       const cleanValue = value.replace(/^0+(?=\d)/, '');
                      
//                       if (/^\d+$/.test(cleanValue)) {
//                         const num = parseInt(cleanValue, 10);
//                         if (!isNaN(num) && num >= 0) {
//                           setAutoBets(num);
//                         }
//                       }
//                     }}
//                     onFocus={(e) => {
//                       if (autoBets === 0) {
//                         e.target.select();
//                       }
//                     }}
//                     onBlur={() => {
//                       if (autoBets < 1 || isNaN(autoBets)) {
//                         setAutoBets(1);
//                       }
//                     }}
//                     disabled={remainingBets > 0}
//                     className="w-full bg-[#0b1c26] p-2 rounded-md outline-none text-sm disabled:opacity-50"
//                   />
//                 </div>
//               )}

//               {/* ACTION BUTTON */}
//               <Button
//                 className={`w-full font-semibold py-3 ${
//                   isAuto && remainingBets > 0
//                     ? "bg-red-500 hover:bg-red-600"
//                     : "bg-green-500 hover:bg-green-600"
//                 } text-black`}
//                 onClick={
//                   isAuto
//                     ? remainingBets > 0
//                       ? handleAutoStop
//                       : handleAutoStart
//                     : handleManualBet
//                 }
//                 disabled={isPlaying && !isAuto}
//               >
//                 {isAuto
//                   ? remainingBets > 0
//                     ? `Stop Auto (${remainingBets} left)`
//                     : "Start Auto"
//                   : isPlaying
//                   ? "Playing..."
//                   : "Bet"}
//               </Button>

//               {/* Profit Box */}
//               <div className="bg-[#0b1c26] p-3 rounded-md text-sm">
//                 <div className="flex justify-between text-gray-400 gap-2">
//                   <span className="truncate">Total Profit ({targetMultiplier.toFixed(2)}x)</span>
//                   <span className="truncate text-right">{formatCurrency(profit, currency)}</span>
//                 </div>
//                 <div className="flex justify-between mt-1 items-center gap-2">
//                   <span className="text-base sm:text-lg truncate">{profit.toFixed(2)}</span>
//                   <span className="bg-green-500 text-black px-2 rounded flex-shrink-0">
//                     {currencySymbols[currency]?.sym || "$"}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* MULTIPLIER DISPLAY */}
//             <div className="flex-1 flex items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-[#0f2a38] to-[#09161f] py-10 lg:py-0 order-1 lg:order-2">
//               <div
//                 className={`
//                   relative w-full max-w-md sm:max-w-lg lg:max-w-xl
//                   h-48 sm:h-56 lg:h-64 rounded-2xl
//                   border border-white/10
//                   bg-gradient-to-b from-[#0f2a38] to-[#09161f]
//                   shadow-[0_0_30px_rgba(0,0,0,0.8)]
//                   flex items-center justify-center
//                   transition-all duration-300
//                   ${
//                     result === "WIN"
//                       ? "border-green-400 shadow-[0_0_40px_rgba(34,197,94,0.6)]"
//                       : result === "LOSE"
//                       ? "border-red-400 shadow-[0_0_40px_rgba(239,68,68,0.6)]"
//                       : ""
//                   }
//                 `}
//               >
//                 <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)]" />

//                 <div
//                   className={`multiplier text-[10px] ${
//                     result === "WIN" ? "win" : result === "LOSE" ? "lose" : ""
//                   }`}
//                 >
//                   {multiplier.toFixed(2)}x
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center pl-3 pr-3">
//             <RiseTopBar />
//           </div>
//         </motion.main>
//       </div>

//       {/* Mobile Bottom Bar */}
//       {isMobile && (
//         <div className="fixed bottom-0 w-full z-50 h-16">
//           <MobileBottomBar onBrowseClick={() => setSidebarOpen(true)} />
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
// };

// export default LimboGame;

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
  const isAutoPlayingRef = useRef(false);
  
  const winChance = 99 / targetMultiplier;
  const profit = bet * targetMultiplier - bet;
  const [search, setSearch] = useState("");
  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  const sidebarWidth = 64;
  const collapsedWidth = 20;
  const { currency, setCurrency } = useCurrency();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
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
    console.log("🚀 Component mounted, fetching initial dashboard details");
    fetchDashboardDetails();
  }, []);

  // ✅ Watch currency changes to update balance
  useEffect(() => {
    console.log("💱 Currency changed to:", currency);
    if (dashboardDetails?.wallets) {
      const wallets = dashboardDetails.wallets;
      const found = wallets.find(
        (w: any) => String(w.currency || w.symbol || w.asset).toUpperCase() === currency
      );
      if (found) {
        const bal = parseWalletBalance(found.balance ?? found.amount ?? 0);
        setBalance(bal);
        console.log("💰 Balance updated for currency", currency, ":", bal);
      }
    }
  }, [currency, dashboardDetails]);

  // ✅ API: Place Bet
  const placeBet = async () => {
    console.log("🎲 Starting bet placement...");
    console.log("📋 Bet details:", {
      targetMultiplier,
      currency,
      amount: bet
    });
    
    try {
      setApiError(null);
      const token = localStorage.getItem("token");
      console.log("🔑 Auth token:", token ? "exists" : "missing");
      
      const payload = {
        targetMultiplier: targetMultiplier,
        currency: currency,
        amount: bet,
      };
      console.log("📤 Sending bet payload:", payload);
      
      const response = await apiRequest("/game/limbo/bet", true, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("📥 Bet API Response:", response);

      if (response.success) {
        setLastBetId(response.data.betId);
        console.log("✅ Bet placed successfully! Bet ID:", response.data.betId);
        return true;
      } else {
        console.error("❌ Bet failed:", response.message);
        setApiError(response.message || "Bet failed");
        return false;
      }
    } catch (err: any) {
      console.error("💥 Bet API Error:", err);
      setApiError(err.message || "Failed to place bet");
      return false;
    }
  };

  // ✅ API: Get Result
  const getResult = async () => {
    console.log("🎯 Fetching game result...");
    try {
      const token = localStorage.getItem("token");
      
      const response = await apiRequest("/game/limbo/result", true, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📥 Result API Response:", response);

      if (response.success && response.data) {
        console.log("✅ Game result received:", {
          result: response.data.result,
          roll: response.data.roll,
          payout: response.data.payout,
          profit: response.data.profit,
        });
        return {
          result: response.data.result,
          roll: response.data.roll,
          payout: response.data.payout,
          profit: response.data.profit,
        };
      }
      console.log("⚠️ No result data in response");
      return null;
    } catch (err) {
      console.error("💥 Result API Error:", err);
      return null;
    }
  };

  // ✅ Updated Play Round with API
  const playRound = async () => {
    if (isPlaying) {
      console.log("⏸️ Already playing, skipping...");
      return;
    }

    console.log("🎮 Starting new round...");
    console.log("💰 Current balance:", balance);
    console.log("💵 Bet amount:", bet);
    console.log("🎯 Target multiplier:", targetMultiplier);

    setIsPlaying(true);
    setResult(null);
    setMultiplier(1);
    setApiError(null);

    // Place bet first
    console.log("📤 Placing bet...");
    const betSuccess = await placeBet();
    if (!betSuccess) {
      console.log("❌ Bet placement failed, stopping round");
      setIsPlaying(false);
      return;
    }

    // Animate multiplier going up
    console.log("🎬 Starting multiplier animation...");
    let current = 1;
    const animInterval = setInterval(() => {
      current += 0.15;
      setMultiplier(Number(current.toFixed(2)));
    }, 20);

    // Wait a bit for animation
    console.log("⏱️ Waiting for animation (1500ms)...");
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Get result from API
    console.log("📊 Fetching result from API...");
    const apiResult = await getResult();
    
    clearInterval(animInterval);
    console.log("⏹️ Animation stopped");

    if (apiResult) {
      const finalMultiplier = apiResult.roll || apiResult.payout / bet || targetMultiplier;
      console.log("🎲 Final multiplier:", finalMultiplier);
      setMultiplier(Number(finalMultiplier.toFixed(2)));
      setResult(apiResult.result as "WIN" | "LOSE");
      console.log("🏆 Game result:", apiResult.result);
      console.log("💸 Profit/Loss:", apiResult.profit);
      
      // ✅ Refresh dashboard to get updated balance
      console.log("🔄 Refreshing dashboard for updated balance...");
      await fetchDashboardDetails();
    } else {
      console.log("⚠️ No API result, using fallback");
      setMultiplier(targetMultiplier);
      setResult("LOSE");
    }

    setIsPlaying(false);
    console.log("✅ Round complete!");

    // ✅ Decrease auto bets
    if (isAuto) {
      setRemainingBets((prev) => {
        const newValue = prev > 0 ? prev - 1 : 0;
        console.log("🔢 Remaining auto bets:", newValue);
        return newValue;
      });
    }
  };

  // ✅ MANUAL BET
  const handleManualBet = () => {
    console.log("🎮 Manual bet clicked");
    console.log("⚖️ Checking conditions - isPlaying:", isPlaying, "bet:", bet, "balance:", balance);
    
    if (!isPlaying && bet > 0 && bet <= balance) {
      console.log("✅ Conditions met, starting round");
      playRound();
    } else if (bet > balance) {
      console.log("❌ Insufficient balance");
      setApiError("Insufficient balance");
    } else if (bet <= 0) {
      console.log("❌ Invalid bet amount");
      setApiError("Invalid bet amount");
    }
  };

  // Responsive check
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

  // ✅ AUTO BET START
  const handleAutoStart = () => {
    console.log("🤖 Auto bet start clicked");
    console.log("📊 Auto bet settings - count:", autoBets, "bet:", bet, "balance:", balance);
    
    if (autoBets <= 0) {
      console.log("❌ Invalid auto bet count");
      return;
    }
    if (bet <= 0 || bet > balance) {
      console.log("❌ Invalid bet amount or insufficient balance");
      setApiError("Invalid bet amount");
      return;
    }
    console.log("✅ Starting auto play with", autoBets, "bets");
    setRemainingBets(autoBets);
    isAutoPlayingRef.current = true;
  };

  // ✅ AUTO BET STOP
  const handleAutoStop = () => {
    console.log("⏹️ Auto bet stop clicked");
    setRemainingBets(0);
    isAutoPlayingRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("✅ Auto play interval cleared");
    }
  };

  // ✅ AUTO LOOP
  useEffect(() => {
    console.log("🔄 Auto loop effect triggered - isAuto:", isAuto, "remainingBets:", remainingBets);
    
    if (!isAuto || remainingBets <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log("🛑 Auto play stopped");
      }
      isAutoPlayingRef.current = false;
      return;
    }

    if (!intervalRef.current) {
      console.log("▶️ Starting auto play interval");
      intervalRef.current = setInterval(() => {
        console.log("⏰ Auto play tick - isPlaying:", isPlaying, "remainingBets:", remainingBets, "bet:", bet, "balance:", balance);
        
        if (!isPlaying && remainingBets > 0 && bet <= balance) {
          console.log("🎲 Auto playing round...");
          playRound();
        } else if (bet > balance) {
          console.log("❌ Insufficient balance, stopping auto play");
          handleAutoStop();
          setApiError("Insufficient balance");
        }
      }, 2000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log("🧹 Cleanup: Auto play interval cleared");
      }
    };
  }, [isAuto, remainingBets, isPlaying, bet, balance]);

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
    <div className="flex min-h-screen bg-[#1a2c38] text-white overflow-x-hidden relative flex-col">
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
          {/* MAIN CONTENT */}
          <div className="flex flex-col lg:flex-row gap-4 p-3 min-h-screen">
            {/* BET PANEL */}
            <div className="w-full lg:w-80 bg-[#122733] rounded-xl p-4 space-y-4 order-2 lg:order-1">
              {/* Error Display */}
              {apiError && (
                <div className="bg-red-500/20 border border-red-500 rounded-md p-2 text-sm text-red-400">
                  {apiError}
                </div>
              )}

              {/* Balance Display */}
              <div className="bg-[#0b1c26] p-3 rounded-md">
                <div className="text-xs text-gray-400">Balance ({currency})</div>
                <div className="text-lg font-semibold">
                  {formatCurrency(balance, currency)}
                </div>
              </div>

              {/* Toggle */}
              <div className="flex bg-[#0b1c26] rounded-lg p-1">
                <button
                  onClick={() => {
                    console.log("🔄 Switching to Manual mode");
                    setIsAuto(false);
                    handleAutoStop();
                  }}
                  className={`flex-1 py-2 rounded-md text-sm ${
                    !isAuto ? "bg-[#122733]" : "text-gray-400"
                  }`}
                >
                  Manual
                </button>
                <button
                  onClick={() => {
                    console.log("🔄 Switching to Auto mode");
                    setIsAuto(true);
                  }}
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
                  <span>{formatCurrency(bet, currency)}</span>
                </div>

                <div className="flex">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={bet === 0 ? '0' : bet.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log("💵 Bet input changed:", value);
                      
                      if (value === '' || value === '.') {
                        setBet(0);
                        return;
                      }
                      
                      const cleanValue = value.replace(/^0+(?=\d)/, '');
                      
                      if (/^\d*\.?\d*$/.test(cleanValue)) {
                        const num = parseFloat(cleanValue);
                        if (!isNaN(num)) {
                          setBet(num);
                          console.log("✅ Bet set to:", num);
                        } else if (cleanValue === '.') {
                          setBet(0);
                        }
                      }
                    }}
                    onFocus={(e) => {
                      if (bet === 0) {
                        e.target.select();
                      }
                    }}
                    onBlur={() => {
                      if (bet < 0 || isNaN(bet)) {
                        console.log("⚠️ Invalid bet, resetting to 0");
                        setBet(0);
                      }
                    }}
                    disabled={isPlaying || (isAuto && remainingBets > 0)}
                    className="flex-1 bg-[#0b1c26] p-2 rounded-l-md outline-none text-sm disabled:opacity-50"
                  />
                  <button
                    onClick={() => {
                      const newBet = Math.max(0, bet / 2);
                      console.log("➗ Halving bet to:", newBet);
                      setBet(newBet);
                    }}
                    disabled={isPlaying || (isAuto && remainingBets > 0)}
                    className="px-3 bg-[#1b3948] text-sm disabled:opacity-50"
                  >
                    ½
                  </button>
                  <button
                    onClick={() => {
                      const newBet = bet * 2;
                      console.log("✖️ Doubling bet to:", newBet);
                      setBet(newBet);
                    }}
                    disabled={isPlaying || (isAuto && remainingBets > 0)}
                    className="px-3 bg-[#1b3948] rounded-r-md text-sm disabled:opacity-50"
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
                  type="text"
                  inputMode="decimal"
                  value={targetMultiplier.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log("🎯 Target multiplier input changed:", value);
                    
                    if (value === '' || value === '.') {
                      setTargetMultiplier(0);
                      return;
                    }
                    
                    const cleanValue = value.replace(/^0+(?=\d)/, '');
                    
                    if (/^\d*\.?\d*$/.test(cleanValue)) {
                      const num = parseFloat(cleanValue);
                      if (!isNaN(num)) {
                        setTargetMultiplier(num);
                        console.log("✅ Target multiplier set to:", num);
                      }
                    }
                  }}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                  onBlur={() => {
                    if (targetMultiplier < 1.01 || isNaN(targetMultiplier)) {
                      console.log("⚠️ Invalid multiplier, resetting to 1.01");
                      setTargetMultiplier(1.01);
                    }
                  }}
                  disabled={isPlaying || (isAuto && remainingBets > 0)}
                  className="w-full bg-[#0b1c26] p-2 rounded-md outline-none text-sm disabled:opacity-50"
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
                    type="text"
                    inputMode="numeric"
                    value={autoBets === 0 ? '0' : autoBets.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log("🔢 Auto bets input changed:", value);
                      
                      if (value === '') {
                        setAutoBets(0);
                        return;
                      }
                      
                      const cleanValue = value.replace(/^0+(?=\d)/, '');
                      
                      if (/^\d+$/.test(cleanValue)) {
                        const num = parseInt(cleanValue, 10);
                        if (!isNaN(num) && num >= 0) {
                          setAutoBets(num);
                          console.log("✅ Auto bets set to:", num);
                        }
                      }
                    }}
                    onFocus={(e) => {
                      if (autoBets === 0) {
                        e.target.select();
                      }
                    }}
                    onBlur={() => {
                      if (autoBets < 1 || isNaN(autoBets)) {
                        console.log("⚠️ Invalid auto bets, resetting to 1");
                        setAutoBets(1);
                      }
                    }}
                    disabled={remainingBets > 0}
                    className="w-full bg-[#0b1c26] p-2 rounded-md outline-none text-sm disabled:opacity-50"
                  />
                </div>
              )}

              {/* ACTION BUTTON */}
              <Button
                className={`w-full font-semibold py-3 ${
                  isAuto && remainingBets > 0
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-black`}
                onClick={
                  isAuto
                    ? remainingBets > 0
                      ? handleAutoStop
                      : handleAutoStart
                    : handleManualBet
                }
                disabled={isPlaying && !isAuto}
              >
                {isAuto
                  ? remainingBets > 0
                    ? `Stop Auto (${remainingBets} left)`
                    : "Start Auto"
                  : isPlaying
                  ? "Playing..."
                  : "Bet"}
              </Button>

              {/* Profit Box */}
              <div className="bg-[#0b1c26] p-3 rounded-md text-sm">
                <div className="flex justify-between text-gray-400 gap-2">
                  <span className="truncate">Total Profit ({targetMultiplier.toFixed(2)}x)</span>
                  <span className="truncate text-right">{formatCurrency(profit, currency)}</span>
                </div>
                <div className="flex justify-between mt-1 items-center gap-2">
                  <span className="text-base sm:text-lg truncate">{profit.toFixed(2)}</span>
                  <span className="bg-green-500 text-black px-2 rounded flex-shrink-0">
                    {currencySymbols[currency]?.sym || "$"}
                  </span>
                </div>
              </div>
            </div>

            {/* MULTIPLIER DISPLAY */}
            <div className="flex-1 flex items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-[#0f2a38] to-[#09161f] py-10 lg:py-0 order-1 lg:order-2">
              <div
                className={`
                  relative w-full max-w-md sm:max-w-lg lg:max-w-xl
                  h-48 sm:h-56 lg:h-64 rounded-2xl
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
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)]" />

                <div
                  className={`multiplier text-[10px] ${
                    result === "WIN" ? "win" : result === "LOSE" ? "lose" : ""
                  }`}
                >
                  {multiplier.toFixed(2)}x
                </div>
              </div>
            </div>
          </div>

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
    </div>
  );
};

export default LimboGame;
