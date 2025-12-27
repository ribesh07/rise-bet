"use client";

import React, { useEffect, useRef, useState } from "react";
import { getSocket, disconnectSocket } from "@/utils/socket"; // Adjust path
import { apiRequest } from "@/utils/ApiHelper";
import { v4 as uuidv4 } from "uuid";
import TopNavbar from "@/components/topnavbar";
import { useCurrency } from "@/context/CurrencyContext";
import toast from "react-hot-toast";
import Image from "next/image";
import wheelImage from "@/public/games/roulette/wheel.png"; // adjust path

type BetsMap = { [key: string]: number };
function generateTableId(): string {
  return uuidv4();
}

type betupdateid = { id: number; };

const ModernRoulette: React.FC<{ tableId?: string }> = ({ tableId: tableIdProp }) => {
  const [balance, setBalance] = useState<number>(0);
  const [resolutions, setResolutions] = useState<any[]>([]);
  const [resolutionbetupdate, setresolutionbetupdate] = useState<betupdateid[]>([]);
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
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableId, setTableId] = useState<string>(tableIdProp || generateTableId());
  const socketRef = useRef<any>(null);
  
const ballRotationRef = useRef<number>(0);
const ballRadiusRef = useRef<number>(120);
  const [search, setSearch] = useState("");
  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  const { currency, setCurrency } = useCurrency();
  const [spinFinished, setSpinFinished] = useState(false);
  const [showMobileWheel, setShowMobileWheel] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
const [isWin, setIsWin] = useState<boolean | null>(null);
const ballAngleRef = useRef(0);
const animationFrameRef = useRef<number | null>(null);
const [resultshow, setResultshow] = useState(false);
  const chips = [0.5, 1, 5, 10, 25, 50, 100];
  const [ballRadius, setBallRadius] = useState(120); // distance from center
const [winningNumberFromServer, setWinningNumberFromServer] = useState<number | null>(null);

const lockedBallAngleRef = useRef<number | null>(null);


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

 


  const betAmounts = [0.5, 1, 5, 10, 25, 50, 100];
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
  const convertChipToCurrency = (chipBaseAmount: number, cur = currency) => {
    const rate = conversionRates[cur] ?? 1;
    return chipBaseAmount * rate;
  };
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
              wallets.find(
                (w: any) =>
                  String(w.currency || w.symbol).toUpperCase() ===
                  String(currency || "").toUpperCase()
              ) || wallets[0];
          }
          if (initialWallet) {
            const bal = parseWalletBalance(initialWallet.balance ?? initialWallet.amount ?? 0);
            setBalance(bal);
            const curSymbol = (initialWallet.currency || initialWallet.symbol || initialWallet.asset || "").toString().toUpperCase();
            if (curSymbol) setCurrency(curSymbol);
          } else setBalance(0);
        }
      } catch (err) {
        console.error("DASHBOARD API ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardDetails();
  }, []);

  useEffect(() => {
    const socket = getSocket("");
    socketRef.current = socket;
    const userId = localStorage.getItem("userId") || null;
    socket.emit("join-room", { room: tableId, userId, currency }, (res: any) => {
      console.log("Joined room:", res);
      setLoading(false);
    });

     socket.on("spin-result", (data: any) => {
  
      const winNum = data?.result?.number ;
      setResolutions(data.resolutions || []);
      setWinningNumberFromServer(winNum); // store server result immediately
    handleServerResult(winNum);
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
      if (payload?.balance !== undefined) setBalance(parseWalletBalance(payload.balance));
    });

    return () => {
      try {
        socket.emit("leave-room", { room: tableId, userId });
      } catch (e) {}
      socket.off("spin-result");
      socket.off("bet-update");
      socket.off("balance-update");
      try {
        disconnectSocket();
      } catch (e) {}
    };
  }, [tableId, currency]);

  const addBetLocally = (value: string, usdtAmount: number = betAmount) => {
  if (isSpinning) return;

  // ✅ ALWAYS keep wheel closed while betting
  if (window.innerWidth < 640) {
    setShowMobileWheel(false);
  }

  const newTotalUSDT =
    Object.values(bets).reduce((a, b) => a + b, 0) + usdtAmount;

  const totalInCurrency = convertChipToCurrency(newTotalUSDT);
  if (totalInCurrency > balance) {
    toast.error("Insufficient balance");
    return;
  }

  setBets(prev => ({
    ...prev,
    [value]: (prev[value] || 0) + usdtAmount,
  }));

  setTotalBet(newTotalUSDT);
};

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
      game: "ROULETTE",
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
  setBets({});
};



