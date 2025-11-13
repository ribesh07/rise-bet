
// // // "use client";
// // // import React, { useState } from "react";
// // // import Image from "next/image";
// // // import { X, Wallet, Icon } from "lucide-react";
// // // import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// // // import { Switch } from "@/components/ui/switch";

// // // const WalletSettings: React.FC = () => {
// // //   const [hideZero, setHideZero] = useState(false);
// // //   const [displayFiat, setDisplayFiat] = useState(false);
// // //   const [selectedCurrency, setSelectedCurrency] = useState("USD");

// // //   const fiatCurrencies = [
// // //    { symbol: "INR", icon:"/coins/inr.svg" },
// // //    { symbol: "BTC", icon:"/coins/btc.svg" },
// // //     { symbol: "ETH", icon:"/coins/eth.svg" },
// // //     { symbol: "LTC", icon:"/coins/ltc.svg" },
// // //     { symbol: "USDT", icon:"/coins/usdt.svg" },
// // //     { symbol: "SOL", icon:"/coins/sol.svg" },
// // //     { symbol: "XRP", icon:"/coins/xrp.svg" },
// // //     { symbol: "TRX", icon:"/coins/trx.svg" },
// // //     { symbol: "BNB", icon:"/coins/bnb.svg" },
// // //     { symbol: "USDC", icon:"/coins/usdc.svg" },
    
// // //   ];

// // //   return (
// // //     <div className="w-full max-w-md mx-auto bg-[#132230] rounded-xl shadow-lg border border-[#24313f] p-4 text-white">
      
        

        
// // //           {/* Hide Zero Balances */}
// // //           <div className="flex items-start justify-between py-2 border-b border-[#1f2b38]">
// // //             <div>
// // //               <p className="text-sm font-medium">Hide Zero Balances</p>
// // //               <p className="text-xs text-gray-400">
// // //                 Your zero balances won't appear in your wallet
// // //               </p>
// // //             </div>
// // //             <Switch
// // //               checked={hideZero}
// // //               onCheckedChange={setHideZero}
// // //               className="data-[state=checked]:bg-[#4a9fff]"
// // //             />
// // //           </div>

// // //           {/* Display Crypto in Fiat */}
// // //           <div className="flex items-start justify-between py-2 border-b border-[#1f2b38]">
// // //             <div>
// // //               <p className="text-sm font-medium">Display Crypto in Fiat</p>
// // //               <p className="text-xs text-gray-400">
// // //                 All bets & transactions will be settled in the crypto equivalent
// // //               </p>
// // //             </div>
// // //             <Switch
// // //               checked={displayFiat}
// // //               onCheckedChange={setDisplayFiat}
// // //               className="data-[state=checked]:bg-[#4a9fff]"
// // //             />
// // //           </div>

// // //           {/* Currency List */}
// // //           <div className="grid grid-cols-4 gap-2 mt-4 max-h-80 overflow-y-auto custom-scrollbar">
// // //             {fiatCurrencies.map((fiat) => (
// // //               <div
// // //                 key={fiat.symbol}
// // //                 onClick={() => setSelectedCurrency(fiat.symbol)}
// // //                 className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer transition-all ${
// // //                   selectedCurrency === fiat.symbol
// // //                     ? "bg-[#1e2c3a]"
// // //                     : "hover:bg-[#172430]"
// // //                 }`}
// // //               >
// // //                 <Image
// // //                   src={fiat.icon}
// // //                   alt={fiat.symbol}
// // //                   width={28}
// // //                   height={28}
// // //                   className="rounded-full"
// // //                 />
// // //                 <span className="text-xs mt-1 text-gray-300">
// // //                   {fiat.symbol}
// // //                 </span>
// // //               </div>
// // //             ))}
// // //           </div>
        
      
// // //     </div>
// // //   );
// // // };

// // // export default WalletSettings;
// // "use client";
// // import React, { useState } from "react";
// // import Image from "next/image";
// // import { Switch } from "@/components/ui/switch";

// // const WalletSettings: React.FC = () => {
// //   const [hideZero, setHideZero] = useState(false);
// //   const [displayFiat, setDisplayFiat] = useState(false);
// //   const [selectedCurrency, setSelectedCurrency] = useState("USD");

// //   const fiatCurrencies = [
// //     { symbol: "INR", icon: "/coins/inr.svg" },
// //     { symbol: "BTC", icon: "/coins/btc.svg" },
// //     { symbol: "ETH", icon: "/coins/eth.svg" },
// //     { symbol: "LTC", icon: "/coins/ltc.svg" },
// //     { symbol: "USDT", icon: "/coins/usdt.svg" },
// //     { symbol: "SOL", icon: "/coins/sol.svg" },
// //     { symbol: "XRP", icon: "/coins/xrp.svg" },
// //     { symbol: "TRX", icon: "/coins/trx.svg" },
// //     { symbol: "BNB", icon: "/coins/bnb.svg" },
// //     { symbol: "USDC", icon: "/coins/usdc.svg" },
// //   ];

