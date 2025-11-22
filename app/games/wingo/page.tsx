'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import TopNavbar from "@/components/topnavbar";
import { apiRequest } from '@/utils/ApiHelper';
import { AnimatePresence } from "framer-motion";

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
  const [tab, setTab] = useState<'play'|'chart'|'history'|'strategy'>('play');
  const [lastBall, setLastBall] = useState(0);
  const ballControls = useAnimation();
  const [currentDraw, setCurrentDraw] = useState<Round|null>(null);
  const [search, setSearch] = useState("");
  const [confirmedBet, setConfirmedBet] = useState({
    number: null as number|null,
    color: null as string|null,
    bigSmall: null as 'big'|'small'|null,
    amount: 0
  });
  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resultPopup, setResultPopup] = useState<null | {type:'win'|'lose', round: Round}>(null);

  // Betting locked in last 5 seconds
  const bettingLocked = timeLeft <= 5;

  function generateRound(): Round {
    const n = Math.floor(Math.random() * 10);
    const color = n === 0 ? 'green' : n <= 4 ? 'red' : 'violet';
    const bs = (n <= 4 ? 'small' : 'big') as 'big' | 'small';
    return { period: Date.now(), number: n, color, bigSmall: bs };
  }

  function playSound(type: 'win'|'lose'|'click'|'draw'){
    const path = `/sounds/${type}.mp3`;
    try{ const a = new Audio(path); a.volume = Math.max(0, Math.min(1, volume/100)); a.play().catch(()=>{}); }catch(e){}
  }

  // Dashboard fetch
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
          if (res.success) setDashboardDetails(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
      };
      fetchDashboardDetails();
  }, []);

  // Timer
  useEffect(()=>{
    setTimeLeft(DURATIONS[durationIndex]);
    const iv = setInterval(()=>{
      setTimeLeft(prev=>{
        if(prev <= 1){
          const r = generateRound();
          animateBallAndCommit(r, confirmedBet); // ✅ pass bet directly
          return DURATIONS[durationIndex];
        }
        return prev - 1;
      });
    },1000);
    return ()=>clearInterval(iv);
  },[durationIndex, confirmedBet]);

  async function animateBallAndCommit(r: Round, bet = confirmedBet){
    setCurrentDraw(null);
    await ballControls.start({ y: [-180,-40,0], rotate:[0,360], opacity:[0,1,1], transition:{ duration:0.9, ease:'circOut' } });
    await ballControls.start({ y:[0,-10,0], transition:{ duration:0.4 } });
    setCurrentDraw(r);
    setHistory(h => [{...r}, ...h].slice(0,200));
    playSound('draw');
    resolveBets(r, bet); // ✅ pass bet here
  }

  function resolveBets(r: Round, bet = confirmedBet) {
    let net = 0;

    if(bet.amount <= 0){
      console.log("NO BET — no confirmed bet stored");
      return;
    }

    if(bet.number !== null) net += bet.number === r.number ? bet.amount*9 : -bet.amount;
    if(bet.color) net += bet.color === r.color ? bet.amount*2 : -bet.amount;
    if(bet.bigSmall) net += bet.bigSmall === r.bigSmall ? bet.amount*2 : -bet.amount;

    setBalance(b => b + net);

    if(net > 0){ setResultPopup({ type:'win', round:r }); playSound('win'); }
    else if(net < 0){ setResultPopup({ type:'lose', round:r }); playSound('lose'); }
    if(net !== 0) setTimeout(()=>setResultPopup(null), 3000);

    // ✅ reset confirmed bet after settlement
    setConfirmedBet({ number:null, color:null, bigSmall:null, amount:0 });
  }

  // Selection
  function onSelectColor(c:string){ if(bettingLocked) return; setSelectedColor(c); setSelectedNumber(null); setSelectedBigSmall(null); setShowPopup(true); playSound('click'); }
  function onSelectNumber(n:number){ if(bettingLocked) return; setSelectedNumber(n); setSelectedColor(null); setSelectedBigSmall(null); setShowPopup(true); playSound('click'); }
  function onSelectBigSmall(bs:'big'|'small'){ if(bettingLocked) return; setSelectedBigSmall(bs); setSelectedNumber(null); setSelectedColor(null); setShowPopup(true); playSound('click'); }

 function handleConfirmBet(){
  if(bettingLocked) return;

  const newBet = {
    number: selectedNumber,
    color: selectedColor,
    bigSmall: selectedBigSmall,
    amount: betAmount
  };

  // ✅ log the confirmed bet
  console.log("CONFIRMED BET:", newBet);

  // Save the bet for next draw
  setConfirmedBet(newBet);

  // Deduct money
  setBalance(b => Math.max(0, b - betAmount));

  // Close popup and play sound
  setShowPopup(false);
  playSound('click');
}


  function handleCancel(){ setShowPopup(false); }

  const chartData = useMemo(()=>history.slice(0,30).map(r=>r.number).reverse(),[history]);

  // ------------------- JSX -------------------
  return (
    <div className="flex min-h-screen bg-[#1a2c38] text-white overflow-x-hidden relative flex-col">
      <TopNavbar searchValue={search} onSearchChange={setSearch} wallets={dashboardDetails?.wallets || []}/>

      <div className="min-h-screen bg-[#101b22dd] p-4 flex flex-col items-center gap-4">
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
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-400">Time remaining</div>
                <div className="text-xl font-bold">{timeLeft}s</div>
              </div>
              <div className="w-full h-44 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden"
                   style={{ backgroundImage:`url('/color/bg.webp')`, backgroundSize:'cover', backgroundPosition:'center' }}>

                {timeLeft<=5 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30 rounded-xl">
                    <div className="flex gap-3">
                      <div className="bg-white text-amber-600 font-extrabold text-7xl rounded-2xl px-6 py-3 shadow-xl">{timeLeft}</div>
                    </div>
                  </div>
                )}

                <motion.img src={`/color/ball_${currentDraw?.number ?? lastBall}.webp`} animate={ballControls} style={{ width:96, height:96, borderRadius:48, objectFit:'cover' }} />

                {currentDraw && (
                  <div className="absolute bottom-4 flex flex-col items-center gap-1">
                    <div className="px-3 py-1 rounded-full bg-white/90 text-black font-bold">{currentDraw.number}</div>
                    <div className="text-xs text-gray-200 drop-shadow">{currentDraw.color} • {currentDraw.bigSmall}</div>
                  </div>
                )}
              </div>

              {/* COLOR BUTTONS */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button disabled={bettingLocked} onClick={()=>onSelectColor('green')} className={`py-2 rounded ${bettingLocked?'opacity-50':'bg-green-600 text-white'}`}>Green</button>
                <button disabled={bettingLocked} onClick={()=>onSelectColor('violet')} className={`py-2 rounded ${bettingLocked?'opacity-50':'bg-purple-600 text-white'}`}>Violet</button>
                <button disabled={bettingLocked} onClick={()=>onSelectColor('red')} className={`py-2 rounded ${bettingLocked?'opacity-50':'bg-red-600 text-white'}`}>Red</button>
              </div>

              {/* NUMBERS */}
              <div className="grid grid-cols-5 gap-2 mb-3">
                {NUMBERS.map(n=>(
                  <button key={n} disabled={bettingLocked} onClick={()=>onSelectNumber(n)} className={`p-1 rounded-xl border-2 ${bettingLocked?'opacity-40':'border-transparent'}`}>
                    <img src={`/color/ball_${n}.webp`} className="w-12 h-12 rounded-full"/>
                  </button>
                ))}
              </div>

              {/* BIG/SMALL */}
              <div className="flex gap-2 items-center mb-3">
                <button disabled={bettingLocked} onClick={()=>onSelectBigSmall('big')} className={`flex-1 py-2 rounded ${bettingLocked?'opacity-40':'bg-green-500 text-white'}`}>Big</button>
                <button disabled={bettingLocked} onClick={()=>onSelectBigSmall('small')} className={`flex-1 py-2 rounded ${bettingLocked?'opacity-40':'bg-blue-500 text-white'}`}>Small</button>
              </div>
            </div>

            {/* RIGHT SIDE TAB */}
            <div className="w-full md:w-96">
              <div className="flex gap-2 mb-4 bg-[#0d1317] p-2 rounded-xl border border-[#1f2a33]">
                {['play','chart','history','strategy'].map(t=>(
                  <button key={t} onClick={()=>setTab(t as any)} className={`flex-1 py-2 rounded-lg font-semibold capitalize transition ${tab===t?'bg-[#00c46c] text-black shadow-[0_0_10px_#00c46c]':'bg-[#111b21] text-gray-300 border border-[#1f2a33] hover:bg-[#162229]'}`}>
                    {t}
                  </button>
                ))}
              </div>

              {tab==='chart' && <Sparkline numbers={chartData} />}
              {tab==='history' && (
                <div className="bg-white rounded p-2 shadow max-h-72 overflow-auto">
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
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showPopup && (
            <BetModal
              selectedNumber={selectedNumber}
              selectedColor={selectedColor}
              selectedBigSmall={selectedBigSmall}
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              balance={balance}
              onCancel={handleCancel}
              onConfirm={handleConfirmBet}
            />
          )}
        </AnimatePresence>

       <AnimatePresence>
  {resultPopup && (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Background Blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Popup */}
      <div className="relative w-80 overflow-hidden rounded-3xl shadow-xl text-center border border-white/20">

        {/* Dynamic Header BG */}
        <div
          className="w-full p-6 pb-10 relative"
          style={{
            backgroundImage: `url('/color/${
              resultPopup.type === "win" ? "win.webp" : "lose.webp"
            }')`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          {/* Win/Lose Image */}
          <img
            src={`/color/${resultPopup.type === "win" ? "win.webp" : "lose.webp"}`}
            className="w-28 mx-auto drop-shadow-xl"
          />

          <h2 className="text-2xl font-bold text-white mt-3 drop-shadow">
            {resultPopup.type === "win" ? "Congratulations!" : "Sorry"}
          </h2>
        </div>

        {/* Body */}
        <div className="bg-[#e6f0ff] p-6 pt-8 rounded-b-3xl">

          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-white border text-[#445] shadow">
              {resultPopup.round.color}
            </span>

            <span className="px-3 py-1 rounded-full bg-white border text-[#445] shadow">
              {resultPopup.round.number}
            </span>

            <span className="px-3 py-1 rounded-full bg-white border text-[#445] shadow">
              {resultPopup.round.bigSmall}
            </span>
          </div>

          <div className="mt-5 text-xl font-extrabold text-[#3c4c66]">
            {resultPopup.type === "win" ? "WIN" : "LOSE"}
          </div>

          <div className="mt-2 text-xs text-gray-600">
            Period: {resultPopup.round.period}
          </div>

          <p className="text-gray-500 text-xs mt-4">3 seconds auto close</p>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>




      </div>
    </div>
  );
}




// ------------------- BetModal (overlay + popup) -------------------
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
          <div
            className={`w-5 h-5 rounded-full shadow-md ${
              selectedColor === "red"
                ? "bg-red-500"
                : selectedColor === "green"
                ? "bg-green-500"
                : "bg-indigo-500"
            }`}
          />
          <div className="font-semibold text-white capitalize">{selectedColor}</div>
        </div>
      )}

      {selectedBigSmall && (
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
          <div className="font-semibold text-white capitalize">{selectedBigSmall}</div>
        </div>
      )}
    </div>

    {/* Balance & Input Card */}
    <div className="bg-[#121A1F] border border-[#1f2a33] p-4 rounded-2xl mb-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-400">Balance</div>
        <div className="font-bold text-white">{balance}</div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">Bet Amount</div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setBetAmount(Math.max(1, betAmount - 1))}
            className="w-9 h-9 bg-[#0f181d] border border-[#24333d] text-gray-300 rounded-lg hover:bg-[#162229] transition"
          >
            -
          </button>

          <div className="text-xl font-bold text-white">{betAmount}</div>

          <button
            onClick={() => setBetAmount(betAmount + 1)}
            className="w-9 h-9 bg-[#0f181d] border border-[#24333d] text-gray-300 rounded-lg hover:bg-[#162229] transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="flex gap-2 mt-4 flex-wrap">
        {[10, 20, 50, 100, 200].map((v) => (
          <button
            key={v}
            onClick={() => setBetAmount(v)}
            className="px-4 py-1 bg-[#0f181d] border border-[#24333d] text-gray-300 rounded-lg text-sm hover:bg-[#162229] transition"
          >
            {v}
          </button>
        ))}
      </div>
    </div>

    {/* Buttons */}
    <div className="flex gap-3">
      <button className="flex-1 py-3 rounded-xl bg-[#1a252c] text-gray-300 border border-[#24333d] hover:bg-[#1f2e36] transition" onClick={onCancel}>
        Cancel
      </button>

      <button
        className="flex-1 py-3 rounded-xl bg-[#00c46c] text-[#001a10] font-bold shadow-[0_0_12px_#00c46c] hover:bg-[#00d778] transition"
        onClick={onConfirm}
      >
        Total ₹{betAmount}.00
      </button>
    </div>

  


  </motion.div>
</>

  );
}

// ------------------- Sparkline -------------------
function Sparkline({ numbers }:{ numbers:number[] }){
  const w = 260; const h = 80; const max = 9; const min = 0;
  if(numbers.length === 0) return <div className="h-20 flex items-center justify-center text-sm text-gray-400">No data yet</div>;
  const points = numbers.map((n,i)=>{ const x = (i/(numbers.length-1))*(w-10)+5; const y = h - ((n-min)/(max-min))*(h-10) -5; return `${x},${y}` }).join(' ');
  return (<svg width={w} height={h} className="rounded"><polyline fill="none" stroke="#0ea5a4" strokeWidth={2} points={points} /></svg>);
}


