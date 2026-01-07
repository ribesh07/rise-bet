import React from 'react';
import type { Blog } from '@/app/mainsidebarroutes/blog/page';

export default function BlogCard({ promo }: { promo: Blog }) {
  return (
    <div className="bg-[#152642] rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="w-full h-40 bg-[#0E192D]">
        <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h2 className="text-base font-semibold">{promo.title}</h2>
        <p className="text-gray-300 text-sm mt-2 line-clamp-2">{promo.description}</p>
        <p className="text-xs text-gray-400 mt-3">
          Date <span className="font-medium text-gray-200">{promo.publishedAt}</span>
        </p>
      </div>
    </div>
  );
}
