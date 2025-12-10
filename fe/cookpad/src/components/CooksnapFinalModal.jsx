// src/components/CooksnapFinalModal.jsx
import { useState } from "react";
import { X, SendHorizontal, ArrowLeft } from "lucide-react";

export default function CooksnapFinalModal({
  imageSrc,
  recipeAuthorName = "Người dùng",
  onBack,
  onClose,
  onConfirm,
  loading,
}) {
  const [comment, setComment] = useState("");
  const [isFollowing, setIsFollowing] = useState(false); // Checkbox "Cũng tham gia bếp..."

  const handleSubmit = () => {
    onConfirm({ comment, isFollowing });
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-lg overflow-hidden flex flex-col max-h-[90vh] relative">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <h3 className="font-semibold text-gray-700">
            Bạn thích gì nhất ở món này?
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:bg-gray-100 p-1 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Image Preview */}
        <div className="flex-1 bg-black flex items-center justify-center overflow-hidden p-4">
          <img
            src={imageSrc}
            alt="Cooksnap Preview"
            className="max-w-full max-h-[60vh] object-contain rounded-md shadow-lg"
          />
        </div>

        {/* Footer Inputs */}
        <div className="p-4 border-t bg-white space-y-3">
          {/* Checkbox Follow (Optional) */}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isFollowing}
              onChange={(e) => setIsFollowing(e.target.checked)}
              className="rounded text-orange-500 focus:ring-orange-500"
            />
            Cũng tham gia bếp {recipeAuthorName}
          </label>

          {/* Comment Input */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Thêm bình luận (ngon quá, dễ làm...)"
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`absolute right-2 p-2 rounded-full transition-colors ${
                loading ? "text-gray-400" : "text-orange-500 hover:bg-orange-50"
              }`}
            >
              <SendHorizontal size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
