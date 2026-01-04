
import React from 'react';
import type { Promotion } from '@/app/mainsidebarroutes/promotions/page';
import PromotionCard from './promotioncard';

export default function PromotionList({ promotions }: { promotions: Promotion[] }) {
  return (
   <div className="max-w-7xl mx-auto py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {promotions && promotions.length > 0 ? (
          promotions.map((promo, idx) => (
            <PromotionCard key={promo.id || idx} promo={promo} />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center py-16">
            <p className="text-gray-400 text-center text-lg">
              No promotions available in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
