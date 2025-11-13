
// "use client";
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Wallet, X, CheckCircle } from "lucide-react";
// import { Card } from "@/components/ui/vipcard";

// interface WalletPopupProps {
//   onClose: () => void;
// }

// const WalletPopup: React.FC<WalletPopupProps> = ({ onClose }) => {
//   const [selectedTab, setSelectedTab] = useState("Overview");
//   const [showWithdraw, setShowWithdraw] = useState(false);
//   const [withdrawAmount, setWithdrawAmount] = useState("");
//   const [withdrawAddress, setWithdrawAddress] = useState("");
//   const [withdrawSuccess, setWithdrawSuccess] = useState(false);
//   const [error, setError] = useState("");

//   const [balance, setBalance] = useState(164.33);

//   const [tipAmount, setTipAmount] = useState("");
//   const [recipient, setRecipient] = useState("");
//   const [tipSuccess, setTipSuccess] = useState(false);
//   const [lastRecipient, setLastRecipient] = useState("");

//   const walletData = [{ name: "INR", label: "Indian Rupee", icon: "₹" }];
//   const MIN_TIP = 1;
//   const MIN_WITHDRAW = 100;
//   const FEE = 5;

//   const handleMinClick = () => {
//     setTipAmount(MIN_TIP.toString());
//     setError("");
//   };

//   const handleTip = () => {
//     const amount = parseFloat(tipAmount);
//     if (!amount || amount <= 0) return setError("Enter a valid amount");
//     if (amount < MIN_TIP) return setError(`Minimum tip is ₹${MIN_TIP}`);
//     if (amount > balance) return setError("Insufficient balance");
//     if (!recipient) return setError("Enter Username / ID");

//     setBalance((prev) => prev - amount);
//     setLastRecipient(recipient);
//     setTipSuccess(true);
//     setTipAmount("");
//     setRecipient("");
//     setError("");
//   };

//   const handleMaxWithdraw = () => {
//     setWithdrawAmount(balance.toFixed(2));
//     setError("");
//   };

//   const handleWithdraw = () => {
//     const amount = parseFloat(withdrawAmount);

//     if (!amount || amount <= 0) return setError("Enter a valid amount");
//     if (amount < MIN_WITHDRAW)
//       return setError(`Minimum withdrawal is ₹${MIN_WITHDRAW}`);
//     if (amount + FEE > balance)
//       return setError("Insufficient balance (including fee)");
//     if (!withdrawAddress) return setError("Enter a valid address / UPI ID");

//     setBalance((prev) => prev - (amount + FEE));
//     setWithdrawSuccess(true);
//     setError("");
//   };

//   return (
//     <motion.div
//       className="bg-[#0C1A2A] w-[400px] rounded-2xl p-6 shadow-xl relative text-white"
//       initial={{ scale: 0.85, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       exit={{ scale: 0.9, opacity: 0 }}
//       transition={{ duration: 0.2 }}
//     >
//       {/* Close */}
//       <button
//         onClick={onClose}
//         className="absolute right-5 top-5 text-gray-400 hover:text-white"
//       >
//         <X size={20} />
//       </button>

//       {/* ✅ TIP SUCCESS */}
//       {tipSuccess ? (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.75 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.25 }}
//           className="flex flex-col items-center text-center py-6"
//         >
//           <CheckCircle size={70} className="text-green-400 mb-3" />
//           <h2 className="text-xl font-semibold mb-1">Tip Successful!</h2>
//           <p className="text-gray-400 text-sm">
//             You tipped <span className="text-white font-semibold">₹{MIN_TIP.toFixed(2)}</span>
//           </p>
//           <p className="text-gray-400 text-sm mt-2">
//             Sent to <span className="text-white font-semibold">@{lastRecipient}</span>
//           </p>

//           <div className="bg-[#13283D] p-4 rounded-xl w-full mt-5">
//             <p className="text-sm text-gray-400">Remaining Balance</p>
//             <p className="text-2xl font-bold mt-1">₹{balance.toFixed(2)}</p>
//           </div>

//           <button
//             onClick={() => setTipSuccess(false)}
//             className="w-full bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg text-sm font-semibold transition mt-6"
//           >
//             Back to Wallet
//           </button>
//         </motion.div>
//       ) : withdrawSuccess ? (
//         // ✅ WITHDRAW SUCCESS
//         <motion.div
//           initial={{ opacity: 0, scale: 0.75 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.25 }}
//           className="flex flex-col items-center text-center py-6"
//         >
//           <CheckCircle size={70} className="text-green-400 mb-3" />
//           <h2 className="text-xl font-semibold mb-1">Withdrawal Successful!</h2>

//           <p className="text-gray-400 text-sm">
//             You withdrew <span className="text-white font-semibold">₹{withdrawAmount}</span>
//           </p>
//           <p className="text-gray-400 text-sm mt-2">
//             Sent to <span className="text-white font-semibold">{withdrawAddress}</span>
//           </p>

