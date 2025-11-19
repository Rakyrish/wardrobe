'use client';
import Image from "next/image";

interface WardrobeItem {
  id: string;
  item_type: string;
  image_url: string;
  description: string | null;
  created_at: string;
}

interface ClosetDisplayProps {
  items: WardrobeItem[];
  username: string | null;
  error: string;
  loading: boolean;
  onAddItem: () => void;
  onDeleteItem: (itemId: string, imageUrl: string) => void;
  onSelectItem?: (item: WardrobeItem) => void;
}

export default function ClosetDisplay({
  items,
  username,
  error,
  loading,
  onAddItem,
  onDeleteItem,
  onSelectItem,
}: ClosetDisplayProps) {
  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        {username ? `${username}'s Wardrobe` : "Your Wardrobe"}
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 max-w-md mx-auto">
          <svg className="inline-block w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 11-2 0V9a1 1 0 012 0v4zm-1-6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your wardrobe is empty. Add some items to get started!</p>
          <button
            onClick={onAddItem}
            className="bg-gradient-to-br from-pink-400 to-blue-400 text-white px-6 py-3 rounded-full shadow hover:scale-105 transition font-bold border-2 border-white"
          >
            Add Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-4 border border-blue-200 hover:shadow-lg transition"
            >
              <Image
                src={item.image_url}
                alt={item.item_type}
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold text-blue-700 capitalize">{item.item_type}</h3>
              <p className="text-gray-600 text-sm">{item.description || "No description"}</p>
              <p className="text-gray-400 text-xs mt-2">
                Added: {new Date(item.created_at).toLocaleDateString()}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {onSelectItem && (
                  <button
                    onClick={() => onSelectItem(item)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition font-semibold"
                  >
                    Select
                  </button>
                )}
                <button
                  onClick={() => onDeleteItem(item.id, item.image_url)}
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded-full shadow hover:bg-red-600 transition font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={onAddItem}
            className="bg-gradient-to-br from-pink-400 to-blue-400 text-white px-6 py-3 rounded-full shadow hover:scale-105 transition font-bold border-2 border-white"
          >
            Add More Items
          </button>
        </div>
      )}
    </div>
  );
}
