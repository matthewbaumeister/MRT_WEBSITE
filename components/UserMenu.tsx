"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export const UserMenu = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return null;
  }

  if (!session) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
        className="text-white hover:text-accent-400 transition-colors duration-200 font-medium"
      >
        Login
      </Link>
    );
  }

  const getPortalLink = () => {
    switch (session.user.role) {
      case "admin":
        return { href: "/admin/dashboard", label: "Admin Portal" };
      case "employee":
        return { href: "/employee/dashboard", label: "Employee Portal" };
      default:
        return { href: "/admin/dashboard", label: "Dashboard" };
    }
  };

  const portal = getPortalLink();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-accent-400 transition-colors duration-200"
      >
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
          <span className="text-sm font-bold">
            {session.user.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "U"}
          </span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-xl py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-sm font-semibold text-white">{session.user.name}</p>
            <p className="text-xs text-gray-400">{session.user.email}</p>
            <p className="text-xs text-accent-400 mt-1 capitalize">{session.user.role}</p>
          </div>
          <Link
            href={portal.href}
            className="block px-4 py-2 text-white hover:bg-primary-600 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            {portal.label}
          </Link>
          <Link
            href="/admin/submissions"
            className="block px-4 py-2 text-white hover:bg-primary-600 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            View Submissions
          </Link>
          {session.user.role === "admin" && (
            <>
              <Link
                href="/admin/users"
                className="block px-4 py-2 text-white hover:bg-primary-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Manage Users
              </Link>
              <Link
                href="/admin/settings"
                className="block px-4 py-2 text-white hover:bg-primary-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
            </>
          )}
          <button
            onClick={() => {
              setIsOpen(false);
              signOut({ callbackUrl: "/" });
            }}
            className="block w-full text-left px-4 py-2 text-white hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

