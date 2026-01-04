// // // "use client";
// // // import React, { useState, useEffect, useRef } from 'react';
// // // import { TrendingUp } from 'lucide-react';

// // // const multipliers = [1.36, 1.42, 4.87, 2.35, 1.38, 1.28, 6.55, 1.04, 1.52, 0.00, 9.77, 2.68];

// // // export default function CrashSlideGame() {
// // //   const [betAmount, setBetAmount] = useState('0.00');
// // //   const [targetMultiplier, setTargetMultiplier] = useState('2.00');
// // //   const [isPlaying, setIsPlaying] = useState(false);
// // //   const [currentMultiplier, setCurrentMultiplier] = useState(0);
// // //   const [gameResult, setGameResult] = useState<'win' | 'loss' | null>(null);
// // //   const [balance, setBalance] = useState(36.18);
// // //   const [nextRound, setNextRound] = useState(16);
// // //   const [activeBets, setActiveBets] = useState(93);
// // //   const [history, setHistory] = useState(multipliers);
// // //   const [ballPosition, setBallPosition] = useState(50);
// // //   const intervalRef = useRef<NodeJS.Timeout | null>(null);

// // //   useEffect(() => {
// // //     if (nextRound > 0 && !isPlaying) {
// // //       const timer = setTimeout(() => setNextRound(prev => prev - 1), 1000);
// // //       return () => clearTimeout(timer);
// // //     } else if (nextRound === 0 && !isPlaying) {
// // //       setNextRound(16);
// // //     }
// // //   }, [nextRound, isPlaying]);

// // //   const generateCrashPoint = () => {
// // //     const rand = Math.random();
// // //     if (rand < 0.1) return 0;
// // //     if (rand < 0.3) return parseFloat((1 + Math.random() * 0.5).toFixed(2));
// // //     if (rand < 0.6) return parseFloat((1.5 + Math.random() * 2).toFixed(2));
// // //     if (rand < 0.85) return parseFloat((3 + Math.random() * 5).toFixed(2));
// // //     return parseFloat((8 + Math.random() * 12).toFixed(2));
// // //   };

// // //   const startGame = () => {
// // //     const bet = parseFloat(betAmount);
// // //     const target = parseFloat(targetMultiplier);

// // //     if (bet <= 0 || bet > balance) return;
// // //     if (isPlaying) return;

// // //     setBalance(prev => prev - bet);
// // //     setIsPlaying(true);
// // //     setGameResult(null);
// // //     setCurrentMultiplier(1.0);
// // //     setBallPosition(0);

// // //     const crashPoint = generateCrashPoint();
// // //     const duration = crashPoint === 0 ? 500 : Math.min(crashPoint * 800, 8000);
// // //     const steps = 60;
// // //     const increment = crashPoint / steps;
// // //     let step = 0;

// // //     intervalRef.current = setInterval(() => {
// // //       step++;
// // //       const progress = step / steps;
// // //       const newMultiplier = parseFloat((1.0 + increment * step).toFixed(2));
// // //       setCurrentMultiplier(newMultiplier);
// // //       setBallPosition(progress * 100);

// // //       if (newMultiplier >= target && newMultiplier <= crashPoint) {
// // //         clearInterval(intervalRef.current!);
// // //         setGameResult('win');
// // //         setBalance(prev => prev + bet * target);
// // //         setIsPlaying(false);
// // //         setHistory(prev => [target, ...prev.slice(0, 11)]);
// // //         setTimeout(() => {
// // //           setBallPosition(50);
// // //           setCurrentMultiplier(0);
// // //         }, 2000);
// // //       } else if (newMultiplier >= crashPoint || step >= steps) {
// // //         clearInterval(intervalRef.current!);
// // //         setGameResult('loss');
// // //         setIsPlaying(false);
// // //         setHistory(prev => [crashPoint, ...prev.slice(0, 11)]);
// // //         setTimeout(() => {
// // //           setBallPosition(50);
// // //           setCurrentMultiplier(0);
// // //         }, 2000);
// // //       }
// // //     }, duration / steps);
// // //   };

// // //   const getMultiplierColor = (mult: number) => {
// // //     if (mult === 0) return 'bg-red-600';
// // //     if (mult < 2) return 'bg-gray-600';
// // //     if (mult < 5) return 'bg-blue-500';
// // //     if (mult < 10) return 'bg-purple-500';
// // //     return 'bg-yellow-500';
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
// // //       <div className="max-w-7xl mx-auto">
// // //         {/* Header */}
// // //         <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
// // //           {history.map((mult, idx) => (
// // //             <button
// // //               key={idx}
// // //               className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap ${
// // //                 idx === 0 ? 'ring-2 ring-blue-400' : ''
// // //               } ${getMultiplierColor(mult)}`}
// // //             >
// // //               {mult.toFixed(2)}×
// // //             </button>
// // //           ))}
// // //         </div>

