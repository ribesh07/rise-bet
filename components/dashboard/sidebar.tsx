
'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Trophy,
  Gift,
  Users,
  Crown,
  BookOpen,
  MessageSquare,
  HeartHandshake,
  LifeBuoy,
  Globe,
  Menu,
  X,
} from "lucide-react";
import ComingSoonModal from "@/components/sports/ComingSoonModal"; // 👈 make sure this path matches your folder

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  open,
  setOpen,
}) => {
  const router = useRouter();
  const [showComingSoon, setShowComingSoon] = useState(false); // 👈 modal control

  const menuItems = [
    { icon: <Home size={28} />, label: "Casino", route: "/" },
    { icon: <Trophy size={28} />, label: "Sports", route: "/sports", comingSoon: true }, // 👈 trigger modal
    { icon: <Gift size={28} />, label: "Promotions", route: "/promotions" },
    { icon: <Users size={28} />, label: "Affiliate", route: "/mainsidebarroutes/affiliates" },
    { icon: <Crown size={28} />, label: "VIP Club", route: "/mainsidebarroutes/vipsidebar" },
    { icon: <BookOpen size={28} />, label: "Blog", route: "/blog" },
    { icon: <MessageSquare size={28} />, label: "Forum", route: "/forum" },
    { icon: <HeartHandshake size={28} />, label: "Responsible Gambling", route: "/responsible-gambling" },
    { icon: <LifeBuoy size={28} />, label: "Live Support", route: "/live-support" },
    { icon: <Globe size={28} />, label: "Language: English", route: "/language" },
  ];

  return (
    <>
      <aside
        className={`fixed md:static top-0 left-0 h-full bg-[#101620db] flex flex-col py-3 z-50 transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-56"} 
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Toggle Button */}
        <div className="mr-3 flex justify-end px-2 mb-3">
          <button
            className="p-2 rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Menu size={28} /> : <X size={24} />}
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex flex-col gap-2 text-gray-300 relative">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
              onClick={() => {
                if (item.comingSoon) {
                  setShowComingSoon(true); // 👈 open modal for Sports
                } else {
                  router.push(item.route);
                }
              }}
            />
          ))}
        </nav>
      </aside>

      {/* Coming Soon Modal */}
      <ComingSoonModal open={showComingSoon} onClose={() => setShowComingSoon(false)} />
    </>
  );
};

/* Sidebar Item */
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active,
  collapsed,
  onClick,
}) => (
  <div className="relative group">
    <div
      onClick={onClick}
      className={`flex items-center gap-2 px-2 py-3 rounded-md cursor-pointer hover:bg-[#243249] transition-colors
        ${active ? "bg-[#243249] text-white" : ""} 
        ${collapsed ? "justify-center" : "justify-start"}`}
    >
      {icon}
      {!collapsed && <span className="text-sm">{label}</span>}
    </div>

    {/* Tooltip when collapsed */}
    {collapsed && (
      <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
        {label}
      </span>
    )}
  </div>
);
