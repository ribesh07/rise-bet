
// }
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { ChevronDown } from "lucide-react";

type AccordionItemType = {
  title: string;
  content: string;
};

const generalData: AccordionItemType[] = [
  {
    title: "What is the rise Affiliate Program?",
    content:
      "The rise Affiliate Program allows individuals, businesses, and influencers to earn commissions by referring new players to rise.com.",
  },
  {
    title: "Who can join the rise Affiliate Program?",
    content:
      "The rise Affiliate Program is open to anyone who has a networks or audiences to which they can promote rise.",
  },
  {
    title: "How do I join the rise Affiliate Program?",
    content:
      "To begin, you need to sign up for an account on rise.com. Once you have an account, you’ll be able to start promoting your referral link and earn commission. Once you’ve done this, you can also get in touch with the affiliate team via the contact form to discuss personalised deals based on your audience and network.",
  },
  {
    title: "What are the benefits of joining the rise Affiliate Program?",
    content:
      "Affiliates can enjoy competitive commission rates, real-time tracking, promotional materials, and dedicated affiliate support. As a world leading casino & sportsbook, rise offers an exciting product that you can earn from by promoting it.",
  },
];

const affiliateProgramData: AccordionItemType[] = [
  {
    title: "How can I promote rise as an affiliate?",
    content:
      "Affiliates can promote rise through various channels, including social media networks, live streaming, websites & any other traffic sources they may have. We provide a range of banners, links, and other marketing promotions to help you succeed.",
  },
  {
    title: "How can I create new campaigns?",
    content:
      "Visit the campaigns section of your affiliate dashboard to effortlessly create new campaigns and optimise your results for enhanced analysis.",
  },
  {
    title: "How do I check the performance of my campaigns?",
    content:
      "You can monitor your campaign performance by visiting the campaigns section for an overview of your active campaigns and results, and by reviewing the referred users section for detailed insights into player activity and conversions.",
  },
  {
    title: "Where can I find banners & creatives to promote my campaigns?",
    content:
      "You can find marketing materials here to use in your campaigns. Additionally, check our casino and sports promotions here to boost traffic and enhance your campaign effectiveness.",
  },
  {
    title: "What countries can I target through my campaigns?",
    content:
      "You can promote rise.com in all countries except those listed in our prohibited jurisdictions. For more information, refer to the rise Terms of Service.",
  },
];

const earningsData: AccordionItemType[] = [
  {
    title: "How is the commission calculated for the affiliate program?",
    content:
      "As a default, the commission is set to 10% wager share commission which is calculated as follows.",
  },
  {
    title: "How much commission can I earn by becoming an affiliate?",
    content:
      "There’s no limit to your earnings; it depends on the number of referrals you generate and their wagering activity.",
  },
  {
    title: "When and how do I get paid?",
    content:
      "As a wager share affiliate, you can claim your commission instantly from the funds tab. The commission will continue to generate as long as there is wagering activity under your campaigns, and you can transfer any available balance to your rise wallet at any time.",
  },
  {
    title: "Can I track my earnings in real-time?",
    content:
      "Yes, you can track your earnings in real-time using the campaigns tab, which provides data on your available commission, withdrawn commission, and lifetime commissions earned through your campaigns.",
  },
];

const Accordion: React.FC<{ data: AccordionItemType[] }> = ({ data }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div
          key={index}
          className="rounded-lg overflow-hidden border border-[#1c2f42]"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full text-left bg-[#1e293b] p-4 font-semibold hover:bg-[#1a2e42] flex justify-between items-center"
          >
            <span className="text-sm sm:text-base">{item.title}</span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-300" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#132230] p-4 text-gray-300 text-sm sm:text-base"
              >
                {item.content}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-[#0e1924] text-white no-scrollbar">
      <div className=" px-4 sm:px-6 py-6 w-full  no-scrollbar">
        <Tabs defaultValue="general" className="w-full overflow-x-auto no-scrollbar">
          {/* Tabs - fully centered and mobile-safe */}
          <TabsList className="bg-[#132230] p-2 rounded-full flex gap-2 justify-center overflow-x-auto no-scrollbar">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-[#1c2f42] data-[state=active]:text-white rounded-full px-4 py-2 text-sm font-semibold"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="affiliate"
              className="data-[state=active]:bg-[#1c2f42] data-[state=active]:text-white rounded-full px-4 py-2 text-sm font-semibold"
            >
              Affiliate Program
            </TabsTrigger>
            <TabsTrigger
              value="earnings"
              className="data-[state=active]:bg-[#1c2f42] data-[state=active]:text-white rounded-full px-4 py-2 text-sm font-semibold"
            >
              Earnings
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="mt-6">
            <Accordion data={generalData} />
          </TabsContent>

          {/* Affiliate Program Tab */}
          <TabsContent value="affiliate" className="mt-6">
            <Accordion data={affiliateProgramData} />
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="mt-6">
            <Accordion data={earningsData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
