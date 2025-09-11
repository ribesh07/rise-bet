// // app/api/baccarat/route.ts
// import { NextResponse } from 'next/server';

// // Card values for Baccarat
// const cardValues: Record<string, number> = {
//   'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 
//   '10': 0, 'J': 0, 'Q': 0, 'K': 0
// };

// // Card suits
// const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

// // Card ranks
// const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// // Create a deck of cards
// function createDeck() {
//   const deck = [];
//   for (const suit of suits) {
//     for (const rank of ranks) {
//       deck.push({ suit, rank });
//     }
//   }
//   return deck;
// }

// // Shuffle a deck
// function shuffleDeck(deck: any[]) {
//   const shuffled = [...deck];
//   for (let i = shuffled.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//   }
//   return shuffled;
// }

// // Get baccarat hand value
// function getHandValue(cards: any[]) {
//   const sum = cards.reduce((total, card) => total + cardValues[card.rank], 0);
//   return sum % 10;
// }

// // Determine if a third card should be drawn for the player
// function shouldPlayerDrawThird(playerValue: number) {
//   return playerValue <= 5;
// }

// // Determine if a third card should be drawn for the banker based on the rules
// function shouldBankerDrawThird(bankerValue: number, playerThirdCard: any) {
//   if (bankerValue <= 2) return true;
//   if (bankerValue === 3) return !playerThirdCard || cardValues[playerThirdCard.rank] !== 8;
//   if (bankerValue === 4) return playerThirdCard && [2, 3, 4, 5, 6, 7].includes(cardValues[playerThirdCard.rank]);
//   if (bankerValue === 5) return playerThirdCard && [4, 5, 6, 7].includes(cardValues[playerThirdCard.rank]);
//   if (bankerValue === 6) return playerThirdCard && [6, 7].includes(cardValues[playerThirdCard.rank]);
//   return false;
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { betAmount, betOn } = body;

//     if (typeof betAmount !== 'number' || !['player', 'banker', 'tie'].includes(betOn)) {
//       return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
//     }

//     // Create and shuffle a deck
//     const deck = shuffleDeck(createDeck());
    
//     // Deal initial cards
//     const playerHand = [deck.pop()!, deck.pop()!];
//     const bankerHand = [deck.pop()!, deck.pop()!];
    
//     let playerValue = getHandValue(playerHand);
//     let bankerValue = getHandValue(bankerHand);
    
//     // Check for natural win
//     const hasNatural = playerValue >= 8 || bankerValue >= 8;
    
//     // Apply third card rules if no natural
//     let playerThirdCard = null;
//     if (!hasNatural && shouldPlayerDrawThird(playerValue)) {
//       playerThirdCard = deck.pop()!;
//       playerHand.push(playerThirdCard);
//       playerValue = getHandValue(playerHand);
//     }
    
//     if (!hasNatural && shouldBankerDrawThird(bankerValue, playerThirdCard)) {
//       bankerHand.push(deck.pop()!);
//       bankerValue = getHandValue(bankerHand);
//     }
    
//     // Determine the winner
//     let winner;
//     if (playerValue > bankerValue) {
//       winner = 'player';
//     } else if (bankerValue > playerValue) {
//       winner = 'banker';
//     } else {
//       winner = 'tie';
//     }
    
//     // Calculate payout
//     let payoutMultiplier = 0;
//     if (betOn === 'player' && winner === 'player') {
//       payoutMultiplier = 2; // 1:1 payout
//     } else if (betOn === 'banker' && winner === 'banker') {
//       payoutMultiplier = 1.95; // 0.95:1 payout (5% commission)
//     } else if (betOn === 'tie' && winner === 'tie') {
//       payoutMultiplier = 9; // 8:1 payout
//     }
    
//     const payout = payoutMultiplier > 0 ? parseFloat((betAmount * payoutMultiplier).toFixed(2)) : 0;
//     const win = payout > 0;
    
//     return NextResponse.json({
//       win,
//       winner,
//       playerHand,
//       bankerHand,
//       playerValue,
//       bankerValue,
//       payout,
//       payoutMultiplier,
//       success: true
//     });
//   } catch (error) {
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }
// app/api/baccarat/route.ts
import { NextResponse } from "next/server";

// Card value mapping
const cardValues: Record<string, number> = {
  A: 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
  "10": 0, J: 0, Q: 0, K: 0,
};

// Suits & ranks
const suits = ["hearts", "diamonds", "clubs", "spades"] as const;
const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"] as const;

type Suit = (typeof suits)[number];
type Rank = (typeof ranks)[number];

interface Card {
  suit: Suit;
  rank: Rank;
}

interface BaccaratRequestBody {
  betAmount: number;
  betOn: "player" | "banker" | "tie";
}

// Create a deck
function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

// Shuffle a deck
function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Calculate hand value
function getHandValue(cards: Card[]): number {
  const sum = cards.reduce((total, card) => total + cardValues[card.rank], 0);
  return sum % 10;
}

// Third card rules
function shouldPlayerDrawThird(playerValue: number): boolean {
  return playerValue <= 5;
}

function shouldBankerDrawThird(bankerValue: number, playerThirdCard: Card | null): boolean {
  if (bankerValue <= 2) return true;
  if (bankerValue === 3) return !playerThirdCard || cardValues[playerThirdCard.rank] !== 8;
  if (bankerValue === 4) return !!playerThirdCard && [2,3,4,5,6,7].includes(cardValues[playerThirdCard!.rank]);
  if (bankerValue === 5) return !!playerThirdCard && [4,5,6,7].includes(cardValues[playerThirdCard.rank]);
  if (bankerValue === 6) return !!playerThirdCard && [6,7].includes(cardValues[playerThirdCard.rank]);
  return false;
}

export async function POST(request: Request) {
  try {
    const body: BaccaratRequestBody = await request.json();
    const { betAmount, betOn } = body;

    if (typeof betAmount !== "number" || !["player","banker","tie"].includes(betOn)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const deck = shuffleDeck(createDeck());

    const playerHand: Card[] = [deck.pop()!, deck.pop()!];
    const bankerHand: Card[] = [deck.pop()!, deck.pop()!];

    let playerValue = getHandValue(playerHand);
    let bankerValue = getHandValue(bankerHand);

    const hasNatural = playerValue >= 8 || bankerValue >= 8;

    let playerThirdCard: Card | null = null;
    if (!hasNatural && shouldPlayerDrawThird(playerValue)) {
      playerThirdCard = deck.pop()!;
      playerHand.push(playerThirdCard);
      playerValue = getHandValue(playerHand);
    }

    if (!hasNatural && shouldBankerDrawThird(bankerValue, playerThirdCard)) {
      bankerHand.push(deck.pop()!);
      bankerValue = getHandValue(bankerHand);
    }

    let winner: "player" | "banker" | "tie";
    if (playerValue > bankerValue) winner = "player";
    else if (bankerValue > playerValue) winner = "banker";
    else winner = "tie";

    let payoutMultiplier = 0;
    if (betOn === "player" && winner === "player") payoutMultiplier = 2;
    else if (betOn === "banker" && winner === "banker") payoutMultiplier = 1.95;
    else if (betOn === "tie" && winner === "tie") payoutMultiplier = 9;

    const payout = payoutMultiplier > 0 ? parseFloat((betAmount * payoutMultiplier).toFixed(2)) : 0;
    const win = payout > 0;

    return NextResponse.json({
      win,
      winner,
      playerHand,
      bankerHand,
      playerValue,
      bankerValue,
      payout,
      payoutMultiplier,
      success: true
    });

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
