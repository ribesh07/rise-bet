
"use client";
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import TopNavbar from "@/components/topnavbar";
import NotificationBar from "@/components/notificationbar";
import ProgressCard from "@/components/progresscard";
import ImageHead from "@/components/ui/imagehead";
import GamingGrid from "@/components/gaminggrid";
import SearchBar from "@/components/ui/search";
import MobileBottomBar from "@/components/mobilebuttombar";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [category, setCategory] = useState("casino");
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar width
  const sidebarWidth = 64; // Tailwind w-64 = 16rem = 256px
  const collapsedWidth = 20; // Tailwind w-20 = 5rem = 80px

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.div
          animate={{ width: sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="h-screen bg-[#0f172a] shadow-lg overflow-hidden"
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            open={true}
            setOpen={() => {}}
          />
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        className="flex-1 flex flex-col overflow-hidden relative"
        animate={{
          marginLeft: isMobile && sidebarOpen ? sidebarWidth * 4 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobile && sidebarOpen && (
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] shadow-lg"
            >
              <Sidebar
                collapsed={false}
                setCollapsed={() => {}}
                open={sidebarOpen}
                setOpen={setSidebarOpen}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay behind mobile sidebar */}
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Top Bars */}
        <NotificationBar />
        <TopNavbar searchValue={search} onSearchChange={setSearch} />

        {/* Scrollable Content */}
        <main className={`flex-1 overflow-auto pb-16`}>
          {/* Header Section */}
         {/* Header Section */}
{/* Header Section */}
<div className={`w-full px-3 md:px-8 py-6 relative header-bg`}>
  {/* Overlay for better readability */}
  <div className="absolute inset-0 bg-[#0f172a]/60 z-0"></div>

  <div
    className={`grid gap-4 w-full max-w-full mx-auto relative z-10 ${
      isMobile ? "grid-cols-1" : "grid-cols-3"
    }`}
  >
    {/* Progress Card */}
    <div className="w-full flex justify-center">
      <div className={`w-full max-w-sm frosted-card-bg p-4`}>
        <ProgressCard
          username="shark491"
          progressPercentage={45}
          levelName="Bronze"
        />
      </div>
    </div>

    {/* Casino and Sports for desktop */}
    {!isMobile && (
      <>
        <div className="w-full flex justify-center">
          <div className="w-full max-w-sm">
            <ImageHead
              title="Casino"
              count={32339}
              image="/images/risebet_casino.png"
            />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-sm">
            <ImageHead
              title="Sports (soon...)"
              count={0}
              image="/images/risebet_sports.png"
            />
          </div>
        </div>
      </>
    )}
  </div>

  {/* Mobile: Casino & Sports below ProgressCard in 2 columns */}
  {isMobile && (
    <div className="grid grid-cols-2 gap-1 mt-3 relative z-10">
      <div className="flex justify-center">
        <div className="w-full max-w-[160px] frosted-card-bg p-1">
          <ImageHead
            title="Casino"
            count={32339}
            image="/images/risebet_casino.png"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-[160px] frosted-card-bg p-1">
          <ImageHead
            title="Sports (soon...)"
            count={0}
            image="/images/risebet_sports.png"
          />
        </div>
      </div>
    </div>
  )}
</div>



          {/* Search Bar */}
          <div className="px-3 md:px-8 mt-4">
            <SearchBar
              category={category}
              onCategoryChange={setCategory}
              searchValue={search}
              onSearchChange={setSearch}
            />
          </div>

          {/* Gaming Grid */}
          <section className="mt-4 px-3 md:px-8">
            <h3 className="text-base md:text-lg font-semibold mb-2">
              Trending Games
            </h3>
            <GamingGrid search={search} />
          </section>
        </main>

        {/* Mobile Bottom Bar */}
        {isMobile && (
          <div className="fixed bottom-0 w-full z-50 h-16">
            <MobileBottomBar onBrowseClick={() => setSidebarOpen(true)} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
