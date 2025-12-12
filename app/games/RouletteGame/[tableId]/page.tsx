// // "use client";

// // import { useEffect, useState } from "react";
// // import { getSocket,disconnectSocket } from "../../../../utils/socket";
// // import { use } from "react";

// // export default function RouletteTable(props) {
// //   const { tableId } = use(props.params);


// //   const [countdown, setCountdown] = useState(15);
// //   const [result, setResult] = useState(null);
// //   const [bets, setBets] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const socket = getSocket("");   //getSocket("crash")  //route hatai bass ena karab vajat hatai avi roulette k defaault haiii
// //   //hmmra mapping pathau red me kon nuber aa black me kate sab hv sammhatai

// //   useEffect(() => {
// //     if (!socket) return;

// //     // ❗ FIX: must send room param
// //     socket.emit("join-room", { room: tableId }, (res) => {
// //       console.log("Join room:", res);
// //       setLoading(false);
// //     });

// //     socket.on("countdown", (data) => {
// //       setCountdown(data.seconds)      //countdown data
// //       console.log("COUNTDOWN scoket:", data);
// //     });

// //     socket.on("spin-result", data => {
// //         console.log("SPIN result:", data);    //result update      eehe me uh code dhadiyai koon
// //         setResult(data);
// //     });

// //     socket.on("countdown", (data) => setCountdown(data.seconds));
// //     socket.on("bet-placed", (bet) => {
// //       console.log("Your bet confirmed:", bet);
// //       // NO RESULT HERE - remove setResult
// //     });

// //     socket.on("bet-update", (data) => {
// //       console.log("Bet Update from room:", data);
// //       setBets((prev) => [...prev, data]);
// //     });

// //     return () => {
// //       socket.off("countdown");
// //       socket.off("spin-result");
// //       socket.off("bet-update");
// //       socket.off("bet-placed");

// //       // ❗ FIX: must send room param
// //       socket.emit("leave-room", { room: tableId });
// //       disconnectSocket("");
// //     };    
// //   }, []);



// //   const placeBet = (color) => {     //ee ha bet place karake 
// //     socket.emit(
// //       "place-bet",
// //       {
// //         room: tableId,
// //         bet: {
// //           type: "COLOR",
// //           amount: 5,
// //           color: color,
// //         },
// //       },    //aaiime ok ya karai xi ha oor roomid generate karke ya filhal je hai roommid se raahadu roulette p cliick karte /tableid/ tab gaem k ui 
// //       // ta eehe page hai working eehene final change karu hatai av win loose na hai bas place bet ha aa result ham update kardeb apne aait hatai ya ham karai xi kokokok
// //       (res) => {
// //         if (!res.ok) alert(res.error);
// //       }
// //     );
// //   };

// //   if (loading) return <div>Joining room...</div>;

// //   return (
// //     <div className="p-10">
// //       <h1 className="text-2xl font-bold">Roulette Table: {tableId}</h1>

// //       <div className="mt-6 text-xl">
// //         Countdown: <span className="font-bold">{countdown}</span>
// //       </div>

// //       <div className="mt-4 text-lg">
// //         {result && (
// //           <div>
// //             <strong>Result:</strong> {result.result.number} ({result.result.color})
// //           </div>
// //         )}
// //       </div>

// //       <div className="flex gap-4 mt-6">
// //         <button onClick={() => placeBet("RED")} className="bg-red-600 text-white px-4 py-2 rounded">
// //           Bet RED
// //         </button>

// //         <button onClick={() => placeBet("BLACK")} className="bg-black text-white px-4 py-2 rounded">
// //           Bet BLACK
// //         </button>

// //         <button onClick={() => placeBet("GREEN")} className="bg-green-600 text-white px-4 py-2 rounded">
// //           Bet GREEN
// //         </button>
// //       </div>

