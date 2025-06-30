import Image from 'next/image';

export default function Header() {
    return (
        <header className="w-full flex items-center justify-between px-8 py-6 shadow-lg bg-gradient-to-r from-blue-100 via-white to-pink-100/80 backdrop-blur-md rounded-b-3xl border-b border-blue-200">
            <div className="flex items-center gap-4">
                <Image
                    src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=60&h=60"
                    alt="Wardrobe logo"
                    width={60}
                    height={60}
                    className="rounded-full border-2 border-pink-300 shadow"
                />
                <span className="text-3xl font-extrabold tracking-tight text-blue-700 drop-shadow-sm">
                    My <span className="text-pink-500">Virtual</span> Wardrobe
                </span>
            </div>
            <nav className="flex gap-8 text-blue-700 font-semibold items-center">
                <a href="/" className="relative px-3 py-1 rounded-full hover:bg-blue-50 hover:text-pink-500 transition font-medium group">
                    Home
                    <span className="absolute left-1/2 -bottom-1 w-0 h-1 bg-pink-400 rounded-full group-hover:w-2/3 transition-all duration-300 -translate-x-1/2"></span>
                </a>
                <a href="#" className="relative px-3 py-1 rounded-full hover:bg-blue-50 hover:text-pink-500 transition font-medium group">
                    My Closet
                    <span className="absolute left-1/2 -bottom-1 w-0 h-1 bg-pink-400 rounded-full group-hover:w-2/3 transition-all duration-300 -translate-x-1/2"></span>
                </a>
                <a href="#" className="relative px-3 py-1 rounded-full hover:bg-blue-50 hover:text-pink-500 transition font-medium group">
                    Outfit Picker
                    <span className="absolute left-1/2 -bottom-1 w-0 h-1 bg-pink-400 rounded-full group-hover:w-2/3 transition-all duration-300 -translate-x-1/2"></span>
                </a>
                <a href="#" className="relative px-3 py-1 rounded-full hover:bg-blue-50 hover:text-pink-500 transition font-medium group">
                    About
                    <span className="absolute left-1/2 -bottom-1 w-0 h-1 bg-pink-400 rounded-full group-hover:w-2/3 transition-all duration-300 -translate-x-1/2"></span>
                </a>
                {/* Search Icon Button */}
                <button
                    type="button"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 hover:bg-pink-100 transition border border-blue-200 shadow"
                    aria-label="Search"
                >
                    <svg
                        className="w-5 h-5 text-blue-700"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                        <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                <a
                    href="/auth/signup"
                    className="ml-4 bg-gradient-to-br from-pink-400 to-blue-400 text-white px-5 py-2 rounded-full shadow hover:scale-105 transition font-bold border-2 border-white"
                >
                    Sign Up
                </a>
            </nav>
        </header>
    );
}