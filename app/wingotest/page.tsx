
'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const DURATIONS = [30, 60, 180, 300];
const DUR_LABELS = ['30s', '1m', '3m', '5m'];
const NUMBERS = [0,1,2,3,4,5,6,7,8,9];

type Round = { period: number; number: number; color: string; bigSmall: 'big' | 'small' };

export default function WingoFull() {
  // core state
  const [durationIndex, setDurationIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATIONS[0]);
  const [history, setHistory] = useState<Round[]>([]);

  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedBigSmall, setSelectedBigSmall] = useState<'big'|'small'|null>(null);

  // popup + overlay
  const [showPopup, setShowPopup] = useState(false);

  // misc
  const [autoFollow, setAutoFollow] = useState(false);
  const followRef = useRef({ active: false, strategy: 'follow-last' });
  const [volume, setVolume] = useState(60);
  const [tab, setTab] = useState<'play'|'chart'|'history'|'strategy'>('play');
  const [lastBall, setLastBall] = useState(0);
  const ballControls = useAnimation();
  const [currentDraw, setCurrentDraw] = useState<Round|null>(null);

  // helpers
  function generateRound() {
    const n = Math.floor(Math.random() * 10);
    const color = n === 0 ? 'green' : n <= 4 ? 'red' : 'violet';
    const bs = n <= 4 ? 'small' : 'big';
    return { period: Date.now(), number: n, color, bigSmall: bs } as Round;
  }

  function playSound(type: 'win'|'lose'|'click'|'draw'){
    const path = `/sounds/${type}.mp3`;
    try{ const a = new Audio(path); a.volume = Math.max(0, Math.min(1, volume/100)); a.play().catch(()=>{}); }catch(e){}
  }

  useEffect(()=>{
    setTimeLeft(DURATIONS[durationIndex]);
    const iv = setInterval(()=>{
      setTimeLeft(prev=>{
        if(prev <= 1){
          const r = generateRound();
          animateBallAndCommit(r);
          return DURATIONS[durationIndex];
        }
        return prev - 1;
      });
    }, 1000);
    return ()=> clearInterval(iv);
  },[durationIndex]);

  async function animateBallAndCommit(r: Round){
    setCurrentDraw(null);

    await ballControls.start({ y: [-180, -40, 0], rotate: [0,360], opacity: [0,1,1], transition: { duration: 0.9, ease: 'circOut' } });
    await ballControls.start({ y: [0, -10, 0], transition: { duration: 0.4 } });

    setCurrentDraw(r);
    setHistory(h => [{...r}, ...h].slice(0,200));
    playSound('draw');

    resolveBets(r);
    if(autoFollow) runAutoFollowStrategy(r);
  }

  function resolveBets(r: Round){
    let net = 0;

    if(selectedNumber !== null){
      if(selectedNumber === r.number) net += betAmount * 9;
      else net -= betAmount;
    }

    if(selectedColor){
      if(selectedColor === r.color) net += betAmount * 2;
      else net -= betAmount;
    }

    if(selectedBigSmall){
      if(selectedBigSmall === r.bigSmall) net += betAmount * 1.5;
      else net -= betAmount;
    }

    setBalance(b => Math.max(0, b + net));

    if(net > 0) playSound('win');
    if(net < 0) playSound('lose');
  }

  function runAutoFollowStrategy(latest: Round){
    if(!autoFollow) return;
    const strategy = followRef.current.strategy;
    if(strategy === 'follow-last'){
      setSelectedColor(latest.color);
      setSelectedBigSmall(latest.bigSmall);
      const streak = countColorStreak(latest.color);
      if(streak >= 3){ setSelectedNumber(latest.number); setBetAmount(prev=>Math.min(500, Math.floor(prev * (1 + streak * 0.3)))); }
    }
  }

  function countColorStreak(color: string){
    let cnt = 0; for(const h of history){ if(h.color === color) cnt++; else break; } return cnt;
  }

  const chartData = useMemo(()=>history.slice(0,30).map(r=>r.number).reverse(),[history]);

  // open popup when user selects a bet via buttons
  function onSelectColor(color: string){ setSelectedColor(color); setSelectedNumber(null); setSelectedBigSmall(null); setShowPopup(true); playSound('click'); }
  function onSelectNumber(n:number){ setSelectedNumber(n); setSelectedColor(null); setSelectedBigSmall(null); setShowPopup(true); playSound('click'); }
  function onSelectBigSmall(bs:'big'|'small'){ setSelectedBigSmall(bs); setSelectedNumber(null); setSelectedColor(null); setShowPopup(true); playSound('click'); }

  function handleConfirmBet(){
    // simple local commit: deduct immediately then resolve next draw (or rely on resolveBets on draw)
    setBalance(b => Math.max(0, b - betAmount));
    setShowPopup(false);
    playSound('click');
  }

  function handleCancel(){ setShowPopup(false); }

  return (
    <div className="min-h-screen bg-[#101b22dd] p-4 flex flex-col items-center gap-4">
      
      {/* durations */}
      <div className="flex gap-3">
        {DUR_LABELS.map((lab,i)=> (
          <button key={lab} onClick={()=>setDurationIndex(i)} className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl border transition-all ${i===durationIndex? 'bg-orange-500 border-orange-600' : 'bg-white border-gray-300'}`}>
            <img src={`/color/${i===durationIndex? 'time_active' : 'time-inactive'}.webp`} alt={lab} className="w-10 h-10 object-contain" />
            <span className={`text-xs font-semibold mt-1 ${i===durationIndex? 'text-white' : 'text-gray-700'}`}>{lab}</span>
          </button>
        ))}
      </div>

      <div className="w-full max-w-3xl bg-[#1c2a38] rounded-2xl shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">

          {/* LEFT */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-400">Time remaining</div>
              <div className="text-xl font-bold">{timeLeft}s</div>
            </div>

            <div className="w-full h-44 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden" style={{ backgroundImage: `url('/color/bg.webp')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              {!currentDraw && <motion.div animate={{ y: 0 }} className="text-xs text-gray-200 absolute top-3 drop-shadow">Drawing soon...</motion.div>}

              <motion.img
  src={`/color/ball_${currentDraw?.number ?? lastBall}.webp`}
  animate={ballControls}
  style={{ width: 96, height: 96, borderRadius: 48, objectFit: 'cover' }}
  alt="ball"
/>


              {currentDraw && (
                <div className="absolute bottom-4 flex flex-col items-center gap-1">
                  <div className="px-3 py-1 rounded-full bg-white/90 text-black font-bold">{currentDraw.number}</div>
                  <div className="text-xs text-gray-200 drop-shadow">{currentDraw.color} • {currentDraw.bigSmall}</div>
                </div>
              )}
            </div>

            {/* bet selectors */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button onClick={()=>onSelectColor('green')} className={`py-2 rounded ${selectedColor==='green'? 'bg-green-300 text-white':'bg-green-600 text-white'}`}>Green</button>
              <button onClick={()=>onSelectColor('violet')} className={`py-2 rounded ${selectedColor==='violet'? 'bg-purple-300 text-white':'bg-purple-600 text-white'}`}>Violet</button>
              <button onClick={()=>onSelectColor('red')} className={`py-2 rounded ${selectedColor==='red'? 'bg-red-300 text-white':'bg-red-600 text-white'}`}>Red</button>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-3">
              {NUMBERS.map(n=> (
                <button key={n} onClick={()=>onSelectNumber(n)} className={`p-1 rounded-xl border-2 ${selectedNumber===n? 'border-yellow-400' : 'border-transparent'}`}>
                  <img src={`/color/ball_${n}.webp`} alt={`ball_${n}`} className="w-12 h-12 object-cover rounded-full" />
                </button>
              ))}
            </div>

            <div className="flex gap-2 items-center mb-3">
              <button onClick={()=>onSelectBigSmall('big')} className={`flex-1 py-2 rounded ${selectedBigSmall==='big'? 'bg-green-500 text-white':'bg-red-500 text-white'}`}>Big</button>
              <button onClick={()=>onSelectBigSmall('small')} className={`flex-1 py-2 rounded ${selectedBigSmall==='small'? 'bg-green-500 text-white':'bg-blue-500 text-white'}`}>Small</button>
            </div>

           
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-96">
  <div className="flex gap-2 mb-4 bg-[#0d1317] p-2 rounded-xl border border-[#1f2a33]">
    {['play','chart','history','strategy'].map(t => (
      <button
        key={t}
        onClick={() => setTab(t as any)}
        className={`
          flex-1 py-2 rounded-lg font-semibold capitalize transition
          ${tab === t 
            ? 'bg-[#00c46c] text-black shadow-[0_0_10px_#00c46c]'
            : 'bg-[#111b21] text-gray-300 border border-[#1f2a33] hover:bg-[#162229]'
          }
        `}
      >
        {t}
      </button>
    ))}
  </div>



            {tab==='chart' && (
              <div className="bg-white rounded p-3 shadow">
                <h3 className="font-semibold mb-2">Last numbers (sparkline)</h3>
                <Sparkline numbers={chartData} />
                <div className="text-xs text-gray-500 mt-2">Shows last 30 round numbers (0–9)</div>
              </div>
            )}

            {tab==='history' && (
              <div className="bg-white rounded p-2 shadow max-h-72 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-500">
                    <tr><th>Period</th><th>Num</th><th>BS</th><th>Color</th></tr>
                  </thead>
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

            {tab==='strategy' && (
              <div className="bg-white rounded p-3 shadow">
                <h3 className="font-semibold mb-2">Auto-follow strategy</h3>
                <div className="text-sm mb-2">Choose a simple bot to follow recent results.</div>
                <div className="flex gap-2 mb-2">
                  <button onClick={()=>followRef.current.strategy = 'follow-last'} className="px-2 py-1 border rounded">Follow Last</button>
                  <button onClick={()=>followRef.current.strategy = 'reverse-last'} className="px-2 py-1 border rounded">Reverse Last</button>
                </div>
                <div className="text-xs text-gray-600 mb-2">Bot will auto-select color / big-small and increase bet slightly on streaks.</div>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Volume</label>
                  <input type="range" min={0} max={100} value={volume} onChange={(e)=>setVolume(Number(e.target.value))} />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* OVERLAY + POPUP */}
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

// NOTE: The UI uses local assets under /color and /sounds. You uploaded an image that was used as reference; its local path is:
// /mnt/data/c9ae232c-92f5-4339-846f-4e7d421f11fe.jpg
// You can use that path to preview or compare in your environment.
