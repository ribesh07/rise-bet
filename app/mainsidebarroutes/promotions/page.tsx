
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarWrapper } from '@/components/dashboard/sidebarwapper';
import  TopNavbar  from '@/components/dashboard/topnavbar';
import Footer from '@/components/footer';
import MobileBottomBar from '@/components/mobilebuttombar';
import HeroBanner from '@/components/promotion/herobanner';
import CategoryTabs from '@/components/promotion/categorytabs';
import PromotionList from '@/components/promotion/promotionlist';
import { apiRequest } from '@/utils/ApiHelper';

// ✅ Type for Promotion
export type Promotion = {
  id: number;
  title: string;
  description: string;
  image: string;
  group?: string;
  publishedAt: string;
  endsAt: string;
};




const categories = ['All Promotions', 'Casino', 'Sport', 'Community', 'Poker'];

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState('All Promotions');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
const [promoLoading, setPromoLoading] = useState(true);

  const mainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  const fetchPromotions = async () => {
    try {
      const res = await apiRequest(
        "/admin/control/promotions",
        false,
        {
          method: "GET",
        }
      );

      if (res?.success) {
        setPromotions(res.data || []);
      }
    } catch (error) {
      console.error("PROMOTIONS API ERROR:", error);
    } finally {
      setPromoLoading(false);
    }
  };

  fetchPromotions();
}, []);

  // ✅ Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Scroll to top when changing page or tab
  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToTop();
  }, [currentPage, activeTab]);

  // ✅ Filtered data
  const filteredPromotions =
    activeTab === 'All Promotions'
      ? promotions
      : promotions.filter((p) => p.group?.toLowerCase() === activeTab.toLowerCase());

  // ✅ Pagination setup
  const itemsPerPage = isMobile ? 6 : 12;
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPromotions = filteredPromotions.slice(startIndex, startIndex + itemsPerPage);

  const sidebarWidth = 64;
  const collapsedWidth = 16;

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
      {/* Sidebar */}
      {!isMobile && (
        <motion.div
          animate={{ width: sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-screen bg-[#0f172a] shadow-lg overflow-hidden z-50 flex flex-col"
        >
          <SidebarWrapper sidebarOpen={!sidebarCollapsed} setSidebarOpen={() => setSidebarCollapsed((p) => !p)} />
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
      >
        <TopNavbar  />
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
      >
        <HeroBanner />

        {/* ✅ Scrollable Category Tabs for Mobile */}
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

        <PromotionList promotions={currentPromotions} />

        {/* ✅ Pagination Buttons */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className={`px-6 py-2 rounded-full font-semibold ${
              currentPage === 1 ? 'bg-[#1e293b] text-gray-500 cursor-not-allowed' : 'bg-[#25374A] hover:bg-[#31475C]'
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
              currentPage === totalPages ? 'bg-[#1e293b] text-gray-500 cursor-not-allowed' : 'bg-[#25374A] hover:bg-[#31475C]'
            }`}
          >
            Next
          </button>
        </div>

        <Footer />
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
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] shadow-lg flex flex-col"
          >
            <SidebarWrapper sidebarOpen={sidebarOpen} setSidebarOpen={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
