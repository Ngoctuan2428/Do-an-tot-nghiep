import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart } from 'lucide-react';
import { getRecipeCooksnaps, getRecipeById } from '../services/recipeApi';

export default function CooksnapList() {
  const { id } = useParams(); // Recipe ID
  const navigate = useNavigate();
  const [cooksnaps, setCooksnaps] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recipeRes, snapsRes] = await Promise.all([
          getRecipeById(id),
          getRecipeCooksnaps(id),
        ]);
        setRecipe(recipeRes.data.data);
        setCooksnaps(snapsRes.data.data || []);
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;
  if (!recipe)
    return <div className="p-8 text-center">Không tìm thấy món ăn.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Header: Nút quay lại + Ảnh món ăn nhỏ + Tiêu đề */}
      <div className="mb-8 text-center">
        <div className="relative h-32 w-full overflow-hidden rounded-lg mb-4">
          {/* Ảnh banner món ăn (cắt lấy phần giữa) */}
          <img
            src={recipe.image_url || 'https://placehold.co/800x200'}
            alt={recipe.title}
            className="w-full h-full object-cover blur-sm opacity-50 absolute top-0 left-0"
          />
          <img
            src={recipe.image_url || 'https://placehold.co/800x200'}
            alt={recipe.title}
            className="h-full object-contain mx-auto relative z-10 shadow-md"
          />
        </div>

        <p className="text-sm text-gray-500 uppercase font-medium mb-1">
          Cooksnap cho
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          <Link
            to={`/recipes/${id}`}
            className="hover:underline hover:text-orange-600"
          >
            {recipe.title}
          </Link>
        </h1>
      </div>

      {/* Danh sách Cooksnap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cooksnaps.map((snap) => (
          <div
            key={snap.id}
            className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col"
          >
            {/* Ảnh Cooksnap */}
            <Link to={`/cooksnaps/${snap.id}`} className="block relative group">
              <img
                src={snap.image_url}
                alt="psnap"
                className="w-full h-64 object-cover bg-gray-100 transition duration-300 group-hover:opacity-90"
              />
            </Link>

            <div className="p-4 flex flex-col flex-1">
              {/* Người gửi */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={snap.User?.avatar_url || 'https://placehold.co/40'}
                  alt={snap.User?.username}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {snap.User?.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(snap.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* Bình luận */}
              {snap.comment && (
                <p className="text-gray-700 text-sm mb-4 flex-1">
                  {snap.comment}
                </p>
              )}

              {/* Nút Like (UI only) */}
              <div className="pt-3 border-t flex items-center gap-2 mt-auto">
                <button className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                  <Heart size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cooksnaps.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          Chưa có Psnap nào. Hãy là người đầu tiên!
        </p>
      )}
    </div>
  );
}
