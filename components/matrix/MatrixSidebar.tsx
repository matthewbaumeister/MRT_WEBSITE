"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

interface MatrixSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

export default function MatrixSidebar({
  isOpen,
  onClose,
  currentChatId,
  onSelectChat,
}: MatrixSidebarProps) {
  const { data: session } = useSession();
  const [chats] = useState<any[]>([]); // Will be populated from Supabase later

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-950 border-r border-gray-800 transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* New Chat Button */}
          <div className="p-4 border-b border-gray-800">
            <button
              onClick={() => {
                onSelectChat(null);
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="font-semibold">New Chat</span>
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            {/* Recent Chats Section */}
            <div className="px-4 mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Recents
              </h3>
              {chats.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No previous chats
                </p>
              ) : (
                <div className="space-y-1">
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => {
                        onSelectChat(chat.id);
                        onClose();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentChatId === chat.id
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <div className="truncate">{chat.title || "New Chat"}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(chat.created_at).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="px-2 space-y-1">
              <Link
                href="/platforms"
                className="flex items-center space-x-3 px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Home</span>
              </Link>

              <button className="flex items-center space-x-3 px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors w-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Projects</span>
              </button>

              <button className="flex items-center space-x-3 px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors w-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span>Artifacts</span>
              </button>

              <button className="flex items-center space-x-3 px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors w-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                <span>Code</span>
              </button>
            </div>
          </div>

          {/* User Account at Bottom */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold">
                {session?.user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {session?.user?.role}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-gray-400 hover:text-white"
                title="Sign out"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