// //       <div className="mt-6">
// //         <div>
// //           <h2 className="font-bold mb-2 ">Spin Result:</h2>
// //           {result ? (
// //             <div>
// //               Number: {result.result.number}   Color: {result.result.color}
// //             </div>
// //           ) : (
// //             <div>No spins yet.</div>
// //           )}
// //         </div>
// //         <h2 className="font-bold mb-2 ">Live Bets:</h2>
// //         <ul className="space-y-2">
// //           {bets.map((b, i) => (
// //             <li key={i} className="p-2 border rounded">
// //               Player {b.userId} bet: {JSON.stringify(b.bet)}
// //             </li>
// //           ))}
// //         </ul>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { getSocket, disconnectSocket } from "@/utils/socket"; // Adjust path
// import { apiRequest } from "@/utils/ApiHelper";
// import { v4 as uuidv4 } from "uuid";
// import TopNavbar from "@/components/topnavbar";
//  import { useCurrency } from "@/context/CurrencyContext";
// type BetsMap = { [key: string]: number };

// // Generates a unique table ID using uuid
// function generateTableId(): string {
//   return uuidv4();
// }

// const ModernRoulette: React.FC<{ tableId: string }> = () => {
//   const [balance, setBalance] = useState<number>(0);

//   const [totalBet, setTotalBet] = useState<number>(0);
//   const [winningAmount, setWinningAmount] = useState<number>(0);
//   const [bets, setBets] = useState<BetsMap>({});
//   const [betAmount, setBetAmount] = useState<number>(10);
//   const [isSpinning, setIsSpinning] = useState<boolean>(false);
//   const [wheelRotation, setWheelRotation] = useState<number>(0);
//   const [ballRotation, setBallRotation] = useState<number>(0);
//   const [result, setResult] = useState<number | null>(null);
//   const [showWinningAlert, setShowWinningAlert] = useState<boolean>(false);
//   const [ballVisible, setBallVisible] = useState<boolean>(true);
//   const [countdown, setCountdown] = useState<number>(15);
//   const [gameHistory, setGameHistory] = useState<number[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [tableId, setTableId] = useState(uuidv4());
//   const socketRef = useRef<any>(null);
//    const [search, setSearch] = useState("");
//   const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  

// const MyComponent = () => {
//   const { currency } = useCurrency();

//   return <div>Current currency: {currency}</div>;
// };
 
//   const wheelNumbers = [
//     0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
//     5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
//   ];
//  const redNumbers = [
//   1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
// ];

// const getColor = (num: number | string) => {
//   if (num === "0" || num === 0) return "green";
//   if (num === "red" || redNumbers.includes(Number(num))) return "red";
//   if (num === "black" || (!redNumbers.includes(Number(num)) && num !== 0)) return "black";
//   return "unknown";
// };

//   const betAmounts = [1, 5, 10, 25, 50, 100];

//   const wheelRotationRef = useRef<number>(wheelRotation);
//   useEffect(() => {
//     wheelRotationRef.current = wheelRotation;
//   }, [wheelRotation]);

//  useEffect(() => {
//   const fetchDashboardDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const id = localStorage.getItem("userId");

//       const res = await apiRequest(`/users/${id}/details`, true, {
//         method: "GET",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.success) {
//         setDashboardDetails(res.data);

//         // Set balance from the user's wallet
//         const walletBalance = res.data.wallets?.[0]?.balance ?? 0;
//         setBalance(walletBalance);
//       }
//     } catch (err) {
//       console.error("AFFILIATE PAGE API ERROR:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchDashboardDetails();
// }, []);


//   /* ---------- SOCKET INIT ---------- */
//   useEffect(() => {
//     const socket = getSocket(""); // your server route
//     socketRef.current = socket;

//     socket.emit("join-room", { room: tableId }, (res: any) => {
//       console.log("Joined room:", res);
//       setLoading(false);
//     });

//     socket.on("countdown", (data: any) => {
//       setCountdown(data.seconds);
//     });

//     socket.on("spin-result", (data: any) => {
//       console.log("Spin result from server:", data);
//       handleServerResult(data.result.number);
//       setGameHistory((prev) => [...prev, data.result.number]);
//     });

//     socket.on("bet-update", (data: any) => {
//       console.log("Live bet update:", data);
//       // optional: update live bets UI if needed
//     });

//     return () => {
//       socket.emit("leave-room", { room: tableId });
//       socket.off("countdown");
//       socket.off("spin-result");
//       socket.off("bet-update");
//       disconnectSocket("roulette");
//     };
//   }, [tableId]);

//   /* ---------- BETTING ---------- */
//  const placeBet = (position: string) => {
//   if (betAmount > balance || isSpinning) return;

