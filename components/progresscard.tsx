
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

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

  useEffect(() => {
    let start = 0;
    const duration = 1000; // animation duration in ms
    const increment = progressPercentage / (duration / 10);

    const interval = setInterval(() => {
      start += increment;
      if (start >= progressPercentage) {
        start = progressPercentage;
        clearInterval(interval);
      }
      setAnimatedProgress(start);
    }, 10);

    return () => clearInterval(interval);
  }, [progressPercentage]);

  return (

    <Card className="bg-[#1e293b] border-none p-9">
      <CardContent className="p-2 h-1.580 flex flex-col ">
        <h2 className="text-base font-semibold">{username}</h2>
        <p className="text-gray-400 text-xs mt-1">Your VIP Progress</p>
        <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${animatedProgress}%` }}
          />
        </div>
        <p className="text-gray-500 text-xs mt-1">
          {animatedProgress.toFixed(2)}% — {levelName}
        </p>
      </CardContent>
    </Card>
    // </div>
    
  );
};

export default ProgressCard;
