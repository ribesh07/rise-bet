
"use client";
import React, { useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageSquare,
  Film,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const sections = [
  {
    title: "Casino",
    items: [
      "Casino Games",
      "Slots",
      "Live Casino",
      "Roulette",
      "Blackjack",
      "Poker",
      "Publishers",
      "Promos & Competitions",
      "Rise Engine ↗",
      "Rise Vendors ↗",
    ],
  },
  // {
  //   title: "Sports",
  //   items: [
  //     "Sportsbook",
  //     "Live Sports",
  //     "Soccer",
  //     "Basketball",
  //     "Tennis",
  //     "eSports",
  //     "Bet Bonuses",
  //     "Sports Rules",
  //     "Racing Rules",
  //   ],
  // },
  {
    title: "Support",
    items: [
      "Help Center ↗",
      "Fairness",
      "Gambling Helpline ↗",
      "Live Support",
      "Self Exclusion",
      "Law Enforcement Request",
    ],
  },
  {
    title: "About Us",
    items: ["VIP Club", "Affiliate", "Privacy Policy", "AML Policy", "Terms of Service"],
  },
  {
    title: "Payment Info",
    items: [
      "Deposit & Withdrawals",
      "Currency Guide",
      "Crypto Guide",
      "Supported Crypto",
      "How to Use the Vault",
      "How Much to Bet With",
    ],
  },
  {
    title: "FAQ",
    items: [
      "How-to Guides",
      "Online Casino Guide",
      "Sports Betting Guide",
      "How to Live Stream Sports",
      "Rise VIP Guide",
      "House Edge Guide",
    ],
  },
];

export default function Footer() {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <footer className=" relative  bg-[#101b22dd] 
        backdrop-blur-md text-gray-300 px-6 md:px-20 py-10 text-sm">

      {/* Mobile Accordion */}
      <div className="md:hidden space-y-2">
        {sections.map((section, index) => {
          const isOpen = openSection === index;
          return (
            <div key={section.title} className="bg-[#12263A] rounded">
              <button
                className="w-full flex justify-between items-center px-4 py-4 font-semibold text-white"
                onClick={() => toggleSection(index)}
                aria-expanded={isOpen}
                aria-controls={`section-${index}`}
              >
                <span>{section.title}
                    
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Animated dropdown */}
              <div
                id={`section-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96" : "max-h-0"
                }`}
              >
                <hr className="border-gray-700/50" /> 
                <ul className="px-4 pb-4 pt-1 space-y-2 text-sm text-gray-400">
                     
                  {section.items.map((item) => (
                    <li key={item}>
                      <a href="#" className="block hover:text-white transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="font-semibold text-white mb-3">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Social Icons */}
      {/* Social Icons */}
<div className="flex justify-center gap-4 mt-8">
  <MessageSquare className="w-5 h-5 text-white md:text-gray-400 hover:text-white cursor-pointer transition-colors" />
  <Facebook className="w-5 h-5 text-white md:text-gray-400 hover:text-white cursor-pointer transition-colors" />
  <Twitter className="w-5 h-5 text-white md:text-gray-400 hover:text-white cursor-pointer transition-colors" />
  <Instagram className="w-5 h-5 text-white md:text-gray-400 hover:text-white cursor-pointer transition-colors" />
  <Youtube className="w-5 h-5 text-white md:text-gray-400 hover:text-white cursor-pointer transition-colors" />
  <Film className="w-5 h-5 text-white md:text-gray-400 hover:text-white cursor-pointer transition-colors" />
</div>


      <hr className="border-gray-700 my-8" />

      {/* Footer Bottom */}
      <div className="space-y-3 text-xs text-gray-400">
        <p>© 2025 Rise.com | All Rights Reserved.</p>
        <p>
          Rise is owned and operated by Medium Rare N.V., registration number: 145353,
          registered address: Seru Loraweg 17 B, Curaçao. Payment agent companies are Medium
          Rare Limited and MRS Tech Limited. Contact us at support@Rise.com.
        </p>
        <p>
          Rise is committed to responsible gambling, for more information visit{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Gamblingtherapy.org
          </a>
        </p>
        <p className="flex justify-center text-gray-500">1 BTC = $121,506.68</p>
      </div>
    </footer>
  );
}
