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
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);

  // Callback to refresh sidebar when conversations/projects change
  const refreshSidebar = () => {
    console.log("Refreshing sidebar...");
    setSidebarRefreshKey(prev => prev + 1);
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
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <MatrixChat
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          chatId={currentChatId}
          onNewChat={() => {
            setCurrentChatId(null);
          }}
          projectId={currentProjectId}
          onConversationCreated={refreshSidebar}
        />
      </div>
    </div>
  );
}

