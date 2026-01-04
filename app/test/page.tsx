
"use client";
import React, { useState, useEffect, useRef } from 'react';

const styles = `
  @keyframes blink-left {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }
  
  @keyframes blink-right {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 1; }
  }
  
  .blink-left {
    animation: blink-left 1.5s ease-in-out infinite;
  }
  
  .blink-right {
    animation: blink-right 1.5s ease-in-out infinite;
  }
`;

const VEHICLES = [
  { src: "/games/chicken/red-car.svg", speed: 4.4 },
  { src: "/games/chicken/taxi.svg", speed: 5 },
  { src: "/games/chicken/truck.svg", speed: 3.9 },
  { src: "/games/chicken/f1.svg", speed: 7.2 },
  { src: "/games/chicken/police.svg", speed: 4.1 },
];

class FireParticle {
  constructor(baseX, baseY) {
    this.baseX = baseX;
    this.x = baseX + (Math.random() - 0.5) * 15;
    this.y = baseY;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = -Math.random() * 3 - 2;
    this.maxLife = Math.random() * 50 + 50;
    this.size = Math.random() * 6 + 5;
    this.life = 0;
  }

  update() {
    this.life++;
    this.x += this.vx;
    this.y += this.vy;
    this.vy -= 0.08;
    this.vx += (this.baseX - this.x) * 0.015;
    this.size *= 0.97;
  }

