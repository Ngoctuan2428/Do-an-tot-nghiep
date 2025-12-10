// src/components/ChallengeDetail.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChefHat, Clock, Loader2, Plus, Trophy } from "lucide-react";
import {
  getChallengeByHashtag,
  getChallengeParticipants,
} from "../services/challengeApi";
import RecipeCard from "./RecipeCard";
import SelectRecipeModal from "./SelectRecipeModal"; // ✅ Import Modal

const ChallengeDetail = () => {
  const { hashtag } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ State điều khiển Modal
  const [showJoinModal, setShowJoinModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [challengeRes, participantsRes] = await Promise.all([
        getChallengeByHashtag(hashtag),
        getChallengeParticipants(hashtag),
      ]);
      setChallenge(challengeRes.data.data);
      setParticipants(participantsRes.data.data.rows || []);
    } catch (error) {
      console.error("Lỗi tải chi tiết thử thách:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hashtag) fetchData();
  }, [hashtag]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="p-10 text-center text-gray-500">
        Không tìm thấy thử thách này.
      </div>
    );
  }

  const daysLeft = challenge.end_date
    ? Math.ceil(
        (new Date(challenge.end_date) - new Date()) / (1000 * 60 * 60 * 24)
      )
    : "∞";

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Banner & Info Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="relative h-48 md:h-80">
          <img
            src={
              challenge.image_url ||
              "https://placehold.co/800x400?text=Challenge"
            }
            alt={challenge.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <span className="bg-orange-500 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
              THỬ THÁCH
            </span>
            <h1 className="text-2xl md:text-4xl font-bold mb-2 shadow-black drop-shadow-md">
              {challenge.title}
            </h1>
            <p className="text-orange-200 font-medium text-lg">
              {challenge.hashtag}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 border-b border-gray-100 pb-6 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="text-orange-500" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Thời gian</p>
                <p>Còn {daysLeft} ngày</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-500" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Tham gia</p>
                <p>{participants.length} món</p>
              </div>
            </div>
          </div>

          <div className="prose max-w-none text-gray-700 mb-8 leading-relaxed">
            {challenge.description}
          </div>

          {/* ✅ Nút Mở Modal */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowJoinModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold text-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-orange-200 hover:-translate-y-1"
            >
              <Plus size={24} /> Gửi món tham gia ngay
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách món tham gia */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <ChefHat className="text-orange-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Các món đã tham gia
          </h2>
        </div>

        {participants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {participants.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id} // Đảm bảo truyền id để link hoạt động
                title={recipe.title}
                image={recipe.image_url || "https://placehold.co/300"}
                likes={recipe.likes}
                views={recipe.views}
                user={recipe.User} // Truyền thông tin user nếu RecipeCard hỗ trợ
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg mb-2">
              Chưa có món nào tham gia thử thách này.
            </p>
            <p className="text-gray-400">
              Hãy là người đầu tiên ghi tên mình lên bảng vàng!
            </p>
          </div>
        )}
      </div>

      {/* ✅ Modal Chọn Món */}
      <SelectRecipeModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        challengeHashtag={challenge.hashtag}
        onSuccess={fetchData} // Tải lại danh sách sau khi tham gia thành công
      />
    </div>
  );
};

export default ChallengeDetail;
