
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/vipcard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProgressCard from "@/components/progresscard";
import { ChevronDown, X } from "lucide-react";

interface UserVipCardProps {
  username?: string;
  avatarUrl?: string;
  vipProgress?: number;
  currentLevel?: string;
  nextLevel?: string;
  onClose?: () => void; // callback for close
}

const UserVipCard: React.FC<UserVipCardProps> = ({
  username = "shark491",
  vipProgress = 45,
  currentLevel = "None",
  nextLevel = "Bronze",
  onClose,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setProgress(vipProgress), 400);
    return () => clearTimeout(timeout);
  }, [vipProgress]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose} // close on overlay click
      />

      {/* 🌈 Animated Glowing Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-[400px] h-[400px] rounded-full filter blur-3xl opacity-20 animate-pulse-slow" />
        <div className="absolute w-[600px] h-[600px] rounded-full filter blur-3xl opacity-15 animate-pulse-slower" />
      </div>

      {/* 🧩 VIP Card */}
      <div className="relative z-10 w-full max-w-md mx-auto bg-[#0d1116]/95 backdrop-blur-xl rounded-2xl p-4 text-white shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-[#1f2733] md:max-w-lg">
        {/* Top Header with VIP title and Close button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">VIP</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4">
            <Card className="w-full py-6 relative header-bg border-none rounded-2xl shadow-inner">
              <CardContent className="p-3">
                <ProgressCard
                  username={username}
                  progressPercentage={progress}
                  levelName={nextLevel}
                />
              </CardContent>
            </Card>

            {/* Expandable Sections */}
            <div className="mt-4 space-y-2">
              <details className="bg-[#151b23]/90 rounded-xl p-3 cursor-pointer backdrop-blur-md">
                <summary className="flex justify-between items-center font-medium select-none">
                  VIP Benefits
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </summary>
                <div className="mt-2 text-sm text-gray-400 leading-relaxed">
                  • Daily, Weekly & Monthly bonuses <br />
                  • Higher rakeback percentages <br />
                  • Exclusive VIP giveaways
                </div>
              </details>

              <details className="bg-[#151b23]/90 rounded-xl p-3 cursor-pointer backdrop-blur-md">
                <summary className="flex justify-between items-center font-medium select-none">
                  VIP Host
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </summary>
                <div className="mt-2 text-sm text-gray-400 leading-relaxed">
                  Get your personal VIP manager 24/7 for custom rewards, faster
                  withdrawals, and exclusive offers.
                </div>
              </details>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-400 text-xs mt-4 hover:text-white transition-colors cursor-pointer underline">
              Learn more about being a Risebet VIP 
            </p>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="mt-4">
            <Card className="bg-[#151b23]/90 border-none rounded-2xl p-5 text-center text-gray-300  backdrop-blur-md">
              Rewards and cashback information will appear here.
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserVipCard;
