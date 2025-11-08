// src/components/ui/toast.tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-[#1a1f2e] border-[#2a2f3a] text-white",
        success: "bg-green-600/20 border-green-600 text-green-300",
        destructive: "bg-red-600/20 border-red-600 text-red-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  variant,
  onClose,
  className,
  ...props
}) => {
  return (
    <div className={cn(toastVariants({ variant }), className)} {...props}>
      <div className="flex flex-col">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      </div>

      <button
        onClick={onClose}
        className="absolute right-2 top-2 text-gray-400 hover:text-gray-300"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
