"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import Button from "@/components/ui/Button";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "employee" | "client";
  two_factor_enabled: boolean;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

export default function UsersManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
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

  async function updateUserRole(userId: string, newRole: "admin" | "employee" | "client") {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    setUpdating(userId);
    try {
      const response = await fetch("/api/users/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update role");
      }

      alert("User role updated successfully! A notification email has been sent.");
      fetchUsers();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setUpdating(null);
    }
  }

  async function toggleUserStatus(userId: string, currentStatus: boolean) {
    if (!confirm(`Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this user?`)) {
      return;
    }

    setUpdating(userId);
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("users")
        .update({ is_active: !currentStatus })
        .eq("id", userId);

      if (error) throw error;
      fetchUsers();
      alert(`User ${currentStatus ? "deactivated" : "activated"} successfully!`);
    } catch (error) {
      alert("Failed to update user status");
    } finally {
      setUpdating(null);
    }
  }

  async function toggle2FA(userId: string, currentStatus: boolean) {
    if (!confirm(`Are you sure you want to ${currentStatus ? "disable" : "enable"} 2FA for this user?`)) {
      return;
    }

    setUpdating(userId);
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("users")
        .update({ two_factor_enabled: !currentStatus })
        .eq("id", userId);

      if (error) throw error;
      fetchUsers();
      alert(`2FA ${currentStatus ? "disabled" : "enabled"} successfully!`);
    } catch (error) {
      alert("Failed to update 2FA status");
    } finally {
      setUpdating(null);
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "employee":
        return "bg-blue-100 text-blue-800";
      case "client":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-sm text-gray-600">
                Manage user accounts and permissions
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Admins</h3>
            <p className="text-3xl font-bold text-red-600">
              {users.filter((u) => u.role === "admin").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Employees</h3>
            <p className="text-3xl font-bold text-blue-600">
              {users.filter((u) => u.role === "employee").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-green-600">
              {users.filter((u) => u.is_active).length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    2FA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className={!user.is_active ? "bg-gray-50 opacity-60" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.two_factor_enabled ? "✓ Enabled" : "Disabled"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {user.id !== session.user.id && (
                        <>
                          <select
                            value={user.role}
                            onChange={(e) =>
                              updateUserRole(user.id, e.target.value as any)
                            }
                            disabled={updating === user.id}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="admin">Admin</option>
                            <option value="employee">Employee</option>
                            <option value="client">Client</option>
                          </select>
                          <button
                            onClick={() => toggle2FA(user.id, user.two_factor_enabled)}
                            disabled={updating === user.id}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            {user.two_factor_enabled ? "Disable 2FA" : "Enable 2FA"}
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                            disabled={updating === user.id}
                            className={user.is_active ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                          >
                            {user.is_active ? "Deactivate" : "Activate"}
                          </button>
                        </>
                      )}
                      {user.id === session.user.id && (
                        <span className="text-gray-400 italic">You (current user)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            User Management Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Users receive an email notification when their role changes</li>
            <li>• You cannot change your own role for security reasons</li>
            <li>• Deactivated users cannot log in but their data is preserved</li>
            <li>• 2FA can be enabled/disabled for any user</li>
            <li>• All role changes are logged for audit purposes</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

