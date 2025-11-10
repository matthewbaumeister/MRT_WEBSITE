"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";

export default function PlatformsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
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

  // Check if user is a free tier general user - show upgrade message
  if (session.user.role === "general" && session.user.subscriptionTier === "free") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20">
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Upgrade to Access MRT Platforms
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                You're currently on the <span className="font-semibold">Free Plan</span>. 
                Upgrade to Pro or Enterprise to access our powerful AI-driven platforms.
              </p>

              <div className="bg-primary-50 border-l-4 border-primary-600 p-6 mb-8 text-left">
                <h3 className="font-bold text-primary-900 mb-3">Pro Plan Includes:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-accent-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Full access to Matrix (AI Market Research)
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-accent-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Priority support & dedicated account manager
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-accent-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Extended data exports & custom reporting
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-accent-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    API access for integrations
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Contact Sales for Upgrade
                </Link>
                <Link
                  href="/contact?subject=Demo Request"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-bold rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-all duration-200"
                >
                  Schedule a Demo
                </Link>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                Questions? Email us at{" "}
                <a href="mailto:info@make-ready-consulting.com" className="text-primary-600 hover:text-primary-700 font-semibold">
                  info@make-ready-consulting.com
                </a>
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const platforms = [
    {
      name: "Matrix",
      description: "AI-Powered Market Research & Intelligence",
      tagline: "Win more contracts with comprehensive market intelligence",
      icon: (
        <svg className="w-20 h-20" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" fill="#2F2F72" />
          <circle cx="32" cy="32" r="18" stroke="#D4AF37" strokeWidth="3" fill="none" />
          <circle cx="32" cy="32" r="8" fill="#D4AF37" />
          <circle cx="18" cy="18" r="4" fill="#D4AF37" />
          <circle cx="46" cy="18" r="4" fill="#D4AF37" />
          <circle cx="46" cy="46" r="4" fill="#D4AF37" />
          <circle cx="18" cy="46" r="4" fill="#D4AF37" />
          <line x1="22" y1="22" x2="28" y2="28" stroke="#D4AF37" strokeWidth="2" />
          <line x1="36" y1="28" x2="42" y2="22" stroke="#D4AF37" strokeWidth="2" />
          <line x1="36" y1="36" x2="42" y2="42" stroke="#D4AF37" strokeWidth="2" />
          <line x1="22" y1="42" x2="28" y2="36" stroke="#D4AF37" strokeWidth="2" />
        </svg>
      ),
      href: "https://matrix.makereadytech.com",
      color: "from-accent-600 to-accent-800",
      available: true,
    },
    {
      name: "Pathfinder",
      description: "Intelligence Navigation & Decision Support",
      tagline: "Navigate complex challenges with precision guidance",
      icon: (
        <svg className="w-20 h-20" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" fill="#2F2F72" />
          <circle cx="32" cy="32" r="20" stroke="#D4AF37" strokeWidth="2" />
          <path d="M32 12 L35 24 L32 22 L29 24 Z" fill="#D4AF37" />
          <circle cx="32" cy="32" r="6" fill="#D4AF37" />
          <line x1="32" y1="12" x2="32" y2="26" stroke="#D4AF37" strokeWidth="2" />
          <line x1="32" y1="38" x2="32" y2="52" stroke="#D4AF37" strokeWidth="2" />
          <line x1="12" y1="32" x2="26" y2="32" stroke="#D4AF37" strokeWidth="2" />
          <line x1="38" y1="32" x2="52" y2="32" stroke="#D4AF37" strokeWidth="2" />
        </svg>
      ),
      href: "/products/pathfinder",
      color: "from-primary-600 to-primary-800",
      available: false,
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            MRT Platforms
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Access your Make Ready tools and resources
          </p>
          <p className="text-sm text-accent-400 mt-2">
            Logged in as: {session.user.name} ({session.user.role})
          </p>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {platforms.map((platform, index) => (
            <Card key={index} hover={platform.available} className="overflow-hidden">
              <div className={`bg-gradient-to-br ${platform.color} p-8 text-white`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    {platform.icon}
                  </div>
                  {platform.comingSoon && (
                    <span className="px-3 py-1 bg-accent-500 text-white text-xs font-bold rounded-full">
                      COMING SOON
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-bold mb-2">{platform.name}</h2>
                <p className="text-lg mb-4 opacity-90">{platform.description}</p>
              </div>
              <div className="p-6 bg-white">
                <p className="text-gray-600 mb-6">{platform.tagline}</p>
                {platform.available ? (
                  <Link
                    href={platform.href}
                    className="block w-full text-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Launch {platform.name} →
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full text-center bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-16 max-w-5xl mx-auto">
          <Card>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Additional Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  href="/admin/submissions"
                  className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-12 h-12 text-primary-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="font-semibold text-gray-900 mb-1">Contact Submissions</h3>
                  <p className="text-sm text-gray-600 text-center">View and manage inquiries</p>
                </Link>

                {session.user.role === "admin" && (
                  <Link
                    href="/admin/users"
                    className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-12 h-12 text-primary-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className="font-semibold text-gray-900 mb-1">User Management</h3>
                    <p className="text-sm text-gray-600 text-center">Manage accounts and roles</p>
                  </Link>
                )}

                <Link
                  href={session.user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard"}
                  className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-12 h-12 text-primary-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900 mb-1">Dashboard</h3>
                  <p className="text-sm text-gray-600 text-center">Return to main dashboard</p>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

