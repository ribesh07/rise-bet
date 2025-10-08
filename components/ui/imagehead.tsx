"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ImageCardProps {
  title: string;
  count?: number;
  image: string;
}

const ImageHead: React.FC<ImageCardProps> = ({ title, count, image }) => (
  <Card className="bg-[#1e293b] border-none hover:bg-[#243249] transition-colors cursor-pointer">
    <CardContent className="p-0">
      <img
  src={image}
  alt={title}
  className="w-full h-full object-cover"
/>

      <div className="p-3 flex  justify-between">
        <div className="text-sm font-semibold">{title}</div>
        {count !== undefined && <span className="text-green-400 text-xs">{count.toLocaleString()}</span>}
      </div>
    </CardContent>
  </Card>
);

export default ImageHead;
