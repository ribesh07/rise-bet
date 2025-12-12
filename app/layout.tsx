
// // // // import type { Metadata } from "next";
// // // // import { Geist, Geist_Mono } from "next/font/google";
// // // // import "./globals.css";
// // // // import { Toaster } from "react-hot-toast";


// // // // const geistSans = Geist({
// // // //   variable: "--font-geist-sans",
// // // //   subsets: ["latin"],
// // // // });

// // // // const geistMono = Geist_Mono({
// // // //   variable: "--font-geist-mono",
// // // //   subsets: ["latin"],
// // // // });

// // // // export const metadata: Metadata = {
// // // //   title: "RISE - BET",
// // // //   description: "Total Betting and gaming site for all your needs !!!",
// // // // };


// // // // export default function RootLayout({
// // // //   children,
// // // // }: {
// // // //   children: React.ReactNode;
// // // // }) {
// // // //   return (
// // // //     <html lang="en">
// // // //       <body
// // // //         className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#0d0d0d] text-white`}
// // // //       >
// // // //         {children}
// // // //         <ClientToaster /> {/* ✅ safe client component */}
// // // //       </body>
// // // //     </html>
// // // //   );
// // // // }

// // // // /* ✅ Define the client component at the bottom (same file) */
// // // // function ClientToaster() {
// // // //   "use client";
// // // //   return <Toaster position="top-right" toastOptions={{ duration: 3000 }} />;
// // // // }
// // // import type { Metadata } from "next";
// // // import { Geist, Geist_Mono } from "next/font/google";
// // // import "./globals.css";
// // // import { Toaster } from "react-hot-toast";
// // // import NotificationProviderWrapper from "./providers/NotificationProviderWrapper"; // ✅ NEW wrapper

// // // const geistSans = Geist({
// // //   variable: "--font-geist-sans",
// // //   subsets: ["latin"],
// // // });

// // // const geistMono = Geist_Mono({
// // //   variable: "--font-geist-mono",
// // //   subsets: ["latin"],
// // // });

// // // export const metadata: Metadata = {
// // //   title: "RISE - BET",
// // //   description: "Total Betting and gaming site for all your needs !!!",
// // // };

// // // export default function RootLayout({ children }: { children: React.ReactNode }) {
// // //   return (
// // //     <html lang="en">
// // //       <body
// // //         className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#0d0d0d] text-white`}
// // //       >
// // //         <NotificationProviderWrapper>
// // //           {children}
// // //           <ClientToaster />
// // //         </NotificationProviderWrapper>
// // //       </body>
// // //     </html>
// // //   );
// // // }

// // // /* client-only toaster */
// // // function ClientToaster() {
// // //   "use client";
// // //   return <Toaster position="top-right" toastOptions={{ duration: 3000 }} />;
// // // }
// // import type { Metadata } from "next";
// // import { Geist, Geist_Mono } from "next/font/google";
// // import "./globals.css";
// // import ClientArea from "./Clientarea";

// // const geistSans = Geist({
// //   variable: "--font-geist-sans",
// //   subsets: ["latin"],
// // });

// // const geistMono = Geist_Mono({
// //   variable: "--font-geist-mono",
// //   subsets: ["latin"],
// // });

// // export const metadata: Metadata = {
// //   title: "RISE - BET",
// //   description: "Total Betting and gaming site for all your needs !!!",
// // };

// // export default function RootLayout({ children }: { children: React.ReactNode }) {
// //   return (
// //     <html lang="en">
// //       <body
// //         className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#0d0d0d] text-white`}
// //       >
// //         {/* Mount all client only components inside a separate file */}
// //         <ClientArea>
// //           {children}
// //         </ClientArea>
// //       </body>
// //     </html>
// //   );
// // }
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import ClientArea from "./ClientArea"; // ⬅️ make sure the filename matches exactly (capital A)
// import { CurrencyProvider } from "@/context/CurrencyContext";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "RISE - BET",
//   description: "Total Betting and gaming site for all your needs !!!",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
      
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#0d0d0d] text-white`}
//       >
//         <ClientArea>
//           {children}
//         </ClientArea>
        
//       </body>
//     </html>
    
//   );
 
// }

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientArea from "./ClientArea"; 
import { CurrencyProvider } from "@/context/CurrencyContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RISE - BET",
  description: "Total Betting and gaming site for all your needs !!!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#0d0d0d] text-white`}
      >
        {/* 🔥 Global Currency Provider Wrapped Here */}
        <CurrencyProvider>
          <ClientArea>
            {children}
          </ClientArea>
        </CurrencyProvider>

      </body>
    </html>
  );
}