//   setBets((prev) => ({ ...prev, [position]: (prev[position] || 0) + betAmount }));
//   setTotalBet((prev) => prev + betAmount);
//   setBalance((prev) => prev - betAmount);

//   // Comment this out if server handles bets only on spin
//   // sendBetToServer(position, betAmount);
// };



//   const clearBets = () => {
//     setBalance((prev) => prev + totalBet);
//     setBets({});
//     setTotalBet(0);
//   };

//   /* ---------- SPIN ---------- */
//  const spin = () => {
//   if (totalBet === 0 || isSpinning) return;
//   const socket = socketRef.current;
//   if (!socket || !socket.connected) return alert("No server connection");

//   setIsSpinning(true);
//   setResult(null);
//   setWinningAmount(0);
//   setShowWinningAlert(false);

//   const payload = {
//     room: tableId,
//     userId: localStorage.getItem("userId"),
//     gameId: "roulette",
//     bets: Object.entries(bets).map(([betType, amount]) => ({
//       betId: uuidv4(),
//       betType,
//       amount,
//       color: getColor(betType), // <-- send color here
//     })),
//     totalBet,
//   };

//   console.log("Sending batch bets payload with color:", payload);

//   socket.emit("place-bets", payload, (ack: any) => {
//     if (!ack || !ack.ok) {
//       alert(ack?.error || "Bet rejected");
//       setBalance((prev) => prev + totalBet);
//       setBets({});
//       setTotalBet(0);
//       setIsSpinning(false);
//     }
//   });
// };


//   /* ---------- HANDLE SERVER RESULT ---------- */
//   const handleServerResult = (winningNumber: number) => {
//     const winningIndex = wheelNumbers.indexOf(winningNumber);
//     const segmentAngle = 360 / wheelNumbers.length;
//     const extraSpins = 3 + Math.random() * 3;
//     const finalRotation = wheelRotationRef.current + extraSpins * 360 - winningIndex * segmentAngle;

//     setWheelRotation(finalRotation);
//     setBallRotation(finalRotation * -1);
//     setBallVisible(true);

//     setTimeout(() => setBallVisible(false), 4200);
//     setTimeout(() => {
//       setResult(winningNumber);
//       setShowWinningAlert(true);
//       calculateWinnings(winningNumber);
//     }, 4500);
//     setTimeout(() => setShowWinningAlert(false), 7500);
//   };

//   /* ---------- CALCULATE WINNINGS ---------- */
//   const calculateWinnings = (winningNumber: number) => {
//     let totalWinnings = 0;
//     Object.entries(bets).forEach(([pos, amt]) => {
//       const a = amt || 0;
//       if (pos === winningNumber.toString()) totalWinnings += a * 36;
//       else if (pos === "red" && redNumbers.includes(winningNumber)) totalWinnings += a * 2;
//       else if (pos === "black" && !redNumbers.includes(winningNumber) && winningNumber !== 0) totalWinnings += a * 2;
//       else if (pos === "even" && winningNumber % 2 === 0 && winningNumber !== 0) totalWinnings += a * 2;
//       else if (pos === "odd" && winningNumber % 2 === 1) totalWinnings += a * 2;
//       else if (pos === "1-18" && winningNumber >= 1 && winningNumber <= 18) totalWinnings += a * 2;
//       else if (pos === "19-36" && winningNumber >= 19 && winningNumber <= 36) totalWinnings += a * 2;
//       else if (pos === "1-12" && winningNumber >= 1 && winningNumber <= 12) totalWinnings += a * 3;
//       else if (pos === "13-24" && winningNumber >= 13 && winningNumber <= 24) totalWinnings += a * 3;
//       else if (pos === "25-36" && winningNumber >= 25 && winningNumber <= 36) totalWinnings += a * 3;
//     });
//     setWinningAmount(totalWinnings - totalBet);
//     setBalance((prev) => prev + totalWinnings);
//     setBets({});
//     setTotalBet(0);
//     setIsSpinning(false);
//   };

//   if (loading) return <div>Joining room...</div>;


//   const sendBetToServer = (betType: string, amount: number) => {
//   const socket = socketRef.current;
//   if (!socket || !socket.connected) return;

