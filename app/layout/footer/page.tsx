'use client'
import Image from 'next/image';

export default function Footer(){
    return(
        <footer className="w-full py-8 px-8 bg-gradient-to-r from-blue-50 via-white to-pink-100/80 backdrop-blur-md border-t border-blue-200 shadow-inner">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
        <Image
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=36&h=36"
          alt="Wardrobe logo"
          width={36}
          height={36}
          className="rounded-full border border-pink-300 shadow-sm"
        />
        <span className="font-bold text-blue-700 text-lg tracking-tight">
          My <span className="text-pink-500">Virtual</span> Wardrobe
        </span>
          </div>
          <nav className="flex flex-wrap gap-6 items-center text-blue-700 font-medium text-sm">
        <a href="#" className="hover:text-pink-500 transition">Privacy Policy</a>
        <a href="#" className="hover:text-pink-500 transition">Terms of Service</a>
        <a href="mailto:support@myvirtualwardrobe.com" className="hover:text-pink-500 transition">Contact Us</a>
        <a href="tel:+254746542197" className="hover:text-pink-500 transition flex items-center gap-1">
        <svg
            className="w-4 h-4 text-pink-400 animate-[vibrate_0.3s_linear_infinite]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.516 2.064a2 2 0 01-.45 1.958l-1.27 1.27a16.001 16.001 0 006.586 6.586l1.27-1.27a2 2 0 011.958-.45l2.064.516A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C9.163 23 1 14.837 1 5V4a2 2 0 012-2z"
            />
        </svg>
        <style jsx global>{`
            @keyframes vibrate {
                0% { transform: translate(0); }
                20% { transform: translate(-1px, 1px); }
                40% { transform: translate(-1px, -1px); }
                60% { transform: translate(1px, 1px); }
                80% { transform: translate(1px, -1px); }
                100% { transform: translate(0); }
            }
        `}</style>
          +254 746 542197
        </a>
          </nav>
          <span className="text-gray-500 text-xs mt-4 md:mt-0 text-center md:text-right">
        © {new Date().getFullYear()} My Virtual Wardrobe. All rights reserved.
          </span>
        </div>
      </footer>
    )
}