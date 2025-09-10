// Card types for casino games

export type Suit = '♠' | '♥' | '♦' | '♣';

export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

export interface Deck {
  cards: Card[];
  shuffle: () => void;
  deal: () => Card | undefined;
  reset: () => void;
}

export interface Hand {
  cards: Card[];
  value: number;
  isBusted: boolean;
  isBlackjack: boolean;
}
