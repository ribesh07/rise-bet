"use client";
import React, { useState, useEffect } from 'react';
import { Diamond, Bomb, DollarSign } from 'lucide-react';

interface Tile {
  id: number;
  revealed: boolean;
  isDiamond: boolean;
}

const DiamondGame: React.FC = () => {
  const [balance, setBalance] = useState<number>(1000);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [minesCount, setMinesCount] = useState<number>(3);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.00);
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);

  const GRID_SIZE = 25;

  const initializeGame = () => {
    const newTiles: Tile[] = [];
    const minePositions = new Set<number>();

    while (minePositions.size < minesCount) {
      minePositions.add(Math.floor(Math.random() * GRID_SIZE));
    }

    for (let i = 0; i < GRID_SIZE; i++) {
      newTiles.push({
        id: i,
        revealed: false,
        isDiamond: !minePositions.has(i)
      });
    }

    setTiles(newTiles);
    setRevealedCount(0);
    setCurrentMultiplier(1.00);
    setGameOver(false);
    setWon(false);
  };

  const calculateMultiplier = (revealed: number, mines: number): number => {
    const totalTiles = GRID_SIZE;
    const safeTiles = totalTiles - mines;
    let multiplier = 1.0;

    for (let i = 0; i < revealed; i++) {
      const remainingSafe = safeTiles - i;
      const remainingTotal = totalTiles - i;
      multiplier *= (remainingTotal / remainingSafe) * 0.97;
    }

    return multiplier;
  };

  const startGame = () => {
    if (betAmount > balance || betAmount <= 0) return;
    setBalance(balance - betAmount);
    initializeGame();
    setGameActive(true);
  };

  const handleTileClick = (id: number) => {
    if (!gameActive || gameOver || tiles[id].revealed) return;

    const tile = tiles[id];
    const newTiles = [...tiles];
    newTiles[id].revealed = true;
    setTiles(newTiles);

    if (!tile.isDiamond) {
      setGameOver(true);
      setGameActive(false);
      newTiles.forEach((t, i) => {
        if (!t.isDiamond) newTiles[i].revealed = true;
      });
      setTiles(newTiles);
    } else {
      const newRevealedCount = revealedCount + 1;
      setRevealedCount(newRevealedCount);
      const newMultiplier = calculateMultiplier(newRevealedCount, minesCount);
      setCurrentMultiplier(newMultiplier);

      if (newRevealedCount === GRID_SIZE - minesCount) {
        setWon(true);
        setGameOver(true);
        setGameActive(false);
        setBalance(balance + betAmount * newMultiplier);
      }
    }
  };

  const cashOut = () => {
    if (!gameActive || revealedCount === 0) return;
    const winAmount = betAmount * currentMultiplier;
    setBalance(balance + winAmount);
    setGameActive(false);
    setGameOver(true);
    setWon(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Diamond className="text-purple-400" />
              Diamond Game
            </h1>
            <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg">
              <DollarSign className="text-green-400" size={20} />
              <span className="text-xl font-bold text-white">{balance.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="text-sm text-gray-300 block mb-2">Bet Amount</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  disabled={gameActive}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-purple-500 outline-none"
                />
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="text-sm text-gray-300 block mb-2">Mines</label>
                <select
                  value={minesCount}
                  onChange={(e) => setMinesCount(Number(e.target.value))}
                  disabled={gameActive}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-purple-500 outline-none"
                >
                  {[1, 2, 3, 5, 7, 10, 15, 20].map(n => (
                    <option key={n} value={n}>{n} Mines</option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-300 mb-1">Total Profit</div>
                <div className="text-2xl font-bold text-green-400">
                  ${(betAmount * currentMultiplier - betAmount).toFixed(2)}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {currentMultiplier.toFixed(2)}x
                </div>
              </div>

              {!gameActive ? (
                <button
                  onClick={startGame}
                  disabled={betAmount > balance || betAmount <= 0}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
                >
                  Bet ${betAmount.toFixed(2)}
                </button>
              ) : (
                <button
                  onClick={cashOut}
                  disabled={revealedCount === 0}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
                >
                  Cash Out ${(betAmount * currentMultiplier).toFixed(2)}
                </button>
              )}

              {gameOver && (
                <div className={`p-4 rounded-lg text-center font-bold ${won ? 'bg-green-600' : 'bg-red-600'}`}>
                  {won ? `You Won $${(betAmount * currentMultiplier).toFixed(2)}!` : 'Game Over!'}
                </div>
              )}
            </div>

            <div className="lg:col-span-3">
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="grid grid-cols-5 gap-2">
                  {tiles.map((tile) => (
                    <button
                      key={tile.id}
                      onClick={() => handleTileClick(tile.id)}
                      disabled={!gameActive || tile.revealed || gameOver}
                      className={`aspect-square rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:cursor-not-allowed
                        ${tile.revealed
                          ? tile.isDiamond
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                            : 'bg-gradient-to-br from-red-600 to-red-800'
                          : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                    >
                      {tile.revealed && (
                        tile.isDiamond 
                          ? <Diamond className="w-full h-full p-2 text-white" />
                          : <Bomb className="w-full h-full p-2 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiamondGame;