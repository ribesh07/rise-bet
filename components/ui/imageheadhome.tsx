"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ImageCardProps {
  title: string;
  count?: number;
  image: string;
}

const ImageHeadHome: React.FC<ImageCardProps> = ({ title, count, image }) => (
  <Card className="p-6 bg-[#1e293b] border-none hover:bg-[#243249] transition-colors cursor-pointer">
    <CardContent className="p-0">
      <img src={image} alt={title} className="rounded-t-lg w-full object-cover h-[200px]" />
      <div className="p-3 flex  justify-between">
        <div className="text-sm font-semibold">{title}</div>
        {count !== undefined && <span className="text-green-400 text-xs">{count.toLocaleString()}</span>}
      </div>
    </CardContent>
  </Card>
);

export default ImageHeadHome;
