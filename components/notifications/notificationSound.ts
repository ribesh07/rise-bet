// notificationSound.ts
export const playNotificationSound = () => {
  const audio = new Audio("/sounds/notification.mp3");
  audio.volume = 0.6;
  audio.play().catch(() => {});
};
