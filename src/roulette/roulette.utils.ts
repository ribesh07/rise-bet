export type RouletteResult = {
  number: number; // 0-36
  color: 'RED' | 'BLACK' | 'GREEN';
};

const redNumbers = new Set([
  1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36
]);

export function spinWheel(): RouletteResult {
  const number = Math.floor(Math.random() * 37); // 0..36
  const color = number === 0 ? 'GREEN' : (redNumbers.has(number) ? 'RED' : 'BLACK');
  return { number, color };
}

export function evaluateBet(payload: any, result: RouletteResult) {
  // payload example: { type: 'straight', number: 7 }
  switch (payload.type) {
    case 'straight':
      return payload.number === result.number ? 35 : -1;
    case 'color':
      return payload.color === result.color ? 1 : -1;
    case 'odd':
      return result.number !== 0 && (result.number % 2 === 1) ? 1 : -1;
    case 'even':
      return result.number !== 0 && (result.number % 2 === 0) ? 1 : -1;
    case 'dozen':
      {
        const n = result.number;
        if (n === 0) return -1;
        const d = payload.dozen; // 1,2,3
        if (d === 1 && n >=1 && n <=12) return 2;
        if (d === 2 && n >=13 && n <=24) return 2;
        if (d === 3 && n >=25 && n <=36) return 2;
        return -1;
      }
    case 'column':
      {
        const n = result.number;
        if (n === 0) return -1;
        // columns: col1 = 1,4,7..34 ; col2 = 2,5,8..35 ; col3 = 3,6,9..36
        const col = payload.column; // 1,2,3
        if (((n - col) % 3) === 0) return 2;
        return -1;
      }
    case 'high':
      return result.number >= 19 && result.number <= 36 ? 1 : -1;
    case 'low':
      return result.number >= 1 && result.number <= 18 ? 1 : -1;
    default:
      return -1;
  }
}

