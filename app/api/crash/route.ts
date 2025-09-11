// import { NextResponse } from "next/server";

// // --- CONFIG ---
// const HOUSE_EDGE = 0.01;
// const WIN_RATE = 0.3; // 30% chance round is "good" for players
// const WAITING_TIME = 5000; // 5s before round starts
// const TICK_INTERVAL = 200; // ms for multiplier updates

// // --- STATE ---
// let currentRound: any = null;
// let history: number[] = [2.34, 1.23, 5.67, 3.45, 7.23];
// let balances: Record<string, number> = { demo: 1000 };
// let bets: any[] = [];
// let gameLoop: NodeJS.Timeout | null = null;
// let tickLoop: NodeJS.Timeout | null = null;

// // --- HELPERS ---

// function biasedCrashPoint() {
//   const rand = Math.random();

//   // Decide if this round should favor players or crash early
//   if (rand < WIN_RATE) {
//     // "Good" round → usually > 2x
//     return parseFloat((2 + Math.random() * 20).toFixed(2));
//   } else {
//     // "Bad" round → crash between 1.01x and 2x
//     return parseFloat((1.01 + Math.random()).toFixed(2));
//   }
// }

// function startNewRound() {
//   if (gameLoop) clearTimeout(gameLoop);
//   if (tickLoop) clearInterval(tickLoop);

//   // Setup new round
//   currentRound = {
//     id: Math.random().toString(36).substring(2, 9),
//     crashPoint: biasedCrashPoint(),
//     status: "waiting", // waiting → flying → crashed
//     multiplier: 1.0,
//     startedAt: null,
//     hash: Math.random().toString(36).substring(2, 9),
//   };
//   bets = [];

//   // After WAITING_TIME, start flying
//   gameLoop = setTimeout(() => startFlying(), WAITING_TIME);
// }

// function startFlying() {
//   if (!currentRound) return;
//   currentRound.status = "flying";
//   currentRound.startedAt = Date.now();

//   tickLoop = setInterval(() => {
//     if (!currentRound) return;

//     const elapsed = (Date.now() - currentRound.startedAt) / 1000;
//     const rawMultiplier = Math.pow(1.00408, elapsed * 60);
//     currentRound.multiplier = parseFloat(rawMultiplier.toFixed(2));

//     if (currentRound.multiplier >= currentRound.crashPoint) {
//       crashRound();
//     }
//   }, TICK_INTERVAL);
// }

// function crashRound() {
//   if (!currentRound) return;
//   currentRound.status = "crashed";
//   currentRound.multiplier = currentRound.crashPoint;

//   if (tickLoop) clearInterval(tickLoop);

//   // Save crash in history (max 10)
//   history.unshift(currentRound.crashPoint);
//   history = history.slice(0, 10);

//   // Reset bets
//   bets = [];

//   // Start next round after 3s
//   gameLoop = setTimeout(() => startNewRound(), 3000);
// }

// function findBet(userId: string) {
//   return bets.find((b) => b.userId === userId && !b.multiplier);
// }

// // --- API ROUTE ---
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { action, userId = "demo", betAmount, multiplier } = body;

//     if (!["bet", "cashout", "state"].includes(action)) {
//       return NextResponse.json({ error: "Invalid action" }, { status: 400 });
//     }

//     if (!(userId in balances)) {
//       balances[userId] = 1000;
//     }

//     // Place bet
//     if (action === "bet") {
//       if (!currentRound || currentRound.status !== "waiting") {
//         return NextResponse.json({ error: "Betting closed" }, { status: 400 });
//       }
//       if (betAmount > balances[userId]) {
//         return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
//       }
//       balances[userId] -= betAmount;
//       bets.push({ userId, amount: betAmount, multiplier: null });
//       return NextResponse.json({
//         success: true,
//         message: "Bet placed",
//         balance: balances[userId],
//       });
//     }

//     // Cashout
//     if (action === "cashout") {
//       if (!currentRound || currentRound.status !== "flying") {
//         return NextResponse.json({ error: "Cannot cashout now" }, { status: 400 });
//       }
//       const bet = findBet(userId);
//       if (!bet) {
//         return NextResponse.json({ error: "No active bet" }, { status: 400 });
//       }

//       const winAmount = parseFloat((bet.amount * multiplier).toFixed(2));
//       bet.multiplier = multiplier;
//       balances[userId] += winAmount;

//       return NextResponse.json({
//         success: true,
//         message: `Cashed out at ${multiplier}x`,
//         winAmount,
//         balance: balances[userId],
//       });
//     }

//     // Game state
//     if (action === "state") {
//       return NextResponse.json({
//         round: currentRound,
//         bets,
//         history,
//         balance: balances[userId],
//       });
//     }

//     return NextResponse.json({ error: "Unhandled action" }, { status: 400 });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// // Start the first round on server boot
// if (!currentRound) startNewRound();
