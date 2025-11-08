
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/vipcard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProgressCard from "@/components/progresscard";
import { ChevronDown, Star, Gem, X, Gift, ArrowUpRight, Zap, RefreshCw, Lock, Trophy} from "lucide-react";
import {  } from "lucide-react";
import { motion } from "framer-motion";


interface UserVipCardProps {
  username?: string;
  avatarUrl?: string;
  vipProgress?: number;
  currentLevelName?: string;
  nextLevelName?: string;
  currentLevel?: string;
  nextLevel?: string;
  onClose?: () => void;
}

const UserVipCard: React.FC<UserVipCardProps> = ({
 username="John Doe",
  vipProgress=45,
  currentLevelName="Bronze",
  nextLevelName="Silver",
  currentLevel="Bronze",
  nextLevel="Silver",
  onClose,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setProgress(vipProgress), 400);
    return () => clearTimeout(timeout);
  }, [vipProgress]);

  return (
    <motion.div
       
             className="bg-[#0C1A2A] w-[450px] rounded-2xl p-6 shadow-xl relative text-white"
             initial={{ scale: 0.85, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.9, opacity: 0 }}
             transition={{ duration: 0.2 }}
           >
   
      {/* Overlay */}
      {/* <button
                onClick={onClose}
                className="absolute right-5 top-5 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button> */}

      {/* Glowing animated background */}
      

      {/* VIP Card */}
      <div className="relative z-10 w-full max-w-md mx-auto bg-[#0d1116]/95 backdrop-blur-xl rounded-2xl p-4 text-white shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-[#1f2733] md:max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-semibold flex items-center mb-5">
          <span className="mr-2"><Trophy size={24} /></span> Statistics
        </div>
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
            currentLevelName={currentLevelName}
            nextLevelName={nextLevelName}
            nextLevel={nextLevel}
            currentLevel={currentLevel}
                  
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
         <TabsContent
          value="rewards"
          className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar"
        >
          {/* Monthly Bonus - Unlocked */}
          <details className="bg-[#151b23]/90 rounded-xl p-4 backdrop-blur-md group cursor-pointer">
            <summary className="flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <div className="bg-[#1f2733] p-2 rounded-lg">
                  <Gift className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Monthly Bonus</p>
                  <p className="text-gray-400 text-xs">Released once a month.</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-gray-400 leading-relaxed">
              The Monthly Bonus is randomly released. Eligible players will be notified via email. Your
              bonus is based on your gameplay throughout the month. The more you play, the bigger the
              bonus.
            </p>
          </details>

          {/* Rakeback - Locked */}
          <details
            className="bg-[#151b23]/90 rounded-xl p-4 backdrop-blur-md relative opacity-50 group cursor-pointer"
          >
            <summary className="flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <div className="bg-[#1f2733] p-2 rounded-lg">
                  <ArrowUpRight className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Rakeback</p>
                  <p className="text-gray-400 text-xs">Unlocked at Bronze VIP.</p>
                </div>
              </div>
              
            </summary>
            <Lock className="absolute top-4 right-4 w-4 h-4 text-gray-500" />
          </details>

          {/* Weekly Boost - Locked */}
          <details
            className="bg-[#151b23]/90 rounded-xl p-4 backdrop-blur-md relative opacity-50 group cursor-pointer"
          >
            <summary className="flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <div className="bg-[#1f2733] p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Weekly Boost</p>
                  <p className="text-gray-400 text-xs">Unlocked at Bronze VIP.</p>
                </div>
              </div>
              
            </summary>
            <Lock className="absolute top-4 right-4 w-4 h-4 text-gray-500" />
          </details>

          {/* Reload - Locked */}
          <details
            className="bg-[#151b23]/90 rounded-xl p-4 backdrop-blur-md relative opacity-50 group cursor-pointer"
          >
            <summary className="flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <div className="bg-[#1f2733] p-2 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Reload</p>
                  <p className="text-gray-400 text-xs">Unlocked at Platinum VIP.</p>
                </div>
              </div>
              
            </summary>
            <Lock className="absolute top-4 right-4 w-4 h-4 text-gray-500" />
          </details>
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
    
    </motion.div>
  );
};

export default UserVipCard;
