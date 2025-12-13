
"use client";

import React, { useEffect, useRef, useState } from "react";
import { getSocket, disconnectSocket } from "@/utils/socket"; // Adjust path
import { apiRequest } from "@/utils/ApiHelper";
import { v4 as uuidv4 } from "uuid";
import TopNavbar from "@/components/topnavbar";
import { useCurrency } from "@/context/CurrencyContext";
import toast from "react-hot-toast";


type BetsMap = { [key: string]: number };

// Generates a unique table ID using uuid
function generateTableId(): string {
  return uuidv4();
}

const ModernRoulette: React.FC<{ tableId?: string }> = ({ tableId: tableIdProp }) => {
  const [balance, setBalance] = useState<number>(0);

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

  const betAmounts = [1, 5, 10, 25, 50, 100];
 type RecentBet = {
  betId: string;
  value: string;
  amount: number;
  currency: string;
  time: number;
  status: "PENDING" | "WIN" | "LOSE";
};


const [recentBets, setRecentBets] = useState<RecentBet[]>([]);

  const wheelRotationRef = useRef<number>(wheelRotation);
  useEffect(() => {
    wheelRotationRef.current = wheelRotation;
  }, [wheelRotation]);

  /* -------------------------
     Currency / conversion helpers
     ------------------------- */

  // Placeholder conversion rates (BASE ~ USD). Replace with live rates if available.
  const conversionRates: Record<string, number> = {
    INR: 83.0, // 1 USD = 83 INR
    USD: 1,
    USDT: 1,
    BTC: 1 / 60000, // 1 USD = 0.000016666.. BTC
    ETH: 1 / 1800, // example
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

  // format currency value for display
  const formatCurrency = (value: number, cur = currency) => {
    if (cur && currencySymbols[cur]) {
      const { sym, decimals } = currencySymbols[cur];
      // toLocaleString with decimals
      return `${sym}${Number(value).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
    }
    // default
    return `${value.toLocaleString()}`;
  };

  // Convert a "chip base amount" into selected currency
  // Here betAmounts array is considered "base units" (USD-like). We convert to selected currency using conversionRates.
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

  /* -------------------------
     Fetch dashboard / wallets
     ------------------------- */
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

          // Prefer the wallet matching current currency, else first wallet
          const wallets = res.data.wallets || [];
          let initialWallet = null;
          if (wallets.length > 0) {
            // If context currency exists, try to find matching wallet (wallet may hold "currency" or "symbol")
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
            // No wallets found — keep balance 0
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  /* ---------- SOCKET INIT ---------- */
  useEffect(() => {
    // Use root socket as requested: getSocket()
    const socket = getSocket(""); // your server route
    socketRef.current = socket;

    const userId = localStorage.getItem("userId") || null;

    // Include currency and userId in join-room for server to know context
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
      // server expected data.result.number
      const winNum = data?.result?.number ?? data?.number;
      if (typeof winNum === "number") {
        console.log("Spin result from server:", data);
        handleServerResult(winNum);
        setGameHistory((prev) => [...prev, winNum]);
      } else {
        console.warn("Unexpected spin-result payload:", data);
      }
    });

    socket.on("bet-update", (data: any) => {
      // optional: update live bets UI if needed
      console.log("Live bet update:", data);
    });

    // server can also push balance updates
    socket.on("balance-update", (payload: any) => {
      if (payload?.currency && payload?.balance !== undefined) {
        // only update if currency matches selected currency
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
        // ignore
      }
      socket.off("countdown");
      socket.off("spin-result");
      socket.off("bet-update");
      socket.off("balance-update");
      // disconnect root socket
      try {
        disconnectSocket();
      } catch (e) {
        // ignore
      }
    };
    // include tableId and currency in deps so when currency changes we could re-emit if necessary
  }, [tableId, currency]);

  /* ---------- Wallet / Currency sync from TopNavbar ---------- */
  const handleCurrencyChange = (currencyType: string) => {
    if (!currencyType) return;
    const symbol = currencyType.toString().toUpperCase();
    setCurrency(symbol);

    // update balance from dashboardDetails wallets if available
    const wallets = dashboardDetails?.wallets || [];
    const found = wallets.find(
      (w: any) => String(w.currency || w.symbol || w.asset).toUpperCase() === symbol
    );
    if (found) {
      const bal = parseWalletBalance(found.balance ?? found.amount ?? 0);
      setBalance(bal);
    } else {
      // fallback: try to leave balance unchanged or set to 0
      setBalance((prev) => prev); // no-op fallback
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



/* ---------- CLEAR BETS ---------- */
const clearBets = () => {
  setBets({});
  setTotalBet(0); // Optional: just UI reset
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
            {/* <div className="bg-gray-700 px-3 py-1 rounded">
              <span className="text-gray-400">Balance:</span>
              <span className="text-green-400 ml-1 font-bold">{formatCurrency(balance)}</span>
            </div> */}
            {/* <div className="bg-gray-700 px-3 py-1 rounded">
              <span className="text-gray-400">Total Bet:</span>
              <span className="text-yellow-400 ml-1 font-bold">{formatCurrency(totalBet)}</span>
            </div> */}
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

            {/* Current Bets */}
            {/* Recent Bets */}
<div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
  <h3 className="text-lg font-bold text-purple-400 mb-3">🕒 Recent Bets</h3>

  {recentBets.length === 0 ? (
    <p className="text-gray-400 text-sm">No recent bets</p>
  ) : (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {recentBets.map((bet, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center text-sm bg-gray-700/50 px-3 py-2 rounded"
        >
          <div className="flex flex-col">
            <span className="font-bold text-white">
              {bet.value.toUpperCase()}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(bet.time).toLocaleTimeString()}
            </span>
          </div>

          <span className="text-green-400 font-bold">
            {formatCurrency(bet.amount, bet.currency)}
          </span>
        </div>
      ))}
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

              {/* Result display */}
              {/* {result !== null && (
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div
                    className={`px-4 py-2 rounded-lg font-bold text-lg border-2 ${
                      result === 0 ? "bg-green-600 border-green-400" : redNumbers.includes(result) ? "bg-red-600 border-red-400" : "bg-gray-700 border-gray-500"
                    } text-white shadow-lg animate-pulse`}
                  >
                    🎯 {result}
                  </div>
                </div>
              )} */}
            </div>
          </div>

          {/* Right Panel - Betting Table */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-bold text-green-400 mb-4">🎲 Betting Table</h3>

              {/* Betting Amount Controls */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">Bet Amount</label>
                <div className="flex gap-2 mb-3">
                  {betAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      className={`px-3 py-2 text-sm font-bold rounded transition-all ${betAmount === amount ? "bg-blue-600 text-white border-2 border-blue-400" : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"}`}
                    >
                      {formatCurrency(convertChipToCurrency(amount))}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  Selected: <span className="text-blue-400 font-bold">{formatCurrency(convertChipToCurrency(betAmount))}</span>
                </div>
              </div>

              {/* Number Grid */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-400 mb-2">Numbers</div>
                <div className="grid grid-cols-6 gap-1 mb-2">
                  {[0, ...Array.from({ length: 36 }, (_, i) => i + 1)].map((num) => (
                    <button
                      key={num}
                      onClick={() => addBetLocally(num.toString())}
                      disabled={isSpinning}
                      className={`h-8 text-xs font-bold rounded transition-all relative ${num === 0 ? "bg-green-600 hover:bg-green-500" : redNumbers.includes(num) ? "bg-red-600 hover:bg-red-500" : "bg-gray-700 hover:bg-gray-600"} text-white disabled:opacity-50`}
                    >
                      {num}
                      {bets[num.toString()] && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full text-black text-xs flex items-center justify-center">💰</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outside Bets */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-400 mb-2">Outside Bets</div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button onClick={() => addBetLocally("red")} disabled={isSpinning} className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative">
                    Red (1:1)
                    {bets["red"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                  <button onClick={() => addBetLocally("black")} disabled={isSpinning} className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded border border-gray-600 transition-all relative">
                    Black (1:1)
                    {bets["black"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button onClick={() => addBetLocally("even")} disabled={isSpinning} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative">
                    Even (1:1)
                    {bets["even"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                  <button onClick={() => addBetLocally("odd")} disabled={isSpinning} className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative">
                    Odd (1:1)
                    {bets["odd"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button onClick={() => addBetLocally("1-18")} disabled={isSpinning} className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative">
                    1-18 (1:1)
                    {bets["1-18"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                  <button onClick={() => addBetLocally("19-36")} disabled={isSpinning} className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative">
                    19-36 (1:1)
                    {bets["19-36"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  <button onClick={() => addBetLocally("1-12")} disabled={isSpinning} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-2 px-2 text-sm rounded transition-all relative">
                    1-12 (2:1)
                    {bets["1-12"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                  <button onClick={() => addBetLocally("13-24")} disabled={isSpinning} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-2 px-2 text-sm rounded transition-all relative">
                    13-24 (2:1)
                    {bets["13-24"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                  <button onClick={() => addBetLocally("25-36")} disabled={isSpinning} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-2 px-2 text-sm rounded transition-all relative">
                    25-36 (2:1)
                    {bets["25-36"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
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
