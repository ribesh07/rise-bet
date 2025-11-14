
// "use client";
// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { CheckCircle2 } from "lucide-react";

// interface WalletWithdrawProps {
//   balance: number;
//   setBalance: React.Dispatch<React.SetStateAction<number>>;
//   onBack: () => void;
//   onSuccess: () => void;
//   selectedCoin: { symbol: string; name: string };
// }

// const WalletWithdraw: React.FC<WalletWithdrawProps> = ({
//   balance,
//   setBalance,
//   onBack,
//   onSuccess,
//   selectedCoin,
// }) => {
//   const [amount, setAmount] = useState("");
//   const [address, setAddress] = useState("");
//   const [error, setError] = useState("");
//   const [showPopup, setShowPopup] = useState(false);

//   const MIN_WITHDRAW = 1;
//   const FEE = 0.5;

//   const handleWithdraw = () => {
//     const val = parseFloat(amount);
//     if (!val || val <= 0) return setError("Enter valid amount");
//     if (val < MIN_WITHDRAW)
//       return setError(
//         `Minimum withdrawal is ${selectedCoin.symbol} ${MIN_WITHDRAW}`
//       );
//     if (val + FEE > balance)
//       return setError("Insufficient balance (including fee)");
//     if (!address.trim()) return setError("Enter valid address / UPI ID");

//     setError("");
//     setBalance(balance - (val + FEE));
//     onSuccess();

//     setShowPopup(true);
//     setTimeout(() => setShowPopup(false), 2500);
//   };

//   return (
//     <div className="relative bg-[#0B1622] rounded-xl p-5 text-white border border-white/10">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold">Withdraw</h2>
//         <button
//           onClick={onBack}
//           className="text-gray-400 hover:text-white text-sm"
//         >
//           Back
//         </button>
//       </div>

//       {/* Coin Info */}
//       <div className="bg-[#12263A] rounded-xl p-4 flex justify-between items-center mb-5">
//         <div>
//           <p className="font-semibold text-base">{selectedCoin.symbol}</p>
//           <p className="text-xs text-gray-400">{selectedCoin.name}</p>
//         </div>
//         <div className="text-right">
//           <p className="text-xs text-gray-400">Balance</p>
//           <p className="text-sm font-semibold">
//             {balance.toFixed(8)} {selectedCoin.symbol}
//           </p>
//         </div>
//       </div>

//       {/* Amount Input */}
//       <label className="text-gray-400 text-xs">Amount*</label>
//       <input
//         type="number"
//         className="bg-[#13283D] w-full rounded-lg p-3 mt-1 text-white outline-none"
//         placeholder={`Enter amount in ${selectedCoin.symbol}`}
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//       />

//       {/* Address Input */}
//       <label className="text-gray-400 text-xs mt-4 block">
//         Address / UPI ID*
//       </label>
//       <input
//         type="text"
//         className="bg-[#13283D] w-full rounded-lg p-3 mt-1 text-white outline-none"
//         placeholder="Enter your wallet address / UPI ID"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//       />

//       {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

//       {/* Fee Info */}
//       <div className="bg-[#13283D] p-4 rounded-xl mt-5 text-sm text-gray-400 space-y-2">
//         <p>
//           Minimum Withdraw:{" "}
//           <span className="text-white font-medium">
//             {MIN_WITHDRAW} {selectedCoin.symbol}
//           </span>
//         </p>
//         <p>
//           Transaction Fee:{" "}
//           <span className="text-white font-medium">
//             {FEE} {selectedCoin.symbol}
//           </span>
//         </p>
//       </div>

//       {/* Withdraw Button */}
//       <button
//         onClick={handleWithdraw}
//         className="w-full bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg text-sm font-semibold transition mt-5"
//       >
//         Withdraw
//       </button>

//       {/* ✅ Success Popup */}
//       <AnimatePresence>
//         {showPopup && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-[#142A3E] px-6 py-5 rounded-2xl shadow-lg flex flex-col items-center text-center max-w-xs"
//             >
//               <CheckCircle2 className="text-green-400 w-12 h-12 mb-2" />
//               <h3 className="text-white font-semibold text-lg">
//                 Withdrawal Successful
//               </h3>
//               <p className="text-gray-400 text-sm mt-1">
//                 {amount} {selectedCoin.symbol} withdrawn successfully.
//               </p>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default WalletWithdraw;
// "use client";
// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { CheckCircle2 } from "lucide-react";
// import { useNotifications } from "@/context/NotificationContext"; // ✅ ADDED

