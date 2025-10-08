
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/vipcard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProgressCard from "@/components/progresscard";
import { ChevronDown, Star, Gem, X } from "lucide-react";

interface UserVipCardProps {
  username?: string;
  avatarUrl?: string;
  vipProgress?: number;
  currentLevel?: string;
  nextLevel?: string;
  onClose?: () => void;
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
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Glowing animated background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-[400px] h-[400px] rounded-full filter blur-3xl opacity-20 animate-pulse-slow bg-blue-500" />
        <div className="absolute w-[600px] h-[600px] rounded-full filter blur-3xl opacity-15 animate-pulse-slower bg-purple-500" />
      </div>

      {/* VIP Card */}
      <div className="relative z-10 w-full max-w-md mx-auto bg-[#0d1116]/95 backdrop-blur-xl rounded-2xl p-4 text-white shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-[#1f2733] md:max-w-lg">
        {/* Header */}
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

            {/* VIP Benefits (Scrollable Section) */}
            <div className="mt-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar space-y-2">
              <details className="bg-[#151b23]/90 rounded-xl p-3 cursor-pointer backdrop-blur-md open:pb-4">
                <summary className="flex justify-between items-center font-medium select-none">
                  VIP Benefits
                  <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300 group-open:rotate-180" />
                </summary>

                {/* Benefit List */}
                <div className="mt-3 text-sm text-gray-300 leading-relaxed space-y-5">
                  {/* Bronze */}
                  <div>
                    <p className="font-semibold text-[#cd7f32] flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#cd7f32]" /> Bronze
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mt-1 ml-2 space-y-1">
                      <li>Bonus from Support in currency of your choice</li>
                      <li>Rakeback enabled</li>
                      <li>Weekly bonuses</li>
                      <li>Monthly bonuses</li>
                      <li>VIP Telegram channel access</li>
                    </ul>
                  </div>
                  <hr className="border-gray-700/50" /> 
                  {/* Silver */}
                  <div>
                    <p className="font-semibold text-[#c0c0c0] flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#c0c0c0]" /> Silver
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mt-1 ml-2 space-y-1">
                      <li>Bonus from Support in currency of your choice</li>
                      <li>Monthly bonus increased</li>
                    </ul>
                  </div>
                  <hr className="border-gray-700/50" /> 
                  {/* Gold */}
                  <div>
                    <p className="font-semibold text-[#ffd700] flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#ffd700]" /> Gold
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mt-1 ml-2 space-y-1">
                      <li>Bonus from Support in currency of your choice</li>
                      <li>Monthly bonus increased</li>
                    </ul>
                  </div>
                  <hr className="border-gray-700/50" />
                  {/* Platinum I - III */}
                  <div>
                    <p className="font-semibold text-[#40e0d0] flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#40e0d0]" /> Platinum I - III
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mt-1 ml-2 space-y-1">
                      <li>Bonus from Support in currency of your choice</li>
                      <li>Monthly bonus increased</li>
                    </ul>
                  </div>
                  <hr className="border-gray-700/50" />
                  {/* Platinum IV - VI */}
                  <div>
                    <p className="font-semibold text-[#00ffff] flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#00ffff]" /> Platinum IV - VI
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mt-1 ml-2 space-y-1">
                      <li>Dedicated VIP host</li>
                      <li>Unlimited Reloads while maintaining a VIP host</li>
                      <li>Bonus from VIP host in currency of your choice</li>
                      <li>Weekly & monthly bonuses increased</li>
                    </ul>
                  </div>
                  <hr className="border-gray-700/50" />
                  {/* Diamond I - V */}
                  <div>
                    <p className="font-semibold text-[#00bfff] flex items-center gap-2">
                      <Gem className="w-4 h-4 text-[#00bfff]" /> Diamond I - V
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mt-1 ml-2 space-y-1">
                      <li>Bonus from VIP host in currency of your choice</li>
                      <li>Exclusively customised benefits</li>
                      <li>Weekly & monthly bonuses increased</li>
                    </ul>
                  </div>
                </div>
               </details>
            
              {/* VIP Host Section */}
              <details className="bg-[#151b23]/90 rounded-xl p-3 mt-2 cursor-pointer backdrop-blur-md open:pb-4">
  <summary className="flex justify-between items-center font-medium select-none">
    VIP Host
    <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300 group-open:rotate-180" />
  </summary>

  <div className="mt-3 text-sm text-gray-300 leading-relaxed space-y-4">
    <p>
      Reach <span className="font-semibold text-[#00ffff]">Platinum IV</span> or above and receive your own dedicated
      VIP host who will support and cater to your betting needs.
    </p>

    <hr className="border-gray-700/50" />

    <div>
      <p className="font-semibold text-white mb-1">VIP Host benefits</p>
      <p className="text-gray-400 mb-2">
        VIP Hosts cater to your needs and ensure your time at Risebet is safe,
        entertaining, and rewarding. Enjoy:
      </p>

      <ul className="list-disc list-inside space-y-1 text-gray-400 ml-2">
        <li>
          <span className="text-white">Your personal point of contact</span> for all VIP support
        </li>
        <li>
          <span className="text-white">Tailored bonuses</span> and exclusive betting limits
        </li>
        <li>
          <span className="text-white">Insight</span> into gameplay and performance statistics
        </li>
        <li>
          <span className="text-white">Exclusive promotions</span> and events
        </li>
      </ul>
    </div>
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
            <Card className="bg-[#151b23]/90 border-none rounded-2xl p-5 text-center text-gray-300 backdrop-blur-md">
              Rewards and cashback information will appear here.
            </Card>
          </TabsContent>
        </Tabs>
     
</div>
      {/* Custom scrollbar styling */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #2a2f3a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #3a3f4a;
        }
      `}</style>
    </div>
  );
};

export default UserVipCard;
