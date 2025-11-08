
// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import { Card, CardContent } from "@/components/ui/vipcard";
// import ProgressCard from "@/components/progresscard";
// import { X, ChevronDown, BarChart3 } from "lucide-react";
// import { useToast } from "@/components/ui/usetoast";

// interface showStatisticsProps {
//   username?: string;
//   avatarUrl?: string;
//   vipProgress?: number;
//   currentLevelName?: string;
//   nextLevelName?: string;
//   currentLevel?: string;
//   nextLevel?: string;
//   joinDate?: string;
//   hasStats?: boolean;
//   onClose?: () => void;
// }

// const showStatistics: React.FC<showStatisticsProps> = ({
//   username = "Sanjay1205",
//   vipProgress = 28.84,
//   currentLevelName = "Bronze",
//   nextLevelName = "Silver",
//   currentLevel = "Bronze",
//   nextLevel = "Silver",
//   joinDate = "February 18, 2024",
//   hasStats = true,
//   onClose,
// }) => {
//   const { toast } = useToast();
//   const [progress, setProgress] = useState(0);
//   const [selectedType, setSelectedType] = useState("All");
//   const [selectedCurrency, setSelectedCurrency] = useState("INR");
//   const [openDropdown, setOpenDropdown] = useState<"type" | "currency" | null>(null);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Dynamic dummy data
//   const allStats = {
//     All: { totalBets: 69616, wins: 48117, losses: 21443, wagered: 18601.56 },
//     Casino: { totalBets: 25000, wins: 17000, losses: 8000, wagered: 8900.45 },
//     Sports: { totalBets: 0, wins: 0, losses: 0, wagered: 0 },
//   };

//   const typeOptions = ["All", "Casino", "Sports"];
//   const currencyOptions = ["INR", "USD"];

//   const currencySymbols: Record<string, string> = {
//     INR: "₹",
//     USD: "$",
    
//   };

//   const stats = allStats[selectedType as keyof typeof allStats];
//   const symbol = currencySymbols[selectedCurrency] || "";

//   // Animate progress bar
//   useEffect(() => {
//     const timeout = setTimeout(() => setProgress(vipProgress), 400);
//     return () => clearTimeout(timeout);
//   }, [vipProgress]);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setOpenDropdown(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Handle toast
//   const handleRequestStats = () => {
//     toast({
//       title: "📨 Statistics request sent",
//       description: "We’ll notify you once your latest statistics are ready.",
//       duration: 3000,
//     });
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/70" onClick={onClose} />

//       <div
//         ref={dropdownRef}
//         className="relative z-10 w-full max-w-md mx-auto bg-[#0d1116]/95 backdrop-blur-xl rounded-2xl p-4 text-white shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-[#1f2733]"
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center mb-3">
//           <div className="text-lg font-semibold flex items-center">
//             <span className="mr-2">📊</span> Statistics
//           </div>
//           <button onClick={onClose} className="text-gray-400 hover:text-white">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Username + Join Date */}
//         <div className="mb-2">
//           <p className="text-gray-200 font-medium">{username}</p>
//           <p className="text-sm text-gray-400">
//             Joined on <span className="text-gray-300">{joinDate}</span>
//           </p>
//         </div>

//         {/* VIP Progress */}
//         <Card className="w-full py-4 border-none rounded-2xl shadow-inner bg-transparent">
//           <CardContent className="p-3">
//             <ProgressCard
//               username={username}
//               progressPercentage={progress}
//               currentLevelName={currentLevelName}
//               nextLevelName={nextLevelName}
//               nextLevel={nextLevel}
//               currentLevel={currentLevel}
//             />
//           </CardContent>
//         </Card>

