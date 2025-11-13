
"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
  coins: any[];
  balances: Record<string, number>;
  selectedCoin: any;
  onSelectCoin: (coin: any) => void;
  onWithdraw: () => void;
  onDeposit: () => void;
  hideZero: boolean;
  displayFiat: boolean;
  selectedCurrency: string;
}

const fiatRates: Record<string, Record<string, number>> = {
  INR: { BTC: 5800000, ETH: 320000, LTC: 7500, USDT: 84, SOL: 4800, XRP: 50, BNB: 50000 },
  USD: { BTC: 70000, ETH: 4000, LTC: 90, USDT: 1, SOL: 60, XRP: 0.6, BNB: 600 },
};

const WalletOverview: React.FC<Props> = ({
  coins,
  balances,
  selectedCoin,
  onSelectCoin,
  onWithdraw,
  onDeposit,
  hideZero,
  displayFiat,
  selectedCurrency,
}) => {
  const formatBalance = (symbol: string, balance: number) => {
    if (!displayFiat || symbol === selectedCurrency) return balance.toFixed(4);
    const rate = fiatRates[selectedCurrency][symbol];
    return rate ? (balance * rate).toFixed(2) : balance.toFixed(4);
  };

  return (
    <div className="space-y-4">
      {/* Balance Display */}
      <div className="bg-[#13283D] p-5 rounded-xl">
        <p className="text-sm text-gray-400 mb-1">{selectedCoin.name}</p>
        <p className="text-2xl font-semibold">
          {displayFiat && selectedCoin.symbol !== selectedCurrency
            ? `${selectedCurrency} `
            : ""}
          {formatBalance(selectedCoin.symbol, balances[selectedCoin.symbol])}
        </p>
      </div>

      {/* Coins List */}
      <div className="bg-[#13283D] p-3 rounded-xl h-[200px] overflow-y-auto space-y-2">
        {coins
          .filter(
            (c) => !hideZero || (balances[c.symbol] && balances[c.symbol] > 0)
          )
          .map((coin) => (
            <motion.div
              key={coin.symbol}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectCoin(coin)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                selectedCoin.symbol === coin.symbol
                  ? "bg-[#1C2F45]"
                  : "hover:bg-[#1C2F45]/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <Image src={coin.icon} alt={coin.symbol} width={26} height={26} />
                <span className="font-medium">{coin.symbol}</span>
              </div>
              <span className="text-gray-300 text-sm">
                {displayFiat && coin.symbol !== selectedCurrency
                  ? selectedCurrency + " "
                  : ""}
                {formatBalance(coin.symbol, balances[coin.symbol])}
              </span>
            </motion.div>
          ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-3">
        <button
          onClick={onDeposit}
          className="flex-1 bg-[#00C74D] hover:bg-[#03e15b] py-3 rounded-lg text-sm font-semibold"
        >
          Deposit
        </button>
        <button
          onClick={onWithdraw}
          className="flex-1 bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg text-sm font-semibold"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default WalletOverview;
