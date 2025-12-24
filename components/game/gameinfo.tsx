"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/vipcard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProgressCard from "@/components/progresscard";
import { 
  ChevronDown,
  Star,
  Gem,
  X,
  Gift,
  ArrowUpRight,
  Zap,
  RefreshCw,
  Lock,
  ClipboardList} from "lucide-react";
import { motion } from "framer-motion";
interface GameCardProps {
  
  onClose?: () => void;
}
const GameCard: React.FC<GameCardProps> = ({
  
  onClose,
}) => {


  // 👇 FETCH FROM API
  
  return (
    <motion.div
      className="bg-[#0C1A2A] w-[450px] rounded-2xl p-6 shadow-xl relative text-white"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative z-10 bg-[#0d1116]/95 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-[#1f2733]">

        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-semibold flex items-center mb-5">
            <ClipboardList size={24} className="mr-2" /> Game Info
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <Tabs defaultValue="Rules">
          <TabsList>
            <TabsTrigger value="Rules">Rules</TabsTrigger>
            <TabsTrigger value="Max Betting Limits">Max Betting Limits</TabsTrigger>
          </TabsList>

          <TabsContent value="Rules" className="mt-4">
          

            {/* VIP Benefits (Scrollable Section) */}
            <div className="mt-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar space-y-2">
            
              {/* VIP Host Section */}
              <details className="bg-[#151b23]/90 rounded-xl p-3 mt-2 cursor-pointer backdrop-blur-md open:pb-4">
              <summary className="flex justify-between items-center font-medium select-none">
           Game Rules
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
    
          {/* Max Betting Limits Tab */}
         <TabsContent
          value="Max Betting Limits"
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

export default GameCard;
