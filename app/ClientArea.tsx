// "use client";

// import { Toaster } from "react-hot-toast";
// import NotificationProviderWrapper from "./providers/NotificationProviderWrapper";

// export default function ClientArea({ children }: { children: React.ReactNode }) {
//   console.log("ClientArea mounted"); // 🔥 keeps console log for you
//   return (
//     <NotificationProviderWrapper>
//       {children}
//       <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
//     </NotificationProviderWrapper>
//   );
// }
"use client";

import { Toaster } from "react-hot-toast";
import NotificationProviderWrapper from "./providers/NotificationProviderWrapper";
import { useEffect } from "react";

export default function ClientArea({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log("%cClientArea mounted", "color:#00eaff;font-weight:bold");
  }, []);

  return (
    <NotificationProviderWrapper>
      {children}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </NotificationProviderWrapper>
  );
}
