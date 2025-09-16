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
    <header className="sticky flex justify-between items-center px-3 md:px-4 py-2 border-b border-gray-700 bg-[#0f172a]">
      {/* Logo */}
      <div className="relative w-28 h-15 px-2">
        <img src="/logo.png" alt="Logo" className="w-38 h-20" />
      </div>

      {/* Wallet */}
      <div className="self-center h-full items-center bg-[#1e293b] px-2 py-1 rounded-md flex gap-1">
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
      <div className="flex items-center gap-2">
        <Search className="cursor-pointer" size={25} />
        <UserDropdown />
        <Bell className="cursor-pointer" size={25} />
      </div>
    </header>
  );
};

export default TopNavbar;
