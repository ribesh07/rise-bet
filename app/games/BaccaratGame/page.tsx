"use client";

import { useState, useRef } from "react";
import axios from "axios";

const chips = [10, 50, 100, 500, 1000];

interface Card {
  suit: string;
  rank: string;
}

export default function BaccaratGame() {
  const [balance, setBalance] = useState(5000); // Starting balance
  const [betAmount, setBetAmount] = useState(100);
  const [betOn, setBetOn] = useState<'player' | 'banker' | 'tie'>('player');
  const [loading, setLoading] = useState(false);
  interface GameResult {
    playerHand: Card[];
    bankerHand: Card[];
    playerValue: number;
    bankerValue: number;
    winner: 'player' | 'banker' | 'tie';
    win: boolean;
    payout: number;
    payoutMultiplier: number;
  }
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [animating, setAnimating] = useState(false);

  const audioClick = typeof Audio !== "undefined" ? new Audio('/sounds/click.mp3') : null;
  const audioShuffle = typeof Audio !== "undefined" ? new Audio('/sounds/shuffle.mp3') : null;

  const playGame = async () => {
    // Check if player has sufficient balance
    if (betAmount > balance) {
      alert("Insufficient balance for this bet!");
      return;
    }

    setLoading(true);
    setGameResult(null);
    setAnimating(true);
    audioShuffle?.play();

    // Deduct bet amount from balance
    setBalance(prev => prev - betAmount);

    try {
      const res = await axios.post("/api/baccarat", {
        betAmount,
        betOn,
      });
      if (res.status !== 200) {
        throw new Error("Failed to play baccarat");
      }

      const result = res.data;

      // Add delay for card dealing animation
      setTimeout(() => {
        setGameResult(result);
        // Add winnings to balance if player won
        if (result.win && result.payout > 0) {
          setBalance(prev => prev + result.payout);
        }
        setAnimating(false);
        setLoading(false);
      }, 3000);
    } catch (err: unknown) {
      // Return bet amount if there was an error
      setBalance(prev => prev + betAmount);
      let message = "Something went wrong";
      if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data) {
        message = (err as any).response.data.message;
      }
      alert(message);
      setLoading(false);
      setAnimating(false);
    }
  };

  const handleChipClick = (value: number) => {
    audioClick?.play();
    if (value <= balance) {
      setBetAmount(value);
    } else {
      alert(`Insufficient balance! You only have $${balance}`);
    }
  };

  const handleBetClick = (bet: 'player' | 'banker' | 'tie') => {
    audioClick?.play();
    setBetOn(bet);
  };

  const renderCard = (card: Card, index: number) => {
    const suitSymbols = {
      'hearts': '♥️',
      'diamonds': '♦️',
      'clubs': '♣️',
      'spades': '♠️'
    };

    const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
    
    return (
      <div
        key={index}
        className={`bg-white border-2 border-gray-300 rounded-lg p-2 m-1 min-w-[60px] min-h-[80px] flex flex-col items-center justify-center text-xs shadow-md transform transition-all duration-300 ${
          animating ? 'animate-pulse scale-95' : 'scale-100'
        }`}
        style={{ animationDelay: `${index * 200}ms` }}
      >
        <div className={`font-bold text-lg ${isRed ? 'text-red-500' : 'text-black'}`}>
          {card.rank}
        </div>
        <div className="text-lg">
          {suitSymbols[card.suit as keyof typeof suitSymbols] || '?'}
        </div>
      </div>
    );
  };

  const renderHand = (hand: Card[], title: string, value: number) => {
    return (
      <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg min-w-[200px]">
        <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
        <div className="flex flex-wrap justify-center mb-2">
          {hand.map((card, index) => renderCard(card, index))}
        </div>
        <div className="text-xl font-bold text-yellow-400">
          Value: {value}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-green-900 text-white">
      {/* Header with Balance */}
      <div className="fixed top-0 left-0 w-full bg-gray-800 border-b-2 border-yellow-500 p-4 z-10">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-yellow-400">🎴 Baccarat</h1>
          <div className="flex items-center gap-6">
            <div className="text-xl">
              Balance: <span className={`font-bold ${balance < betAmount ? 'text-red-400' : 'text-green-400'}`}>${balance.toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-300">
              Current Bet: <span className="text-yellow-400 font-semibold">${betAmount}</span> on <span className="capitalize font-semibold text-blue-400">{betOn}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game Content */}
      <div className="flex w-full pt-20 p-4">
        {/* Game Table */}
        <div className="flex-1 flex flex-col items-center justify-center">
        
        {/* Game Area */}
        <div className="bg-green-800 rounded-xl p-8 shadow-2xl border-4 border-yellow-600 min-w-[600px]">
          {/* Cards Display */}
          {(gameResult || animating) && (
            <div className="flex justify-around mb-8">
              {gameResult && (
                <>
                  {renderHand(gameResult.playerHand, "Player", gameResult.playerValue)}
                  {renderHand(gameResult.bankerHand, "Banker", gameResult.bankerValue)}
                </>
              )}
              {animating && !gameResult && (
                <>
                  <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg min-w-[200px]">
                    <h3 className="text-lg font-semibold mb-2 text-white">Player</h3>
                    <div className="flex">
                      <div className="bg-blue-500 w-16 h-20 rounded-lg m-1 animate-pulse"></div>
                      <div className="bg-blue-500 w-16 h-20 rounded-lg m-1 animate-pulse" style={{animationDelay: '200ms'}}></div>
                    </div>
                    <div className="text-lg text-white mt-2">Dealing...</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg min-w-[200px]">
                    <h3 className="text-lg font-semibold mb-2 text-white">Banker</h3>
                    <div className="flex">
                      <div className="bg-red-500 w-16 h-20 rounded-lg m-1 animate-pulse" style={{animationDelay: '400ms'}}></div>
                      <div className="bg-red-500 w-16 h-20 rounded-lg m-1 animate-pulse" style={{animationDelay: '600ms'}}></div>
                    </div>
                    <div className="text-lg text-white mt-2">Dealing...</div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Result Display */}
          {gameResult && !loading && (
            <div className="text-center mb-6 p-4 bg-gray-900 rounded-lg">
              <p className="text-2xl font-bold mb-2">
                {gameResult.win ? "🎉 You Win!" : "❌ You Lose!"}
              </p>
              <p className="text-lg mb-1">Winner: <span className="font-bold text-yellow-400 capitalize">{gameResult.winner}</span></p>
              <p className="text-lg mb-1">Your Bet: <span className="font-bold text-blue-400 capitalize">{betOn}</span></p>
              <p className="text-lg mb-1">Multiplier: <span className="font-bold">{gameResult.payoutMultiplier}x</span></p>
              <p className="text-lg">Payout: <span className="font-bold text-green-400">${gameResult.payout}</span></p>
            </div>
          )}

          {/* Betting Areas */}
          <div className="flex justify-around mb-6">
            <button
              onClick={() => handleBetClick('player')}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 ${
                betOn === 'player'
                  ? 'bg-blue-600 ring-4 ring-blue-400 shadow-lg'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Player (1:1)
            </button>
            <button
              onClick={() => handleBetClick('tie')}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 ${
                betOn === 'tie'
                  ? 'bg-purple-600 ring-4 ring-purple-400 shadow-lg'
                  : 'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              Tie (8:1)
            </button>
            <button
              onClick={() => handleBetClick('banker')}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 ${
                betOn === 'banker'
                  ? 'bg-red-600 ring-4 ring-red-400 shadow-lg'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              Banker (0.95:1)
            </button>
          </div>

          {/* Deal Button */}
          <div className="text-center">
            <button
              onClick={playGame}
              disabled={loading}
              className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 rounded-lg text-xl font-bold text-white transition-all transform hover:scale-105 disabled:scale-100"
            >
              {loading ? "Dealing..." : `Deal Cards - $${betAmount}`}
            </button>
          </div>
        </div>
      </div>

        {/* Betting Panel */}
        <div className="w-80 bg-gray-900 rounded-xl shadow-xl p-6 ml-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Place Your Bet</h2>

          {/* Balance Warning */}
          {balance < betAmount && (
            <div className="mb-4 p-3 bg-red-900 border border-red-500 rounded-lg text-center">
              <p className="text-red-300 text-sm">⚠️ Insufficient balance for current bet!</p>
            </div>
          )}

          {/* Chip Selection */}
          <div className="mb-6">
            <label className="block mb-3 text-lg font-semibold">Select Chip</label>
            <div className="flex flex-wrap gap-3">
              {chips.map((chip) => (
                <div
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className={`transition-transform transform hover:scale-110 ${
                    chip === betAmount ? "ring-4 ring-yellow-500 rounded-full" : ""
                  } ${
                    chip <= balance ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <div className={`px-4 py-2 border-2 rounded-full font-bold shadow-lg ${
                    chip <= balance 
                      ? "bg-yellow-600 text-white border-yellow-400" 
                      : "bg-gray-600 text-gray-400 border-gray-500"
                  }`}>
                    ${chip}
                  </div>
                </div>
              ))}
            </div>
          </div>

        {/* Custom Bet Amount */}
        <div className="mb-6">
          <label className="block mb-2 text-lg font-semibold">Custom Amount</label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full px-4 py-2 bg-gray-800 rounded-md text-white text-lg"
            min={1}
          />
        </div>

        {/* Bet Type Info */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Betting Options</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-400">Player:</span>
              <span>1:1 payout</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-400">Banker:</span>
              <span>0.95:1 payout</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">Tie:</span>
              <span>8:1 payout</span>
            </div>
          </div>
        </div>

        {/* Game Rules */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Rules</h3>
          <div className="text-sm space-y-1">
            <p>• Hand closest to 9 wins</p>
            <p>• Face cards = 0</p>
            <p>• Aces = 1</p>
            <p>• Sum over 10 drops tens digit</p>
            <p>• Third card rules apply automatically</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
