
'use client';
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import TopNavbar from "@/components/topnavbar";
import { apiRequest } from '@/utils/ApiHelper';

const DURATIONS = [15, 60, 180, 300];
const DUR_LABELS = ['30s', '1m', '3m', '5m'];
const NUMBERS = [0,1,2,3,4,5,6,7,8,9];

type Round = { period: number; number: number; color: string; bigSmall: 'big' | 'small' };

export default function WingoFull() {
  const [durationIndex, setDurationIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATIONS[0]);
  const [history, setHistory] = useState<Round[]>([]);
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedBigSmall, setSelectedBigSmall] = useState<'big'|'small'|null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [volume, setVolume] = useState(60);
  const [betHistory, setBetHistory] = useState<any[]>([]);

  const [tab, setTab] = useState<'Play'|'Player History'|'History'|'How To Play'>('Play');
  const [currentDraw, setCurrentDraw] = useState<Round|null>(null);
  const ballControls = useAnimation();
  const [confirmedBet, setConfirmedBet] = useState<{number:number|null,color:string|null,bigSmall:'big'|'small'|null,amount:number}>({number:null,color:null,bigSmall:null,amount:0});
  const [resultPopup, setResultPopup] = useState<null | {type:'win'|'lose', round: Round}>(null);
  const confirmedBetRef = useRef(confirmedBet);
  const [search, setSearch] = useState("");
  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
  // Betting locked when 5s or less
  const bettingLocked = timeLeft <= 5;

  // ---------------- Round Generation ----------------
  function generateRound(): Round {
    const n = Math.floor(Math.random() * 10);
    const colorMap: Record<number, string> = {
      0: "red+violet", 1: "green", 2: "red", 3: "green",
      4: "red", 5: "green+violet", 6: "red", 7: "green",
      8: "red", 9: "green"
    };
    return { period: Date.now(), number: n, color: colorMap[n], bigSmall: n <= 4 ? 'small' : 'big' };
  }
  function generateBetId() {
  return "BET-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

  function playSound(type: 'win'|'lose'|'click'|'draw'){
    const path = `/sounds/${type}.mp3`;
    try{ const a = new Audio(path); a.volume = volume/100; a.play().catch(()=>{}); }catch(e){}
  }
   useEffect(() => {
      const fetchDashboardDetails = async () => {
        try {
          const token = localStorage.getItem("token");
          const id = localStorage.getItem("userId");
  
          const res = await apiRequest(`/users/${id}/details`, true, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
         console.log("Dashboard Details Response:", res);
          if (res.success) {
            setDashboardDetails(res.data);
          }
        } catch (err) {
          console.error("Dashboard API Error:", err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchDashboardDetails();
    }, []);
  // ---------------- Continuous Timer ----------------
  useEffect(() => {
    confirmedBetRef.current = confirmedBet;
  }, [confirmedBet]);

  useEffect(() => {
    setTimeLeft(DURATIONS[durationIndex]);

    const iv = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          const r = generateRound();
          animateBallAndCommit(r, confirmedBetRef.current);
          return DURATIONS[durationIndex];
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(iv);
  }, [durationIndex]);

  // ---------------- Animate & Resolve ----------------
  async function animateBallAndCommit(r:Round, bet = confirmedBet){
    setCurrentDraw(null);
    await ballControls.start({ y: [-180,-40,0], rotate:[0,360], opacity:[0,1,1], transition:{ duration:0.9, ease:'circOut' } });
    await ballControls.start({ y:[0,-10,0], transition:{ duration:0.4 } });
    setCurrentDraw(r);
    setHistory(h=>[{...r},...h].slice(0,200));
    playSound('draw');
    resolveBets(r, bet);
  }

  function resolveBets(r: Round, bet = confirmedBet) {
  let net = 0;
  if (bet.amount <= 0) return;

  let totalMultiplier = 0;
  let win = false;

  // ----- Number -----
  if (bet.number !== null) {
    if (bet.number === r.number) {
      net += bet.amount * 9;
      totalMultiplier = 9;
      win = true;
    } else {
      net -= bet.amount;
      totalMultiplier = -1;
    }
  }

  // ----- Color -----
  if (bet.color) {
    let multiplier = -1;
    if (bet.color === "green") {
      if ([1, 3, 7, 9].includes(r.number)) multiplier = 2;
      if (r.number === 5) multiplier = 1.5;
    }
    if (bet.color === "red") {
      if ([2, 4, 6, 8].includes(r.number)) multiplier = 2;
      if (r.number === 0) multiplier = 1.5;
    }
    if (bet.color === "violet") {
      if ([0, 5].includes(r.number)) multiplier = 4.5;
    }

    net += bet.amount * multiplier;
    totalMultiplier = multiplier;
    win = multiplier > 0;
  }

  // ----- Big/Small -----
  if (bet.bigSmall) {
    let multiplier = -1;
    if (bet.bigSmall === "big" && [5, 6, 7, 8, 9].includes(r.number)) multiplier = 2;
    if (bet.bigSmall === "small" && [0, 1, 2, 3, 4].includes(r.number)) multiplier = 2;

    net += bet.amount * multiplier;
    totalMultiplier = multiplier;
    win = multiplier > 0;
  }

  // Update balance
  setBalance(b => b + net);

  // Save Win/Loss history
  const entry = {
    betId: generateBetId(),
    period: r.period,
    betType: bet.number !== null ? "number" : bet.color ? "color" : "bigSmall",
    betValue: bet.number ?? bet.color ?? bet.bigSmall,
    betAmount: bet.amount,
    multiplier: totalMultiplier,
    resultNumber: r.number,
    resultColor: r.color,
    resultBigSmall: r.bigSmall,
    winAmount: win ? net : 0,
    lossAmount: !win ? Math.abs(net) : 0,
    status: win ? "win" : "lose",
    timestamp: new Date().toISOString()
  };

  setBetHistory(h => [entry, ...h]);

  // Popup
  if (net > 0) {
    setResultPopup({ type: "win", round: r });
    playSound("win");
  }
  if (net < 0) {
    setResultPopup({ type: "lose", round: r });
    playSound("lose");
  }
  if (net !== 0) setTimeout(() => setResultPopup(null), 3000);

  setConfirmedBet({ number: null, color: null, bigSmall: null, amount: 0 });
}


  // ---------------- Selection ----------------
  function onSelectColor(c:string){ if(bettingLocked) return; setSelectedColor(c); setSelectedNumber(null); setSelectedBigSmall(null); setShowPopup(true); playSound('click'); }
  function onSelectNumber(n:number){ if(bettingLocked) return; setSelectedNumber(n); setSelectedColor(null); setSelectedBigSmall(null); setShowPopup(true); playSound('click'); }
  function onSelectBigSmall(bs:'big'|'small'){ if(bettingLocked) return; setSelectedBigSmall(bs); setSelectedNumber(null); setSelectedColor(null); setShowPopup(true); playSound('click'); }

  function handleConfirmBet(){
    if(bettingLocked) return;
    const newBet = { number:selectedNumber, color:selectedColor, bigSmall:selectedBigSmall, amount:betAmount };
    console.log("CONFIRMED BET:", newBet);
    setConfirmedBet(newBet);
    setBalance(b=>Math.max(0,b-betAmount));
    setShowPopup(false); playSound('click');
  }

  function handleCancel(){ setShowPopup(false); }

  const chartData = useMemo(()=>history.slice(0,30).map(r=>r.number).reverse(),[history]);

  // ---------------- JSX ----------------
  return (
    <div className="flex min-h-screen bg-[#0d1317] text-white overflow-x-hidden relative flex-col">
      <TopNavbar
  searchValue={search}
  onSearchChange={setSearch}
  wallets={dashboardDetails?.wallets || []}
/>

      <div className="min-h-screen bg-[#0d1317] p-4 flex flex-col items-center gap-4">

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
      <div className="w-full max-w-3xl bg-[#1c2a38] rounded-2xl shadow p-4">
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
        
        <motion.img src={`/color/ball_${currentDraw?.number ?? 0}.webp`} animate={ballControls}
                    style={{ width:96, height:96, borderRadius:48, objectFit:'cover' }} />

        {/* BIG Countdown Overlay */}
        <div className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-red-500 drop-shadow-lg">
          {bettingLocked ? "TRADE CLOSED" : ''}
        </div>
        
        {/* Previous Draw Info */}
        {currentDraw && (
          <div className="absolute bottom-4 flex flex-col items-center gap-1">
            <div className="px-3 py-1 rounded-full bg-white/90 text-black font-bold">{currentDraw.number}</div>
            <div className="text-xs text-gray-200 drop-shadow">{currentDraw.color} • {currentDraw.bigSmall}</div>
          </div>
        )}
        
      </div>
  


      {/* Buttons */}
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
    className="fixed bottom-0 left-0 w-full md:max-w-xl md:right-1/2 md:translate-x-1/2 
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


// "use client";
// import React, { useEffect, useRef, useMemo, useState } from "react";
// import { motion, AnimatePresence, useAnimation } from "framer-motion";
// import TopNavbar from "@/components/topnavbar";
// import { apiRequest } from "@/utils/ApiHelper";

// const DURATIONS = [15, 60, 180, 300];
// const DUR_LABELS = ["30s", "1m", "3m", "5m"];
// const NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// type Round = { period: number; number: number; color: string; bigSmall: "big" | "small" };

// export default function WingoFull() {
//   const [durationIndex, setDurationIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(DURATIONS[0]);
//   const [history, setHistory] = useState<Round[]>([]);
//   const [balance, setBalance] = useState(1000);
//   const [betAmount, setBetAmount] = useState(10);
//   const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
//   const [selectedColor, setSelectedColor] = useState<string | null>(null);
//   const [selectedBigSmall, setSelectedBigSmall] = useState<"big" | "small" | null>(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [volume, setVolume] = useState(60);
//   const [betHistory, setBetHistory] = useState<any[]>([]);

//   const [tab, setTab] = useState<"Play" | "Player History" | "History" | "How To Play">("Play");
//   const [currentDraw, setCurrentDraw] = useState<Round | null>(null);
//   const ballControls = useAnimation();
//   const [confirmedBet, setConfirmedBet] = useState<{
//     number: number | null;
//     color: string | null;
//     bigSmall: "big" | "small" | null;
//     amount: number;
//   }>({ number: null, color: null, bigSmall: null, amount: 0 });
//   const [resultPopup, setResultPopup] = useState<null | { type: "win" | "lose"; round: Round }>(null);
//   const confirmedBetRef = useRef(confirmedBet);
//   const [search, setSearch] = useState("");
//   const [dashboardDetails, setDashboardDetails] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   // betting locked when <= 5 seconds
//   const bettingLocked = timeLeft <= 5;

//   // ---------------- Round Generation ----------------
//   function generateRound(): Round {
//     const n = Math.floor(Math.random() * 10);
//     const colorMap: Record<number, string> = {
//       0: "red+violet",
//       1: "green",
//       2: "red",
//       3: "green",
//       4: "red",
//       5: "green+violet",
//       6: "red",
//       7: "green",
//       8: "red",
//       9: "green",
//     };
//     return { period: Date.now(), number: n, color: colorMap[n], bigSmall: n <= 4 ? "small" : "big" };
//   }
//   function generateBetId() {
//     return "BET-" + Math.random().toString(36).substring(2, 10).toUpperCase();
//   }

//   function playSound(type: "win" | "lose" | "click" | "draw") {
//     const path = `/sounds/${type}.mp3`;
//     try {
//       const a = new Audio(path);
//       a.volume = Math.max(0, Math.min(1, volume / 100));
//       a.play().catch(() => {});
//     } catch (e) {}
//   }

//   useEffect(() => {
//     const fetchDashboardDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const id = localStorage.getItem("userId");

//         const res = await apiRequest(`/users/${id}/details`, true, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (res?.success) {
//           setDashboardDetails(res.data);
//         }
//       } catch (err) {
//         console.error("Dashboard API Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardDetails();
//   }, []);

//   // ---------------- Continuous Timer ----------------
//   useEffect(() => {
//     confirmedBetRef.current = confirmedBet;
//   }, [confirmedBet]);

//   useEffect(() => {
//     // Reset timeLeft whenever duration changes
//     setTimeLeft(DURATIONS[durationIndex]);

//     const iv = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           const r = generateRound();
//           animateBallAndCommit(r, confirmedBetRef.current);
//           return DURATIONS[durationIndex];
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(iv);
//   }, [durationIndex]);

//   // ---------------- Animate & Resolve ----------------
//   async function animateBallAndCommit(r: Round, bet = confirmedBet) {
//     setCurrentDraw(null);
//     // entrance arc + spin
//     await ballControls.start({
//       y: [-220, -40, 0],
//       rotate: [0, 360],
//       opacity: [0, 1, 1],
//       transition: { duration: 0.95, ease: "circOut" },
//     });
//     // settle micro-bounce
//     await ballControls.start({ y: [0, -12, 0], transition: { duration: 0.4 } });
//     setCurrentDraw(r);
//     setHistory((h) => [{ ...r }, ...h].slice(0, 200));
//     playSound("draw");
//     resolveBets(r, bet);
//   }

//   function resolveBets(r: Round, bet = confirmedBet) {
//     let net = 0;
//     if (!bet || bet.amount <= 0) return;

//     let totalMultiplier = 0;
//     let win = false;

//     // number
//     if (bet.number !== null) {
//       if (bet.number === r.number) {
//         net += bet.amount * 9;
//         totalMultiplier = 9;
//         win = true;
//       } else {
//         net -= bet.amount;
//         totalMultiplier = -1;
//       }
//     }

//     // color
//     if (bet.color) {
//       let multiplier = -1;
//       if (bet.color === "green") {
//         if ([1, 3, 7, 9].includes(r.number)) multiplier = 2;
//         if (r.number === 5) multiplier = 1.5;
//       }
//       if (bet.color === "red") {
//         if ([2, 4, 6, 8].includes(r.number)) multiplier = 2;
//         if (r.number === 0) multiplier = 1.5;
//       }
//       if (bet.color === "violet") {
//         if ([0, 5].includes(r.number)) multiplier = 4.5;
//       }

//       net += bet.amount * multiplier;
//       totalMultiplier = multiplier;
//       win = multiplier > 0;
//     }

//     // big/small
//     if (bet.bigSmall) {
//       let multiplier = -1;
//       if (bet.bigSmall === "big" && [5, 6, 7, 8, 9].includes(r.number)) multiplier = 2;
//       if (bet.bigSmall === "small" && [0, 1, 2, 3, 4].includes(r.number)) multiplier = 2;

//       net += bet.amount * multiplier;
//       totalMultiplier = multiplier;
//       win = multiplier > 0;
//     }

//     setBalance((b) => b + net);

//     const entry = {
//       betId: generateBetId(),
//       period: r.period,
//       betType: bet.number !== null ? "number" : bet.color ? "color" : "bigSmall",
//       betValue: bet.number ?? bet.color ?? bet.bigSmall,
//       betAmount: bet.amount,
//       multiplier: totalMultiplier,
//       resultNumber: r.number,
//       resultColor: r.color,
//       resultBigSmall: r.bigSmall,
//       winAmount: win ? net : 0,
//       lossAmount: !win ? Math.abs(net) : 0,
//       status: win ? "win" : "lose",
//       timestamp: new Date().toISOString(),
//     };

//     setBetHistory((h) => [entry, ...h]);

//     if (net > 0) {
//       setResultPopup({ type: "win", round: r });
//       playSound("win");
//     }
//     if (net < 0) {
//       setResultPopup({ type: "lose", round: r });
//       playSound("lose");
//     }
//     if (net !== 0) setTimeout(() => setResultPopup(null), 3000);

//     setConfirmedBet({ number: null, color: null, bigSmall: null, amount: 0 });
//   }

//   // ---------------- Selection ----------------
//   function onSelectColor(c: string) {
//     if (bettingLocked) return;
//     setSelectedColor(c);
//     setSelectedNumber(null);
//     setSelectedBigSmall(null);
//     setShowPopup(true);
//     playSound("click");
//   }
//   function onSelectNumber(n: number) {
//     if (bettingLocked) return;
//     setSelectedNumber(n);
//     setSelectedColor(null);
//     setSelectedBigSmall(null);
//     setShowPopup(true);
//     playSound("click");
//   }
//   function onSelectBigSmall(bs: "big" | "small") {
//     if (bettingLocked) return;
//     setSelectedBigSmall(bs);
//     setSelectedNumber(null);
//     setSelectedColor(null);
//     setShowPopup(true);
//     playSound("click");
//   }

//   function handleConfirmBet() {
//     if (bettingLocked) return;
//     const newBet = { number: selectedNumber, color: selectedColor, bigSmall: selectedBigSmall, amount: betAmount };
//     setConfirmedBet(newBet);
//     setBalance((b) => Math.max(0, b - betAmount));
//     setShowPopup(false);
//     playSound("click");
//   }

//   function handleCancel() {
//     setShowPopup(false);
//     // reset selection optionally:
//     // setSelectedNumber(null); setSelectedColor(null); setSelectedBigSmall(null);
//   }

//   const quickChips = [10, 25, 50, 100, 200];

//   const chartData = useMemo(() => history.slice(0, 30).map((r) => r.number).reverse(), [history]);

//   // ----------------- RENDER -----------------
//   return (
//     <div className="flex min-h-screen bg-gradient-to-b from-[#061015] via-[#07121a] to-[#041018] text-white overflow-x-hidden relative">
//       {/* Neon grid + fog layers (decorative) */}
     
//       <div className="pointer-events-none fixed inset-0 -z-10">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,255,255,0.06),transparent_20%),radial-gradient(circle_at_80%_80%,rgba(255,0,255,0.05),transparent_25%)] blur-[40px] opacity-80" />
//         <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,255,255,0.02),transparent,rgba(255,0,255,0.02))] animate-[pulse_8s_ease-in-out_infinite]" />
//         <div className="absolute inset-0 bg-[url('/grid.png')] opacity-10 mix-blend-screen animate-[gridMove_30s_linear_infinite]" />
//       </div>

      

//       <main className="w-full max-w-5xl mx-auto p-4 pb-28">
//         {/* header / controls */}
//         <div className="flex items-center gap-4 mb-4">
//           <div className="flex gap-3 p-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/6 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
//             {DUR_LABELS.map((lab, i) => (
//               <button
//                 key={lab}
//                 onClick={() => setDurationIndex(i)}
//                 className={`flex flex-col items-center px-3 py-2 rounded-xl transition-transform hover:scale-105 ${
//                   i === durationIndex
//                     ? "bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black shadow-[0_6px_24px_rgba(0,200,255,0.12)]"
//                     : "bg-white/5 text-gray-300"
//                 }`}
//                 aria-pressed={i === durationIndex}
//               >
//                 <img src={`/color/${i === durationIndex ? "time_active" : "time-inactive"}.webp`} alt={lab} className="w-10 h-10 object-contain" />
//                 <span className={`text-xs font-semibold mt-1 ${i === durationIndex ? "text-black" : "text-gray-300"}`}>{lab}</span>
//               </button>
//             ))}
//           </div>

         
//         </div>

//         {/* Main Play Area */}
//         <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.25))] border border-white/6 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-lg">
//           <div className="flex flex-col md:flex-row gap-6">
//             {/* LEFT */}
//             <div className="flex-1">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="text-sm text-gray-300">Time remaining</div>
//                 <div className={`text-2xl font-extrabold ${bettingLocked ? "text-red-400" : "text-white"}`}>{timeLeft}s</div>
//               </div>

//               {/* confirmed trade */}
//               {(confirmedBet.number !== null || confirmedBet.color || confirmedBet.bigSmall) && (
//                 <div className="mb-3 p-3 rounded-xl bg-black/30 border border-white/5 flex flex-wrap items-center gap-3">
//                   <div className="text-xs text-green-300 font-semibold">CONFIRMED</div>
//                   {confirmedBet.number !== null && (
//                     <div className="flex items-center gap-2 bg-white/6 px-3 py-2 rounded-xl">
//                       <img src={`/color/ball_${confirmedBet.number}.webp`} className="w-10 h-10 rounded-full" />
//                       <div className="font-semibold">{confirmedBet.number}</div>
//                     </div>
//                   )}
//                   {confirmedBet.color && (
//                     <div className="flex items-center gap-2 bg-white/6 px-3 py-2 rounded-xl">
//                       <span className={`w-5 h-5 rounded-full ${confirmedBet.color === "red" ? "bg-red-500" : confirmedBet.color === "green" ? "bg-green-500" : "bg-violet-500"}`} />
//                       <div className="font-semibold capitalize">{confirmedBet.color}</div>
//                     </div>
//                   )}
//                   {confirmedBet.bigSmall && (
//                     <div className="flex items-center gap-2 bg-white/6 px-3 py-2 rounded-xl">
//                       <div className="font-semibold capitalize">{confirmedBet.bigSmall}</div>
//                     </div>
//                   )}
//                   <div className="ml-auto px-3 py-1 rounded-xl bg-white/6 font-bold">₹{confirmedBet.amount}.00</div>
//                 </div>
//               )}

//               {/* ball area */}
//               <div
//                 className="w-full h-48 rounded-xl overflow-hidden relative flex items-center justify-center"
//                 style={{ backgroundImage: `url('/color/bg.webp')`, backgroundSize: "cover", backgroundPosition: "center" }}
//                 aria-hidden
//               >
//                 <motion.img
//                   src={`/color/ball_${currentDraw?.number ?? 0}.webp`}
//                   animate={ballControls}
//                   className="w-24 h-24 rounded-full object-cover shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
//                 />

//                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                   {bettingLocked ? (
//                     <div className="text-3xl font-black text-red-500 drop-shadow-lg">TRADE CLOSED</div>
//                   ) : (
//                     <div className="text-6xl font-extrabold text-white/10 select-none">{timeLeft}</div>
//                   )}
//                 </div>

//                 {currentDraw && (
//                   <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-xs">
//                     <div className="font-bold text-white">{currentDraw.number}</div>
//                     <div className="text-gray-300 text-xs">{currentDraw.color} • {currentDraw.bigSmall}</div>
//                   </div>
//                 )}
//               </div>

//               {/* quick color buttons */}
//               <div className="grid grid-cols-3 gap-3 mt-4">
//                 <button disabled={bettingLocked} onClick={() => onSelectColor("green")} className={`py-2 rounded-xl font-bold ${bettingLocked ? "bg-gray-600" : "bg-gradient-to-r from-green-500 to-green-600"} shadow-[0_8px_20px_rgba(0,200,120,0.12)]`}>Green</button>
//                 <button disabled={bettingLocked} onClick={() => onSelectColor("violet")} className={`py-2 rounded-xl font-bold ${bettingLocked ? "bg-gray-600" : "bg-gradient-to-r from-purple-500 to-pink-500"} shadow-[0_8px_20px_rgba(200,60,200,0.12)]`}>Violet</button>
//                 <button disabled={bettingLocked} onClick={() => onSelectColor("red")} className={`py-2 rounded-xl font-bold ${bettingLocked ? "bg-gray-600" : "bg-gradient-to-r from-red-500 to-red-600"} shadow-[0_8px_20px_rgba(255,60,60,0.12)]`}>Red</button>
//               </div>

//               {/* numbers */}
//               <div className="grid grid-cols-5 gap-2 mt-4">
//                 {NUMBERS.map((n) => (
//                   <button key={n} disabled={bettingLocked} onClick={() => onSelectNumber(n)} className={`flex items-center justify-center p-1 rounded-xl transition ${bettingLocked ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}>
//                     <img src={`/color/ball_${n}.webp`} alt={`ball-${n}`} className="w-12 h-12 rounded-full" />
//                   </button>
//                 ))}
//               </div>

//               {/* big/small */}
//               <div className="flex gap-2 mt-4">
//                 <button disabled={bettingLocked} onClick={() => onSelectBigSmall("big")} className={`flex-1 py-2 rounded-xl font-semibold ${bettingLocked ? "bg-gray-600" : "bg-gradient-to-r from-blue-500 to-cyan-400"}`}>Big</button>
//                 <button disabled={bettingLocked} onClick={() => onSelectBigSmall("small")} className={`flex-1 py-2 rounded-xl font-semibold ${bettingLocked ? "bg-gray-600" : "bg-gradient-to-r from-indigo-500 to-purple-500"}`}>Small</button>
//               </div>
//             </div>

//             {/* RIGHT */}
//             <div className="w-full md:w-96">
//               <div className="flex gap-2 mb-4 bg-white/3 p-2 rounded-xl border border-white/6">
//                 {["Play", "Player History", "History", "How To Play"].map((t) => (
//                   <button key={t} onClick={() => setTab(t as any)} className={`flex-1 py-2 rounded-lg font-semibold capitalize transition ${tab === t ? "bg-cyan-400/90 text-black shadow-[0_6px_20px_rgba(0,200,255,0.12)]" : "bg-transparent text-gray-300 border border-white/6 hover:bg-white/4"}`}>
//                     {t}
//                   </button>
//                 ))}
//               </div>

//               {tab === "Play" && (
//                 <div className="bg-white/3 rounded-xl p-3 border border-white/6">
//                   <div className="text-sm text-gray-300 mb-2">Quick chips</div>
//                   <div className="flex gap-2 flex-wrap mb-3">
//                     {quickChips.map((c) => (
//                       <button key={c} onClick={() => setBetAmount(c)} className="px-4 py-2 rounded-lg bg-black/40 border border-white/6 hover:scale-105">{c}</button>
//                     ))}
//                   </div>

//                   <div className="bg-black/30 p-3 rounded-xl border border-white/6 mb-3">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="text-sm text-gray-300">Bet amount</div>
//                       <div className="font-bold">₹{betAmount}.00</div>
//                     </div>

//                     <div className="flex gap-2">
//                       <button onClick={() => setBetAmount(Math.max(1, betAmount - 1))} className="px-3 py-2 rounded-lg bg-white/5">-</button>
//                       <input aria-label="bet amount" value={betAmount} onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value || 0)))} type="number" className="flex-1 bg-transparent px-3 py-2 rounded-lg border border-white/6" />
//                       <button onClick={() => setBetAmount(betAmount + 1)} className="px-3 py-2 rounded-lg bg-white/5">+</button>
//                     </div>
//                   </div>

//                   <div className="flex gap-3">
//                     <button onClick={() => setShowPopup(true)} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 font-bold text-black shadow-[0_10px_30px_rgba(120,30,255,0.12)]">Place Bet</button>
//                     <button onClick={() => { setConfirmedBet({ number: null, color: null, bigSmall: null, amount: 0 }); playSound("click"); }} className="py-3 px-4 rounded-xl bg-white/5">Clear</button>
//                   </div>
//                 </div>
//               )}

//               {tab === "Player History" && (
//                 <div className="bg-white/3 rounded-xl p-2 shadow max-h-72 overflow-auto">
//                   <table className="w-full text-sm">
//                     <thead className="text-xs text-gray-400">
//                       <tr>
//                         <th className="text-left">ID</th>
//                         <th>Bet</th>
//                         <th>Amt</th>
//                         <th>Mult</th>
//                         <th>Result</th>
//                         <th>P/L</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {betHistory.map((h, i) => (
//                         <tr key={i} className="border-t text-center text-xs">
//                           <td className="text-left">{h.betId}</td>
//                           <td>{String(h.betValue)}</td>
//                           <td>{h.betAmount}</td>
//                           <td>{h.multiplier}</td>
//                           <td>{h.resultNumber}</td>
//                           <td className={h.status === "win" ? "text-green-400" : "text-red-400"}>{h.status === "win" ? `+${h.winAmount}` : `-${h.lossAmount}`}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {tab === "History" && (
//                 <div className="bg-white/3 rounded-xl p-2 shadow max-h-72 overflow-auto">
//                   <table className="w-full text-sm">
//                     <thead className="text-xs text-gray-400">
//                       <tr>
//                         <th>Period</th>
//                         <th>Num</th>
//                         <th>BS</th>
//                         <th>Color</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {history.map((h, i) => (
//                         <tr key={i} className="border-t text-center text-sm">
//                           <td>{new Date(h.period).toLocaleTimeString()}</td>
//                           <td>{h.number}</td>
//                           <td>{h.bigSmall}</td>
//                           <td>
//                             <span className={`inline-block w-3 h-3 rounded-full ${h.color.includes("red") ? "bg-red-500" : h.color.includes("green") ? "bg-green-500" : "bg-purple-500"}`}></span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {tab === "How To Play" && (
//                 <div className="bg-white/3 rounded-xl p-4 shadow max-h-72 overflow-auto text-sm text-gray-200 space-y-2">
//                   <ol className="list-decimal list-inside space-y-2">
//                     <li><strong className="text-green-300">Select green:</strong> hits 1,3,7,9 (2x) — 5 gives 1.5x</li>
//                     <li><strong className="text-red-400">Select red:</strong> hits 2,4,6,8 (2x) — 0 gives 1.5x</li>
//                     <li><strong className="text-violet-400">Select violet:</strong> 0 or 5 (4.5x)</li>
//                     <li><strong className="text-yellow-300">Select number:</strong> exact number (9x)</li>
//                     <li><strong className="text-blue-300">Big:</strong> 5-9 (2x) — <strong className="text-pink-300">Small:</strong> 0-4 (2x)</li>
//                   </ol>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Result popup */}
//           <AnimatePresence>
//             {resultPopup && (
//               <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
//                 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
//                 <div className="relative w-80 overflow-hidden rounded-3xl shadow-xl text-center border border-white/10 bg-gradient-to-b from-white/5 to-black/30">
//                   <div className="w-full p-6 pb-8 relative">
//                     <img src={`/color/${resultPopup.type === "win" ? "win" : "lose"}.webp`} alt={resultPopup.type} className="w-28 mx-auto drop-shadow-xl" />
//                     <h2 className="text-2xl font-bold text-white mt-3">{resultPopup.type === "win" ? "You Won!" : "You Lost"}</h2>
//                     <div className="bg-white/90 p-4 mt-4 rounded-b-3xl">
//                       <div className="flex items-center justify-center gap-2 text-sm">
//                         <span className="px-3 py-1 rounded-full bg-white border text-[#445] shadow">{resultPopup.round.color}</span>
//                         <span className="px-3 py-1 rounded-full bg-white border text-[#445] shadow">{resultPopup.round.number}</span>
//                         <span className="px-3 py-1 rounded-full bg-white border text-[#445] shadow">{resultPopup.round.bigSmall}</span>
//                       </div>
//                       <div className="mt-5 text-xl font-extrabold text-[#3c4c66]">{resultPopup.type === "win" ? "WIN" : "LOSE"}</div>
//                       <div className="mt-2 text-xs text-gray-600">Period: {resultPopup.round.period}</div>
//                       <p className="text-gray-500 text-xs mt-4">Auto-close in 3s</p>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Bet Modal */}
//           <AnimatePresence>
//             {showPopup && (
//               <BetModal
//                 selectedNumber={selectedNumber}
//                 selectedColor={selectedColor}
//                 selectedBigSmall={selectedBigSmall}
//                 betAmount={betAmount}
//                 setBetAmount={setBetAmount}
//                 balance={balance}
//                 onCancel={handleCancel}
//                 onConfirm={handleConfirmBet}
//                 quickChips={quickChips}
//               />
//             )}
//           </AnimatePresence>
//         </div>
//       </main>
//     </div>
//   );
// }

// // ------------------- BetModal -------------------
// function BetModal({
//   selectedNumber,
//   selectedColor,
//   selectedBigSmall,
//   betAmount,
//   setBetAmount,
//   balance,
//   onCancel,
//   onConfirm,
//   quickChips,
// }: {
//   selectedNumber: number | null;
//   selectedColor: string | null;
//   selectedBigSmall: "big" | "small" | null;
//   betAmount: number;
//   setBetAmount: (v: number) => void;
//   balance: number;
//   onCancel: () => void;
//   onConfirm: () => void;
//   quickChips: number[];
// }) {
//   return (
//     <>
//       {/* Backdrop */}
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} exit={{ opacity: 0 }} onClick={onCancel} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" />

//       {/* Popup */}
//       <motion.div
//         initial={{ y: 220, opacity: 0, scale: 0.98 }}
//         animate={{ y: 0, opacity: 1, scale: 1 }}
//         exit={{ y: 220, opacity: 0, scale: 0.98 }}
//         transition={{ type: "spring", stiffness: 300, damping: 25 }}
//         className="fixed bottom-0 left-0 w-full md:max-w-xl md:right-1/2 md:translate-x-1/2 bg-gradient-to-b from-[#061217] to-[#07121a] border-t border-white/6 rounded-t-3xl p-6 z-50"
//         role="dialog"
//         aria-modal="true"
//       >
//         <div className="text-center mb-4">
//           <div className="text-xs font-semibold text-gray-400 tracking-wide">WinGo</div>
//           <div className="text-2xl font-bold text-white mt-1">Confirm Bet</div>
//         </div>

//         <div className="flex items-center gap-3 mb-4 justify-center flex-wrap">
//           {selectedNumber !== null && (
//             <div className="flex items-center gap-2 bg-white/6 px-4 py-2 rounded-xl">
//               <img src={`/color/ball_${selectedNumber}.webp`} className="w-10 h-10 rounded-full" />
//               <div className="font-semibold text-white text-lg">{selectedNumber}</div>
//             </div>
//           )}
//           {selectedColor && (
//             <div className="flex items-center gap-2 bg-white/6 px-4 py-2 rounded-xl">
//               <div className={`w-5 h-5 rounded-full ${selectedColor === "red" ? "bg-red-500" : selectedColor === "green" ? "bg-green-500" : "bg-violet-500"}`} />
//               <div className="font-semibold text-white capitalize">{selectedColor}</div>
//             </div>
//           )}
//           {selectedBigSmall && (
//             <div className="flex items-center gap-2 bg-white/6 px-4 py-2 rounded-xl">
//               <div className="font-semibold text-white capitalize">{selectedBigSmall}</div>
//             </div>
//           )}
//         </div>

//         <div className="bg-black/30 border border-white/6 p-4 rounded-2xl mb-4">
//           <div className="flex items-center justify-between mb-3">
//             <div className="text-sm text-gray-300">Balance</div>
//             <div className="font-bold text-white">₹{balance}</div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="text-sm text-gray-300">Bet Amount</div>

//             <div className="flex items-center gap-3">
//               <button onClick={() => setBetAmount(Math.max(1, betAmount - 1))} className="w-9 h-9 bg-white/5 border border-white/6 text-gray-300 rounded-lg">-</button>
//               <input aria-label="bet amount" value={betAmount} onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value || 0)))} type="number" className="w-24 text-center bg-transparent text-xl font-bold" />
//               <button onClick={() => setBetAmount(betAmount + 1)} className="w-9 h-9 bg-white/5 border border-white/6 text-gray-300 rounded-lg">+</button>
//             </div>
//           </div>

//           <div className="flex gap-2 mt-4 flex-wrap">
//             {quickChips.map((v) => (
//               <button key={v} onClick={() => setBetAmount(v)} className="px-4 py-1 bg-white/5 border border-white/6 text-gray-300 rounded-lg text-sm hover:scale-105">{v}</button>
//             ))}
//           </div>
//         </div>

//         <div className="flex gap-3">
//           <button className="flex-1 py-3 rounded-xl bg-white/5 text-gray-300 border border-white/6 hover:bg-white/8" onClick={onCancel}>
//             Cancel
//           </button>

//           <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black font-bold shadow-[0_10px_30px_rgba(0,200,255,0.12)]" onClick={onConfirm}>
//             Confirm • ₹{betAmount}.00
//           </button>
//         </div>
//       </motion.div>
//     </>
//   );
// }
