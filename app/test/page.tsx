"use client";
import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import TopNavbar from "@/components/topnavbar";
import NotificationBar from "@/components/notificationbar";
import SearchBar from "@/components/ui/search";
import TrendingGames from "@/components/trendinggame";
import ProgressCard from "@/components/progresscard";
import ImageHead from "@/components/ui/imagehead";

// Example data
const games = [
  { name: "Crash", image: "/images/crash.jpg" },
  { name: "Plinko", image: "/images/plinko.jpg" },
  { name: "Roulette", image: "/images/roulette.jpg" },
  { name: "Mines", image: "/images/mines.jpg" },
  { name: "Hi-Lo", image: "/images/hi_lo.jpg" },
  { name: "Dice", image: "/images/dice.jpg" },
  { name: "Baccarat", image: "/images/baccarat.jpg" },
  { name: "Poker", image: "/images/poker.jpg" },
];

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [category, setCategory] = useState("casino");
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-screen bg-[#0f172a] text-white">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        <NotificationBar />
        <TopNavbar searchValue={search} onSearchChange={setSearch} />

        <main className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Search */}
          

          {/* VIP / Image Cards */}
          <div className="header-bg flex justify-around py-8 w-full bg-cover bg-center px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-[2400px] mx-auto">
  <div className=" h-[200px]">
              <ProgressCard
        username="shark491"
        progressPercentage={45} // example percentage
        levelName="Bronze"
      />
      </div>
              <div className="p-3 h-[250px]">
              <ImageHead
                title="Casino"
                count={32339}
                image="/images/risebet_casino.png"
              />
              </div>
               <div className="p-3 h-[250px]">
              <ImageHead
                title="Sports (soon...)"
                count={0}
                image="/images/risebet_sports.png"
              />
              </div>
            </div>
          </div>
          <div className="px-4 md:px-8 mt-4">
            <SearchBar
              category={category}
              onCategoryChange={setCategory}
              searchValue={search}
              onSearchChange={setSearch}
            />
          </div>
          {/* Trending Games */}
          <TrendingGames games={games} search={search} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
