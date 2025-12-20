// "use client";
// import React, { useEffect, useState } from "react";
// import "../css/SweetBonanza.css";

// const SYMBOLS = [
//   "/games/sweetbonanza/banana.png",
//   "/games/sweetbonanza/watermelon.png",
//   "/games/sweetbonanza/pear.png",
//   "/games/sweetbonanza/green.png",
//   "/games/sweetbonanza/blue.png",
//   "/games/sweetbonanza/red.png",
//   "/games/sweetbonanza/grape.png",
//   "/games/sweetbonanza/purple.png",
// ];

// const ROWS = 5;
// const COLS = 5;

// const randomSymbol = () =>
//   SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

// const generateGrid = () =>
//   Array.from({ length: ROWS * COLS }, randomSymbol);

// const SlotUI = () => {
//   const [grid, setGrid] = useState<string[]>(generateGrid());
//   const [spinningCols, setSpinningCols] = useState<boolean[]>(
//     Array(COLS).fill(false)
//   );
//   const [wins, setWins] = useState<Set<number>>(new Set());
//   const [isSpinning, setIsSpinning] = useState(false);

//   /* ---------------- SPIN ---------------- */
//   const spin = () => {
//     if (isSpinning) return;
//     setIsSpinning(true);
//     setWins(new Set());

//     setSpinningCols(Array(COLS).fill(true));

//     for (let col = 0; col < COLS; col++) {
//       setTimeout(() => {
//         setGrid((prev) => {
//           const next = [...prev];
//           for (let row = 0; row < ROWS; row++) {
//             next[row * COLS + col] = randomSymbol();
//           }
//           return next;
//         });

//         setSpinningCols((prev) => {
//           const n = [...prev];
//           n[col] = false;
//           return n;
//         });

//         if (col === COLS - 1) {
//           setTimeout(findWins, 400);
//         }
//       }, 700 + col * 250);
//     }
//   };

//   /* ---------------- WIN LOGIC (simple demo) ---------------- */
//   const findWins = () => {
//     const winSet = new Set<number>();

//     // Horizontal matches (3+)
//     for (let r = 0; r < ROWS; r++) {
//       for (let c = 0; c < COLS - 2; c++) {
//         const i = r * COLS + c;
//         const s = grid[i];
//         if (s === grid[i + 1] && s === grid[i + 2]) {
//           winSet.add(i);
//           winSet.add(i + 1);
//           winSet.add(i + 2);
//         }
//       }
//     }

//     if (winSet.size > 0) {
//       setWins(winSet);
//       setTimeout(() => cascade(winSet), 700);
//     } else {
//       setIsSpinning(false);
//     }
//   };

//   /* ---------------- CASCADE ---------------- */
//   const cascade = (winSet: Set<number>) => {
//     setGrid((prev) => {
//       const next = [...prev];

//       // Remove winning symbols
//       winSet.forEach((i) => (next[i] = ""));

//       // Drop symbols
//       for (let c = 0; c < COLS; c++) {
//         let stack: string[] = [];
//         for (let r = ROWS - 1; r >= 0; r--) {
//           const i = r * COLS + c;
//           if (next[i]) stack.push(next[i]);
//         }
//         for (let r = ROWS - 1; r >= 0; r--) {
//           const i = r * COLS + c;
//           next[i] = stack.shift() || randomSymbol();
//         }
//       }
//       return next;
//     });

//     setWins(new Set());

//     setTimeout(findWins, 600);
//   };

//   return (
//     <div className="slot-root sweet-header-bg">
//       <div className="slot-board">
//         <div className="slot-grid">
//           {grid.map((icon, i) => {
//             const col = i % COLS;
//             return (
//               <div
//                 key={i}
//                 className={`slot-cell
//                   ${spinningCols[col] ? "spinning" : ""}
//                   ${wins.has(i) ? "win" : ""}`}
//               >
//                 {icon && <img src={icon} draggable={false} />}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <div className="bottom-bar">
//         <button className="spin-btn" onClick={spin}>
//           ⟳
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SlotUI;
"use client";
import React, { useState } from "react";
import "../css/SweetBonanza.css";

const SYMBOLS = [
  "/games/sweetbonanza/banana.png",
  "/games/sweetbonanza/watermelon.png",
  "/games/sweetbonanza/pear.png",
  "/games/sweetbonanza/green.png",
  "/games/sweetbonanza/blue.png",
  "/games/sweetbonanza/red.png",
  "/games/sweetbonanza/grape.png",
  "/games/sweetbonanza/purple.png",
];

const ROWS = 5;
const COLS = 6;

const randomSymbol = () =>
  SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

const generateGrid = () =>
  Array.from({ length: ROWS * COLS }, randomSymbol);

const SlotUI = () => {
  const [grid, setGrid] = useState<string[]>(generateGrid());
  const [spinningCols, setSpinningCols] = useState<boolean[]>(
    Array(COLS).fill(false)
  );
  const [wins, setWins] = useState<Set<number>>(new Set());
  const [isSpinning, setIsSpinning] = useState(false);

  /* ================= SPIN ================= */
  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWins(new Set());
    setSpinningCols(Array(COLS).fill(true));

    for (let col = 0; col < COLS; col++) {
      setTimeout(() => {
        setGrid((prev) => {
          const next = [...prev];
          for (let row = 0; row < ROWS; row++) {
            next[row * COLS + col] = randomSymbol();
          }
          return next;
        });

        setSpinningCols((prev) => {
          const n = [...prev];
          n[col] = false;
          return n;
        });

        if (col === COLS - 1) {
          setTimeout(findWins, 400);
        }
      }, 600 + col * 220);
    }
  };

  /* ================= WIN CHECK ================= */
  const findWins = () => {
    const winSet = new Set<number>();

    // Horizontal 3+ demo
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS - 2; c++) {
        const i = r * COLS + c;
        const s = grid[i];
        if (s && s === grid[i + 1] && s === grid[i + 2]) {
          winSet.add(i);
          winSet.add(i + 1);
          winSet.add(i + 2);
        }
      }
    }

    if (winSet.size > 0) {
      setWins(winSet);
      setTimeout(() => cascade(winSet), 700);
    } else {
      setIsSpinning(false);
    }
  };

  /* ================= CASCADE ================= */
  const cascade = (winSet: Set<number>) => {
    setGrid((prev) => {
      const next = [...prev];

      winSet.forEach((i) => (next[i] = ""));

      for (let c = 0; c < COLS; c++) {
        const stack: string[] = [];
        for (let r = ROWS - 1; r >= 0; r--) {
          const i = r * COLS + c;
          if (next[i]) stack.push(next[i]);
        }
        for (let r = ROWS - 1; r >= 0; r--) {
          const i = r * COLS + c;
          next[i] = stack.shift() || randomSymbol();
        }
      }
      return next;
    });

    setWins(new Set());
    setTimeout(findWins, 600);
  };

  return (
    <div className="slot-root sweet-header-bg">
        
      <div className="slot-board">
        <div className="slot-grid">
          {grid.map((icon, i) => {
            const col = i % COLS;
            return (
              <div
                key={i}
                className={`slot-cell
                  ${spinningCols[col] ? "spinning" : ""}
                  ${wins.has(i) ? "win" : ""}`}
              >
                {icon && <img src={icon} draggable={false} />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bottom-bar">
        <button className="spin-btn" onClick={spin}>
          ⟳
        </button>
      </div>
    </div>
  );
};

export default SlotUI;
