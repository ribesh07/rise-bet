
'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Link from "next/link";

interface TopNavbarProps {
  
}

const TopNavbar: React.FC<TopNavbarProps> = ({  }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAuthClick = (type: 'login' | 'register') => {
    window.dispatchEvent(new CustomEvent('openAuthModal', { detail: type }));
  };

  return (
    <header
      className="
        relative
        top-0
        z-[20]
        flex justify-between items-center
        px-3 md:px-4 py-2
        bg-[#101b22dd]
        backdrop-blur-md
      "
      
    >
      {/* Logo */}
      <div className="relative w-30 h-13 px-2">
        <Link href="/home" className="block">
        <Image
          src="/logo.png"
          alt="Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
         </Link>
      </div>

      {/* Login / Register */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleAuthClick('login')}
          className="bg-gray-600 hover:bg-gray-700 shadow-lg hover:shadow-xl px-6 py-2 rounded-lg text-white font-medium transition-all duration-300"
        >
          Login
        </button>
        <button
          onClick={() => handleAuthClick('register')}
          className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl px-6 py-2 rounded-lg text-white font-medium transition-all duration-300"
        >
          Register
        </button>

        
      </div>
    </header>
  );
};

export default TopNavbar;
