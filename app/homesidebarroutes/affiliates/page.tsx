
// 'use client';
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Sidebar from "@/components/sidebar";
// import TopNavbar from '@/components/topnavbar';
// import Footer from '@/components/footer';
// import MobileBottomBar from '@/components/mobilebuttombar';
// import Image from 'next/image';
// import { LoginForm } from '@/components/auths/loginform';
// import { SignupForm } from '@/components/auths/signupform';
// import {
  
//   ChevronDown,
// } from 'lucide-react';

// // ✅ Import your affiliate subpages
// import Overview from '@/components/affiliates/overview';
// import Refer from '@/components/affiliates/campaigns';
// import Commissions from '@/components/affiliates/commission';
// import FAQ from '@/components/affiliates/faq';
// import ReferredUsers from '@/components/affiliates/refer';
// import { clsx } from 'clsx';

// // ✅ Auth Modal
// const AuthModal: React.FC<{
//   open: boolean;
//   onClose: () => void;
//   initialType: 'login' | 'register';
//   isMobile: boolean;
// }> = ({ open, onClose, initialType, isMobile }) => {
//   const [modalMode, setModalMode] = useState<'login' | 'register'>(initialType);

//   useEffect(() => {
//     if (open) setModalMode(initialType);
//   }, [open, initialType]);

//   useEffect(() => {
//     document.body.style.overflow = open ? 'hidden' : '';
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [open]);

//   if (!open) return null;

//   return (
//     <AnimatePresence>
//       {open && (
//         <>
//           <motion.div
//             className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             onClick={onClose}
//           />
//           <motion.div
//             className="fixed inset-0 flex items-center justify-center p-4 z-50"
//             initial={{ scale: isMobile ? 1 : 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: isMobile ? 1 : 0.8, opacity: 0 }}
//             transition={{ type: 'spring', stiffness: 300, damping: 25 }}
//           >
//             <div
//               className={`relative z-50 w-full ${
//                 isMobile ? 'h-full rounded-none' : 'max-w-md max-h-screen rounded-xl'
//               } overflow-auto bg-[#0f172a] p-6`}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <div className="relative w-32 h-12">
//                   <Image
//                     src="/logo.png"
//                     alt="Logo"
//                     fill
//                     style={{ objectFit: 'contain' }}
//                     priority
//                   />
//                 </div>
//                 <button
//                   onClick={onClose}
//                   className="text-slate-400 hover:text-white text-2xl leading-none"
//                 >
//                   &times;
//                 </button>
//               </div>

//               {modalMode === 'login' ? (
//                 <LoginForm onSuccess={onClose} onSwitch={() => setModalMode('register')} />
//               ) : (
//                 <SignupForm onSuccess={onClose} onSwitch={() => setModalMode('login')} />
//               )}
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// // ✅ Main Affiliate Program Page
// const AffiliateProgram: React.FC = () => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [authOpen, setAuthOpen] = useState(false);
//   const [authType, setAuthType] = useState<'login' | 'register'>('login');
//   const [open, setOpen] = useState(false);
//   const [active, setActive] = useState("Overview");
//     const [search, setSearch] = useState('');

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const sidebarWidth = 62;
//   const collapsedWidth = 20;

//   const menuItems = [
//     { label: "Overview"},
//     { label: "Campaigns" },
//     { label: "Commissions" },
//     { label: "Referred Users" },
//     { label: "FAQ" },
//   ];

//   return (
//     <div className="flex min-h-screen bg-[#172630] text-white overflow-x-hidden relative flex-col">
//       <div className="flex flex-1">
//         {/* ✅ Sidebar (Desktop) */}
//         {!isMobile && (
//           <motion.div
//             animate={{
//               width: sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4,
//             }}
//             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//             className="h-screen bg-[#0f172a] shadow-lg overflow-hidden fixed left-0 top-0 z-50"
//           >
//             <Sidebar
//               collapsed={sidebarCollapsed}
//               setCollapsed={setSidebarCollapsed}
//               open={true}
//               setOpen={() => {}}
//             />
//           </motion.div>
//         )}

//         {/* ✅ Navbar */}
//         <motion.div
//           className="fixed top-0 left-0 right-0 z-40"
//           animate={{
//             marginLeft: !isMobile
//               ? sidebarCollapsed
//                 ? collapsedWidth * 4
//                 : sidebarWidth * 4
//               : 0,
//           }}
//           transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//         >
//           <TopNavbar searchValue={search} onSearchChange={setSearch} />
//         </motion.div>

