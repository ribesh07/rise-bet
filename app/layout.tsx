import type { Metadata } from "next";
import "./globals.css";
import ClientArea from "./ClientArea";
import { CurrencyProvider } from "@/context/CurrencyContext";

export const metadata: Metadata = {
  title: "RISE - BET",
  description: "Total Betting and gaming site for all your needs !!!",
  icons: {
    icon: "/logomobile.png",
  },
  openGraph: {
    title: "RISE - BET",
    description: "Total Betting and gaming site for all your needs !!!",
    images: ["/logomobile.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#0d0d0d] text-white">
        <CurrencyProvider>
          <ClientArea>
            {children}
          </ClientArea>
        </CurrencyProvider>
      </body>
    </html>
  );
}