//   const payload = {
//     userId: localStorage.getItem("userId"), // assuming user ID is stored
//     gameId: "roulette",
//    room: tableId,
//     betId: uuidv4(), // unique ID per bet
//     betType,
//     amount,
//     color: getColor(betType),
//   };
//   console.log("Sending individual bet payload to server:", payload);
//   socket.emit("place-bet", payload, (ack: any) => {
//     if (!ack.ok) {
//       console.error("Bet rejected:", ack.error);
//       setBalance((prev) => prev + amount);
//       setBets((prev) => {
//         const updated = { ...prev };
//         updated[betType] = (updated[betType] || 0) - amount;
//         if (updated[betType] <= 0) delete updated[betType];
//         return updated;
//       });
//       setTotalBet((prev) => prev - amount);
//     } else {
//       console.log("Bet accepted:", payload);
//     }
//   });
// };


//   /* ---------- JSX ---------- */
//   return (

//      <div className="flex min-h-screen bg-[#1a2c38] text-white overflow-x-hidden relative flex-col">
//       <TopNavbar
//   searchValue={search}
//   onSearchChange={setSearch}
//   wallets={wallets}
//   onCurrencyChange={(currencyType) => {
//     console.log("Selected Currency:", currencyType);
//   }}
// />

//       {/* Header */}
//       <div className="bg-gray-800 border-b border-gray-700 p-4">
//         <div className="flex justify-between items-center max-w-7xl mx-auto">
//           <div className="flex items-center gap-4">
//             <h1 className="text-2xl font-bold text-blue-400">🎰 Roulette</h1>
            
//           </div>

//           {/* Stats */}
//           <div className="flex gap-4 text-sm">
//             <div className="bg-gray-700 px-3 py-1 rounded">
//               <span className="text-gray-400">Balance:</span>
//               <span className="text-green-400 ml-1 font-bold">${balance.toLocaleString()}</span>
//             </div>
//             <div className="bg-gray-700 px-3 py-1 rounded">
//               <span className="text-gray-400">Total Bet:</span>
//               <span className="text-yellow-400 ml-1 font-bold">${totalBet.toLocaleString()}</span>
//             </div>
//             {winningAmount !== 0 && (
//               <div className="bg-gray-700 px-3 py-1 rounded">
//                 <span className="text-gray-400">Last Win:</span>
//                 <span className={`ml-1 font-bold ${winningAmount > 0 ? "text-green-400" : "text-red-400"}`}>
//                   ${winningAmount.toLocaleString()}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Main Game Area */}
//       <div className="max-w-7xl mx-auto p-4">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Panel - Game History & Stats */}
//           <div className="space-y-4">
//             <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
//               <h3 className="text-lg font-bold text-blue-400 mb-3">🎯 Recent Results</h3>
//               <div className="flex flex-wrap gap-2">
//                 {gameHistory.slice(-10).map((num, idx) => (
//                   <div
//                     key={idx}
//                     className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
//                       num === 0 ? "bg-green-500" : redNumbers.includes(num) ? "bg-red-500" : "bg-gray-600"
//                     } text-white`}
//                   >
//                     {num}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Current Bets */}
//             <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
//               <h3 className="text-lg font-bold text-yellow-400 mb-3">💰 Current Bets</h3>
//               {Object.keys(bets).length === 0 ? (
//                 <p className="text-gray-400 text-sm">No active bets</p>
//               ) : (
//                 <div className="space-y-2 max-h-40 overflow-y-auto">
//                   {Object.entries(bets).map(([position, amount]) => (
//                     <div key={position} className="flex justify-between items-center text-sm">
//                       <span className="text-gray-300">{position}</span>
//                       <span className="text-green-400 font-bold">${amount}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Center - Roulette Wheel */}
//           <div className="flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700 p-6">
//             <div className="relative">
//               {/* Pointer */}
//               <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30">
//                 <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400 drop-shadow-lg"></div>
//                 <div className="w-2 h-2 bg-yellow-400 rounded-full mx-auto -mt-1 shadow-lg"></div>
//               </div>