//         {/* ✅ Main Content */}
//         <motion.main
//           className="flex-1 flex flex-col overflow-auto pt-[112px] pb-16 px-3 py-12 md:px-8"
//           animate={{
//             marginLeft: !isMobile
//               ? sidebarCollapsed
//                 ? collapsedWidth * 4
//                 : sidebarWidth * 4
//               : 0,
//           }}
//           transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//         >
//           <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
//             {/* Left Sidebar */}
//             <>
//               {/* 🖥️ Desktop Sidebar Menu */}
//               <aside className="hidden md:flex md:flex-col md:w-1/5 h-fit md:sticky md:top-6 bg-[#101b22dd] backdrop-blur-xl  border-white/10 rounded-2xlborder p-4 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
//                 <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-100">
//                   👥 Affiliate Program
//                 </h2>
//                 <nav className="flex flex-col space-y-2">
//                   {menuItems.map(({ label }) => (
//                     <button
//                       key={label}
//                       onClick={() => setActive(label)}
//                      className={clsx(
//                                          'cursor-pointer px-3 py-2 rounded-sm text-sm font-semibold transition-all',
//                                          active === label
//                                            ? 'bg-[#122334] text-white border-l-2 border-[#2b8eff]'
//                                            : 'text-gray-300 hover:bg-[#122334] hover:text-white'
//                                        )}
//                     >
                      
//                       <span>{label}</span>
//                     </button>
//                   ))}
//                 </nav>
//               </aside>

//               {/* 📱 Mobile Dropdown Menu */}
//               <div className="md:hidden w-full bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-[0_0_10px_rgba(0,0,0,0.4)]">
//                 <button
//                   onClick={() => setOpen(!open)}
//                   className="flex items-center justify-between w-full px-4 py-2 rounded-lg text-gray-100 font-medium bg-[#0f172a]/60 hover:bg-[#1e3a8a]/40 transition-all duration-300"
//                 >
//                   <span>{active}</span>
//                   <ChevronDown
//                     className={`transform transition-transform duration-300 ${
//                       open ? "rotate-180" : ""
//                     }`}
//                     size={18}
//                   />
//                 </button>
//                 {open && (
//                   <div className="mt-3 flex flex-col space-y-2">
//                     {menuItems.map(({ label}) => (
//                       <button
//                         key={label}
//                         onClick={() => {
//                           setActive(label);
//                           setOpen(false);
//                         }}
//                         className={clsx(
//                                          'cursor-pointer px-3 py-2 rounded-sm text-sm font-semibold transition-all',
//                                          active === label
//                                            ? 'bg-[#122334] text-white border-l-2 border-[#2b8eff]'
//                                            : 'text-gray-300 hover:bg-[#122334] hover:text-white'
//                                        )}
//                       >
                       
//                         <span>{label}</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </>

//             {/* ✅ Main Dynamic Section */}
           
//             <main className="flex-1 bg-[#151c28] rounded-2xl p-6 space-y-6 shadow-lg shadow-black/40 mb-3 w-fit">
//               {active === "Overview" && (
//                 <Overview
//                   onLogin={() => {
//                     setAuthType('login');
//                     setAuthOpen(true);
//                   }}
//                   onRegister={() => {
//                     setAuthType('register');
//                     setAuthOpen(true);
//                   }}
//                 />
//               )}
//               {active === "Campaigns" && <Refer />}
//               {active === "Commissions" && <Commissions />}
//               {active === "Referred Users" && <ReferredUsers />}
//               {active === "FAQ" && <FAQ />}
//             </main>
//           </div>

//           <Footer />
//         </motion.main>
//       </div>

//       {/* ✅ Mobile Bottom Bar */}
//       {isMobile && (
//         <div className="fixed bottom-0 w-full z-50 h-16">
//           <MobileBottomBar onBrowseClick={() => setSidebarOpen(true)} />
//         </div>
//       )}

//       {/* ✅ Mobile Sidebar */}
//       <AnimatePresence>
//         {isMobile && sidebarOpen && (
//           <motion.div
//             initial={{ x: -256 }}
//             animate={{ x: 0 }}
//             exit={{ x: -256 }}
//             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//             className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] shadow-lg"
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

