'use client';
import React from 'react';
import { Sidebar } from '@/components/sidebar';

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
}

export const SidebarWrapper: React.FC<Props> = ({ sidebarOpen, setSidebarOpen }) => {
  const sidebarWidth = sidebarOpen ? 256 : 80;

  return (
    <div
      className="fixed top-0 left-0 h-full z-20 transition-all duration-500"
      style={{ width: sidebarWidth }}
    >
      <Sidebar
        collapsed={!sidebarOpen}
        setCollapsed={() => setSidebarOpen(!sidebarOpen)}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />
    </div>
  );
};
