
// // // "use client";

// // // import Link from "next/link";
// // // import React, { useEffect, useState } from "react";
// // // import {
// // //   Home,
// // //   Trophy,
// // //   Gift,
// // //   Users,
// // //   Crown,
// // //   BookOpen,
// // //   MessageSquare,
// // //   HeartHandshake,
// // //   LifeBuoy,
// // //   Globe,
// // //   Menu,
// // //   X,
// // // } from "lucide-react";
// // // import ComingSoonModal from "@/components/sports/ComingSoonModal";

// // // interface SidebarProps {
// // //   collapsed: boolean;
// // //   setCollapsed: (value: boolean) => void;
// // //   open: boolean;
// // //   setOpen: (value: boolean) => void;
// // // }

// // // export const Sidebar: React.FC<SidebarProps> = ({
// // //   collapsed,
// // //   setCollapsed,
// // //   open,
// // //   setOpen,
// // // }) => {
// // //   const [showComingSoon, setShowComingSoon] = useState(false);

// // //   // ✅ Handle window resize for responsive sidebar
// // //   useEffect(() => {
// // //     const handleResize = () => {
// // //       if (window.innerWidth >= 768) {
// // //         setOpen(true); // keep sidebar open on desktop
// // //       }
// // //     };
// // //     window.addEventListener("resize", handleResize);
// // //     return () => window.removeEventListener("resize", handleResize);
// // //   }, [setOpen]);

// // //   return (
// // //     <>
// // //       {/* Sidebar */}
// // //       <aside
// // //         className={`fixed md:static top-0 left-0 h-full bg-[#101620]/90 backdrop-blur-md flex flex-col z-50 transition-all duration-300 ease-in-out
// // //         ${collapsed ? "w-20" : "w-50"} 
// // //         ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
// // //       >
// // //         {/* Toggle Button */}
// // //         <div className="mr-3 flex justify-end px-2 mb-3">
// // //           <button
// // //             className="p-2 rounded-md hover:bg-gray-700 transition-colors"
// // //             onClick={() => {
// // //               if (window.innerWidth < 768) {
// // //                 // Mobile behavior — close sidebar
// // //                 setOpen(!open);
// // //               } else {
// // //                 // Desktop behavior — toggle collapse
// // //                 setCollapsed(!collapsed);
// // //               }
// // //             }}
// // //           >
// // //             {collapsed ? <Menu size={28} /> : <X size={24} />}
// // //           </button>
// // //         </div>

// // //         {/* Sidebar Nav */}
// // //         <nav className="flex flex-col gap-2 text-gray-300 relative">
// // //           <SidebarItem
// // //             icon={<Home size={28} />}
// // //             label="Casino"
// // //             route="/casino"
// // //             active
// // //             collapsed={collapsed}
// // //           />
// // //           <SidebarItem
// // //             icon={<Trophy size={28} />}
// // //             label="Sports"
// // //             route="/sports"
// // //             comingSoon
// // //             collapsed={collapsed}
// // //             onComingSoon={() => setShowComingSoon(true)}
// // //           />
// // //           <SidebarItem
// // //             icon={<Gift size={28} />}
// // //             label="Promotions"
// // //             route="/homesidebarroutes/promotions"
// // //             collapsed={collapsed}
// // //           />
// // //           <SidebarItem
// // //             icon={<Users size={28} />}
// // //             label="Affiliate"
// // //             route="/homesidebarroutes/affiliates"
// // //             collapsed={collapsed}
// // //           />
// // //           <SidebarItem
// // //             icon={<Crown size={28} />}
// // //             label="VIP Club"
// // //             route="/homesidebarroutes/vipsidebar"
// // //             collapsed={collapsed}
// // //           />
// // //           <SidebarItem
// // //             icon={<BookOpen size={28} />}
// // //             label="Blog"
// // //             route="/homesidebarroutes/blog"
// // //             collapsed={collapsed}
// // //           />
// // //           <SidebarItem
// // //             icon={<MessageSquare size={28} />}
// // //             label="Forum"
// // //             route="/homesidebarroutes/forum"
// // //             collapsed={collapsed}
// // //           />
// // //           <SidebarItem
// // //             icon={<HeartHandshake size={28} />}
// // //             label="Responsible Gambling"
// // //             route="/homesidebarroutes/responsiblegambling"
// // //             collapsed={collapsed}
// // //           />
// // //           <SidebarItem
// // //             icon={<LifeBuoy size={28} />}
// // //             label="Live Support"
// // //             route="/homesidebarroutes/live-support"
// // //             collapsed={collapsed}
// // //           />
// // //           <SidebarItem
// // //             icon={<Globe size={28} />}
// // //             label="Language: English"
// // //             route="/homesidebarroutes/language/english"
// // //             collapsed={collapsed}
// // //           />
// // //         </nav>
// // //       </aside>

