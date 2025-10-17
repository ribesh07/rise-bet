
"use client";
import React, { useRef, useEffect, useState } from "react";
import { CheckCircle, Star, Diamond } from "lucide-react"; // ✅ added Diamond icon

const vipTiers = [
  {
    name: "Bronze",
    color: "text-amber-500",
    badgeColor: "bg-amber-600 text-white",
    amount: "$10k",
    range: "Wager amount",
    checkColor: "text-amber-400",
    benefits: ["Monthly bonuses", "Level Up bonuses", "Rakeback", "Weekly bonuses"],
  },
  {
    name: "Silver",
    color: "text-gray-300",
    badgeColor: "bg-gray-400 text-black",
    amount: "$50k",
    range: "Wager amount",
    checkColor: "text-gray-300",
    benefits: [
      "Monthly bonuses",
      "Level Up bonuses",
      "Rakeback",
      "Weekly bonuses",
      "Bonus growth",
    ],
  },
  {
    name: "Gold",
    color: "text-yellow-400",
    badgeColor: "bg-yellow-400 text-black",
    amount: "$100k",
    range: "Wager amount",
    checkColor: "text-yellow-400",
    benefits: [
      "Monthly bonuses",
      "Level Up bonuses",
      "Rakeback",
      "Weekly bonuses",
      "Bonus growth",
    ],
  },
  {
    name: "Platinum I-III",
    color: "text-cyan-400",
    badgeColor: "bg-cyan-500 text-white",
    amount: "$250k - $1M",
    range: "Wager amount",
    checkColor: "text-cyan-400",
    benefits: [
      "Monthly bonuses",
      "Level Up bonuses",
      "Rakeback",
      "Weekly bonuses",
      "Bonus growth",
      "Daily bonuses / Reload",
    ],
  },
  {
    name: "Platinum IV-VI",
    color: "text-cyan-400",
    badgeColor: "bg-cyan-500 text-white",
    amount: "$2.5M - $10M",
    range: "Wager amount",
    checkColor: "text-cyan-400",
    benefits: [
      "Bonus from VIP host in currency of your choice",
      "Weekly & Monthly bonuses",
      "Renewable Reloads",
      "Level Up bonuses",
      "Rakeback",
      "Dedicated VIP host",
    ],
  },
  {
    name: "Diamond I-V",
    color: "text-sky-400",
    badgeColor: "bg-sky-500 text-white",
    amount: "$25M",
    range: "Wager amount",
    checkColor: "text-sky-400",
    benefits: [
      "Bonus from VIP host in currency of your choice",
      "Weekly & Monthly bonuses",
      "Renewable Reloads",
      "Level Up bonuses",
      "Rakeback",
      "Dedicated VIP host",
    ],
  },
];

const VipLevels = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineWidth, setLineWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      setLineWidth(container.scrollWidth - 60);
    }
  }, []);

  return (
    <section className="py-20 px-4 text-center relative bg-[#0c1a26] overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-12 text-white">
        Rsise VIP Ranking System
      </h2>

      <div className="relative w-full overflow-x-auto pb-12 scrollbar-hide">
        <div
          ref={containerRef}
          className="relative flex items-start justify-start px-8 gap-8 w-max"
        >
          <div
            className="absolute top-[26px] left-[30px] h-[2px] bg-[#223345] z-0"
            style={{ width: `${lineWidth}px` }}
          />

          {vipTiers.map((tier, i) => (
            <div key={i} className="flex flex-col items-start relative z-10">
              {/* Star / Diamond (with glow for special tiers) */}
              <div className="flex items-center justify-start w-full mb-6 relative">
                <div
                  className={`relative bg-[#132230] rounded-full w-12 h-12 flex items-center justify-center shadow-md mr-3 z-10 ${
                    tier.name.includes("Platinum") || tier.name.includes("Diamond")
                      ? "shadow-cyan-400/60"
                      : ""
                  }`}
                >
                  {tier.name === "Platinum I-III" ? (
                    <>
                      <Star className="w-6 h-6 text-cyan-400 fill-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                      <span className="absolute text-[10px] font-bold text-black">I</span>
                    </>
                  ) : tier.name === "Platinum IV-VI" ? (
                    <>
                      <Star className="w-6 h-6 text-cyan-400 fill-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                      <span className="absolute text-[10px] font-bold text-black">IV</span>
                    </>
                  ) : tier.name === "Diamond I-V" ? (
                    <Diamond className="w-6 h-6 text-sky-400 fill-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                  ) : (
                    <Star className={`w-6 h-6 ${tier.color}`} />
                  )}
                </div>
              </div>

              {/* VIP Card */}
              <div className="flex-shrink-0 bg-[#132230] rounded-2xl p-6 text-left w-[260px] h-[340px] flex flex-col justify-between transition hover:-translate-y-1 hover:bg-[#16293d]">
                <div>
                  <span
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded-md ${tier.badgeColor}`}
                  >
                    {tier.name}
                  </span>

                  <h3 className="text-3xl font-bold mt-5 text-white">
                    {tier.amount}
                  </h3>
                  <p className="text-gray-400 text-sm mb-5">{tier.range}</p>

                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className={`w-5 h-5 ${tier.checkColor}`} />
                        <span className="text-sm text-gray-200">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VipLevels;
