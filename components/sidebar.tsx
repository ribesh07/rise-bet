
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Gift,
  Users,
  Crown,
  BookOpen,
  MessageSquare,
  HeartHandshake,
  LifeBuoy,
  Globe,
  ChevronDown,
  ChevronUp,
  Menu,
  Gamepad2,
  Trophy,
} from "lucide-react";
import ComingSoonModal from "@/components/sports/ComingSoonModal";
import { useRouter, usePathname } from "next/navigation";

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
  const pathname = usePathname();

  const [showComingSoon, setShowComingSoon] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string>("home");

  // ✅ Sync active tab with current route
  useEffect(() => {
    if (pathname.startsWith("/home")) setActiveItem("home");
    if (pathname.includes("/promotions")) setActiveItem("promotions");
    if (pathname.includes("/affiliates")) setActiveItem("affiliate");
    if (pathname.includes("/vipsidebar")) setActiveItem("vip");
    if (pathname.includes("/blog")) setActiveItem("blog");
    if (pathname.includes("/responsiblegambling")) setActiveItem("gambling");
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setOpen]);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen bg-[#101b22dd] text-gray-300 flex flex-col z-50 transition-all duration-300 ease-in-out border-r border-[#1A2233]
        ${collapsed ? "w-[90px]" : "w-64"} 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] overflow-hidden`}
      >
        {/* ===== Top Section ===== */}
        <div
          className={`flex items-center ${
            collapsed ? "flex-col gap-3 py-4" : "gap-3 px-4 py-4"
          } bg-[#101b22dd] `}
        >
          {/* Menu Button */}
          <button
            className="p-2 rounded-md bg-[#0f1613] hover:bg-[#243249] transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu size={28} />
          </button>

          {/* Casino / Sports Buttons */}
          {!collapsed ? (
            <div className="flex gap-2">
              <SidebarTopButton
                active={activeItem === "home"}
                label="Casino"
                onClick={() => {
                  setActiveItem("home");
                  router.push("/home");
                }}
              />
              <SidebarTopButton
                active={activeItem === "sports"}
                label="Sports"
                onClick={() => {
                  setActiveItem("sports");
                  setShowComingSoon(true);
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <SidebarTopIcon
                active={activeItem === "home"}
                icon={<Gamepad2 size={28} />}
                onClick={() => {
                  setActiveItem("home");
                  router.push("/home");
                }}
              />
              <SidebarTopIcon
                active={activeItem === "sports"}
                icon={<Trophy size={28} />}
                onClick={() => {
                  setActiveItem("sports");
                  setShowComingSoon(true);
                }}
              />
            </div>
          )}
        </div>

        {/* ===== Scrollable Content ===== */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 text-[15px] scrollbar-hide">
          <SidebarItem
            icon={<Gift size={28} />}
            label="Promotions"
            route="/homesidebarroutes/promotions"
            collapsed={collapsed}
            active={activeItem === "promotions"}
            onActive={() => setActiveItem("promotions")}
          />

          <SidebarItem
            icon={<Users size={28} />}
            label="Affiliate"
            route="/homesidebarroutes/affiliates"
            collapsed={collapsed}
            active={activeItem === "affiliate"}
            onActive={() => setActiveItem("affiliate")}
          />
          <SidebarItem
            icon={<Crown size={28} />}
            label="VIP Club"
            route="/homesidebarroutes/vipsidebar"
            collapsed={collapsed}
            active={activeItem === "vip"}
            onActive={() => setActiveItem("vip")}
          />
          <SidebarItem
            icon={<BookOpen size={28} />}
            label="Blog"
            route="/homesidebarroutes/blog"
            collapsed={collapsed}
            active={activeItem === "blog"}
            onActive={() => setActiveItem("blog")}
          />
          <SidebarItem
            icon={<MessageSquare size={28} />}
            label="Forum"
            route="#"
            collapsed={collapsed}
            active={activeItem === "forum"}
            onActive={() => setActiveItem("forum")}
          />

          <hr className="border-[#2f3745] border-l-8 my-6" />

          <SidebarItem
            icon={<HeartHandshake size={28} />}
            label="Responsible Gambling"
            route="/homesidebarroutes/responsiblegambling"
            collapsed={collapsed}
            active={activeItem === "gambling"}
            onActive={() => setActiveItem("gambling")}
          />
          <SidebarItem
            icon={<LifeBuoy size={28} />}
            label="Live Support"
            route="#"
            collapsed={collapsed}
            active={activeItem === "support"}
            onActive={() => setActiveItem("support")}
          />

          <SidebarDropdown
            label="Language: English"
            icon={<Globe size={28} />}
            collapsed={collapsed}
            open={openDropdown === "language"}
            onToggle={() => toggleDropdown("language")}
            active={activeItem === "language"}
            onActive={() => setActiveItem("language")}
            items={[
              { label: "English", route: "#" },
              { label: "हिन्दी", route: "#" },
              { label: "नेपाली", route: "#" },
            ]}
          />
        </nav>
      </aside>

      <ComingSoonModal
        open={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </>
  );
};

/* ===== Sub Components ===== */

const SidebarTopButton = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 flex items-center gap-2 rounded-md font-medium transition-all duration-300 relative overflow-hidden group ${
      active
        ? "bg-gradient-to-r from-[#3057FF] to-[#00D4FF] text-white shadow-[0_0_14px_rgba(0,212,285,0.6)]"
        : "bg-[#162832] text-gray-300 hover:bg-[#1d2b40]"
    }`}
  >
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
    {label}
  </button>
);

const SidebarTopIcon = ({
  active,
  icon,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-md flex justify-center items-center transition-all duration-300 relative overflow-hidden group ${
      active
        ? "bg-gradient-to-r from-[#3057FF] to-[#00D4FF] text-white shadow-[0_0_14px_rgba(0,212,285,0.6)]"
        : "bg-[#162832] text-gray-300 hover:bg-[#1d2b40]"
    }`}
  >
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
    {icon}
  </button>
);

const SidebarItem = ({
  icon,
  label,
  route,
  collapsed,
  active,
  onActive,
}: {
  icon: React.ReactNode;
  label: string;
  route: string;
  collapsed?: boolean;
  active: boolean;
  onActive: () => void;
}) => (
  <Link href={route} onClick={onActive}>
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all relative overflow-hidden group ${
        collapsed ? "justify-center" : ""
      } ${
        active
          ? "bg-gradient-to-r from-[#3057FF] to-[#00D4FF] text-white shadow-[0_0_14px_rgba(0,212,285,0.6)]"
          : "hover:bg-[#1a2233]"
      }`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
      {icon}
      {!collapsed && <span className="text-gray-280">{label}</span>}
    </div>
  </Link>
);

const SidebarDropdown = ({
  label,
  icon,
  collapsed,
  open,
  onToggle,
  items,
  active,
  onActive,
}: {
  label: string;
  icon: React.ReactNode;
  collapsed?: boolean;
  open: boolean;
  onToggle: () => void;
  items: { label: string; route: string }[];
  active: boolean;
  onActive: () => void;
}) => (
  <div>
    <div
      onClick={() => {
        onToggle();
        onActive();
      }}
      className={`flex items-center justify-between gap-3 px-3 py-2 rounded-md cursor-pointer transition-all relative overflow-hidden group ${
        collapsed ? "justify-center" : ""
      } ${
        active
          ? "bg-gradient-to-r from-[#3057FF] to-[#00D4FF] text-white shadow-[0_0_14px_rgba(0,212,285,0.6)]"
          : "hover:bg-[#1a2233]"
      }`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
      <div className="flex items-center gap-3">
        {icon}
        {!collapsed && <span className="text-gray-280">{label}</span>}
      </div>
      {!collapsed &&
        (open ? (
          <ChevronUp size={18} className="text-gray-300" />
        ) : (
          <ChevronDown size={18} className="text-gray-300" />
        ))}
    </div>

    {!collapsed && open && (
      <div className="pl-10 flex flex-col text-sm text-gray-400 animate-fadeIn">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.route}
            className="py-1 hover:text-white transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    )}
  </div>
);

export default Sidebar;