// // //       {/* ✅ Modal rendered OUTSIDE sidebar */}
// // //       <ComingSoonModal
// // //         open={showComingSoon}
// // //         onClose={() => setShowComingSoon(false)}
// // //       />
// // //     </>
// // //   );
// // // };

// // // // Sidebar Item Component
// // // interface SidebarItemProps {
// // //   icon: React.ReactNode;
// // //   label: string;
// // //   route: string;
// // //   active?: boolean;
// // //   collapsed?: boolean;
// // //   comingSoon?: boolean;
// // //   onComingSoon?: () => void;
// // // }

// // // const SidebarItem: React.FC<SidebarItemProps> = ({
// // //   icon,
// // //   label,
// // //   route,
// // //   active,
// // //   collapsed,
// // //   comingSoon = false,
// // //   onComingSoon,
// // // }) => {
// // //   const handleClick = (e: React.MouseEvent) => {
// // //     if (comingSoon) {
// // //       e.preventDefault();
// // //       onComingSoon?.();
// // //     }
// // //   };

// // //   return (
// // //     <Link href={comingSoon ? "#" : route} onClick={handleClick}>
// // //       <div
// // //         className={`flex items-center gap-2 px-2 py-3 rounded-md cursor-pointer transition-colors duration-200
// // //           ${active ? "bg-[#243249] text-white" : "hover:bg-[#1a2233]"} 
// // //           ${collapsed ? "justify-center" : "justify-start"}`}
// // //       >
// // //         {icon}
// // //         {!collapsed && <span className="text-sm">{label}</span>}
// // //       </div>
// // //     </Link>
// // //   );
// // // };

// // // // ✅ Page Layout (handles sidebar + main content spacing)
// // // const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
// // //   const [collapsed, setCollapsed] = useState(false);
// // //   const [open, setOpen] = useState(true);

// // //   return (
// // //     <div className="flex min-h-screen bg-[#0B0F17] text-white">
// // //       <Sidebar
// // //         collapsed={collapsed}
// // //         setCollapsed={setCollapsed}
// // //         open={open}
// // //         setOpen={setOpen}
// // //       />

// // //       {/* ✅ Adjust main content margin to match sidebar width */}
// // //       <main
// // //         className={`
// // //           flex-1 transition-all duration-300
// // //           ${open ? (collapsed ? "ml-20" : "ml-56") : "ml-0 md:ml-20"}
// // //           p-4
// // //         `}
// // //       >
// // //         {children}
// // //       </main>
// // //     </div>
// // //   );
// // // };

// // // export default Layout;
// // "use client";

// // import Link from "next/link";
// // import React, { useEffect, useState } from "react";
// // import {
// //   Gift,
// //   Users,
// //   Crown,
// //   BookOpen,
// //   MessageSquare,
// //   HeartHandshake,
// //   LifeBuoy,
// //   Globe,
// //   ChevronDown,
// //   ChevronUp,
// //   Menu,
// //   X,
// //   Layout,
// // } from "lucide-react";

// // import ComingSoonModal from "@/components/sports/ComingSoonModal";

