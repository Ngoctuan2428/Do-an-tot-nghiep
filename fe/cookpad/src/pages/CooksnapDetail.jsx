// src/pages/CooksnapDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Save, X } from 'lucide-react';
import {
  getCooksnapById,
  updateCooksnap,
  deleteCooksnap,
} from '../services/recipeApi';
import { getCurrentUser } from '../services/userApi';

export default function CooksnapDetail() {
  const { id } = useParams(); // Cooksnap ID
  const navigate = useNavigate();

  const [cooksnap, setCooksnap] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // State cho việc chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [snapRes, userRes] = await Promise.all([
          getCooksnapById(id),
          getCurrentUser().catch(() => ({ data: { data: null } })), // Bỏ qua lỗi nếu chưa login
        ]);

        setCooksnap(snapRes.data.data);
        setEditComment(snapRes.data.data.comment || '');
        setCurrentUser(userRes.data.data);
      } catch (error) {
        console.error('Lỗi tải psnap:', error);
        alert('Không tìm thấy psnap này.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleUpdate = async () => {
    try {
      await updateCooksnap(id, { comment: editComment });
      setCooksnap((prev) => ({ ...prev, comment: editComment }));
      setIsEditing(false);
      alert('Đã cập nhật thành công!');
    } catch (error) {
      alert('Cập nhật thất bại.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa Cooksnap này không?'))
      return;
    try {
      await deleteCooksnap(id);
      alert('Đã xóa thành công.');
      navigate(-1); // Quay lại trang trước
    } catch (error) {
      alert('Xóa thất bại.');
    }
  };

  if (loading) return <div className="p-10 text-center">Đang tải...</div>;
  if (!cooksnap) return null;

  // Kiểm tra quyền sở hữu
  const isOwner = currentUser && currentUser.id === cooksnap.user_id;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold">Chi tiết Cooksnap</h1>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Cột trái: Ảnh */}
        <div className="md:w-1/2 bg-black flex items-center justify-center">
          <img
            src={cooksnap.image_url}
            alt="Cooksnap"
            className="max-h-[600px] w-full object-contain"
          />
        </div>

        {/* Cột phải: Thông tin */}
        <div className="md:w-1/2 p-6 flex flex-col">
          {/* Món ăn gốc */}
          <div className="mb-6 pb-4 border-b">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">
              Món ăn
            </p>
            <Link
              to={`/recipes/${cooksnap.Recipe.id}`}
              className="font-bold text-lg text-gray-800 hover:text-orange-600 hover:underline"
            >
              {cooksnap.Recipe.title}
            </Link>
          </div>

          {/* Người đăng */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={cooksnap.User.avatar_url || 'https://placehold.co/50'}
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div>
              <p className="font-bold text-gray-900">
                {cooksnap.User.username}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(cooksnap.created_at).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>

          {/* Nội dung Comment */}
          <div className="flex-1">
            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-500"
                  rows={4}
                  placeholder="Nhập cảm nhận của bạn..."
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-1"
                  >
                    <Save size={14} /> Lưu
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 italic text-lg leading-relaxed">
                "{cooksnap.comment || 'Không có mô tả'}"
              </p>
            )}
          </div>

          {/* Nút hành động (Chỉ hiện với chủ sở hữu) */}
          {isOwner && !isEditing && (
            <div className="mt-auto pt-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                <Edit2 size={16} /> Sửa
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium"
              >
                <Trash2 size={16} /> Xóa
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
