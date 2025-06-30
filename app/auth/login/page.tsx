import Header from "@/app/layout/header/page";
import Footer from "@/app/layout/footer/page";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-blue-100 via-white to-pink-100/80 backdrop-blur-md border-b border-blue-200 shadow-md">
        <Header />
      </div>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-pink-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          <form>
            <div className="mb-6">
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
                  type="text"
                  id="username"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition"
                  placeholder="Enter your username"
                  required
                />
                </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
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
              Login
            </button>
            </form>
            <p className="mt-4 text-sm text-gray-600 text-center">
              Don't have an account?{" "}
              <a href="/auth/signup" className="text-blue-600 hover:underline">
                Sign Up
              </a>
            </p>
            </div>
            </main>
        {/* Footer */}
        <div className="w-full bg-gradient-to-r from-blue-100 via-white to-pink-100/80 backdrop-blur-md border-t border-blue-200 shadow-md">
          <Footer />
        </div>
        </div>
    );
    }
    