// // interface SidebarProps {
// //   collapsed: boolean;
// //   setCollapsed: (value: boolean) => void;
// //   open: boolean;
// //   setOpen: (value: boolean) => void;
// // }

// // export const Sidebar: React.FC<SidebarProps> = ({
// //   collapsed,
// //   setCollapsed,
// //   open,
// //   setOpen,
// // }) => {
// //   const [showComingSoon, setShowComingSoon] = useState(false);
// //   const [openDropdown, setOpenDropdown] = useState<string | null>(null);

// //   // Handle resize for desktop vs mobile
// //   useEffect(() => {
// //     const handleResize = () => {
// //       if (window.innerWidth >= 768) setOpen(true);
// //     };
// //     window.addEventListener("resize", handleResize);
// //     return () => window.removeEventListener("resize", handleResize);
// //   }, [setOpen]);

// //   const toggleDropdown = (menu: string) => {
// //     setOpenDropdown(openDropdown === menu ? null : menu);
// //   };

// //   return (
// //     <>
// //       <aside
// //         className={`fixed md:static top-0 left-0 h-full bg-[#101620] text-gray-300 flex flex-col z-50 transition-all duration-300 ease-in-out
// //         ${collapsed ? "w-20" : "w-64"} 
// //         ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
// //       >
// //         {/* Toggle Button */}
// //         <div className="flex justify-end px-3 py-3">
// //           <button
// //             className="p-2 rounded-md hover:bg-[#1b2330] transition-colors"
// //             onClick={() => {
// //               if (window.innerWidth < 768) {
// //                 setOpen(!open);
// //               } else {
// //                 setCollapsed(!collapsed);
// //               }
// //             }}
// //           >
// //             {collapsed ? <Menu size={22} /> : <X size={22} />}
// //           </button>
// //         </div>

// //         {/* Navigation */}
// //         <nav className="flex flex-col text-[15px] gap-1 px-2 overflow-y-auto">
// //           {/* Promotions (Dropdown) */}
// //           <SidebarDropdown
// //             label="Promotions"
// //             icon={<Gift size={20} />}
// //             collapsed={collapsed}
// //             open={openDropdown === "promotions"}
// //             onToggle={() => toggleDropdown("promotions")}
// //             items={[
// //               { label: "Casino Bonuses", route: "#" },
// //               { label: "Sports Offers", route: "#" },
// //             ]}
// //           />

// //           <SidebarItem
// //             icon={<Users size={20} />}
// //             label="Affiliate"
// //             route="/homesidebarroutes/affiliates"
// //             collapsed={collapsed}
// //           />
// //           <SidebarItem
// //             icon={<Crown size={20} />}
// //             label="VIP Club"
// //             route="/homesidebarroutes/vipsidebar"
// //             collapsed={collapsed}
// //           />
// //           <SidebarItem
// //             icon={<BookOpen size={20} />}
// //             label="Blog"
// //             route="/homesidebarroutes/blog"
// //             collapsed={collapsed}
// //           />
// //           <SidebarItem
// //             icon={<MessageSquare size={20} />}
// //             label="Forum"
// //             route="/homesidebarroutes/forum"
// //             collapsed={collapsed}
// //           />

// //           <hr className="border-[#1f2837] my-2" />

// //           {/* Sponsorships Dropdown */}
// //           <SidebarDropdown
// //             label="Sponsorships"
// //             icon={<HeartHandshake size={20} />}
// //             collapsed={collapsed}
// //             open={openDropdown === "sponsorships"}
// //             onToggle={() => toggleDropdown("sponsorships")}
// //             items={[
// //               { label: "Teams", route: "#" },
// //               { label: "Events", route: "#" },
// //             ]}
// //           />

// //           <SidebarItem
// //             icon={<HeartHandshake size={20} />}
// //             label="Responsible Gambling"
// //             route="/homesidebarroutes/responsiblegambling"
// //             collapsed={collapsed}
// //           />
// //           <SidebarItem
// //             icon={<LifeBuoy size={20} />}
// //             label="Live Support"
// //             route="/homesidebarroutes/live-support"
// //             collapsed={collapsed}
// //           />

