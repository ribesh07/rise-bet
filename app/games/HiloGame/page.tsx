"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const chips = [10, 50, 100, 500, 1000];

interface Card {
  rank: string;
  suit: string;
  value: number;
}

export default function HiloPage() {
  const [betAmount, setBetAmount] = useState(100);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [nextCard, setNextCard] = useState<Card | null>(null);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'revealing' | 'finished'>('waiting');
  const [win, setWin] = useState<boolean | null>(null);
  const [payout, setPayout] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalWinnings, setTotalWinnings] = useState(0);

  const audioClick = typeof Audio !== "undefined" ? new Audio('/sounds/click.mp3') : null;
  const audioWin = typeof Audio !== "undefined" ? new Audio('/sounds/win.mp3') : null;
  const audioLose = typeof Audio !== "undefined" ? new Audio('/sounds/lose.mp3') : null;

  // Get starting card when component mounts
  useEffect(() => {
    getNewCard();
  }, []);

  const getNewCard = async () => {
    try {
      const res = await axios.get('/api/hilo');
      if (res.status === 200) {
        setCurrentCard(res.data.card);
        setGameState('playing');
        setNextCard(null);
        setWin(null);
        setPayout(0);
        setMultiplier(0);
      }
    } catch (error) {
      console.error('Failed to get new card:', error);
    }
  };

  const makePrediction = async (prediction: 'higher' | 'lower') => {
    if (!currentCard || loading || gameState !== 'playing') return;

    setLoading(true);
    setGameState('revealing');
    audioClick?.play();

    try {
      const res = await axios.post('/api/hilo', {
        betAmount,
        prediction,
        currentCard
      });

      if (res.status !== 200) {
        throw new Error('Failed to make prediction');
      }

      const { win, nextCard, payout, payoutMultiplier } = res.data;

      // Simulate card reveal animation
      setTimeout(() => {
        setNextCard(nextCard);
        setWin(win);
        setPayout(payout);
        setMultiplier(payoutMultiplier);
        setGameState('finished');
        setLoading(false);

        // Update streak and total winnings
        if (win) {
          setStreak(prev => prev + 1);
          setTotalWinnings(prev => prev + payout);
          audioWin?.play();
        } else {
          setStreak(0);
          audioLose?.play();
        }
      }, 2000);

    } catch (err: any) {
      alert(err.response?.data?.error || 'Something went wrong');
      setLoading(false);
      setGameState('playing');
    }
  };

  const startNewRound = () => {
    setGameState('waiting');
    getNewCard();
  };

  const continueWithNextCard = () => {
    if (nextCard) {
      setCurrentCard(nextCard);
      setNextCard(null);
      setGameState('playing');
      setWin(null);
      setPayout(0);
      setMultiplier(0);
    }
  };

  const handleChipClick = (value: number) => {
    audioClick?.play();
    setBetAmount(value);
  };

  const getCardColor = (suit: string) => {
    return suit === '♥' || suit === '♦' ? 'text-red-500' : 'text-black';
  };

  const renderCard = (card: Card | null, isRevealing: boolean = false) => {
    if (!card) {
      return (
        <div className="w-32 h-44 bg-blue-800 rounded-lg border-2 border-blue-600 flex items-center justify-center shadow-lg">
          <div className="text-white text-4xl">?</div>
        </div>
      );
    }

    return (
      <div className={`w-32 h-44 bg-white rounded-lg border-2 border-gray-300 flex flex-col items-center justify-center shadow-lg transition-all duration-500 ${isRevealing ? 'animate-pulse' : ''}`}>
        <div className={`text-4xl font-bold ${getCardColor(card.suit)}`}>
          {card.rank}
        </div>
        <div className={`text-6xl ${getCardColor(card.suit)}`}>
          {card.suit}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8 text-center">🃏 Hi-Lo Game</h1>
        
        {/* Game Stats */}
        <div className="flex gap-8 mb-8">
          <div className="bg-gray-800 px-4 py-2 rounded-lg">
            <div className="text-sm text-gray-400">Streak</div>
            <div className="text-xl font-bold text-yellow-400">{streak}</div>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-lg">
            <div className="text-sm text-gray-400">Total Winnings</div>
            <div className="text-xl font-bold text-green-400">${totalWinnings.toFixed(2)}</div>
          </div>
        </div>

        {/* Cards Display */}
        <div className="flex items-center justify-center gap-12 mb-8">
          {/* Current Card */}
          <div className="text-center">
            <div className="text-lg mb-2 text-gray-300">Current Card</div>
            {renderCard(currentCard)}
            {currentCard && (
              <div className="mt-2 text-sm text-gray-400">
                Value: {currentCard.value}
              </div>
            )}
          </div>

          {/* VS */}
          <div className="text-6xl text-gray-500 font-bold">VS</div>

          {/* Next Card */}
          <div className="text-center">
            <div className="text-lg mb-2 text-gray-300">Next Card</div>
            {gameState === 'revealing' ? (
              renderCard(null, true)
            ) : (
              renderCard(nextCard)
            )}
            {nextCard && (
              <div className="mt-2 text-sm text-gray-400">
                Value: {nextCard.value}
              </div>
            )}
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex flex-col items-center gap-4">
          {gameState === 'playing' && (
            <div className="flex gap-6">
              <button
                onClick={() => makePrediction('higher')}
                disabled={loading}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold text-xl transition-colors shadow-lg"
              >
                📈 HIGHER
              </button>
              <button
                onClick={() => makePrediction('lower')}
                disabled={loading}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold text-xl transition-colors shadow-lg"
              >
                📉 LOWER
              </button>
            </div>
          )}

          {gameState === 'revealing' && (
            <div className="text-center">
              <div className="text-2xl text-yellow-400 animate-pulse">Revealing card...</div>
            </div>
          )}

          {gameState === 'finished' && (
            <div className="text-center">
              <div className={`text-3xl font-bold mb-4 ${
                win ? 'text-green-400' : 'text-red-400'
              }`}>
                {win ? '🎉 You Win!' : '❌ You Lose!'}
              </div>
              <div className="text-lg mb-4">
                Multiplier: <span className="font-bold">{multiplier}x</span>
              </div>
              <div className="text-lg mb-6">
                Payout: <span className="font-bold text-green-400">${payout}</span>
              </div>
              
              <div className="flex gap-4">
                {win && (
                  <button
                    onClick={continueWithNextCard}
                    className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-semibold transition-colors"
                  >
                    Continue Streak
                  </button>
                )}
                <button
                  onClick={startNewRound}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors"
                >
                  New Round
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Betting Panel */}
      <div className="w-80 bg-gray-900 rounded-xl shadow-xl p-6 ml-6">
        <h2 className="text-2xl font-bold mb-6 text-center">💰 Betting</h2>
        
        <div className="mb-6">
          <label className="block mb-3 text-lg">Select Chip</label>
          <div className="grid grid-cols-3 gap-3">
            {chips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className={`cursor-pointer transition-all transform hover:scale-105 p-3 rounded-lg font-bold ${
                  chip === betAmount 
                    ? "bg-green-600 ring-4 ring-green-400 text-white" 
                    : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                }`}
              >
                ${chip}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-lg">Bet Amount</label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white text-lg border border-gray-600 focus:border-green-500 focus:outline-none"
            min={1}
          />
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-400 mb-2">Potential Win</div>
          <div className="text-2xl font-bold text-green-400">
            ${(betAmount * 1.9).toFixed(2)}
          </div>
          <div className="text-sm text-gray-400 mt-1">1.9x Multiplier</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-lg font-semibold mb-2">How to Play</div>
          <div className="text-sm text-gray-300 space-y-2">
            <p>• Predict if the next card will be higher or lower</p>
            <p>• Win 1.9x your bet for correct predictions</p>
            <p>• Equal cards = House wins</p>
            <p>• Keep your streak going for bigger wins!</p>
          </div>
        </div>
      </div>
    </div>
  );
}