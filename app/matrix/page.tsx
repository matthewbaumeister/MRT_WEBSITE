"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MatrixSidebar from "@/components/matrix/MatrixSidebar";
import MatrixChat from "@/components/matrix/MatrixChat";

export default function MatrixPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>("ALL"); // Default to "All Chats" view
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
  const [chatResetKey, setChatResetKey] = useState(0);

  // Callback to refresh sidebar when conversations/projects change
  const refreshSidebar = () => {
    console.log("🔄 [PAGE] refreshSidebar() called!");
    setSidebarRefreshKey(prev => {
      const newKey = prev + 1;
      console.log(`   → Incrementing refreshKey: ${prev} → ${newKey}`);
      return newKey;
    });
  };

  // Reset chat to home screen
  const resetChat = () => {
    setCurrentChatId(null);
    setChatResetKey(prev => prev + 1); // Force remount
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/login?callbackUrl=/matrix");
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <MatrixSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        currentProjectId={currentProjectId}
        onSelectProject={setCurrentProjectId}
        refreshKey={sidebarRefreshKey}
        onNewChat={resetChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <MatrixChat
          key={chatResetKey} // Force remount on reset
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          chatId={currentChatId}
          onNewChat={resetChat}
          projectId={currentProjectId}
          onConversationCreated={refreshSidebar}
        />
      </div>
    </div>
  );
}