//           <div className="bg-[#13283D] p-4 rounded-xl w-full mt-5">
//             <p className="text-sm text-gray-400">Remaining Balance</p>
//             <p className="text-2xl font-bold mt-1">₹{balance.toFixed(2)}</p>
//           </div>

//           <button
//             onClick={() => {
//               setWithdrawSuccess(false);
//               setShowWithdraw(false);
//               setWithdrawAmount("");
//               setWithdrawAddress("");
//             }}
//             className="w-full bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg text-sm font-semibold transition mt-6"
//           >
//             Back to Wallet
//           </button>
//         </motion.div>
//       ) : (
//         <>
//           <div className="text-xl font-semibold flex items-center mb-5">
//             <Wallet size={24} className="mr-2" /> Wallet
//           </div>

//           {/* Tabs (hide when withdrawing) */}
//           {!showWithdraw && (
//             <div className="flex bg-[#13283D] rounded-2xl mb-5 text-sm font-medium overflow-hidden">
//               {["Overview", "Tip", "Setting"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setSelectedTab(tab)}
//                   className={`flex-1 py-2 transition ${
//                     selectedTab === tab
//                       ? "bg-[#1C2F45] text-white"
//                       : "text-gray-400 hover:bg-[#1C2F45]/50"
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//           )}

//           {/* ✅ OVERVIEW */}
//           {selectedTab === "Overview" && !showWithdraw && (
//             <>
//               <div className="mb-4">
//                 <p className="text-sm text-gray-400">Balance</p>
//                 <p className="text-2xl font-semibold mt-1">₹{balance.toFixed(2)}</p>
//               </div>

//               <Card className="bg-[#13283D] border-none rounded-2xl shadow-inner p-4">
//                 <div className="flex justify-between mb-2 text-gray-400 text-sm">
//                   <p>Currency</p>
//                   <p>Value</p>
//                 </div>

//                 {walletData.map((currency) => (
//                   <div key={currency.name} className="flex justify-between items-center border-t border-[#1C2F45]/60 pt-2">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 bg-[#1C2F45] flex items-center justify-center rounded-full text-lg">
//                         {currency.icon}
//                       </div>
//                       <div>
//                         <p className="font-medium">{currency.name}</p>
//                         <p className="text-xs text-gray-400">{currency.label}</p>
//                       </div>
//                     </div>
//                     <p className="font-semibold text-gray-200">₹{balance.toFixed(2)}</p>
//                   </div>
//                 ))}
//               </Card>

//               <div className="flex gap-3 mt-6">
//                 <button
//                   onClick={() => setShowWithdraw(true)}
//                   className="flex-1 bg-[#1C2F45] hover:bg-[#264A7A] py-3 rounded-lg text-sm font-semibold transition"
//                 >
//                   Withdraw
//                 </button>
//                 <button className="flex-1 bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg text-sm font-semibold transition">
//                   Deposit
//                 </button>
//               </div>
//             </>
//           )}

//           {/* ✅ TIP TAB */}
//           {selectedTab === "Tip" && !showWithdraw && (
//             <div className="mt-3">
//               <p className="text-sm text-gray-400 mb-1">Currency</p>
//               <div className="bg-[#13283D] rounded-xl p-4 flex justify-between items-center mb-5">
//                 <div className="flex items-center gap-2">
//                   <span className="bg-[#1C2F45] rounded-full w-7 h-7 flex items-center justify-center">
//                     {walletData[0].icon}
//                   </span>
//                   <div>
//                     <p className="font-semibold">{walletData[0].name}</p>
//                     <p className="text-xs text-gray-400">
//                       Balance: ₹{balance.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <label className="text-gray-400 text-sm">Amount*</label>
//               <div className="flex bg-[#13283D] rounded-lg p-3 items-center justify-between mt-1">
//                 <input
//                   type="number"
//                   className="bg-transparent outline-none text-white w-full"
//                   placeholder="0.00"
//                   value={tipAmount}
//                   onChange={(e) => setTipAmount(e.target.value)}
//                 />
//                 <button
//                   onClick={handleMinClick}
//                   className="ml-2 bg-[#1C2F45] px-3 py-1 rounded-md text-xs hover:bg-[#264A7A] transition"
//                 >
//                   Min
//                 </button>
//               </div>

//               {error && <p className="text-red-400 text-xs mt-1">{error}</p>}

//               <label className="text-gray-400 text-sm mt-4 block">Recipient*</label>
//               <input
//                 type="text"
//                 className="bg-[#13283D] w-full rounded-lg p-3 mt-1 text-white outline-none"
//                 placeholder="Enter Username / ID"
//                 value={recipient}
//                 onChange={(e) => setRecipient(e.target.value)}
//               />

//               <button
//                 onClick={handleTip}
//                 className="w-full bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg text-sm font-semibold transition mt-4"
//               >
//                 Tip
//               </button>
//             </div>
//           )}

