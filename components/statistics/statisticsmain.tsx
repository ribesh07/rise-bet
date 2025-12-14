
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, ChevronDown, BarChart3, BarChart2 } from "lucide-react";
import { useToast } from "@/components/ui/usetoast";
import ProgressCard from "@/components/progresscard";
import { Card, CardContent } from "@/components/ui/vipcard";
import { apiRequest } from "@/utils/ApiHelper";

interface ShowStatisticsProps {
  username?: string;
  avatarUrl?: string;
  vipProgress?: number;
  currentLevelName?: string;
  nextLevelName?: string;
  currentLevel?: string;
  nextLevel?: string;
  createdAt?: string;
  hasStats?: boolean;
  onClose: () => void;
}

const ShowStatistics: React.FC<ShowStatisticsProps> = ({
  username = "Sanjay ki ma ki chut",
  vipProgress = 28.84,
  currentLevelName = "Bronze",
  nextLevelName = "Silver",
  currentLevel = "Bronze",
  nextLevel = "Silver",
  createdAt = "February 18, 2024",
  hasStats = true,
  onClose,
}) => {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [openDropdown, setOpenDropdown] = useState<"type" | "currency" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);




  const typeOptions = ["All", "Casino", "Sports"];
  const currencyOptions = ["INR", "USD"];
  const currencySymbols: Record<string, string> = { INR: "₹", USD: "$" };
const [dashboardDetails, setDashboardDetails] = useState<any>(null);
const [loading, setLoading] = useState(true);

  
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
useEffect(() => {
  const fetchDashboardDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("userId");

      const res = await apiRequest(`/users/${id}/details`, true, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Dashboard Details Response:", res);

      if (res.success) {
        setDashboardDetails(res.data);
        setProgress(res.data.progressPercent || 0);
      }
    } catch (err) {
      console.error("Dashboard API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardDetails();
}, []);
 const allStats = {
  All: {
    totalBets: dashboardDetails?.bets?.length || 0,
    wins: dashboardDetails?.bets?.filter((b:any) => b.status === "WIN").length || 0,
    losses: dashboardDetails?.bets?.filter((b:any) => b.status === "LOSE").length || 0,
    wagered: dashboardDetails?.bets?.reduce(
  (sum: number, b: any) => sum + parseFloat(b.amount),
  0
) || 0,

  },
  Casino: {
    totalBets: dashboardDetails?.bets?.filter((b:any) => b.game === "ROULETTE")?.length || 0,
    wins: dashboardDetails?.bets?.filter((b:any) => b.game === "ROULETTE" && b.status === "WON")?.length || 0,
    losses: dashboardDetails?.bets?.filter((b:any) => b.game === "ROULETTE" && b.status === "LOST")?.length || 0,
   wagered: dashboardDetails?.bets?.reduce(
  (sum: number, b: any) => sum + parseFloat(b.amount),
  0
) || 0,
  },
  Sports: {
    totalBets: dashboardDetails?.bets?.filter((b:any) => b.game === "SPORTS")?.length || 0,
    wins: dashboardDetails?.bets?.filter((b:any) => b.game === "SPORTS" && b.status === "WON")?.length || 0,
    losses: dashboardDetails?.bets?.filter((b:any) => b.game === "SPORTS" && b.status === "LOST")?.length || 0,
    wagered: dashboardDetails?.bets?.filter((b:any) => b.game === "SPORTS").reduce((sum:any, b:any) => sum + b.amount, 0) || 0,
  },
};
const stats = allStats[selectedType as keyof typeof allStats];
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
          <span className="mr-2"><BarChart2 size={24} /></span> Statistics
        </div>

        {/* Username */}
        <div className="mb-3">
          
         <p className="text-sm text-gray-400">
  Joined on{" "}
  <span className="text-gray-300">
    {dashboardDetails?.createdAt
      ? new Date(dashboardDetails.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : ""}
    {" "}
   
  </span>
</p>

        </div>

        {/* Progress */}
        <Card className="w-full py-4 border-none rounded-2xl shadow-inner bg-transparent mb-4">
          <CardContent className="p-3">
           <ProgressCard
                  username={dashboardDetails?.username || "Loading..."}
                  progressPercentage={dashboardDetails?.progressPercent || 0}
                  currentLevelName={dashboardDetails?.currentLevelName || "—"}
                  nextLevelName={dashboardDetails?.nextLevelName || "—"}
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
