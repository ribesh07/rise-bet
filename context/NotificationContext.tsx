
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
// import { playNotificationSound } from "./notificationSound";

export interface Notification {
  url?: any;
  date: string | number | Date;
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "info";
  category?: string;
  meta?: any;
  read: boolean;
  timestamp: string;
}

interface NotificationContextType {
  toasts: Notification[];
  notifications: Notification[]; // ONLY UNREAD notifications
  pushNotification: (data: Omit<Notification, "id" | "read" | "timestamp">) => void;
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [lastSeen, setLastSeen] = useState<number>(Date.now());
  const [toasts, setToasts] = useState<Notification[]>([]);

  const pushNotification = (
    data: Omit<Notification, "id" | "read" | "timestamp">
  ) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      read: false,
      timestamp: new Date().toLocaleString(),
      ...data,
    };

    setAllNotifications((prev) => [newNotification, ...prev]);
    setToasts((prev) => [...prev, newNotification]);

    // SOUND only for new (unseen) notifications - Rise behavior
    if (Date.now() - lastSeen > 300) {
      // playNotificationSound();
    }

    // Auto-remove toast after 4 sec
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newNotification.id));
    }, 4000);
  };

  const markAsRead = (id: string) => {
    setAllNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setAllNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setLastSeen(Date.now());
  };

  const deleteNotification = (id: string) => {
    setAllNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setAllNotifications([]);
    setToasts([]);
  };

  const notifications = allNotifications.filter((n) => !n.read);
  const unreadCount = notifications.length;

  // Update lastSeen when drawer closes
  useEffect(() => {
    if (unreadCount === 0) setLastSeen(Date.now());
  }, [unreadCount]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        pushNotification,
        unreadCount,
        markAsRead,
        markAllRead,
        deleteNotification,
        clearAll,
        toasts,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used inside NotificationProvider");
  return context;
};