  draw(ctx) {
    const alpha = this.life / this.maxLife;
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
    
    if (alpha > 0.7) {
      gradient.addColorStop(0, `rgba(255, 255, 240, ${alpha * 0.9})`);
      gradient.addColorStop(0.2, `rgba(255, 230, 120, ${alpha * 0.8})`);
      gradient.addColorStop(0.5, `rgba(255, 120, 50, ${alpha * 0.6})`);
      gradient.addColorStop(1, `rgba(255, 50, 20, 0)`);
    } else if (alpha > 0.4) {
      gradient.addColorStop(0, `rgba(255, 220, 100, ${alpha * 0.8})`);
      gradient.addColorStop(0.3, `rgba(255, 140, 50, ${alpha * 0.7})`);
      gradient.addColorStop(0.7, `rgba(255, 70, 30, ${alpha * 0.4})`);
      gradient.addColorStop(1, `rgba(200, 40, 20, 0)`);
    } else {
      gradient.addColorStop(0, `rgba(255, 120, 50, ${alpha * 0.6})`);
      gradient.addColorStop(0.4, `rgba(220, 60, 40, ${alpha * 0.4})`);
      gradient.addColorStop(1, `rgba(150, 30, 20, 0)`);
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  isDead() {
    return this.life >= this.maxLife;
  }
}

const ManholeCanvas = ({ manholes, chickenPos, gameState, onManholeClick, visibleStart }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  const drawManhole = (ctx, cx, cy, withFire) => {
    ctx.fillStyle = withFire ? 'rgba(255, 100, 50, 0.2)' : 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 2, 50, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1a2832';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 45, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = withFire ? '#ff4422' : '#2d3f4d';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 45, 32, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#0d1418';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 38, 27, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#2d3f4d';
    ctx.lineWidth = 3;
    
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      const y = cy + i * 8;
      const width = 35 - Math.abs(i) * 5;
      ctx.moveTo(cx - width, y);
      ctx.lineTo(cx + width, y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(cx, cy + 20);
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      manholes.forEach((hole, index) => {
        const cx = 50 + index * 120;
        const cy = 50;
        
        drawManhole(ctx, cx, cy, hole.hasFire);

        if (hole.hasFire) {
          for (let i = 0; i < 3; i++) {
            if (Math.random() > 0.3) {
              particlesRef.current.push(new FireParticle(cx - 20, cy - 10));
            }
            if (Math.random() > 0.3) {
              particlesRef.current.push(new FireParticle(cx + 20, cy - 10));
            }
          }
        }
      });

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        particlesRef.current[i].update();
        
        if (particlesRef.current[i].isDead()) {
          particlesRef.current.splice(i, 1);
        } else {
          particlesRef.current[i].draw(ctx);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [manholes]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    manholes.forEach((hole, index) => {
      const cx = 50 + index * 120;
      const cy = 50;
      const distance = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      
      if (distance < 50) {
        onManholeClick(hole.lane);
      }
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={720}
      height={120}
      onClick={handleCanvasClick}
      className="cursor-pointer"
      style={{ 
        pointerEvents: gameState === 'playing' ? 'auto' : 'none',
        opacity: gameState === 'playing' ? 1 : 0.5
      }}
    />
  );
};

const ChickenRoadGame = () => {
  const [betAmount, setBetAmount] = useState('0.00');
  const [risk, setRisk] = useState('Medium');
  const [gameState, setGameState] = useState('idle');
  const [chickenPos, setChickenPos] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [manholes, setManholes] = useState([]);
  const [profit, setProfit] = useState('0.00');
  const [currentMultiplier, setCurrentMultiplier] = useState('1.00');
  const [isManual, setIsManual] = useState(true);
  const [burningChicken, setBurningChicken] = useState(false);
  const [visibleLaneStart, setVisibleLaneStart] = useState(0);
  const gameLoopRef = useRef(null);
  const fireTimerRef = useRef(null);

  const LANE_START = 170;
  const LANE_WIDTH = 120;
  const CHICKEN_START_X = 80;
  const VISIBLE_LANES = 6;

  // Calculate multiplier based on risk and position
  const calculateMultiplier = (position, riskLevel) => {
    if (position === 0) return 1.00;
    
    let baseRate;
    if (riskLevel === 'Easy') {
      baseRate = 1.08; // Lower multiplier growth
    } else if (riskLevel === 'Medium') {
      baseRate = 1.15; // Medium multiplier growth
    } else {
      baseRate = 1.22; // Higher multiplier growth
    }
    
    return Math.pow(baseRate, position);
  };

  // Calculate bone probability based on risk
  const getBoneProbability = (riskLevel) => {
    if (riskLevel === 'Easy') return 0.2; // 20% chance
    if (riskLevel === 'Medium') return 0.33; // 33% chance
    return 0.5; // 50% chance for Hard
  };

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (fireTimerRef.current) clearInterval(fireTimerRef.current);
    };
  }, []);

  const generateManholes = (startLane, count) => {
    const boneProbability = getBoneProbability(risk);
    const holes = Array.from({ length: count }).map((_, i) => {
      const laneNumber = startLane + i + 1;
      const hasFire = Math.random() < boneProbability;
      
      return {
        lane: laneNumber,
        hasFire: hasFire,
        isActive: true
      };
    });
    
    return holes;
  };

  const updateVisibleManholes = (currentPos) => {
    const startLane = Math.max(0, currentPos);
    setVisibleLaneStart(startLane);
    
    const newManholes = generateManholes(startLane, VISIBLE_LANES);
    setManholes(newManholes);
  };

  const startGame = () => {
    if (parseFloat(betAmount) <= 0) return;
    
    setChickenPos(0);
    setVehicles([]);
    setCurrentMultiplier('1.00');
    setProfit('0.00');
    setGameState('playing');
    setBurningChicken(false);
    setVisibleLaneStart(0);
    
    const initialManholes = generateManholes(0, VISIBLE_LANES);
    setManholes(initialManholes);
    
    const spawned = Array.from({ length: 5 }).map((_, laneIndex) => {
      const vehicle = VEHICLES[Math.floor(Math.random() * VEHICLES.length)];
      return {
        id: Date.now() + laneIndex,
        lane: laneIndex,
        y: -Math.random() * 300,
        speed: vehicle.speed,
        src: vehicle.src
      };
    });
    
    setVehicles(spawned);
    startVehicleLoop();
  };

  const startVehicleLoop = () => {
    gameLoopRef.current = setInterval(() => {
      setVehicles(prev => {
        return prev.map(v => {
          let newY = v.y + v.speed;
          
          if (newY > 600) {
            const vehicle = VEHICLES[Math.floor(Math.random() * VEHICLES.length)];
            return {
              ...v,
              y: -100,
              src: vehicle.src,
              speed: vehicle.speed
            };
          }
          
          return { ...v, y: newY };
        });
      });
    }, 16);
  };

  useEffect(() => {
    if (gameState !== 'playing' || burningChicken) return;
    
    const chickenX = chickenPos === 0 
      ? CHICKEN_START_X 
      : LANE_START + ((chickenPos - 1 - visibleLaneStart) * LANE_WIDTH) + LANE_WIDTH / 2;
    const chickenY = 320;
    
    for (const v of vehicles) {
      const vehicleX = LANE_START + v.lane * LANE_WIDTH + LANE_WIDTH / 2;
      const hitX = Math.abs(chickenX - vehicleX) < 60;
      const hitY = Math.abs(chickenY - v.y) < 50;
      
      if (hitX && hitY) {
        setGameState('lost');
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        if (fireTimerRef.current) clearInterval(fireTimerRef.current);
        return;
      }
    }
  }, [vehicles, chickenPos, gameState, burningChicken, visibleLaneStart]);

  const jumpToManhole = (laneIndex) => {
    if (gameState !== 'playing') return;
    if (laneIndex <= chickenPos) return;
    
    const manhole = manholes.find(m => m.lane === laneIndex);
    if (!manhole) return;
    
    if (manhole.hasFire) {
      setBurningChicken(true);
      setChickenPos(laneIndex);
      
      setTimeout(() => {
        setGameState('lost');
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        if (fireTimerRef.current) clearInterval(fireTimerRef.current);
      }, 1000);
      return;
    }
    
    setChickenPos(laneIndex);
    
    const mult = calculateMultiplier(laneIndex, risk);
    setCurrentMultiplier(mult.toFixed(2));
    
    const win = parseFloat(betAmount) * mult;
    setProfit(win.toFixed(8));
    
    // Generate new manholes when approaching the edge
    if (laneIndex - visibleLaneStart >= VISIBLE_LANES - 2) {
      updateVisibleManholes(laneIndex - 1);
    }
  };

  const cashout = () => {
    if (gameState === 'playing' && chickenPos > 0) {
      const mult = calculateMultiplier(chickenPos, risk);
      const win = parseFloat(betAmount) * mult;
      setProfit(win.toFixed(8));
      setGameState('won');
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (fireTimerRef.current) clearInterval(fireTimerRef.current);
    }
  };

  const visibleMultipliers = manholes.map(hole => ({
    lane: hole.lane,
    multiplier: calculateMultiplier(hole.lane, risk)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1c2e] to-[#1a2332] flex items-center justify-center p-4">
      <style>{styles}</style>
      <div className="flex gap-4 max-w-7xl w-full">
        {/* Left Panel */}
        <div className="w-80 bg-[#1a2c38]/90 backdrop-blur-sm rounded-xl p-5 space-y-3 shadow-2xl border border-[#2f4553]/30">
          {/* Manual/Auto Toggle */}
          <div className="flex rounded-xl bg-[#0f212e]/80 p-1.5 shadow-inner">
            <button
              onClick={() => setIsManual(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isManual ? 'bg-gradient-to-b from-[#2f4553] to-[#243945] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => setIsManual(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                !isManual ? 'bg-gradient-to-b from-[#2f4553] to-[#243945] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Auto
            </button>
          </div>

          {/* Bet Amount */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
              <span>Bet Amount</span>
              <span className="text-gray-400">{betAmount} BTC</span>
            </div>
            <div className="flex gap-2 bg-[#0f212e]/80 rounded-xl p-3 shadow-inner border border-[#2f4553]/20">
              <input
                type="text"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="flex-1 bg-transparent text-white outline-none font-medium"
                disabled={gameState === 'playing'}
              />
              <button className="w-9 h-9 bg-gradient-to-br from-[#00e701] to-[#00c901] rounded-lg flex items-center justify-center text-black font-bold shadow-lg hover:shadow-green-500/50 transition-all hover:scale-105">
                $
              </button>
              <button 
                onClick={() => setBetAmount((parseFloat(betAmount) / 2).toFixed(8))}
                className="px-3 text-gray-500 hover:text-white transition-colors font-medium"
                disabled={gameState === 'playing'}
              >
                ½
              </button>
              <button 
                onClick={() => setBetAmount((parseFloat(betAmount) * 2).toFixed(8))}
                className="px-3 text-gray-500 hover:text-white transition-colors font-medium"
                disabled={gameState === 'playing'}
              >
                2×
              </button>
            </div>
          </div>

          {/* Risk Level */}
          <div>
            <div className="text-xs text-gray-500 mb-2 font-medium">Risk</div>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              className="w-full bg-[#0f212e]/80 text-white rounded-xl p-3.5 outline-none font-medium shadow-inner border border-[#2f4553]/20 cursor-pointer hover:border-[#2f4553]/40 transition-colors"
              disabled={gameState === 'playing'}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          {/* Action Buttons */}
          {gameState === 'idle' || gameState === 'won' || gameState === 'lost' ? (
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-br from-[#00e701] to-[#00c901] hover:from-[#00ff10] hover:to-[#00d901] text-black font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              Bet
            </button>
          ) : (
            <button
              onClick={cashout}
              disabled={chickenPos === 0}
              className="w-full bg-gradient-to-br from-[#00e701] to-[#00c901] hover:from-[#00ff10] hover:to-[#00d901] text-black font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Cashout
            </button>
          )}

          {/* Profit Display */}
          <div className="pt-4 border-t border-[#2f4553]/40">
            <div className="flex justify-between text-xs text-gray-500 mb-3 font-medium">
              <span>Total profit ({currentMultiplier}×)</span>
              <span className="text-gray-300 font-semibold">{profit} BTC</span>
            </div>
            <div className="text-center bg-[#0f212e]/50 rounded-xl p-4 shadow-inner">
              <div className="text-4xl font-bold text-white mb-3 tracking-tight">{currentMultiplier}×</div>
              <div className="w-10 h-10 bg-gradient-to-br from-[#00e701] to-[#00c901] rounded-full mx-auto flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-green-500/30">
                $
              </div>
            </div>
          </div>

          {/* Lane Counter */}
          {gameState === 'playing' && chickenPos > 0 && (
            <div className="bg-[#0f212e]/50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Current Lane</div>
              <div className="text-2xl font-bold text-white">{chickenPos}</div>
            </div>
          )}
        </div>

        {/* Game Board */}
        <div className="flex-1 bg-[#1a2c38]/90 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-[#2f4553]/30">
          <div className="relative h-[570px] bg-gradient-to-b from-[#0a1520] via-[#081822] to-[#0a1520] rounded-2xl overflow-hidden shadow-2xl border border-[#2f4553]/20">
            <img
              src="/games/chicken/start.svg"
              className="absolute left-0 top-0 h-full z-0"
              alt="start zone"
            />

            {/* Traffic Light */}
            <div className="absolute left-8 top-10 z-30 flex flex-col items-center">
              <div className="w-20 h-16 bg-gradient-to-b from-[#1a2832] to-[#0d1418] rounded-2xl flex items-center justify-around px-3 shadow-2xl border-2 border-[#2d3f4d]">
                <div className="relative w-7 h-7">
                  <div className="absolute inset-0 rounded-full bg-yellow-400 blink-left shadow-lg shadow-yellow-400/50" />
                  <div className="absolute inset-0 rounded-full bg-yellow-300 blink-left blur-sm" />
                </div>
                <div className="relative w-7 h-7">
                  <div className="absolute inset-0 rounded-full bg-yellow-400 blink-right shadow-lg shadow-yellow-400/50" />
                  <div className="absolute inset-0 rounded-full bg-yellow-300 blink-right blur-sm" />
                </div>
              </div>
              <div className="w-3 h-24 bg-gradient-to-b from-[#2d3f4d] to-[#1a2832] shadow-lg" />
              <div className="w-14 h-6 bg-gradient-to-b from-[#2d3f4d] to-[#1a2832] rounded-full shadow-xl" />
            </div>

            {/* Road Lanes */}
            <div className="absolute left-[170px] right-0 top-0 bottom-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#2f4553] to-transparent opacity-60"
                  style={{ left: (i + 1) * LANE_WIDTH }}
                />
              ))}
            </div>

            {/* Vehicles */}
            {vehicles.map(v => (
              <img
                key={v.id}
                src={v.src}
                alt="vehicle"
                className="absolute w-28 h-34 z-10"
                style={{
                  left: LANE_START + v.lane * LANE_WIDTH + LANE_WIDTH / 2 - 56,
                  top: v.y
                }}
              />
            ))}

            {/* Manholes */}
            <div className="absolute top-[285px] left-[180px] right-4">
              {manholes.length > 0 && (
                <ManholeCanvas 
                  manholes={manholes}
                  chickenPos={chickenPos}
                  gameState={gameState}
                  onManholeClick={jumpToManhole}
                  visibleStart={visibleLaneStart}
                />
              )}
            </div>

            {/* Chicken */}
            <div
              className="absolute transition-all duration-500 ease-out z-20 filter drop-shadow-2xl"
              style={{
                left: chickenPos === 0 
                  ? CHICKEN_START_X - 30
                  : LANE_START + ((chickenPos - 1 - visibleLaneStart) * LANE_WIDTH) + LANE_WIDTH / 2 - 30,
                top: 280,
                fontSize: '64px'
              }}
            >
              {burningChicken ? (
                <div className="relative animate-pulse">
                  <span className="opacity-60">🐔</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl animate-pulse">🔥</div>
                  </div>
                  <div className="absolute -top-6 left-2 text-5xl animate-pulse" style={{ animationDelay: '0.15s' }}>🔥</div>
                  <div className="absolute -top-4 right-0 text-5xl animate-pulse" style={{ animationDelay: '0.3s' }}>🔥</div>
                </div>
              ) : (
                '🐔'
              )}
            </div>

            {/* Multipliers */}
            <div className="absolute bottom-[125px] left-[175px] right-4 flex justify-around px-2">
              {visibleMultipliers.map((item, i) => (
                <div
                  key={item.lane}
                  className={`rounded-lg px-6 py-2 text-sm font-bold transition-all duration-300 shadow-lg ${
                    chickenPos === item.lane && gameState === 'playing'
                      ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white scale-110 shadow-2xl shadow-green-500/60 ring-2 ring-white/30'
                      : gameState === 'playing'
                      ? 'bg-gradient-to-br from-[#2d3f4d] to-[#1a2832] text-gray-300'
                      : 'bg-gradient-to-br from-[#1a2832] to-[#0d1418] text-gray-500'
                  }`}
                >
                  {item.multiplier.toFixed(2)}×
                </div>
              ))}
            </div>

            {/* Game Over Overlays */}
            {gameState === 'lost' && (
              <div className="absolute inset-0 bg-gradient-to-b from-red-600/80 via-red-700/70 to-red-900/80 backdrop-blur-sm flex items-center justify-center z-40 animate-in fade-in duration-300">
                <div className="text-center">
                  <div className="text-8xl mb-4 animate-bounce">💥</div>
                  <div className="text-5xl font-black text-white drop-shadow-2xl">CRASHED!</div>
                  <div className="text-xl text-red-100 mt-2 font-semibold">Better luck next time</div>
                </div>
              </div>
            )}

            {gameState === 'won' && (
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/80 via-green-700/70 to-emerald-900/80 backdrop-blur-sm flex items-center justify-center z-40 animate-in fade-in duration-300">
                <div className="text-center">
                  <div className="text-8xl mb-4 animate-bounce">🎉</div>
                  <div className="text-5xl font-black text-white drop-shadow-2xl">YOU WON!</div>
                  <div className="text-2xl text-green-100 mt-3 font-bold bg-black/20 px-6 py-2 rounded-xl">+{profit} BTC</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChickenRoadGame;