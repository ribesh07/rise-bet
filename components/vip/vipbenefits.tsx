
"use client";
import React from "react";
import { Zap, Award, ArrowUpCircle, Star, CheckCircle } from "lucide-react";

const vipBenefits = [
  {
    title: "Boost",
    desc: "Every week and every month, expect a fresh bonus based on your recent games.",
    icon: <Zap className="text-orange-400 w-8 h-8" />,
  },
  {
    title: "Dedicated VIP Host",
    desc: "Receive your own dedicated VIP host who will support your betting needs.",
    icon: <Award className="text-orange-400 w-8 h-8" />,
  },
  {
    title: "Recent Play Bonuses",
    desc: "Having a rough streak of luck? rise offers money back on losses every time you level up.",
    icon: <ArrowUpCircle className="text-orange-400 w-8 h-8" />,
  },
  {
    title: "Level-Ups",
    desc: "Reach a new level and get paid. The level-ups get better the higher you go.",
    icon: <Star className="text-orange-400 w-8 h-8" />,
  },
  {
    title: "Bespoke benefits",
    desc: "Work with your dedicated VIP host to tailor benefits to your gaming needs.",
    icon: <CheckCircle className="text-orange-400 w-8 h-8" />,
  },
];

const VipBenefits = () => {
  return (
    <section className="py-16 px-4 border-t border-gray-700">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
        Rise VIP Club benefits
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {vipBenefits.map((benefit, i) => (
          <div
            key={i}
            className="bg-[#132030] rounded-xl p-6 flex items-start gap-4 hover:bg-[#182a3f] transition"
          >
            {benefit.icon}
            <div className="text-left">
              <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
              <p className="text-gray-300 text-sm">{benefit.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VipBenefits;
