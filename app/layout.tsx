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
  icons: {
    icon: "/logomobile.png", // favicon
  },
  openGraph: {
    title: "RISE - BET",
    description: "Total Betting and gaming site for all your needs !!!",
    images: ["/logomobile.png"], // OG image for social sharing
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#0d0d0d] text-white`}
      >
        <CurrencyProvider>
          <ClientArea>
            {children}
          </ClientArea>
        </CurrencyProvider>
      </body>
    </html>
  );
}
