import React from 'react';
import type { Promotion } from '@/app/mainsidebarroutes/promotions/page';

export default function PromotionCard({ promo }: { promo: Promotion }) {
   const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };
  return (
    <div className="bg-[#101b22dd] rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="w-80 h-40 bg-[#48667e33]">
        <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h2 className="text-base font-semibold">{promo.title}</h2>
        <p className="text-gray-300 text-sm mt-2 line-clamp-2">{promo.description}</p>
        <div className="mt-3 pt-2 border-t border-[#2a3f52]">
          <p className="text-gray-400 text-xs">
            Ends at
          </p>
          <p className="text-white text-sm font-semibold mt-1">
            {formatDate(promo.endsAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
