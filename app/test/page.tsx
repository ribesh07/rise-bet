'use client';
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import TopNavbar from "@/components/topnavbar";
import { apiRequest } from '@/utils/ApiHelper';
import { Sidebar } from '@/components/sidebar';
import MobileBottomBar from "@/components/mainmobilebuttombar";
import RiseTopBar from "@/components/game/gamebottombar";
import GameDropdown from "@/components/game/gamedropup";
import { useCurrency } from "@/context/CurrencyContext";


const DURATIONS: Record<string, number> = {
  S30: 30,
  M1: 60,
  M3: 180,
  M5: 300,
};
const DUR_LABELS = ['30s', '1m', '3m', '5m'];
const DURATION_KEYS = ['S30', 'M1', 'M3', 'M5'];
const NUMBERS = [0,1,2,3,4,5,6,7,8,9];

type Round = { period: number; number: number; color: string; bigSmall: 'big' | 'small' };
type BetType = 'NUMBER' | 'COLOR' | 'SIZE';

export default function WingoFull() {
  const [durationIndex, setDurationIndex] = useState(0);
  
  const [history, setHistory] = useState<Round[]>([]);
  
  
 
  const [betAmount, setBetAmount] = useState(10);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedBigSmall, setSelectedBigSmall] = useState<'big'|'small'|null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [volume, setVolume] = useState(60);
  const [betHistory, setBetHistory] = useState<any[]>([]);
  const [durationKey, setDurationKey] = useState<'S30' | 'M1' | 'M3' | 'M5'>('S30');
