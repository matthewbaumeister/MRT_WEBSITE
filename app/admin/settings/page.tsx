"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "employee" | "client";
  two_factor_enabled: boolean;
  is_active: boolean;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [userSearch, setUserSearch] = useState<string>("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/admin/login?callbackUrl=${encodeURIComponent("/admin/settings")}`);
    }
    if (session && session.user.role !== "admin") {
      router.push("/admin/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const response = await fetch("/api/users/list");
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function promoteUser() {
    if (!selectedUser || !selectedRole) {
      alert("Please select both a user and a role");
      return;
    }

    const user = users.find((u) => u.id === selectedUser);
    if (!user) return;

    if (!confirm(`Promote ${user.first_name} ${user.last_name} to ${selectedRole.toUpperCase()}?\n\nThey will receive an email notification.`)) {
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch("/api/users/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser, newRole: selectedRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update role");
      }

      alert(`✓ User successfully promoted to ${selectedRole}!\n\nA notification email has been sent.`);
      setSelectedUser("");
      setSelectedRole("");
      fetchUsers();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  }

  async function bulkEnable2FA() {
    if (!confirm("Enable 2FA for all users?\n\nThis will require email verification on their next login.")) {
      return;
    }

    setProcessing(true);
    try {
      // Enable 2FA for each user via API
      const enablePromises = users.map(user => 
        fetch("/api/users/toggle-2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, twoFactorEnabled: true }),
        })
      );

      await Promise.all(enablePromises);
      alert("2FA enabled for all users!");
      fetchUsers();
    } catch (error) {
      alert("Failed to enable 2FA for all users");
    } finally {
      setProcessing(false);
    }
  }

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (session.user.role !== "admin") {
    return null;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "text-red-600";
      case "employee": return "text-blue-600";
      case "client": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
              <p className="text-sm text-gray-600">
                Manage user roles, security, and system configuration
              </p>
            </div>
            <Button onClick={() => router.push("/admin/dashboard")} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Promote User Card */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Promote User
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Change a user's role and send them a notification email.
                </p>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select User
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => {
                          setUserSearch(e.target.value);
                          setShowUserDropdown(true);
                          if (!e.target.value) {
                            setSelectedUser("");
                          }
                        }}
                        onFocus={() => setShowUserDropdown(true)}
                        placeholder="Search by name or email..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        disabled={loading || processing}
                      />
                      <svg 
                        className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    
                    {showUserDropdown && userSearch && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {users
                          .filter((u) => u.id !== session.user.id)
                          .filter((u) => 
                            u.first_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                            u.last_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                            u.email.toLowerCase().includes(userSearch.toLowerCase())
                          )
                          .map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => {
                                setSelectedUser(user.id);
                                setUserSearch(`${user.first_name} ${user.last_name} (${user.email})`);
                                setShowUserDropdown(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-primary-50 border-b border-gray-100 last:border-0"
                            >
                              <div className="font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Current role: <span className="font-semibold capitalize">{user.role}</span>
                              </div>
                            </button>
                          ))}
                        {users.filter((u) => 
                          u.id !== session.user.id &&
                          (u.first_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                           u.last_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                           u.email.toLowerCase().includes(userSearch.toLowerCase()))
                        ).length === 0 && (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            No users found matching "{userSearch}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Role
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      disabled={!selectedUser || processing}
                    >
                      <option value="">Select role...</option>
                      <option value="admin">Admin - Full Access</option>
                      <option value="employee">Employee - Tools Access</option>
                      <option value="client">Client - Limited Access</option>
                    </select>
                  </div>

                  <Button
                    onClick={promoteUser}
                    disabled={!selectedUser || !selectedRole || processing}
                    variant="primary"
                    className="w-full"
                  >
                    {processing ? "Processing..." : "Update Role & Send Email"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Security Settings */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Security Settings
                </h2>
                
                <div className="space-y-4">
                  <Button
                    onClick={bulkEnable2FA}
                    disabled={processing}
                    variant="outline"
                    className="w-full"
                  >
                    Enable 2FA for All Users
                  </Button>
                  
                  <Button
                    onClick={() => router.push("/admin/users")}
                    variant="outline"
                    className="w-full"
                  >
                    Advanced User Management
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - User List */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    All Users
                  </h2>
                  <Button
                    onClick={() => router.push("/admin/users")}
                    variant="outline"
                    size="sm"
                  >
                    Detailed View
                  </Button>
                </div>

                {loading ? (
                  <p className="text-gray-500 text-center py-8">Loading users...</p>
                ) : (
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          user.is_active ? "border-gray-200 bg-white" : "border-gray-300 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                            {user.first_name[0]}{user.last_name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.first_name} {user.last_name}
                              {user.id === session.user.id && (
                                <span className="ml-2 text-xs text-gray-500">(You)</span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'employee' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role.toUpperCase()}
                          </span>
                          {user.two_factor_enabled && (
                            <span className="text-xs text-green-600 font-semibold">
                              🔒 2FA
                            </span>
                          )}
                          {!user.is_active && (
                            <span className="text-xs text-red-600 font-semibold">
                              ⚠ Inactive
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Role Descriptions */}
            <Card className="mt-6">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Role Descriptions
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 whitespace-nowrap">
                        ADMIN
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 flex-1">
                      Full access to all systems, user management, settings, contact submissions, and all tools (Matrix, Pathfinder)
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">
                        EMPLOYEE
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 flex-1">
                      Access to Matrix and Pathfinder tools, company resources, collaboration features, and view contact submissions
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 whitespace-nowrap">
                        CLIENT
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 flex-1">
                      Limited access to specific projects and reports assigned to them. View-only permissions
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* System Configuration */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Email Configuration
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">SendGrid Status:</span>
                  <span className="text-green-600 font-semibold">✓ Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">2FA Email:</span>
                  <span className="text-green-600 font-semibold">✓ Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Notifications:</span>
                  <span className="text-green-600 font-semibold">✓ Enabled</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Security Settings
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Users with 2FA:</span>
                  <span className="text-primary-600 font-semibold">
                    {users.filter((u) => u.two_factor_enabled).length} / {users.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Users:</span>
                  <span className="text-green-600 font-semibold">
                    {users.filter((u) => u.is_active).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Admins:</span>
                  <span className="text-red-600 font-semibold">
                    {users.filter((u) => u.role === "admin").length}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Database Status
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Supabase:</span>
                  <span className="text-green-600 font-semibold">✓ Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact Tickets:</span>
                  <span className="text-primary-600 font-semibold">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User Management:</span>
                  <span className="text-green-600 font-semibold">✓ Enabled</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Role Changes (Future Enhancement) */}
        <Card className="mt-8">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <p className="text-sm text-gray-500">
              Activity logging coming soon - will show recent role changes, logins, and system events
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}

