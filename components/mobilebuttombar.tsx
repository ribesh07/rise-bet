// "use client";
// import React from "react";
// import Link from "next/link";
// import { Home, Gamepad2, Wallet, User } from "lucide-react";

// const MobileBottomBar: React.FC = () => {
//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-[#1e293b] border-t border-gray-700 flex justify-around items-center py-2 sm:hidden z-50">
//       <Link href="/" className="flex flex-col items-center text-gray-300 hover:text-white">
//         <Home size={22} />
//         <span className="text-xs">Home</span>
//       </Link>

//       <Link href="#games" className="flex flex-col items-center text-gray-300 hover:text-white">
//         <Gamepad2 size={22} />
//         <span className="text-xs">Games</span>
//       </Link>

//       <Link href="/wallet" className="flex flex-col items-center text-gray-300 hover:text-white">
//         <Wallet size={22} />
//         <span className="text-xs">Wallet</span>
//       </Link>

//       <Link href="/profile" className="flex flex-col items-center text-gray-300 hover:text-white">
//         <User size={22} />
//         <span className="text-xs">Profile</span>
//       </Link>
//     </div>
//   );
// };

// export default MobileBottomBar;
"use client";
import React from "react";
import Link from "next/link";
import { Home, Gamepad2, Wallet, User, Menu } from "lucide-react";

interface MobileBottomBarProps {
  onBrowseClick: () => void;
}

const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onBrowseClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1e293b] border-t border-gray-700 flex justify-around items-center py-2 sm:hidden z-50">
      
      {/* Browse (Opens Sidebar) */}
      <button
        onClick={onBrowseClick}
        className="flex flex-col items-center text-gray-300 hover:text-white"
      >
        <Menu size={22} />
        <span className="text-xs">Browse</span>
      </button>

      <Link href="/" className="flex flex-col items-center text-gray-300 hover:text-white">
        <Home size={22} />
        <span className="text-xs">Home</span>
      </Link>

      <Link href="#games" className="flex flex-col items-center text-gray-300 hover:text-white">
        <Gamepad2 size={22} />
        <span className="text-xs">Games</span>
      </Link>

      <Link href="/wallet" className="flex flex-col items-center text-gray-300 hover:text-white">
        <Wallet size={22} />
        <span className="text-xs">Wallet</span>
      </Link>

      <Link href="/profile" className="flex flex-col items-center text-gray-300 hover:text-white">
        <User size={22} />
        <span className="text-xs">Profile</span>
      </Link>
    </div>
  );
};

export default MobileBottomBar;