// //           {/* Language Dropdown */}
// //           <SidebarDropdown
// //             label="Language: English"
// //             icon={<Globe size={20} />}
// //             collapsed={collapsed}
// //             open={openDropdown === "language"}
// //             onToggle={() => toggleDropdown("language")}
// //             items={[
// //               { label: "English", route: "#" },
// //               { label: "हिन्दी", route: "#" },
// //               { label: "नेपाली", route: "#" },
// //             ]}
// //           />
// //         </nav>
// //       </aside>

// //       <ComingSoonModal
// //         open={showComingSoon}
// //         onClose={() => setShowComingSoon(false)}
// //       />
// //     </>
// //   );
// // };

// // interface SidebarItemProps {
// //   icon: React.ReactNode;
// //   label: string;
// //   route: string;
// //   collapsed?: boolean;
// // }

// // const SidebarItem: React.FC<SidebarItemProps> = ({
// //   icon,
// //   label,
// //   route,
// //   collapsed,
// // }) => {
// //   return (
// //     <Link href={route}>
// //       <div
// //         className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors 
// //         ${collapsed ? "justify-center" : "justify-start"} 
// //         hover:bg-[#1a2233]`}
// //       >
// //         {icon}
// //         {!collapsed && <span className="text-gray-200">{label}</span>}
// //       </div>
// //     </Link>
// //   );
// // };

// // interface SidebarDropdownProps {
// //   label: string;
// //   icon: React.ReactNode;
// //   collapsed?: boolean;
// //   open: boolean;
// //   onToggle: () => void;
// //   items: { label: string; route: string }[];
// // }

// // const SidebarDropdown: React.FC<SidebarDropdownProps> = ({
// //   label,
// //   icon,
// //   collapsed,
// //   open,
// //   onToggle,
// //   items,
// // }) => {
// //   return (
// //     <div>
// //       <div
// //         onClick={onToggle}
// //         className={`flex items-center justify-between gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-[#1a2233]`}
// //       >
// //         <div className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}>
// //           {icon}
// //           {!collapsed && <span className="text-gray-200">{label}</span>}
// //         </div>
// //         {!collapsed &&
// //           (open ? (
// //             <ChevronUp size={18} className="text-gray-400" />
// //           ) : (
// //             <ChevronDown size={18} className="text-gray-400" />
// //           ))}
// //       </div>

// //       {!collapsed && open && (
// //         <div className="pl-10 flex flex-col text-sm text-gray-400">
// //           {items.map((item, index) => (
// //             <Link
// //               key={index}
// //               href={item.route}
// //               className="py-1 hover:text-white transition-colors"
// //             >
// //               {item.label}
// //             </Link>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };
// // export default Layout;
// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import {
//   Gift,
//   Users,
//   Crown,
//   BookOpen,
//   MessageSquare,
//   HeartHandshake,
//   LifeBuoy,
//   Globe,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react";

// const Sidebar = () => {
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);

//   const toggleDropdown = (key: string) => {
//     setOpenDropdown(openDropdown === key ? null : key);
//   };

//   return (
//     <div className="bg-[#0B0F17] min-h-screen flex flex-col items-center py-6 px-3 text-gray-200">
//       {/* Tabs (Casino / Sports) */}
//       <div className="flex w-full justify-center gap-2 mb-6">
//         <button className="bg-[#1b2330] px-5 py-2 rounded-md text-white font-medium hover:bg-[#243249] transition">
//           Casino
//         </button>
//         <button className="bg-[#1b2330] px-5 py-2 rounded-md text-white font-medium hover:bg-[#243249] transition">
//           Sports
//         </button>
//       </div>

//       {/* Sidebar Menu Box */}
//       <div className="bg-[#101620] w-full rounded-xl p-3 flex flex-col gap-1 shadow-lg">
//         {/* Promotions Dropdown */}
//         <DropdownItem
//           icon={<Gift size={20} />}
//           label="Promotions"
//           open={openDropdown === "promotions"}
//           onClick={() => toggleDropdown("promotions")}
//           items={[
//             { label: "Casino Offers", route: "#" },
//             { label: "Sports Bonuses", route: "#" },
//           ]}
//         />

