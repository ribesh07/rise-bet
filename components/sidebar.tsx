
import Link from "next/link";
import React, { useEffect, useState } from "react";
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
import ComingSoonModal from "@/components/sports/ComingSoonModal";

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
  const [showComingSoon, setShowComingSoon] = useState(false);

  // ✅ Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(true); // keep sidebar open on desktop
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setOpen]);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full bg-[#101620]/90 backdrop-blur-md flex flex-col py-3 z-50 transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-56"} 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Toggle Button */}
        <div className="mr-3 flex justify-end px-2 mb-3">
          <button
            className="p-2 rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => {
              if (window.innerWidth < 768) {
                // Mobile behavior — close sidebar
                setOpen(!open);
              } else {
                // Desktop behavior — toggle collapse
                setCollapsed(!collapsed);
              }
            }}
          >
            {collapsed ? <Menu size={28} /> : <X size={24} />}
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex flex-col gap-2 text-gray-300 relative">
          <SidebarItem
            icon={<Home size={28} />}
            label="Casino"
            route="/casino"
            active
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Trophy size={28} />}
            label="Sports"
            route="/sports"
            comingSoon
            collapsed={collapsed}
            onComingSoon={() => setShowComingSoon(true)}
          />
          <SidebarItem
            icon={<Gift size={28} />}
            label="Promotions"
            route="/homesidebarroutes/promotions"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Users size={28} />}
            label="Affiliate"
            route="/homesidebarroutes/affiliates"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Crown size={28} />}
            label="VIP Club"
            route="/homesidebarroutes/vipsidebar"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<BookOpen size={28} />}
            label="Blog"
            route="/homesidebarroutes/blog"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<MessageSquare size={28} />}
            label="Forum"
            route="/homesidebarroutes/forum"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<HeartHandshake size={28} />}
            label="Responsible Gambling"
            route="/homesidebarroutes/responsiblegambling"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<LifeBuoy size={28} />}
            label="Live Support"
            route="/homesidebarroutes/live-support"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Globe size={28} />}
            label="Language: English"
            route="/homesidebarroutes/language/english"
            collapsed={collapsed}
          />
        </nav>
      </aside>

      {/* ✅ Modal rendered OUTSIDE sidebar */}
      <ComingSoonModal
        open={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  route: string;
  active?: boolean;
  collapsed?: boolean;
  comingSoon?: boolean;
  onComingSoon?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  route,
  active,
  collapsed,
  comingSoon = false,
  onComingSoon,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (comingSoon) {
      e.preventDefault();
      onComingSoon?.();
    }
  };

  return (
    <Link href={comingSoon ? "#" : route} onClick={handleClick}>
      <div
        className={`flex items-center gap-2 px-2 py-3 rounded-md cursor-pointer transition-colors duration-200
          ${active ? "bg-[#243249] text-white" : "hover:bg-[#1a2233]"} 
          ${collapsed ? "justify-center" : "justify-start"}`}
      >
        {icon}
        {!collapsed && <span className="text-sm">{label}</span>}
      </div>
    </Link>
  );
};
