import {
  Camera,
  ThumbsUp,
  Heart,
  Hand,
  Soup,
  Bookmark,
  MoreHorizontal,
  Share2,
  Printer,
  X,
  User,
  MapPin,
  SendHorizontal,
  MessageCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { Link } from "react-router-dom"; // ✅ Import Link

// ✅ 1. Import API và Context cần thiết
import { getComments, createComment } from "../services/commentApi";
//import { useRecipeCounts } from "../contexts/RecipeCountContext"; // Lấy thông tin user hiện tại nếu có lưu, hoặc dùng API

function CommentItem({ comment, recipeId, onReplySuccess, currentUserAvatar }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  // ✅ Tạo URL profile cho người bình luận
  const userProfileUrl = comment.User?.id ? `/user/${comment.User.id}` : "#";

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;
    try {
      setSubmittingReply(true);
      // Gọi API tạo bình luận với parent_id
      await createComment(recipeId, {
        content: replyContent,
        parent_id: comment.id, // ✅ Truyền ID của bình luận cha
      });
      setReplyContent("");
      setIsReplying(false);
      onReplySuccess(); // Gọi callback để tải lại danh sách
    } catch (error) {
      console.error("Lỗi gửi phản hồi:", error);
      alert("Gửi phản hồi thất bại. Vui lòng đăng nhập.");
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="flex gap-3">
      {/* Avatar người bình luận */}
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
          {/* ✅ Tên người bình luận có Link */}
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

        {/* Hành động (Like, Phản hồi, Thời gian) */}
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

        {/* Form nhập phản hồi (Chỉ hiện khi bấm nút Phản hồi) */}
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

        {/* ✅ Hiển thị các phản hồi con (Replies) */}
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

export default function CooksnapSection({ recipe }) {
  // ✅ Tạo URL profile cho tác giả công thức
  const authorProfileUrl = recipe.User?.id ? `/user/${recipe.User.id}` : "#";

  const [isFriend, setIsFriend] = useState(false);
  // Trạng thái mỗi loại reaction (đã bấm hay chưa)
  // const [likes, setLikes] = useState({ liked: false, count: 7 });
  // const [hearts, setHearts] = useState({ liked: false, count: 9 });
  // const [claps, setClaps] = useState({ liked: false, count: 5 });
  const fileInputRef = useRef(null);

  // ✅ 2. State cho phần bình luận
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Lấy thông tin user hiện tại (để hiển thị avatar cạnh ô nhập)
  // Giả sử bạn đã có cách lấy user hiện tại, tạm thời dùng placeholder hoặc lấy từ localStorage/Context
  const currentUserAvatar = "https://placehold.co/40x40?text=Me";

  const fetchComments = async () => {
    try {
      // Không set loading true ở đây để tránh nháy trang khi refresh sau khi reply
      const res = await getComments(recipe.id);
      setComments(res.data.data.rows || []);
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  };

  // ✅ 3. Fetch bình luận khi tải trang
  useEffect(() => {
    if (recipe?.id) {
      setLoadingComments(true);
      fetchComments().finally(() => setLoadingComments(false));
    }
  }, [recipe?.id]);

  // ✅ 4. Xử lý gửi bình luận
  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await createComment(recipe.id, { content: newComment });
      setNewComment(""); // Xóa ô nhập
      await fetchComments(); // Tải lại danh sách bình luận
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

  // Xử lý nhấn Enter để gửi
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  // Mở file picker khi click nút “Chọn hình”
  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Xử lý file được chọn
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`Đã chọn hình: ${file.name}`);
      // Tại đây bạn có thể upload hoặc preview file
    }
  };

  // Toggle hàm
  // const toggle = (type) => {
  //   if (type === "like") {
  //     setLikes((prev) => ({
  //       liked: !prev.liked,
  //       count: prev.count + (prev.liked ? -1 : 1),
  //     }));
  //   } else if (type === "heart") {
  //     setHearts((prev) => ({
  //       liked: !prev.liked,
  //       count: prev.count + (prev.liked ? -1 : 1),
  //     }));
  //   } else if (type === "clap") {
  //     setClaps((prev) => ({
  //       liked: !prev.liked,
  //       count: prev.count + (prev.liked ? -1 : 1),
  //     }));
  //   }
  // };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10 border-t border-gray-200">
      {/* <div className="flex items-center gap-2 text-gray-600 mb-3">
        <button
          onClick={() => toggle("like")}
          className={`flex items-center gap-1 transition ${
            likes.liked ? "text-blue-500" : "hover:text-blue-400"
          }`}
        >
          <ThumbsUp
            className={`w-4 h-4 ${
              likes.liked ? "fill-blue-500 text-blue-500" : ""
            }`}
          />
          <span>{likes.count}</span>
        </button>

        <button
          onClick={() => toggle("heart")}
          className={`flex items-center gap-1 transition ${
            hearts.liked ? "text-red-500" : "hover:text-red-400"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${
              hearts.liked ? "fill-red-500 text-red-500" : ""
            }`}
          />
          <span>{hearts.count}</span>
        </button>

        <button
          onClick={() => toggle("clap")}
          className={`flex items-center gap-1 transition ${
            claps.liked ? "text-yellow-500" : "hover:text-yellow-400"
          }`}
        >
          <Hand
            className={`w-4 h-4 ${
              claps.liked ? "fill-yellow-500 text-yellow-500" : ""
            }`}
          />
          <span>{claps.count}</span>
        </button>
      </div> */}

      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold">Cooksnap</h3>
          <Camera className="w-6 h-6 text-gray-600" />
        </div>
        <p className="text-gray-700 mb-3">
          Bạn đã làm theo món này phải không? Hãy chia sẻ hình ảnh và cảm nhận
          của bạn!
        </p>
        <button
          className="bg-black text-white px-5 py-2 rounded-lg mx-auto block mb-2 hover:bg-gray-800"
          onClick={handleChooseFile}
        >
          Gửi Cooksnap
          <input
            ref={fileInputRef}
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </button>
        <a href="#" className="text-blue-500 text-sm block text-center">
          Tìm hiểu thêm về Cooksnap
        </a>
      </div>

      <p className="text-center text-gray-400 text-sm mt-6">
        ID Công thức: {recipe.id}
      </p>

      {/* ✅ CẬP NHẬT THÔNG TIN TÁC GIẢ Ở GIỮA TRANG */}
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
            <p className="text-gray-600 text-sm">
              {recipe.author?.joined ? `vào ${recipe.author.joined}` : ""}
              {recipe.author?.location ? ` · ${recipe.author.location}` : ""}
            </p>
            <button
              onClick={() => setIsFriend(!isFriend)}
              className={`mt-2 px-4 py-1 rounded-lg text-sm border border-gray-300 ${
                isFriend ? "text-black bg-white" : "bg-gray-700 text-white"
              }`}
            >
              {isFriend ? "Bạn bếp" : "Kết bạn bếp"}
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 text-gray-700">{recipe.author?.bio || ""}</p>

      {/* PHẦN BÌNH LUẬN */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-6">
          Bình luận ({comments.length})
        </h3>

        {/* Ô nhập bình luận chính */}
        <div className="flex items-start gap-3 mb-8">
          <img
            src={currentUserAvatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            onError={(e) =>
              (e.target.src = "https://placehold.co/40x40?text=Me")
            }
          />
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-500 resize-none overflow-hidden min-h-[48px]"
              rows={1}
              style={{ height: "auto", minHeight: "48px" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
            <button
              onClick={handleSendComment}
              disabled={submitting || !newComment.trim()}
              className={`absolute right-3 bottom-3 p-1 rounded-full transition-colors ${
                newComment.trim()
                  ? "text-orange-500 hover:bg-orange-50"
                  : "text-gray-300"
              }`}
            >
              <SendHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Danh sách bình luận */}
        <div className="space-y-6">
          {loadingComments ? (
            <p className="text-gray-500">Đang tải bình luận...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 italic">Chưa có bình luận nào.</p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                recipeId={recipe.id}
                onReplySuccess={fetchComments} // Truyền hàm refresh xuống
                currentUserAvatar={currentUserAvatar}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
