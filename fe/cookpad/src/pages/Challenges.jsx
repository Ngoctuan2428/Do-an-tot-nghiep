// src/pages/Challenges.jsx
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import ChallengeItem from "../components/ChallengeItem";
// ✅ Import API
import { getAllChallenges } from "../services/challengeApi";

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await getAllChallenges();
        setChallenges(res.data.data.rows || []); // ✅ Thêm .rows
      } catch (error) {
        console.error("Lỗi tải thử thách:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Danh sách thử thách
          </h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {challenges.map((challenge) => (
                <ChallengeItem
                  key={challenge.id}
                  id={challenge.id}
                  img={
                    challenge.image_url ||
                    "https://placehold.co/300x200?text=Challenge"
                  }
                  title={challenge.title}
                  hashtag={challenge.hashtag} // ✅ Truyền hashtag
                  // Tạm thời giữ mock data cho 2 trường này vì model chưa có
                  daysLeft={
                    challenge.end_date
                      ? Math.ceil(
                          (new Date(challenge.end_date) - new Date()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : "∞"
                  }
                  number={0} // Sẽ cần API đếm participants
                />
              ))}
            </ul>
          )}
        </div>
        {/* ... (phần thống kê giữ nguyên) ... */}
      </div>
    </div>
  );
}
