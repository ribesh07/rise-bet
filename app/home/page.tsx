
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/sidebar";
import TopNavbar from "@/components/topnavbar";
import NotificationBar from "@/components/notificationbar";
import ProgressCard from "@/components/progresscard";
import ImageHead from "@/components/ui/imagehead";
import GamingGrid, { GameGridHandles } from "@/components/gaminggrid";
import SearchBar from "@/components/ui/search";
import MobileBottomBar from "@/components/mobilebuttombar";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [category, setCategory] = useState("casino");
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const gamingGridRef = useRef<GameGridHandles>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = 64;
  const collapsedWidth = 20;

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
      {/* Desktop Sidebar (Fixed) */}
      {!isMobile && (
        <motion.div
          animate={{
            width: sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="h-screen bg-[#0f172a] shadow-lg overflow-hidden fixed left-0 top-0 z-50"
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            open={true}
            setOpen={() => {}}
          />
        </motion.div>
      )}

      {/* Navbar slides horizontally but fixed vertically */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-40"
        animate={{
          marginLeft: !isMobile
            ? sidebarCollapsed
              ? collapsedWidth * 4
              : sidebarWidth * 4
            : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <AnimatePresence>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 w-full z-30"
          >
            <NotificationBar />
          </motion.div>
        </AnimatePresence>
        <TopNavbar searchValue={search} onSearchChange={setSearch} />
      </motion.div>

      {/* Scrollable Main content */}
      <motion.main
        className="flex-1 flex flex-col overflow-auto pt-[112px] pb-16 px-3 md:px-8"
        animate={{
          marginLeft: !isMobile
            ? sidebarCollapsed
              ? collapsedWidth * 4
              : sidebarWidth * 4
            : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header Section */}
        <div className="w-full py-6 relative header-bg">
          <div className="absolute inset-0 bg-[#0f172a]/60 z-0"></div>

          <div
            className={`grid gap-4 w-full max-w-full mx-auto relative z-10 ${
              isMobile ? "grid-cols-1" : "grid-cols-3"
            }`}
          >
            {/* Progress Card */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-sm frosted-card-bg p-4">
                <ProgressCard
                  username="shark491"
                  progressPercentage={45}
                  levelName="Bronze"
                />
              </div>
            </div>

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
        <div className="mt-4">
          <SearchBar
            category={category}
            onCategoryChange={setCategory}
            searchValue={search}
            onSearchChange={setSearch}
          />
        </div>

        {/* Trending Games */}
        <section className="mt-4 relative">
          <div className="flex items-center mb-2">
            <h3 className="text-base md:text-lg font-semibold">Trending Games</h3>
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => gamingGridRef.current?.scroll("left")}
                className="bg-[#1e293b] hover:bg-[#243249] text-white p-2 rounded-full shadow"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => gamingGridRef.current?.scroll("right")}
                className="bg-[#1e293b] hover:bg-[#243249] text-white p-2 rounded-full shadow"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <GamingGrid ref={gamingGridRef} search={search} />
        </section>
      </motion.main>

      {/* Mobile Bottom Bar */}
      {isMobile && (
        <div className="fixed bottom-0 w-full z-50 h-16">
          <MobileBottomBar onBrowseClick={() => setSidebarOpen(true)} />
        </div>
      )}

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
    </div>
  );
};

export default Dashboard;
