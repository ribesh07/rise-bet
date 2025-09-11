
"use client";

import Image from "next/image";
import Link from "next/link";
import GameGrid from "@/components/GameGridHome";
import Footer from "@/components/Footer";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import { apiRequest } from "@/utils/ApiHelper";
import Navbarhome from "@/components/Navbarhome";

interface User {
  balance: number;
  username?: string;
  email?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view balance");
        return;
      }
      try {
        const res = await apiRequest("/auth/me", true, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.success && res.data) {
          setUser({
            balance: Number(res.data.balance) || 0,
            username: res.data.username,
            email: res.data.email,
          });
        } else {
          toast.error(res.message || "Failed to fetch user data");
        }
      } catch (error) {
        console.error("User fetch error:", error);
        toast.error("Error fetching user data");
      }
    };

    fetchUser();
  }, []);

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Top bar with logo and user menu */}
      <div className="flex justify-between items-center px-6 py-3 bg-[#1a1a1a] shadow-md">
        {/* Logo & App Name */}
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700">
            <Image
              src="/logo.png"
              alt="LuckyWorld Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <span className="text-2xl font-bold text-white tracking-wide"></span>
        </Link>

        {/* Balance and User */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-300">
            Balance:{" "}
            <span className="font-bold text-white">
              {user ? user.balance.toFixed(3) : "0.000"} 
            </span>
          </div>
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700"
            >
              <span className="text-sm font-medium">
                {user?.username || "User"}
              </span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#1f1f1f] border border-gray-700 rounded-md shadow-lg z-50">
                <a href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-700">
                  Profile
                </a>
                <a href="/setting" className="block px-4 py-2 text-sm hover:bg-gray-700">
                  Settings
                </a>
                <a
                  href="/auth/login"
                  className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero section */}
      <section className="relative bg-[#1a1a1a] py-12 px-4 md:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to RISE</h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            The most trusted gambling platform.
          </p>
         <div className="flex justify-center space-x-4">
  <Link href="/deposit">
    <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold">
      Deposit
    </button>
  </Link>
  <Link href="/wallet">
    <button className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-md font-semibold">
      Wallet
    </button>
  </Link>
</div>

        </div>
      </section>

      {/* Game grid */}
      <section className="py-10 px-4 md:px-16">
        <h2 className="text-2xl font-bold mb-6">Popular Games</h2>
        <GameGrid />
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white text-center py-6">
        <p className="text-lg font-semibold">
          Enjoy 24/7 support, instant withdrawals, and massive bonuses!
        </p>
      </section>

      {/* Chat Support Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow-lg text-sm font-semibold">
          Chat Support
        </button>
      </div>

      <Footer />
    </main>
  );
}
