// import React from 'react';
// import type { Promotion } from './page';

// export default function PromotionList({ promotions }: { promotions: Promotion[] }) {
//   return (
//     <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
//       {promotions.length > 0 ? (
//         promotions.map((promo, idx) => (
//           <div
//             key={idx}
//             className="bg-[#152642] rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
//           >
//             <div className="w-full h-40 bg-[#0E192D]">
//               <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
//             </div>
//             <div className="p-4">
//               <h2 className="text-base font-semibold">{promo.title}</h2>
//               <p className="text-gray-300 text-sm mt-2 line-clamp-2">{promo.description}</p>
//               <p className="text-xs text-gray-400 mt-3">
//                 Ends at <span className="font-medium text-gray-200">{promo.ends}</span>
//               </p>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-400 text-center col-span-full py-10">
//           No promotions available in this category.
//         </p>
//       )}
//     </div>
//   );
// }
import React from 'react';
import type { Promotion } from '@/app/promotions/page';
import PromotionCard from './promotioncard';

export default function PromotionList({ promotions }: { promotions: Promotion[] }) {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {promotions.length > 0 ? (
        promotions.map((promo, idx) => <PromotionCard key={idx} promo={promo} />)
      ) : (
        <p className="text-gray-400 text-center col-span-full py-10">
          No promotions available in this category.
        </p>
      )}
    </div>
  );
}