// // //         <div className="grid lg:grid-cols-[350px_1fr] gap-6">
// // //           {/* Left Panel */}
// // //           <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 space-y-4">
// // //             <div className="flex gap-2">
// // //               <button className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg font-semibold">
// // //                 Manual
// // //               </button>
// // //               <button className="flex-1 bg-slate-900/50 hover:bg-slate-700 py-2 rounded-lg font-semibold">
// // //                 Auto
// // //               </button>
// // //             </div>

// // //             <div>
// // //               <label className="text-sm text-gray-400 mb-2 block">Bet Amount</label>
// // //               <div className="bg-slate-900/50 rounded-lg p-3 flex items-center justify-between">
// // //                 <input
// // //                   type="text"
// // //                   value={betAmount}
// // //                   onChange={(e) => setBetAmount(e.target.value)}
// // //                   className="bg-transparent text-xl font-bold outline-none w-24"
// // //                   disabled={isPlaying}
// // //                 />
// // //                 <span className="text-gray-400">BTC</span>
// // //               </div>
// // //               <div className="flex gap-2 mt-2">
// // //                 <button
// // //                   onClick={() => setBetAmount(prev => (parseFloat(prev) / 2).toFixed(8))}
// // //                   className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded text-sm"
// // //                   disabled={isPlaying}
// // //                 >
// // //                   ½
// // //                 </button>
// // //                 <button
// // //                   onClick={() => setBetAmount(prev => (parseFloat(prev) * 2).toFixed(8))}
// // //                   className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded text-sm"
// // //                   disabled={isPlaying}
// // //                 >
// // //                   2×
// // //                 </button>
// // //               </div>
// // //             </div>

// // //             <div>
// // //               <label className="text-sm text-gray-400 mb-2 block">Target Multiplier</label>
// // //               <input
// // //                 type="number"
// // //                 value={targetMultiplier}
// // //                 onChange={(e) => setTargetMultiplier(e.target.value)}
// // //                 className="w-full bg-slate-900/50 rounded-lg p-3 text-xl font-bold outline-none"
// // //                 step="0.01"
// // //                 disabled={isPlaying}
// // //               />
// // //             </div>

// // //             <button
// // //               onClick={startGame}
// // //               disabled={isPlaying || parseFloat(betAmount) <= 0}
// // //               className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
// // //                 isPlaying
// // //                   ? 'bg-gray-600 cursor-not-allowed'
// // //                   : 'bg-green-500 hover:bg-green-600 active:scale-95'
// // //               }`}
// // //             >
// // //               {isPlaying ? 'Playing...' : 'Bet'}
// // //             </button>

// // //             <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
// // //               <div className="flex items-center gap-2">
// // //                 <TrendingUp size={20} className="text-orange-500" />
// // //                 <span className="text-gray-400">{activeBets}</span>
// // //               </div>
// // //               <div className="flex items-center gap-2">
// // //                 <span className="text-orange-500 text-xl">₿</span>
// // //                 <span className="font-bold">${balance.toFixed(2)}</span>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Game Area */}
// // //           <div className="bg-slate-800/30 backdrop-blur rounded-xl p-8 relative overflow-hidden">
// // //             <div className="relative h-96">
// // //               {/* Multiplier Boxes */}
// // //               <div className="absolute inset-0 flex items-end justify-center gap-4">
// // //                 {[2.24, 1.20, 1.75, 2.68, 3.16, 1.35, 18.76].map((mult, idx) => (
// // //                   <div key={idx} className="flex flex-col items-center gap-2">
// // //                     <div
// // //                       className={`w-20 h-20 rounded-lg border-2 flex items-center justify-center font-bold ${
// // //                         idx === 3 ? 'border-white bg-slate-700/50' : 'border-slate-600 bg-slate-800/30'
// // //                       }`}
// // //                     >
// // //                       {mult.toFixed(2)}×
// // //                     </div>
// // //                     <div
// // //                       className={`w-20 h-32 rounded ${
// // //                         idx === 3 ? 'bg-slate-600' : idx === 6 ? 'bg-yellow-700' : 'bg-slate-700'
// // //                       }`}
// // //                     />
// // //                   </div>
// // //                 ))}
// // //               </div>

// // //               {/* Ball */}
// // //               <div
// // //                 className="absolute top-0 transition-all duration-100"
// // //                 style={{ left: `${ballPosition}%`, transform: 'translateX(-50%)' }}
// // //               >
// // //                 <div className="w-8 h-8 bg-white rounded-full shadow-lg" />
// // //               </div>

// // //               {/* Current Multiplier Display */}
// // //               {isPlaying && (
// // //                 <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
// // //                   <div className="text-6xl font-bold text-green-400 animate-pulse">
// // //                     {currentMultiplier.toFixed(2)}×
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               {/* Result Display */}
// // //               {gameResult && (
// // //                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
// // //                   <div
// // //                     className={`text-6xl font-bold ${
// // //                       gameResult === 'win' ? 'text-green-400' : 'text-red-400'
// // //                     }`}
// // //                   >
// // //                     {gameResult === 'win' ? 'WIN!' : 'CRASHED!'}
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>

