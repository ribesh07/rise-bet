
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpToLine, X, Eye, EyeOff,Vault } from "lucide-react";

interface Props {
  onClose: () => void;
}

const VaultINR: React.FC<Props> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  

  // ✅ Balances stored in state so they can update
  const [balance, setBalance] = useState(200);
  const [vaultBalance, setVaultBalance] = useState(150);

  const currentBalance = activeTab === "deposit" ? balance : vaultBalance;

  // ✅ Deposit or Withdraw action
  const handleSubmit = () => {
    const value = Number(amount);
    if (!value || value <= 0) return;

    if (activeTab === "deposit") {
      // Subtract from balance → Add to vault
      setBalance((prev) => prev - value);
      setVaultBalance((prev) => prev + value);
    } else {
      // Withdraw: move from vault → main
      if (!password) return;
      setVaultBalance((prev) => prev - value);
      setBalance((prev) => prev + value);
    }

    // show success screen
    setIsSuccess(true);
  };

  // ✅ SUCCESS PAGE
  // ✅ SUCCESS PAGE
if (isSuccess) {
  return (
    <motion.div
      className="bg-[#0C1A2A] w-[450px] rounded-2xl p-6 shadow-xl relative text-white"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-white"
      >
        <X size={20} />
      </button>
      <div className="text-xl font-semibold flex items-center mb-6">
        <span className="mr-2"><Vault size={24} /></span> Vault
      </div>
      <div className="flex flex-col items-center text-center">
        
        {/* ✅ Show different images */}
        <img
          src={activeTab === "deposit" ? "/images/vaultsuccess.png" : "/images/withdrawsuccess.png"}
          className="w-full h-auto mb-4"
          alt="Success"
        />

        <h2 className="text-xl font-bold">
          {activeTab === "deposit" ? "Your Vault Deposit is Complete" : "Withdrawal Successful"}
        </h2>

        <p className="text-gray-400 mt-1 text-sm">
          You have successfully {activeTab === "deposit" ? "made a vault deposit" : "withdrawn funds"}.
        </p>

        <div className="bg-[#13283D] rounded-lg p-4 mt-5 w-full flex justify-between items-center border border-[#1C2F45]">
          <div>
            <div className="text-lg font-semibold">INR</div>
            <div className="text-gray-400 text-sm">Indian Rupee</div>
          </div>

          <div className="text-right">
            <div className="text-lg font-semibold">₹{Number(amount).toFixed(2)}</div>
            <div className="text-gray-400 text-sm">$1.85 USD</div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 bg-[#13283D] hover:bg-[#1A2D45] p-3 px-12 rounded-lg font-semibold border border-[#1C2F45] transition"
            onClick={onClose}
          >
            Done
          </button>

  
  <button
    className=" bg-[#3175FF] hover:bg-[#4D87FF] py-3 px-6 rounded-lg font-semibold transition"
    onClick={() => {
      setAmount("");
      setPassword("");
      setIsSuccess(false);
    }}
  >
    Return to Vault
  </button>

 
</div>

        <p className="text-gray-400 text-xs mt-3 text-center px-2 leading-tight">
        rise keeps Vault funds secure in cold storage. Withdraw anytime with no fees.
      </p>
      </div>
    </motion.div>
  );
}


  // ✅ MAIN FORM UI
  return (
    <motion.div
      className="bg-[#0C1A2A] w-[450px] rounded-2xl p-6 shadow-xl relative text-white"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-white"
      >
        <X size={20} />
      </button>

      <div className="text-xl font-semibold flex items-center mb-6">
        <span className="mr-2"><Vault size={24} /></span> Vault
      </div>

      <div className="flex bg-[#13283D] rounded-full p-1 mb-6">
        <button
          onClick={() => setActiveTab("deposit")}
          className={`flex-1 py-2 rounded-full flex items-center justify-center gap-2 transition ${
            activeTab === "deposit" ? "bg-[#1D3A57] text-white" : "text-gray-400"
          }`}
        >
          <ArrowDownToLine size={18} /> Deposit
        </button>

        <button
          onClick={() => setActiveTab("withdraw")}
          className={`flex-1 py-2 rounded-full flex items-center justify-center gap-2 transition ${
            activeTab === "withdraw" ? "bg-[#1D3A57] text-white" : "text-gray-400"
          }`}
        >
          <ArrowUpToLine size={18} /> Withdraw
        </button>
      </div>

      <div className="text-sm text-gray-300 mb-1">
        {activeTab === "deposit" ? "Main Balance" : "Vault Balance"}
      </div>

      <div className="bg-[#13283D] rounded-lg p-4 mb-5 flex justify-between items-center border border-[#1C2F45]">
        <div>
          <div className="text-lg font-semibold">INR</div>
          <div className="text-gray-400 text-sm">Indian Rupee</div>
        </div>

        <div className="text-right">
          <div className="text-lg font-semibold">₹{currentBalance.toFixed(2)}</div>
          <div className="text-gray-400 text-sm">$0.00 USD</div>
        </div>
      </div>

      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">Amount</span>
        <span className="text-gray-300">$0.00</span>
      </div>

      <div className="bg-[#13283D] rounded-lg px-3 py-3 flex items-center border border-[#1C2F45]">
        <input
          type="number"
          className="flex-1 bg-transparent text-white outline-none"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <span className="bg-[#1D3A57] px-2 py-1 rounded text-xs mr-2">INR</span>

        <button
          className="text-xs font-semibold opacity-80 hover:opacity-100"
          onClick={() => setAmount(currentBalance.toString())}
        >
          Max
        </button>
      </div>

      {activeTab === "withdraw" && (
        <div className="mt-4">
          <label className="text-gray-300 text-sm">Password *</label>
          <div className="bg-[#13283D] rounded-lg px-3 py-3 flex items-center border border-[#1C2F45] mt-1">
            <input
              type={showPass ? "text" : "password"}
              className="flex-1 bg-transparent text-white outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      )}

      {/* ✅ BUTTON FIXED TO WORK */}
      <button
        className="w-full bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg mt-6 font-semibold transition disabled:bg-gray-700"
        disabled={!amount || (activeTab === "withdraw" && !password)}
        onClick={handleSubmit}
      >
        {activeTab === "deposit" ? "Deposit to Vault" : "Withdraw from Vault"}
      </button>

      <p className="text-gray-400 text-xs mt-3 text-center px-2 leading-tight">
        rise keeps Vault funds secure in cold storage. Withdraw anytime with no fees.
      </p>

      
    </motion.div>
  );
};

export default VaultINR;
