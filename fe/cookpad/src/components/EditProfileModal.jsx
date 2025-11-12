// src/components/EditProfileModal.jsx
import { useState, useEffect } from "react";
import { X, Camera, Loader2 } from "lucide-react";
import { uploadMedia } from "../services/uploadApi";
import { updateUser } from "../services/userApi"; // Đảm bảo userApi đã có hàm này

export default function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateSuccess,
}) {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Đồng bộ state với dữ liệu currentUser khi mở modal
  useEffect(() => {
    if (isOpen && currentUser) {
      setDisplayName(currentUser.username || "");
      setBio(currentUser.bio || "");
      setAvatarUrl(currentUser.avatar_url || "");
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  // Xử lý chọn ảnh và upload ngay lập tức để lấy URL preview
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadMedia(file);
      setAvatarUrl(res.data.url); // Hiển thị ảnh vừa upload
    } catch (error) {
      console.error("Lỗi upload avatar:", error);
      alert("Không thể tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  // Lưu tất cả thông tin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser({
        username: displayName,
        bio: bio,
        avatar_url: avatarUrl,
      });
      onUpdateSuccess?.(); // Gọi callback để trang cha tải lại dữ liệu
      onClose();
    } catch (error) {
      console.error("Lỗi cập nhật profile:", error);
      alert("Cập nhật thất bại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4 animate-fade-in">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Sửa hồ sơ</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form
            id="edit-profile-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer">
                <img
                  src={avatarUrl || "https://placehold.co/100x100?text=U"}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 group-hover:border-orange-100 transition-colors"
                />
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border cursor-pointer hover:bg-gray-50 transition-colors">
                  {uploading ? (
                    <Loader2
                      size={20}
                      className="animate-spin text-orange-500"
                    />
                  ) : (
                    <Camera size={20} className="text-gray-600" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tên hiển thị
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition"
                required
                placeholder="Nhập tên hiển thị của bạn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Giới thiệu
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Chia sẻ đôi điều về bạn, món ăn yêu thích..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none resize-none transition"
              />
            </div>
          </form>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            type="button"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="edit-profile-form"
            disabled={saving || uploading}
            className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {saving && <Loader2 size={18} className="animate-spin" />}
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
