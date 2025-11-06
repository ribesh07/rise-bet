


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
      relative
        
        top-0 
        z-[20] 
        flex justify-between items-center 
        px-3 md:px-4 py-2 
        
        bg-[#101b22dd] 
        backdrop-blur-md
      "
    >
      {/* Logo */}
      <div className=" w-30 h-15 px-2">
        <img src="/logo.png" alt="Logo" className="w-30 h-15" />
      </div>

      {/* Wallet */}
      <div className="flex items-center gap-2 rounded-full bg-[#0d1720] border border-[#2b3340] px-3 py-1.5 shadow-sm hover:border-[#4a9fff] transition-all duration-300 cursor-pointer">
  <Wallet size={28} className="text-[#4a9fff]" />
  <span className="text-sm font-semibold text-white tracking-tight font-mono">
    0.000000
  </span>
  <Button
    variant="ghost"
    className="hidden md:inline bg-[#1e293b] hover:bg-[#263445] text-xs text-white px-3 py-1 rounded-full shadow-inner border border-[#2b3340] transition-colors duration-200"
  >
    Wallet
  </Button>
</div>


      {/* Right Icons */}
      <div className="flex items-center gap-3">
        <Search className="cursor-pointer hover:text-blue-400 transition" size={28} />
        <UserDropdown />
        <Bell className="cursor-pointer hover:text-blue-400 transition" size={28} />
      </div>
    </header>
  );
};

export default TopNavbar;
