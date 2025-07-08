'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ClosetDisplay from "../../component/ClosetDisplay";
import Image from "next/image";

interface WardrobeItem {
  id: string;
  item_type: string;
  image_url: string;
  description: string | null;
  created_at: string;
}

// Define allowed categories
type OutfitCategory = 'shirt' | 'pants' | 'shoes' | 'socks';
type Outfit = Record<OutfitCategory, WardrobeItem | undefined>;

export default function OutfitPickerPage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit>({
    shirt: undefined,
    pants: undefined,
    shoes: undefined,
    socks: undefined,
  });
  const router = useRouter();

  const fetchItems = async (userId: string) => {
    const { data, error: dbError } = await supabase
      .from("wardrobe_items")
      .select("id, item_type, image_url, description, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (dbError) {
      setError("Failed to load wardrobe items: " + dbError.message);
      console.error("Fetch items error:", dbError.message);
      return;
    }

    setItems(data || []);
  };

  useEffect(() => {
    const fetchUserAndItems = async () => {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session || !session.user) {
        console.error("Session error:", authError?.message || "No session found");
        router.push("/auth/login");
        return;
      }

      console.log("User ID:", session.user.id);

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
        console.error("User fetch error:", userError?.message);
      }

      // Fetch wardrobe items
      await fetchItems(session.user.id);
      setIsLoading(false);
    };

    fetchUserAndItems();
  }, [router]);

  const handleAddItem = () => {
    router.push("/wardrobe/add");
  };

  const handleDeleteItem = async (itemId: string, imageUrl: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      setError("No access token available. Please log in again.");
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
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ itemId, imageUrl }),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || "Failed to delete item");
        console.error("Delete response error:", result.error);
        return;
      }

      // Refresh items after deletion
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await fetchItems(user.id);
      }

      // Remove deleted item from selected outfit
      setSelectedOutfit((prev) => {
        const newOutfit = { ...prev };
        (Object.keys(newOutfit) as OutfitCategory[]).forEach((key) => {
          if (newOutfit[key]?.id === itemId) {
            newOutfit[key] = undefined;
          }
        });
        return newOutfit;
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      console.error("Delete item error:", errorMessage);
      setError(errorMessage);
    }
  };

  const handleSelectItem = (item: WardrobeItem) => {
    setSelectedOutfit((prev) => ({
      ...prev,
      [item.item_type as OutfitCategory]: item,
    }));
  };

  const handleGenerateOutfit = () => {
    const categories: OutfitCategory[] = ["shirt", "pants", "shoes", "socks"];
    const newOutfit: Outfit = {
      shirt: undefined,
      pants: undefined,
      shoes: undefined,
      socks: undefined,
    };

    categories.forEach((category) => {
      const categoryItems = items.filter((item) => item.item_type === category);
      if (categoryItems.length > 0) {
        const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
        newOutfit[category] = randomItem;
      }
    });

    setSelectedOutfit(newOutfit);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <main className="flex flex-1 items-center justify-center">
          <p className="text-gray-600 justify-center align-center ">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex flex-1 flex-col items-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-pink-100">
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
            Outfit Picker
          </h2>
          <div className="text-center mb-8">
            <button
              onClick={handleGenerateOutfit}
              className="bg-gradient-to-br from-pink-400 to-blue-400 text-white px-6 py-3 rounded-full shadow hover:scale-105 transition font-bold border-2 border-white"
            >
              Generate Outfit
            </button>
          </div>

          {/* Outfit Preview */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">Selected Outfit</h3>
            {Object.keys(selectedOutfit).length === 0 ||
            !Object.values(selectedOutfit).some((item) => item) ? (
              <p className="text-gray-600">No items selected. Click an item or generate an outfit!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {(Object.keys(selectedOutfit) as OutfitCategory[]).map((category) => (
                  <div key={category} className="text-center">
                    <h4 className="text-lg font-medium text-blue-600 capitalize mb-2">{category}</h4>
                    {selectedOutfit[category] ? (
                      <div>
                        <Image
                          src={selectedOutfit[category]!.image_url}
                          alt={selectedOutfit[category]!.item_type}
                          width={150}
                          height={150}
                          className="w-full h-36 object-cover rounded-md mb-2"
                        />
                        <p className="text-gray-600 text-sm">
                          {selectedOutfit[category]!.description || "No description"}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No {category} selected</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wardrobe Items */}
          <ClosetDisplay
            items={items}
            username={username}
            error={error}
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteItem}
            onSelectItem={handleSelectItem}
            loading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}