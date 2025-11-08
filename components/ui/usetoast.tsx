// src/components/ui/use-toast.ts
"use client";

import * as React from "react";

export interface ToastMessage {
  id: number;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
  duration?: number;
}

const ToastContext = React.createContext<{
  toasts: ToastMessage[];
  toast: (t: Omit<ToastMessage, "id">) => void;
  removeToast: (id: number) => void;
}>({
  toasts: [],
  toast: () => {},
  removeToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const removeToast = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const toast = (t: Omit<ToastMessage, "id">) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...t }]);

    if (t.duration !== Infinity) {
      setTimeout(() => removeToast(id), t.duration || 3000);
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => React.useContext(ToastContext);
