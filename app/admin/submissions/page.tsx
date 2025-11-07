"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getSupabaseClient, type ContactSubmission } from "@/lib/supabase";
import Button from "@/components/ui/Button";

export default function SubmissionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "open" | "in_progress" | "closed">("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  async function fetchSubmissions() {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      let query = supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: "open" | "in_progress" | "closed") {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      fetchSubmissions();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const statusColors = {
    open: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    closed: "bg-green-100 text-green-800",
  };

  const getStatusCount = (status: string) => {
    return submissions.filter((s) => s.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Contact Submissions
              </h1>
              <p className="text-sm text-gray-600">
                Manage and track customer inquiries
              </p>
            </div>
            <Button onClick={() => router.push("/admin/dashboard")} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter("all")}>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total</h3>
            <p className="text-3xl font-bold text-gray-900">{submissions.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter("open")}>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Open</h3>
            <p className="text-3xl font-bold text-yellow-600">{getStatusCount("open")}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter("in_progress")}>
            <h3 className="text-sm font-medium text-gray-600 mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-blue-600">{getStatusCount("in_progress")}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter("closed")}>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Closed</h3>
            <p className="text-3xl font-bold text-green-600">{getStatusCount("closed")}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg ${
              filter === "all" ? "bg-primary-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("open")}
            className={`px-4 py-2 rounded-lg ${
              filter === "open" ? "bg-yellow-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setFilter("in_progress")}
            className={`px-4 py-2 rounded-lg ${
              filter === "in_progress" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("closed")}
            className={`px-4 py-2 rounded-lg ${
              filter === "closed" ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Closed
          </button>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No submissions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {submission.first_name} {submission.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{submission.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(submission.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[submission.status]}`}>
                      {submission.status.replace("_", " ").toUpperCase()}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                      {submission.ticket_number}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {submission.subject}
                  </h4>
                  <p className="text-gray-700">{submission.message}</p>
                </div>

                <div className="flex gap-2">
                  {submission.status !== "open" && (
                    <button
                      onClick={() => updateStatus(submission.id, "open")}
                      className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                    >
                      Mark Open
                    </button>
                  )}
                  {submission.status !== "in_progress" && (
                    <button
                      onClick={() => updateStatus(submission.id, "in_progress")}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Mark In Progress
                    </button>
                  )}
                  {submission.status !== "closed" && (
                    <button
                      onClick={() => updateStatus(submission.id, "closed")}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      Mark Closed
                    </button>
                  )}
                  <a
                    href={`mailto:${submission.email}?subject=Re: ${submission.subject} (Ticket #${submission.ticket_number})`}
                    className="px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

