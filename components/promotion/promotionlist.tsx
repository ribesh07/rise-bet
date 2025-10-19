
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
