
import React from "react";
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

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, open, setOpen }) => {
  return (
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
        <SidebarItem icon={<Home size={28} />} label="Casino" active collapsed={collapsed} />
        <SidebarItem icon={<Trophy size={28} />} label="Sports" collapsed={collapsed} />
        <SidebarItem icon={<Gift size={28} />} label="Promotions" collapsed={collapsed} />
        <SidebarItem icon={<Users size={28} />} label="Affiliate" collapsed={collapsed} />
        <SidebarItem icon={<Crown size={28} />} label="VIP Club" collapsed={collapsed} />
        <SidebarItem icon={<BookOpen size={28} />} label="Blog" collapsed={collapsed} />
        <SidebarItem icon={<MessageSquare size={28} />} label="Forum" collapsed={collapsed} />
        <SidebarItem icon={<HeartHandshake size={28} />} label="Responsible Gambling" collapsed={collapsed} />
        <SidebarItem icon={<LifeBuoy size={28} />} label="Live Support" collapsed={collapsed} />
        <SidebarItem icon={<Globe size={28} />} label="Language: English" collapsed={collapsed} />
      </nav>
    </aside>
  );
};

/* Sidebar Item */
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, collapsed }) => (
  <div className="relative group">
    <div
      className={`flex items-center gap-2 px-2 py-3 rounded-md cursor-pointer 
        ${active ? "bg-[#243249] text-white" : ""} 
        ${collapsed ? "justify-center" : "justify-start"}`}
    >
      {icon}
      {!collapsed && <span className="text-sm">{label}</span>}
    </div>

    {/* Tooltip shows only on hover when collapsed */}
    {collapsed && (
      <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
        {label}
      </span>
    )}
  </div>
);
