"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/platforms";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        token: show2FA ? token : undefined,
        redirect: false,
      });

      console.log("Login result:", result);
      console.log("Result error:", result?.error);
      console.log("Result ok:", result?.ok);
      console.log("Result status:", result?.status);
      console.log("Full result:", JSON.stringify(result));

      if (result?.error) {
        // Handle specific error messages
        if (result.error === "2FA_CODE_SENT") {
          setShow2FA(true);
          setError("✓ Verification code sent! Check your email for the 6-digit code.");
        } else if (result.error === "2FA token required") {
          setShow2FA(true);
          setError("Please enter your verification code from email.");
        } else if (result.error === "Invalid credentials") {
          setError("Invalid email or password. Please check your credentials and try again.");
        } else if (result.error === "Invalid or expired verification code") {
          setError("The verification code is invalid or expired. Please request a new code.");
        } else if (result.error === "CredentialsSignin") {
          setError("Invalid email or password. Please check your credentials.");
        } else if (result.error.includes("verify your email")) {
          // Account exists but not verified
          setError(`${result.error} Click here to resend verification code.`);
        } else {
          setError(`Login failed: ${result.error}`);
        }
        setLoading(false);
        return; // Don't redirect on error
        } else if (result?.ok) {
          // Successful login - redirect to callback URL or platforms
          console.log(`Login successful, redirecting to ${callbackUrl}`);
          window.location.href = callbackUrl;
        } else {
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-dark-900">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to access your Make Ready portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          {show2FA && (
            <div>
              <label
                htmlFor="token"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Verification Code
              </label>
              <input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                maxLength={6}
                autoComplete="off"
              />
              <div className="mt-2 p-3 bg-accent-50 rounded-lg">
                <p className="text-sm text-gray-700 flex items-center">
                  <svg className="w-5 h-5 text-accent-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Check your email for the 6-digit verification code
                </p>
                <p className="text-xs text-gray-500 mt-1 ml-7">
                  Code expires in 10 minutes
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className={`${error.includes("✓") || error.includes("Check your email") ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-red-50 border-red-200 text-red-700"} border px-4 py-3 rounded-lg text-sm`}>
              <div className="flex items-start">
                {error.includes("✓") ? (
                  <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{error}</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          <p>
            <Link href="/forgot-password" className="text-primary-600 hover:text-primary-700 font-semibold">
              Forgot your password?
            </Link>
          </p>
          <p>
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

