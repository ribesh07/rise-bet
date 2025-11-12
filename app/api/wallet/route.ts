// import { NextResponse } from "next/server";

// export async function GET() {
//   // In real use, you'd fetch from your DB or blockchain API
//   const wallets = [
    
  
//     { "symbol": "BTC", "balance": 0.00000000, "icon": "/coins/btc.svg" },
//     { "symbol": "ETH", "balance": 0.00000000, "icon": "/coins/eth.svg" },
//     { "symbol": "LTC", "balance": 0.00000000, "icon": "/coins/ltc.svg" },
//     { "symbol": "USDT", "balance": 0.00000000, "icon": "/coins/usdt.svg" },
//     { "symbol": "SOL", "balance": 0.00000000, "icon": "/coins/sol.svg" },
//     { "symbol": "DOGE", "balance": 0.00000000, "icon": "/coins/doge.svg" },
//     { "symbol": "BCH", "balance": 0.00000000, "icon": "/coins/bch.svg" },
//     { "symbol": "XRP", "balance": 0.00000000, "icon": "/coins/xrp.svg" },
//     { "symbol": "TRX", "balance": 0.00000000, "icon": "/coins/trx.svg" }
  

//   ];

//   return NextResponse.json({ wallets });
// }
import { NextResponse } from "next/server";

export async function GET() {
  const wallets = [
    { symbol: "BTC", balance: 0.00012345 },
    { symbol: "ETH", balance: 0.01234567 },
    { symbol: "LTC", balance: 0.00345678 },
    { symbol: "USDT", balance: 50.25  },
    { symbol: "SOL", balance: 1.23  },
    { symbol: "XRP", balance: 200.0012 },
    { symbol: "TRX", balance: 1000.456  },
    { symbol: "BNB", balance: 0.56  },
    { symbol: "USDC", balance: 25.5  },
    { symbol: "INR", balance: 5000.00  }
  ];
  return NextResponse.json({ wallets });
}
