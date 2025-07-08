'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AddWardrobeItem() {
    const [itemType, setItemType] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        if (!itemType) {
            setError("Please select an item type.");
            setIsLoading(false);
            return;
        }
        if (!file) {
            setError("Please upload an image.");
            setIsLoading(false);
            return;
        }

        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                setError("You must be logged in to add items.");
                setIsLoading(false);
                router.push("/auth/login");
                return;
            }

            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch("/api/upload-image", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) {
                setError(result.error || "Failed to upload image.");
                setIsLoading(false);
                return;
            }

            const { error: dbError } = await supabase.from("wardrobe_items").insert([
                {
                    user_id: user.id,
                    item_type: itemType,
                    image_url: result.url,
                    description: description || null,
                },
            ]);

            if (dbError) {
                setError("Failed to save item: " + dbError.message);
                setIsLoading(false);
                return;
            }

            setSuccess("Item added successfully!");
            setItemType("");
            setFile(null);
            setDescription("");
            setTimeout(() => router.push("/wardrobe/mycloset"), 2000);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
            console.error("Add item error:", errorMessage);
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100">
            <main className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="relative bg-white/90 p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-blue-100">
                    {/* Decorative gradient circle */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-200 via-blue-200 to-white rounded-full opacity-40 blur-2xl pointer-events-none" />
                    <h2 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 drop-shadow-lg">
                        Add Wardrobe Item
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-7">
                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-2 animate-shake">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 11-2 0V9a1 1 0 012 0v4zm-1-6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-2 animate-pulse">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{success}</span>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-blue-700" htmlFor="itemType">
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                                    </svg>
                                    Item Type
                                </span>
                            </label>
                            <select
                                id="itemType"
                                value={itemType}
                                onChange={(e) => setItemType(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-gray-50 transition"
                                required
                            >
                                <option value="">Select item type</option>
                                <option value="shirt">Shirt</option>
                                <option value="pants">Pants</option>
                                <option value="shoes">Shoes</option>
                                <option value="socks">Socks</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-blue-700" htmlFor="file">
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Upload Image
                                </span>
                            </label>
                            <input
                                type="file"
                                id="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-gray-50 transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-blue-700" htmlFor="description">
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    Description (Optional)
                                </span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                id="description"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-gray-50 transition resize-none min-h-[80px]"
                                placeholder="Enter item description"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-br from-pink-400 via-blue-400 to-purple-400 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition font-bold text-lg border-2 border-white focus:outline-none focus:ring-4 focus:ring-pink-200 active:scale-95"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Adding Item...
                                </span>
                            ) : (
                                "Add Item"
                            )}
                        </button>
                    </form>
                </div>
            </main>
            
            <style jsx global>{`
                @keyframes shake {
                    10%, 90% { transform: translateX(-1px); }
                    20%, 80% { transform: translateX(2px); }
                    30%, 50%, 70% { transform: translateX(-4px); }
                    40%, 60% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.5s;
                }
            `}</style>
        </div>
    );
}