//               {/* Wheel */}
//               <div className="w-80 h-80 rounded-full bg-gradient-to-br from-amber-800 to-amber-900 border-4 border-amber-600 shadow-2xl relative">
//                 <div className="absolute inset-0 rounded-full">
//                   {wheelNumbers.map((num, idx) => {
//                     const angle = (idx * 360) / 37;
//                     const isRed = redNumbers.includes(num);
//                     const isGreen = num === 0;
//                     const radiusOffset = 145;
//                     return (
//                       <div
//                         key={`outer-${idx}`}
//                         className="absolute w-8 h-8 flex items-center justify-center"
//                         style={{
//                           left: "50%",
//                           top: "50%",
//                           transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radiusOffset}px) rotate(-${angle}deg)`,
//                           transformOrigin: "center center",
//                         }}
//                       >
//                         <div
//                           className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white shadow-lg ${
//                             isGreen ? "bg-green-600" : isRed ? "bg-red-600" : "bg-gray-900"
//                           }`}
//                         >
//                           {num}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Inner Spinning Wheel (animated via wheelRotation) */}
//                 <div
//                   className="rounded-full relative overflow-hidden transition-transform duration-[5000ms] ease-out"
//                   style={{ transform: `rotate(${wheelRotation}deg)` }}
//                 >
//                   {wheelNumbers.map((num, idx) => {
//                     const angle = (idx * 360) / 37;
//                     const isRed = redNumbers.includes(num);
//                     const isGreen = num === 0;
//                     return (
//                       <div key={idx} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
//                         <div
//                           className={`absolute w-full h-1/2 origin-bottom ${isGreen ? "bg-green-600" : isRed ? "bg-red-600" : "bg-gray-900"}`}
//                           style={{
//                             clipPath: `polygon(50% 100%, ${50 - 50 * Math.sin((9.73 * Math.PI) / 180)}% 0%, ${
//                               50 + 50 * Math.sin((9.73 * Math.PI) / 180)
//                             }% 0%)`,
//                           }}
//                         />
//                         <div
//                           className="absolute text-white font-bold text-xs flex items-center justify-center"
//                           style={{
//                             top: "15px",
//                             left: "50%",
//                             transform: "translateX(-50%)",
//                             width: "14px",
//                             height: "14px",
//                           }}
//                         >
//                           {num}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* decorative rings */}
//                 <div className="absolute inset-8 rounded-full border-2 border-amber-400 opacity-40"></div>
//                 <div className="absolute inset-12 rounded-full border-1 border-amber-300 opacity-30"></div>
//                 <div className="absolute inset-16 rounded-full border-2 border-yellow-400 opacity-20 shadow-inner"></div>

//                 {/* Ball */}
//                 <div
//                   className={`absolute inset-0 transition-all duration-[5000ms] ease-out ${ballVisible ? "opacity-100" : "opacity-0"}`}
//                   style={{
//                     transform: `rotate(${ballRotation}deg)`,
//                     transformOrigin: "center center",
//                   }}
//                 >
//                   <div
//                     className={`absolute w-4 h-4 bg-white rounded-full shadow-lg border-2 border-gray-300 transition-all duration-300 ${
//                       isSpinning ? "animate-pulse" : ""
//                     } ${ballVisible ? "scale-100" : "scale-0"}`}
//                     style={{
//                       top: "50%",
//                       left: "50%",
//                       transform: "translate(-50%, -50%) translateY(-120px)",
//                       boxShadow: isSpinning
//                         ? "0 0 15px rgba(255,255,255,1), inset 0 0 8px rgba(0,0,0,0.3), 0 0 25px rgba(255,215,0,0.5)"
//                         : "0 0 12px rgba(255,255,255,0.8), inset 0 0 6px rgba(0,0,0,0.3)",
//                       zIndex: 20,
//                     }}
//                   >
//                     <div className="absolute w-2 h-2 bg-gray-100 rounded-full" style={{ top: "2px", left: "2px", opacity: 0.9 }} />
//                     <div className={`absolute w-1 h-1 bg-white rounded-full ${isSpinning ? "animate-spin" : ""}`} style={{ top: "1px", right: "1px", opacity: 0.7 }} />
//                   </div>
//                 </div>

