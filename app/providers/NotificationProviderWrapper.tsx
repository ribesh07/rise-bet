"use client";

import { NotificationProvider } from "@/context/NotificationContext";

export default function NotificationProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NotificationProvider>{children}</NotificationProvider>;
}
