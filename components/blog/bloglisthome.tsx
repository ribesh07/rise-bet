
import React from 'react';
import type { Blog } from '@/app/homesidebarroutes/blog/page';
import BlogCard from './blogcardhome';

export default function BlogList({ Blogs }: { Blogs: Blog[] }) {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {Blogs.length > 0 ? (
        Blogs.map((promo, idx) => <BlogCard key={idx} promo={promo} />)
      ) : (
        <p className="text-gray-400 text-center col-span-full py-10">
          No Blogs available in this category.
        </p>
      )}
    </div>
  );
}
