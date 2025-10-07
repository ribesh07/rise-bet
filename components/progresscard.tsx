
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ProgressCardProps {
  username: string;
  progressPercentage: number; // 0-100
  levelName: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  username,
  progressPercentage,
  levelName,
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = progressPercentage / (duration / 10);

    const interval = setInterval(() => {
      start += increment;
      if (start >= progressPercentage) {
        start = progressPercentage;
        clearInterval(interval);
      }
      setAnimatedProgress(start);
    }, 10);

    // Trigger star pulse when progress changes
    setPulse(true);
    const pulseTimeout = setTimeout(() => setPulse(false), 500); // pulse lasts 0.5s

    return () => {
      clearInterval(interval);
      clearTimeout(pulseTimeout);
    };
  }, [progressPercentage]);

  return (
    <Card className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-none p-6 shadow-xl rounded-2xl relative overflow-hidden">
      {/* VIP Star */}
      <div
        className={`absolute top-4 right-4 transition-transform duration-300 ${
          pulse ? "animate-pulse-scale" : ""
        }`}
      >
        <Star className="w-6 h-6 text-yellow-400 stroke-current stroke-2" />
      </div>

      <CardContent className="p-0 flex flex-col gap-2">
        <h2 className="text-lg font-bold text-white">{username}</h2>
        <div className="flex justify-between items-center text-white text-sm mt-1">
  <span>Your VIP Progress</span>
  <span className="font-medium">{animatedProgress.toFixed(1)}%</span>
</div>
         
        

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mt-3 overflow-hidden relative">
          <div
            className="h-3 rounded-full bg-yellow-400 shadow-lg transition-all duration-300"
            style={{ width: `${animatedProgress}%` }}
          />
          <div
            className="absolute h-3 rounded-full bg-yellow-400 blur-xl opacity-40 top-0 left-0"
            style={{ width: `${animatedProgress}%` }}
          />
        </div>

       

        <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
                   <p className="text-gray-300 text-sm mt-1 font-medium">
          
        </p>
                  <span className="flex items-center gap-1 text-yellow-400">
                    <span>★</span> {levelName}
                  </span>
                </div>
      </CardContent>

      {/* Custom Tailwind Animation */}
      <style jsx>{`
        @keyframes pulseScale {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.4);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-pulse-scale {
          animation: pulseScale 0.5s ease-in-out;
        }
      `}</style>
    </Card>
  );
};

export default ProgressCard;
