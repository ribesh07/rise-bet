
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

const ModernRoulette: React.FC<{ tableId?: string }> = ({ tableId: tableIdProp }) => {
  const [balance, setBalance] = useState<number>(0);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const pendingRecentBets: RecentBet[] = [];
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
  betId: string;
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
  
      const winNum = data?.result?.number ?? data?.number;
       setResolutions(data.resolutions || []);
      if (typeof winNum === "number") {
        console.log("Spin result from server:", data);
        handleServerResult(winNum);
        setGameHistory((prev) => [...prev, winNum]);
      } else {
        console.warn("Unexpected spin-result payload:", data);
      }
    });
    socket.on
    socket.on("bet-update", (data: any) => {
      
      console.log("Live bet update:", data);
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
const addBetLocally = (value: string, amount: number = betAmount) => {
  if (isSpinning) return;

  // calculate new total
  const newTotal =
    Object.values(bets).reduce((a, b) => a + b, 0) + amount;
  if (newTotal > balance) {
    toast.error("Insufficient balance");
    return;
  }
  setBets((prev) => ({
    ...prev,
    [value]: (prev[value] || 0) + amount,
  }));
  setTotalBet(newTotal);
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

  Object.entries(bets).forEach(([value, amount]) => {
    const payload = {
      room: tableId,
      bet: {
        type: isNaN(Number(value)) ? "COLOR" : "NUMBER",
        value: value.toUpperCase(),
        amount,
        currency,
        game: "ROULETTE",
      },
    };

    socket.emit("place-bet", payload, (res: any) => {
     
      if (!res?.success && res?.success !== undefined) {
        toast.error(res?.message || "Bet rejected");

        setBets((prev) => {
          const newBets = { ...prev };
          delete newBets[value];
          return newBets;
        });
        setBalance((prev) => prev + amount);
      } else {
        toast.success(`Bet on ${value} placed`);
      }
    });
  });

  // ✅ Save recent bets (max 10)
  const completedRecentBets = spinRecentBets.map((bet) => ({
    
    betId: uuidv4(),
    value: bet.value,
    amount: bet.amount,
    currency,
    time: Date.now(),
    status: "PENDING" as const,
  }));
  setRecentBets((prev) =>
    [...completedRecentBets, ...prev].slice(0, 10)
  );

  // Clear bets after spin
  setBets({});
};
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

  setRecentBets((prev) =>
    prev.map((bet) => {
      const resolution = resolutions.find(
        (r) => String(r.betId) === String(bet.betId)
      );

      if (!resolution) return bet;

      return {
        ...bet,
        status: resolution.status,
      };
    })
  );
}, [resolutions]);


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
    betId: uuidv4(),
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
    <div className="flex min-h-screen bg-[#1a2c38] text-white overflow-x-hidden relative flex-col">
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
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-400">🎰 Roulette</h1>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm">
            {winningAmount !== 0 && (
              <div className="bg-gray-700 px-3 py-1 rounded">
                <span className="text-gray-400">Last Win:</span>
                <span className={`ml-1 font-bold ${winningAmount > 0 ? "text-green-400" : "text-red-400"}`}>
                  {formatCurrency(winningAmount)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Game History & Stats */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-bold text-blue-400 mb-3">🎯 Recent Results</h3>
              <div className="flex flex-wrap gap-2">
                {gameHistory.slice(-10).map((num, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      num === 0 ? "bg-green-500" : redNumbers.includes(num) ? "bg-red-500" : "bg-gray-600"
                    } text-white`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
            {/* Recent Bets */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-bold text-purple-400 mb-3">🕒 Recent Bets</h3>
            {recentBets.length === 0 ? (
              <p className="text-gray-400 text-sm">No recent bets</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recentBets.map((bet, idx) => {
                  const statusColor =
                    bet.status === "WIN"
                      ? "text-green-400"
                      : bet.status === "LOSE"
                      ? "text-red-400"
                      : "text-yellow-400";

                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm bg-gray-700/50 px-3 py-2 rounded"
                    >
                      {/* LEFT */}
                      <div className="flex flex-col">
                        <span className="font-bold text-white">
                          {bet.value.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(bet.time).toLocaleTimeString()}
                        </span>
                      </div>

                      {/* RIGHT */}
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-white">
                          {formatCurrency(bet.amount, bet.currency)}
                        </span>

                        <span className={`text-xs font-bold ${statusColor}`}>
                          {bet.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
          {/* Center - Roulette Wheel */}
          <div className="flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="relative">
              {/* Pointer */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400 drop-shadow-lg"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full mx-auto -mt-1 shadow-lg"></div>
              </div>

              {/* Wheel */}
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-amber-800 to-amber-900 border-4 border-amber-600 shadow-2xl relative">
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
                      <div className="w-32 h-32 bg-black/80 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-2xl animate-pulse">
                       
                        <div className="text-center">
                          <div className={`text-4xl font-bold mb-1 ${result === 0 ? "text-green-400" : redNumbers.includes(result) ? "text-red-400" : "text-white"}`}>
                            {result}
                          </div>
                          <div className="text-yellow-400 text-sm font-bold animate-bounce">WINNER!</div>
                        </div>
                      </div>
                      <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                      <div className="absolute -top-1 -right-3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Right Panel - Betting Table */}
          <div className="space-y-4 w-full">

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700 shadow-xl">

              {/* Header */}
              <h3 className="text-xl font-extrabold text-green-400 mb-4 flex items-center gap-2">
                🎲 Betting Table
              </h3>

              {/* Bet Amount (Sticky on Mobile) */}
              <div className="mb-5 sticky bottom-0 sm:static z-20 bg-gray-900/90 backdrop-blur p-3 rounded-xl border border-gray-700">
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                  Bet Amount
                </label>

                <div className="grid grid-cols-3 sm:flex gap-2 mb-2">
                  {betAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      className={`
                        py-2 rounded-lg font-bold text-sm transition-all
                        ${betAmount === amount
                          ? "bg-blue-600 text-white ring-2 ring-blue-400 shadow-lg"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"}
                      `}
                    >
                      {formatCurrency(convertChipToCurrency(amount))}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-gray-400">
                  Selected:&nbsp;
                  <span className="text-blue-400 font-bold">
                    {formatCurrency(convertChipToCurrency(betAmount))}
                  </span>
                </div>
              </div>

              {/* Numbers */}
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-300 mb-2">
                  Numbers
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[0, ...Array.from({ length: 36 }, (_, i) => i + 1)].map((num) => (
                    <button
                      key={num}
                      onClick={() => addBetLocally(num.toString())}
                      disabled={isSpinning}
                      className={`
                        relative h-10 sm:h-12 rounded-lg font-bold text-sm
                        transition-all active:scale-95
                        ${num === 0
                          ? "bg-green-600 hover:bg-green-500"
                          : redNumbers.includes(num)
                          ? "bg-red-600 hover:bg-red-500"
                          : "bg-gray-700 hover:bg-gray-600"}
                        text-white disabled:opacity-50
                      `}
                    >
                      {num}

                      {bets[num.toString()] && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-black text-xs rounded-full flex items-center justify-center shadow">
                          💰
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outside Bets */}
              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-300">
                  Outside Bets
                </div>
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

        {/* Control Panel */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-center">
              {isSpinning ? <div className="text-blue-400 font-bold text-lg animate-pulse">🌀 Ball is revolving around the wheel...</div> : <div className="text-gray-400">Place your bets and spin the wheel!</div>}
            </div>
          <div className="flex justify-between items-center">
            
            <div className="flex gap-3">
              <button onClick={clearBets} disabled={totalBet === 0 || isSpinning} className="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold px-4 py-2 rounded transition-colors flex items-center gap-2">
                ❌ Clear Bets
              </button>

              <button onClick={() => setGameHistory([])} className="bg-gray-600 hover:bg-gray-500 text-white font-bold px-4 py-2 rounded transition-colors flex items-center gap-2">
                🗑️ Clear History
              </button>
            </div>

            

           <button
              onClick={() => spin()} // ✅ call spin with no arguments
              disabled={totalBet === 0 || isSpinning}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              {isSpinning ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  SPINNING...
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2">
                  🎲 SPIN ({formatCurrency(totalBet)})
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernRoulette;
