'use client';
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    // Set initial scroll state
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent hydration mismatch by not applying scroll-based styles until mounted
  const navClasses = `fixed w-full top-0 z-50 transition-colors duration-500 ${
    mounted && scrolled ? "bg-black bg-opacity-90 shadow-md" : "bg-transparent"
  }`;

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0 font-extrabold tracking-wide cursor-pointer select-none">
          <img className="w-12 h-12" src="logo.png" alt="RISE"/>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-8 text-white font-semibold">
          <a href="#" className="hover:text-blue-500 transition">
            Games
          </a>
          <a href="#" className="hover:text-blue-500 transition">
            Promotions
          </a>
          <a href="#" className="hover:text-blue-500 transition">
            VIP
          </a>
          <a href="#" className="hover:text-blue-500 transition">
            Blog
          </a>
          <a href="#" className="hover:text-blue-500 transition">
            About
          </a>
          <a href="#" className="hover:text-blue-500 transition">
            Support
          </a>
        </div>

        {/* Right Side Buttons */}

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-90 px-6 py-4 space-y-4 text-white font-semibold">
          <a href="#" className="block hover:text-blue-500">
            Games
          </a>
          <a href="#" className="block hover:text-blue-500">
            Promotions
          </a>
          <a href="#" className="block hover:text-blue-500">
            VIP
          </a>
          <a href="#" className="block hover:text-blue-500">
            Blog
          </a>
          <a href="#" className="block hover:text-blue-500">
            About
          </a>
          <a href="#" className="block hover:text-blue-500">
            Support
          </a>
          <div className="pt-2 border-t border-gray-700 flex space-x-4">
            <Link href="/auth/login" passHref>
              <button className="flex-1 text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition">
                Login
              </button>
            </Link>
            <Link href="/auth/signup" passHref>
              <button className="flex-1 bg-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition">
                Register
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
