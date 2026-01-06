import { useNavigate } from 'react-router-dom';

import {
  Lock,
  Printer,
  MoreHorizontal,
  Edit,
  Upload,
  Users,
  Clock,
} from 'lucide-react';

import { useState } from 'react';
import { updateRecipe } from '../services/recipeApi';

export default function RecipeDraftView({ recipe }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Gọi API để cập nhật status
      await updateRecipe(recipe.id, { status: 'public' });
      alert('Đã lên sóng thành công!');
      // Tải lại trang để RecipeDetail hiển thị giao diện public
      window.location.reload();
    } catch (error) {
      console.error('Lỗi khi lên sóng:', error);
      alert('Đã xảy ra lỗi khi lên sóng.');
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/create-recipe`, { state: { recipeToEdit: recipe } });
  };

  let ingredients = [];
  let steps = [];
  try {
    ingredients =
      typeof recipe.ingredients === 'string' &&
      recipe.ingredients.startsWith('[')
        ? JSON.parse(recipe.ingredients)
        : Array.isArray(recipe.ingredients)
          ? recipe.ingredients
          : [];
  } catch (e) {
    console.error('Lỗi parse Ingredients:', e);
  }
  try {
    steps =
      typeof recipe.steps === 'string' && recipe.steps.startsWith('[')
        ? JSON.parse(recipe.steps)
        : Array.isArray(recipe.steps)
          ? recipe.steps
          : [];
  } catch (e) {
    console.error('Lỗi parse Steps:', e);
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* PHẦN 1: Ảnh (trái) và Thông tin (phải) */}
      <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-8">
        {/* Cột trái: Ảnh */}
        <div className="lg:sticky lg:top-20 h-fit">
          <img
            src={
              recipe.image_url || 'https://placehold.co/400x500?text=No+Image'
            }
            alt={recipe.title}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x500?text=Error';
            }}
          />
        </div>
        {/* Cột phải: Thông tin (Tiêu đề, Tác giả, Nút) */}
        <div>
          {/* Tiêu đề + Icon Khóa (Món nháp) */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Lock size={24} className="text-gray-600" />
            {recipe.title}
          </h1>

          {/* Thông tin tác giả */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-6 h-6 bg-green-200 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">
              {recipe.User?.username[0]?.toUpperCase() || 'A'}
            </span>
            <span className="text-sm font-medium">{recipe.User?.username}</span>
            <span className="text-sm text-gray-500">
              @{recipe.User?.username}
            </span>
          </div>

          {/* Các nút hành động */}
          <div className="flex items-center gap-2 py-4 border-b border-t">
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-cookpad-orange text-white rounded-md hover:bg-orange-500 text-sm font-medium flex items-center gap-2"
            >
              <Upload size={16} /> Lên sóng
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center gap-2"
            >
              <Edit size={16} /> Chỉnh sửa cách làm
            </button>
            <button className="p-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              <Printer size={16} />
            </button>
            <button className="p-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>{' '}
      </div>{' '}
      {/* PHẦN 2: Nguyên liệu và Hướng dẫn (Bên dưới) */}
      <div className="mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Phần Nguyên Liệu */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Nguyên Liệu</h2>
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-1" /> {recipe.servings || '—'}
              </div>
            </div>
            <ul className="space-y-3 text-gray-700">
              {ingredients.map((ingredientString, i) => (
                <li key={i} className="flex justify-between border-b pb-2">
                  <span>{ingredientString}</span>
                </li>
              ))}
              {ingredients.length === 0 && (
                <li className="text-gray-500 italic">Chưa có nguyên liệu.</li>
              )}
            </ul>
          </div>

          {/* Phần Hướng dẫn */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Hướng dẫn cách làm</h2>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-1" /> {recipe.cook_time || '—'}
              </div>
            </div>
            <ol className="space-y-6">
              {steps.map((step, i) => {
                // Kiểm tra xem 'step' là 'string' hay 'object'
                const isString = typeof step === 'string';
                const stepText = isString ? step : step.text;
                const stepImage = isString ? null : step.image;

                return (
                  <li key={i}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-semibold flex-shrink-0">
                        {i + 1}
                      </div>
                      {/* Hiển thị 'stepText' (đã kiểm tra) */}
                      <p className="text-gray-800 flex-1">{stepText}</p>
                    </div>

                    {/* Hiển thị 'stepImage' (đã kiểm tra) */}
                    {stepImage && (
                      <img
                        src={stepImage}
                        alt={`Bước ${i + 1}`}
                        className="mt-3 ml-11 w-full max-w-sm h-auto object-cover rounded-lg shadow-sm"
                      />
                    )}
                  </li>
                );
              })}
              {steps.length === 0 && (
                <li className="text-gray-500 italic">Chưa có hướng dẫn.</li>
              )}
            </ol>
          </div>
        </div>

        {/* Nút hành động (Lặp lại ở cuối) */}
        <div className="flex items-center gap-2 mt-8 py-4 border-t">
          <button
            onClick={handlePublish}
            className="px-4 py-2 bg-cookpad-orange text-white rounded-md hover:bg-orange-500 text-sm font-medium flex items-center gap-2"
          >
            <Upload size={16} /> Lên sóng
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center gap-2"
          >
            <Edit size={16} /> Chỉnh sửa cách làm
          </button>
          <button className="p-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
            <Printer size={16} />
          </button>
          <button className="p-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
            <MoreHorizontal size={16} />
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          ID Công thức: {recipe.id}
        </p>
      </div>
    </div>
  );
}
