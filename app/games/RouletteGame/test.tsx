import React, { useState, useEffect } from 'react';

const RouletteGame = () => {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Roulette numbers with their colors
  const rouletteNumbers = [
    { number: 0, color: 'green' },
    { number: 1, color: 'red' }, { number: 2, color: 'black' }, { number: 3, color: 'red' },
    { number: 4, color: 'black' }, { number: 5, color: 'red' }, { number: 6, color: 'black' },
    { number: 7, color: 'red' }, { number: 8, color: 'black' }, { number: 9, color: 'red' },
    { number: 10, color: 'black' }, { number: 11, color: 'black' }, { number: 12, color: 'red' },
    { number: 13, color: 'black' }, { number: 14, color: 'red' }, { number: 15, color: 'black' },
    { number: 16, color: 'red' }, { number: 17, color: 'black' }, { number: 18, color: 'red' },
    { number: 19, color: 'red' }, { number: 20, color: 'black' }, { number: 21, color: 'red' },
    { number: 22, color: 'black' }, { number: 23, color: 'red' }, { number: 24, color: 'black' },
    { number: 25, color: 'red' }, { number: 26, color: 'black' }, { number: 27, color: 'red' },
    { number: 28, color: 'black' }, { number: 29, color: 'black' }, { number: 30, color: 'red' },
    { number: 31, color: 'black' }, { number: 32, color: 'red' }, { number: 33, color: 'black' },
    { number: 34, color: 'red' }, { number: 35, color: 'black' }, { number: 36, color: 'red' }
  ];

  const getNumberColor = (num) => {
    const numberData = rouletteNumbers.find(n => n.number === num);
    return numberData ? numberData.color : 'green';
  };

  const spin = () => {
    if (selectedNumber === null || bet > balance || isSpinning) return;

    setIsSpinning(true);
    setBalance(balance - bet);

    // Simulate spinning delay
    setTimeout(() => {
      const result = Math.floor(Math.random() * 37); // 0-36
      setWinningNumber(result);

      let winAmount = 0;
      let resultText = '';

      if (result === selectedNumber) {
        winAmount = bet * 35; // Straight up bet pays 35:1
        resultText = `WIN! You won $${winAmount}!`;
        setBalance(prev => prev + bet + winAmount);
      } else {
        resultText = `LOSE! The winning number was ${result}`;
      }

      setLastResult(resultText);
      setHistory(prev => [
        { number: result, bet, selected: selectedNumber, won: winAmount > 0, amount: winAmount },
        ...prev.slice(0, 9)
      ]);

      setIsSpinning(false);
    }, 3000);
  };

  const resetGame = () => {
    setBalance(1000);
    setSelectedNumber(null);
    setBet(10);
    setWinningNumber(null);
    setLastResult(null);
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          🎰 Roulette Game
        </h1>

        {/* Game Stats */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white text-center">
            <div>
              <div className="text-2xl font-bold">${balance}</div>
              <div className="text-sm opacity-80">Balance</div>
            </div>
            <div>
              <div className="text-2xl font-bold">${bet}</div>
              <div className="text-sm opacity-80">Current Bet</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {selectedNumber !== null ? selectedNumber : '-'}
              </div>
              <div className="text-sm opacity-80">Selected Number</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Roulette Wheel */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Roulette Wheel</h2>
            
            <div className="flex justify-center mb-6">
              <div className={`w-48 h-48 border-8 border-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-3xl ${isSpinning ? 'animate-spin' : ''}`}
                   style={{ animationDuration: isSpinning ? '0.1s' : '0s' }}>
                <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                  winningNumber !== null ? 
                    getNumberColor(winningNumber) === 'red' ? 'bg-red-600' :
                    getNumberColor(winningNumber) === 'black' ? 'bg-black' : 'bg-green-600'
                  : 'bg-gray-600'
                }`}>
                  {isSpinning ? '?' : (winningNumber !== null ? winningNumber : '?')}
                </div>
              </div>
            </div>

            {lastResult && (
              <div className={`text-center text-lg font-bold p-3 rounded ${
                lastResult.includes('WIN') ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {lastResult}
              </div>
            )}
          </div>

          {/* Betting Area */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Place Your Bet</h2>
            
            {/* Bet Amount */}
            <div className="mb-4">
              <label className="text-white block mb-2">Bet Amount:</label>
              <input
                type="number"
                value={bet}
                onChange={(e) => setBet(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-2 rounded border bg-white/20 text-white placeholder-white/60"
                min="1"
                max={balance}
                disabled={isSpinning}
              />
            </div>

            {/* Quick Bet Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[10, 25, 50, 100].map(amount => (
                <button
                  key={amount}
                  onClick={() => setBet(Math.min(amount, balance))}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-50"
                  disabled={isSpinning || balance < amount}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Number Selection Grid */}
            <div className="grid grid-cols-6 gap-1 mb-4">
              {rouletteNumbers.map(({ number, color }) => (
                <button
                  key={number}
                  onClick={() => setSelectedNumber(number)}
                  className={`p-2 text-white font-bold rounded border-2 transition-all ${
                    selectedNumber === number ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-transparent'
                  } ${
                    color === 'red' ? 'bg-red-600 hover:bg-red-700' :
                    color === 'black' ? 'bg-gray-800 hover:bg-gray-900' :
                    'bg-green-600 hover:bg-green-700'
                  }`}
                  disabled={isSpinning}
                >
                  {number}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={spin}
                disabled={selectedNumber === null || bet > balance || isSpinning}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSpinning ? 'Spinning...' : 'SPIN!'}
              </button>
              
              <button
                onClick={resetGame}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
                disabled={isSpinning}
              >
                Reset Game
              </button>
            </div>
          </div>
        </div>

        {/* Game History */}
        {history.length > 0 && (
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Spins</h2>
            <div className="grid gap-2">
              {history.map((spin, index) => (
                <div key={index} className={`p-3 rounded flex justify-between items-center ${
                  spin.won ? 'bg-green-600/30' : 'bg-red-600/30'
                }`}>
                  <span className="text-white">
                    Spin #{history.length - index}: Number {spin.number} 
                    (Bet on {spin.selected})
                  </span>
                  <span className={`font-bold ${spin.won ? 'text-green-300' : 'text-red-300'}`}>
                    {spin.won ? `+$${spin.amount}` : `-$${spin.bet}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouletteGame;