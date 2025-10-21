
import React from "react";

interface Props {
  categories: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function CategoryTabs({ categories, activeTab, setActiveTab }: Props) {
  return (
    <div className="flex items-center gap-4 bg-[#102131] px-4 py-3 rounded-full mt-3 mb-3 w-fit">
      {categories.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`text-[15px] font-semibold px-6 py-2 rounded-full transition-all duration-200 ${
            activeTab === tab
              ? "bg-[#25374A] text-white shadow-inner"
              : "text-[#AEB8C4] hover:text-white"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