// interface WalletWithdrawProps {
//   balance: number;
//   setBalance: React.Dispatch<React.SetStateAction<number>>;
//   onBack: () => void;
//   onSuccess: () => void;
//   selectedCoin: { symbol: string; name: string };
// }

// const WalletWithdraw: React.FC<WalletWithdrawProps> = ({
//   balance,
//   setBalance,
//   onBack,
//   onSuccess,
//   selectedCoin,
// }) => {
//   const [amount, setAmount] = useState("");
//   const [address, setAddress] = useState("");
//   const [error, setError] = useState("");
//   const [showPopup, setShowPopup] = useState(false);

//   const { pushNotifications } = useNotifications(); // ✅ HOOK

//   const MIN_WITHDRAW = 1;
//   const FEE = 0.5;

//   const handleWithdraw = () => {
//     const val = parseFloat(amount);

//     if (!val || val <= 0) return setError("Enter valid amount");
//     if (val < MIN_WITHDRAW)
//       return setError(
//         `Minimum withdrawal is ${selectedCoin.symbol} ${MIN_WITHDRAW}`
//       );
//     if (val + FEE > balance)
//       return setError("Insufficient balance (including fee)");
//     if (!address.trim()) return setError("Enter valid address / UPI ID");

//     setError("");
//     setBalance(balance - (val + FEE));
//     onSuccess();

//     // 🔥 GENERATE RANDOM TX ID  
//     const txId = Math.random().toString(36).substring(2, 10).toUpperCase();

//     // 🔥 SEND STAKE-STYLE NOTIFICATION  
//     pushNotification({
//       title: "Withdrawal Successful",
//       message: `You withdrew ${val} ${selectedCoin.symbol}.`,
//       type: "success",
//       category: "transactions",
//       url: `/transactions/${txId}`, // user can click notification
//       meta: { txId, amount: val },
//     });

//     setShowPopup(true);
//     setTimeout(() => setShowPopup(false), 2500);
//   };

//   return (
//     <div className="relative bg-[#0B1622] rounded-xl p-5 text-white border border-white/10">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold">Withdraw</h2>
//         <button onClick={onBack} className="text-gray-400 hover:text-white text-sm">
//           Back
//         </button>
//       </div>

//       {/* Coin Info */}
//       <div className="bg-[#12263A] rounded-xl p-4 flex justify-between items-center mb-5">
//         <div>
//           <p className="font-semibold text-base">{selectedCoin.symbol}</p>
//           <p className="text-xs text-gray-400">{selectedCoin.name}</p>
//         </div>
//         <div className="text-right">
//           <p className="text-xs text-gray-400">Balance</p>
//           <p className="text-sm font-semibold">
//             {balance.toFixed(8)} {selectedCoin.symbol}
//           </p>
//         </div>
//       </div>

//       {/* Amount Input */}
//       <label className="text-gray-400 text-xs">Amount*</label>
//       <input
//         type="number"
//         className="bg-[#13283D] w-full rounded-lg p-3 mt-1 text-white outline-none"
//         placeholder={`Enter amount in ${selectedCoin.symbol}`}
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//       />

//       {/* Address Input */}
//       <label className="text-gray-400 text-xs mt-4 block">
//         Address / UPI ID*
//       </label>
//       <input
//         type="text"
//         className="bg-[#13283D] w-full rounded-lg p-3 mt-1 text-white outline-none"
//         placeholder="Enter your wallet address / UPI ID"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//       />

//       {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

//       {/* Fee Info */}
//       <div className="bg-[#13283D] p-4 rounded-xl mt-5 text-sm text-gray-400 space-y-2">
//         <p>
//           Minimum Withdraw:{" "}
//           <span className="text-white font-medium">
//             {MIN_WITHDRAW} {selectedCoin.symbol}
//           </span>
//         </p>
//         <p>
//           Transaction Fee:{" "}
//           <span className="text-white font-medium">
//             {FEE} {selectedCoin.symbol}
//           </span>
//         </p>
//       </div>

//       {/* Withdraw Button */}
//       <button
//         onClick={handleWithdraw}
//         className="w-full bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg text-sm font-semibold transition mt-5"
//       >
//         Withdraw
//       </button>

