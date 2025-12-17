// ✅ FULL RESPONSIVE ROULETTE LAYOUT (PC + MOBILE)
// ❌ Wheel code NOT changed at all
// ✅ Betting table layout slightly adjusted for responsiveness only

<div className="min-h-screen bg-gray-900 text-white">

  {/* ================= HEADER ================= */}
  <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <h1 className="text-2xl font-bold text-blue-400">🎰 Roulette</h1>

      {winningAmount !== 0 && (
        <div className="bg-gray-700 px-3 py-1 rounded text-sm">
          <span className="text-gray-400">Last Win:</span>
          <span className={`ml-1 font-bold ${winningAmount > 0 ? "text-green-400" : "text-red-400"}`}>
            {formatCurrency(winningAmount)}
          </span>
        </div>
      )}
    </div>
  </div>

  {/* ================= MAIN ================= */}
  <div className="max-w-7xl mx-auto px-4 py-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ================= LEFT : HISTORY ================= */}
      <div className="order-3 lg:order-1 space-y-4">

        {/* Recent Results */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-bold text-blue-400 mb-3">🎯 Recent Results</h3>
          <div className="flex flex-wrap gap-2">
            {gameHistory.slice(-10).map((num, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  num === 0 ? "bg-green-500" : redNumbers.includes(num) ? "bg-red-500" : "bg-gray-600"
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bets */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-bold text-purple-400 mb-3">🕒 Recent Bets</h3>
          {recentBets.length === 0 ? (
            <p className="text-gray-400 text-sm">No recent bets</p>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {recentBets.map((bet, idx) => {
                const statusColor =
                  bet.status === "WIN"
                    ? "text-green-400"
                    : bet.status === "LOSE"
                    ? "text-red-400"
                    : "text-yellow-400";

                return (
                  <div key={idx} className="flex justify-between items-center text-sm bg-gray-700/50 px-3 py-2 rounded">
                    <div>
                      <div className="font-bold">{bet.value.toUpperCase()}</div>
                      <div className="text-xs text-gray-400">{new Date(bet.time).toLocaleTimeString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(bet.amount, bet.currency)}</div>
                      <div className={`text-xs font-bold ${statusColor}`}>{bet.status}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ================= CENTER : WHEEL ================= */}
      <div className="order-1 lg:order-2 flex justify-center">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full flex justify-center">

         {/* Wheel */}
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-amber-800 to-amber-900 border-4 border-amber-600 shadow-2xl relative">
                <div className="absolute inset-0 rounded-full">
                  {wheelNumbers.map((num, idx) => {
                    const angle = (idx * 360) / 37;
                    const isRed = redNumbers.includes(num);
                    const isGreen = num === 0;
                    const radiusOffset = 145;
                    return (
                      <div
                        key={`outer-${idx}`}
                        className="absolute w-8 h-8 flex items-center justify-center"
                        style={{
                          left: "50%",
                          top: "50%",
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radiusOffset}px) rotate(-${angle}deg)`,
                          transformOrigin: "center center",
                        }}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white shadow-lg ${
                            isGreen ? "bg-green-600" : isRed ? "bg-red-600" : "bg-gray-900"
                          }`}
                        >
                          {num}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Inner Spinning Wheel (animated via wheelRotation) */}
                <div
                  className="rounded-full relative overflow-hidden transition-transform duration-[5000ms] ease-out"
                  style={{ transform: `rotate(${wheelRotation}deg)` }}
                >
                  {wheelNumbers.map((num, idx) => {
                    const angle = (idx * 360) / 37;
                    const isRed = redNumbers.includes(num);
                    const isGreen = num === 0;
                    return (
                      <div key={idx} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                        <div
                          className={`absolute w-full h-1/2 origin-bottom ${isGreen ? "bg-green-600" : isRed ? "bg-red-600" : "bg-gray-900"}`}
                          style={{
                            clipPath: `polygon(50% 100%, ${50 - 50 * Math.sin((9.73 * Math.PI) / 180)}% 0%, ${
                              50 + 50 * Math.sin((9.73 * Math.PI) / 180)
                            }% 0%)`,
                          }}
                        />
                        <div
                          className="absolute text-white font-bold text-xs flex items-center justify-center"
                          style={{
                            top: "15px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "14px",
                            height: "14px",
                          }}
                        >
                          {num}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* decorative rings */}
                <div className="absolute inset-8 rounded-full border-2 border-amber-400 opacity-40"></div>
                <div className="absolute inset-12 rounded-full border-1 border-amber-300 opacity-30"></div>
                <div className="absolute inset-16 rounded-full border-2 border-yellow-400 opacity-20 shadow-inner"></div>

                {/* Ball */}
                <div
                  className={`absolute inset-0 transition-all duration-[5000ms] ease-out ${ballVisible ? "opacity-100" : "opacity-0"}`}
                  style={{
                    transform: `rotate(${ballRotation}deg)`,
                    transformOrigin: "center center",
                  }}
                >
                  <div
                    className={`absolute w-4 h-4 bg-white rounded-full shadow-lg border-2 border-gray-300 transition-all duration-300 ${
                      isSpinning ? "animate-pulse" : ""
                    } ${ballVisible ? "scale-100" : "scale-0"}`}
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%) translateY(-120px)",
                      boxShadow: isSpinning
                        ? "0 0 15px rgba(255,255,255,1), inset 0 0 8px rgba(0,0,0,0.3), 0 0 25px rgba(255,215,0,0.5)"
                        : "0 0 12px rgba(255,255,255,0.8), inset 0 0 6px rgba(0,0,0,0.3)",
                      zIndex: 20,
                    }}
                  >
                    <div className="absolute w-2 h-2 bg-gray-100 rounded-full" style={{ top: "2px", left: "2px", opacity: 0.9 }} />
                    <div className={`absolute w-1 h-1 bg-white rounded-full ${isSpinning ? "animate-spin" : ""}`} style={{ top: "1px", right: "1px", opacity: 0.7 }} />
                  </div>
                </div>

                {/* Winning alert */}
                 {showCountdown && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-black/80 border-4 border-blue-400 flex flex-col items-center justify-center animate-pulse">
                        <div className="text-4xl font-bold text-blue-400">
                          {countdown}
                        </div>
                        <div className="text-sm text-gray-300 font-bold">
                          NEXT SPIN
                        </div>
                      </div>
                    </div>
                  )}
                {showWinningAlert && result !== null && (
                  <div className="absolute inset-0 flex items-center justify-center z-30">
                    <div className="relative">
                      <div className="w-32 h-32 bg-black/80 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-2xl animate-pulse">
                       
                        <div className="text-center">
                          <div className={`text-4xl font-bold mb-1 ${result === 0 ? "text-green-400" : redNumbers.includes(result) ? "text-red-400" : "text-white"}`}>
                            {result}
                          </div>
                          <div className="text-yellow-400 text-sm font-bold animate-bounce">WINNER!</div>
                        </div>
                      </div>
                      <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                      <div className="absolute -top-1 -right-3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                )}
              </div>

        </div>
      </div>

      {/* ================= RIGHT : BET TABLE ================= */}
      <div className="order-2 lg:order-3 space-y-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700 shadow-xl">

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-green-400">🎲 Betting Table</h3>
            <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
              Place Your Bet
            </span>
          </div>

          {/* Bet Amount */}
          <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-700 mb-5">
            <label className="text-xs text-gray-400 uppercase tracking-widest">Bet Amount</label>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-3">
              {betAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`py-2 rounded-xl font-bold text-sm transition-all ${
                    betAmount === amount
                      ? "bg-blue-600 text-white scale-105 ring-2 ring-blue-400"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {formatCurrency(convertChipToCurrency(amount))}
                </button>
              ))}
            </div>
          </div>

          {/* Numbers */}
          <div className="mb-5">
            <div className="text-sm font-semibold text-gray-300 mb-2">Numbers</div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[0, ...Array.from({ length: 36 }, (_, i) => i + 1)].map(num => (
                <button
                  key={num}
                  disabled={isSpinning}
                  onClick={() => addBetLocally(num.toString())}
                  className={`h-10 rounded-lg font-bold text-sm text-white transition-all ${
                    num === 0
                      ? "bg-green-600"
                      : redNumbers.includes(num)
                      ? "bg-red-600"
                      : "bg-gray-700"
                  } disabled:opacity-50`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Outside Bets */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <OutsideBtn label="Red" value="red" />
              <OutsideBtn label="Black" value="black" />
              <OutsideBtn label="Even" value="even" />
              <OutsideBtn label="Odd" value="odd" />
              <OutsideBtn label="1–18" value="1-18" />
              <OutsideBtn label="19–36" value="19-36" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <OutsideBtn label="1–12" value="1-12" />
              <OutsideBtn label="13–24" value="13-24" />
              <OutsideBtn label="25–36" value="25-36" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ================= CONTROLS ================= */}
    <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="text-center mb-4">
        {isSpinning ? (
          <div className="text-blue-400 font-bold animate-pulse">🌀 Ball is revolving around the wheel...</div>
        ) : (
          <div className="text-gray-400">Place your bets and spin the wheel!</div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <button
          onClick={() => setGameHistory([])}
          className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-bold"
        >
          🗑️ Clear History
        </button>

        <button
          onClick={() => spin()}
          disabled={totalBet === 0 || isSpinning}
          className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 px-8 py-3 rounded-lg font-bold"
        >
          🎲 SPIN ({formatCurrency(convertChipToCurrency(totalBet))})
        </button>
      </div>
    </div>
  </div>
</div>