//         {/* Filters */}
//         <div className="grid grid-cols-2 gap-2 my-4 relative">
//           {/* Type Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
//               className="w-full bg-[#1a202b] rounded-lg px-3 py-2 flex justify-between items-center text-sm text-gray-300"
//             >
//               <span>{selectedType}</span>
//               <ChevronDown
//                 className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
//                   openDropdown === "type" ? "rotate-180" : ""
//                 }`}
//               />
//             </button>
//             {openDropdown === "type" && (
//               <div className="absolute mt-1 w-full bg-[#1a202b] rounded-lg shadow-lg border border-[#2a2f3a] z-20">
//                 {typeOptions.map((type) => (
//                   <div
//                     key={type}
//                     onClick={() => {
//                       setSelectedType(type);
//                       setOpenDropdown(null);
//                     }}
//                     className={`px-3 py-2 text-sm cursor-pointer hover:bg-[#2a2f3a] ${
//                       selectedType === type ? "text-green-400" : "text-gray-300"
//                     }`}
//                   >
//                     {type}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Currency Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setOpenDropdown(openDropdown === "currency" ? null : "currency")}
//               className="w-full bg-[#1a202b] rounded-lg px-3 py-2 flex justify-between items-center text-sm text-gray-300"
//             >
//               <span>{selectedCurrency}</span>
//               <ChevronDown
//                 className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
//                   openDropdown === "currency" ? "rotate-180" : ""
//                 }`}
//               />
//             </button>
//             {openDropdown === "currency" && (
//               <div className="absolute mt-1 w-full bg-[#1a202b] rounded-lg shadow-lg border border-[#2a2f3a] z-20">
//                 {currencyOptions.map((curr) => (
//                   <div
//                     key={curr}
//                     onClick={() => {
//                       setSelectedCurrency(curr);
//                       setOpenDropdown(null);
//                     }}
//                     className={`px-3 py-2 text-sm cursor-pointer hover:bg-[#2a2f3a] ${
//                       selectedCurrency === curr ? "text-green-400" : "text-gray-300"
//                     }`}
//                   >
//                     {curr}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Stats Grid */}
//         {/* Stats Grid */}
// {stats && Object.values(stats).some((value) => value !== 0) ? (
//   <div className="grid grid-cols-2 gap-3 mb-5 transition-all duration-300">
//     <div className="bg-[#131820] rounded-xl p-3">
//       <p className="text-xs text-gray-400 mb-1">Total Bets</p>
//       <p className="text-lg font-semibold">{stats.totalBets.toLocaleString()}</p>
//     </div>
//     <div className="bg-[#131820] rounded-xl p-3">
//       <p className="text-xs text-gray-400 mb-1">Number of Wins</p>
//       <p className="text-lg font-semibold">{stats.wins.toLocaleString()}</p>
//     </div>
//     <div className="bg-[#131820] rounded-xl p-3">
//       <p className="text-xs text-gray-400 mb-1">Number of Losses</p>
//       <p className="text-lg font-semibold">{stats.losses.toLocaleString()}</p>
//     </div>
//     <div className="bg-[#131820] rounded-xl p-3">
//       <p className="text-xs text-gray-400 mb-1">Wagered</p>
//       <p className="text-lg font-semibold">
//         {symbol} {stats.wagered.toLocaleString()}
//       </p>
//     </div>
//   </div>
// ) : (
//   <div className="flex flex-col items-center justify-center text-center my-10 text-gray-400">
//    <div className="flex flex-col items-center justify-center text-center py-12">
//               <div className="relative">
//                 <BarChart3 className="w-16 h-16 text-gray-500 opacity-30" />
//                 <span className="absolute top-[22%] left-[34%] w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_10px_#facc15] animate-pulse" />
//               </div>
//               <p className="text-gray-400 mt-4 font-medium">This user has no visible statistics</p>
//             </div>
    
//   </div>
// )}


//         {/* Request Button */}
//         <button
//           onClick={handleRequestStats}
//           className="w-full bg-[#1a202b] hover:bg-[#222a35] text-gray-300 py-2 rounded-lg text-sm transition"
//         >
//           Request statistics
//         </button>
//       </div>
//     </div>
//   );
// };

// export default showStatistics;
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, ChevronDown, BarChart3 } from "lucide-react";
import { useToast } from "@/components/ui/usetoast";
import ProgressCard from "@/components/progresscard";
import { Card, CardContent } from "@/components/ui/vipcard";

interface ShowStatisticsProps {
  username?: string;
  avatarUrl?: string;
  vipProgress?: number;
  currentLevelName?: string;
  nextLevelName?: string;
  currentLevel?: string;
  nextLevel?: string;
  joinDate?: string;
  hasStats?: boolean;
  onClose: () => void;
}

