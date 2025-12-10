// src/components/CooksnapModal.jsx
import { useState, useRef } from "react";
import { X, Soup, Loader2, Camera } from "lucide-react";
import { uploadMedia } from "../services/uploadApi";
import { sendCooksnap } from "../services/recipeApi";
import { useRecipeCounts } from "../contexts/RecipeCountContext";
// Import các modal con
import ImageCropperModal from "./ImageCropperModal";
import CooksnapFinalModal from "./CooksnapFinalModal"; // ✅ Component mới

export default function CooksnapModal({
  recipeId,
  recipeAuthorName,
  onClose,
  onSuccess,
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { refreshCounts } = useRecipeCounts();

  // State quản lý các bước
  const [step, setStep] = useState(1); // 1: Chọn file, 2: Cắt ảnh, 3: Bình luận
  const [selectedImage, setSelectedImage] = useState(null); // Base64 ảnh gốc
  const [croppedBlob, setCroppedBlob] = useState(null); // Blob sau khi cắt
  const [croppedPreview, setCroppedPreview] = useState(null); // URL để preview ảnh đã cắt

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  // 1. Chọn file -> Chuyển sang Step 2 (Cắt ảnh)
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setSelectedImage(reader.result);
        setStep(2); // Chuyển bước
      });
      reader.readAsDataURL(file);
    }
    event.target.value = null;
  };

  // 2. Cắt xong -> Chuyển sang Step 3 (Bình luận)
  const handleCropComplete = (blob) => {
    setCroppedBlob(blob);
    setCroppedPreview(URL.createObjectURL(blob)); // Tạo URL tạm để hiển thị
    setStep(3); // Chuyển bước
  };

  // 3. Xác nhận gửi -> Upload -> API
  const handleFinalSubmit = async ({ comment, isFollowing }) => {
    setUploading(true);
    try {
      // A. Upload ảnh
      const file = new File([croppedBlob], "cooksnap.jpg", {
        type: "image/jpeg",
      });
      const uploadRes = await uploadMedia(file);
      const imageUrl = uploadRes.data.url;

      // B. Gửi Cooksnap kèm comment
      await sendCooksnap(recipeId, imageUrl, comment);

      // C. Xử lý follow nếu user tick chọn (Optional)
      if (isFollowing) {
        // Gọi API follow nếu cần (cần import followUser từ userApi)
        // await followUser(authorId);
      }

      await refreshCounts();
      alert("Gửi Cooksnap thành công!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi gửi Cooksnap:", error);
      alert("Gửi thất bại. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  // --- RENDER THEO STEP ---

  // STEP 1: Chọn File (Modal gốc)
  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] animate-fade-in">
        <div className="absolute inset-0" onClick={onClose}></div>
        <div className="bg-white rounded-xl p-6 w-96 relative shadow-2xl z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Soup className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Gửi Cooksnap
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Chia sẻ hình ảnh thành phẩm của bạn để truyền cảm hứng cho cộng
              đồng!
            </p>
            <button
              onClick={handleChooseFile}
              className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" /> Chọn Hình
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  // STEP 2: Cắt Ảnh
  if (step === 2) {
    return (
      <ImageCropperModal
        imageSrc={selectedImage}
        onClose={() => setStep(1)} // Quay lại chọn hình
        onCropComplete={handleCropComplete}
      />
    );
  }

  // STEP 3: Bình luận & Gửi (Final)
  if (step === 3) {
    return (
      <CooksnapFinalModal
        imageSrc={croppedPreview}
        recipeAuthorName={recipeAuthorName}
        onBack={() => setStep(2)} // Quay lại cắt ảnh
        onClose={onClose}
        onConfirm={handleFinalSubmit}
        loading={uploading}
      />
    );
  }

  return null;
}
