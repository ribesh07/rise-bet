
// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Sidebar from "@/components/sidebar";
// import TopNavbar from "@/components/topnavbar";
// import NotificationBar from "@/components/notificationbar";
// import ProgressCard from "@/components/progresscard";
// import ImageHead from "@/components/ui/imagehead";
// import GamingGrid, { GameGridHandles } from "@/components/gaminggrid";
// import SearchBar from "@/components/ui/search";
// import MobileBottomBar from "@/components/mobilebuttombar";
// import UserVipCard from "@/components/form/vip";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronRight, ChevronLeft } from "lucide-react";
// import Footer from "@/components/footer"; // ✅ footer imported here
// import { RecentBets } from "@/components/dashboard/recentbet";

// const Dashboard: React.FC = () => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [category, setCategory] = useState("casino");
//   const [search, setSearch] = useState("");
//   const [isMobile, setIsMobile] = useState(false);
//   const [showVipForm, setShowVipForm] = useState(false); // VIP modal state

//   const gamingGridRef = useRef<GameGridHandles>(null);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const sidebarWidth = 64;
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
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
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

//         {/* Navbar */}
//         <motion.div
//           className="fixed top-0 left-0 right-0 z-40"
//           animate={{
//             marginLeft: !isMobile
//               ? sidebarCollapsed
//                 ? collapsedWidth * 4
//                 : sidebarWidth * 4
//               : 0,
//           }}
//           transition={{ type: "spring", stiffness: 300, damping: 30 }}
//         >
//           <AnimatePresence>
//             <motion.div
//               initial={{ y: -50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               exit={{ y: -50, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="absolute top-0 left-0 w-full z-30"
//             >
//               <NotificationBar />
//             </motion.div>
//           </AnimatePresence>
//           <TopNavbar searchValue={search} onSearchChange={setSearch} />
//         </motion.div>

//         {/* Main Content */}
//         <motion.main
//           className="flex-1 flex flex-col overflow-auto pt-[95px] pb-16  md:px-8"
//           animate={{
//             marginLeft: !isMobile
//               ? sidebarCollapsed
//                 ? collapsedWidth * 4
//                 : sidebarWidth * 4
//               : 0,
//           }}
//           transition={{ type: "spring", stiffness: 300, damping: 30 }}
//         >
//           {/* Header Section */}
//           <div className=" pt-4 header-bg">
//             <div className="absolute inset-0 bg-[#0f172a]/50 z-0"></div>

//             <div
//               className={`grid gap-4 w-full max-w-full mx-auto relative z-10 ${
//                 isMobile ? "grid-cols-1" : "grid-cols-3"
//               }`}
//             >
//               <div className="w-full flex pb-2 justify-center">
//                 <div className="w-full max-w-sm frosted-card-bg p-4">
//                   <ProgressCard
//                     username="shark491"
//                     progressPercentage={45}
//                     currentLevelName="Silver"
//                     nextLevelName="Gold"
                    
//                   />
//                 </div>
//               </div>