const ShowStatistics: React.FC<ShowStatisticsProps> = ({
  username = "Sanjay1205",
  vipProgress = 28.84,
  currentLevelName = "Bronze",
  nextLevelName = "Silver",
  currentLevel = "Bronze",
  nextLevel = "Silver",
  joinDate = "February 18, 2024",
  hasStats = true,
  onClose,
}) => {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [openDropdown, setOpenDropdown] = useState<"type" | "currency" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allStats = {
    All: { totalBets: 69616, wins: 48117, losses: 21443, wagered: 18601.56 },
    Casino: { totalBets: 25000, wins: 17000, losses: 8000, wagered: 8900.45 },
    Sports: { totalBets: 0, wins: 0, losses: 0, wagered: 0 },
  };

  const typeOptions = ["All", "Casino", "Sports"];
  const currencyOptions = ["INR", "USD"];
  const currencySymbols: Record<string, string> = { INR: "₹", USD: "$" };

  const stats = allStats[selectedType as keyof typeof allStats];
  const symbol = currencySymbols[selectedCurrency] || "";

  useEffect(() => {
    const t = setTimeout(() => setProgress(vipProgress), 400);
    return () => clearTimeout(t);
  }, [vipProgress]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRequestStats = () => {
    toast({
      title: "📨 Statistics request sent",
      description: "We’ll notify you once your latest statistics are ready.",
      duration: 3000,
    });
  };

  return (
    <>
      {/* Popup */}
      <motion.div
       
             className="bg-[#0C1A2A] w-[450px] rounded-2xl p-6 shadow-xl relative text-white"
             initial={{ scale: 0.85, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.9, opacity: 0 }}
             transition={{ duration: 0.2 }}
           >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-xl font-semibold flex items-center mb-5">
          <span className="mr-2">📊</span> Statistics
        </div>

        {/* Username */}
        <div className="mb-3">
          
          <p className="text-sm text-gray-400">
            Joined on <span className="text-gray-300">{joinDate}</span>
          </p>
        </div>

        {/* Progress */}
        <Card className="w-full py-4 border-none rounded-2xl shadow-inner bg-transparent mb-4">
          <CardContent className="p-3">
            <ProgressCard
              username={username}
              progressPercentage={progress}
              currentLevelName={currentLevelName}
              nextLevelName={nextLevelName}
              nextLevel={nextLevel}
              currentLevel={currentLevel}
            />
          </CardContent>
        </Card>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* Type */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
              className="w-full bg-[#13283D] rounded-lg px-3 py-2 flex justify-between items-center text-sm text-gray-300 border border-[#1C2F45]"
            >
              <span>{selectedType}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  openDropdown === "type" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openDropdown === "type" && (
              <div className="absolute mt-1 w-full bg-[#13283D] rounded-lg shadow-lg border border-[#1C2F45] z-50">
                {typeOptions.map((type) => (
                  <div
                    key={type}
                    onClick={() => {
                      setSelectedType(type);
                      setOpenDropdown(null);
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-[#1A2D45] ${
                      selectedType === type ? "text-[#4D87FF]" : "text-gray-300"
                    }`}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Currency */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "currency" ? null : "currency")}
              className="w-full bg-[#13283D] rounded-lg px-3 py-2 flex justify-between items-center text-sm text-gray-300 border border-[#1C2F45]"
            >
              <span>{selectedCurrency}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  openDropdown === "currency" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openDropdown === "currency" && (
              <div className="absolute mt-1 w-full bg-[#13283D] rounded-lg shadow-lg border border-[#1C2F45] z-50">
                {currencyOptions.map((curr) => (
                  <div
                    key={curr}
                    onClick={() => {
                      setSelectedCurrency(curr);
                      setOpenDropdown(null);
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-[#1A2D45] ${
                      selectedCurrency === curr ? "text-[#4D87FF]" : "text-gray-300"
                    }`}
                  >
                    {curr}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid or Empty */}
        {stats && Object.values(stats).some((v) => v !== 0) ? (
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-[#13283D] rounded-lg p-3 border border-[#1C2F45]">
              <p className="text-xs text-gray-400 mb-1">Total Bets</p>
              <p className="text-lg font-semibold">{stats.totalBets.toLocaleString()}</p>
            </div>
            <div className="bg-[#13283D] rounded-lg p-3 border border-[#1C2F45]">
              <p className="text-xs text-gray-400 mb-1">Wins</p>
              <p className="text-lg font-semibold">{stats.wins.toLocaleString()}</p>
            </div>
            <div className="bg-[#13283D] rounded-lg p-3 border border-[#1C2F45]">
              <p className="text-xs text-gray-400 mb-1">Losses</p>
              <p className="text-lg font-semibold">{stats.losses.toLocaleString()}</p>
            </div>
            <div className="bg-[#13283D] rounded-lg p-3 border border-[#1C2F45]">
              <p className="text-xs text-gray-400 mb-1">Wagered</p>
              <p className="text-lg font-semibold">
                {symbol} {stats.wagered.toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-10 text-gray-400">
            <BarChart3 className="w-16 h-16 text-gray-500 opacity-30 mb-3" />
            <p className="text-gray-400 font-medium">This user has no visible statistics</p>
          </div>
        )}

        {/* Request Button */}
        <button
          onClick={handleRequestStats}
          className="w-full bg-[#3175FF] hover:bg-[#4D87FF] py-3 rounded-lg text-sm font-semibold transition"
        >
          Request Statistics
        </button>

        <p className="text-gray-400 text-xs mt-3 text-center px-2 leading-tight">
          We update your stats daily — request anytime to refresh.
        </p>
      </motion.div>
    </>
  );
};

export default ShowStatistics;
