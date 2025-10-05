


"use client";
import React from "react";
import { Search, Wallet, Bell } from "lucide-react";
import UserDropdown from "./userdropdown";
import { Button } from "@/components/ui/button";

interface TopNavbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ searchValue, onSearchChange }) => {
  return (
    <header
      className="
        sticky 
        top-0 
        z-[20] 
        flex justify-between items-center 
        px-3 md:px-4 py-2 
        border-b border-gray-700 
        bg-[#0f172a]/95 
        backdrop-blur-md
      "
    >
      {/* Logo */}
      <div className="relative w-28 h-15 px-2">
        <img src="/logo.png" alt="Logo" className="w-38 h-20" />
      </div>

      {/* Wallet */}
      <div className="self-center h-full items-center bg-[#1e293b] px-2 py-1 rounded-md flex gap-1 shadow-md">
        <span className="text-xs font-mono">0.00000000</span>
        <Wallet size={25} />
        <Button
          variant="default"
          className="hidden md:inline bg-blue-600 hover:bg-blue-700 h-12 px-3 text-xs"
        >
          Wallet
        </Button>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-3">
        <Search className="cursor-pointer hover:text-blue-400 transition" size={22} />
        <UserDropdown />
        <Bell className="cursor-pointer hover:text-blue-400 transition" size={22} />
      </div>
    </header>
  );
};

export default TopNavbar;
