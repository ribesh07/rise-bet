
"use client";

import React, { useEffect, useRef, useState } from "react";
import { getSocket, disconnectSocket } from "@/utils/socket"; // Adjust path
import { apiRequest } from "@/utils/ApiHelper";
import { v4 as uuidv4 } from "uuid";
import TopNavbar from "@/components/topnavbar";
import { useCurrency } from "@/context/CurrencyContext";
import toast from "react-hot-toast";

type BetsMap = { [key: string]: number };
function generateTableId(): string {
  return uuidv4();
}

type betupdateid = {
  id: number;}

const ModernRoulette: React.FC<{ tableId?: string }> = ({ tableId: tableIdProp }) => {
  const [balance, setBalance] = useState<number>(0);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [resolutionbetupdate, setresolutionbetupdate] = useState<betupdateid[]>([]);
  const [showResultStatus, setShowResultStatus] = useState(false);
 const [resolutionbet, setresolutionbet] = useState<Resolution[]>([]);
  const [status, setstatus] = useState<string>("");
  const [totalBet, setTotalBet] = useState<number>(0);
  const [winningAmount, setWinningAmount] = useState<number>(0);
  const [bets, setBets] = useState<BetsMap>({});
  const [betAmount, setBetAmount] = useState<number>(10);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [ballRotation, setBallRotation] = useState<number>(0);
  const [result, setResult] = useState<number | null>(null);
  const [showWinningAlert, setShowWinningAlert] = useState<boolean>(false);
  const [ballVisible, setBallVisible] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(15);
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableId, setTableId] = useState<string>(tableIdProp || generateTableId());
  const socketRef = useRef<any>(null);
  const [search, setSearch] = useState("");
  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  const { currency, setCurrency } = useCurrency();
  type GamePhase = "COUNTDOWN" | "SPINNING" | "RESULT";
  const [phase, setPhase] = useState<GamePhase>("COUNTDOWN");
  const showCountdown = phase === "COUNTDOWN";
  const [resultshow, setResultshow] = useState(false);
  const lastShownBetIdRef = useRef<string | null>(null);

  

  const wheelNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
    5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
  ];
  const redNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];

  const getColor = (num: number | string) => {
    if (num === "0" || num === 0) return "green";
    if (num === "red" || redNumbers.includes(Number(num))) return "red";
    if (num === "black" || (!redNumbers.includes(Number(num)) && num !== 0)) return "black";
    return "unknown";
  };

const betAmounts = [0.5,1,5, 10, 25, 50, 100];
type RecentBet = {
  betsids: string;
  value: string;
  amount: number;
  currency: string;
    time: number;
  status: "PENDING" | "WIN" | "LOSE" | "LOST";
};
type Resolution = {
  betId: string;
  status: "WIN" | "LOSE" | "LOST";
  userId?: string;
};