//                 {/* Winning alert */}
//                 {showWinningAlert && result !== null && (
//                   <div className="absolute inset-0 flex items-center justify-center z-30">
//                     <div className="relative">
//                       <div className="w-32 h-32 bg-black/80 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-2xl animate-pulse">
//                         <div className="text-center">
//                           <div className={`text-4xl font-bold mb-1 ${result === 0 ? "text-green-400" : redNumbers.includes(result) ? "text-red-400" : "text-white"}`}>
//                             {result}
//                           </div>
//                           <div className="text-yellow-400 text-sm font-bold animate-bounce">WINNER!</div>
//                         </div>
//                       </div>
//                       <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
//                       <div className="absolute -top-1 -right-3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Result display */}
//               {result !== null && (
//                 <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
//                   <div
//                     className={`px-4 py-2 rounded-lg font-bold text-lg border-2 ${
//                       result === 0 ? "bg-green-600 border-green-400" : redNumbers.includes(result) ? "bg-red-600 border-red-400" : "bg-gray-700 border-gray-500"
//                     } text-white shadow-lg animate-pulse`}
//                   >
//                     🎯 {result}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Panel - Betting Table */}
//           <div className="space-y-4">
//             <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
//               <h3 className="text-lg font-bold text-green-400 mb-4">🎲 Betting Table</h3>

//               {/* Betting Amount Controls */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-400 mb-2">Bet Amount</label>
//                 <div className="flex gap-2 mb-3">
//                   {betAmounts.map((amount) => (
//                     <button
//                       key={amount}
//                       onClick={() => setBetAmount(amount)}
//                       className={`px-3 py-2 text-sm font-bold rounded transition-all ${betAmount === amount ? "bg-blue-600 text-white border-2 border-blue-400" : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"}`}
//                     >
//                       ${amount}
//                     </button>
//                   ))}
//                 </div>
//                 <div className="text-sm text-gray-400">
//                   Selected: <span className="text-blue-400 font-bold">${betAmount}</span>
//                 </div>
//               </div>

//               {/* Number Grid */}
//               <div className="mb-4">
//                 <div className="text-sm font-medium text-gray-400 mb-2">Numbers</div>
//                 <div className="grid grid-cols-6 gap-1 mb-2">
//                   {[0, ...Array.from({ length: 36 }, (_, i) => i + 1)].map((num) => (
//                     <button
//                       key={num}
//                       onClick={() => placeBet(num.toString())}
//                       disabled={isSpinning}
//                       className={`h-8 text-xs font-bold rounded transition-all relative ${num === 0 ? "bg-green-600 hover:bg-green-500" : redNumbers.includes(num) ? "bg-red-600 hover:bg-red-500" : "bg-gray-700 hover:bg-gray-600"} text-white disabled:opacity-50`}
//                     >
//                       {num}
//                       {bets[num.toString()] && (
//                         <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full text-black text-xs flex items-center justify-center">💰</div>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Outside Bets */}
//               <div className="space-y-2">
//                 <div className="text-sm font-medium text-gray-400 mb-2">Outside Bets</div>

//                 <div className="grid grid-cols-2 gap-2 mb-2">
//                   <button onClick={() => placeBet("red")} disabled={isSpinning} className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative">
//                     Red (1:1)
//                     {bets["red"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
//                   </button>
//                   <button onClick={() => placeBet("black")} disabled={isSpinning} className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded border border-gray-600 transition-all relative">
//                     Black (1:1)
//                     {bets["black"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-2 gap-2 mb-2">
//                   <button onClick={() => placeBet("even")} disabled={isSpinning} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative">
//                     Even (1:1)
//                     {bets["even"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
//                   </button>
//                   <button onClick={() => placeBet("odd")} disabled={isSpinning} className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative">
//                     Odd (1:1)
//                     {bets["odd"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-2 gap-2 mb-2">
//                   <button onClick={() => placeBet("1-18")} disabled={isSpinning} className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative">
//                     1-18 (1:1)
//                     {bets["1-18"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
//                   </button>
//                   <button onClick={() => placeBet("19-36")} disabled={isSpinning} className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative">
//                     19-36 (1:1)
//                     {bets["19-36"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-3 gap-1">
//                   <button onClick={() => placeBet("1-12")} disabled={isSpinning} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-2 px-2 text-sm rounded transition-all relative">
//                     1-12 (2:1)
//                     {bets["1-12"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
//                   </button>
//                   <button onClick={() => placeBet("13-24")} disabled={isSpinning} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-2 px-2 text-sm rounded transition-all relative">
//                     13-24 (2:1)
//                     {bets["13-24"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
//                   </button>
//                   <button onClick={() => placeBet("25-36")} disabled={isSpinning} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-2 px-2 text-sm rounded transition-all relative">
//                     25-36 (2:1)
//                     {bets["25-36"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Control Panel */}
//         <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
//           <div className="flex justify-between items-center">
//             <div className="flex gap-3">
//               <button onClick={clearBets} disabled={totalBet === 0 || isSpinning} className="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold px-4 py-2 rounded transition-colors flex items-center gap-2">
//                 ❌ Clear Bets
//               </button>

