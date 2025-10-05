'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

export const TopAuthNav: React.FC<{ sidebarWidth: number }> = ({ sidebarWidth }) => {
  const router = useRouter();

  return (

      <div className="bg-[#242735d8] flex items-center justify-between  rounded-xl">
        <div className="relative w-28 h-15 px-2">
          <Image src="/logo.png" alt="Logo" fill style={{ objectFit: "contain" }} priority />
        </div>
       
      </div>
   
  );
};
