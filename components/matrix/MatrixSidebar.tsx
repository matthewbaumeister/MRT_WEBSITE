"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import ProjectModal from "./ProjectModal";

interface Conversation {
  id: string;
  title: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

interface MatrixSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentChatId: string | null;
  onSelectChat: (chatId: string | null) => void;
  currentProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
  refreshKey?: number;
  onNewChat: () => void;
}

export default function MatrixSidebar({
  isOpen,
  onClose,
  currentChatId,
  onSelectChat,
  currentProjectId,
  onSelectProject,
  refreshKey,
  onNewChat,
}: MatrixSidebarProps) {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showProjectsSection, setShowProjectsSection] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [moveToProjectId, setMoveToProjectId] = useState<string | null>(null);
  const [projectSearchQuery, setProjectSearchQuery] = useState("");

  // Load conversations and projects
  useEffect(() => {
    console.log("🔄 [SIDEBAR] useEffect triggered - session:", !!session, "project:", currentProjectId, "refreshKey:", refreshKey);
    if (session) {
      console.log("   → Loading conversations and projects...");
      loadConversations();
      loadProjects();
    } else {
      console.log("   ⚠️  No session, skipping load");
    }
  }, [session, currentProjectId, refreshKey]);

  const loadConversations = async () => {
    try {
      let url = "/api/matrix/conversations";
      
      // Special handling for "All Chats" view
      if (currentProjectId === "ALL") {
        // Fetch ALL conversations (no project filter)
        url += "?all=true";
        console.log(`🔍 [SIDEBAR] Loading ALL conversations (All Chats view)`);
      } else if (currentProjectId === null) {
        // Show only conversations without a project ("Unsaved/Recents")
        url += "?project_id=null";
        console.log(`🔍 [SIDEBAR] Loading conversations without project (Recents)`);
      } else if (currentProjectId) {
        // Show only conversations for this specific project
        url += `?project_id=${currentProjectId}`;
        console.log(`🔍 [SIDEBAR] Loading conversations for project: ${currentProjectId}`);
      }
      
      console.log(`📡 [SIDEBAR] Fetching from: ${url}`);
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ [SIDEBAR] Loaded ${data.conversations?.length || 0} conversations`);
        
        // Debug: Log details of each conversation
        if (data.conversations && data.conversations.length > 0) {
          console.log(`📋 [SIDEBAR] Conversation details:`);
          data.conversations.forEach((conv: any, idx: number) => {
            console.log(`  ${idx + 1}. "${conv.title}" | Project: ${conv.project_id || 'none'} | ID: ${conv.id.slice(0, 8)}...`);
          });
        } else {
          console.warn(`⚠️  [SIDEBAR] No conversations found!`);
        }
        
        setConversations(data.conversations || []);
      } else {
        console.error("❌ [SIDEBAR] Failed to load conversations:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("❌ [SIDEBAR] Error loading conversations:", error);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/matrix/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const handleCreateProject = async (projectData: {
    name: string;
    description: string;
    color: string;
  }) => {
    try {
      const response = await fetch("/api/matrix/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        await loadProjects();
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project? Chats will not be deleted.")) {
      return;
    }

    try {
      const response = await fetch(`/api/matrix/projects?id=${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (currentProjectId === projectId) {
          onSelectProject(null);
        }
        await loadProjects();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!confirm("Are you sure you want to delete this chat?")) {
      return;
    }

    try {
      const response = await fetch(`/api/matrix/conversations?id=${conversationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (currentChatId === conversationId) {
          onSelectChat(null);
        }
        await loadConversations();
        setOpenMenuId(null);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleMoveToProject = async (conversationId: string, projectId: string | null) => {
    try {
      const response = await fetch("/api/matrix/conversations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: conversationId,
          project_id: projectId,
        }),
      });

      if (response.ok) {
        await loadConversations();
        setOpenMenuId(null);
        setMoveToProjectId(null);
        setProjectSearchQuery("");
      }
    } catch (error) {
      console.error("Error moving conversation:", error);
    }
  };

  return (
    <>
      {/* Sidebar - Flex item, not overlay */}
      <div className="w-64 bg-gray-950 border-r border-gray-800 flex-shrink-0">
        <div className="flex flex-col h-full">
          {/* Header - New Chat Button + Close Button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 h-[73px] gap-2">
            <button
              onClick={() => {
                onNewChat(); // Reset to home screen
                onClose();
              }}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg transition-all duration-200"
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
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                {currentProjectId === "ALL" ? (
                  <>
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: "#6B7280" }}
                    />
                    All Chats
                  </>
                ) : currentProjectId ? (
                  <>
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: projects.find(p => p.id === currentProjectId)?.color || '#6366f1' }}
                    />
                    {projects.find(p => p.id === currentProjectId)?.name || "Project"}
                  </>
                ) : "Recents"}
              </h3>
              {conversations.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No previous chats
                </p>
              ) : (
                <div className="space-y-1">
                  {conversations.map((conversation) => {
                    // Find the project for this conversation (if any)
                    const conversationProject = conversation.project_id 
                      ? projects.find(p => p.id === conversation.project_id)
                      : null;
                    
                    return (
                    <div key={conversation.id} className="relative group">
                      <button
                        onClick={() => {
                          onSelectChat(conversation.id);
                          // If clicking from "All Chats" view and conversation has a project, switch to that project
                          if (currentProjectId === "ALL" && conversation.project_id) {
                            onSelectProject(conversation.project_id);
                          }
                          onClose();
                        }}
                        className={`w-full text-left px-3 py-2 pr-10 rounded-lg text-sm transition-colors ${
                          currentChatId === conversation.id
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {/* Show project color dot for any chat in a project */}
                          {conversationProject && (
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: conversationProject.color }}
                              title={conversationProject.name}
                            />
                          )}
                          <div className="truncate flex-1">{conversation.title || "New Research"}</div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(conversation.updated_at).toLocaleDateString()}
                        </div>
                      </button>
                      
                      {/* 3-Dot Menu */}
                      <div className="absolute right-2 top-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === conversation.id ? null : conversation.id);
                          }}
                          className="p-1 text-gray-500 hover:text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="8" cy="2" r="1.5"/>
                            <circle cx="8" cy="8" r="1.5"/>
                            <circle cx="8" cy="14" r="1.5"/>
                          </svg>
                        </button>
                        
                        {/* Dropdown Menu */}
                        {openMenuId === conversation.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                            <button
                              onClick={() => {
                                onSelectChat(conversation.id);
                                onClose();
                                setOpenMenuId(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                            >
                              Open Chat
                            </button>
                            <button
                              onClick={() => setMoveToProjectId(conversation.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                            >
                              Move to Project
                            </button>
                            <button
                              onClick={() => handleDeleteConversation(conversation.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                            >
                              Delete Chat
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                  })}
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

              {/* Projects Section */}
              <div>
                <button
                  onClick={() => setShowProjectsSection(!showProjectsSection)}
                  className="flex items-center justify-between w-full px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
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
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      showProjectsSection ? "rotate-90" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {showProjectsSection && (
                  <div className="mt-2 space-y-1 pl-4">
                    {/* All Chats - Shows ALL conversations with project indicators */}
                    <button
                      onClick={() => {
                        onSelectProject("ALL");
                        onClose();
                      }}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentProjectId === "ALL"
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: "#6B7280" }}
                      />
                      <span>All Chats</span>
                    </button>
                    {/* Project List */}
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center space-x-1"
                      >
                        <button
                          onClick={() => {
                            onSelectProject(project.id);
                            onClose();
                          }}
                          className={`flex-1 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            currentProjectId === project.id
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white"
                          }`}
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                          <span className="truncate">{project.name}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                          title="Delete project"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}

                    {/* New Project Button */}
                    <button
                      onClick={() => setShowProjectModal(true)}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-primary-400 hover:bg-gray-800 rounded-lg text-sm transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
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
                      <span>New Project</span>
                    </button>
                  </div>
                )}
              </div>

              <Link
                href="/matrix/knowledge-base"
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
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                <span>Knowledge Base</span>
              </Link>
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

      {/* Project Modal */}
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSave={handleCreateProject}
      />

      {/* Move to Project Modal */}
      {moveToProjectId && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Move to Project</h2>
              <button 
                onClick={() => {
                  setMoveToProjectId(null);
                  setProjectSearchQuery("");
                }}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                placeholder="Search projects..."
                value={projectSearchQuery}
                onChange={(e) => setProjectSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
              />
              <div className="max-h-64 overflow-y-auto space-y-2">
                {/* All Chats option */}
                <button
                  onClick={() => handleMoveToProject(moveToProjectId, null)}
                  className="w-full text-left px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <div className="font-semibold">All Chats</div>
                  <div className="text-xs text-gray-400">Remove from project</div>
                </button>
                
                {/* Filtered Projects List */}
                {projects
                  .filter(p => 
                    p.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                    p.description?.toLowerCase().includes(projectSearchQuery.toLowerCase())
                  )
                  .map(project => (
                    <div key={project.id} className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMoveToProject(moveToProjectId, project.id)}
                        className="flex-1 text-left px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors border-l-4"
                        style={{ borderLeftColor: project.color }}
                      >
                        <div className="font-semibold">{project.name}</div>
                        {project.description && (
                          <div className="text-xs text-gray-400">{project.description}</div>
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                        className="p-2 text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
                        title="Delete project"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

