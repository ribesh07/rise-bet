'use client';
import { useHydration } from '../hooks/useHydration';

const Footer = () => {
  const isHydrated = useHydration();
  const currentYear = isHydrated ? new Date().getFullYear() : 2025;

  return (
    <footer className="bg-gray-950 text-white text-center p-4">
      © {currentYear} powered by Sarthi. All rights reserved.
    </footer>
  );
};

export default Footer;