const [recentBets, setRecentBets] = useState<RecentBet[]>([]);
  const wheelRotationRef = useRef<number>(wheelRotation);
  useEffect(() => {
    wheelRotationRef.current = wheelRotation;
  }, [wheelRotation]);

  // Placeholder conversion rates (BASE ~ USD). Replace with live rates if available.
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

  // Try to parse wallet object balance to number safely
  const parseWalletBalance = (b: any) => {
    if (b === null || b === undefined) return 0;
    if (typeof b === "number") return b;
    const n = parseFloat(String(b));
    return isNaN(n) ? 0 : n;
  };

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
  }, []); // run once

  useEffect(() => {
    // Use root socket as requested: getSocket()
    const socket = getSocket(""); 
    socketRef.current = socket;
    const userId = localStorage.getItem("userId") || null;
    socket.emit("join-room", { room: tableId, userId, currency }, (res: any) => {
      console.log("Joined room:", res);
      setLoading(false);
    });
    socket.on("countdown", (data: any) => {
  if (typeof data?.seconds === "number") {
    setCountdown(data.seconds);
    setPhase("COUNTDOWN");

    // when countdown hits zero → spinning
    if (data.seconds === 0) {
      setPhase("SPINNING");
    }
  }
});

    socket.on("spin-result", (data: any) => {
  
      const winNum = data?.result?.number ;
      setResolutions(prev => [...prev, ...(data.resolutions || [])]);
      setstatus(data.resolutions.status || "");
      if(data.resolutions ){
            setResultshow(true);
            console.log("Bet ID matched for resolution update.");
      }
      if (typeof winNum === "number") {
        console.log("Spin result from server:", data);
        handleServerResult(winNum); 
        setGameHistory((prev) => [...prev, winNum]);
        if(data.resolutions.betId === resolutionbetupdate ){
            setResultshow(true);
            console.log("Bet ID matched for resolution update.", data.resolutions.betId,resolutionbetupdate);
            console.log("Resolution Status:", data.resolutions.betId,resolutionbetupdate);
      }
      } else {
        console.warn("Unexpected spin-result payload:", data);
      }
    });
    
    socket.on("bet-update", (data: any) => {
      
      console.log("Live bet update:", data);
      setresolutionbetupdate(data.bet.bet.id || []);
     setRecentBets(prev => {
        const rawBet = data?.bet?.bet;
        if (!rawBet) return prev;

        const betId = String(rawBet.id);

        // prevent duplicate betId
        if (prev.some(b => b.betsids === betId)) {
          return prev;
        }

        const newBet: RecentBet = {
          betsids: betId,
          value: rawBet.payload?.value ?? "", // number / color / etc
          amount: Number(rawBet.amount),
          currency: rawBet.currency,
          time: new Date(rawBet.createdAt).getTime(),
          status: "PENDING"
        };

        return [...prev, newBet];
      });
     setBets((prev) => {
  const newBets = { ...prev };

  const betData = data?.bet?.bet;
  if (!betData) return prev;

  const betsArray = Array.isArray(betData) ? betData : [betData];

  betsArray.forEach((bet: any) => {
    const rawValue = bet.value ?? bet.payload?.value;
    if (!rawValue) return;

    const val = String(rawValue).toUpperCase();
    newBets[val] = (newBets[val] || 0) + Number(bet.amount || 0);
  });

  return newBets;
});


    });

    socket.on("balance-update", (payload: any) => {
      if (payload?.currency && payload?.balance !== undefined) {
        
        if (String(payload.currency).toUpperCase() === String(currency).toUpperCase()) {
          setBalance(parseWalletBalance(payload.balance));
        }
      } else if (payload?.balance !== undefined && !payload?.currency) {
        setBalance(parseWalletBalance(payload.balance));
      }
    });

    return () => {
      try {
        socket.emit("leave-room", { room: tableId, userId }, () => {});
      } catch (e) {
       
      }
      socket.off("countdown");
      socket.off("spin-result");
      socket.off("bet-update");
      socket.off("balance-update");
      // disconnect root socket
      try {
        disconnectSocket();
      } catch (e) {
        
      }
    };
    
  }, [tableId, currency]);

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

/* ---------- PLACE INDIVIDUAL BET ---------- */
const addBetLocally = (value: string, usdtAmount: number = betAmount) => {
  if (isSpinning) return;

  const newTotalUSDT =
    Object.values(bets).reduce((a, b) => a + b, 0) + usdtAmount;

  // 🔥 convert ONLY for balance check
  const totalInCurrency = convertChipToCurrency(newTotalUSDT);

  if (totalInCurrency > balance) {
    toast.error("Insufficient balance");
    return;
  }

  setBets(prev => ({
    ...prev,
    [value]: (prev[value] || 0) + usdtAmount,
  }));

  setTotalBet(newTotalUSDT); // ✅ store USDT
};

const clearBets = () => {
  setBets({});
  setTotalBet(0); 
};