//               {!isMobile && (
//               <>
//                 <div className="w-full pb-2 flex justify-center">
//                   <div className="w-full max-w-sm">
//                     <ImageHead
//                       title="Casino"
//                       count={32339}
//                       image="/images/casino1.jpg"
//                     />
//                   </div>
//                 </div>
//                 <div className="w-full pb-2 flex justify-center">
//                   <div className="w-full max-w-sm">
//                     <ImageHead
//                       title="Sports (soon...)"
//                       count={0}
//                       image="/images/sports1.jpg"
//                     />
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           {isMobile && (
//             <div className="grid grid-cols-2 gap-0.5 mt-3 relative z-10">
//               <div className="flex justify-center">
//                 <div className="w-full max-w-[160px] frosted-card-bg p-1">
//                   <ImageHead
//                     title="Casino"
//                     count={32339}
//                     image="/images/casino1.jpg"
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-center">
//                 <div className="w-full max-w-[160px] frosted-card-bg p-1">
//                   <ImageHead
//                     title="Sports (soon...)"
//                     count={0}
//                     image="/images/sports1.jpg"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           </div>

//           {/* Search Bar */}
//           <div className="mt-4 px-2">
//             <SearchBar
//               category={category}
//               onCategoryChange={setCategory}
//               searchValue={search}
//               onSearchChange={setSearch}
//             />
//           </div>

//           {/* Trending Games */}
//           <section className="mt-4 relative px-2 mb-8">
//             <div className="flex items-center mb-2">
//               <h3 className="relative text-xl sm:text-2xl font-bold text-white mt-4  mb-4">
//                 Trending Games
//               </h3>
//               <div className="ml-auto flex gap-2">
//                 <button
//                   onClick={() => gamingGridRef.current?.scroll("left")}
//                   className="bg-[#1e293b] hover:bg-[#243249] text-white p-2 rounded-full shadow"
//                 >
//                   <ChevronLeft size={20} />
//                 </button>
//                 <button
//                   onClick={() => gamingGridRef.current?.scroll("right")}
//                   className="bg-[#1e293b] hover:bg-[#243249] text-white p-2 rounded-full shadow"
//                 >
//                   <ChevronRight size={20} />
//                 </button>
//               </div>
//             </div>

//             <GamingGrid ref={gamingGridRef} search={search} />
//           </section>

//           {/* ✅ Footer added here */}
//           <RecentBets />
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

//       {/* VIP Modal */}
//       {showVipForm && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 overflow-auto">
//           <div className="relative w-full max-w-md bg-[#1e293b] p-6 rounded-lg shadow-lg">
//             <button
//               className="absolute top-2 right-2 text-gray-400 hover:text-white"
//               onClick={() => setShowVipForm(false)}
//             >
//               ✕
//             </button>
//             <UserVipCard />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
"use client";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/sidebar";
import TopNavbar from "@/components/topnavbar";
import NotificationBar from "@/components/notificationbar";
import ProgressCard from "@/components/progresscard";
import ImageHead from "@/components/ui/imagehead";
import GamingGrid, { GameGridHandles } from "@/components/gaminggrid";
import SearchBar from "@/components/ui/search";
import MobileBottomBar from "@/components/mobilebuttombar";
import UserVipCard from "@/components/form/vip";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Footer from "@/components/footer";
import { RecentBets } from "@/components/dashboard/recentbet";
import { apiRequest } from "@/utils/ApiHelper"; // ensure this path is correct

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [category, setCategory] = useState("casino");
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showVipForm, setShowVipForm] = useState(false);

  // NEW STATES FOR API DATA
  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const gamingGridRef = useRef<GameGridHandles>(null);

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // FETCH /users/details
  useEffect(() => {
    const fetchDashboardDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("userId");

        const res = await apiRequest(`/users/${id}/details`, true, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
       console.log("Dashboard Details Response:", res);
        if (res.success) {
          setDashboardDetails(res.data);
        }
      } catch (err) {
        console.error("Dashboard API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardDetails();
  }, []);

  const sidebarWidth = 64;
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

        {/* Navbar */}
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
          <TopNavbar
  searchValue={search}
  onSearchChange={setSearch}
  wallets={dashboardDetails?.wallets || []}
/>
        </motion.div>

        {/* Main Content */}
        <motion.main
          className="flex-1 flex flex-col overflow-auto pt-[95px] pb-16  md:px-8"
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
          <div className=" pt-4 header-bg">
            <div className="absolute inset-0 bg-[#0f172a]/50 z-0"></div>

            <div
              className={`grid gap-4 w-full max-w-full mx-auto relative z-10 ${
                isMobile ? "grid-cols-1" : "grid-cols-3"
              }`}
            >
              {/* Progress Card from API */}
              <div className="w-full flex pb-2 justify-center">
                <div className="w-full max-w-sm frosted-card-bg p-4">
                  <ProgressCard
  username={dashboardDetails?.username || "Loading..."}
  progressPercentage={dashboardDetails?.progressPercent || 0}
  currentLevelName={dashboardDetails?.currentLevelName || "—"}
  nextLevelName={dashboardDetails?.nextLevelName || "—"}
/>

                </div>
              </div>

              {!isMobile && (
                <>
                  <div className="w-full pb-2 flex justify-center">
                    <div className="w-full max-w-sm">
                      <ImageHead
                        title="Casino"
                        count={32339}
                        image="/images/casino1.jpg"
                      />
                    </div>
                  </div>
                  <div className="w-full pb-2 flex justify-center">
                    <div className="w-full max-w-sm">
                      <ImageHead
                        title="Sports (soon...)"
                        count={0}
                        image="/images/sports1.jpg"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {isMobile && (
              <div className="grid grid-cols-2 gap-0.5 mt-3 relative z-10">
                <div className="flex justify-center">
                  <div className="w-full max-w-[160px] frosted-card-bg p-1">
                    <ImageHead
                      title="Casino"
                      count={32339}
                      image="/images/casino1.jpg"
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-full max-w-[160px] frosted-card-bg p-1">
                    <ImageHead
                      title="Sports (soon...)"
                      count={0}
                      image="/images/sports1.jpg"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="mt-4 px-2">
            <SearchBar
              category={category}
              onCategoryChange={setCategory}
              searchValue={search}
              onSearchChange={setSearch}
            />
          </div>

          {/* Trending Games */}
          <section className="mt-4 relative px-2 mb-8">
            <div className="flex items-center mb-2">
              <h3 className="relative text-xl sm:text-2xl font-bold text-white mt-4  mb-4">
                Trending Games
              </h3>
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

          {/* Recent Bets + Footer */}
          <RecentBets />
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

      {/* VIP Modal */}
      {showVipForm && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
    <div className="relative w-full max-w-md bg-[#1e293b] p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
        onClick={() => setShowVipForm(false)}
      >
        ✕
      </button>
      <UserVipCard />
    </div>
  </div>
)}

    </div>
  );
};

export default Dashboard;
