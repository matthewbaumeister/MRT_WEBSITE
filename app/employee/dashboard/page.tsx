"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function EmployeeDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
    if (session && session.user.role !== "employee" && session.user.role !== "admin") {
      router.push("/admin/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Employee Portal
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {session.user?.name}
              </p>
            </div>
            <div className="flex gap-4">
              {session.user.role === "admin" && (
                <Button
                  onClick={() => router.push("/admin/dashboard")}
                  variant="outline"
                >
                  Admin Portal
                </Button>
              )}
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="outline"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Employee Tools */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Matrix Access
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              AI-Powered Market Research Tool
            </p>
            <Button variant="primary" className="w-full">
              Launch Matrix
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Pathfinder Access
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Intelligence Navigation Tool
            </p>
            <Button variant="primary" className="w-full">
              Launch Pathfinder
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Resources
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Company documents and resources
            </p>
            <Button variant="outline" className="w-full">
              View Resources
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              View Contact Submissions
            </Button>
            <Button variant="outline" className="w-full">
              Company Directory
            </Button>
            <Button variant="outline" className="w-full">
              Submit Time Off Request
            </Button>
            <Button variant="outline" className="w-full">
              View Announcements
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-700">Last Login</span>
              <span className="text-gray-500 text-sm">Today</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-700">Matrix Reports Generated</span>
              <span className="text-primary-600 font-semibold">Coming Soon</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Documents Accessed</span>
              <span className="text-primary-600 font-semibold">Coming Soon</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