/* ---------- SPIN ALL BETS ---------- */
const spin = () => {
  if (Object.keys(bets).length === 0 || isSpinning) return;

  const socket = socketRef.current;
  if (!socket || !socket.connected) return alert("No server connection");

  setIsSpinning(true);
  setResult(null);
  setWinningAmount(0);
  setShowWinningAlert(false);

  const spinRecentBets = Object.entries(bets).map(([value, amount]) => ({
    value,
    amount,
    type: isNaN(Number(value)) ? "COLOR" : "NUMBER",
  }));

 Object.entries(bets).forEach(([value, usdtAmount]) => {
  const convertedAmount = convertChipToCurrency(usdtAmount);

  const payload = {
    room: tableId,
    bet: {
      type: isNaN(Number(value)) ? "COLOR" : "NUMBER",
      value: value.toUpperCase(),
      amount: Number(convertedAmount.toFixed(8)), // 🔥 send UI value
      currency,
      game: "Roulette",
    },
  };

  socket.emit("place-bet", payload, (res: any) => {
    if (!res?.success && res?.success !== undefined) {
      toast.error(res?.message || "Bet rejected");
    } else {
      toast.success(`Bet on ${value} placed`);
    }
  });
});


  // ✅ Save recent bets (max 10)
  // const completedRecentBets = spinRecentBets.map((bet) => ({
    
  //   betsids: uuidv4(),
  //   value: bet.value,
  //   amount: bet.amount,
  //   currency,
  //   time: Date.now(),
  //   status: "PENDING" as const,
  // }));
  setBets({});
};

const latestResultBet = React.useMemo(() => {
  if (!recentBets.length) return null;

  // prefer resolved bet (WIN / LOSE / LOST)
  const resolved = [...recentBets]
    .reverse()
    .find(b => b.status !== "PENDING");

  return resolved ?? recentBets[recentBets.length - 1];
}, [recentBets]);
  /* ---------- HANDLE SERVER RESULT ---------- */
const handleServerResult = (winningNumber: number) => {
  setPhase("SPINNING");

  const winningIndex = wheelNumbers.indexOf(winningNumber);
  const segmentAngle = 360 / wheelNumbers.length;
  const extraSpins = 3 + Math.random() * 3;
  const finalRotation =
    wheelRotationRef.current +
    extraSpins * 360 -
    winningIndex * segmentAngle;

  setWheelRotation(finalRotation);
  setBallRotation(finalRotation * -1);
  setBallVisible(true);

  // hide ball after spin
  setTimeout(() => setBallVisible(false), 4200);

  // show winner
 setTimeout(() => {
  setResult(winningNumber);
  setShowWinningAlert(true);
  setPhase("RESULT");

  // 🔥 SHOW STATUS (WIN / LOSE) ONCE
  setShowResultStatus(true);
}, 4500);


  // hide winner and RESET
  setTimeout(() => {
    setShowWinningAlert(false);
    setResult(null);

    // 🔄 READY FOR NEXT ROUND
    setCountdown(15);
    setPhase("COUNTDOWN");
    setIsSpinning(false);
    setBets({});
    setTotalBet(0);
  }, 7500);
};


const getResolution = (betId: string | number) => {
  return resolutions.find(r => r.betId === betId);
};


useEffect(() => {
  if (!resolutions.length) return;

  let newResolvedBetId: string | null = null;

  setRecentBets(prev =>
    prev.map(bet => {
      const resolution = resolutions.find(
        r => String(r.betId) === String(bet.betsids)
      );

      if (!resolution) return bet;

      // ✅ detect NEW resolution
      if (
        bet.status === "PENDING" 
        
      ) {
        newResolvedBetId = String(bet.betsids);
      }

      return {
        ...bet,
        status: resolution.status,
      };
    })
  );

  // ✅ show ONLY if new resolution happened
  if (
    newResolvedBetId &&
    lastShownBetIdRef.current !== newResolvedBetId
  ) {
    lastShownBetIdRef.current = newResolvedBetId;
    setShowResultStatus(true);
  }
}, [resolutions]);


useEffect(() => {
  if (!showResultStatus) return;

  const timer = setTimeout(() => {
    setShowResultStatus(false);
  }, 5000);

  return () => clearTimeout(timer);
}, [showResultStatus]);




  if (loading) return <div>Joining room...</div>;

  /* ---------- SEND INDIVIDUAL BET (optional) ---------- */
  const sendBetToServer = (betType: string, amount: number) => {
  const socket = socketRef.current;
  if (!socket || !socket.connected) return;

  // CHECK BALANCE
  if (amount > balance) {
    return alert("Insufficient balance!");
  }

  const payload = {
    userId: localStorage.getItem("userId"),
    gameId: "roulette",
    room: tableId,
    // betId: uuidv4(),
    betType,
    amount,
    currency,
    color: getColor(betType),
  };
  console.log("Sending individual bet payload to server:", payload);
  socket.emit("place-bet", payload, (ack: any) => {
    if (!ack?.ok) {
      console.error("Bet rejected:", ack?.error);
    } else {
      console.log("Bet accepted:", payload);
      // Deduct balance locally
      setBalance((prev) => prev - amount);
    }
  });
};


