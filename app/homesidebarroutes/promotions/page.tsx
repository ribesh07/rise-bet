
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from "@/components/sidebar";
import TopNavbar from '@/components/topnavbar';
import Footer from '@/components/footer';
import MobileBottomBar from '@/components/mobilebuttombar';
import HeroBanner from '@/components/promotion/herobanner';
import CategoryTabs from '@/components/promotion/categorytabs';
import PromotionList from '@/components/promotion/promotionlist';

// ✅ Type for Promotion
export type Promotion = {
  title: string;
  description: string;
  ends: string;
  image: string;
  group?: string;
};

// ✅ Sample Data
 const promotions: Promotion[] = [
  { title: '$500,000 All in or Fold Jackpot', description: 'What’s All in or Fold (AoF) without a Jackpot?', ends: '6:44 PM 12/31/2026', image: '/images/allin.png', group: 'casino' },
  { title: "Risebet’s Weekly Raffle", description: '$75,000 Weekly Raffle!', ends: '6:44 PM 12/31/2025', image: '/images/raffle.png', group: 'casino' },
  { title: "Risebet’s Daily Races", description: '$100,000 every 24 hours!', ends: '7:45 PM 11/29/2025', image: '/images/races.png', group: 'casino' },
  { title: 'Risebet vs Eddie', description: '$50,000 Prize Pool!', ends: '10:45 AM 10/20/2025', image: '/images/eddie.png', group: 'community' },
  { title: 'Conquer the Casino!', description: '$50,000 Prize Pool!', ends: '10:45 AM 10/24/2025', image: '/images/casino.png', group: 'casino' },
  { title: 'The Level Up', description: '$40,000 Prize Pool!', ends: '10:45 AM 10/22/2025', image: '/images/levelup.png', group: 'community' },
  { title: 'Champions League - Bad Beat Insurance', description: 'Refund if your selection leads at 80’ but doesn’t win the match.', ends: '6:44 PM 1/20/2026', image: '/images/ucl.png', group: 'sport' },
  { title: 'Premier League - 2 Goal Lead Payout', description: 'Paid out if your selection is leading by 2+ goals but doesn’t win.', ends: '7:44 PM 5/31/2026', image: '/images/epl.png', group: 'sport' },
  { title: 'Everton - Prize Pool', description: 'Receive a share of $25,000 if Everton win by 2+ goals.', ends: '7:44 PM 5/31/2026', image: '/images/everton.png', group: 'sport' },
  { title: 'NFL - 3rd Quarter Payout', description: 'Lead by 7+ at the end of the 3rd quarter? Get paid out.', ends: '6:44 PM 2/20/2026', image: '/images/nfl.png', group: 'sport' },
  { title: 'NBA - Half Time Payout', description: 'Lead by 12+ at half time? Get paid out.', ends: '7:44 PM 5/31/2026', image: '/images/nba.png', group: 'sport' },
  { title: 'Horse Racing - Caulfield Cup', description: 'Refund if your horse runs 2nd to 10th.', ends: '12:15 PM 10/18/2025', image: '/images/horse.png', group: 'sport' },
  { title: 'Everton - Prize Pool', description: 'Receive a share of $25,000 if Everton win by 2+ goals.', ends: '7:44 PM 5/31/2026', image: '/images/everton.png', group: 'sport' },
  { title: 'NFL - 3rd Quarter Payout', description: 'Lead by 7+ at the end of the 3rd quarter? Get paid out.', ends: '6:44 PM 2/20/2026', image: '/images/nfl.png', group: 'sport' },
  { title: 'NBA - Half Time Payout', description: 'Lead by 12+ at half time? Get paid out.', ends: '7:44 PM 5/31/2026', image: '/images/nba.png', group: 'sport' },
  { title: 'Horse Racing - Caulfield Cup', description: 'Refund if your horse runs 2nd to 10th.', ends: '12:15 PM 10/18/2025', image: '/images/horse.png', group: 'sport' },
];

const categories = ['All Promotions', 'Casino', 'Sport', 'Community', 'Poker'];

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState('All Promotions');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const mainRef = useRef<HTMLDivElement | null>(null);

  // ✅ Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Scroll to top on change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const collapsedWidth = 20;

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
          <TopNavbar searchValue={search} onSearchChange={setSearch} />
        </motion.div>

        {/* Main Content */}
        <motion.main
          ref={mainRef}
          className="flex-1 flex flex-col overflow-auto pt-[120px] pb-16 md:px-8"
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

          <PromotionList promotions={currentPromotions} />

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
