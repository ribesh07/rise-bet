
// 'use client';
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Sidebar from "@/components/sidebar";
// import TopNavbar from '@/components/topnavbar';
// import Footer from '@/components/footer';
// import MobileBottomBar from '@/components/mobilebuttombar';
// import { ChevronDown } from 'lucide-react';

// import DepositTable from '@/components/transactions/deposit';
// import WithdrawalsTable from '@/components/transactions/withdrawal';
// import RaffleTable from '@/components/transactions/raffle';
// import RaceTable from '@/components/transactions/race';
// import BonusHistory from '@/components/transactions/bonus';
// import OtherHistory from '@/components/transactions/other';

// const Transactions: React.FC = () => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [active, setActive] = useState("Deposits");
//   const [search, setSearch] = useState('');

//   const sidebarWidth = 252;
//   const collapsedWidth = 80;

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const menuItems = [
//     { label: "Deposits" },
//     { label: "Withdrawals" },
//     { label: "Bonuses" },
//     { label: "Raffles" },
//     { label: "Races" },
//     { label: "Others" },
//   ];

//   return (
//     <div className="flex min-h-screen bg-[#0f1722] text-white relative overflow-hidden">

//       {/* Sidebar */}
//       {!isMobile && (
//         <motion.aside
//           animate={{ width: sidebarCollapsed ? collapsedWidth : sidebarWidth }}
//           transition={{ type: 'spring', stiffness: 260, damping: 25 }}
//           className="fixed top-0 left-0 h-full bg-[#0b131c] border-r border-[#1e2c3a]/50 z-50"
//         >
//           <Sidebar
//             collapsed={sidebarCollapsed}
//             setCollapsed={setSidebarCollapsed}
//             open={true}
//             setOpen={() => {}}
//           />
//         </motion.aside>
//       )}

//       {/* Top Navbar */}
//       <motion.div
//         className="fixed top-0 left-0 right-0 z-40"
//         animate={{
//           marginLeft: !isMobile
//             ? sidebarCollapsed
//               ? collapsedWidth
//               : sidebarWidth
//             : 0,
//         }}
//         transition={{ type: 'spring', stiffness: 260, damping: 25 }}
//       >
//         <TopNavbar searchValue={search} onSearchChange={setSearch} />
//       </motion.div>

//       {/* Main Content Wrapper */}
//       <motion.main
//         className="flex-1 flex flex-col overflow-y-auto px-3 md:px-8 pt-[80px] pb-20"
//         animate={{
//           marginLeft: !isMobile
//             ? sidebarCollapsed
//               ? collapsedWidth
//               : sidebarWidth
//             : 0,
//         }}
//         transition={{ type: 'spring', stiffness: 260, damping: 25 }}
//       >

//         <div className="flex flex-col md:flex-row gap-6 w-full mt-4">

//           {/* Left Tab Menu (Desktop) */}
//           <div className="hidden md:flex flex-col w-64 shrink-0 bg-[#0b141e] border border-[#1b2a38] rounded-lg p-2">
//             <h1 className="text-xl font-semibold text-white mb-4">
//     Transactions
//   </h1>
//             {menuItems.map(({ label }) => (
//               <button
//                 key={label}
//                 onClick={() => setActive(label)}
//                 className={`px-4 py-3 text-left rounded-md text-sm font-medium border-l-4 transition-all
//                   ${active === label
//                     ? "text-white bg-[#13202c] border-[#2f8af5]"
//                     : "text-gray-400 hover:text-white hover:bg-[#0f1b27] border-transparent"
//                   }`}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>

//           {/* Mobile Dropdown Tabs */}
//           <div className="md:hidden bg-[#0b141e] border border-[#1b2a38] rounded-lg p-3">
//             <button
//               onClick={() => setOpen(!open)}
//               className="flex items-center justify-between w-full px-4 py-2 rounded-md text-gray-200 bg-[#13202c]"
//             >
//               <span>{active}</span>
//               <ChevronDown className={`${open ? "rotate-180" : ""} transition`} size={18} />
//             </button>
//             {open && (
//               <div className="mt-2 flex flex-col">
//                 {menuItems.map(({ label }) => (
//                   <button
//                     key={label}
//                     onClick={() => { setActive(label); setOpen(false); }}
//                     className={`px-4 py-2 text-left rounded-md text-sm font-medium transition-all
//                       ${active === label
//                         ? "text-white bg-[#13202c] border-l-4 border-[#2f8af5]"
//                         : "text-gray-400 hover:text-white hover:bg-[#0f1b27]"
//                       }`}
//                   >
//                     {label}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Right Content Panel */}
//           <div className="flex-1 bg-[#0b141e] border border-[#1b2a38] rounded-lg p-6 min-h-[400px]">
//             {active === "Deposits" && <DepositTable />}
//             {active === "Withdrawals" && <WithdrawalsTable />}
//             {active === "Bonuses" && <BonusHistory />}
//             {active === "Raffles" && <RaffleTable />}
//             {active === "Races" && <RaceTable />}
//             {active === "Others" && <OtherHistory />}
//           </div>
//         </div>

//         <Footer  />
//       </motion.main>

//       {/* Mobile Bottom Bar */}
//       {isMobile && (
//         <div className="fixed bottom-0 w-full z-50 h-16">
//           <MobileBottomBar onBrowseClick={() => setSidebarOpen(true)} />
//         </div>
//       )}

//       {/* Mobile Sidebar */}
//       <AnimatePresence>
//         {isMobile && sidebarOpen && (
//           <motion.div
//             initial={{ x: -256 }}
//             animate={{ x: 0 }}
//             exit={{ x: -256 }}
//             transition={{ type: 'spring', stiffness: 260, damping: 25 }}
//             className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0b131c]"
//           >
//             <Sidebar
//               collapsed={false}
//               setCollapsed={() => {}}
//               open={sidebarOpen}
//               setOpen={setSidebarOpen}
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>

//     </div>
//   );
// };

// export default Transactions;
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/sidebar";
import TopNavbar from "@/components/topnavbar";
import Footer from "@/components/footer";
import MobileBottomBar from "@/components/mobilebuttombar";
import { ChevronDown } from "lucide-react";

import DepositTable from "@/components/transactions/deposit";
import WithdrawalsTable from "@/components/transactions/withdrawal";
import RaffleTable from "@/components/transactions/raffle";
import RaceTable from "@/components/transactions/race";
import BonusHistory from "@/components/transactions/bonus";
import OtherHistory from "@/components/transactions/other";
import { apiRequest } from "@/utils/ApiHelper";
const Transactions: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [active, setActive] = useState("Deposits");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sidebarWidth = 252;
  const collapsedWidth = 80;

  const menuItems = [
    "Deposits",
    "Withdrawals",
    "Bonuses",
    "Raffles",
    "Races",
    "Others",
  ];
  useEffect(() => {
        const fetchDashboardDetails = async () => {
          try {
            const token = localStorage.getItem("token");
            const id = localStorage.getItem("userId");
    
            const res = await apiRequest(`/users/${id}/details`, true, {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            });
    
            if (res.success) setDashboardDetails(res.data);
          } catch (err) {
            console.error("AFFILIATE PAGE API ERROR:", err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchDashboardDetails();
      }, []);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex  bg-[#1a2c38] text-white relative overflow-hidden">

      {/* Sidebar */}
      {!isMobile && (
        <motion.aside
          animate={{ width: sidebarCollapsed ? collapsedWidth : sidebarWidth }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="fixed top-0 left-0 h-full bg-[#0f172a] border-r border-[#1e2c3a]/50 z-50"
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            open={true}
            setOpen={() => {}}
          />
        </motion.aside>
      )}

      {/* Top Navbar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-40"
        animate={{
          marginLeft: !isMobile
            ? sidebarCollapsed
              ? collapsedWidth
              : sidebarWidth
            : 0,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
      >
        <TopNavbar
          searchValue={search}
          onSearchChange={setSearch}
          wallets={dashboardDetails?.wallets || []}
        />
      </motion.div>

      {/* MAIN CONTENT */}
      <motion.main
        className="flex-1 flex flex-col overflow-y-auto pt-[90px] pb-20 px-4 md:px-10"
        animate={{
          marginLeft: !isMobile
            ? sidebarCollapsed
              ? collapsedWidth
              : sidebarWidth
            : 0,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
      >
        <div className="max-w-6xl pt-6 mx-auto w-full">

          {/* Page Title */}
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            📜 Transaction History
          </h2>

          <div className="flex flex-col md:flex-row gap-6">

            {/* LEFT TAB MENU (Desktop) */}
            <div className="hidden md:flex flex-col w-64 shrink-0">
              <div className="sticky top-24 bg-[#101b22dd] rounded-lg p-2 border border-[#1c2a38] shadow-md">
                {menuItems.map((label) => (
                  <button
                    key={label}
                    onClick={() => setActive(label)}
                    className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-all border-l-2
                      ${
                        active === label
                          ? "bg-[#1c2f45] text-white border-[#2b8eff]"
                          : "text-gray-300 hover:text-white hover:bg-[#162536] border-transparent"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* MOBILE DROP DOWN TABS */}
            <div className="md:hidden bg-[#0f172a] border border-[#1c2a38] rounded-lg p-3">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full px-4 py-2 rounded-md text-gray-200 bg-[#1c2f45] font-medium"
              >
                <span>{active}</span>
                <ChevronDown
                  className={`${open ? "rotate-180" : ""} transition`}
                  size={18}
                />
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-2 flex flex-col"
                  >
                    {menuItems.map((label) => (
                      <button
                        key={label}
                        onClick={() => {
                          setActive(label);
                          setOpen(false);
                        }}
                        className={`px-4 py-2 text-left rounded-md text-sm font-medium transition-all
                          ${
                            active === label
                              ? "bg-[#1c2f45] text-white border-l-4 border-[#2b8eff]"
                              : "text-gray-300 hover:text-white hover:bg-[#162536]"
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT CONTENT PANEL */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 bg-[#101b22dd] border border-[#1c2a38] rounded-lg p-6 min-h-[450px] shadow-md"
            >
              {active === "Deposits" && <DepositTable />}
              {active === "Withdrawals" && <WithdrawalsTable />}
              {active === "Bonuses" && <BonusHistory />}
              {active === "Raffles" && <RaffleTable />}
              {active === "Races" && <RaceTable />}
              {active === "Others" && <OtherHistory />}
            </motion.div>
          </div>

         
        </div>
         <Footer />
      </motion.main>

      {/* MOBILE BOTTOM NAV */}
      {isMobile && (
        <div className="fixed bottom-0 w-full z-50 h-16">
          <MobileBottomBar onBrowseClick={() => setSidebarOpen(true)} />
        </div>
      )}

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a]"
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
    </div>
  );
};

export default Transactions;