const handleServerResult = (winningNumber: number) => {
  setBallVisible(true);
  animateWheelAndBall(winningNumber);

  // calculate final wheel rotatio
};

const animateWheelAndBall = (winningNumber: number) => {
  if (animationFrameRef.current) {
    cancelAnimationFrame(animationFrameRef.current);
  }

  const startTime = performance.now();
  const duration = 7000;
  const wheelSpins = 6;
  const ballSpins = 10;
  
  const segmentAngle = 360 / wheelNumbers.length;
  const winningIndex = wheelNumbers.indexOf(winningNumber);
  
  // The wheel rotates clockwise, so we need to position the winning number at TOP
  // We rotate the wheel so that the winning pocket is at 0 degrees (top)
  const finalWheelRotation = (wheelSpins * 360) - (winningIndex * segmentAngle);
  
  // Ball rotates counter-clockwise and should end at 0 degrees (top) to match wheel
  const finalBallRotation = -(ballSpins * 360);
  
  const outerRadius = 120;
  const innerRadius = 76;
  
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    if (progress < 1) {
      if (progress < 0.8) {
        const spinProgress = progress / 0.8;
        const easedProgress = easeOutCubic(spinProgress);
        
        const currentWheelRotation = finalWheelRotation * easedProgress;
        wheelRotationRef.current = currentWheelRotation;
        setWheelRotation(currentWheelRotation);
        
        const currentBallRotation = finalBallRotation * easedProgress;
        ballRotationRef.current = currentBallRotation;
        setBallRotation(currentBallRotation);
        
        ballRadiusRef.current = outerRadius;
        setBallRadius(outerRadius);
      } else {
        const dropProgress = (progress - 0.8) / 0.2;
        const easedDrop = easeOutCubic(dropProgress);
        
        wheelRotationRef.current = finalWheelRotation;
        setWheelRotation(finalWheelRotation);
        
        ballRotationRef.current = finalBallRotation;
        setBallRotation(finalBallRotation);
        
        const currentRadius = outerRadius - (outerRadius - innerRadius) * easedDrop;
        ballRadiusRef.current = currentRadius;
        setBallRadius(currentRadius);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      wheelRotationRef.current = finalWheelRotation;
      setWheelRotation(finalWheelRotation);
      ballRotationRef.current = finalBallRotation;
      setBallRotation(finalBallRotation);
      ballRadiusRef.current = innerRadius;
      setBallRadius(innerRadius);
      
      setResult(winningNumber);
      setIsSpinning(false);
      setShowResultPopup(true);
      
      const didWin = Object.keys(bets).some(betKey => {
        const num = parseInt(betKey);
        if (!isNaN(num)) return num === winningNumber;
        if (betKey.toLowerCase() === "red") return redNumbers.includes(winningNumber);
        if (betKey.toLowerCase() === "black") return !redNumbers.includes(winningNumber) && winningNumber !== 0;
        return false;
      });
      setIsWin(didWin);
      
      setTimeout(() => resetGame(), 4000);
    }
  };

  animationFrameRef.current = requestAnimationFrame(animate);
};

  const resetGame = () => {
  setWheelRotation(prev => prev % 360);
  setBallRotation(0);
  setBallVisible(false);
  setResult(null);
  setShowResultPopup(false);
  setShowWinningAlert(false);
  setBets({});
  setTotalBet(0);
  setIsSpinning(false);
  setSpinFinished(false);
  setResolutions([]);
};


  const OutsideBtn = ({ label, value, color }: { label: string; value: string; color: "red" | "dark" | "blue" | "purple" | "green" | "orange"; }) => {
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
        className={`relative py-3 rounded-l font-bold text-sm transition-all active:scale-95 ${colors[color]} text-white disabled:opacity-50`}
      >
        {label}
        {bets[value] && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-black text-xs rounded-l flex items-center justify-center">💰</span>
        )}
      </button>
    );
  };

  if (loading) return <div>Joining room...</div>;

  return (
    <div className="min-h-screen bg-[#0f212e] text-white">
      <TopNavbar
        searchValue={search}
        onSearchChange={setSearch}
        wallets={dashboardDetails?.wallets || []}
        onCurrencyChange={(cur) => setCurrency(cur)}
      />

      <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6">

        {/* LEFT PANEL */}
        <div className="w-full lg:w-72 bg-[#132c3a] rounded-xl p-4 flex flex-col gap-4">
          <div>
            <p className="text-sm text-gray-400">Chip Value</p>
            <div className="flex gap-2 flex-wrap">
              {chips.map(c => (
                <button
                  key={c}
                  onClick={() => setBetAmount(c)}
                  className={`px-3 py-2 rounded-full font-bold ${betAmount === c ? "bg-yellow-500 text-black" : "bg-[#0f212e]"}`}
                >
                  {formatCurrency(convertChipToCurrency(c))}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400">Total Bet</p>
            <div className="bg-[#0f212e] rounded-lg p-2 mt-1">{formatCurrency(convertChipToCurrency(totalBet))}</div>
          </div>

          <button
            onClick={spin}
            disabled={isSpinning || totalBet === 0}
            className="bg-green-600 py-3 rounded-lg font-bold text-lg disabled:bg-gray-600"
          >
            🎲 BET
          </button>
        </div>

        {/* CENTER */}
        <div className="flex-1 flex flex-col items-center gap-6">

          {/* WHEEL */}
          {/* DESKTOP WHEEL ONLY */}
              <div className="hidden sm:flex relative w-72 h-72 sm:w-64 sm:h-64">
                <Image
  src={wheelImage}
  alt="wheel"
  fill
  priority
  className="select-none" // no transition
  style={{ transform: `rotate(${wheelRotation}deg)` }}
/>


         <div
  className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
  style={{
    transform: `
      translate(-50%, -50%)
      rotate(${ballRotation}deg)
      translateY(-${ballRadius}px)
    `,
  }}
/>






              </div>

             {/* MOBILE WHEEL POPUP */}
              {showMobileWheel && (
                <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center sm:hidden">

                  {/* WHEEL */}
                  <div className="relative w-72 h-72">
                    <Image
                      src={wheelImage}
                      alt="wheel"
                      fill
                      priority
                      className="select-none transition-transform duration-[5000ms] ease-out"
                      style={{ transform: `rotate(${wheelRotation}deg)` }}
                    />
                   <div
  className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
  style={{
    transform: `
      translate(-50%, -50%)
      rotate(${ballRotation}deg)
      translateY(-120px)
    `,
    transition: "none",
  }}
/>

                  </div>

                  {/* RESULT */}
                  
                </div>
              )}

          {/* BOARD */}
          <div className="hidden sm:block">      
          <div className="flex gap-2 w-full overflow-x-auto sm:overflow-visible">

            {/* ZERO */}
            <button
              onClick={() => addBetLocally("0")}
              disabled={isSpinning}
              className="
                w-20
                bg-green-600
                font-bold
                flex-shrink-0
                rounded-lg sm:rounded-l-lg
                self-stretch
                sm:h-40
                flex items-center justify-center
              "
            >
              0
            </button>

            {/* NUMBERS */}
            <div
              className="
                grid grid-flow-col grid-rows-4 gap-1
                sm:grid-cols-12 sm:grid-flow-row sm:grid-rows-none
                flex-shrink-0
              "
            >
              {[...Array(36)].map((_, i) => {
                const num = i + 1;
                return (
                  <button
                    key={num}
                    onClick={() => addBetLocally(num.toString())}
                    disabled={isSpinning}
                    className={`
                      w-12 h-12 sm:w-10 sm:h-12
                      font-bold rounded
                      ${redNumbers.includes(num) ? "bg-red-600" : "bg-gray-800"}
                    `}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
            </div> 
          </div>
          {/* ================= MOBILE BOARD ================= */}
          {/* ================= STAKE MOBILE ROULETTE BOARD ================= */}
<div className="sm:hidden w-full max-w-[420px] mx-auto mt-4 flex flex-col items-center">


  {/* ================= ZERO ================= */}
  <div className="flex gap-1">

    {/* ================= OUTSIDE BETS (LEFT – ONLY 6 ROWS) ================= */}
  <div className="flex flex-col gap-1 mt-7 w-[60px]">

  <button
    onClick={() => addBetLocally("1-18")}
    className="h-[65px] bg-[#132c3a] border border-gray-600 rounded
               text-lg flex items-center justify-center"
  >
    <span className="rotate-90 whitespace-nowrap block">
      1 to 18
    </span>
  </button>

  <button
    onClick={() => addBetLocally("even")}
    className="h-[65px] bg-[#132c3a] border border-gray-600 rounded
               text-lg flex items-center justify-center"
  >
    <span className="rotate-90 whitespace-nowrap block">
      EVEN
    </span>
  </button>

  <button
    onClick={() => addBetLocally("red")}
    className="h-[60px] bg-red-600 border border-gray-600 rounded
               text-lg flex items-center justify-center"
  >
    <span className="rotate-90 whitespace-nowrap block">
      RED
    </span>
  </button>

  <button
    onClick={() => addBetLocally("black")}
    className="h-[70px] bg-[#0b0b0b] border border-gray-600 rounded
               text-lg flex items-center justify-center"
  >
    <span className="rotate-90 whitespace-nowrap block">
      BLACK
    </span>
  </button>

  <button
    onClick={() => addBetLocally("odd")}
    className="h-[60px] bg-[#132c3a] border border-gray-600 rounded
               text-lg flex items-center justify-center"
  >
    <span className="rotate-90 whitespace-nowrap block">
      ODD
    </span>
  </button>

  <button
    onClick={() => addBetLocally("19-36")}
    className="h-[70px] bg-[#132c3a] border border-gray-600 rounded
               text-lg flex items-center justify-center"
  >
    <span className="rotate-90 whitespace-nowrap block">
      19 to 36
    </span>
  </button>

</div>



<div className="flex flex-col gap-1 mt-7 w-[60px]">

  <button
    onClick={() => addBetLocally("1st12")}
    className="h-[132px] bg-[#132c3a] border border-gray-600 rounded
               text-lg flex items-center justify-center"
  >
    <span className="rotate-90 whitespace-nowrap block">
      1 to 12
    </span>
  </button>

  <button
    onClick={() => addBetLocally("2nd12")}
    className="h-[132px] bg-[#132c3a] border border-gray-600 rounded
               text-lg flex items-center justify-center"
  >
    <span className="rotate-90 whitespace-nowrap block">
      12 to 24
    </span>
  </button>

  <button
    onClick={() => addBetLocally("3rd12")}
    className="h-[138px] bg-[#132c3a] border border-gray-600 rounded
               text-lg flex items-center justify-center"
  >
    <span className="rotate-90 whitespace-nowrap block">
      25 to 36
    </span>
  </button>

</div>


    {/* ================= NUMBERS GRID ================= */}
  <div className="grid grid-cols-3 gap-0.5  h-auto w- auto">

  {/* ===== ZERO (spans 3 rows & 3 columns) ===== */}
  <button
    onClick={() => addBetLocally("0")}
    className="w-25 col-span-3 row-span-3 bg-green-600
               font-bold text-lg rounded"
  >
    0
  </button>

  {/* ===== NUMBERS 1–36 ===== */}
  {[...Array(36)].map((_, i) => {
    const num = i + 1;
    return (
      <button
        key={num}
        onClick={() => addBetLocally(num.toString())}
        className={`w-8 h-8 text-sm font-bold rounded ${
          redNumbers.includes(num)
            ? "bg-red-600"
            : "bg-gray-800"
        }`}
      >
        {num}
      </button>
    );
  })}

  {/* ===== COLUMN BETS (BOTTOM) ===== */}
  <OutsideBtn label="2:1" value="col1" color="dark" />
  <OutsideBtn label="2:1" value="col2" color="dark" />
  <OutsideBtn label="2:1" value="col3" color="dark" />

</div> 
  </div>
</div>
{/* ================= END STAKE MOBILE BOARD ================= */}

        </div>
      </div>
      {/* ================= RESULT POPUP ================= */}
          {showResultPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

              <div className="
                bg-[#132c3a]
                rounded-2xl
                px-10 py-8
                text-center
                w-[90%] max-w-sm
                animate-scaleIn
              ">

                {/* RESULT NUMBER */}
                <div className="text-6xl font-extrabold text-yellow-400 mb-4">
                  {result}
                </div>

                {/* WIN / LOSS */}
                {isWin ? (
                  <div className="text-green-400 text-2xl font-bold mb-2">
                    YOU WON 🎉
                  </div>
                ) : (
                  <div className="text-red-400 text-2xl font-bold mb-2">
                    YOU LOST 😢
                  </div>
                )}

                {/* AMOUNT */}
                <div className="text-lg text-gray-300">
                  {isWin ? "+" : "-"}
                  {formatCurrency(convertChipToCurrency(totalBet))}
                </div>

              </div>
            </div>
          )}

      </div>
      
    );
  };

export default ModernRoulette;
