// import React from 'react';

// interface Props {
//   categories: string[];
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
// }

// export default function CategoryTabs({ categories, activeTab, setActiveTab }: Props) {
//   return (
//     <div className="flex flex-wrap gap-3 mb-8 mt-10">
//       {categories.map((tab) => (
//         <button
//           key={tab}
//           onClick={() => setActiveTab(tab)}
//           className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
//             activeTab === tab
//               ? 'bg-gradient-to-r from-[#00C9A7] to-[#0057FF] text-white shadow-lg'
//               : 'bg-[#121F38] border border-[#1f3358] text-gray-300 hover:bg-[#1b2d4f]'
//           }`}
//         >
//           {tab}
//         </button>
//       ))}
//     </div>
//   );
// }
import React from 'react';

interface Props {
  categories: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function CategoryTabs({ categories, activeTab, setActiveTab }: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-8 mt-10">
      {categories.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            activeTab === tab
              ? 'bg-gradient-to-r from-[#00C9A7] to-[#0057FF] text-white shadow-lg'
              : 'bg-[#121F38] border border-[#1f3358] text-gray-300 hover:bg-[#1b2d4f]'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