// // //             {/* Footer */}
// // //             <div className="flex items-center justify-between mt-8">
// // //               <div className="flex items-center gap-2">
// // //                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
// // //                 <span className="text-gray-400">Bets: {activeBets}</span>
// // //               </div>
// // //               <div className="text-gray-400">Next round in: {nextRound}s</div>
// // //             </div>

// // //             {/* Progress Bar */}
// // //             <div className="mt-4 bg-slate-700 h-2 rounded-full overflow-hidden">
// // //               <div
// // //                 className="bg-blue-500 h-full transition-all duration-1000"
// // //                 style={{ width: `${((16 - nextRound) / 16) * 100}%` }}
// // //               />
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // "use client";
// // import React, { useState, useEffect, useRef } from 'react';
// // import { Users } from 'lucide-react';

// // const historyMultipliers = [1.36, 1.42, 4.87, 2.35, 1.38, 1.28, 6.55, 1.04, 1.52, 0.00, 9.77, 2.68];

// // const slideMultipliers = [
// //   { value: 2.24, color: 'bg-slate-700' },
// //   { value: 1.20, color: 'bg-slate-700' },
// //   { value: 1.75, color: 'bg-slate-700' },
// //   { value: 2.68, color: 'bg-slate-600' },
// //   { value: 3.16, color: 'bg-slate-700' },
// //   { value: 1.35, color: 'bg-slate-700' },
// //   { value: 18.76, color: 'bg-yellow-700' },
// // ];

// // export default function CrashSlideGame() {
// //   const [betAmount, setBetAmount] = useState('0.00');
// //   const [targetMultiplier, setTargetMultiplier] = useState('2.00');
// //   const [isPlaying, setIsPlaying] = useState(false);
// //   const [isSliding, setIsSliding] = useState(false);
// //   const [ballPosition, setBallPosition] = useState(0);
// //   const [resultIndex, setResultIndex] = useState<number | null>(null);
// //   const [gameResult, setGameResult] = useState<'win' | 'loss' | null>(null);
// //   const [balance, setBalance] = useState(36.18);
// //   const [nextRound, setNextRound] = useState(16);
// //   const [activeBets] = useState(93);
// //   const [history, setHistory] = useState(historyMultipliers);
// //   const [showResult, setShowResult] = useState(false);
// //   const slideRef = useRef<HTMLDivElement>(null);

// //   useEffect(() => {
// //     if (nextRound > 0 && !isPlaying) {
// //       const timer = setTimeout(() => setNextRound(prev => prev - 1), 1000);
// //       return () => clearTimeout(timer);
// //     } else if (nextRound === 0 && !isPlaying) {
// //       setNextRound(16);
// //     }
// //   }, [nextRound, isPlaying]);

// //   const startGame = () => {
// //     const bet = parseFloat(betAmount);
// //     const target = parseFloat(targetMultiplier);

// //     if (bet <= 0 || bet > balance) return;
// //     if (isPlaying) return;

// //     setBalance(prev => prev - bet);
// //     setIsPlaying(true);
// //     setIsSliding(true);
// //     setGameResult(null);
// //     setShowResult(false);
// //     setBallPosition(0);
// //     setResultIndex(null);

// //     // Random result index
// //     const result = Math.floor(Math.random() * slideMultipliers.length);
// //     const resultMultiplier = slideMultipliers[result].value;

// //     // Calculate slide distance
// //     const slideWidth = slideRef.current?.offsetWidth || 1000;
// //     const boxWidth = slideWidth / slideMultipliers.length;
// //     const targetPosition = result * boxWidth + boxWidth / 2;

// //     // Animate the ball sliding
// //     let startTime: number | null = null;
// //     const duration = 3000; // 3 seconds slide animation
// //     const extraSlides = 2; // Number of extra full slides before stopping
// //     const totalDistance = slideWidth * extraSlides + targetPosition;

// //     const animate = (currentTime: number) => {
// //       if (!startTime) startTime = currentTime;
// //       const elapsed = currentTime - startTime;
// //       const progress = Math.min(elapsed / duration, 1);

// //       // Easing function for smooth deceleration
// //       const easeOutQuart = 1 - Math.pow(1 - progress, 4);
// //       const currentPosition = totalDistance * easeOutQuart;
      
// //       setBallPosition(currentPosition % slideWidth);

// //       if (progress < 1) {
// //         requestAnimationFrame(animate);
// //       } else {
// //         // Animation complete
// //         setIsSliding(false);
// //         setResultIndex(result);
// //         setShowResult(true);

// //         // Check win/loss
// //         if (resultMultiplier >= target) {
// //           setGameResult('win');
// //           setBalance(prev => prev + bet * resultMultiplier);
// //         } else {
// //           setGameResult('loss');
// //         }

// //         setHistory(prev => [resultMultiplier, ...prev.slice(0, 11)]);

// //         // Reset after showing result
// //         setTimeout(() => {
// //           setIsPlaying(false);
// //           setShowResult(false);
// //           setResultIndex(null);
// //           setBallPosition(0);
// //         }, 3000);
// //       }
// //     };

// //     requestAnimationFrame(animate);
// //   };

