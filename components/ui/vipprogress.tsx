import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <div
      className={cn(
        "relative w-full h-2 overflow-hidden rounded-full bg-[#1f2733]",
        className
      )}
    >
      <div
        className="h-full bg-gradient-to-r from-[#00b67a] to-[#0074e0] transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
