// src/components/CooksnapSection.jsx
import { Camera, SendHorizontal, MessageCircle, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getComments, createComment } from "../services/commentApi";
import { followUser, unfollowUser, getUserById } from "../services/userApi";
import { useAuth } from "../contexts/AuthContext";
import CooksnapModal from "./CooksnapModal"; // ✅ Đảm bảo đã import Modal mới

// Component con hiển thị từng comment (Giữ nguyên logic cũ của bạn)
function CommentItem({ comment, recipeId, onReplySuccess, currentUserAvatar }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const userProfileUrl = comment.User?.id ? `/user/${comment.User.id}` : "#";

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;
    try {
      setSubmittingReply(true);
      await createComment(recipeId, {
        content: replyContent,
        parent_id: comment.id,
      });
      setReplyContent("");
      setIsReplying(false);
      onReplySuccess();
    } catch (error) {
      console.error("Lỗi gửi phản hồi:", error);
      alert("Gửi phản hồi thất bại. Vui lòng đăng nhập.");
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Link to={userProfileUrl} className="flex-shrink-0">
        <img
          src={comment.User?.avatar_url || "https://placehold.co/40x40?text=U"}
          alt={comment.User?.username}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
          onError={(e) => (e.target.src = "https://placehold.co/40x40?text=U")}
        />
      </Link>
      <div className="flex-1">
        <div className="bg-gray-100 rounded-2xl px-4 py-2 inline-block max-w-full">
          <Link
            to={userProfileUrl}
            className="font-semibold text-sm text-gray-900 hover:text-cookpad-orange hover:underline"
          >
            {comment.User?.username || "Người dùng ẩn danh"}
          </Link>
          <p className="text-gray-800 mt-0.5 whitespace-pre-wrap text-sm md:text-base">
            {comment.content}
          </p>
        </div>
        <div className="text-xs text-gray-500 mt-1 ml-4 flex gap-3 items-center">
          <span>
            {new Date(comment.created_at).toLocaleDateString("vi-VN")}
          </span>
          <button className="font-semibold hover:underline hover:text-cookpad-orange">
            Thích
          </button>
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="font-semibold hover:underline hover:text-cookpad-orange flex items-center gap-1"
          >
            <MessageCircle size={14} /> Phản hồi
          </button>
        </div>
        {isReplying && (
          <div className="flex items-start gap-2 mt-3 ml-2">
            <img
              src={currentUserAvatar}
              alt="me"
              className="w-6 h-6 rounded-full object-cover"
              onError={(e) =>
                (e.target.src = "https://placehold.co/30x30?text=Me")
              }
            />
            <div className="flex-1 relative">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Phản hồi ${comment.User?.username}...`}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500 resize-none"
                rows={1}
                autoFocus
              />
              <button
                onClick={handleSendReply}
                disabled={submittingReply || !replyContent.trim()}
                className="absolute right-2 bottom-2 text-orange-500 hover:text-orange-600 disabled:text-gray-300"
              >
                <SendHorizontal size={16} />
              </button>
            </div>
          </div>
        )}
        {comment.Replies && comment.Replies.length > 0 && (
          <div className="mt-3 space-y-3 ml-2 md:ml-6 border-l-2 border-gray-200 pl-3">
            {comment.Replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                recipeId={recipeId}
                onReplySuccess={onReplySuccess}
                currentUserAvatar={currentUserAvatar}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- COMPONENT CHÍNH ---
export default function CooksnapSection({ recipe }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const authorProfileUrl = recipe.User?.id ? `/user/${recipe.User.id}` : "#";
  const [isFriend, setIsFriend] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  // State comment
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // State điều khiển Modal Cooksnap
  const [showCooksnapModal, setShowCooksnapModal] = useState(false);

  const currentUserAvatar = "https://placehold.co/40x40?text=Me";

  const fetchComments = async () => {
    try {
      const res = await getComments(recipe.id);
      setComments(res.data.data.rows || []);
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  };

  // 🔥 Kiểm tra trạng thái follow ban đầu
  useEffect(() => {
    if (!recipe?.User?.id) {
      return;
    }

    // Nếu chính mình
    if (user && user.id === recipe.User.id) {
      setIsFriend(false);
      return;
    }

    // Fetch user profile để get is_following status
    // Có thể call API ngay cả khi chưa login (middleware optionalAuth sẽ xử lý)
    const checkFollowStatus = async () => {
      try {
        const res = await getUserById(recipe.User.id);
        const userData = res.data.data;
        setIsFriend(userData.is_following || false);
      } catch (error) {
        console.error("Lỗi kiểm tra trạng thái follow:", error);
        setIsFriend(false);
      }
    };

    checkFollowStatus();
  }, [recipe?.User?.id, user?.id]);

  useEffect(() => {
    if (recipe?.id) {
      setLoadingComments(true);
      fetchComments().finally(() => setLoadingComments(false));
    }
  }, [recipe?.id]);

  // 🔥 Xử lý Follow/Unfollow
  const handleToggleFollow = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để kết bạn!");
      navigate("/login");
      return;
    }

    if (!recipe?.User?.id) return;

    // Không thể follow chính mình
    if (user.id === recipe.User.id) {
      alert("Bạn không thể kết bạn với chính mình!");
      return;
    }

    try {
      setLoadingFollow(true);

      if (isFriend) {
        // Unfollow
        await unfollowUser(recipe.User.id);
        setIsFriend(false);
      } else {
        // Follow
        await followUser(recipe.User.id);
        setIsFriend(true);
      }
    } catch (error) {
      console.error("Lỗi thay đổi trạng thái bạn bếp:", error);
      alert("Không thể thay đổi trạng thái bạn bếp. Vui lòng thử lại.");
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    try {
      setSubmitting(true);
      await createComment(recipe.id, { content: newComment });
      setNewComment("");
      await fetchComments();
    } catch (error) {
      console.error("Lỗi gửi bình luận:", error);
      if (error.response && error.response.status === 401) {
        alert("Vui lòng đăng nhập để bình luận!");
      } else {
        alert("Gửi bình luận thất bại. Vui lòng thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10 border-t border-gray-200">
      {/* Box Cooksnap */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold">Cooksnap</h3>
          <Camera className="w-6 h-6 text-gray-600" />
        </div>
        <p className="text-gray-700 mb-3">
          Bạn đã làm theo món này phải không? Hãy chia sẻ hình ảnh và cảm nhận
          của bạn!
        </p>

        {/* NÚT MỞ MODAL */}
        <button
          className="bg-black text-white px-5 py-2 rounded-lg mx-auto block mb-2 hover:bg-gray-800 transition-colors"
          onClick={() => setShowCooksnapModal(true)}
        >
          Gửi Cooksnap
        </button>

        <a href="#" className="text-blue-500 text-sm block text-center">
          Tìm hiểu thêm về Cooksnap
        </a>
      </div>

      <p className="text-center text-gray-400 text-sm mt-6">
        ID Công thức: {recipe.id}
      </p>

      {/* Thông tin tác giả */}
      {recipe.User && (
        <div className="flex items-center gap-4 mt-8 p-4 bg-gray-50 rounded-xl">
          <Link to={authorProfileUrl} className="flex-shrink-0">
            <img
              src={
                recipe.User?.avatar_url || "https://placehold.co/80x80?text=U"
              }
              alt={recipe.User?.username}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white shadow-sm"
              onError={(e) =>
                (e.target.src = "https://placehold.co/80x80?text=U")
              }
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link
              to={authorProfileUrl}
              className="font-semibold text-lg hover:text-cookpad-orange hover:underline block truncate"
            >
              {recipe.User?.username || "Ẩn danh"}
            </Link>
            <p className="text-gray-600 text-sm line-clamp-2 mt-1">
              {recipe.User?.bio || "Thành viên yêu bếp núc."}
            </p>
            <button
              onClick={handleToggleFollow}
              disabled={loadingFollow}
              className={`mt-2 px-4 py-1 rounded-lg text-sm border transition-all flex items-center gap-2 ${
                isFriend
                  ? "text-black bg-white border-gray-300 hover:bg-gray-50"
                  : "bg-gray-700 text-white border-gray-700 hover:bg-gray-800"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loadingFollow && <Loader2 size={14} className="animate-spin" />}
              {isFriend ? "Bạn bếp" : "Kết bạn bếp"}
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 text-gray-700">{recipe.author?.bio || ""}</p>

      {/* Phần Bình luận */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-6">
          Bình luận ({comments.length})
        </h3>
        <div className="flex items-start gap-3 mb-8">
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-500 resize-none overflow-hidden min-h-[48px]"
              placeholder="Viết bình luận..."
            />
            <button
              onClick={handleSendComment}
              className="absolute right-3 bottom-3 text-orange-500"
            >
              <SendHorizontal />
            </button>
          </div>
        </div>
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              recipeId={recipe.id}
              onReplySuccess={fetchComments}
              currentUserAvatar={currentUserAvatar}
            />
          ))}
        </div>
      </div>

      {/* ✅ HIỂN THỊ MODAL COOKSNAP (Tích hợp tính năng mới) */}
      {showCooksnapModal && (
        <CooksnapModal
          recipeId={recipe.id}
          recipeAuthorName={recipe.User?.username || "Đầu bếp"} // ✅ Truyền thêm prop này
          onClose={() => setShowCooksnapModal(false)}
          onSuccess={() => {
            console.log("Cooksnap sent successfully");
            // Bạn có thể thêm logic reload trang hoặc fetch lại data ở đây nếu cần
          }}
        />
      )}
    </section>
  );
}
