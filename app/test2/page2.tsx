"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getSocket, disconnectSocket } from "@/utils/socket";
import TopNavbar from "@/components/topnavbar";
import wheelImage from "@/public/games/roulette/wheel.png";
import toast from "react-hot-toast";
import { apiRequest } from "@/utils/ApiHelper";
import { useCurrency } from "@/context/CurrencyContext";
 
type BetsMap = { [key: string]: number };

const redNumbers = [
  1,3,5,7,9,12,14,16,18,
  19,21,23,25,27,30,32,34,36
];

const chips = [0.5, 1, 5, 10, 25, 50, 100];


export default function StakeRoulette() {
  const socketRef = useRef<any>(null);


  const [chip, setChip] = useState(10);
  const [bets, setBets] = useState<BetsMap>({});
  const [totalBet, setTotalBet] = useState(0);
  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [ballRotation, setBallRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const tableId = "roulette-global"; // or uuid room
 

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



  /* ---------------- SOCKET INIT ---------------- */
  useEffect(() => {
    const socket = getSocket("");
    socketRef.current = socket;

    const userId = localStorage.getItem("userId");

    socket.emit("join-room", { room: tableId, userId }, () => {
      console.log("Joined roulette room");
    });

    socket.on("spin-result", (data: any) => {
      const winNum = data?.result?.number;
      if (typeof winNum === "number") {
        animateSpin(winNum);
      }
    });

    socket.on("balance-update", (data: any) => {
      if (data?.balance !== undefined) {
        setBalance(Number(data.balance));
      }
    });

    return () => {
      socket.emit("leave-room", { room: tableId, userId });
      socket.off("spin-result");
      socket.off("balance-update");
      disconnectSocket();
    };
  }, []);

  /* ---------------- BETTING ---------------- */
  const placeBet = (key: string) => {
    if (spinning) return;
    if (chip > balance) return toast.error("Insufficient balance");

    setBets(prev => ({ ...prev, [key]: (prev[key] || 0) + chip }));
    setTotalBet(prev => prev + chip);
    setBalance(prev => prev - chip);
  };

  /* ---------------- SPIN (SERVER) ---------------- */
  const spin = () => {
    if (!Object.keys(bets).length || spinning) return;

    const socket = socketRef.current;
    if (!socket?.connected) return toast.error("No connection");

    setSpinning(true);
    setResult(null);

    Object.entries(bets).forEach(([value, amount]) => {
      socket.emit("place-bet", {
        room: tableId,
        bet: {
          game: "ROULETTE",
          type: isNaN(Number(value)) ? "COLOR" : "NUMBER",
          value: value.toUpperCase(),
          amount,
        },
      });
    });

    setBets({});
    setTotalBet(0);
  };

  /* ---------------- ANIMATION ---------------- */
  const animateSpin = (win: number) => {
    const angle = 360 / 37;
    const spins = 6;
    const finalRotation = spins * 360 - win * angle;

    setRotation(finalRotation);
    setBallRotation(-finalRotation);

    setTimeout(() => {
      setResult(win);
      setSpinning(false);
    }, 4000);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-[#0f212e] text-white">

      {/* TOP NAVBAR */}
     <TopNavbar
            searchValue={search}
            onSearchChange={setSearch}
            wallets={dashboardDetails?.wallets || []}
          />

      <div className="flex gap-6 p-6">

        {/* LEFT PANEL */}
        <div className="w-72 bg-[#132c3a] rounded-xl p-4 flex flex-col gap-4">
          <div>
            <p className="text-sm text-gray-400">Chip Value</p>
            <div className="flex gap-2">
              {chips.map(c => (
                <button
                  key={c}
                  onClick={() => setChip(c)}
                  className={`px-3 py-2 rounded-full font-bold ${
                    chip === c ? "bg-yellow-500 text-black" : "bg-[#0f212e]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400">Total Bet</p>
            <div className="bg-[#0f212e] rounded-lg p-2 mt-1">
              ${totalBet}
            </div>
          </div>

          <button
            onClick={spin}
            disabled={spinning || totalBet === 0}
            className="bg-green-600 py-3 rounded-lg font-bold text-lg disabled:bg-gray-600"
          >
            Bet
          </button>
        </div>

        {/* CENTER */}
        <div className="flex-1 flex flex-col items-center gap-6">

          {/* WHEEL */}
          <div className="relative w-72 h-72">
            <Image
              src={wheelImage}
              alt="wheel"
              fill
              className="transition-transform duration-[4000ms] ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            />

            <div
              className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full"
              style={{
                transform: `translate(-50%, -50%) translateY(-120px) rotate(${ballRotation}deg)`,
                transition: "transform 4s ease-out",
              }}
            />
          </div>

          {/* RESULT */}
          {result !== null && (
            <div className="text-4xl font-bold text-yellow-400">
              {result}
            </div>
          )}

          {/* BOARD */}
          <div className="flex">
            <button
              onClick={() => placeBet("0")}
              className="w-12 h-[156px] bg-green-600 rounded-l-lg font-bold"
            >
              0
            </button>

            <div className="grid grid-cols-12 gap-1">
              {[...Array(36)].map((_, i) => {
                const num = i + 1;
                return (
                  <button
                    key={num}
                    onClick={() => placeBet(num.toString())}
                    className={`w-10 h-12 font-bold rounded ${
                      redNumbers.includes(num)
                        ? "bg-red-600"
                        : "bg-gray-800"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* OUTSIDE */}
          <div className="grid grid-cols-6 gap-2">
            {["Red","Black","Even","Odd","1-18","19-36"].map(b => (
              <button
                key={b}
                onClick={() => placeBet(b)}
                className="bg-[#132c3a] py-2 rounded font-bold"
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