//       {/* Success Popup */}
//       <AnimatePresence>
//         {showPopup && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-[#142A3E] px-6 py-5 rounded-2xl shadow-lg flex flex-col items-center text-center max-w-xs"
//             >
//               <CheckCircle2 className="text-green-400 w-12 h-12 mb-2" />
//               <h3 className="text-white font-semibold text-lg">
//                 Withdrawal Successful
//               </h3>
//               <p className="text-gray-400 text-sm mt-1">
//                 {amount} {selectedCoin.symbol} withdrawn successfully.
//               </p>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default WalletWithdraw;
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

interface WalletWithdrawProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  onBack: () => void;
  onSuccess: () => void;
  selectedCoin: { symbol: string; name: string };
}

const WalletWithdraw: React.FC<WalletWithdrawProps> = ({
  balance,
  setBalance,
  onBack,
  onSuccess,
  selectedCoin,
}) => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const { pushNotification } = useNotifications(); // ✅ fixed

  const MIN_WITHDRAW = 1;
  const FEE = 0.5;

  const handleWithdraw = () => {
    const val = parseFloat(amount);

    // Validation
    if (!address.trim()) return setError("Enter valid address / UPI ID");
    if (!val || val <= 0) return setError("Enter valid amount");
    if (val < MIN_WITHDRAW)
      return setError(
        `Minimum withdrawal is ${selectedCoin.symbol} ${MIN_WITHDRAW}`
      );
    if (val + FEE > balance)
      return setError("Insufficient balance (including fee)");

    // Clear errors
    setError("");

    // Deduct balance
    setBalance(balance - (val + FEE));

    // Call parent success
    onSuccess();

    // Generate fake transaction ID
    const txId = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Send notification
    pushNotification({
      title: "Withdrawal Successful",
      message: `You withdrew ${val} ${selectedCoin.symbol}.`,
      type: "success",
      category: "transactions",
      meta: { txId, amount: val, coin: selectedCoin.symbol },
      url: undefined,
      date: ""
    });

    // Show popup
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2500);

    // Clear inputs
    setAmount("");
    setAddress("");
  };

  return (
    <div className="relative bg-[#0B1622] rounded-xl p-5 text-white border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Withdraw</h2>
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white text-sm"
        >
          Back
        </button>
      </div>

      {/* Coin Info */}
      <div className="bg-[#12263A] rounded-xl p-4 flex justify-between items-center mb-5">
        <div>
          <p className="font-semibold text-base">{selectedCoin.symbol}</p>
          <p className="text-xs text-gray-400">{selectedCoin.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Balance</p>
          <p className="text-sm font-semibold">
            {balance.toFixed(8)} {selectedCoin.symbol}
          </p>
        </div>
      </div>

      {/* Amount Input */}
      <label className="text-gray-400 text-xs">Amount*</label>
      <input
        type="number"
        className="bg-[#13283D] w-full rounded-lg p-3 mt-1 text-white outline-none"
        placeholder={`Enter amount in ${selectedCoin.symbol}`}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Address Input */}
      <label className="text-gray-400 text-xs mt-4 block">
        Address / UPI ID*
      </label>
      <input
        type="text"
        className="bg-[#13283D] w-full rounded-lg p-3 mt-1 text-white outline-none"
        placeholder="Enter your wallet address / UPI ID"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

      {/* Fee Info */}
      <div className="bg-[#13283D] p-4 rounded-xl mt-5 text-sm text-gray-400 space-y-2">
        <p>
          Minimum Withdraw:{" "}
          <span className="text-white font-medium">
            {MIN_WITHDRAW} {selectedCoin.symbol}
          </span>
        </p>
        <p>
          Transaction Fee:{" "}
          <span className="text-white font-medium">
            {FEE} {selectedCoin.symbol}
          </span>
        </p>
      </div>

      {/* Withdraw Button */}
      <button
        onClick={handleWithdraw}
        className="w-full bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg text-sm font-semibold transition mt-5"
      >
        Withdraw
      </button>

      {/* Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#142A3E] px-6 py-5 rounded-2xl shadow-lg flex flex-col items-center text-center max-w-xs"
            >
              <CheckCircle2 className="text-green-400 w-12 h-12 mb-2" />
              <h3 className="text-white font-semibold text-lg">
                Withdrawal Successful
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {amount} {selectedCoin.symbol} withdrawn successfully.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletWithdraw;
