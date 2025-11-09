

"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import Sidebar from "@/components/sidebar";
import TopNavbar from "@/components/topnavbar";
import MobileBottomBar from "@/components/mobilebuttombar";
import Footer from "@/components/footer";
import { AnimatePresence, motion } from "framer-motion";

import Account from "@/components/settings/account";
import  Security from "@/components/settings/security";
import Preferences from "@/components/settings/preference";

import Verification from "@/components/settings/verification";
import Offers from "@/components/settings/offer";

const settingsTabs = [
  "Account",
  "Security",
  "Verification",
  "Preferences",
  
  "Offers",
];

const SettingsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("Account");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarWidth = 62;
  const collapsedWidth = 20;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderTabPage = () => {
    switch (activeTab) {
      case "Account": return <Account />;
      case "Security": return <Security />;
      case "Preferences": return <Preferences />;
     
      case "Verification": return <Verification />;
      case "Offers": return <Offers />;
      default: return <Account />;
    }
  };

  return (
    <div className="flex bg-[#1a2c38] text-white overflow-x-hidden">

      {/* ✅ Sidebar Desktop */}
      {!isMobile && (
        <motion.div
          animate={{
            width: sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="h-screen bg-[#0f172a] shadow-lg fixed left-0 top-0 z-50"
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            open={true}
            setOpen={() => {}}
          />
        </motion.div>
      )}

      {/* ✅ Top Navbar */}
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
        <TopNavbar searchValue={search} onSearchChange={setSearch} />
      </motion.div>

      {/* ✅ Main Page */}
      <motion.main
        className="flex-1 flex flex-col pt-[100px] pb-16 px-4 md:px-10"
        animate={{
          marginLeft: !isMobile
            ? sidebarCollapsed
              ? collapsedWidth * 4
              : sidebarWidth * 4
            : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-10 pb-3">

          <div className="text-2xl font-bold flex items-center gap-2">
            ⚙️ Settings
          </div>

          {/* ✅ Desktop Left Tab Menu */}
          <div className="flex flex-col md:flex-row gap-6">
            <aside className="hidden md:flex w-[220px]">
              <div className="sticky top-24 bg-[#101b22dd]/95 rounded-md p-2 shadow-md w-full h-min">
                {settingsTabs.map((tab) => (
                  <div
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      "cursor-pointer px-3 py-2 rounded-sm text-sm font-semibold transition-all",
                      activeTab === tab
                        ? "bg-[#122334] text-white border-l-2 border-[#2b8eff]"
                        : "text-gray-300 hover:bg-[#122334] hover:text-white"
                    )}
                  >
                    {tab}
                  </div>
                ))}
              </div>
            </aside>

            {/* ✅ MOBILE DROPDOWN LIKE IMAGE */}
            {isMobile && (
              <div className="relative">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="bg-[#101b22dd] border border-[#1f2d3a] rounded-md px-4 py-2 font-semibold"
                >
                  {settingsTabs.map((tab) => (
                    <option key={tab} value={tab}>
                      {tab}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ✅ RENDER PAGE HERE */}
            <div className="flex-1">
              {renderTabPage()}
            </div>
          </div>
        </div>

        <Footer />
      </motion.main>

      {/* ✅ Mobile Bottom */}
      {isMobile && (
        <div className="fixed bottom-0 w-full z-50 h-16">
          <MobileBottomBar onBrowseClick={() => setSidebarOpen(true)} />
        </div>
      )}

      {/* ✅ Mobile Sidebar */}
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

export default SettingsPage;