// //   const getHistoryColor = (mult: number) => {
// //     if (mult === 0) return 'bg-slate-700';
// //     if (mult < 2) return 'bg-slate-700';
// //     if (mult < 5) return 'bg-blue-500';
// //     if (mult < 10) return 'bg-purple-500';
// //     return 'bg-yellow-500';
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header History */}
// //         <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
// //           {history.map((mult, idx) => (
// //             <button
// //               key={idx}
// //               className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
// //                 idx === 0 ? 'ring-2 ring-blue-400 scale-110' : ''
// //               } ${getHistoryColor(mult)}`}
// //             >
// //               {mult.toFixed(2)}×
// //             </button>
// //           ))}
// //         </div>

// //         <div className="grid lg:grid-cols-[320px_1fr] gap-6">
// //           {/* Left Panel */}
// //           <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 space-y-4 h-fit">
// //             <div className="flex gap-2">
// //               <button className="flex-1 bg-slate-700 hover:bg-slate-600 py-2.5 rounded-lg font-semibold transition-colors">
// //                 Manual
// //               </button>
// //               <button className="flex-1 bg-slate-900/50 hover:bg-slate-700 py-2.5 rounded-lg font-semibold transition-colors">
// //                 Auto
// //               </button>
// //             </div>

// //             <div>
// //               <label className="text-sm text-gray-400 mb-2 block">Bet Amount</label>
// //               <div className="bg-slate-900/50 rounded-lg p-3 flex items-center justify-between">
// //                 <input
// //                   type="text"
// //                   value={betAmount}
// //                   onChange={(e) => setBetAmount(e.target.value)}
// //                   className="bg-transparent text-xl font-bold outline-none w-full"
// //                   disabled={isPlaying}
// //                   placeholder="0.00"
// //                 />
// //                 <span className="text-gray-400 text-sm ml-2">BTC</span>
// //               </div>
// //               <div className="flex gap-2 mt-2">
// //                 <button className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors">
// //                   <span className="text-lg">➕</span>
// //                 </button>
// //                 <button
// //                   onClick={() => setBetAmount(prev => (parseFloat(prev || '0') / 2).toFixed(8))}
// //                   className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-sm font-semibold transition-colors"
// //                   disabled={isPlaying}
// //                 >
// //                   ½
// //                 </button>
// //                 <button
// //                   onClick={() => setBetAmount(prev => (parseFloat(prev || '0') * 2).toFixed(8))}
// //                   className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-sm font-semibold transition-colors"
// //                   disabled={isPlaying}
// //                 >
// //                   2×
// //                 </button>
// //               </div>
// //             </div>

// //             <div>
// //               <label className="text-sm text-gray-400 mb-2 block">Target Multiplier</label>
// //               <div className="relative">
// //                 <input
// //                   type="number"
// //                   value={targetMultiplier}
// //                   onChange={(e) => setTargetMultiplier(e.target.value)}
// //                   className="w-full bg-slate-900/50 rounded-lg p-3 pr-8 text-xl font-bold outline-none"
// //                   step="0.01"
// //                   disabled={isPlaying}
// //                 />
// //                 <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
// //                   ✕
// //                 </button>
// //               </div>
// //             </div>

// //             <button
// //               onClick={startGame}
// //               disabled={isPlaying || parseFloat(betAmount || '0') <= 0}
// //               className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
// //                 isPlaying
// //                   ? 'bg-gray-600 cursor-not-allowed'
// //                   : 'bg-green-500 hover:bg-green-600 active:scale-95'
// //               }`}
// //             >
// //               {isPlaying ? 'Playing...' : 'Bet'}
// //             </button>

// //             <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
// //               <div className="flex items-center gap-2">
// //                 <Users size={18} className="text-white" />
// //                 <span className="text-sm">{activeBets}</span>
// //               </div>
// //               <div className="flex items-center gap-2">
// //                 <span className="text-orange-500 text-xl">₿</span>
// //                 <span className="font-bold">${balance.toFixed(2)}</span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Game Area */}
// //           <div className="bg-slate-800/30 backdrop-blur rounded-xl p-8 relative overflow-hidden">
// //             {/* Slide Container */}
// //             <div className="relative h-96 overflow-hidden" ref={slideRef}>
// //               {/* Pointer Arrow at top center */}
// //               <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
// //                 <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
// //               </div>

// //               {/* Sliding multiplier boxes */}
// //               <div className="absolute top-20 left-0 right-0 flex items-start justify-center">
// //                 <div 
// //                   className="flex gap-4 transition-none"
// //                   style={{ 
// //                     transform: `translateX(calc(50% - ${ballPosition}px - 60px))`,
// //                   }}
// //                 >
// //                   {slideMultipliers.map((mult, idx) => (
// //                     <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0">
// //                       {/* Hexagon box */}
// //                       <div
// //                         className={`w-24 h-24 flex items-center justify-center font-bold text-lg relative transition-all duration-300 ${
// //                           resultIndex === idx && showResult
// //                             ? 'border-4 border-white shadow-lg shadow-white/50 scale-110'
// //                             : 'border-2 border-slate-600'
// //                         } ${mult.color}`}
// //                         style={{
// //                           clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
// //                         }}
// //                       >
// //                         <span className="text-white">{mult.value.toFixed(2)}×</span>
// //                       </div>
                      
