
// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";

// const CHOICES = [
//   { id: "rock", icon: "✊" },
//   { id: "paper", icon: "✋" },
//   { id: "scissors", icon: "✌️" },
// ];

// const MULTIPLIERS = [1.0, 1.96, 3.92, 7.84];

// function getResult(player: string, house: string) {
//   if (player === house) return "draw";
//   if (
//     (player === "rock" && house === "scissors") ||
//     (player === "paper" && house === "rock") ||
//     (player === "scissors" && house === "paper")
//   )
//     return "win";
//   return "lose";
// }

// export default function RockPaperScissorsStake() {
//   const [bet, setBet] = useState(0);
//   const [started, setStarted] = useState(false);
//   const [playerPick, setPlayerPick] = useState<string | null>(null);
//   const [housePick, setHousePick] = useState<string | null>(null);
//   const [roundIndex, setRoundIndex] = useState(0);
//   const [flipped, setFlipped] = useState<boolean[]>([]);
//   const [stage, setStage] =
//     useState<"choose" | "flipping" | "ended">("choose");
//   const [result, setResult] =
//     useState<"win" | "lose" | null>(null);

//   const currentMultiplier =
//     MULTIPLIERS[roundIndex] ??
//     MULTIPLIERS[MULTIPLIERS.length - 1];

//   const playRound = async (pick: string) => {
//     if (!started || stage !== "choose") return;

//     setStage("flipping");
//     setPlayerPick(pick);

//     const house =
//       CHOICES[Math.floor(Math.random() * CHOICES.length)].id;

//     await new Promise((r) => setTimeout(r, 500));

//     setHousePick(house);
//     setFlipped((f) => {
//       const nf = [...f];
//       nf[roundIndex] = true;
//       return nf;
//     });

//     const res = getResult(pick, house);

// if (res === "draw") {
//   setStage("choose");
//   return; // replay same round
// }

// setResult(res);


//     await new Promise((r) => setTimeout(r, 600));

//     if (res === "win") {
//       setRoundIndex((i) => i + 1);
//       setPlayerPick(null);
//       setHousePick(null);
//       setStage("choose"); // auto next round
//     } else {
//       setStage("ended");
//     }
//   };

//   const cashOut = () => {
//     setResult("win");
//     setStage("ended");
//   };

//   const resetGame = () => {
//     setBet(0);
//     setStarted(false);
//     setPlayerPick(null);
//     setHousePick(null);
//     setRoundIndex(0);
//     setFlipped([]);
//     setResult(null);
//     setStage("choose");
//   };

//   return (
//     <div className="min-h-screen bg-[#0b1e2d] text-white grid grid-cols-[320px_1fr]">

//       {/* LEFT PANEL */}
//       <div className="p-4 bg-[#10293d] border-r border-white/10">
//         <label className="text-sm opacity-70">Bet Amount</label>
//         <input
//           type="number"
//           value={bet}
//           disabled={started}
//           onChange={(e) => setBet(+e.target.value)}
//           className="w-full bg-[#0b1e2d] rounded-lg p-2 mt-2"
//         />

//         <Button
//           onClick={() => setStarted(true)}
//           disabled={started || bet <= 0}
//           className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600"
//         >
//           Bet
//         </Button>

//         {started && stage === "choose" && roundIndex > 0 && (
//           <Button
//             onClick={cashOut}
//             className="w-full mt-3 bg-green-500 hover:bg-green-600"
//           >
//             Cash Out {(bet * currentMultiplier).toFixed(2)}
//           </Button>
//         )}
//       </div>

//       {/* GAME AREA */}
//       <div className="flex flex-col items-center justify-center gap-10 relative">

//         {/* MULTIPLIER LADDER */}
//         <div className="flex gap-4">
//           {MULTIPLIERS.map((m, i) => (
//             <div key={i} className="flex flex-col items-center gap-2">
//               <motion.div
//                 animate={{ rotateY: flipped[i] ? 180 : 0 }}
//                 transition={{ duration: 0.6 }}
//                 className={`w-40 h-48 rounded-xl border relative preserve-3d
//                 ${
//                   i === roundIndex
//                     ? "border-yellow-400 bg-yellow-500/20"
//                     : "border-white/10 bg-[#10293d]"
//                 }`}
//               >
//                 <div className="absolute inset-0 backface-hidden flex items-center justify-center">
//                   <Image
//                     src="/games/rockpaper/card.svg"
//                     alt="card"
//                     width={56}
//                     height={72}
//                   />
//                 </div>

//                 <div className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center text-3xl">
//                   {i === roundIndex &&
//                     housePick &&
//                     (housePick === "rock"
//                       ? "✊"
//                       : housePick === "paper"
//                       ? "✋"
//                       : "✌️")}
//                 </div>
//               </motion.div>

