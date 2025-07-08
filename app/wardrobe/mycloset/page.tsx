'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ClosetDisplay from "../../../component/ClosetDisplay";

interface WardrobeItem {
  id: string;
  item_type: string;
  image_url: string;
  description: string | null;
  created_at: string;
}

export default function WardrobePage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  const fetchItems = async (userId: string) => {
    const { data, error: dbError } = await supabase
      .from("wardrobe_items")
      .select("id, item_type, image_url, description, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (dbError) {
      setError("Failed to load wardrobe items: " + dbError.message);
      console.error('Fetch items error:', dbError.message);
      return;
    }

    setItems(data || []);
  };

  useEffect(() => {
    const fetchUserAndItems = async () => {
      // Check authentication
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session || !session.user) {
        console.error('Session error:', authError?.message || 'No session found');
        router.push("/auth/login");
        return;
      }
      if(items.length < 0) {
        setIsLoading(false);
        return; // Items already fetched, no need to refetch  
      }

      // Store access token
      setAccessToken(session.access_token);

      // Fetch username
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("username")
        .eq("id", session.user.id)
        .single();
      if (userData && !userError) {
        setUsername(userData.username);
      } else {
        setUsername(session.user.user_metadata?.username || session.user.email);
        console.error('User fetch error:', userError?.message);
      }

      await fetchItems(session.user.id);
      setIsLoading(false);
    };

    fetchUserAndItems();
  }, [router]);

  const handleAddItem = () => {
    router.push("/wardrobe/add");
  };

  const handleDeleteItem = async (itemId: string, imageUrl: string) => {
    setLoading(true);
  if (!accessToken) {
    setError("Please log in again.");
    console.error("No access token");
    router.push("/auth/login");
    return;
  }

  try {
    console.log("Deleting item:", { itemId, imageUrl });
    const response = await fetch("/api/delete-item", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ itemId, imageUrl }),
    });
    setIsLoading(true);

    if (!response.ok) {
      const result = await response.json();
      setError(result.error || "Failed to delete item");
      console.error("Delete response error:", result.error);
      return;
    }

    
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred";
    console.error("Delete item error:", errorMessage);
    setError(errorMessage);
  }finally {
    setLoading(false);
  }
};


  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <main className="flex flex-1 items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex flex-1 flex-col items-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-pink-100">
        <ClosetDisplay
          items={items}
          username={username}
          loading={loading}
          error={error}
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
        />
      </main>
    </div>
  );
}