// NotificationProvider.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type NotificationType = "success" | "error" | "info";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category?: string;
  url?: string | null;
  meta?: any;
  read: boolean;
  timestamp: string;
  date: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  pushNotification: (data: Omit<Notification, "id" | "read" | "timestamp" | "date">) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  toasts: Notification[];
  removeToast: (id: string) => void;
}

const LOCAL_KEY = "stake_notifications_v1";
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Notification[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) setNotifications(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(notifications)); } catch {}
  }, [notifications]);

  useEffect(() => {
    const month = Date.now() - 30 * 24 * 60 * 60 * 1000;
    setNotifications((prev) => prev.filter((n) => n.date > month));
  }, []);

  const pushNotification = (data: Omit<Notification, "id" | "read" | "timestamp" | "date">) => {
    const id = crypto.randomUUID();
    const n: Notification = {
      id,
      read: false,
      timestamp: new Date().toLocaleString(),
      date: Date.now(),
      ...data,
    };

    setNotifications((prev) => [n, ...prev]);
    setToasts((prev) => [...prev, n]);

    setTimeout(() => removeToast(id), 4000);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((p) => (p.id === id ? { ...p, read: true } : p)));
  };

  const markAllRead = () => setNotifications((prev) => prev.map((p) => ({ ...p, read: true })));

  const deleteNotification = (id: string) => setNotifications((prev) => prev.filter((p) => p.id !== id));

  const clearAll = () => setNotifications([]);

  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications: notifications.sort((a, b) => b.date - a.date),
        unreadCount,
        pushNotification,
        markAsRead,
        markAllRead,
        deleteNotification,
        clearAll,
        toasts,
        removeToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
};