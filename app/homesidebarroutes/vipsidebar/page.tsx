
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Image from 'next/image';
// import Footer from '@/components/footer';
// import MobileBottomBar from '@/components/mobilebuttombar';
// import TopNavbar from '@/components/topnavbar';
// import Sidebar from "@/components/sidebar";
// import { apiRequest } from "@/utils/ApiHelper";

// // VIP components
// import VipHero from '@/components/vip/vipprogress';
// import VipBenefits from '@/components/vip/vipbenefits';
// import VipLevels from '@/components/vip/viplevels';
// import VipFAQ from '@/components/vip/vipfaqs';
// const [dashboardDetails, setDashboardDetails] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
// // ✅ Shared AuthModal
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
//       const fetchDashboardDetails = async () => {
//         try {
//           const token = localStorage.getItem("token");
//           const id = localStorage.getItem("userId");
  
//           const res = await apiRequest(`/users/${id}/details`, true, {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//          console.log("Dashboard Details Response:", res);
//           if (res.success) {
//             setDashboardDetails(res.data);
//           }
//         } catch (err) {
//           console.error("Dashboard API Error:", err);
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       fetchDashboardDetails();
//     }, []);

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
//               {/* Header */}
//               <div className="flex justify-between items-center mb-4">
//                 <div className="relative w-32 h-15">
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

             
              
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// // ✅ VIP Page Layout
// export default function VipPage() {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [authOpen, setAuthOpen] = useState(false);
//   const [authType, setAuthType] = useState<'login' | 'register'>('login');
//   const [search, setSearch] = useState("");

//   // Detect screen size
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

  
//   // Handle auth modal trigger
//   useEffect(() => {
//     const handleAuthEvent = (event: any) => {
//       setAuthType(event.detail);
//       setAuthOpen(true);
//     };
//     window.addEventListener('openAuthModal', handleAuthEvent);
//     return () => window.removeEventListener('openAuthModal', handleAuthEvent);
//   }, []);

//   const sidebarWidth = 62;
//   const collapsedWidth = 20;

//   return (
//     <div className="flex min-h-screen bg-[#1a2c38] text-white overflow-x-hidden relative flex-col">
//       <div className="flex flex-1">
//         {/* Sidebar */}
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

//         {/* Top Navbar */}
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
//           <TopNavbar
//   searchValue={search}
//   onSearchChange={setSearch}
//   wallets={dashboardDetails?.wallets || []}
// />
//         </motion.div>

//         {/* Main Content */}
//         <motion.main
//           className="flex-1 flex flex-col overflow-auto pt-[100px] pb-8 px-4 md:px-8"
//           animate={{
//             marginLeft: !isMobile
//               ? sidebarCollapsed
//                 ? collapsedWidth * 4
//                 : sidebarWidth * 4
//               : 0,
//           }}
//           transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//         >
//           {/* VIP Sections */}
//           <VipHero />
//           <VipBenefits />
//           <VipLevels />
//           <VipFAQ />
//           <Footer />
//         </motion.main>
//       </div>

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

//       {/* Overlay for mobile sidebar */}
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

//       {/* Auth Modal */}
//       <AuthModal
//         open={authOpen}
//         onClose={() => setAuthOpen(false)}
//         initialType={authType}
//         isMobile={isMobile}
//       />
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Footer from "@/components/footer";
import MobileBottomBar from "@/components/mobilebuttombar";
import TopNavbar from "@/components/topnavbar";
import Sidebar from "@/components/sidebar";
import { apiRequest } from "@/utils/ApiHelper";

// VIP Components
import VipHero from "@/components/vip/vipprogress";
import VipBenefits from "@/components/vip/vipbenefits";
import VipLevels from "@/components/vip/viplevels";
import VipFAQ from "@/components/vip/vipfaqs";

/* ---------------------------------------------------------
   AUTH MODAL
--------------------------------------------------------- */
const AuthModal: React.FC<{
  open: boolean;
  onClose: () => void;
  initialType: "login" | "register";
  isMobile: boolean;
}> = ({ open, onClose, initialType, isMobile }) => {
  const [modalMode, setModalMode] = useState<"login" | "register">(initialType);

  useEffect(() => {
    if (open) setModalMode(initialType);
  }, [open, initialType]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            initial={{ scale: isMobile ? 1 : 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: isMobile ? 1 : 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div
              className={`relative z-50 w-full ${
                isMobile
                  ? "h-full rounded-none"
                  : "max-w-md max-h-screen rounded-xl"
              } overflow-auto bg-[#0f172a] p-6`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-32 h-15">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ---------------------------------------------------------
   VIP PAGE
--------------------------------------------------------- */

export default function VipPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const [search, setSearch] = useState("");

  // API STATES
  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------------------------------------------------
     DETECT SCREEN SIZE
  --------------------------------------------------------- */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------------------------------------------------------
     FETCH USER DETAILS (Same as Dashboard)
  --------------------------------------------------------- */
  useEffect(() => {
    const fetchDashboardDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("userId");

        const res = await apiRequest(`/users/${id}/details`, true, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.success) {
          setDashboardDetails(res.data);
        }
      } catch (err) {
        console.error("VIP Page API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardDetails();
  }, []);

  /* ---------------------------------------------------------
     LISTEN FOR AUTH MODAL TRIGGER
  --------------------------------------------------------- */
  useEffect(() => {
    const handleAuthEvent = (event: any) => {
      setAuthType(event.detail);
      setAuthOpen(true);
    };
    window.addEventListener("openAuthModal", handleAuthEvent);
    return () =>
      window.removeEventListener("openAuthModal", handleAuthEvent);
  }, []);

  const sidebarWidth = 62;
  const collapsedWidth = 20;

  return (
    <div className="flex min-h-screen bg-[#1a2c38] text-white overflow-x-hidden relative flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
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

        {/* Top Navbar */}
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

        {/* Main Content */}
        <motion.main
          className="flex-1 flex flex-col overflow-auto pt-[100px] pb-8 px-4 md:px-8"
          animate={{
            marginLeft: !isMobile
              ? sidebarCollapsed
                ? collapsedWidth * 4
                : sidebarWidth * 4
              : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <VipHero />
          <VipBenefits />
          <VipLevels />
          <VipFAQ />
          <Footer />
        </motion.main>
      </div>

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

      {/* Overlay */}
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

      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialType={authType}
        isMobile={isMobile}
      />
    </div>
  );
}
