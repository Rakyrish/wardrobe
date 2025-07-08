'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch user and username on mount and auth state changes
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
        return;
      }
      if (user) {
        setUser(user);
        // Fetch username from public.users table
        const { data, error: dbError } = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single();
        if (data && !dbError) {
          setUsername(data.username);
        } else {
          setUsername(user.user_metadata?.username || user.email); // Fallback to user_metadata or email
        }
      }
    };

    fetchUser();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('users')
          .select('username')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            setUsername(data && !error ? data.username : session.user.user_metadata?.username || session.user.email);
          });
      } else {
        setUsername(null);
      }
    });

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    router.push('/');
  };

  return (
    <header className="w-full flex items-center justify-between px-8 py-6 shadow-lg bg-gradient-to-r from-blue-100 via-white to-pink-100/80 backdrop-blur-md rounded-b-3xl border-b border-blue-200">
      <div className="flex items-center gap-4">
        <a href="/">
        <Image
          onClick={() => router.push('/')}
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=60&h=60"
          alt="Wardrobe logo"
          width={60}
          height={60}
          className="rounded-full border-2 border-pink-300 shadow"
        /></a>
        <a href='/' >
        <span className="text-3xl font-extrabold tracking-tight text-blue-700 drop-shadow-sm">
          My <span className="text-pink-500">Virtual</span> Wardrobe
        </span>
        </a>
      </div>
      <nav className="flex gap-8 text-blue-700 font-semibold items-center">
        {/* <a
          href="/"
          className="relative px-3 py-1 rounded-full hover:bg-blue-50 hover:text-pink-500 transition font-medium group"
        >
          Home
          <span className="absolute left-1/2 -bottom-1 w-0 h-1 bg-pink-400 rounded-full group-hover:w-2/3 transition-all duration-300 -translate-x-1/2"></span>
        </a> */}
        <a
          href="/wardrobe/mycloset"
          className="relative  px-3 py-1 rounded-full hover:bg-blue-50 hover:text-pink-500 transition font-medium group"
        >
          My Closet
          <span className="absolute left-1/2 -bottom-1 w-0 h-1 bg-pink-400 rounded-full group-hover:w-2/3 transition-all duration-300 -translate-x-1/2"></span>
        </a>
        <a
          href="/outfit-picker"
          className="relative px-3 py-1 rounded-full hover:bg-blue-50 hover:text-pink-500 transition font-medium group"
        >
          Outfit Picker
          <span className="absolute left-1/2 -bottom-1 w-0 h-1 bg-pink-400 rounded-full group-hover:w-2/3 transition-all duration-300 -translate-x-1/2"></span>
        </a>
        <a
          href="/weather"
          className="relative px-3 py-1 rounded-full hover:bg-blue-50 hover:text-pink-500 transition font-medium group"
        >
          Weather
          <span className="absolute left-1/2 -bottom-1 w-0 h-1 bg-pink-400 rounded-full group-hover:w-2/3 transition-all duration-300 -translate-x-1/2"></span>
        </a>
        {/* <a
          href="#"
          className="relative px-3 py-1 rounded-full hover:bg-blue-50 hover:text-pink-500 transition font-medium group"
        >
          About
          <span className="absolute left-1/2 -bottom-1 w-0 h-1 bg-pink-400 rounded-full group-hover:w-2/3 transition-all duration-300 -translate-x-1/2"></span>
        </a> */}
        {/* <button
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
        </button> */}
        {user ? (
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-green-400 to-blue-700 text-white px-1 py-2 rounded-full shadow-lg hover:scale-105 transition font-extrabold border-2 border-white ring-2 ring-yellow-200/60 animate-pulse"
              style={{ boxShadow: '0 4px 24px 0 rgba(192, 193, 255, 0.25)' }}
            >
              <span className="text-lg flex items-center">
          <svg className="w-6 h-6 mr-1 text-yellow-300 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.5-9.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-7 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm7.07 4.75a5.978 5.978 0 01-7.14 0 .75.75 0 10-.93 1.18 7.478 7.478 0 008.99 0 .75.75 0 10-.93-1.18z" />
          </svg>
          Welcome, <span className="ml-1 text-yellow-100 drop-shadow">{username || 'User'}!</span>
              </span>
              <span className="ml-2 text-xs bg-yellow-200 text-pink-700 px-2 py-0.5 rounded-full font-semibold shadow-sm animate-pulse">
          😊 We're so glad you're here!
              </span>
              <svg
          className="ml-2 w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
              >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-blue-200">
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-blue-700 hover:bg-blue-50 hover:text-pink-500 transition"
          >
            Sign Out
          </button>
                {/* Add more dropdown items here if needed */}
                {/* <a href="/profile" className="block px-4 py-2 text-blue-700 hover:bg-blue-50 hover:text-pink-500 transition">
                  Profile
                </a> */}
              </div>
            )}
          </div>
        ) : (
          <a
            href="/auth/login"
            className="ml-4 bg-gradient-to-br from-pink-400 to-blue-400 text-white px-5 py-2 rounded-full shadow hover:scale-105 transition font-bold border-2 border-white"
          >
            Login
          </a>
        )}
      </nav>
    </header>
  );
}