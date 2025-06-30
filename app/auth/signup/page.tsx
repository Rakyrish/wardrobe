'use client'
import Header from "@/app/layout/header/page";
import Footer from "@/app/layout/footer/page";
import { useState } from "react";
import { supabase } from "@/lib/supabase"; 

// Initialize Supabase client
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SignUpPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Basic validation
    // if (!username || !email|| !password) {
    //     setError("Please fill in all fields.");
    //     setIsLoading(false);
    //     return;
    // }
    if (!username) {
        setError("Username is required.");
        setIsLoading(false);
        return;
    }
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
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess("Registration successful! Please check your email to confirm your account.");
            setUsername("");
            setEmail("");
            setPassword("");
        }
    } catch (err: any) {
        console.log("Error during sign up:", err);
        
        setError("An unexpected error occurred. Please try again.");
    } finally {
        setIsLoading(false);
    }
};

  


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-blue-100 via-white to-pink-100/80 backdrop-blur-md border-b border-blue-200 shadow-md">
        <Header />
      </div>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-pink-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

          <form onSubmit={(e) => {
            e.preventDefault();
            setIsLoading(true);
            handleSubmit();
            // setTimeout(() => {
            //     setIsLoading(false);
            //     setSuccess("Registration successful!");
            //     setError("");
            // }, 2000); // Simulate a network request
            }}>
            <div className="mb-6">
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

              <label className="block text-sm font-semibold mb-2 text-pink-600" htmlFor="username">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-7 2-7 4v1a1 1 0 001 1h12a1 1 0 001-1v-1c0-2-3-4-7-4z" />
                  </svg>
                  Username
                </span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a8.963 8.963 0 01-6.879-3.196z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  id="username"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

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
                required
              />
            </div>

            <button
              type="submit"
            className="w-full bg-gradient-to-br from-pink-400 to-blue-400 text-white px-5 py-2 rounded-full shadow hover:scale-105 transition font-bold border-2 border-white"
            >
              {isLoading ? "Signing up..." : "Sign Up"}  
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <div className="w-full bg-white border-t border-blue-100 shadow-inner">
        <Footer />
      </div>
    </div>
  );
}
