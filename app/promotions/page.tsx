'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarWrapper } from '@/components/dashboard/sidebarwapper';
import { TopNavbar } from '@/components/dashboard/topnavbar';
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
  {
    title: '$500,000 All in or Fold Jackpot',
    description: 'What’s All in or Fold (AoF) without a Jackpot?',
    ends: '6:44 PM 12/31/2026',
    image: '/images/allin.png',
    group: 'casino',
  },
  {
    title: "Stake’s Weekly Raffle",
    description: '$75,000 Weekly Raffle!',
    ends: '6:44 PM 12/31/2025',
    image: '/images/raffle.png',
    group: 'casino',
  },
  {
    title: "Stake’s Daily Races",
    description: '$100,000 every 24 hours!',
    ends: '7:45 PM 11/29/2025',
    image: '/images/races.png',
    group: 'casino',
  },
  {
    title: 'Stake vs Eddie',
    description: '$50,000 Prize Pool!',
    ends: '10:45 AM 10/20/2025',
    image: '/images/eddie.png',
    group: 'community',
  },
  {
    title: 'Conquer the Casino!',
    description: '$50,000 Prize Pool!',
    ends: '10:45 AM 10/24/2025',
    image: '/images/casino.png',
    group: 'casino',
  },
  {
    title: 'The Level Up',
    description: '$40,000 Prize Pool!',
    ends: '10:45 AM 10/22/2025',
    image: '/images/levelup.png',
    group: 'community',
  },
  {
    title: 'Champions League - Bad Beat Insurance',
    description:
      'Refund if your selection leads at 80’ but doesn’t win the match.',
    ends: '6:44 PM 1/20/2026',
    image: '/images/ucl.png',
    group: 'sport',
  },
  {
    title: 'Premier League - 2 Goal Lead Payout',
    description:
      'Paid out if your selection is leading by 2+ goals but doesn’t win.',
    ends: '7:44 PM 5/31/2026',
    image: '/images/epl.png',
    group: 'sport',
  },
  {
    title: 'Everton - Prize Pool',
    description: 'Receive a share of $25,000 if Everton win by 2+ goals.',
    ends: '7:44 PM 5/31/2026',
    image: '/images/everton.png',
    group: 'sport',
  },
  {
    title: 'NFL - 3rd Quarter Payout',
    description: 'Lead by 7+ at the end of the 3rd quarter? Get paid out.',
    ends: '6:44 PM 2/20/2026',
    image: '/images/nfl.png',
    group: 'sport',
  },
  {
    title: 'NBA - Half Time Payout',
    description: 'Lead by 12+ at half time? Get paid out.',
    ends: '7:44 PM 5/31/2026',
    image: '/images/nba.png',
    group: 'sport',
  },
  {
    title: 'Horse Racing - Caulfield Cup',
    description: 'Refund if your horse runs 2nd to 10th.',
    ends: '12:15 PM 10/18/2025',
    image: '/images/horse.png',
    group: 'sport',
  },
];

const categories = ['All Promotions', 'Casino', 'Sport', 'Community', 'Poker'];

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState('All Promotions');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredPromotions =
    activeTab === 'All Promotions'
      ? promotions
      : promotions.filter(
          (p) => p.group?.toLowerCase() === activeTab.toLowerCase()
        );

  const sidebarWidth = 64;
  const collapsedWidth = 16;

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
      {/* Sidebar */}
      {!isMobile && (
        <motion.div
          animate={{
            width: sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-screen bg-[#0f172a] shadow-lg overflow-hidden z-50 flex flex-col"
        >
          <SidebarWrapper
            sidebarOpen={!sidebarCollapsed}
            setSidebarOpen={() => setSidebarCollapsed((p) => !p)}
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
      >
        <TopNavbar sidebarWidth={!isMobile ? (sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4) : 0} />
      </motion.div>

      {/* Main Content */}
      <motion.main
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
        <CategoryTabs
          categories={categories}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <PromotionList promotions={filteredPromotions} />
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
            <SidebarWrapper
              sidebarOpen={sidebarOpen}
              setSidebarOpen={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