// //   return (
// //     <div className="w-full max-w-md mx-auto bg-[#0F1923] rounded-2xl p-5 shadow-lg text-white border border-[#1B2A3A]">
// //       {/* Hide Zero Balances */}
// //       <div className="flex items-start justify-between py-3 border-b border-[#1B2A3A]">
// //         <div>
// //           <p className="text-sm font-semibold">Hide Zero Balances</p>
// //           <p className="text-xs text-gray-400">
// //             Your zero balances won't appear in your wallet
// //           </p>
// //         </div>
// //         <Switch
// //           checked={hideZero}
// //           onCheckedChange={setHideZero}
// //           className="data-[state=checked]:bg-[#4A9FFF]"
// //         />
// //       </div>

// //       {/* Display Crypto in Fiat */}
// //       <div className="flex items-start justify-between py-3 border-b border-[#1B2A3A]">
// //         <div>
// //           <p className="text-sm font-semibold">Display Crypto in Fiat</p>
// //           <p className="text-xs text-gray-400 leading-snug">
// //             All bets & transactions will be settled in the crypto equivalent
// //           </p>
// //         </div>
// //         <Switch
// //           checked={displayFiat}
// //           onCheckedChange={setDisplayFiat}
// //           className="data-[state=checked]:bg-[#4A9FFF]"
// //         />
// //       </div>

// //       {/* Currency Grid */}
// //       <div className="grid grid-cols-4 gap-2 mt-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1B2A3A] scrollbar-track-transparent">
// //         {fiatCurrencies.map((fiat) => (
// //           <button
// //             key={fiat.symbol}
// //             onClick={() => setSelectedCurrency(fiat.symbol)}
// //             className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all border ${
// //               selectedCurrency === fiat.symbol
// //                 ? "bg-[#1C2F45] border-[#4A9FFF]"
// //                 : "bg-[#131F2C] border-transparent hover:bg-[#1C2F45]/60"
// //             }`}
// //           >
// //             <Image
// //               src={fiat.icon}
// //               alt={fiat.symbol}
// //               width={28}
// //               height={28}
// //               className="rounded-full"
// //             />
// //             <span
// //               className={`text-xs mt-1 ${
// //                 selectedCurrency === fiat.symbol
// //                   ? "text-white font-semibold"
// //                   : "text-gray-400"
// //               }`}
// //             >
// //               {fiat.symbol}
// //             </span>
// //           </button>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default WalletSettings;
// "use client";
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import Image from "next/image";

// const WalletSettings: React.FC = () => {
//   const [hideZero, setHideZero] = useState(false);
//   const [displayFiat, setDisplayFiat] = useState(false);
//   const [selectedCurrency, setSelectedCurrency] = useState("USD");

//   const fiatCurrencies = [
//     { symbol: "INR", icon: "/coins/inr.svg" },
//     { symbol: "BTC", icon: "/coins/btc.svg" },
//     { symbol: "ETH", icon: "/coins/eth.svg" },
//     { symbol: "LTC", icon: "/coins/ltc.svg" },
//     { symbol: "USDT", icon: "/coins/usdt.svg" },
//     { symbol: "SOL", icon: "/coins/sol.svg" },
//     { symbol: "XRP", icon: "/coins/xrp.svg" },
//     { symbol: "TRX", icon: "/coins/trx.svg" },
//     { symbol: "BNB", icon: "/coins/bnb.svg" },
//     { symbol: "USDC", icon: "/coins/usdc.svg" },
//   ];

//   return (
//     <div className="w-full max-w-md mx-auto bg-[#0F1923] rounded-2xl shadow-lg border border-[#1B2A3A] p-5 text-white">
//       {/* Hide Zero Balances */}
//       <div className="flex items-start justify-between py-3 border-b border-[#1B2A3A]">
//         <div>
//           <p className="text-sm font-semibold">Hide Zero Balances</p>
//           <p className="text-xs text-gray-400">
//             Your zero balances won&apos;t appear in your wallet
//           </p>
//         </div>
//         <AnimatedSwitch checked={hideZero} onChange={setHideZero} />
//       </div>

//       {/* Display Crypto in Fiat */}
//       <div className="flex items-start justify-between py-3 border-b border-[#1B2A3A]">
//         <div>
//           <p className="text-sm font-semibold">Display Crypto in Fiat</p>
//           <p className="text-xs text-gray-400 leading-snug">
//             All bets & transactions will be settled in the crypto equivalent
//           </p>
//         </div>
//         <AnimatedSwitch checked={displayFiat} onChange={setDisplayFiat} />
//       </div>