// //                       {/* Bar below */}
// //                       <div className={`w-24 h-32 rounded ${mult.color}`}></div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Ball/Pointer at center */}
// //               <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10">
// //                 <div className="w-6 h-6 bg-white rounded-full shadow-lg"></div>
// //               </div>

// //               {/* Result Display */}
// //               {showResult && gameResult && (
// //                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
// //                   <div
// //                     className={`text-6xl font-bold animate-pulse ${
// //                       gameResult === 'win' ? 'text-green-400' : 'text-red-400'
// //                     }`}
// //                   >
// //                     {gameResult === 'win' ? `WIN ${slideMultipliers[resultIndex!].value.toFixed(2)}×!` : 'LOSS!'}
// //                   </div>
// //                   {gameResult === 'win' && (
// //                     <div className="text-2xl text-center mt-4 text-green-300">
// //                       +{(parseFloat(betAmount) * slideMultipliers[resultIndex!].value).toFixed(8)} BTC
// //                     </div>
// //                   )}
// //                 </div>
// //               )}
// //             </div>

// //             {/* Footer */}
// //             <div className="flex items-center justify-between mt-8">
// //               <div className="flex items-center gap-2">
// //                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// //                 <span className="text-gray-400 text-sm">Bets: {activeBets}</span>
// //               </div>
// //               <div className="text-gray-400 text-sm">Next round in: {nextRound}.2s</div>
// //             </div>

// //             {/* Progress Bar */}
// //             <div className="mt-4 bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
// //               <div
// //                 className="bg-blue-500 h-full transition-all duration-1000 ease-linear"
// //                 style={{ width: `${((16 - nextRound) / 16) * 100}%` }}
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import { Users } from 'lucide-react';

// const historyMultipliers = [1.36, 1.42, 4.87, 2.35, 1.38, 1.28, 6.55, 1.04, 1.52, 0.00, 9.77, 2.68];

// const slideMultipliers = [
//   { value: 2.24, color: 'bg-slate-700' },
//   { value: 1.20, color: 'bg-slate-700' },
//   { value: 1.75, color: 'bg-slate-700' },
//   { value: 2.68, color: 'bg-slate-600' },
//   { value: 3.16, color: 'bg-slate-700' },
//   { value: 1.35, color: 'bg-slate-700' },
//   { value: 18.76, color: 'bg-yellow-700' },
// ];

// export default function CrashSlideGame() {
//   const [betAmount, setBetAmount] = useState('0.00');
//   const [targetMultiplier, setTargetMultiplier] = useState('2.00');
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isSliding, setIsSliding] = useState(false);
//   const [ballPosition, setBallPosition] = useState(0);
//   const [resultIndex, setResultIndex] = useState<number | null>(null);
//   const [gameResult, setGameResult] = useState<'win' | 'loss' | null>(null);
//   const [lastResult, setLastResult] = useState<number | null>(null);
//   const [balance, setBalance] = useState(36.18);
//   const [nextRound, setNextRound] = useState(16);
//   const [activeBets] = useState(93);
//   const [history, setHistory] = useState(historyMultipliers);
//   const [showResult, setShowResult] = useState(false);
//   const [hasBet, setHasBet] = useState(false);
//   const slideRef = useRef<HTMLDivElement>(null);
//   const autoPlayRef = useRef<boolean>(false);

//   useEffect(() => {
//     if (nextRound > 0 && !isPlaying) {
//       const timer = setTimeout(() => setNextRound(prev => prev - 1), 1000);
//       return () => clearTimeout(timer);
//     } else if (nextRound === 0 && !isPlaying) {
//       // Auto-start the round animation
//       autoPlayRound();
//     }
//   }, [nextRound, isPlaying]);

//   const autoPlayRound = () => {
//     setIsPlaying(true);
//     setIsSliding(true);
//     setShowResult(false);
//     setBallPosition(0);
//     setResultIndex(null);

//     // Random result index
//     const result = Math.floor(Math.random() * slideMultipliers.length);
//     const resultMultiplier = slideMultipliers[result].value;

//     // Calculate slide distance
//     const slideWidth = slideRef.current?.offsetWidth || 1000;
//     const boxWidth = slideWidth / slideMultipliers.length;
//     const targetPosition = result * boxWidth + boxWidth / 2;

//     // Animate the ball sliding
//     let startTime: number | null = null;
//     const duration = 3000;
//     const extraSlides = 2;
//     const totalDistance = slideWidth * extraSlides + targetPosition;

//     const animate = (currentTime: number) => {
//       if (!startTime) startTime = currentTime;
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);

//       const easeOutQuart = 1 - Math.pow(1 - progress, 4);
//       const currentPosition = totalDistance * easeOutQuart;
      
//       setBallPosition(currentPosition % slideWidth);

//       if (progress < 1) {
//         requestAnimationFrame(animate);
//       } else {
//         // Animation complete
//         setIsSliding(false);
//         setResultIndex(result);
//         setShowResult(true);
//         setLastResult(resultMultiplier);

