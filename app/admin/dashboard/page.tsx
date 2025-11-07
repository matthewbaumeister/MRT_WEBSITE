"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {session.user?.name}
              </p>
            </div>
            <Button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              variant="outline"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Cards */}
          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/submissions')}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Contact Form Submissions
            </h3>
            <p className="text-3xl font-bold text-primary-600">View All</p>
            <p className="text-sm text-gray-500 mt-2">Click to manage</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Site Analytics
            </h3>
            <p className="text-3xl font-bold text-primary-600">-</p>
            <p className="text-sm text-gray-500 mt-2">Coming soon</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              User Management
            </h3>
            <p className="text-3xl font-bold text-primary-600">1</p>
            <p className="text-sm text-gray-500 mt-2">Admin user</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="primary" className="w-full" onClick={() => router.push('/admin/submissions')}>
              View Contact Submissions
            </Button>
            <Button variant="primary" className="w-full" onClick={() => router.push('/admin/users')}>
              Manage Users
            </Button>
            <Button variant="outline" className="w-full">
              Manage Content
            </Button>
            <Button variant="outline" className="w-full">
              View Analytics
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            System Status
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Authentication</span>
              <span className="text-green-600 font-semibold">✓ Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">SendGrid Integration</span>
              <span className="text-yellow-600 font-semibold">
                ⚠ Configure API Key
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">2FA Status</span>
              <span className="text-gray-600 font-semibold">Not Configured</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

