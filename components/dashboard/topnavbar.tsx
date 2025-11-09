
// 'use client';
// import Image from 'next/image';
// import React, { useEffect, useState } from 'react';

// export const TopNavbar: React.FC<{ sidebarWidth: number }> = ({ sidebarWidth }) => {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handleAuthClick = (type: 'login' | 'register') => {
//     // ✅ Dispatch global event to open modal (Dashboard listens)
//     window.dispatchEvent(new CustomEvent('openAuthModal', { detail: type }));
//   };

//   return (
//     <>
//       <header className="relative
        
//         top-0 
//         z-[20] 
//         flex justify-between items-center 
//         px-3 md:px-4 py-2 
        
//         bg-[#101b22dd] 
//         backdrop-blur-md">
//         <div className="flex items-center justify-between w-full">
//           <div className="relative w-28 h-10 px-2">
//             <Image
//               src="/logo.png"
//               alt="Logo"
//               fill
//               style={{ objectFit: 'contain' }}
//               priority
//             />
//           </div>
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => handleAuthClick('register')}
//               className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl px-6 py-2 rounded-lg text-white font-medium transition-all duration-300"
//             >
//               Register
//             </button>
//             <button
//               onClick={() => handleAuthClick('login')}
//               className="text-slate-400 hover:text-white transition-colors duration-300"
//             >
//               Login
//             </button>
//           </div>
//         </div>
//       </header>
//     </>
//   );
// };

// export default TopNavbar;
'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

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
      <div className="relative w-30 h-15 px-2">
        <Image
          src="/logo.png"
          alt="Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      {/* Login / Register */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleAuthClick('register')}
          className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl px-6 py-2 rounded-lg text-white font-medium transition-all duration-300"
        >
          Register
        </button>

        <button
          onClick={() => handleAuthClick('login')}
          className="text-slate-400 hover:text-white transition-colors duration-300"
        >
          Login
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