//               <button onClick={() => setGameHistory([])} className="bg-gray-600 hover:bg-gray-500 text-white font-bold px-4 py-2 rounded transition-colors flex items-center gap-2">
//                 🗑️ Clear History
//               </button>
//             </div>

//             <div className="text-center">
//               {isSpinning ? <div className="text-blue-400 font-bold text-lg animate-pulse">🌀 Ball is revolving around the wheel...</div> : <div className="text-gray-400">Place your bets and spin the wheel!</div>}
//             </div>

//             <button onClick={spin} disabled={totalBet === 0 || isSpinning} className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg">
//               {isSpinning ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
//                   SPINNING...
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2">🎲 SPIN (${totalBet})</div>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModernRoulette;
"use client";

import React, { useEffect, useRef, useState } from "react";
import { getSocket, disconnectSocket } from "@/utils/socket"; // Adjust path
import { apiRequest } from "@/utils/ApiHelper";
import { v4 as uuidv4 } from "uuid";
import TopNavbar from "@/components/topnavbar";
import { useCurrency } from "@/context/CurrencyContext";

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
      if (data?.seconds !== undefined) setCountdown(data.seconds);
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

  /* ---------- BETTING ---------- */
  const placeBet = (position: string) => {
    // Convert selected chip value to currency units
    const displayBetAmount = convertChipToCurrency(betAmount, currency);

    if (displayBetAmount > balance || isSpinning) return;

    setBets((prev) => ({ ...prev, [position]: (prev[position] || 0) + displayBetAmount }));
    setTotalBet((prev) => +(prev + displayBetAmount));
    setBalance((prev) => +(prev - displayBetAmount));
  };

  const clearBets = () => {
    setBalance((prev) => prev + totalBet);
    setBets({});
    setTotalBet(0);
  };

  /* ---------- SPIN ---------- */
  const spin = () => {
    if (totalBet === 0 || isSpinning) return;
    const socket = socketRef.current;
    if (!socket || !socket.connected) return alert("No server connection");

    setIsSpinning(true);
    setResult(null);
    setWinningAmount(0);
    setShowWinningAlert(false);

    const payload = {
      room: tableId,
      userId: localStorage.getItem("userId"),
      gameId: "roulette",
      currency: currency,
      bets: Object.entries(bets).map(([betType, amount]) => ({
        betId: uuidv4(),
        betType,
        amount, // already in currency units
        color: getColor(betType),
      })),
      totalBet,
    };

    console.log("Sending batch bets payload with currency:", payload);

    socket.emit("place-bets", payload, (ack: any) => {
      if (!ack || !ack.ok) {
        alert(ack?.error || "Bet rejected");
        setBalance((prev) => prev + totalBet);
        setBets({});
        setTotalBet(0);
        setIsSpinning(false);
      }
    });
  };

  /* ---------- HANDLE SERVER RESULT ---------- */
  const handleServerResult = (winningNumber: number) => {
    const winningIndex = wheelNumbers.indexOf(winningNumber);
    const segmentAngle = 360 / wheelNumbers.length;
    const extraSpins = 3 + Math.random() * 3;
    const finalRotation = wheelRotationRef.current + extraSpins * 360 - winningIndex * segmentAngle;

    setWheelRotation(finalRotation);
    setBallRotation(finalRotation * -1);
    setBallVisible(true);

    setTimeout(() => setBallVisible(false), 4200);
    setTimeout(() => {
      setResult(winningNumber);
      setShowWinningAlert(true);
      calculateWinnings(winningNumber);
    }, 4500);
    setTimeout(() => setShowWinningAlert(false), 7500);
  };

  /* ---------- CALCULATE WINNINGS ---------- */
  const calculateWinnings = (winningNumber: number) => {
    let totalWinnings = 0;
    Object.entries(bets).forEach(([pos, amt]) => {
      const a = amt || 0;
      if (pos === winningNumber.toString()) totalWinnings += a * 36;
      else if (pos === "red" && redNumbers.includes(winningNumber)) totalWinnings += a * 2;
      else if (pos === "black" && !redNumbers.includes(winningNumber) && winningNumber !== 0) totalWinnings += a * 2;
      else if (pos === "even" && winningNumber % 2 === 0 && winningNumber !== 0) totalWinnings += a * 2;
      else if (pos === "odd" && winningNumber % 2 === 1) totalWinnings += a * 2;
      else if (pos === "1-18" && winningNumber >= 1 && winningNumber <= 18) totalWinnings += a * 2;
      else if (pos === "19-36" && winningNumber >= 19 && winningNumber <= 36) totalWinnings += a * 2;
      else if (pos === "1-12" && winningNumber >= 1 && winningNumber <= 12) totalWinnings += a * 3;
      else if (pos === "13-24" && winningNumber >= 13 && winningNumber <= 24) totalWinnings += a * 3;
      else if (pos === "25-36" && winningNumber >= 25 && winningNumber <= 36) totalWinnings += a * 3;
    });

    // winningAmount shown is profit = payout - totalBet
    setWinningAmount(totalWinnings - totalBet);

    // Add totalWinnings (already in currency units) to balance
    setBalance((prev) => prev + totalWinnings);

    // reset bets
    setBets({});
    setTotalBet(0);
    setIsSpinning(false);
  };

  if (loading) return <div>Joining room...</div>;

  /* ---------- SEND INDIVIDUAL BET (optional) ---------- */
  const sendBetToServer = (betType: string, amount: number) => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;

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
        // rollback UI changes
        setBalance((prev) => prev + amount);
        setBets((prev) => {
          const updated = { ...prev };
          updated[betType] = (updated[betType] || 0) - amount;
          if (updated[betType] <= 0) delete updated[betType];
          return updated;
        });
        setTotalBet((prev) => prev - amount);
      } else {
        console.log("Bet accepted:", payload);
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
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">💰 Current Bets</h3>
              {Object.keys(bets).length === 0 ? (
                <p className="text-gray-400 text-sm">No active bets</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Object.entries(bets).map(([position, amount]) => (
                    <div key={position} className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">{position}</span>
                      <span className="text-green-400 font-bold">{formatCurrency(amount)}</span>
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
              {result !== null && (
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div
                    className={`px-4 py-2 rounded-lg font-bold text-lg border-2 ${
                      result === 0 ? "bg-green-600 border-green-400" : redNumbers.includes(result) ? "bg-red-600 border-red-400" : "bg-gray-700 border-gray-500"
                    } text-white shadow-lg animate-pulse`}
                  >
                    🎯 {result}
                  </div>
                </div>
              )}
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
                      onClick={() => placeBet(num.toString())}
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
                  <button onClick={() => placeBet("red")} disabled={isSpinning} className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative">
                    Red (1:1)
                    {bets["red"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                  <button onClick={() => placeBet("black")} disabled={isSpinning} className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded border border-gray-600 transition-all relative">
                    Black (1:1)
                    {bets["black"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button onClick={() => placeBet("even")} disabled={isSpinning} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative">
                    Even (1:1)
                    {bets["even"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                  <button onClick={() => placeBet("odd")} disabled={isSpinning} className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative">
                    Odd (1:1)
                    {bets["odd"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button onClick={() => placeBet("1-18")} disabled={isSpinning} className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative">
                    1-18 (1:1)
                    {bets["1-18"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                  <button onClick={() => placeBet("19-36")} disabled={isSpinning} className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative">
                    19-36 (1:1)
                    {bets["19-36"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  <button onClick={() => placeBet("1-12")} disabled={isSpinning} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-2 px-2 text-sm rounded transition-all relative">
                    1-12 (2:1)
                    {bets["1-12"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                  <button onClick={() => placeBet("13-24")} disabled={isSpinning} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-2 px-2 text-sm rounded transition-all relative">
                    13-24 (2:1)
                    {bets["13-24"] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                  <button onClick={() => placeBet("25-36")} disabled={isSpinning} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-2 px-2 text-sm rounded transition-all relative">
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

            

            <button onClick={spin} disabled={totalBet === 0 || isSpinning} className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg">
              {isSpinning ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  SPINNING...
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2">🎲 SPIN ({formatCurrency(totalBet)})</div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernRoulette;
