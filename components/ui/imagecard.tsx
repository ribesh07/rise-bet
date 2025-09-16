
"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ImageCardProps {
  title: string;
  count?: number;
  image: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ title, count, image }) => (
  <Card className="bg-[#1e293b] border-none hover:bg-[#243249] transition-colors cursor-pointer">
    <CardContent className="p-0">
      {/* Image container with aspect ratio */}
      <div className="w-full aspect-[4/3] overflow-hidden rounded-t-lg">
        <img
          src={image}
          alt={title}
          className="w-full  object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Card content */}
      <div className="p-3 flex items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        {count !== undefined && (
          <span className="text-green-400 text-xs">{count.toLocaleString()}</span>
        )}
      </div>
    </CardContent>
  </Card>
);

export default ImageCard;