//         <SidebarItem icon={<Users size={20} />} label="Affiliate" route="#" />
//         <SidebarItem icon={<Crown size={20} />} label="VIP Club" route="#" />
//         <SidebarItem icon={<BookOpen size={20} />} label="Blog" route="#" />
//         <SidebarItem icon={<MessageSquare size={20} />} label="Forum" route="#" />

//         <hr className="border-[#1f2837] my-2" />

//         <DropdownItem
//           icon={<HeartHandshake size={20} />}
//           label="Sponsorships"
//           open={openDropdown === "sponsorships"}
//           onClick={() => toggleDropdown("sponsorships")}
//           items={[
//             { label: "Teams", route: "#" },
//             { label: "Events", route: "#" },
//           ]}
//         />

//         <SidebarItem
//           icon={<HeartHandshake size={20} />}
//           label="Responsible Gambling"
//           route="#"
//         />
//         <SidebarItem icon={<LifeBuoy size={20} />} label="Live Support" route="#" />

//         <DropdownItem
//           icon={<Globe size={20} />}
//           label="Language: English"
//           open={openDropdown === "language"}
//           onClick={() => toggleDropdown("language")}
//           items={[
//             { label: "English", route: "#" },
//             { label: "हिन्दी", route: "#" },
//             { label: "नेपाली", route: "#" },
//           ]}
//         />
//       </div>
//     </div>
//   );
// };

// // Simple Sidebar Item
// const SidebarItem = ({
//   icon,
//   label,
//   route,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   route: string;
// }) => (
//   <Link href={route}>
//     <div className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-[#1a2233] transition">
//       {icon}
//       <span className="text-[15px]">{label}</span>
//     </div>
//   </Link>
// );

// // Dropdown Item
// const DropdownItem = ({
//   icon,
//   label,
//   open,
//   onClick,
//   items,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   open: boolean;
//   onClick: () => void;
//   items: { label: string; route: string }[];
// }) => (
//   <div>
//     <div
//       onClick={onClick}
//       className="flex justify-between items-center px-3 py-2 rounded-md cursor-pointer hover:bg-[#1a2233] transition"
//     >
//       <div className="flex items-center gap-3">
//         {icon}
//         <span className="text-[15px]">{label}</span>
//       </div>
//       {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//     </div>

//     {open && (
//       <div className="pl-10 flex flex-col gap-1 text-gray-400 text-[14px]">
//         {items.map((item, index) => (
//           <Link
//             key={index}
//             href={item.route}
//             className="py-1 hover:text-white transition"
//           >
//             {item.label}
//           </Link>
//         ))}
//       </div>
//     )}
//   </div>
// );

// export default Sidebar;
'use client';
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StakeWalletUI() {
  return (
    <div className="flex items-center gap-2 bg-gradient-to-br from-[#1a1f2e] to-[#0f1421] px-3 py-2 rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.4)] hover:shadow-[0_0_15px_rgba(48,123,255,0.3)] transition-all duration-300 border border-[#2b364d]">
      {/* Balance */}
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">
          Balance
        </span>
        <span className="text-sm font-semibold text-white font-mono">
          0.000000
        </span>
      </div>

      {/* Divider line */}
      <div className="h-6 w-[1px] bg-[#2f3c56] mx-2" />

      {/* Wallet icon */}
      <div className="p-2 bg-[#1b2332] rounded-xl hover:bg-[#243249] transition-colors">
        <Wallet size={22} className="text-gray-200" />
      </div>

      {/* Wallet button */}
      <Button
        variant="default"
        className="hidden md:inline bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#3b82f6] hover:to-[#60a5fa] text-white px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-[0_0_10px_rgba(37,99,235,0.5)]"
      >
        Wallet
      </Button>
    </div>
  );
}
