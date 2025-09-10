// app/api/poker/route.ts
import { NextResponse } from 'next/server';

// Card types
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface Card {
  suit: Suit;
  rank: Rank;
  id: string;
}

type HandRank = 
  | 'high-card'
  | 'pair'
  | 'two-pair' 
  | 'three-of-a-kind'
  | 'straight'
  | 'flush'
  | 'full-house'
  | 'four-of-a-kind'
  | 'straight-flush'
  | 'royal-flush';

interface HandResult {
  rank: HandRank;
  description: string;
  multiplier: number;
}

// Create and shuffle deck
function createDeck(): Card[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];
  
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        suit,
        rank,
        id: `${suit}-${rank}`
      });
    }
  }
  
  // Shuffle using Fisher-Yates algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
}

// Get rank value for comparison
function getRankValue(rank: Rank): number {
  const values: Record<Rank, number> = {
    'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
  };
  return values[rank];
}

// Evaluate poker hand
function evaluateHand(cards: Card[]): HandResult {
  if (cards.length !== 5) {
    return { rank: 'high-card', description: 'High Card', multiplier: 0 };
  }

  const paytable: Record<HandRank, { multiplier: number; description: string }> = {
    'high-card': { multiplier: 0, description: 'High Card' },
    'pair': { multiplier: 1, description: 'Jacks or Better' },
    'two-pair': { multiplier: 2, description: 'Two Pair' },
    'three-of-a-kind': { multiplier: 3, description: 'Three of a Kind' },
    'straight': { multiplier: 4, description: 'Straight' },
    'flush': { multiplier: 6, description: 'Flush' },
    'full-house': { multiplier: 9, description: 'Full House' },
    'four-of-a-kind': { multiplier: 25, description: 'Four of a Kind' },
    'straight-flush': { multiplier: 50, description: 'Straight Flush' },
    'royal-flush': { multiplier: 800, description: 'Royal Flush' }
  };

  const ranks = cards.map(card => card.rank);
  const suits = cards.map(card => card.suit);
  const rankValues = ranks.map(getRankValue).sort((a, b) => a - b);
  
  // Count occurrences of each rank
  const rankCounts: Record<string, number> = {};
  ranks.forEach(rank => {
    rankCounts[rank] = (rankCounts[rank] || 0) + 1;
  });
  
  const counts = Object.values(rankCounts).sort((a, b) => b - a);
  const isFlush = suits.every(suit => suit === suits[0]);
  
  // Check for straight
  let isStraight = false;
  if (rankValues[4] - rankValues[0] === 4 && new Set(rankValues).size === 5) {
    isStraight = true;
  }
  // Check for A-2-3-4-5 straight (wheel)
  else if (rankValues.join(',') === '1,2,3,4,5') {
    isStraight = true;
  }
  // Check for 10-J-Q-K-A straight
  else if (rankValues.join(',') === '1,10,11,12,13') {
    isStraight = true;
  }
  
  // Royal flush
  if (isFlush && isStraight && rankValues.join(',') === '1,10,11,12,13') {
    return { rank: 'royal-flush', description: paytable['royal-flush'].description, multiplier: paytable['royal-flush'].multiplier };
  }
  
  // Straight flush
  if (isFlush && isStraight) {
    return { rank: 'straight-flush', description: paytable['straight-flush'].description, multiplier: paytable['straight-flush'].multiplier };
  }
  
  // Four of a kind
  if (counts[0] === 4) {
    return { rank: 'four-of-a-kind', description: paytable['four-of-a-kind'].description, multiplier: paytable['four-of-a-kind'].multiplier };
  }
  
  // Full house
  if (counts[0] === 3 && counts[1] === 2) {
    return { rank: 'full-house', description: paytable['full-house'].description, multiplier: paytable['full-house'].multiplier };
  }
  
  // Flush
  if (isFlush) {
    return { rank: 'flush', description: paytable['flush'].description, multiplier: paytable['flush'].multiplier };
  }
  
  // Straight
  if (isStraight) {
    return { rank: 'straight', description: paytable['straight'].description, multiplier: paytable['straight'].multiplier };
  }
  
  // Three of a kind
  if (counts[0] === 3) {
    return { rank: 'three-of-a-kind', description: paytable['three-of-a-kind'].description, multiplier: paytable['three-of-a-kind'].multiplier };
  }
  
  // Two pair
  if (counts[0] === 2 && counts[1] === 2) {
    return { rank: 'two-pair', description: paytable['two-pair'].description, multiplier: paytable['two-pair'].multiplier };
  }
  
  // Jacks or Better (pair)
  if (counts[0] === 2) {
    const pairRank = Object.keys(rankCounts).find(rank => rankCounts[rank] === 2);
    if (pairRank && ['J', 'Q', 'K', 'A'].includes(pairRank as Rank)) {
      return { rank: 'pair', description: paytable['pair'].description, multiplier: paytable['pair'].multiplier };
    }
  }
  
  // High card
  return { rank: 'high-card', description: paytable['high-card'].description, multiplier: paytable['high-card'].multiplier };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, betAmount, currentCards, heldCards } = body;

    if (typeof betAmount !== 'number' || betAmount <= 0) {
      return NextResponse.json({ error: 'Invalid bet amount' }, { status: 400 });
    }

    if (action === 'deal') {
      // Deal initial 5 cards
      const deck = createDeck();
      const hand = deck.slice(0, 5);
      
      return NextResponse.json({
        cards: hand,
        success: true
      });
    } 
    
    else if (action === 'draw') {
      if (!Array.isArray(currentCards) || !Array.isArray(heldCards)) {
        return NextResponse.json({ error: 'Invalid cards data' }, { status: 400 });
      }

      // Create new deck and remove used cards
      const deck = createDeck();
      const usedCardIds = new Set(currentCards.map((card: Card) => card.id));
      const availableCards = deck.filter(card => !usedCardIds.has(card.id));
      
      let cardIndex = 0;
      const finalHand = currentCards.map((card: Card, index: number) => {
        if (!heldCards[index]) {
          return availableCards[cardIndex++];
        }
        return card;
      });

      // Evaluate the final hand
      const handResult = evaluateHand(finalHand);
      const payout = handResult.multiplier * betAmount;

      return NextResponse.json({
        cards: finalHand,
        handResult,
        payout,
        success: true
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    
  } catch (error) {
    console.error('Poker API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