const OutsideBtn = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "red" | "dark" | "blue" | "purple" | "green" | "orange";
}) => {
  const colors: Record<string, string> = {
    red: "bg-red-600 hover:bg-red-500",
    dark: "bg-gray-800 hover:bg-gray-700 border border-gray-600",
    blue: "bg-blue-600 hover:bg-blue-500",
    purple: "bg-purple-600 hover:bg-purple-500",
    green: "bg-green-600 hover:bg-green-500",
    orange: "bg-orange-600 hover:bg-orange-500",
  };

  return (
    <button
      onClick={() => addBetLocally(value)}
      disabled={isSpinning}
      className={`
        relative py-3 rounded-xl font-bold text-sm
        transition-all active:scale-95
        ${colors[color]}
        text-white disabled:opacity-50
      `}
    >
      {label}
      {bets[value] && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-black text-xs rounded-full flex items-center justify-center">
          💰
        </span>
      )}
    </button>
  );
};

  /* ---------- JSX ---------- */
  return (
    <div className="flex min-h-screen roulette-header-bg text-white overflow-x-hidden relative flex-col">
      <TopNavbar
        searchValue={search}
        onSearchChange={setSearch}
        wallets={dashboardDetails?.wallets || []}
        onCurrencyChange={(currencyType) => {
          handleCurrencyChange(currencyType);
          console.log("Selected Currency:", currencyType);
        }}
      />

      {/* Header */}
     

<div className="min-h-screen roulette-header-bg text-white">

  {/* ================= MAIN ================= */}
  <div className="max-w-7xl mx-auto px-4 py-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ================= LEFT : HISTORY ================= */}
      <div className="order-3 lg:order-1 space-y-4">

        {/* Recent Results */}
        <div className="roulette-recent-header-bg rounded-xl p-4 border border-gray-700 shadow-inner">
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-lg font-extrabold text-green-400">Recent Results</h3>
      

     <button
          onClick={() => setGameHistory([])}
          className="bg-green-600 hover:bg-green-500 px-3 py-3 rounded-lg font-bold"
        >
          🗑️ Clear History
        </button>
  </div>

  <div className="flex flex-wrap gap-2">
    {gameHistory.slice(-10).map((num, idx) => {
      const isRed = redNumbers.includes(num);
      const isGreen = num === 0;

      return (
        <div
          key={idx}
          className={`
            w-9 h-9 sm:w-10 sm:h-10
            rounded-full
            flex items-center justify-center
            text-xs sm:text-sm font-extrabold
            text-white
            shadow-lg
            border-2
            ${
              isGreen
                ? "bg-green-600 border-green-400"
                : isRed
                ? "bg-red-600 border-red-400"
                : "bg-gray-700 border-gray-500"
            }
          `}
        >
          {num}
        </div>
      );
    })}
  </div>
</div>


        {/* Recent Bets */}
        <div className="roulette-amount-header-bg p-4 rounded-lg border border-gray-700 shadow-inner">
          <h3 className="text-lg font-bold text-purple-400 mb-3">🕒 Recent Bets</h3>
          {recentBets.length === 0 ? (
            <p className="text-gray-400 text-sm">No recent bets</p>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {recentBets.map((bet, idx) => {
                const statusColor =
                  bet.status === "WIN"
                    ? "text-green-400"
                    : bet.status === "LOSE"
                    ? "text-red-400"
                    : "text-yellow-400";

                return (
                  <div key={idx} className="flex justify-between items-center text-sm bg-gray-700/50 px-3 py-2 rounded">
                    <div>
                      <div className="font-bold">{bet.value.toUpperCase()}</div>
                      <div className="text-xs text-gray-400">{new Date(bet.time).toLocaleTimeString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(bet.amount, bet.currency)}</div>
                      <div className={`text-xs font-bold ${statusColor}`}>{bet.status}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ================= CENTER : WHEEL ================= */}
      <div className="order-1 lg:order-2 flex justify-center">
        <div className="">

         {/* Wheel */}
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-gray-600 shadow-2xl relative">
                <div className="absolute inset-0 rounded-full">
                  {wheelNumbers.map((num, idx) => {
                    const angle = (idx * 360) / 37;
                    const isRed = redNumbers.includes(num);
                    const isGreen = num === 0;
                    const radiusOffset = 145;
                    return (
                      <div
                        key={`outer-${idx}`}
                        className="absolute w-8 h-8 flex items-center justify-center"
                        style={{
                          left: "50%",
                          top: "50%",
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radiusOffset}px) rotate(-${angle}deg)`,
                          transformOrigin: "center center",
                        }}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white shadow-lg ${
                            isGreen ? "bg-green-600" : isRed ? "bg-red-600" : "bg-gray-900"
                          }`}
                        >
                          {num}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Inner Spinning Wheel (animated via wheelRotation) */}
                <div
                  className="rounded-full relative overflow-hidden transition-transform duration-[5000ms] ease-out"
                  style={{ transform: `rotate(${wheelRotation}deg)` }}
                >
                  {wheelNumbers.map((num, idx) => {
                    const angle = (idx * 360) / 37;
                    const isRed = redNumbers.includes(num);
                    const isGreen = num === 0;
                    return (
                      <div key={idx} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                        <div
                          className={`absolute w-full h-1/2 origin-bottom ${isGreen ? "bg-green-600" : isRed ? "bg-red-600" : "bg-gray-900"}`}
                          style={{
                            clipPath: `polygon(50% 100%, ${50 - 50 * Math.sin((9.73 * Math.PI) / 180)}% 0%, ${
                              50 + 50 * Math.sin((9.73 * Math.PI) / 180)
                            }% 0%)`,
                          }}
                        />
                        <div
                          className="absolute text-white font-bold text-xs flex items-center justify-center"
                          style={{
                            top: "15px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "14px",
                            height: "14px",
                          }}
                        >
                          {num}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* decorative rings */}
                <div className="absolute inset-8 rounded-full border-2 border-amber-400 opacity-40"></div>
                <div className="absolute inset-12 rounded-full border-1 border-amber-300 opacity-30"></div>
                <div className="absolute inset-16 rounded-full border-2 border-yellow-400 opacity-20 shadow-inner"></div>

                {/* Ball */}
                <div
                  className={`absolute inset-0 transition-all duration-[5000ms] ease-out ${ballVisible ? "opacity-100" : "opacity-0"}`}
                  style={{
                    transform: `rotate(${ballRotation}deg)`,
                    transformOrigin: "center center",
                  }}
                >
                  <div
                    className={`absolute w-4 h-4 bg-white rounded-full shadow-lg border-2 border-gray-300 transition-all duration-300 ${
                      isSpinning ? "animate-pulse" : ""
                    } ${ballVisible ? "scale-100" : "scale-0"}`}
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%) translateY(-120px)",
                      boxShadow: isSpinning
                        ? "0 0 15px rgba(255,255,255,1), inset 0 0 8px rgba(0,0,0,0.3), 0 0 25px rgba(255,215,0,0.5)"
                        : "0 0 12px rgba(255,255,255,0.8), inset 0 0 6px rgba(0,0,0,0.3)",
                      zIndex: 20,
                    }}
                  >
                    <div className="absolute w-2 h-2 bg-gray-100 rounded-full" style={{ top: "2px", left: "2px", opacity: 0.9 }} />
                    <div className={`absolute w-1 h-1 bg-white rounded-full ${isSpinning ? "animate-spin" : ""}`} style={{ top: "1px", right: "1px", opacity: 0.7 }} />
                  </div>
                </div>

                {/* Winning alert */}
                 {showCountdown && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-black/80 border-4 border-blue-400 flex flex-col items-center justify-center animate-pulse">
                        <div className="text-4xl font-bold text-blue-400">
                          {countdown}
                        </div>
                        <div className="text-sm text-gray-300 font-bold">
                          NEXT SPIN
                        </div>
                      </div>
                    </div>
                  )}
                {showWinningAlert && result !== null && (
                  <div className="absolute inset-0 flex items-center justify-center z-30">
                    <div className="relative">
                      <div className="w-32 h-32 bg-black/80 rounded-full flex items-center justify-center border-4 border-yellow-400 ">
                       
                        <div className="text-center">
                          <div className={`text-4xl font-bold mb-1 ${result === 0 ? "text-green-400" : redNumbers.includes(result) ? "text-red-400" : "text-white"}`}>
                            {result}
                          </div>
                          <div className="text-yellow-400 text-sm font-bold animate-bounce">WINNER!</div>
                        </div>
                      </div>
                      <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                      <div className="absolute -top-1 -right-3 w-1 h-1 bg-white rounded-full animate-ping"></div>
                    </div>
                  </div>
                )}
              </div>

        </div>
      </div>

      {/* ================= RIGHT : BET TABLE ================= */}
      <div className="order-2 lg:order-3 space-y-4">
        <div className="roulette-balance-header-bg rounded-2xl p-4 sm:p-6 border border-gray-700 shadow-xl">

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-green-400">🎲 Betting Table</h3>
           
            <button
          onClick={() => spin()}
          disabled={totalBet === 0 || isSpinning}
          className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 px-3 py-3 rounded-lg font-bold"
        >
          🎲 SPIN ({formatCurrency(convertChipToCurrency(totalBet))})
        </button>
          </div>
        <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="text-center mb-4">
       {isSpinning ? (
  <div className="text-blue-400 font-bold animate-pulse">
    🌀 Ball is revolving around the wheel...
  </div>
) : (
  showResultStatus &&
  latestResultBet && (
    <div className="flex justify-between items-center text-sm bg-gray-700/50 px-3 py-2 rounded animate-fade-in">
      <div>
        <div className="font-bold">
          {latestResultBet.value.toUpperCase()}
        </div>
        <div className="text-xs text-gray-400">
          {new Date(latestResultBet.time).toLocaleTimeString()}
        </div>
      </div>

      <div className="text-right">
        <div className="font-bold">
          {formatCurrency(
            latestResultBet.amount,
            latestResultBet.currency
          )}
        </div>

        <div
          className={`text-xs font-bold ${
            latestResultBet.status === "WIN"
              ? "text-green-400"
              : latestResultBet.status === "LOSE"
              ? "text-red-400"
              : "text-yellow-400"
          }`}
        >
          {latestResultBet.status}
        </div>
      </div>
    </div>
  )
)}



      </div>
     
    </div>

          {/* Bet Amount */}
          <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-700 mb-5">
            <label className="text-xs text-gray-400 uppercase tracking-widest">Bet Amount</label>

            <div className="flex flex-wrap gap-3 mt-3">

              {betAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`py-2 rounded-xl font-bold text-sm transition-all ${
                    betAmount === amount
                      ? "bg-blue-600 text-white scale-105 ring-2 ring-blue-400"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {formatCurrency(convertChipToCurrency(amount))}
                </button>
              ))}
            </div>
          </div>

          {/* Numbers */}
          <div className="mb-5">
            <div className="text-sm font-semibold text-gray-300 mb-2">Numbers</div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[0, ...Array.from({ length: 36 }, (_, i) => i + 1)].map(num => (
                <button
                  key={num}
                  disabled={isSpinning}
                  onClick={() => addBetLocally(num.toString())}
                  className={`h-10 rounded-lg font-bold text-sm text-white transition-all ${
                    num === 0
                      ? "bg-green-600"
                      : redNumbers.includes(num)
                      ? "bg-red-600"
                      : "bg-gray-700"
                  } disabled:opacity-50`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Outside Bets */}
         <div className="space-y-2">
  <div className="grid grid-cols-2 gap-2">
    <OutsideBtn label="Red" value="red" color="red" />
    <OutsideBtn label="Black" value="black" color="dark" />
    <OutsideBtn label="Even" value="even" color="blue" />
    <OutsideBtn label="Odd" value="odd" color="purple" />
    <OutsideBtn label="1–18" value="1-18" color="green" />
    <OutsideBtn label="19–36" value="19-36" color="green" />
  </div>

  <div className="grid grid-cols-3 gap-2">
    <OutsideBtn label="1–12" value="1-12" color="orange" />
    <OutsideBtn label="13–24" value="13-24" color="orange" />
    <OutsideBtn label="25–36" value="25-36" color="orange" />
  </div>
</div>

        </div>
      </div>
    </div>

    {/* ================= CONTROLS ================= */}
   
  </div>
</div>

    </div>
  );
};

export default ModernRoulette;
