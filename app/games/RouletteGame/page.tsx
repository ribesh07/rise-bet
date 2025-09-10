'use client';
import React, { useState, useEffect } from 'react';

const ModernRoulette = () => {
  const [balance, setBalance] = useState(10000);
  const [totalBet, setTotalBet] = useState(0);
  const [winningAmount, setWinningAmount] = useState(0);
  const [bets, setBets] = useState<{ [key: string]: number }>({});
  const [betAmount, setBetAmount] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [ballRotation, setBallRotation] = useState(0);
  const [showWinningAlert, setShowWinningAlert] = useState(false);
  const [ballVisible, setBallVisible] = useState(true);

  // Roulette wheel numbers in order
  const wheelNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  
  const betAmounts = [1, 5, 10, 25, 50, 100, 500, 1000];

  const getNumberColor = (num: number) => {
    if (num === 0) return 'bg-green-500';
    return redNumbers.includes(num) ? 'bg-red-500' : 'bg-gray-800';
  };

  const getNumberTextColor = (num: number) => {
    return 'text-white';
  };

  const placeBet = (position: string) => {
    if (betAmount > balance || isSpinning) return;
    
    const newBets = { ...bets };
    newBets[position] = (newBets[position] || 0) + betAmount;
    setBets(newBets);
    setTotalBet(prev => prev + betAmount);
    setBalance(prev => prev - betAmount);
  };

  const clearBets = () => {
    setBalance(prev => prev + totalBet);
    setBets({});
    setTotalBet(0);
  };

  const spin = () => {
    if (totalBet === 0 || isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    setWinningAmount(0);
    
    const winningNumber = wheelNumbers[Math.floor(Math.random() * wheelNumbers.length)];
    const winningIndex = wheelNumbers.indexOf(winningNumber);
    
    // Calculate the exact angle for the winning number
    const segmentAngle = 360 / 37;
    const winningSegmentAngle = winningIndex * segmentAngle;
    
    // Calculate how much to rotate to align winning number with pointer (at top)
    // The pointer is at 0 degrees (top), so we need to rotate the wheel so that
    // the winning number segment is at the top position
    const targetAngle = -winningSegmentAngle; // Negative because wheel rotates clockwise
    
    // Add multiple full rotations (8-12 spins) for dramatic effect
    const spins = 8 + Math.random() * 4;
    const fullRotations = spins * 360;
    
    // Final rotation: current rotation + full spins + adjustment to align winning number
    const finalRotation = wheelRotation + fullRotations + targetAngle;
    
    // Enhanced Ball animation - revolves around wheel rim with realistic physics
    const ballSpins = 15 + Math.random() * 10; // More rotations for dramatic effect
    const ballFullRotations = ballSpins * 360;
    // Ball travels in opposite direction and settles into winning pocket
    // Ball should end up at the same position as the winning number (at top under pointer)
    const ballFinalRotation = ballRotation - ballFullRotations - winningSegmentAngle;

    setWheelRotation(finalRotation);
    setBallRotation(ballFinalRotation);
    setBallVisible(true);
    setShowWinningAlert(false);
    
    // Ball disappears before stopping (at 4.2 seconds)
    setTimeout(() => {
      setBallVisible(false);
    }, 4200);
    
    // Show winning alert in center (at 4.5 seconds)
    setTimeout(() => {
      setShowWinningAlert(true);
      setResult(winningNumber);
    }, 4500);
    
    // Complete the spin (at 5.5 seconds)
    setTimeout(() => {
      setGameHistory(prev => [...prev, winningNumber]);
      calculateWinnings(winningNumber);
      setIsSpinning(false);
      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowWinningAlert(false);
      }, 3000);
    }, 5500);
  };

  const calculateWinnings = (winningNumber: number) => {
    let totalWinnings = 0;
    
    Object.entries(bets).forEach(([position, amount]) => {
      if (position === winningNumber.toString()) {
        totalWinnings += amount * 36; // 35:1 + original bet
      } else if (position === 'red' && redNumbers.includes(winningNumber)) {
        totalWinnings += amount * 2;
      } else if (position === 'black' && !redNumbers.includes(winningNumber) && winningNumber !== 0) {
        totalWinnings += amount * 2;
      } else if (position === 'even' && winningNumber % 2 === 0 && winningNumber !== 0) {
        totalWinnings += amount * 2;
      } else if (position === 'odd' && winningNumber % 2 === 1) {
        totalWinnings += amount * 2;
      } else if (position === '1-18' && winningNumber >= 1 && winningNumber <= 18) {
        totalWinnings += amount * 2;
      } else if (position === '19-36' && winningNumber >= 19 && winningNumber <= 36) {
        totalWinnings += amount * 2;
      } else if (position === '1-12' && winningNumber >= 1 && winningNumber <= 12) {
        totalWinnings += amount * 3;
      } else if (position === '13-24' && winningNumber >= 13 && winningNumber <= 24) {
        totalWinnings += amount * 3;
      } else if (position === '25-36' && winningNumber >= 25 && winningNumber <= 36) {
        totalWinnings += amount * 3;
      }
    });
    
    setWinningAmount(totalWinnings - totalBet);
    setBalance(prev => prev + totalWinnings);
    setBets({});
    setTotalBet(0);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-400">🎰 Roulette</h1>
            <div className="text-sm text-gray-400">Live Casino</div>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4 text-sm">
            <div className="bg-gray-700 px-3 py-1 rounded">
              <span className="text-gray-400">Balance:</span>
              <span className="text-green-400 ml-1 font-bold">${balance.toLocaleString()}</span>
            </div>
            <div className="bg-gray-700 px-3 py-1 rounded">
              <span className="text-gray-400">Total Bet:</span>
              <span className="text-yellow-400 ml-1 font-bold">${totalBet.toLocaleString()}</span>
            </div>
            {winningAmount !== 0 && (
              <div className="bg-gray-700 px-3 py-1 rounded">
                <span className="text-gray-400">Last Win:</span>
                <span className={`ml-1 font-bold ${winningAmount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${winningAmount.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Panel - Game History & Stats */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-bold text-blue-400 mb-3">🎯 Recent Results</h3>
              <div className="flex flex-wrap gap-2">
                {gameHistory.slice(-10).map((num, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      num === 0 ? 'bg-green-500' : redNumbers.includes(num) ? 'bg-red-500' : 'bg-gray-600'
                    } text-white`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Current Bets */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">💰 Current Bets</h3>
              {Object.keys(bets).length === 0 ? (
                <p className="text-gray-400 text-sm">No active bets</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Object.entries(bets).map(([position, amount]) => (
                    <div key={position} className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">{position}</span>
                      <span className="text-green-400 font-bold">${amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Center - Roulette Wheel */}
          <div className="flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="relative">
              {/* Pointer/Indicator at top */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400 drop-shadow-lg"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full mx-auto -mt-1 shadow-lg"></div>
              </div>
              
              {/* Modern Wheel Design */}
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-amber-800 to-amber-900 border-4 border-amber-600 shadow-2xl relative">
                
                {/* Outer Numbers Ring (Static) */}
                <div className="absolute inset-0 rounded-full">
                  {wheelNumbers.map((num, idx) => {
                    const angle = (idx * 360) / 37;
                    const isRed = redNumbers.includes(num);
                    const isGreen = num === 0;
                    const radiusOffset = 145; // Distance from center to number position
                    
                    return (
                      <div
                        key={`outer-${idx}`}
                        className="absolute w-8 h-8 flex items-center justify-center"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radiusOffset}px) rotate(-${angle}deg)`,
                          transformOrigin: 'center center'
                        }}
                      >
                        <div 
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white shadow-lg ${
                            isGreen ? 'bg-green-600' : isRed ? 'bg-red-600' : 'bg-gray-900'
                          }`}
                        >
                          {num}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Inner Spinning Wheel */}
                <div 
                  className="rounded-full relative overflow-hidden transition-transform duration-5000 ease-out"
                  style={{ transform: `rotate(${wheelRotation}deg)` }}
                >
                  {wheelNumbers.map((num, idx) => {
                    const angle = (idx * 360) / 37;
                    const isRed = redNumbers.includes(num);
                    const isGreen = num === 0;
                    
                    return (
                      <div
                        key={idx}
                        className="absolute inset-0"
                        style={{ transform: `rotate(${angle}deg)` }}
                      >
                        {/* Colored Segment */}
                        <div
                          className={`absolute w-full h-1/2 origin-bottom ${
                            isGreen ? 'bg-green-600' : isRed ? 'bg-red-600' : 'bg-gray-900'
                          }`}
                          style={{
                            clipPath: `polygon(50% 100%, ${50 - 50 * Math.sin((9.73 * Math.PI) / 180)}% 0%, ${50 + 50 * Math.sin((9.73 * Math.PI) / 180)}% 0%)`
                          }}
                        />
                        
                        {/* Inner Number (smaller) */}
                        <div
                          className="absolute text-white font-bold text-xs flex items-center justify-center"
                          style={{
                            top: '15px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '14px',
                            height: '14px'
                          }}
                        >
                          {num}
                        </div>
                        
                        {/* Divider lines */}
                        {/* <div className="absolute w-px bg-red-400 h-full left-1/2 transform -translate-x-1/2 opacity-50"></div> */}
                      </div>
                    );
                  })}
                  
                  
                </div>
                
                {/* Ball track rings for visual depth - showing inner ball path */}
                <div className="absolute inset-8 rounded-full border-2 border-amber-400 opacity-40"></div>
                <div className="absolute inset-12 rounded-full border-1 border-amber-300 opacity-30"></div>
                
                {/* Inner rim where ball travels */}
                <div className="absolute inset-16 rounded-full border-2 border-yellow-400 opacity-20 shadow-inner"></div>
                
                {/* Revolving Ball - Enhanced Animation */}
                <div 
                  className={`absolute inset-0 transition-all duration-5000 ease-out ${
                    ballVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    transform: `rotate(${ballRotation}deg)`,
                    transformOrigin: 'center center'
                  }}
                >
                  {/* Ball positioned inside the wheel rim - realistic roulette */}
                  <div 
                    className={`absolute w-4 h-4 bg-white rounded-full shadow-lg border-2 border-gray-300 transition-all duration-300 ${
                      isSpinning ? 'animate-pulse' : ''
                    } ${ballVisible ? 'scale-100' : 'scale-0'}`}
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) translateY(-120px)', // Inside the wheel, closer to center than numbers
                      boxShadow: isSpinning 
                        ? '0 0 15px rgba(255,255,255,1), inset 0 0 8px rgba(0,0,0,0.3), 0 0 25px rgba(255,215,0,0.5)'
                        : '0 0 12px rgba(255,255,255,0.8), inset 0 0 6px rgba(0,0,0,0.3)',
                      zIndex: 20
                    }}
                  >
                    {/* Enhanced ball highlight for 3D effect */}
                    <div 
                      className="absolute w-2 h-2 bg-gray-100 rounded-full"
                      style={{
                        top: '2px',
                        left: '2px',
                        opacity: '0.9'
                      }}
                    ></div>
                    
                    {/* Additional highlight for spinning effect */}
                    <div 
                      className={`absolute w-1 h-1 bg-white rounded-full ${isSpinning ? 'animate-spin' : ''}`}
                      style={{
                        top: '1px',
                        right: '1px',
                        opacity: '0.7'
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Winning Number Alert in Center */}
                {showWinningAlert && result !== null && (
                  <div className="absolute inset-0 flex items-center justify-center z-30">
                    <div className="relative">
                      {/* Backdrop circle */}
                      <div className="w-32 h-32 bg-black/80 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-2xl animate-pulse">
                        <div className="text-center">
                          {/* Winning number */}
                          <div 
                            className={`text-4xl font-bold mb-1 ${
                              result === 0 ? 'text-green-400' : 
                              redNumbers.includes(result) ? 'text-red-400' : 'text-white'
                            }`}
                          >
                            {result}
                          </div>
                          {/* Winner text */}
                          <div className="text-yellow-400 text-sm font-bold animate-bounce">
                            WINNER!
                          </div>
                        </div>
                      </div>
                      
                      {/* Celebration particles/sparkles */}
                      <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                      <div className="absolute -top-1 -right-3 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                      <div className="absolute -bottom-2 -left-3 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                      <div className="absolute -bottom-1 -right-2 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                      <div className="absolute top-1 -left-4 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.8s'}}></div>
                      <div className="absolute top-2 -right-4 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                    </div>
                  </div>
                )}
              </div>
              
              
              {/* Result Display */}
              {result !== null && (
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className={`px-4 py-2 rounded-lg font-bold text-lg border-2 ${
                    result === 0 ? 'bg-green-600 border-green-400' : 
                    redNumbers.includes(result) ? 'bg-red-600 border-red-400' : 'bg-gray-700 border-gray-500'
                  } text-white shadow-lg animate-pulse`}>
                    🎯 {result}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Betting Table */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-bold text-green-400 mb-4">🎲 Betting Table</h3>
              
              {/* Betting Amount Controls */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">Bet Amount</label>
                <div className="flex gap-2 mb-3">
                  {betAmounts.map(amount => (
                    <button
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      className={`px-3 py-2 text-sm font-bold rounded transition-all ${
                        betAmount === amount 
                          ? 'bg-blue-600 text-white border-2 border-blue-400' 
                          : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-400">Selected: <span className="text-blue-400 font-bold">${betAmount}</span></div>
              </div>
              
              {/* Number Grid */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-400 mb-2">Numbers</div>
                <div className="grid grid-cols-6 gap-1 mb-2">
                  {[0, ...Array.from({length: 36}, (_, i) => i + 1)].map(num => (
                    <button
                      key={num}
                      onClick={() => placeBet(num.toString())}
                      disabled={isSpinning}
                      className={`h-8 text-xs font-bold rounded transition-all relative ${
                        num === 0 ? 'bg-green-600 hover:bg-green-500' :
                        redNumbers.includes(num) ? 'bg-red-600 hover:bg-red-500' :
                        'bg-gray-700 hover:bg-gray-600'
                      } text-white disabled:opacity-50`}
                    >
                      {num}
                      {bets[num.toString()] && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full text-black text-xs flex items-center justify-center">
                          💰
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Outside Bets */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-400 mb-2">Outside Bets</div>
                
                {/* Color & Even/Odd */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    onClick={() => placeBet('red')}
                    disabled={isSpinning}
                    className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative"
                  >
                    Red (1:1)
                    {bets['red'] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                  <button
                    onClick={() => placeBet('black')}
                    disabled={isSpinning}
                    className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded border border-gray-600 transition-all relative"
                  >
                    Black (1:1)
                    {bets['black'] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    onClick={() => placeBet('even')}
                    disabled={isSpinning}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative"
                  >
                    Even (1:1)
                    {bets['even'] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                  <button
                    onClick={() => placeBet('odd')}
                    disabled={isSpinning}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative"
                  >
                    Odd (1:1)
                    {bets['odd'] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                </div>
                
                {/* Range Bets */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    onClick={() => placeBet('1-18')}
                    disabled={isSpinning}
                    className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative"
                  >
                    1-18 (1:1)
                    {bets['1-18'] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                  <button
                    onClick={() => placeBet('19-36')}
                    disabled={isSpinning}
                    className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-all relative"
                  >
                    19-36 (1:1)
                    {bets['19-36'] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                </div>
                
                {/* Dozen Bets */}
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => placeBet('1-12')}
                    disabled={isSpinning}
                    className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-2 px-2 text-sm rounded transition-all relative"
                  >
                    1-12 (2:1)
                    {bets['1-12'] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                  <button
                    onClick={() => placeBet('13-24')}
                    disabled={isSpinning}
                    className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-2 px-2 text-sm rounded transition-all relative"
                  >
                    13-24 (2:1)
                    {bets['13-24'] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                  <button
                    onClick={() => placeBet('25-36')}
                    disabled={isSpinning}
                    className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-2 px-2 text-sm rounded transition-all relative"
                  >
                    25-36 (2:1)
                    {bets['25-36'] && <span className="absolute -top-1 -right-1 text-xs">💰</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Control Panel */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button
                onClick={clearBets}
                disabled={totalBet === 0 || isSpinning}
                className="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold px-4 py-2 rounded transition-colors flex items-center gap-2"
              >
                ❌ Clear Bets
              </button>
              
              <button
                onClick={() => setGameHistory([])}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold px-4 py-2 rounded transition-colors flex items-center gap-2"
              >
                🗑️ Clear History
              </button>
            </div>
            
            <div className="text-center">
              {isSpinning ? (
                <div className="text-blue-400 font-bold text-lg animate-pulse">
                  🌀 Ball is revolving around the wheel...
                </div>
              ) : (
                <div className="text-gray-400">
                  Place your bets and spin the wheel!
                </div>
              )}
            </div>
            
            <button
              onClick={spin}
              disabled={totalBet === 0 || isSpinning}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              {isSpinning ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  SPINNING...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  🎲 SPIN (${totalBet})
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernRoulette;