//               <div className="text-sm text-white/70">
//                 {m.toFixed(2)}x
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* PLAYER CARD */}
//         <div className="w-28 h-40 relative rounded-xl border border-white/10 bg-[#0b1e2d] flex items-center justify-center">
//           <Image
//             src="/games/rockpaper/playercard.svg"
//             alt="player"
//             fill
//             className="object-contain"
//           />
//           {playerPick && (
//             <div className="absolute text-4xl">
//               {playerPick === "rock"
//                 ? "✊"
//                 : playerPick === "paper"
//                 ? "✋"
//                 : "✌️"}
//             </div>
//           )}
//         </div>

//         {/* CONTROLS */}
//         <div className="flex gap-10">
//           {CHOICES.map((c) => (
//             <button
//               key={c.id}
//               disabled={!started || stage !== "choose"}
//               onClick={() => playRound(c.id)}
//               className={`w-20 h-20 rounded-xl text-3xl border-4
//               ${
//                 playerPick === c.id
//                   ? "bg-yellow-500 border-yellow-400"
//                   : "bg-[#10293d] border-white/20"
//               }`}
//             >
//               {c.icon}
//             </button>
//           ))}
//         </div>

//         {/* RESULT OVERLAY */}
//         <AnimatePresence>
//           {stage === "ended" && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="absolute inset-0 bg-black/70 flex items-center justify-center"
//               onClick={resetGame}
//             >
//               <div className="bg-[#10293d] p-8 rounded-xl text-center border border-white/10">
//                 <div className="text-3xl font-bold mb-2">
//                   {result === "win" ? "You Won" : "You Lost"}
//                 </div>

//                 {result === "win" && (
//                   <>
//                     <div className="text-yellow-400 text-xl">
//                       {currentMultiplier.toFixed(2)}x
//                     </div>
//                     <div className="text-green-400 text-2xl font-semibold mt-2">
//                       {(bet * currentMultiplier).toFixed(2)}
//                     </div>
//                   </>
//                 )}

//                 <div className="text-sm opacity-50 mt-4">
//                   Click anywhere to play again
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import TopNavbar from "@/components/topnavbar";
import { apiRequest } from "@/utils/ApiHelper";
import { useCurrency } from "@/context/CurrencyContext";

const CHOICES = [
  { id: "rock", icon: "✊" },
  { id: "paper", icon: "✋" },
  { id: "scissors", icon: "✌️" },
];

const MULTIPLIERS = [1.0, 1.96, 3.92, 7.84];

type Result = "win" | "lose";

function getResult(player: string, house: string) {
  if (player === house) return "draw";
  if (
    (player === "rock" && house === "scissors") ||
    (player === "paper" && house === "rock") ||
    (player === "scissors" && house === "paper")
  )
    return "win";
  return "lose";
}

export default function RockPaperScissorsStake() {
  const [bet, setBet] = useState(0);
  const [started, setStarted] = useState(false);

  const [playerPick, setPlayerPick] = useState<string | null>(null);
  const [housePick, setHousePick] = useState<string | null>(null);

  const [roundIndex, setRoundIndex] = useState(0);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [lastFlippedIndex, setLastFlippedIndex] = useState<number | null>(null);

  const [stage, setStage] =
    useState<"choose" | "flipping" | "ended">("choose");

  const [result, setResult] = useState<Result | null>(null);
  const [showSlideCards, setShowSlideCards] = useState(false);
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
  const currentMultiplier =
    MULTIPLIERS[roundIndex] ??
    MULTIPLIERS[MULTIPLIERS.length - 1];

  const playRound = async (pick: string) => {
    if (!started || stage !== "choose") return;

    setStage("flipping");
    setPlayerPick(pick);

    const house =
      CHOICES[Math.floor(Math.random() * CHOICES.length)].id;

    setHousePick(house);

    await new Promise((r) => setTimeout(r, 300));

    const res = getResult(pick, house);

    if (res === "draw") {
      setStage("choose");
      return;
    }

    setResult(res);
    setLastFlippedIndex(roundIndex);
    setShowSlideCards(true);

    await new Promise((r) => setTimeout(r, 600));

    setFlipped((f) => {
      const nf = [...f];
      nf[roundIndex] = true;
      return nf;
    });

    await new Promise((r) => setTimeout(r, 400));

    setShowSlideCards(false);

    if (res === "win") {
      setRoundIndex((i) => i + 1);
      setPlayerPick(null);
      setHousePick(null);
      setStage("choose");
    } else {
      setStage("ended");
    }
  };

  const cashOut = () => {
    setResult("win");
    setStage("ended");
  };

  const resetGame = () => {
    setBet(0);
    setStarted(false);
    setPlayerPick(null);
    setHousePick(null);
    setRoundIndex(0);
    setFlipped([]);
    setLastFlippedIndex(null);
    setResult(null);
    setStage("choose");
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
     <div className="flex min-h-screen  text-white overflow-x-hidden relative flex-col">
        
      <TopNavbar
        searchValue={search}
        onSearchChange={setSearch}
        wallets={dashboardDetails?.wallets || []}
        onCurrencyChange={(currencyType) => {
          handleCurrencyChange(currencyType);
          console.log("Selected Currency:", currencyType);
        }}
      />
    <div className="min-h-screen bg-[#0b1e2d] text-white grid grid-cols-[320px_1fr]">

      {/* LEFT PANEL */}
      <div className="p-4 bg-[#10293d] border-r border-white/10">
        <label className="text-sm opacity-70">Bet Amount</label>
        <input
          type="number"
          value={bet}
          disabled={started}
          onChange={(e) => setBet(+e.target.value)}
          className="w-full bg-[#0b1e2d] rounded-lg p-2 mt-2"
        />

        <Button
          onClick={() => setStarted(true)}
          disabled={started || bet <= 0}
          className="w-full mt-4 bg-green-500 hover:bg-yellow-600"
        >
          Bet
        </Button>

        {started && stage === "choose" && roundIndex > 0 && (
          <Button
            onClick={cashOut}
            className="w-full mt-3 bg-green-500 hover:bg-green-600"
          >
            Cash Out {(bet * currentMultiplier).toFixed(2)}
          </Button>
        )}
      </div>

      {/* GAME AREA */}
      <div className="flex flex-col roulette-recent-header-bg items-center justify-center gap-10 relative overflow-hidden">

        {/* SLIDING HOUSE CARD */}
        <AnimatePresence>
          {showSlideCards && housePick && (
            <motion.div
              initial={{ y: -120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-16 z-20 w-24 h-32 rounded-xl bg-white text-black flex items-center justify-center text-4xl shadow-xl"
            >
              {housePick === "rock" ? "✊" : housePick === "paper" ? "✋" : "✌️"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SLIDING PLAYER CARD */}
        <AnimatePresence>
          {showSlideCards && playerPick && (
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -120, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-40 z-20 w-24 h-32 rounded-xl  bg-yellow-500 text-black flex items-center justify-center text-4xl shadow-xl"
            >
              {playerPick === "rock" ? "✊" : playerPick === "paper" ? "✋" : "✌️"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* MULTIPLIER LADDER */}
        <div className="flex gap-4">
          {MULTIPLIERS.map((m, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <motion.div
  animate={{ rotateY: flipped[i] ? 180 : 0 }}
  transition={{ duration: 0.6 }}
  className={`w-40 h-48 rounded-xl border-4 relative preserve-3d
  ${
    i === roundIndex
      ? "border-yellow-400 bg-yellow-500/20"
      : "border-white/10 bg-[#10293d]"
  }`}
>
  {/* FRONT — DEFAULT */}
  <div className="absolute inset-0 backface-hidden flex items-center justify-center">
    <Image
      src="/games/rockpaper/card.svg"
      alt="card-front"
      fill
      className="object-contain"
    />
  </div>

  {/* BACK — AFTER FLIP */}
  <div className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center">
    <Image
      src="/games/rockpaper/playercard.svg"
      alt="card-back"
      fill
      className="object-contain"
    />

    {i === lastFlippedIndex && housePick && (
      <div className="absolute text-4xl">
        {housePick === "rock"
          ? "✊"
          : housePick === "paper"
          ? "✋"
          : "✌️"}
      </div>
    )}
  </div>
</motion.div>


              <div className="text-sm text-white/70">{m.toFixed(2)}x</div>
            </div>
          ))}
        </div>

        {/* PLAYER CONTROLS */}
        <div className="flex gap-10">
          {CHOICES.map((c) => (
            <button
              key={c.id}
              disabled={!started || stage !== "choose"}
              onClick={() => playRound(c.id)}
              className={`w-20 h-20 rounded-xl text-3xl border-4
              ${
                playerPick === c.id
                  ? "bg-yellow-500 border-yellow-400"
                  : "bg-[#10293d] border-white/20"
              }`}
            >
              {c.icon}
            </button>
          ))}
        </div>

        {/* RESULT OVERLAY */}
        <AnimatePresence>
          {stage === "ended" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/70 flex items-center justify-center"
              onClick={resetGame}
            >
              <div className="bg-[#10293d] p-8 rounded-xl text-center border border-white/10">
                <div className="text-3xl font-bold mb-2">
                  {result === "win" ? "You Won" : "You Lost"}
                </div>

                {result === "win" && (
                  <>
                    <div className="text-yellow-400 text-xl">
                      {currentMultiplier.toFixed(2)}x
                    </div>
                    <div className="text-green-400 text-2xl font-semibold mt-2">
                      {(bet * currentMultiplier).toFixed(2)}
                    </div>
                  </>
                )}

                <div className="text-sm opacity-50 mt-4">
                  Click anywhere to play again
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  </div>
  );
}