//         // Check win/loss only if user placed a bet
//         if (hasBet) {
//           const target = parseFloat(targetMultiplier);
//           if (resultMultiplier >= target) {
//             setGameResult('win');
//             const bet = parseFloat(betAmount);
//             setBalance(prev => prev + bet * resultMultiplier);
//           } else {
//             setGameResult('loss');
//           }
//           setHasBet(false);
//         }

//         setHistory(prev => [resultMultiplier, ...prev.slice(0, 11)]);

//         // Reset after showing result
//         setTimeout(() => {
//           setIsPlaying(false);
//           setShowResult(false);
//           setGameResult(null);
//           setResultIndex(null);
//           setBallPosition(0);
//           setNextRound(16);
//         }, 3000);
//       }
//     };

//     requestAnimationFrame(animate);
//   };

//   const startGame = () => {
//     const bet = parseFloat(betAmount);
//     const target = parseFloat(targetMultiplier);

//     if (bet <= 0 || bet > balance) return;
//     if (isPlaying) return;

//     setBalance(prev => prev - bet);
//     setHasBet(true);
//     setGameResult(null);
    
//     // If round is about to start, trigger immediately
//     if (nextRound <= 1) {
//       setNextRound(0);
//     }
//   };

//   const getHistoryColor = (mult: number) => {
//     if (mult === 0) return 'bg-slate-700';
//     if (mult < 2) return 'bg-slate-700';
//     if (mult < 5) return 'bg-blue-500';
//     if (mult < 10) return 'bg-purple-500';
//     return 'bg-yellow-500';
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header History */}
//         <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
//           {history.map((mult, idx) => (
//             <button
//               key={idx}
//               className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
//                 idx === 0 ? 'ring-2 ring-blue-400 scale-110' : ''
//               } ${getHistoryColor(mult)}`}
//             >
//               {mult.toFixed(2)}×
//             </button>
//           ))}
//         </div>

//         <div className="grid lg:grid-cols-[320px_1fr] gap-6">
//           {/* Left Panel */}
//           <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 space-y-4 h-fit">
//             <div className="flex gap-2">
//               <button className="flex-1 bg-slate-700 hover:bg-slate-600 py-2.5 rounded-lg font-semibold transition-colors">
//                 Manual
//               </button>
//               <button className="flex-1 bg-slate-900/50 hover:bg-slate-700 py-2.5 rounded-lg font-semibold transition-colors">
//                 Auto
//               </button>
//             </div>

//             <div>
//               <label className="text-sm text-gray-400 mb-2 block">Bet Amount</label>
//               <div className="bg-slate-900/50 rounded-lg p-3 flex items-center justify-between">
//                 <input
//                   type="text"
//                   value={betAmount}
//                   onChange={(e) => setBetAmount(e.target.value)}
//                   className="bg-transparent text-xl font-bold outline-none w-full"
//                   disabled={isPlaying}
//                   placeholder="0.00"
//                 />
//                 <span className="text-gray-400 text-sm ml-2">BTC</span>
//               </div>
//               <div className="flex gap-2 mt-2">
//                 <button className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors">
//                   <span className="text-lg">➕</span>
//                 </button>
//                 <button
//                   onClick={() => setBetAmount(prev => (parseFloat(prev || '0') / 2).toFixed(8))}
//                   className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-sm font-semibold transition-colors"
//                   disabled={isPlaying}
//                 >
//                   ½
//                 </button>
//                 <button
//                   onClick={() => setBetAmount(prev => (parseFloat(prev || '0') * 2).toFixed(8))}
//                   className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-sm font-semibold transition-colors"
//                   disabled={isPlaying}
//                 >
//                   2×
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className="text-sm text-gray-400 mb-2 block">Target Multiplier</label>
//               <div className="relative">
//                 <input
//                   type="number"
//                   value={targetMultiplier}
//                   onChange={(e) => setTargetMultiplier(e.target.value)}
//                   className="w-full bg-slate-900/50 rounded-lg p-3 pr-8 text-xl font-bold outline-none"
//                   step="0.01"
//                   disabled={isPlaying}
//                 />
//                 <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
//                   ✕
//                 </button>
//               </div>
//             </div>

//             <button
//               onClick={startGame}
//               disabled={isPlaying || parseFloat(betAmount || '0') <= 0}
//               className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
//                 isPlaying
//                   ? 'bg-gray-600 cursor-not-allowed'
//                   : 'bg-green-500 hover:bg-green-600 active:scale-95'
//               }`}
//             >
//               {isPlaying ? (hasBet ? 'Playing...' : 'Round in Progress') : 'Bet'}
//             </button>

//             <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
//               <div className="flex items-center gap-2">
//                 <Users size={18} className="text-white" />
//                 <span className="text-sm">{activeBets}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-orange-500 text-xl">₿</span>
//                 <span className="font-bold">${balance.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>