//       {/* Currency Grid */}
//       <div className="grid grid-cols-4 gap-2 mt-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1B2A3A] scrollbar-track-transparent">
//         {fiatCurrencies.map((fiat) => (
//           <button
//             key={fiat.symbol}
//             onClick={() => setSelectedCurrency(fiat.symbol)}
//             className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all border ${
//               selectedCurrency === fiat.symbol
//                 ? "bg-[#1C2F45] border-[#4A9FFF]"
//                 : "bg-[#131F2C] border-transparent hover:bg-[#1C2F45]/60"
//             }`}
//           >
//             <Image
//               src={fiat.icon}
//               alt={fiat.symbol}
//               width={28}
//               height={28}
//               className="rounded-full"
//             />
//             <span
//               className={`text-xs mt-1 ${
//                 selectedCurrency === fiat.symbol
//                   ? "text-white font-semibold"
//                   : "text-gray-400"
//               }`}
//             >
//               {fiat.symbol}
//             </span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// /* ----------------- Custom Stake-like Animated Switch ----------------- */
// const AnimatedSwitch = ({
//   checked,
//   onChange,
// }: {
//   checked: boolean;
//   onChange: (v: boolean) => void;
// }) => {
//   return (
//     <div
//       onClick={() => onChange(!checked)}
//       className={`w-10 h-5 rounded-full cursor-pointer flex items-center px-0.5 transition-colors ${
//         checked ? "bg-green-500" : "bg-[#2A3A4D]"
//       }`}
//     >
//       <motion.div
//         layout
//         transition={{ type: "spring", stiffness: 500, damping: 30 }}
//         className={`w-4 h-4 rounded-full bg-white shadow-md ${
//           checked ? "translate-x-5" : "translate-x-0"
//         }`}
//       />
//     </div>
//   );
// };

// export default WalletSettings;
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const WalletSettings: React.FC = () => {
  const [hideZero, setHideZero] = useState(false);
  const [displayFiat, setDisplayFiat] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const fiatCurrencies = [
    { symbol: "INR", icon: "/coins/inr.svg" },
    { symbol: "BTC", icon: "/coins/btc.svg" },
    { symbol: "ETH", icon: "/coins/eth.svg" },
    { symbol: "LTC", icon: "/coins/ltc.svg" },
    { symbol: "USDT", icon: "/coins/usdt.svg" },
    { symbol: "SOL", icon: "/coins/sol.svg" },
    { symbol: "XRP", icon: "/coins/xrp.svg" },
    { symbol: "TRX", icon: "/coins/trx.svg" },
    { symbol: "BNB", icon: "/coins/bnb.svg" },
    { symbol: "USDC", icon: "/coins/usdc.svg" },
  ];

  return (
    <div className="w-full max-w-md mx-auto bg-[#0F1923] rounded-2xl shadow-lg border border-[#1B2A3A] p-5 text-white">
      {/* Hide Zero Balances */}
      <div className="flex items-start justify-between py-3 border-b border-[#1B2A3A]">
        <div>
          <p className="text-sm font-semibold">Hide Zero Balances</p>
          <p className="text-xs text-gray-400">
            Your zero balances won&apos;t appear in your wallet
          </p>
        </div>
        <AnimatedSwitch checked={hideZero} onChange={setHideZero} />
      </div>

      {/* Display Crypto in Fiat */}
      <div className="flex items-start justify-between py-3 border-b border-[#1B2A3A]">
        <div>
          <p className="text-sm font-semibold">Display Crypto in Fiat</p>
          <p className="text-xs text-gray-400 leading-snug">
            All transactions will be settled in the crypto equivalent
          </p>
        </div>
        <AnimatedSwitch checked={displayFiat} onChange={setDisplayFiat} />
      </div>

      {/* Currency Grid */}
      <div className="grid grid-cols-4 gap-2 mt-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1B2A3A] scrollbar-track-transparent">
        {fiatCurrencies.map((fiat) => (
          <button
            key={fiat.symbol}
            onClick={() => setSelectedCurrency(fiat.symbol)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all border ${
              selectedCurrency === fiat.symbol
                ? "bg-[#1C2F45] border-[#4A9FFF]"
                : "bg-[#131F2C] border-transparent hover:bg-[#1C2F45]/60"
            }`}
          >
            <Image
              src={fiat.icon}
              alt={fiat.symbol}
              width={28}
              height={28}
              className="rounded-full"
            />
            <span
              className={`text-xs mt-1 ${
                selectedCurrency === fiat.symbol
                  ? "text-white font-semibold"
                  : "text-gray-400"
              }`}
            >
              {fiat.symbol}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ----------------- Perfect Stake-style Animated Switch ----------------- */
const AnimatedSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 flex items-center rounded-full transition-colors duration-300 ease-in-out
        ${checked ? "bg-[#00C74D] shadow-[0_0_6px_#00C74D]" : "bg-[#2A3A4D]"}`}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`w-5 h-5 rounded-full bg-white shadow-md absolute left-0.5 top-0.5 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default WalletSettings;
