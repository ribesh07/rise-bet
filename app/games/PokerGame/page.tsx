"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

// Card types
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface Card {
  suit: Suit;
  rank: Rank;
  held: boolean;
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

interface GameState {
  cards: Card[];
  gamePhase: 'betting' | 'initial-deal' | 'hold' | 'final-deal' | 'result' | 'shuffling';
  balance: number;
  bet: number;
  lastWin: number;
  handResult: HandResult | null;
  isDealing: boolean;
  isShuffling: boolean;
}

const PokerGame = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    gamePhase: 'betting',
    balance: 1000,
    bet: 5,
    lastWin: 0,
    handResult: null,
    isDealing: false,
    isShuffling: false
  });

  // Bet amounts for chips
  const chipValues = [1, 5, 10, 25, 50, 100];

  // Paytable - matches Stake's Jacks or Better paytable
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

  // Create a deck of cards
  const createDeck = useCallback((): Card[] => {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck: Card[] = [];
    
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({
          suit,
          rank,
          held: false,
          id: `${suit}-${rank}`
        });
      }
    }
    
    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
  }, []);

  // Get rank value for comparison
  const getRankValue = (rank: Rank): number => {
    const values: Record<Rank, number> = {
      'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
    };
    return values[rank];
  };

  // Evaluate poker hand
  const evaluateHand = useCallback((cards: Card[]): HandResult => {
    if (cards.length !== 5) {
      return { rank: 'high-card', description: 'High Card', multiplier: 0 };
    }

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
  }, []);

  // Get card symbol
  const getCardSymbol = (suit: Suit): string => {
    const symbols = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠'
    };
    return symbols[suit];
  };

  // Get card color
  const getCardColor = (suit: Suit): string => {
    return suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-gray-800';
  };

  // Deal initial hand with shuffle animation
  const dealHand = useCallback(() => {
    if (gameState.bet > gameState.balance) return;
    
    // Start shuffling phase
    setGameState(prev => ({
      ...prev,
      gamePhase: 'shuffling',
      isShuffling: true,
      balance: prev.balance - prev.bet,
      handResult: null,
      lastWin: 0
    }));
    
    // Show shuffling animation for 1.5 seconds
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        gamePhase: 'initial-deal',
        isShuffling: false,
        isDealing: true
      }));
      
      const deck = createDeck();
      const hand = deck.slice(0, 5);
      
      // Deal cards after shuffle
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          cards: hand,
          gamePhase: 'hold',
          isDealing: false
        }));
      }, 1000);
    }, 1500);
  }, [gameState.bet, gameState.balance, createDeck]);

  // Toggle hold on card
  const toggleHold = (cardIndex: number) => {
    if (gameState.gamePhase !== 'hold') return;
    
    setGameState(prev => ({
      ...prev,
      cards: prev.cards.map((card, index) => 
        index === cardIndex ? { ...card, held: !card.held } : card
      )
    }));
  };

  // Draw final cards
  const drawCards = useCallback(() => {
    if (gameState.gamePhase !== 'hold') return;
    
    setGameState(prev => ({ ...prev, gamePhase: 'final-deal', isDealing: true }));
    
    const deck = createDeck();
    const usedCards = new Set(gameState.cards.map(card => card.id));
    const availableCards = deck.filter(card => !usedCards.has(card.id));
    
    let cardIndex = 0;
    const newHand = gameState.cards.map(card => {
      if (!card.held) {
        return { ...availableCards[cardIndex++], held: false };
      }
      return card;
    });
    
    setTimeout(() => {
      const result = evaluateHand(newHand);
      const winAmount = result.multiplier * gameState.bet;
      
      setGameState(prev => ({
        ...prev,
        cards: newHand,
        gamePhase: 'result',
        isDealing: false,
        handResult: result,
        balance: prev.balance + winAmount,
        lastWin: winAmount
      }));
    }, 1000);
  }, [gameState.cards, gameState.bet, createDeck, evaluateHand]);

  // New game
  const newGame = () => {
    setGameState(prev => ({
      ...prev,
      cards: [],
      gamePhase: 'betting',
      handResult: null,
      lastWin: 0
    }));
  };

  // Set bet amount
  const setBet = (amount: number) => {
    if (gameState.gamePhase === 'betting') {
      setGameState(prev => ({ ...prev, bet: Math.min(amount, prev.balance) }));
    }
  };

  // Get button text
  const getButtonText = () => {
    switch (gameState.gamePhase) {
      case 'betting': return `Deal - $${gameState.bet}`;
      case 'shuffling': return 'Shuffling...';
      case 'initial-deal': return 'Dealing...';
      case 'hold': return 'Draw Cards';
      case 'final-deal': return 'Drawing...';
      case 'result': return 'New Game';
      default: return 'Deal';
    }
  };

  // Main action handler
  const handleMainAction = () => {
    switch (gameState.gamePhase) {
      case 'betting':
        dealHand();
        break;
      case 'hold':
        drawCards();
        break;
      case 'result':
        newGame();
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      {/* Header */}
      <div className="bg-gray-800 border-b-2 border-yellow-500 p-4 rounded-t-xl">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-yellow-400">🃏 Video Poker</h1>
            <div className="text-lg">Balance: <span className="text-green-400">${gameState.balance.toLocaleString()}</span></div>
          </div>
          <div className="flex gap-4">
            <div className="text-sm">RTP: <span className="text-yellow-400">99.54%</span></div>
            <div className="text-sm">Game: <span className="text-yellow-400">Jacks or Better</span></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-gray-800 rounded-b-xl shadow-2xl">
        {/* Paytable */}
        <div className="bg-gray-900 border-2 border-gray-600 rounded-xl p-6 m-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-4 text-center">PAYTABLE (per credit)</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            {Object.entries(paytable).reverse().map(([rank, info]) => (
              <div 
                key={rank}
                className={`flex justify-between p-2 rounded ${
                  gameState.handResult?.rank === rank ? 'bg-yellow-500 text-black font-bold' : 'bg-gray-800 text-gray-300'
                }`}
              >
                <span>{info.description}</span>
                <span>{info.multiplier === 0 ? '-' : `${info.multiplier}:1`}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Game Area */}
        <div className="p-6">
          {/* Cards */}
          <div className="mb-8">
            <div className="flex justify-center gap-4 mb-4 min-h-[144px]">
              {/* Shuffle Animation */}
              {gameState.gamePhase === 'shuffling' && (
                <div className="flex justify-center items-center w-full h-32">
                  <div className="relative">
                    {/* Animated cards stack */}
                    {[...Array(8)].map((_, index) => (
                      <div
                        key={index}
                        className="absolute w-20 h-28 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg border-2 border-white shadow-lg"
                        style={{
                          transform: `translate(${Math.sin((Date.now() / 200) + index) * 15}px, ${Math.cos((Date.now() / 200) + index) * 8}px) rotate(${Math.sin((Date.now() / 300) + index) * 10}deg)`,
                          zIndex: index,
                          left: `${index * 2}px`,
                          animation: `shuffle-${index} 0.8s infinite ease-in-out`,
                          animationDelay: `${index * 0.1}s`
                        }}
                      >
                        <div className="flex items-center justify-center h-full text-white font-bold text-lg">
                          🃏
                        </div>
                      </div>
                    ))}
                    {/* Shuffle text */}
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-lg animate-pulse">
                      Shuffling Cards...
                    </div>
                  </div>
                </div>
              )}
              
              {/* Regular Cards */}
              {gameState.gamePhase !== 'shuffling' && gameState.cards.map((card, index) => (
                <div
                  key={`${card.id}-${index}`}
                  onClick={() => toggleHold(index)}
                  className={`
                    relative w-24 h-32 bg-white rounded-lg border-2 cursor-pointer transition-all duration-200 animate-fade-in
                    ${card.held ? 'border-yellow-400 transform -translate-y-2 shadow-lg shadow-yellow-400/50' : 'border-gray-300 hover:border-blue-400'}
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col justify-between h-full p-2">
                    <div className={`text-lg font-bold ${getCardColor(card.suit)}`}>
                      {card.rank}
                    </div>
                    <div className={`text-2xl ${getCardColor(card.suit)} self-center`}>
                      {getCardSymbol(card.suit)}
                    </div>
                    <div className={`text-lg font-bold ${getCardColor(card.suit)} transform rotate-180 self-end`}>
                      {card.rank}
                    </div>
                  </div>
                  
                  {/* Hold indicator */}
                  {card.held && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-bold animate-pulse">
                      HELD
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Hold instruction */}
            {gameState.gamePhase === 'hold' && (
              <div className="text-center text-blue-400 mb-4">
                Click cards to hold them
              </div>
            )}
          </div>

          {/* Result */}
          {gameState.handResult && gameState.gamePhase === 'result' && (
            <div className="text-center mb-6 animate-fade-in">
              <div className={`text-2xl font-bold mb-2 ${
                gameState.handResult.multiplier > 0 ? 'text-green-400' : 'text-gray-400'
              }`}>
                {gameState.handResult.description}
              </div>
              {gameState.lastWin > 0 && (
                <div className="text-3xl font-bold text-yellow-400 animate-pulse">
                  WIN: ${gameState.lastWin}
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="bg-gray-900 rounded-xl p-6">
            {/* Bet Selection */}
            <div className="mb-6">
              <label className="block text-sm text-gray-300 mb-3">Bet Amount</label>
              <div className="flex gap-2 justify-center mb-4">
                {chipValues.map((value) => (
                  <button
                    key={value}
                    onClick={() => setBet(value)}
                    disabled={gameState.gamePhase !== 'betting' || value > gameState.balance}
                    className={`
                      px-4 py-2 rounded-full font-semibold transition-all duration-200
                      ${gameState.bet === value
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105'
                        : 'bg-gray-700 border border-gray-600 text-gray-200 hover:border-gray-500 hover:bg-gray-600'
                      }
                      ${(gameState.gamePhase !== 'betting' || value > gameState.balance) ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    ${value}
                  </button>
                ))}
              </div>
              
              {/* Custom bet input */}
              <div className="flex justify-center gap-2">
                <input
                  type="number"
                  value={gameState.bet}
                  onChange={(e) => setBet(Math.max(1, parseInt(e.target.value) || 1))}
                  disabled={gameState.gamePhase !== 'betting'}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white w-24 text-center focus:border-yellow-400 focus:outline-none disabled:opacity-50"
                  min={1}
                  max={gameState.balance}
                />
                <button
                  onClick={() => setBet(gameState.balance)}
                  disabled={gameState.gamePhase !== 'betting'}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Main Action Button */}
            <button
              onClick={handleMainAction}
              disabled={(
                gameState.gamePhase === 'shuffling' ||
                gameState.gamePhase === 'initial-deal' || 
                gameState.gamePhase === 'final-deal' ||
                (gameState.gamePhase === 'betting' && gameState.bet > gameState.balance)
              )}
              className={`
                w-full py-4 text-2xl font-bold rounded-xl transition-all duration-300
                ${gameState.gamePhase === 'hold'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                  : gameState.gamePhase === 'result' && gameState.lastWin > 0
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:shadow-lg hover:scale-105
              `}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokerGame;
