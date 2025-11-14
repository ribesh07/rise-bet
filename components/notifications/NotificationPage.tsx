// NotificationPage.tsx
"use client";
import { useNotifications } from "./NotificationProvider";

export default function NotificationPage() {
  const { notifications, markAsRead, deleteNotification, clearAll } = useNotifications();

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">All Notifications</h1>

      <div className="flex justify-end mb-4">
        <button className="text-red-400 hover:underline text-sm" onClick={clearAll}>Clear All</button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-center text-neutral-400">No notifications</p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="p-4 rounded-xl bg-neutral-900 border border-neutral-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold">{n.title}</p>
                  <p className="text-sm opacity-80">{n.message}</p>
                  <p className="text-xs opacity-40 mt-1">{n.timestamp}</p>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  {!n.read && (
                    <button className="text-blue-400 text-xs hover:underline" onClick={() => markAsRead(n.id)}>
                      Mark Read
                    </button>
                  )}

                  <button className="text-red-400 text-xs hover:underline" onClick={() => deleteNotification(n.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
