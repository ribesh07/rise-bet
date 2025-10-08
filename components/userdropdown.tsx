
// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { useRouter } from "next/navigation";
// import UserVipCard from "@/components/form/vip";
// import {
//   Wallet,
//   Shield,
//   Trophy,
//   Users,
//   BarChart2,
//   Receipt,
//   ClipboardList,
//   Settings,
//   ShieldCheck,
//   Headphones,
//   LogOut,
//   User,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// const UserDropdown: React.FC = () => {
//   const [open, setOpen] = useState(false);
//   const [showVipForm, setShowVipForm] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   // prevent background scroll when modal open
//   useEffect(() => {
//     document.body.style.overflow = showVipForm ? "hidden" : "";
//   }, [showVipForm]);

//   const menuItems = [
//     { label: "Wallet", icon: Wallet },
//     { label: "Vault", icon: Shield },
//     { label: "VIP", icon: Trophy },
//     { label: "Affiliate", icon: Users },
//     { label: "Statistics", icon: BarChart2 },
//     { label: "Transactions", icon: Receipt },
//     { label: "My Bets", icon: ClipboardList },
//     { label: "Settings", icon: Settings },
//     { label: "Rise Smart", icon: ShieldCheck },
//     { label: "Live Support", icon: Headphones },
//     { label: "Logout", icon: LogOut, route: "/" },
//   ];

//   const handleClick = (item: typeof menuItems[number]) => {
//     if (item.label === "Logout") {
//       localStorage.removeItem("token");
//       router.push("/");
//     } else if (item.label === "VIP") {
//       setShowVipForm(true);
//     }
//     setOpen(false);
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* User icon */}
//       <User
//         size={25}
//         className="cursor-pointer text-gray-200 hover:text-white"
//         onClick={() => setOpen(!open)}
//       />

//       {/* Dropdown menu */}
//       {open && (
//         <div className="absolute right-0 mt-2 w-52 bg-[#1e293b] border border-gray-700 rounded-xl shadow-xl z-50 py-2">
//           {menuItems.map((item, idx) => (
//             <button
//               key={idx}
//               className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm text-gray-200 hover:bg-[#243249] transition-colors"
//               onClick={() => handleClick(item)}
//             >
//               <item.icon size={18} />
//               <span>{item.label}</span>
//             </button>
//           ))}
//         </div>
//       )}

//       {/* VIP Modal */}
//       {typeof window !== "undefined" &&
//         createPortal(
//           <AnimatePresence>
//             {showVipForm && (
//               <motion.div
//                 className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 onClick={(e) => {
//                   if (e.target === e.currentTarget) setShowVipForm(false);
//                 }}
//               >
//                 <UserVipCard onClose={() => setShowVipForm(false)} />
//               </motion.div>
//             )}
//           </AnimatePresence>,
//           document.body
//         )}
//     </div>
//   );
// };

// export default UserDropdown;
"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import UserVipCard from "@/components/form/vip";
import {
  Wallet,
  Shield,
  Trophy,
  Users,
  BarChart2,
  Receipt,
  ClipboardList,
  Settings,
  ShieldCheck,
  Headphones,
  LogOut,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UserDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showVipForm, setShowVipForm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Prevent background scroll when VIP modal is open
  useEffect(() => {
    document.body.style.overflow = showVipForm ? "hidden" : "";
  }, [showVipForm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const menuItems = [
    { label: "Wallet", icon: Wallet },
    { label: "Vault", icon: Shield },
    { label: "VIP", icon: Trophy },
    { label: "Affiliate", icon: Users },
    { label: "Statistics", icon: BarChart2 },
    { label: "Transactions", icon: Receipt },
    { label: "My Bets", icon: ClipboardList },
    { label: "Settings", icon: Settings },
    { label: "Rise Smart", icon: ShieldCheck },
    { label: "Live Support", icon: Headphones },
    { label: "Logout", icon: LogOut, route: "/" },
  ];

  const handleClick = (item: typeof menuItems[number]) => {
    if (item.label === "Logout") {
      localStorage.removeItem("token");
      router.push("/");
    } else if (item.label === "VIP") {
      setShowVipForm(true);
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User icon */}
      <User
        size={25}
        className="cursor-pointer text-gray-200 hover:text-white"
        onClick={() => setOpen(!open)}
      />

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-[#1e293b] border border-gray-700 rounded-xl shadow-xl z-50 py-2">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm text-gray-200 hover:bg-[#243249] transition-colors"
              onClick={() => handleClick(item)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* VIP Modal */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showVipForm && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowVipForm(false);
                }}
              >
                <UserVipCard onClose={() => setShowVipForm(false)} />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};

export default UserDropdown;
