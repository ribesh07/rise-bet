// app/api/hilo/route.ts
import { NextResponse } from 'next/server';

// Card values: Ace=1, 2-10=face value, Jack=11, Queen=12, King=13
const CARD_VALUES = {
  'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
};

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

interface Card {
  rank: string;
  suit: string;
  value: number;
}

function generateRandomCard(): Card {
  const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
  const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
  const value = CARD_VALUES[rank as keyof typeof CARD_VALUES];
  
  return { rank, suit, value };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { betAmount, prediction, currentCard } = body;

    // Validation
    if (typeof betAmount !== 'number' || betAmount <= 0) {
      return NextResponse.json({ error: 'Invalid bet amount' }, { status: 400 });
    }

    if (!['higher', 'lower'].includes(prediction)) {
      return NextResponse.json({ error: 'Prediction must be "higher" or "lower"' }, { status: 400 });
    }

    if (!currentCard || !currentCard.rank || !currentCard.suit) {
      return NextResponse.json({ error: 'Invalid current card' }, { status: 400 });
    }

    // Generate next card
    const nextCard = generateRandomCard();
    const currentValue = CARD_VALUES[currentCard.rank as keyof typeof CARD_VALUES];
    const nextValue = nextCard.value;

    // Determine win/loss
    let win = false;
    if (prediction === 'higher' && nextValue > currentValue) {
      win = true;
    } else if (prediction === 'lower' && nextValue < currentValue) {
      win = true;
    } else if (nextValue === currentValue) {
      // Tie - player loses (house edge)
      win = false;
    }

    // Calculate payout (simple 1.9x multiplier for now, similar to Rise)
    const payoutMultiplier = win ? 1.9 : 0;
    const payout = win ? parseFloat((betAmount * payoutMultiplier).toFixed(2)) : 0;

    return NextResponse.json({
      win,
      nextCard,
      currentCard,
      prediction,
      payout,
      payoutMultiplier,
      success: true
    });

  } catch (error) {
    console.error('Hi-Lo API Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET endpoint to get a new starting card
export async function GET() {
  try {
    const startingCard = generateRandomCard();
    
    return NextResponse.json({
      card: startingCard,
      success: true
    });

  } catch (error) {
    console.error('Hi-Lo GET API Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
