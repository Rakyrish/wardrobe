"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

            // useEffect(() => {

            const handleGetStarted = () => {
              const fetchUser = async () => {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error || !user) {
                  router.push("/auth/login");
                  return;
                }
                const { data, error: dbError } = await supabase
                  .from("users")
                  .select("username")
                  .eq("id", user.id)
                  .single();
                if (data && !dbError) {
                  setUsername(data.username);
                } else {
                  setUsername(user.user_metadata?.username || user.email);
                }
                setIsLoading(false);
              };


              fetchUser();
              router.push("/wardrobe/add");
            }
            // }, [router]);}

            // const handleGetStarted = () => {
            //   router.push("/wardrobe/add");
            // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-100 flex flex-col items-center justify-between font-[family-name:var(--font-geist-sans)]">
      <main className="flex-1 flex flex-col-reverse md:flex-row items-center justify-center gap-16 px-8 py-12 w-full max-w-6xl">
        <div className="flex-1 flex flex-col items-center md:items-start gap-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-2 text-center md:text-left">
            Organize your wardrobe.<br />
            <span
              className="text-pink-500 animate-pulse inline-block"
              style={{ animationDuration: "1.5s" }}
            >
              Pick the perfect outfit.
            </span>
            </h1>
            <p className="text-lg text-gray-700 max-w-md text-center md:text-left">
            Store your clothes virtually, create outfits, and let us help you decide what to wear every day. Your closet, always at your fingertips.
            </p>
          <div className="flex gap-4 mt-4">
            <a
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow transition"
            >
              Get Started
            </a>
            <a
              href="#"
              className="bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 font-semibold px-6 py-3 rounded-full shadow transition"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Image
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=420&q=80"
            alt="Virtual wardrobe illustration"
            width={420}
            height={340}
            className="rounded-2xl shadow-lg border border-blue-100"
            priority
          />
        </div>
      </main>

      {/* Animated Gallery Section */}
      <section className="w-full max-w-6xl mx-auto py-12 px-8">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Featured Outfits</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=300&q=80", alt: "Casual Outfit" },
            { src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=300&q=80", alt: "Business Attire" },
            { src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=300&q=80", alt: "Summer Look" },
            { src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80", alt: "Evening Wear" },
          ].map((item, idx) => (
            <div
              key={item.src}
              className="group relative overflow-hidden rounded-xl shadow-lg border border-blue-100 bg-white transition-transform duration-300 hover:scale-105"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={300}
                height={220}
                className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/70 to-transparent px-4 py-2 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.alt}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full max-w-6xl mx-auto py-12 px-8">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <div className="flex-1 flex flex-col items-center text-center gap-2">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-blue-700">1</span>
            </div>
            <h3 className="font-semibold text-lg text-blue-700">Upload Clothes</h3>
            <p className="text-gray-600">Add photos of your clothes to your virtual closet.</p>
          </div>
          <div className="flex-1 flex flex-col items-center text-center gap-2">
            <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-pink-500">2</span>
            </div>
            <h3 className="font-semibold text-lg text-pink-500">Create Outfits</h3>
            <p className="text-gray-600">Mix and match items to build your favorite looks.</p>
          </div>
          <div className="flex-1 flex flex-col items-center text-center gap-2">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-blue-700">3</span>
            </div>
            <h3 className="font-semibold text-lg text-blue-700">Pick & Plan</h3>
            <p className="text-gray-600">Let us suggest outfits or plan your week in advance.</p>
          </div>
        </div>
      </section>

      {/* New: Inspiration Section */}
      <section className="w-full max-w-6xl mx-auto py-12 px-8">
        <h2 style={{ animationDuration: "1.5s" }} className=" animate-bounce text-3xl font-bold text-pink-600 mb-6 text-center">Style Inspiration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-xl overflow-hidden shadow-lg bg-white">
            <Image
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"
              alt="Street Style"
              width={400}
              height={260}
              className="object-cover w-full h-56"
            />
            <div className="p-4">
              <h3 className="font-bold text-blue-700 mb-2">Street Style</h3>
              <p className="text-gray-600">Discover the latest trends in urban fashion and get inspired for your next look.</p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg bg-white">
            <Image
              src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
              alt="Minimalist"
              width={400}
              height={260}
              className="object-cover w-full h-56"
            />
            <div className="p-4">
              <h3 className="font-bold text-blue-700 mb-2">Minimalist</h3>
              <p className="text-gray-600">Embrace simplicity with clean lines and neutral tones for a timeless wardrobe.</p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg bg-white">
            <Image
              src="https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=400&q=80"
              alt="Boho Chic"
              width={400}
              height={260}
              className="object-cover w-full h-56"
            />
            <div className="p-4">
              <h3 className="font-bold text-blue-700 mb-2">Boho Chic</h3>
              <p className="text-gray-600">Get inspired by bohemian patterns, flowing fabrics, and earthy accessories.</p>
            </div>
          </div>
        </div>
      </section>

      {/* New: Testimonials Section */}
      <section className="w-full max-w-4xl mx-auto py-12 px-8">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <Image
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="User testimonial"
              width={64}
              height={64}
              className="rounded-full mb-4"
            />
            <p className="text-gray-700 italic mb-2">
              “This app made organizing my closet so easy! I love planning my outfits in advance.”
            </p>
            <span className="font-semibold text-blue-700">— Jane M.</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <Image
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User testimonial"
              width={64}
              height={64}
              className="rounded-full mb-4"
            />
            <p className="text-gray-700 italic mb-2">
              “The outfit suggestions are spot on. I never have to worry about what to wear!”
            </p>
            <span className="font-semibold text-blue-700">— Alex K.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
