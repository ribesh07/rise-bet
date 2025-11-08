// src/components/ui/toaster.tsx
"use client";

import React from "react";
import { Toast } from "./toast";
import { useToast } from "@/components/ui/usetoast";

export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-[9999]">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          title={t.title}
          description={t.description}
          variant={t.variant}
          onClose={() => removeToast(t.id)}
        />
      ))}
    </div>
  );
};