//           {/* ✅ WITHDRAW SECTION */}
//           {showWithdraw && (
//             <motion.div
//               key="withdraw-section"
//               initial={{ opacity: 0, x: 40 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.25 }}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold">Withdraw</h2>
//                 <button
//                   onClick={() => setShowWithdraw(false)}
//                   className="text-gray-400 text-sm hover:text-white"
//                 >
//                   Back
//                 </button>
//               </div>

//               <div className="bg-[#13283D] rounded-xl p-4 flex justify-between items-center mb-5">
//                 <div className="flex items-center gap-2">
//                   <span className="bg-[#1C2F45] rounded-full w-7 h-7 flex items-center justify-center">
//                     {walletData[0].icon}
//                   </span>
//                   <div>
//                     <p className="font-semibold">{walletData[0].name}</p>
//                     <p className="text-xs text-gray-400">
//                       Balance: ₹{balance.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <label className="text-gray-400 text-sm">Amount*</label>
//               <div className="flex bg-[#13283D] rounded-lg p-3 items-center justify-between mt-1">
//                 <input
//                   type="number"
//                   className="bg-transparent outline-none text-white w-full"
//                   placeholder="Enter amount"
//                   value={withdrawAmount}
//                   onChange={(e) => setWithdrawAmount(e.target.value)}
//                 />
//                 <button
//                   onClick={handleMaxWithdraw}
//                   className="ml-2 bg-[#1C2F45] px-3 py-1 rounded-md text-xs hover:bg-[#264A7A] transition"
//                 >
//                   Max
//                 </button>
//               </div>

//               <label className="text-gray-400 text-sm mt-4 block">
//                 Address / UPI ID*
//               </label>
//               <input
//                 type="text"
//                 className="bg-[#13283D] w-full rounded-lg p-3 mt-1 text-white outline-none"
//                 placeholder="Enter your address / UPI ID"
//                 value={withdrawAddress}
//                 onChange={(e) => setWithdrawAddress(e.target.value)}
//               />

//               {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

//               <div className="bg-[#13283D] p-4 rounded-xl mt-5 text-sm text-gray-400 space-y-2">
//                 <p>Minimum Withdraw: <span className="text-white font-medium">₹{MIN_WITHDRAW}</span></p>
//                 <p>Transaction Fee: <span className="text-white font-medium">₹{FEE}</span></p>
//               </div>

//               <button
//                 onClick={handleWithdraw}
//                 className="w-full bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg text-sm font-semibold transition mt-5"
//               >
//                 Withdraw
//               </button>
//             </motion.div>
//           )}
//         </>
//       )}
//     </motion.div>
//   );
// };

// export default WalletPopup;
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, X } from "lucide-react";

import WalletOverview from "@/components/wallet/WalletOverview";
import WalletWithdraw from "@/components/wallet/WalletWithdraw";
import WalletTip from "@/components/wallet/WalletTip";
import WalletSetting from "@/components/wallet/WalletSetting";
import WalletSuccess from "@/components/wallet/WalletSuccess";

const WalletPopup = ({ onClose }: { onClose: () => void }) => {
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [tipSuccess, setTipSuccess] = useState(false);
  const [balance, setBalance] = useState(164.33);

  return (
    <motion.div
      className="bg-[#0C1A2A] w-[400px] rounded-2xl p-6 shadow-xl relative text-white"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 text-gray-400 hover:text-white"
      >
        <X size={20} />
      </button>

      {/* Header */}
      <div className="text-xl font-semibold flex items-center mb-5">
        <Wallet size={24} className="mr-2" /> Wallet
      </div>

      {/* Tabs */}
      {!showWithdraw && !withdrawSuccess && !tipSuccess && (
        <div className="flex bg-[#13283D] rounded-2xl mb-5 text-sm font-medium overflow-hidden">
          {["Overview", "Tip", "Setting"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 py-2 transition ${
                selectedTab === tab
                  ? "bg-[#1C2F45] text-white"
                  : "text-gray-400 hover:bg-[#1C2F45]/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Section rendering */}
      {withdrawSuccess ? (
        <WalletSuccess
          type="withdraw"
          onBack={() => setWithdrawSuccess(false)}
          balance={balance}
        />
      ) : tipSuccess ? (
        <WalletSuccess
          type="tip"
          onBack={() => setTipSuccess(false)}
          balance={balance}
        />
      ) : showWithdraw ? (
        <WalletWithdraw
          balance={balance}
          setBalance={setBalance}
          onBack={() => setShowWithdraw(false)}
          onSuccess={() => setWithdrawSuccess(true)}
        />
      ) : selectedTab === "Overview" ? (
        <WalletOverview
          balance={balance}
          onWithdraw={() => setShowWithdraw(true)}
        />
      ) : selectedTab === "Tip" ? (
        <WalletTip balance={balance} setBalance={setBalance} />
      ) : (
        <WalletSetting />
      )}
    </motion.div>
  );
};

export default WalletPopup;
