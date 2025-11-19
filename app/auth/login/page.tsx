'use client';
import Header from "@/app/layout/header/page";
import Footer from "@/app/layout/footer/page";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Basic validation
    if (!email) {
      setError("Email is required.");
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError("Password is required.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      setSuccess("Login successful!");
      // Redirect to dashboard after successful login
      router.push("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      console.error("Login error:", errorMessage);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: 'http://localhost:3000/auth/callback', // Update for production
        },
      });
      if (error) {
        console.error('Google Sign-In error:', error);
        toast.error('Failed to sign in with Google');
      } else {
        toast.success('Redirecting to Google Sign-In...');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-pink-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          <form onSubmit={handleSubmit}>
            {error && (
                  <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    <svg className="inline-block w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 11-2 0V9a1 1 0 012 0v4zm-1-6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                    </svg>
                    {error }
                    </div>
                )}
             {success && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                        <svg className="inline-block w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 11-2 0V9a1 1 0 012 0v4zm-1-6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                        </svg>
                        {success}
                    </div>
                    )}
            <div className="mb-6">
              <label
                className="block text-sm font-semibold mb-2 text-pink-600"
                htmlFor="email"
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-pink-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email
                </span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-semibold mb-2 text-pink-600"
                htmlFor="password"
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-pink-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m0 0H8m4 0v5m-9-7h18"
                    />
                  </svg>
                  Password
                </span>
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-br from-pink-400 to-blue-400 text-white px-5 py-2 rounded-full shadow hover:scale-105 transition font-bold border-2 border-white"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600 text-center">
            Don&apos;t have an account?{" "}
            <a href="/auth/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>

            <button
            onClick={handleSignIn}
            className="w-full mt-4 bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-full shadow hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2"
            >
            <svg
              className="w-5 h-5"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <g>
              <path
                fill="#4285F4"
                d="M44.5 20H24v8.5h11.7C34.7 32.9 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.5 6.2 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z"
              />
              <path
                fill="#34A853"
                d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.5 6.2 29.6 4 24 4c-7.2 0-13.4 4.1-16.7 10.7z"
              />
              <path
                fill="#FBBC05"
                d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.2-5.1C29.9 35.9 27.1 37 24 37c-6.1 0-10.7-4.1-12.5-9.6l-7 5.4C6.6 39.9 14.1 44 24 44z"
              />
              <path
                fill="#EA4335"
                d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.1 5.5-7.7 5.5-2.2 0-4.2-.7-5.8-2l-7 5.4C17.9 41.9 20.8 44 24 44c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z"
              />
              </g>
            </svg>
            Sign in with Google
            </button>

        </div>
      </main>
    </div>
  );
}