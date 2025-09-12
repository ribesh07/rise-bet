"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Gift, Users, BookOpen, MessageCircle, Globe, LifeBuoy } from "lucide-react";

export default function Sidebar() {
  const [openPromotions, setOpenPromotions] = useState(false);
  const [openSponsorships, setOpenSponsorships] = useState(false);

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#0d0f1a] border-r border-gray-800 text-gray-300 flex flex-col">
      <div className="p-4">
        <Link href="/" className="block mb-6">
          <img src="/logo.png" alt="Logo" className="w-28 mx-auto" />
        </Link>

        <nav className="space-y-1">
          {/* Promotions */}
          <button
            onClick={() => setOpenPromotions(!openPromotions)}
            className="flex justify-between items-center w-full px-4 py-2 hover:bg-[#1a1c2a] rounded-lg"
          >
            <span className="flex items-center gap-2"><Gift size={18} /> Promotions</span>
            {openPromotions ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {openPromotions && (
            <div className="ml-6 space-y-1">
              <Link href="/promotions/bonuses" className="block px-2 py-1 hover:text-white">Bonuses</Link>
              <Link href="/promotions/tournaments" className="block px-2 py-1 hover:text-white">Tournaments</Link>
            </div>
          )}

          {/* Affiliate */}
          <Link href="/affiliate" className="flex items-center gap-2 px-4 py-2 hover:bg-[#1a1c2a] rounded-lg">
            <Users size={18} /> Affiliate
          </Link>

          {/* VIP Club */}
          <Link href="/vip" className="flex items-center gap-2 px-4 py-2 hover:bg-[#1a1c2a] rounded-lg">
            <BookOpen size={18} /> VIP Club
          </Link>

          {/* Blog */}
          <Link href="/blog" className="flex items-center gap-2 px-4 py-2 hover:bg-[#1a1c2a] rounded-lg">
            <MessageCircle size={18} /> Forum
          </Link>

          {/* Sponsorships */}
          <button
            onClick={() => setOpenSponsorships(!openSponsorships)}
            className="flex justify-between items-center w-full px-4 py-2 hover:bg-[#1a1c2a] rounded-lg"
          >
            <span className="flex items-center gap-2"><LifeBuoy size={18} /> Sponsorships</span>
            {openSponsorships ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {openSponsorships && (
            <div className="ml-6 space-y-1">
              <Link href="/sponsorships/ufc" className="block px-2 py-1 hover:text-white">UFC</Link>
              <Link href="/sponsorships/esports" className="block px-2 py-1 hover:text-white">eSports</Link>
            </div>
          )}

          {/* Other Links */}
          <Link href="/responsible-gambling" className="block px-4 py-2 hover:bg-[#1a1c2a] rounded-lg">
            Responsible Gambling
          </Link>
          <Link href="/support" className="block px-4 py-2 hover:bg-[#1a1c2a] rounded-lg">
            Live Support
          </Link>
          <Link href="/language" className="block px-4 py-2 hover:bg-[#1a1c2a] rounded-lg flex items-center gap-2">
            <Globe size={18} /> Language: English
          </Link>
        </nav>
      </div>
    </aside>
  );
}
