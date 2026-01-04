"use client";

import { GameHistoryItem } from "./types";
import { useMemo } from "react";

interface Props {
  gameHistory: GameHistoryItem[];
}

export default function Chart({ gameHistory }: Props) {
  const visibleHistory = gameHistory.slice(0, 10);

  // responsive sizing
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const NUMBER_SIZE = isMobile ? 20 : 24;
  const NUMBER_GAP = isMobile ? 4 : 6;
  const PERIOD_WIDTH = isMobile ? 72 : 95;
  const ROW_HEIGHT = isMobile ? 30 : 36;

  const LEFT_OFFSET = PERIOD_WIDTH;

  const points = useMemo(() => {
    return visibleHistory.map((item, index) => ({
      x:
        LEFT_OFFSET +
        item.number * (NUMBER_SIZE + NUMBER_GAP) +
        NUMBER_SIZE / 2,
      y: index * ROW_HEIGHT + ROW_HEIGHT / 2,
    }));
  }, [
    visibleHistory,
    NUMBER_SIZE,
    NUMBER_GAP,
    ROW_HEIGHT,
    LEFT_OFFSET,
  ]);

  return (
    <div className="bg-white p-2 sm:p-3 overflow-hidden">
      {/* Header */}
      <div className="bg-red-500 text-white py-2 px-3 rounded-t-md grid grid-cols-2 text-sm">
        <div className="font-semibold">Period</div>
        <div className="font-semibold text-center">Number</div>
      </div>

      {/* Statistic */}
      <div className="border p-2 text-[11px]">
        <div className="mb-2 font-semibold">Statistic</div>

        {[
          { label: "Winning Numbers", data: [0,1,2,3,4,5,6,7,8,9], circle: true },
          { label: "Missing", data: [1,3,4,12,27,11,6,28,2,0] },
          { label: "Avg missing", data: [6,6,7,11,13,9,7,13,5,6] },
          { label: "Frequency", data: [12,12,11,7,6,9,11,6,14,12] },
          { label: "Max consecutive", data: [1,2,2,1,1,1,2,1,2,2] },
        ].map((row, idx) => (
          <div
            key={idx}
            className="grid"
            style={{
              gridTemplateColumns: `${PERIOD_WIDTH}px repeat(10, ${NUMBER_SIZE}px)`,
              columnGap: NUMBER_GAP,
            }}
          >
            <div className="text-gray-700 truncate">{row.label}</div>
            {row.data.map((n, i) => (
              <div key={i} className="text-center text-gray-500">
                {row.circle ? (
                  <span
                    className="inline-flex items-center justify-center border rounded-full text-red-500"
                    style={{
                      width: NUMBER_SIZE,
                      height: NUMBER_SIZE,
                      fontSize: 10,
                    }}
                  >
                    {n}
                  </span>
                ) : (
                  n
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="relative mt-3">
        <svg
          className="absolute left-0 top-0 pointer-events-none"
          width="100%"
          height={visibleHistory.length * ROW_HEIGHT}
        >
          <polyline
            points={points.map(p => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#ef4444"
            strokeWidth={isMobile ? 1.5 : 2}
          />
        </svg>

        {visibleHistory.map(item => (
          <div
            key={item.period}
            className="flex items-center"
            style={{ height: ROW_HEIGHT }}
          >
            {/* Period */}
            <div
              className="text-[11px] text-gray-700 truncate"
              style={{ width: PERIOD_WIDTH }}
            >
              {item.period}
            </div>

            {/* Numbers */}
            <div className="flex" style={{ gap: NUMBER_GAP }}>
              {[0,1,2,3,4,5,6,7,8,9].map(n => {
                const isHit = n === item.number;
                const color =
                  n === 0 || n === 5
                    ? "bg-purple-500"
                    : [1,3,7,9].includes(n)
                    ? "bg-green-500"
                    : "bg-red-500";

                return (
                  <div
                    key={n}
                    className={`rounded-full flex items-center justify-center text-[11px] ${
                      isHit ? `${color} text-white` : "border text-gray-300"
                    }`}
                    style={{
                      width: NUMBER_SIZE,
                      height: NUMBER_SIZE,
                    }}
                  >
                    {n}
                  </div>
                );
              })}
            </div>

            {/* B / S */}
            <div
              className={`ml-2 rounded-full flex items-center justify-center text-[11px] text-white ${
                item.bigSmall === "Big" ? "bg-yellow-400" : "bg-blue-400"
              }`}
              style={{
                width: NUMBER_SIZE,
                height: NUMBER_SIZE,
              }}
            >
              {item.bigSmall === "Big" ? "B" : "S"}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 py-3">
        <button className="w-8 h-8 rounded bg-gray-200">‹</button>
        <span className="text-xs text-gray-600">1/50</span>
        <button className="w-8 h-8 rounded bg-red-500 text-white">›</button>
      </div>
    </div>
  );
}