//           {/* Game Area */}
//           <div className="bg-slate-800/30 backdrop-blur rounded-xl p-8 relative overflow-hidden">
//             {/* Slide Container */}
//             <div className="relative h-96 overflow-hidden" ref={slideRef}>
//               {/* Pointer Arrow at top center */}
//               <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
//                 <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
//               </div>

//               {/* Sliding multiplier boxes */}
//               <div className="absolute top-20 left-0 right-0 flex items-start justify-center">
//                 <div 
//                   className="flex gap-4 transition-none"
//                   style={{ 
//                     transform: `translateX(calc(50% - ${ballPosition}px - 60px))`,
//                   }}
//                 >
//                   {slideMultipliers.map((mult, idx) => (
//                     <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0">
//                       {/* Hexagon box */}
//                       <div
//                         className={`w-24 h-24 flex items-center justify-center font-bold text-lg relative transition-all duration-300 ${
//                           resultIndex === idx && showResult
//                             ? 'border-4 border-white shadow-lg shadow-white/50 scale-110'
//                             : 'border-2 border-slate-600'
//                         } ${mult.color}`}
//                         style={{
//                           clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
//                         }}
//                       >
//                         <span className="text-white">{mult.value.toFixed(2)}×</span>
//                       </div>
                      
//                       {/* Bar below */}
//                       <div className={`w-24 h-32 rounded ${mult.color}`}></div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Ball/Pointer at center */}
//               <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10">
//                 <div className="w-6 h-6 bg-white rounded-full shadow-lg"></div>
//               </div>

//               {/* Result Display - Shows for every round */}
//               {showResult && resultIndex !== null && (
//                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
//                   {/* Always show the multiplier result */}
//                   <div className="text-6xl font-bold text-white animate-pulse mb-4 text-center">
//                     {slideMultipliers[resultIndex].value.toFixed(2)}×
//                   </div>
                  
//                   {/* Show win/loss only if user placed a bet */}
//                   {gameResult && (
//                     <>
//                       <div
//                         className={`text-4xl font-bold text-center ${
//                           gameResult === 'win' ? 'text-green-400' : 'text-red-400'
//                         }`}
//                       >
//                         {gameResult === 'win' ? 'YOU WIN!' : 'YOU LOSE!'}
//                       </div>
//                       {gameResult === 'win' && (
//                         <div className="text-2xl text-center mt-2 text-green-300">
//                           +{(parseFloat(betAmount) * slideMultipliers[resultIndex].value).toFixed(8)} BTC
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="flex items-center justify-between mt-8">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span className="text-gray-400 text-sm">Bets: {activeBets}</span>
//               </div>
//               <div className="text-gray-400 text-sm">Next round in: {nextRound}.2s</div>
//             </div>

//             {/* Progress Bar */}
//             <div className="mt-4 bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
//               <div
//                 className="bg-blue-500 h-full transition-all duration-1000 ease-linear"
//                 style={{ width: `${((16 - nextRound) / 16) * 100}%` }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Users } from "lucide-react";

/* ---------- HISTORY ---------- */
const initialHistory = [
  1.36, 1.42, 4.87, 2.35, 1.38, 1.28, 6.55, 1.04, 1.52, 0.0, 9.77, 2.68,
];

/* ---------- SLIDES ---------- */
const slides = [
  { value: 2.24, color: "bg-slate-700" },
  { value: 1.2, color: "bg-slate-700" },
  { value: 1.75, color: "bg-slate-700" },
  { value: 2.68, color: "bg-slate-600" },
  { value: 3.16, color: "bg-slate-700" },
  { value: 1.35, color: "bg-slate-700" },
  { value: 18.76, color: "bg-yellow-700" },
];

/* duplicate for infinite illusion */
const EXTENDED = [...slides, ...slides, ...slides];

export default function CrashSlideGame() {
  const [betAmount, setBetAmount] = useState("0.00");
  const [targetMultiplier, setTargetMultiplier] = useState("2.00");
  const [balance, setBalance] = useState(36.18);

  const [nextRound, setNextRound] = useState(16);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasBet, setHasBet] = useState(false);

  const [ballX, setBallX] = useState(0);
  const [resultIndex, setResultIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameResult, setGameResult] = useState<"win" | "loss" | null>(null);

  const [history, setHistory] = useState(initialHistory);

  const slideRef = useRef<HTMLDivElement>(null);

  /* ---------- TIMER ---------- */
  useEffect(() => {
    if (!isPlaying && nextRound > 0) {
      const t = setTimeout(() => setNextRound((p) => p - 1), 1000);
      return () => clearTimeout(t);
    }
    if (!isPlaying && nextRound === 0) startRound();
  }, [nextRound, isPlaying]);

  /* ---------- WEIGHTED RANDOM ---------- */
  const pickResult = () => {
    const weights = slides.map((s) =>
      s.value >= 10 ? 1 : s.value >= 5 ? 3 : s.value >= 2 ? 6 : 10
    );
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i];
      if (r <= 0) return i;
    }
    return 0;
  };

  /* ---------- ROUND ---------- */
  const startRound = () => {
    setIsPlaying(true);
    setShowResult(false);
    setGameResult(null);
    setResultIndex(null);

    const result = pickResult();
    const slideWidth = slideRef.current?.offsetWidth || 800;

    const ITEM_WIDTH = 112; // 96px + gap
    const middleOffset = slideWidth / 2 - ITEM_WIDTH / 2;
    const target =
      slides.length * ITEM_WIDTH + result * ITEM_WIDTH + middleOffset;

    const duration = 3000;
    let start: number | null = null;

    const animate = (time: number) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setBallX(target * ease);

      if (progress < 1) requestAnimationFrame(animate);
      else finishRound(result);
    };

    requestAnimationFrame(animate);
  };

  /* ---------- FINISH ---------- */
  const finishRound = (idx: number) => {
    const mult = slides[idx].value;
    setResultIndex(idx);
    setShowResult(true);

    if (hasBet) {
      const bet = parseFloat(betAmount);
      const target = parseFloat(targetMultiplier);

      if (mult >= target) {
        setGameResult("win");
        setBalance((b) => b + bet * mult);
      } else {
        setGameResult("loss");
      }
    }

    setHistory((h) => [mult, ...h.slice(0, 11)]);

    setTimeout(() => {
      setIsPlaying(false);
      setHasBet(false);
      setBallX(0);
      setNextRound(16);
      setShowResult(false);
      setGameResult(null);
    }, 3000);
  };

  /* ---------- BET ---------- */
  const placeBet = () => {
    const bet = parseFloat(betAmount);
    if (bet <= 0 || bet > balance || hasBet || isPlaying) return;
    setBalance((b) => b - bet);
    setHasBet(true);
  };

  /* ---------- HISTORY COLOR ---------- */
  const historyColor = (m: number) =>
    m < 2 ? "bg-slate-700" : m < 5 ? "bg-blue-500" : m < 10 ? "bg-purple-500" : "bg-yellow-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">

        {/* HISTORY */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {history.map((m, i) => (
            <div
              key={i}
              className={`px-4 py-2 rounded-lg font-bold text-sm ${historyColor(m)} ${
                i === 0 ? "ring-2 ring-blue-400 scale-110" : ""
              }`}
            >
              {m.toFixed(2)}×
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">

          {/* LEFT PANEL */}
          <div className="bg-slate-800/50 rounded-xl p-6 space-y-4">
            <div className="flex gap-2">
              <button className="flex-1 bg-slate-700 py-2 rounded-lg">Manual</button>
              <button className="flex-1 bg-slate-900/50 py-2 rounded-lg">Auto</button>
            </div>

            <div>
              <label className="text-sm text-gray-400">Bet Amount</label>
              <input
                className="w-full bg-slate-900/50 p-3 rounded-lg text-xl font-bold"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                disabled={isPlaying}
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Target Multiplier</label>
              <input
                type="number"
                step="0.01"
                className="w-full bg-slate-900/50 p-3 rounded-lg text-xl font-bold"
                value={targetMultiplier}
                onChange={(e) => setTargetMultiplier(e.target.value)}
                disabled={isPlaying}
              />
            </div>

            <button
              onClick={placeBet}
              disabled={hasBet || isPlaying}
              className={`w-full py-4 rounded-lg font-bold ${
                hasBet ? "bg-gray-600" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {hasBet ? "Bet Placed" : "Bet"}
            </button>

            <div className="flex justify-between bg-slate-900/50 p-3 rounded-lg">
              <div className="flex gap-2 items-center">
                <Users size={16} /> 93
              </div>
              <div className="font-bold">${balance.toFixed(2)}</div>
            </div>
          </div>

          {/* GAME */}
          <div className="bg-slate-800/30 rounded-xl p-8 overflow-hidden">
            <div ref={slideRef} className="relative h-96 overflow-hidden">

              {/* POINTER */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
              </div>

              {/* SLIDES */}
              <div
                className="absolute top-20 flex gap-4"
                style={{ transform: `translateX(${-(ballX)}px)` }}
              >
                {EXTENDED.map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-24 h-24 flex items-center justify-center font-bold text-lg border ${
                        showResult && resultIndex === i % slides.length
                          ? "border-white shadow-[0_0_25px_rgba(255,255,255,0.7)] scale-110"
                          : "border-slate-600"
                      } ${s.color}`}
                      style={{
                        clipPath:
                          "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
                      }}
                    >
                      {s.value.toFixed(2)}×
                    </div>
                    <div className={`w-24 h-32 ${s.color}`} />
                  </div>
                ))}
              </div>

              {/* RESULT */}
              {showResult && resultIndex !== null && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
                  <div className="text-6xl font-bold animate-pulse">
                    {slides[resultIndex].value.toFixed(2)}×
                  </div>
                  {gameResult && (
                    <div
                      className={`text-4xl font-bold mt-4 ${
                        gameResult === "win" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {gameResult === "win" ? "YOU WIN!" : "YOU LOSE!"}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between text-sm text-gray-400">
              <span>Next round in: {nextRound}s</span>
              <span>Bets: 93</span>
            </div>

            <div className="mt-2 bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-1000"
                style={{ width: `${((16 - nextRound) / 16) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
