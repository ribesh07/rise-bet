// NotificationDrawer.tsx
"use client";
import { useNotifications } from "./NotificationProvider";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function NotificationDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { notifications, markAsRead, markAllRead, deleteNotification } = useNotifications();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: 350 }}
            animate={{ x: 0 }}
            exit={{ x: 350 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="fixed right-0 top-0 h-full w-[360px] bg-neutral-900 text-white z-[1000] shadow-2xl p-5 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <div className="flex items-center gap-3">
                <button onClick={markAllRead} className="text-sm text-blue-400 hover:underline">Mark all read</button>
                <button onClick={onClose}><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto pr-2 hide-scrollbar">
              {notifications.length === 0 ? (
                <p className="text-center text-neutral-400 mt-10">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border bg-neutral-800 relative ${n.read ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{n.title}</p>
                        <p className="text-sm opacity-80">{n.message}</p>
                        <p className="text-xs opacity-50 mt-1">{n.timestamp}</p>
                      </div>

                      {!n.read && (
                        <button
                          className="text-blue-400 text-xs hover:underline"
                          onClick={() => markAsRead(n.id)}
                        >
                          Mark read
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="absolute top-2 right-2 text-xs text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