const [timeLeft, setTimeLeft] = useState(DURATIONS[durationKey]);

  const [tab, setTab] = useState<'Play'|'Player History'|'History'|'How To Play'>('Play');
  const [currentDraw, setCurrentDraw] = useState<Round|null>(null);
  const ballControls = useAnimation();
  const [confirmedBet, setConfirmedBet] = useState<{
  number:number|null;
  color:string|null;
  bigSmall:'big'|'small'|null;
  amount:number;
  period?: string;
}>({ number:null, color:null, bigSmall:null, amount:0 });

  const [resultPopup, setResultPopup] = useState<null | {type:'win'|'lose', round: Round}>(null);
  const confirmedBetRef = useRef(confirmedBet);
  
  // Betting locked when 5s or less
  const bettingLocked = timeLeft <= 5;
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

  function getColorForNumber(n: number): string {
    const colorMap: Record<number, string> = {
      0: "red+violet", 1: "green", 2: "red", 3: "green",
      4: "red", 5: "green+violet", 6: "red", 7: "green",
      8: "red", 9: "green"
    };
    return colorMap[n] || "green";
  }

  // Fetch current match and history
  useEffect(() => {
  fetchGameHistory(); // once only
}, [durationIndex]);

  async function fetchGameHistory() {
    try {
      const token = localStorage.getItem("token");
     
      const response = await apiRequest(`/game/wingo/result`, true, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = response;
      console.log('Game History Response:', data);
      
      if (data.success && data.data && Array.isArray(data.data)) {
        // Filter by current duration
        const currentDuration = DURATION_KEYS[durationIndex];
        const filteredData = data.data.filter((item: any) => item.duration === currentDuration);
        
        // Process settled matches for history
        const settledMatches = filteredData.filter((item: any) => 
          item.status === 'SETTLED' && item.result !== null
        );
        
        const historyData = settledMatches.map((item: any) => {
          const resultNumber = parseInt(item.result);
          return {
            period: item.uid,
            number: resultNumber,
            color: getColorForNumber(resultNumber),
            bigSmall: resultNumber <= 4 ? 'small' as const : 'big' as const
          };
        });
        
        setHistory(historyData);
        
        // Set current draw as most recent settled
        if (historyData.length > 0) {
          setCurrentDraw(historyData[0]);
        }


      }
    } catch (error) {
      console.error('Failed to fetch game history:', error);
    }
  }

  async function fetchPlayerBetHistory() {
    try {
      const token = localStorage.getItem("token");
     
      const response = await apiRequest(`/game/wingo/result`, true, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = response;
      console.log('Player Bet History Response:', data);
      
      if (data.success && data.data && Array.isArray(data.data)) {
        const currentDuration = DURATION_KEYS[durationIndex];
        const userBets = data.data.filter((item: any) => 
          item.duration === currentDuration && item.userId
        );
        
        const formatted = userBets.map((bet: any) => ({
          betId: bet.uid,
          period: bet.uid,
          betType: bet.betType,
          betValue: bet.value,
          betAmount: parseFloat(bet.amount),
          multiplier: bet.win ? parseFloat(bet.payout) / parseFloat(bet.amount) : -1,
          resultNumber: bet.result !== null ? bet.result : '-',
          resultColor: '-',
          resultBigSmall: '-',
          winAmount: bet.win ? parseFloat(bet.payout) : 0,
          lossAmount: !bet.win && bet.status === 'SETTLED' ? parseFloat(bet.amount) : 0,
          status: bet.status === 'OPEN' ? 'pending' : bet.win ? 'win' : 'lose',
          timestamp: bet.createdAt
        }));
        setBetHistory(formatted);
      }
    } catch (error) {
      console.error('Failed to fetch bet history:', error);
    }
  }
useEffect(() => {
  setDurationKey(DURATION_KEYS[durationIndex] as any);
  setTimeLeft(DURATIONS[DURATION_KEYS[durationIndex]]);
}, [durationIndex]);

useEffect(() => {
  fetchPlayerBetHistory(); // once only
}, [durationIndex]);


  function playSound(type: 'win'|'lose'|'click'|'draw'){
    const path = `/sounds/${type}.mp3`;
    try{ const a = new Audio(path); a.volume = volume/100; a.play().catch(()=>{}); }catch(e){}
  }
useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev === 1) {
        // ⏱ Round finished
        fetchPlayerBetHistory();
        fetchGameHistory(); // wingo/result
        return DURATIONS[durationKey]; // 🔁 restart
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [durationKey]);


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
        console.error("Dashboard API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardDetails();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Continuous Timer - now synced with server time
  useEffect(() => {
    confirmedBetRef.current = confirmedBet;
  }, [confirmedBet]);


const getCurrentPeriod = (
  durationKey: 'S30' | 'M1' | 'M3' | 'M5'
) => {
  const roundLength = {
    S30: 30,
    M1: 60,
    M3: 180,
    M5: 300,
  }[durationKey];

  return `${durationKey}-${Math.floor(Date.now() / 1000 / roundLength)}`;
};




  // Check for win/loss when bet history updates
  useEffect(() => {
    if (betHistory.length > 0 && confirmedBet.amount > 0) {
      const latestBet = betHistory[0];
      
      if (latestBet.status === 'win' && latestBet.resultNumber !== '-') {
        const round: Round = {
          period: latestBet.period,
          number: parseInt(latestBet.resultNumber),
          color: getColorForNumber(parseInt(latestBet.resultNumber)),
          bigSmall: parseInt(latestBet.resultNumber) <= 4 ? 'small' : 'big'
        };
        
        setResultPopup({ type: "win", round });
        playSound("win");
        setTimeout(() => setResultPopup(null), 3000);
        setConfirmedBet({ number: null, color: null, bigSmall: null, amount: 0 });
      } else if (latestBet.status === 'lose' && latestBet.resultNumber !== '-') {
        const round: Round = {
          period: latestBet.period,
          number: parseInt(latestBet.resultNumber),
          color: getColorForNumber(parseInt(latestBet.resultNumber)),
          bigSmall: parseInt(latestBet.resultNumber) <= 4 ? 'small' : 'big'
        };
        
        setResultPopup({ type: "lose", round });
        playSound("lose");
        setTimeout(() => setResultPopup(null), 3000);
        setConfirmedBet({ number: null, color: null, bigSmall: null, amount: 0 });
      }
    }
  }, [betHistory]);

  // Selection
  function onSelectColor(c:string){ if(bettingLocked) return; setSelectedColor(c); setSelectedNumber(null); setSelectedBigSmall(null); setShowPopup(true); playSound('click'); }
  function onSelectNumber(n:number){ if(bettingLocked) return; setSelectedNumber(n); setSelectedColor(null); setSelectedBigSmall(null); setShowPopup(true); playSound('click'); }
  function onSelectBigSmall(bs:'big'|'small'){ if(bettingLocked) return; setSelectedBigSmall(bs); setSelectedNumber(null); setSelectedColor(null); setShowPopup(true); playSound('click'); }

  async function handleConfirmBet(){
    if(bettingLocked) return;
    
    try {
      const token = localStorage.getItem("token");
      
      // Determine bet type and value
      let betType: BetType;
      let value: string;
      
      if (selectedNumber !== null) {
        betType = 'NUMBER';
        value = String(selectedNumber);
      } else if (selectedColor) {
        betType = 'COLOR';
        value = selectedColor.toUpperCase();
      } else if (selectedBigSmall) {
        betType = 'SIZE';
        value = selectedBigSmall.toUpperCase();
      } else {
        return;
      }
      
      const requestBody = {
        betType,
        currency: currency || 'INR',
        value,
        amount: betAmount,
        duration: DURATION_KEYS[durationIndex]
      };
      
      console.log('Placing bet:', requestBody);
      
      const response = await apiRequest(`/game/wingo/bet`, true, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = response;
      console.log('Bet Response:', data);
      
      if (data.success) {
        const newBet = { 
          number: selectedNumber, 
          color: selectedColor, 
          bigSmall: selectedBigSmall, 
          amount: betAmount 
        };
        if (data.success) {
  setConfirmedBet({
    number: selectedNumber,
    color: selectedColor,
    bigSmall: selectedBigSmall,
    amount: betAmount,
    period: getCurrentPeriod(durationKey),
 // 🔥 IMPORTANT
  });

  setBalance(b => Math.max(0, b - betAmount));
  setShowPopup(false);
}

        setConfirmedBet(newBet);
        setBalance(b => Math.max(0, b - betAmount));
        setShowPopup(false);
        playSound('click');
        
        // Refresh bet history and balance
        setTimeout(() => {
          fetchPlayerBetHistory();
          // Refetch user balance
          const fetchBalance = async () => {
            const id = localStorage.getItem("userId");
            const res = await apiRequest(`/users/${id}/details`, true, {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.success && res.data.wallets) {
              const wallet = res.data.wallets.find((w: any) => 
                String(w.currency || w.symbol).toUpperCase() === currency
              );
              if (wallet) {
                setBalance(parseWalletBalance(wallet.balance ?? wallet.amount ?? 0));
              }
            }
          };
          fetchBalance();
        }, 1000);
      } else {
        alert(data.message || 'Failed to place bet');
      }
    } catch (error) {
      console.error('Failed to place bet:', error);
      alert('Failed to place bet. Please try again.');
    }
  }

  function handleCancel(){ setShowPopup(false); }

  const chartData = useMemo(()=>history.slice(0,30).map(r=>r.number).reverse(),[history]);
  
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
      setBalance((prev) => prev); 
    }
  };

  // JSX
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

      <div className="min-h-screen bg-[#1a2c38] p-4 flex flex-col items-center gap-4">

        {/* Durations */}
        <div className="flex gap-3 bg-[#1c2a38] rounded-2xl shadow p-4">
          {DUR_LABELS.map((lab,i)=>(
            <button key={lab} onClick={()=>setDurationIndex(i)} className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl border transition-all ${i===durationIndex? 'bg-orange-500 border-orange-600':'bg-white border-gray-300'}`}>
              <img src={`/color/${i===durationIndex?'time_active':'time-inactive'}.webp`} alt={lab} className="w-10 h-10 object-contain" />
              <span className={`text-xs font-semibold mt-1 ${i===durationIndex?'text-white':'text-gray-700'}`}>{lab}</span>
            </button>
          ))}
        </div>

       
        {/* Main Play Area */}
      <div className="w-full max-w-3xl rounded-2xl
      border border-white/10
      bg-gradient-to-b from-[#0f2a38] to-[#09161f]
      shadow-[0_0_30px_rgba(0,0,0,0.8)]shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">

    {/* LEFT SIDE */}
    <div className="flex-1">
      {/* Timer */}
      <div className="flex items-center justify-between mb-3 relative">
        <div className="text-sm text-gray-400">Time remaining</div>
        <div className="text-xl font-bold" style={{color: bettingLocked ? 'red' : 'white'}}>{timeLeft}s</div>
      </div>
              {/* Confirmed Bet Display */}
{(confirmedBet.number !== null || confirmedBet.color || confirmedBet.bigSmall) && (
  <div className="mb-3 p-3 bg-[#1f2a33] rounded-xl flex gap-3 items-center justify-center flex-wrap">
    <span className="text-green-400 font-semibold">YOUR TRADE</span>
    {confirmedBet.number !== null && (
      <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">

        <img src={`/color/ball_${confirmedBet.number}.webp`} className="w-10 h-10 rounded-full" />
        <span className="text-white font-semibold">{confirmedBet.number}</span>
      </div>
    )}
    {confirmedBet.color && (
      <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
        <span className={`w-5 h-5 rounded-full ${
          confirmedBet.color === 'red' ? 'bg-red-500' :
          confirmedBet.color === 'green' ? 'bg-green-500' :
          'bg-indigo-500'
        }`} />
        <span className="text-white capitalize font-semibold">{confirmedBet.color}</span>
      </div>
    )}
    {confirmedBet.bigSmall && (
      <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
        <span className="text-white capitalize font-semibold">{confirmedBet.bigSmall}</span>
      </div>
    )}
    <div className="text-white font-bold px-3 py-1 border border-white/20 rounded-xl">
      ₹{confirmedBet.amount}.00
    </div>
  </div>
)}
      {/* Ball Display */}
      <div className="w-full h-44 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden"
           style={{ backgroundImage:`url('/color/bg.webp')`, backgroundSize:'cover', backgroundPosition:'center' }}>
        
        <motion.img src={`/color/ball_${currentDraw?.number }.webp`}
                    style={{ width:96, height:96, borderRadius:48, objectFit:'cover' }} />
        
        {/* Previous Draw Info */}
        {currentDraw && (
          <div className="absolute bottom-4 flex flex-col items-center gap-1">
            <div className="px-3 py-1 rounded-full bg-white/90 text-black font-bold">{currentDraw.number}</div>
            <div className="text-xs text-gray-200 drop-shadow">{currentDraw.color} • {currentDraw.bigSmall}</div>
          </div>
        )}
        
      </div>
  


      {/* Buttons */}
      <div className="relative">

      <div className="grid grid-cols-3 gap-2 mb-3">
        <button disabled={bettingLocked} onClick={()=>onSelectColor('green')} className={`py-2 rounded ${bettingLocked?'bg-gray-600':'bg-green-600'} text-white`}>
          Green
        </button>
        <button disabled={bettingLocked} onClick={()=>onSelectColor('violet')} className={`py-2 rounded ${bettingLocked?'bg-gray-600':'bg-purple-600'} text-white`}>
          Violet
        </button>
        <button disabled={bettingLocked} onClick={()=>onSelectColor('red')} className={`py-2 rounded ${bettingLocked?'bg-gray-600':'bg-red-600'} text-white`}>
          Red
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-3">
        {NUMBERS.map(n => (
          <button key={n} disabled={bettingLocked} onClick={()=>onSelectNumber(n)} className={`p-1 rounded-xl border border-transparent ${bettingLocked?'opacity-50 cursor-not-allowed':''}`}>
            <img src={`/color/ball_${n}.webp`} className="w-12 h-12 rounded-full"/>
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center mb-3">
        <button disabled={bettingLocked} onClick={()=>onSelectBigSmall('big')} className={`flex-1 py-2 rounded ${bettingLocked?'bg-gray-600':'bg-green-500'} text-white`}>
          Big
        </button>
        <button disabled={bettingLocked} onClick={()=>onSelectBigSmall('small')} className={`flex-1 py-2 rounded ${bettingLocked?'bg-gray-600':'bg-blue-500'} text-white`}>
          Small
        </button>
      </div>
      {timeLeft <= 5 && (
  <div className="absolute inset-0 z-20
                  flex items-center justify-center
                   backdrop-blur-sm
                  rounded-xl">

    {timeLeft > 0 ? (
      <div className="text-5xl font-extrabold text-yellow-400 ">
       0 {timeLeft}
      </div>
    ) : (
      <div className="text-3xl font-extrabold text-red-500">
        TRADE CLOSED
      </div>
    )}

  </div>
)}

    </div>
    </div>
     {/* RIGHT SIDE TAB */}
            <div className="w-full md:w-96">
              <div className="flex gap-2 mb-4 bg-[#0d1317] p-2 rounded-xl border border-[#1f2a33]">
                {['Play','Player History','History','How To Play'].map(t=>(
                  <button key={t} onClick={()=>setTab(t as any)} className={`flex-1 py-2 rounded-lg font-semibold capitalize transition ${tab===t?'bg-[#00c46c] text-black shadow-[0_0_10px_#00c46c]':'bg-[#111b21] text-gray-300 border border-[#1f2a33] hover:bg-[#162229]'}`}>
                    {t}
                  </button>
                ))}
              </div>

                        {tab === 'Player History' && (
              <div className="bg-[#101b22dd] rounded p-2 shadow max-h-72 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-500">
                    <tr>
                      <th>ID</th>
                      <th>Bet</th>
                      <th>Amt</th>
                      <th>Mult</th>
                      <th>Result</th>
                      <th>P/L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {betHistory.map((h, i) => (
                      <tr key={i} className="border-t text-center text-xs">
                        <td>{h.betId}</td>
                        <td>{h.betValue}</td>
                        <td>{h.betAmount}</td>
                        <td>{h.multiplier}</td>
                        <td>{h.resultNumber}</td>

                        {/* Win or Loss display */}
                        <td className={h.status === "win" ? "text-green-400" : "text-red-400"}>
                          {h.status === "win"
                            ? `+${h.winAmount}`
                            : `-${h.lossAmount}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}


              {tab==='History' && (
                <div className="bg-[#101b22dd] rounded p-2 shadow max-h-72 overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-gray-500"><tr><th>Period</th><th>Num</th><th>BS</th><th>Color</th></tr></thead>
                    <tbody>
                      {history.map((h,i)=>(
                        <tr key={i} className="border-t text-center text-sm">
                          <td>{new Date(h.period).toLocaleTimeString()}</td>
                          <td>{h.number}</td>
                          <td>{h.bigSmall}</td>
                          <td><span className={`inline-block w-3 h-3 rounded-full ${h.color==='red'? 'bg-red-500' : h.color==='green'? 'bg-green-500' : 'bg-purple-500'}`}></span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {tab === 'How To Play' && (
                <div className="bg-[#101b22dd] rounded p-4 shadow max-h-72 overflow-auto text-sm text-gray-200 space-y-2">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>
                      <span className="text-green-400 font-semibold">Select green:</span> If the result shows 
                      <span className="text-green-400 font-semibold"> 1, 3, 7, 9</span> you will get <span className="font-bold">98 * 2 = 196</span>;  
                      If the result shows <span className="text-green-400 font-semibold">5</span>, you will get <span className="font-bold">98 * 1.5 = 147</span>
                    </li>
                    <li>
                      <span className="text-red-500 font-semibold">Select red:</span> If the result shows 
                      <span className="text-red-500 font-semibold">2, 4, 6, 8</span>, you will get <span className="font-bold">98 * 2 = 196</span>;  
                      If the result shows <span className="text-red-500 font-semibold">0</span>, you will get <span className="font-bold">98 * 1.5 = 147</span>
                    </li>
                    <li>
                      <span className="text-purple-500 font-semibold">Select violet:</span> If the result shows 
                      <span className="text-purple-500 font-semibold">0 or 5</span>, you will get <span className="font-bold">98 * 4.5 = 441</span>
                    </li>
                    <li>
                      <span className="text-yellow-400 font-semibold">Select number:</span> If the result is the same as the number you selected, you will get <span className="font-bold">98 * 9 = 882</span>
                    </li>
                    <li>
                      <span className="text-blue-400 font-semibold">Select big:</span> If the result shows 
                      <span className="text-blue-400 font-semibold">5, 6, 7, 8, 9</span>, you will get <span className="font-bold">98 * 2 = 196</span>
                    </li>
                    <li>
                      <span className="text-pink-400 font-semibold">Select small:</span> If the result shows 
                      <span className="text-pink-400 font-semibold">0, 1, 2, 3, 4</span>, you will get <span className="font-bold">98 * 2 = 196</span>
                    </li>
                  </ol>
                </div>
              )}
             </div>
            </div>
              <div className= "flex items-center ">
        <RiseTopBar/>
        
        </div>
          </div>
        

        {/* Bet Modal */}
        <AnimatePresence>
          {showPopup && (
            <BetModal selectedNumber={selectedNumber} selectedColor={selectedColor} selectedBigSmall={selectedBigSmall} betAmount={betAmount} setBetAmount={setBetAmount} balance={balance} onCancel={handleCancel} onConfirm={handleConfirmBet} />
          )}
        </AnimatePresence>

        {/* Result Popup */}
        <AnimatePresence>
          {resultPopup && (
            <motion.div initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.5,opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"/>
              <div className="relative w-80 overflow-hidden rounded-3xl shadow-xl text-center border border-white/20">
                <div className="w-full p-6 pb-10 relative" style={{backgroundImage:`url('/color/${resultPopup.type==='win'?'win.webp':'lose.webp'}')`,backgroundSize:'cover',backgroundPosition:'center'}}>
                  <img src={`/color/${resultPopup.type==='win'?'win.webp':'lose.webp'}`} className="w-28 mx-auto drop-shadow-xl"/>
                  <h2 className="text-2xl font-bold text-white mt-3 drop-shadow">{resultPopup.type==='win'?'Congratulations!':'Sorry'}</h2>
                   <div className="bg-[#e6f0ff] p-6 pt-8 rounded-b-3xl">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="px-3 py-1 rounded-full bg-white border text-[#445] shadow">{resultPopup.round.color}</span>
                    <span className="px-3 py-1 rounded-full bg-white border text-[#445] shadow">{resultPopup.round.number}</span>
                    <span className="px-3 py-1 rounded-full bg-white border text-[#445] shadow">{resultPopup.round.bigSmall}</span>
                  </div>
                  <div className="mt-5 text-xl font-extrabold text-[#3c4c66]">{resultPopup.type==='win'?'WIN':'LOSE'}</div>
                  <div className="mt-2 text-xs text-gray-600">Period: {resultPopup.round.period}</div>
                  <p className="text-gray-500 text-xs mt-4">3 seconds auto close</p>
                </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

// ------------------- BetModal -------------------
function BetModal({ selectedNumber, selectedColor, selectedBigSmall, betAmount, setBetAmount, balance, onCancel, onConfirm }:{
  selectedNumber:number|null, selectedColor:string|null, selectedBigSmall:'big'|'small'|null, betAmount:number, setBetAmount: (v:number)=>void, balance:number, onCancel:()=>void, onConfirm:()=>void
}){
  return (
    <>
  {/* Backdrop */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.7 }}
    exit={{ opacity: 0 }}
    onClick={onCancel}
    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
  />

  {/* Popup */}
  <motion.div
    initial={{ y: 200, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 200, opacity: 0 }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    className="fixed bottom-10 left-0 w-full md:max-w-xl md:right-1/2 md:translate-x-1/2 
               bg-[#0A0F12] border-t border-[#1f2a33] shadow-[0_-4px_20px_rgba(0,0,0,0.6)] 
               rounded-t-3xl p-6 z-50"
  >

    {/* Header */}
    <div className="text-center mb-5">
      <div className="text-xs font-semibold text-gray-400 tracking-wide">WinGo</div>
      <div className="text-2xl font-bold text-white mt-1">Confirm Bet</div>
    </div>

    {/* Selected Items */}
    <div className="flex items-center gap-3 mb-5 justify-center flex-wrap">
      {selectedNumber !== null && (
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
          <img
            src={`/color/ball_${selectedNumber}.webp`}
            className="w-10 h-10 rounded-full shadow-md"
          />
          <div className="font-semibold text-white text-lg">{selectedNumber}</div>
        </div>
      )}
      {selectedColor && (
        <div className="flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
          <div className={`w-5 h-5 rounded-full shadow-md ${
              selectedColor === "red"? "bg-red-500" : selectedColor === "green"? "bg-green-500" : "bg-indigo-500"
            }`}/>
          <div className="font-semibold text-white capitalize">{selectedColor}</div>
        </div>
      )}
      {selectedBigSmall && (
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
          <div className="font-semibold text-white capitalize">{selectedBigSmall}</div>
        </div>
      )}
    </div>

    {/* Balance & Input */}
    <div className="bg-[#121A1F] border border-[#1f2a33] p-4 rounded-2xl mb-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-400">Balance</div>
        <div className="font-bold text-white">{balance}</div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">Bet Amount</div>

        <div className="flex items-center gap-3">
          <button onClick={()=>setBetAmount(Math.max(1, betAmount-1))} className="w-9 h-9 bg-[#0f181d] border border-[#24333d] text-gray-300 rounded-lg hover:bg-[#162229] transition">-</button>
          <div className="text-xl font-bold text-white">{betAmount}</div>
          <button onClick={()=>setBetAmount(betAmount+1)} className="w-9 h-9 bg-[#0f181d] border border-[#24333d] text-gray-300 rounded-lg hover:bg-[#162229] transition">+</button>
        </div>
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        {[10,20,50,100,200].map(v=>(
          <button key={v} onClick={()=>setBetAmount(v)} className="px-4 py-1 bg-[#0f181d] border border-[#24333d] text-gray-300 rounded-lg text-sm hover:bg-[#162229] transition">{v}</button>
        ))}
      </div>
    </div>

    {/* Buttons */}
    <div className="flex gap-3">
      <button className="flex-1 py-3 rounded-xl bg-[#1a252c] text-gray-300 border border-[#24333d] hover:bg-[#1f2e36] transition" onClick={onCancel}>Cancel</button>
      <button className="flex-1 py-3 rounded-xl bg-[#00c46c] text-[#001a10] font-bold shadow-[0_0_12px_#00c46c] hover:bg-[#00d778] transition" onClick={onConfirm}>Total ₹{betAmount}.00</button>
    </div>

  </motion.div>
</>
  );
}