// src/pages/Interactions.jsx
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import InteractionItem from "../components/InteractionItem";
import { getInteractions } from "../services/interactionApi"; // Import API mới

export default function Interactions() {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const res = await getInteractions();
        setInteractions(res.data.data || []);
      } catch (error) {
        console.error("Lỗi tải tương tác:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Tương tác</h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : interactions.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              Bạn chưa có tương tác mới nào.
            </p>
          ) : (
            <ul className="space-y-0">
              {interactions.map((interaction, index) => (
                <InteractionItem
                  key={`${interaction.type}-${interaction.item.id}-${index}`}
                  interaction={interaction}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
