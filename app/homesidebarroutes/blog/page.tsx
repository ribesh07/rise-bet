
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/sidebar';
import TopNavbar from '@/components/topnavbar';
import Footer from '@/components/footer';
import MobileBottomBar from '@/components/mobilebuttombar';
import HeroBanner from '@/components/blog/herobanner';
import CategoryTabs from '@/components/blog/categorytabs';
import BlogList from '@/components/blog/bloglisthome';
import { apiRequest } from "@/utils/ApiHelper";

// ✅ Type for Blog
export type Blog = {
  id: number;
  title: string;
  description: string;
  image: string;
  group?: string;
  publishedAt: string; // from API
};


// ✅ Sample Data


const categories = [
  "All Blogs",
  "Crypto",
  "How to Guides",
  "rise News",
  "Sport",
  "Poker",
  "Casino",
  "Other",
];

export default function BlogsPage() {
  const [activeTab, setActiveTab] = useState('All Blogs');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const mainRef = useRef<HTMLDivElement | null>(null);
  const [dashboardDetails, setDashboardDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
const [blogsLoading, setBlogsLoading] = useState(true);
useEffect(() => {
  const fetchBlogs = async () => {
    try {
      const res = await apiRequest(
        "/admin/control/blogs",
        false,
        {
          method: "GET",
        }
      );

      if (res?.success) {
        setBlogs(res.data || []);
      }
    } catch (error) {
      console.error("BLOGS API ERROR:", error);
    } finally {
      setBlogsLoading(false);
    }
  };

  fetchBlogs();
}, []);

  // ✅ Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Scroll to top when changing page or tab
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, activeTab]);

  // ✅ Filtered data
  const filteredBlogs =
  activeTab === 'All Blogs'
    ? blogs
    : blogs.filter(
        (b) => b.group?.toLowerCase() === activeTab.toLowerCase()
      );

  // ✅ Pagination setup
  const itemsPerPage = isMobile ? 6 : 12;
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + itemsPerPage);

  const sidebarWidth = 62;
  const collapsedWidth = 20;
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
  return (
    <div className="flex min-h-screen bg-[#1a2c38] text-white overflow-x-hidden relative flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        {!isMobile && (
          <motion.div
            animate={{ width: sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
           <TopNavbar
          searchValue={search}
          onSearchChange={setSearch}
          wallets={dashboardDetails?.wallets || []}
        />
        </motion.div>

        {/* Main Content */}
        <motion.main
          ref={mainRef}
          className="flex-1 flex flex-col overflow-auto pt-[120px] pb-16 px-4 md:px-8"
          animate={{
            marginLeft: !isMobile
              ? sidebarCollapsed
                ? collapsedWidth * 4
                : sidebarWidth * 4
              : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <HeroBanner />

          {/* ✅ Scrollable Category Tabs */}
          <div className="overflow-x-auto no-scrollbar">
            <div className="min-w-max">
              <CategoryTabs
                categories={categories}
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <BlogList Blogs={currentBlogs} />

          {/* ✅ Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className={`px-6 py-2 rounded-full font-semibold ${
                currentPage === 1
                   ? 'bg-[#1e293b] text-gray-500 cursor-not-allowed'
                  : 'bg-[#25374A] hover:bg-[#31475C]'
              }`}
            >
              Previous
            </button>

            <span className="text-gray-400 text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className={`px-6 py-2 rounded-full font-semibold ${
                currentPage === totalPages
                  ? 'bg-[#1e293b] text-gray-500 cursor-not-allowed'
                  : 'bg-[#25374A] hover:bg-[#31475C]'
              }`}
            >
              Next
            </button>
          </div>

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
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
}
