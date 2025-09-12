"use client";

import { useState } from "react";

const tabs = ["Casino", "Sports", "Live Casino", "Slots"];

export default function NavTabs() {
  const [active, setActive] = useState("Casino");

  return (
    <div className="flex gap-4 mb-4 border-b border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`pb-2 ${active === tab ? "text-[#00c2ff] border-b-2 border-[#00c2ff]" : "text-gray-400"}`}
          onClick={() => setActive(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
