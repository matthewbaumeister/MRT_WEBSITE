"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get session for conditional navigation
  const { data: session } = require("next-auth/react").useSession();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    {
      name: "Our Products",
      href: "#",
      submenu: [
        { name: "Pathfinder", href: "/products/pathfinder" },
        { name: "Matrix", href: "/products/matrix" },
      ],
    },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Add MRT Platforms link if logged in
  if (session) {
    navLinks.splice(navLinks.length - 1, 0, {
      name: "MRT Platforms",
      href: "/platforms",
    });
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-dark-900 shadow-lg py-4" : "bg-dark-900/95 py-6"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-auto">
              <Image
                src="/images/logo.png"
                alt="Make Ready Logo"
                width={140}
                height={40}
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) =>
              link.submenu ? (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                >
                  <button className="text-white hover:text-accent-400 transition-colors duration-200 font-medium">
                    {link.name}
                  </button>
                  <div
                    className={`absolute top-full left-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-xl py-2 transition-all duration-200 ${
                      isProductsOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    }`}
                  >
                    {link.submenu.map((sublink) => (
                      <Link
                        key={sublink.name}
                        href={sublink.href}
                        className="block px-4 py-2 text-white hover:bg-primary-600 hover:text-white transition-colors duration-200"
                      >
                        {sublink.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-white hover:text-accent-400 transition-colors duration-200 font-medium ${
                    pathname === link.href ? "text-accent-400" : ""
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-700">
            {navLinks.map((link) =>
              link.submenu ? (
                <div key={link.name}>
                  <button
                    onClick={() => setIsProductsOpen(!isProductsOpen)}
                    className="block w-full text-left px-4 py-3 text-white hover:bg-primary-600 transition-colors duration-200"
                  >
                    {link.name}
                  </button>
                  {isProductsOpen && (
                    <div className="pl-4 bg-dark-800">
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.name}
                          href={sublink.href}
                          className="block px-4 py-2 text-white hover:bg-primary-600 transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-4 py-3 text-white hover:bg-primary-600 transition-colors duration-200 ${
                    pathname === link.href ? "bg-primary-600" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

