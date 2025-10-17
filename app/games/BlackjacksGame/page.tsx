'use client';

import React, { useState, useEffect } from 'react';
import { Card, Rank, Suit } from '@/types/card';

// Card types and utilities
const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

interface GameCard extends Card {
  id: string;
  hidden?: boolean;
}

interface GameState {
  playerHand: GameCard[];
  dealerHand: GameCard[];
  deck: GameCard[];
  playerScore: number;
  dealerScore: number;
  gameStatus: 'betting' | 'playing' | 'dealer' | 'finished';
  result: string;
  balance: number;
  currentBet: number;
  betAmount: string;
  isAutoplay: boolean;
  wins: number;
  losses: number;
  pushes: number;
}

const BlackjackGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerHand: [],
    dealerHand: [],
    deck: [],
    playerScore: 0,
    dealerScore: 0,
    gameStatus: 'betting',
    result: '',
    balance: 1000.00,
    currentBet: 0,
    betAmount: '1.00',
    isAutoplay: false,
    wins: 0,
    losses: 0,
    pushes: 0
  });

  // Create and shuffle deck
  const createDeck = (): GameCard[] => {
    const newDeck: GameCard[] = [];
    SUITS.forEach(suit => {
      RANKS.forEach(rank => {
        newDeck.push({
          id: `${suit}-${rank}-${Math.random()}`,
          suit,
          rank: rank as Rank,
          value: getCardValue(rank)
        });
      });
    });
    return shuffleDeck(newDeck);
  };

  const shuffleDeck = (deck: GameCard[]): GameCard[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getCardValue = (rank: string): number => {
    if (rank === 'A') return 11;
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    return parseInt(rank);
  };

  // Calculate hand value with Ace handling
  const calculateHandValue = (hand: GameCard[]): number => {
    let value = 0;
    let aces = 0;

    hand.forEach(card => {
      if (card.rank === 'A') {
        aces++;
        value += 11;
      } else {
        value += card.value;
      }
    });

    // Adjust for Aces
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    return value;
  };

  // Deal a card
  const dealCard = (deck: GameCard[]): [GameCard, GameCard[]] => {
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    return [card, newDeck];
  };

  // Place bet
  const placeBet = (amount: number) => {
    if (amount <= gameState.balance && amount > 0) {
      setGameState(prev => ({
        ...prev,
        currentBet: amount,
        balance: prev.balance - amount,
        gameStatus: 'playing'
      }));
      startNewGame(amount);
    }
  };

  // Start new game
  const startNewGame = (bet: number) => {
    const deck = createDeck();
    let currentDeck = [...deck];
    
    // Deal initial cards
    const [playerCard1, deck1] = dealCard(currentDeck);
    currentDeck = deck1;
    const [dealerCard1, deck2] = dealCard(currentDeck);
    currentDeck = deck2;
    const [playerCard2, deck3] = dealCard(currentDeck);
    currentDeck = deck3;
    const [dealerCard2, deck4] = dealCard(currentDeck);
    currentDeck = deck4;

    // Hide dealer's second card
    dealerCard2.hidden = true;

    const playerHand = [playerCard1, playerCard2];
    const dealerHand = [dealerCard1, dealerCard2];

    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue([dealerCard1]); // Only count visible card

    setGameState(prev => ({
      ...prev,
      playerHand,
      dealerHand,
      deck: currentDeck,
      playerScore,
      dealerScore,
      gameStatus: playerScore === 21 ? 'dealer' : 'playing',
      result: ''
    }));

    // Check for immediate blackjack
    if (playerScore === 21) {
      setTimeout(() => dealerTurn(playerHand, dealerHand, currentDeck), 1000);
    }
  };

  // Player hits
  const hit = () => {
    const [newCard, newDeck] = dealCard(gameState.deck);
    const newPlayerHand = [...gameState.playerHand, newCard];
    const newPlayerScore = calculateHandValue(newPlayerHand);

    setGameState(prev => ({
      ...prev,
      playerHand: newPlayerHand,
      deck: newDeck,
      playerScore: newPlayerScore,
      gameStatus: newPlayerScore >= 21 ? 'dealer' : 'playing'
    }));

    if (newPlayerScore >= 21) {
      setTimeout(() => dealerTurn(newPlayerHand, gameState.dealerHand, newDeck), 1000);
    }
  };

  // Player stands
  const stand = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'dealer' }));
    setTimeout(() => dealerTurn(gameState.playerHand, gameState.dealerHand, gameState.deck), 1000);
  };

  // Dealer's turn
  const dealerTurn = (playerHand: GameCard[], dealerHand: GameCard[], deck: GameCard[]) => {
    let currentDealerHand = dealerHand.map(card => ({ ...card, hidden: card.hidden === true ? false : false }));
    let currentDeck = [...deck];
    let dealerScore = calculateHandValue(currentDealerHand);

    const dealerPlay = () => {
      if (dealerScore < 17) {
        const [newCard, newDeck] = dealCard(currentDeck);
        currentDealerHand = [
          ...currentDealerHand,
          { ...newCard, hidden: false }
        ];
        currentDeck = newDeck;
        dealerScore = calculateHandValue(currentDealerHand);
        
        setGameState(prev => ({
          ...prev,
          dealerHand: currentDealerHand,
          deck: currentDeck,
          dealerScore
        }));

        setTimeout(dealerPlay, 1000);
      } else {
        finishGame(playerHand, currentDealerHand);
      }
    };

    setGameState(prev => ({
      ...prev,
      dealerHand: currentDealerHand,
      dealerScore
    }));

    setTimeout(dealerPlay, 1000);
  };

  // Finish game and determine winner
  const finishGame = (playerHand: GameCard[], dealerHand: GameCard[]) => {
    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);
    let result = '';
    let winnings = 0;
    let wins = gameState.wins;
    let losses = gameState.losses;
    let pushes = gameState.pushes;

    if (playerScore > 21) {
      result = 'Bust! You lose';
      losses++;
    } else if (dealerScore > 21) {
      result = 'Dealer busts! You win';
      winnings = gameState.currentBet * 2;
      wins++;
    } else if (playerScore === 21 && playerHand.length === 2 && dealerScore !== 21) {
      result = 'Blackjack! You win';
      winnings = Math.floor(gameState.currentBet * 2.5);
      wins++;
    } else if (dealerScore === 21 && dealerHand.length === 2 && playerScore !== 21) {
      result = 'Dealer blackjack! You lose';
      losses++;
    } else if (playerScore === dealerScore) {
      result = 'Push!';
      winnings = gameState.currentBet;
      pushes++;
    } else if (playerScore > dealerScore) {
      result = 'You win!';
      winnings = gameState.currentBet * 2;
      wins++;
    } else {
      result = 'You lose!';
      losses++;
    }

    setGameState(prev => ({
      ...prev,
      gameStatus: 'finished',
      result,
      balance: prev.balance + winnings,
      playerScore,
      dealerScore,
      wins,
      losses,
      pushes
    }));
  };

  // Reset for new game
  const newGame = () => {
    setGameState(prev => ({
      ...prev,
      playerHand: [],
      dealerHand: [],
      deck: [],
      playerScore: 0,
      dealerScore: 0,
      gameStatus: 'betting',
      result: '',
      currentBet: 0
    }));
  };

  // Bet amount handlers
  const handleBetAmountChange = (value: string) => {
    setGameState(prev => ({ ...prev, betAmount: value }));
  };

  const handleMaxBet = () => {
    setGameState(prev => ({ ...prev, betAmount: prev.balance.toFixed(2) }));
  };

  const handleHalfBet = () => {
    const currentBet = parseFloat(gameState.betAmount);
    setGameState(prev => ({ ...prev, betAmount: (currentBet / 2).toFixed(2) }));
  };

  const handleDoubleBet = () => {
    const currentBet = parseFloat(gameState.betAmount);
    const newBet = Math.min(currentBet * 2, gameState.balance);
    setGameState(prev => ({ ...prev, betAmount: newBet.toFixed(2) }));
  };

  const placeBetWithAmount = () => {
    const betAmount = parseFloat(gameState.betAmount);
    if (betAmount > 0 && betAmount <= gameState.balance) {
      placeBet(betAmount);
    }
  };

  // Card component - Rise style
  const CardComponent: React.FC<{ card: GameCard }> = ({ card }) => {
    const suitColor = card.suit === '♥' || card.suit === '♦' ? '#ff4757' : '#2f3542';
    
    if (card.hidden) {
      return (
        <div className="w-14 h-20 bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-500 rounded-lg flex items-center justify-center mx-1 shadow-lg transform hover:scale-105 transition-transform">
          <div className="w-8 h-8 bg-blue-400 rounded-full opacity-50"></div>
        </div>
      );
    }

    return (
      <div className="w-14 h-20 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center mx-1 shadow-lg transform hover:scale-105 transition-transform">
        <div className="font-bold text-xs" style={{ color: suitColor }}>
          {card.rank}
        </div>
        <div className="text-lg leading-none" style={{ color: suitColor }}>
          {card.suit}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Game Area */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Blackjack</h1>
              <div className="text-gray-400">Classic Blackjack Game</div>
            </div>

            {/* Game Table */}
            <div className="bg-[#0f212e] rounded-2xl p-8 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/20"></div>
              
              {/* Dealer Section */}
              <div className="relative mb-12">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">D</span>
                    </div>
                    <span className="text-lg font-semibold">Dealer</span>
                  </div>
                  <div className="text-xl font-bold">
                    {gameState.dealerScore}
                  </div>
                </div>
                <div className="flex justify-center items-center min-h-[100px]">
                  {gameState.dealerHand.length === 0 ? (
                    <div className="text-gray-500">Dealer cards will appear here</div>
                  ) : (
                    gameState.dealerHand.map(card => (
                      <CardComponent key={card.id} card={card} />
                    ))
                  )}
                </div>
              </div>

              {/* Center Line */}
              <div className="border-t border-gray-700 my-8"></div>

              {/* Player Section */}
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">P</span>
                    </div>
                    <span className="text-lg font-semibold">Player</span>
                  </div>
                  <div className="text-xl font-bold">
                    {gameState.playerScore}
                  </div>
                </div>
                <div className="flex justify-center items-center min-h-[100px]">
                  {gameState.playerHand.length === 0 ? (
                    <div className="text-gray-500">Your cards will appear here</div>
                  ) : (
                    gameState.playerHand.map(card => (
                      <CardComponent key={card.id} card={card} />
                    ))
                  )}
                </div>
              </div>

              {/* Game Result */}
              {gameState.result && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <div className="bg-white text-black px-8 py-4 rounded-xl text-xl font-bold text-center">
                    {gameState.result}
                  </div>
                </div>
              )}
            </div>

            {/* Game Controls */}
            <div className="flex justify-center space-x-4 mb-6">
              {gameState.gameStatus === 'playing' && (
                <>
                  <button
                    onClick={hit}
                    className="bg-[#00e701] hover:bg-[#00d001] text-black font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    Hit
                  </button>
                  <button
                    onClick={stand}
                    className="bg-[#ff6b47] hover:bg-[#ff5722] text-white font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    Stand
                  </button>
                </>
              )}
              
              {gameState.gameStatus === 'finished' && (
                <button
                  onClick={newGame}
                  className="bg-[#00e701] hover:bg-[#00d001] text-black font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  New Game
                </button>
              )}

              {gameState.gameStatus === 'dealer' && (
                <div className="bg-gray-700 text-gray-300 font-bold py-3 px-8 rounded-lg">
                  Dealer Playing...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Betting Panel */}
        <div className="w-full lg:w-80 bg-[#0f212e] p-6">
          <div className="space-y-6">
            {/* Balance */}
            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Balance</div>
              <div className="text-2xl font-bold">${gameState.balance.toFixed(2)}</div>
            </div>

            {/* Bet Amount */}
            {gameState.gameStatus === 'betting' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bet Amount</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      $
                    </div>
                    <input
                      type="number"
                      value={gameState.betAmount}
                      onChange={(e) => handleBetAmountChange(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-[#00e701]"
                      step="0.01"
                      min="0.01"
                      max={gameState.balance}
                    />
                  </div>
                </div>

                {/* Quick Bet Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleHalfBet}
                    className="bg-[#2f3349] hover:bg-[#3f4359] text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    1/2
                  </button>
                  <button
                    onClick={handleDoubleBet}
                    className="bg-[#2f3349] hover:bg-[#3f4359] text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    2x
                  </button>
                  <button
                    onClick={handleMaxBet}
                    className="bg-[#2f3349] hover:bg-[#3f4359] text-white py-2 px-4 rounded-lg transition-colors col-span-2"
                  >
                    Max
                  </button>
                </div>

                {/* Bet Button */}
                <button
                  onClick={placeBetWithAmount}
                  disabled={parseFloat(gameState.betAmount) > gameState.balance || parseFloat(gameState.betAmount) <= 0}
                  className="w-full bg-[#00e701] hover:bg-[#00d001] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-4 px-6 rounded-lg transition-colors"
                >
                  Bet ${gameState.betAmount}
                </button>
              </div>
            )}

            {/* Game Stats */}
            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-3">Game Stats</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Wins:</span>
                  <span className="text-green-400">{gameState.wins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Losses:</span>
                  <span className="text-red-400">{gameState.losses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pushes:</span>
                  <span className="text-yellow-400">{gameState.pushes}</span>
                </div>
              </div>
            </div>

            {/* Current Bet Info */}
            {gameState.currentBet > 0 && (
              <div className="bg-[#1a1a1a] rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">Current Bet</div>
                <div className="text-xl font-bold text-[#00e701]">${gameState.currentBet.toFixed(2)}</div>
              </div>
            )}

            {/* Auto Features */}
            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-3">Features</div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={gameState.isAutoplay}
                  onChange={(e) => setGameState(prev => ({ ...prev, isAutoplay: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-700 bg-[#2f3349] text-[#00e701] focus:ring-[#00e701]"
                />
                <span className="text-sm">Auto Play</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlackjackGame;