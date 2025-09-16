// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { User, CreditCard, Gift, PieChart, ListChecks, Lock, Settings, HeartHandshakeIcon, HelpCircle, LogOut, Route } from "lucide-react";

// const UserDropdown: React.FC = () => {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const menuItems = [
//     { label: "Wallet Vault", icon: CreditCard },
//     { label: "VIP", icon: Gift },
//     { label: "Affiliate", icon: PieChart },
//     { label: "Statistics", icon: ListChecks },
//     { label: "Transaction", icon: CreditCard },
//     { label: "My Bets", icon: Lock },
//     { label: "Settings", icon: Settings },
//     { label: "Stake Smart", icon: HeartHandshakeIcon },
//     { label: "Live Support", icon: HelpCircle },
//     { label: "Logout", icon: LogOut, route: "../app/auth/login" },
//   ];

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <User size={25} className="cursor-pointer" onClick={() => setOpen(!open)} />
//       {open && (
//         <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-gray-700 rounded-lg shadow-lg z-50">
//           {menuItems.map((item, idx) => (
//             <button
//               key={idx}
//               className="flex items-center gap-2 px-4 py-2 w-full text-left text-sm hover:bg-[#243249] transition-colors"
//               onClick={() => console.log(item.label)}
//             >
//               <item.icon size={16} />
//               {item.label}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserDropdown;
"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  CreditCard,
  Gift,
  PieChart,
  ListChecks,
  Lock,
  Settings,
  HeartHandshakeIcon,
  HelpCircle,
  LogOut,
} from "lucide-react";

const UserDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "Wallet Vault", icon: CreditCard },
    { label: "VIP", icon: Gift },
    { label: "Affiliate", icon: PieChart },
    { label: "Statistics", icon: ListChecks },
    { label: "Transaction", icon: CreditCard },
    { label: "My Bets", icon: Lock },
    { label: "Settings", icon: Settings },
    { label: "Stake Smart", icon: HeartHandshakeIcon },
    { label: "Live Support", icon: HelpCircle },
    { label: "Logout", icon: LogOut, route: "/" }, // absolute path
  ];

  const handleClick = (item: typeof menuItems[number]) => {
    if (item.label === "Logout") {
      // Clear auth tokens or session data here
      localStorage.removeItem("token"); // example
      // You can also clear cookies or other storage if used
    }

    if (item.route) {
      router.push(item.route); // Navigate to route
    } else {
      console.log(item.label);
    }

    setOpen(false); // close dropdown
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <User size={25} className="cursor-pointer" onClick={() => setOpen(!open)} />
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-gray-700 rounded-lg shadow-lg z-50">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              className="flex items-center gap-2 px-4 py-2 w-full text-left text-sm hover:bg-[#243249] transition-colors"
              onClick={() => handleClick(item)}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