//       {/* ✅ Auth Modal */}
//       <AuthModal
//         open={authOpen}
//         onClose={() => setAuthOpen(false)}
//         initialType={authType}
//         isMobile={isMobile}
//       />
//     </div>
//   );
// };

// export default AffiliateProgram;
// "use client";
// import React, { useState, useEffect } from "react";
// import clsx from "clsx";
// import { motion, AnimatePresence } from "framer-motion";

// import Sidebar from "@/components/sidebar";
// import TopNavbar from "@/components/topnavbar";
// import MobileBottomBar from "@/components/mobilebuttombar";
// import Footer from "@/components/footer";
// import { apiRequest } from "@/utils/ApiHelper";
// import Overview from "@/components/affiliates/overviewmain";
// import Refer from "@/components/affiliates/campaigns";
// import Commissions from "@/components/affiliates/commission";
// import ReferredUsers from "@/components/affiliates/refer";
// import FAQ from "@/components/affiliates/faq";

// const affiliateTabs = [
//   "Overview",
//   "Campaigns",
//   "Commissions",
//   "Referred Users",
//   "FAQ",
// ];

// const AffiliateProgram = () => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [activeTab, setActiveTab] = useState("Overview");
//   const [search, setSearch] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//    const [dashboardDetails, setDashboardDetails] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//   const sidebarWidth = 62;
//   const collapsedWidth = 20;

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const renderTabPage = () => {
//     switch (activeTab) {
//       case "Overview":
//         return <Overview />;
//       case "Campaigns":
//         return <Refer />;
//       case "Commissions":
//         return <Commissions />;
//       case "Referred Users":
//         return <ReferredUsers />;
//       case "FAQ":
//         return <FAQ />;
//       default:
//         return <Overview />;
//     }
//   };

//   useEffect(() => {
//       const fetchDashboardDetails = async () => {
//         try {
//           const token = localStorage.getItem("token");
//           const id = localStorage.getItem("userId");
  
//           const res = await apiRequest(`/users/${id}/details`, true, {
//             method: "GET",
//             headers: { Authorization: `Bearer ${token}` },
//           });
  
//           if (res.success) {
//             setDashboardDetails(res.data);
//           }
//         } catch (err) {
//           console.error("VIP Page API Error:", err);
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       fetchDashboardDetails();
//     }, []);
//   return (
//     <div className="flex bg-[#1a2c38] text-white overflow-x-hidden">

//       {/* ✅ Sidebar Desktop */}
//       {!isMobile && (
//         <motion.div
//           animate={{
//             width: sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4,
//           }}
//           transition={{ type: "spring", stiffness: 300, damping: 30 }}
//           className="h-screen bg-[#0f172a] shadow-lg fixed left-0 top-0 z-50"
//         >
//           <Sidebar
//             collapsed={sidebarCollapsed}
//             setCollapsed={setSidebarCollapsed}
//             open={true}
//             setOpen={() => {}}
//           />
//         </motion.div>
//       )}

//       {/* ✅ Top Navbar */}
//       <motion.div
//         className="fixed top-0 left-0 right-0 z-40"
//         animate={{
//           marginLeft: !isMobile
//             ? sidebarCollapsed
//               ? collapsedWidth * 4
//               : sidebarWidth * 4
//             : 0,
//         }}
//         transition={{ type: "spring", stiffness: 300, damping: 30 }}
//       >
//         <TopNavbar searchValue={search} onSearchChange={setSearch} wallets={[]} />
//       </motion.div>

//       {/* ✅ Main Page */}
//       <motion.main
//         className="flex-1 flex flex-col pt-[100px] pb-16 px-4 md:px-10"
//         animate={{
//           marginLeft: !isMobile
//             ? sidebarCollapsed
//               ? collapsedWidth * 4
//               : sidebarWidth * 4
//             : 0,
//         }}
//         transition={{ type: "spring", stiffness: 300, damping: 30 }}
//       >
//         <div className="max-w-6xl mx-auto w-full flex flex-col gap-10 pb-3">

//           <div className="text-2xl font-bold flex items-center gap-2">
//             👥 Affiliate Program
//           </div>

//           {/* ✅ Desktop Sidebar Menu */}
//           <div className="flex flex-col md:flex-row gap-6">
//             <aside className="hidden md:flex w-[220px]">
//               <div className="sticky top-24 bg-[#101b22dd]/95 rounded-md p-2 shadow-md w-full h-min">
//                 {affiliateTabs.map((tab) => (
//                   <div
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className={clsx(
//                       "cursor-pointer px-3 py-2 rounded-sm text-sm font-semibold transition-all",
//                       activeTab === tab
//                         ? "bg-[#122334] text-white border-l-2 border-[#2b8eff]"
//                         : "text-gray-300 hover:bg-[#122334] hover:text-white"
//                     )}
//                   >
//                     {tab}
//                   </div>
//                 ))}
//               </div>
//             </aside>

//             {/* ✅ Mobile Dropdown */}
//             {isMobile && (
//               <div className="relative">
//                 <select
//                   value={activeTab}
//                   onChange={(e) => setActiveTab(e.target.value)}
//                   className="bg-[#101b22dd] border border-[#1f2d3a] rounded-md px-4 py-2 font-semibold"
//                 >
//                   {affiliateTabs.map((tab) => (
//                     <option key={tab} value={tab}>
//                       {tab}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             {/* ✅ Dynamic Page Renderer */}
//             <div className="flex-1">{renderTabPage()}</div>
//           </div>
//         </div>

//         <Footer />
//       </motion.main>

//       {/* ✅ Mobile Bottom Bar */}
//       {isMobile && (
//         <div className="fixed bottom-0 w-full z-50 h-16">
//           <MobileBottomBar onBrowseClick={() => setSidebarOpen(true)} />
//         </div>
//       )}

//       {/* ✅ Mobile Sidebar Slide */}
//       <AnimatePresence>
//         {isMobile && sidebarOpen && (
//           <motion.div
//             initial={{ x: -256 }}
//             animate={{ x: 0 }}
//             exit={{ x: -256 }}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] shadow-lg"
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

//       {/* ✅ Dark overlay when sidebar open */}
//       {isMobile && sidebarOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 0.3 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.2 }}
//           className="fixed inset-0 bg-black z-40"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default AffiliateProgram;
"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "@/components/sidebar";
import TopNavbar from "@/components/topnavbar";
import MobileBottomBar from "@/components/mobilebuttombar";
import Footer from "@/components/footer";
import { apiRequest } from "@/utils/ApiHelper";

import Overview from "@/components/affiliates/overviewmain";
import Refer from "@/components/affiliates/campaigns";
import Commissions from "@/components/affiliates/commission";
import ReferredUsers from "@/components/affiliates/refer";
import FAQ from "@/components/affiliates/faq";

const affiliateTabs = [
  "Overview",
  "Campaigns",
  "Commissions",
  "Referred Users",
  "FAQ",
];

const AffiliateProgram = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");

  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sidebarWidth = 62;
  const collapsedWidth = 20;

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load dashboard details
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

  // Render dynamic tab content
  const renderTabPage = () => {
    switch (activeTab) {
      case "Overview":
        return <Overview />;
      case "Campaigns":
        return <Refer />;
      case "Commissions":
        return <Commissions />;
      case "Referred Users":
        return <ReferredUsers />;
      case "FAQ":
        return <FAQ />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex bg-[#1a2c38] text-white overflow-x-hidden">

      {/* DESKTOP SIDEBAR */}
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

      {/* TOP NAVBAR */}
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
        <TopNavbar
          searchValue={search}
          onSearchChange={setSearch}
          wallets={dashboardDetails?.wallets || []}
        />
      </motion.div>

      {/* MAIN PAGE */}
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

          {/* PAGE TITLE */}
          <div className="text-2xl font-bold flex items-center gap-2">
            👥 Affiliate Program
          </div>

          <div className="flex flex-col md:flex-row gap-6">

            {/* DESKTOP MENU */}
            <aside className="hidden md:flex w-[220px]">
              <div className="sticky top-24 bg-[#101b22dd]/95 rounded-md p-2 shadow-md w-full h-min">
                {affiliateTabs.map((tab) => (
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

            {/* MOBILE DROPDOWN */}
            {isMobile && (
              <div className="relative">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="bg-[#101b22dd] border border-[#1f2d3a] rounded-md px-4 py-2 font-semibold"
                >
                  {affiliateTabs.map((tab) => (
                    <option key={tab} value={tab}>
                      {tab}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* CONTENT */}
            <div className="flex-1">{renderTabPage()}</div>
          </div>
        </div>

        <Footer />
      </motion.main>

      {/* MOBILE BOTTOM BAR */}
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

      {/* MOBILE OVERLAY */}
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

export default AffiliateProgram;
