"use client";
import { useNotifications } from "@/context/NotificationContext";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default function ToastContainer() {
  const { toasts } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
        <div
          key={toast.id}
          className="bg-[#1d1f24] text-white p-4 rounded-xl shadow-lg animate-fadeIn"
        >
          <div className="font-bold">{toast.title}</div>
          <div className="text-sm opacity-80">{toast.message}</div>
        </div>
      ))}
    </div>
  );
}
