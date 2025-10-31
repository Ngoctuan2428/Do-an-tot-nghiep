// src/pages/CreateRecipe.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Trash2, Upload, Loader2 } from "lucide-react";
import IngredientList from "../components/IngredientList";
import StepList from "../components/StepList";

// 1. Import các API service cần thiết
import { createRecipe } from "../services/recipeApi";
import { uploadMedia } from "../services/uploadApi";

// 2. Import Hook
import { useRecipeCounts } from "../contexts/RecipeCountContext";

export default function CreateRecipe() {
  const navigate = useNavigate(); // Hook để chuyển trang

  // 3. Lấy hàm 'refreshCounts' từ Context
  const { refreshCounts } = useRecipeCounts();

  // --- 4. Quản lý State ---
  const [title, setTitle] = useState(""); // Tiêu đề
  const [desc, setDesc] = useState(""); // Mô tả
  const [imageUrl, setImageUrl] = useState(null); // URL ảnh (để xem trước)
  const [imageFile, setImageFile] = useState(null); // File ảnh (để upload)

  // State để nhận dữ liệu từ 2 component con
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);

  const [loading, setLoading] = useState(false); // State xử lý loading

  // Thông tin user giả (bạn có thể thay bằng API /auth/me sau)
  const user = {
    name: "Page One",
    username: "cook_114380624",
    avatar: "https://i.pravatar.cc/100?img=45",
  };

  // Cập nhật state khi chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file)); // Tạo URL xem trước
      setImageFile(file); // Lưu file để upload
    }
  };

  // --- 5. Hàm xử lý "Lên Sóng" ---
  const handlePublish = async () => {
    setLoading(true);
    let finalImageUrl = null;

    try {
      // BƯỚC 1: Upload ảnh (nếu có)
      if (imageFile) {
        // 'uploadMedia' trả về { data: { url: '...' } }
        // (Đảm bảo uploadApi.js đã được sửa để thêm 'multipart/form-data' header)
        const uploadRes = await uploadMedia(imageFile);
        finalImageUrl = uploadRes.data.url; // Lấy URL từ phản hồi
      }

      // BƯỚC 2: Định dạng (flatten) dữ liệu từ component con
      // Chuyển [{ id, title, items: [{ id, text }] }] -> ["250g bột", "100ml nước"]
      const ingredientsList = ingredients.flatMap((section) =>
        section.items.map((item) => item.text)
      );

      // Chuyển [{ id, text, image }] -> ["Trộn bột...", "Đậy kín..."]
      const stepsList = steps.map((step) => step.text);

      // BƯỚC 3: Tạo payload gửi đi
      const payload = {
        title: title,
        description: desc,
        image_url: finalImageUrl,
        ingredients: JSON.stringify(ingredientsList), // Gửi chuỗi JSON (fix lỗi TEXT)
        steps: stepsList, // Gửi mảng (Model BE là JSON)
        status: "public", // 'public' nghĩa là "Đã lên sóng"
      };

      // BƯỚC 4: Gọi API tạo công thức
      const response = await createRecipe(payload);

      // 6. SAU KHI THÀNH CÔNG: Gọi hàm refresh
      await refreshCounts(); // YÊU CẦU CẬP NHẬT COUNT MỚI

      setLoading(false);
      alert("Đăng món thành công!");

      // Chuyển đến trang chi tiết món ăn vừa tạo
      navigate(`/recipes/${response.data.data.id}`);
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi đăng món:", error);
      alert(`Đã xảy ra lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="p-8 w-full px-4 md:px-10 bg-white">
      {/* Top Header */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          className="border border-red-400 text-red-500 px-4 py-1.5 rounded-md hover:bg-red-50 flex items-center gap-2"
          disabled={loading}
        >
          <Trash2 className="w-4 h-4" /> Xóa
        </button>
        <button
          className="border text-gray-600 px-4 py-1.5 rounded-md hover:bg-gray-50"
          disabled={loading}
        >
          Lưu và Đóng
        </button>

        {/* Nút "Lên sóng" */}
        <button
          onClick={handlePublish}
          disabled={loading || !title} // Vô hiệu hóa nếu đang tải hoặc chưa có tiêu đề
          className="bg-orange-500 text-white px-4 py-1.5 rounded-md hover:bg-orange-600 flex items-center gap-2 disabled:bg-orange-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {loading ? "Đang xử lý..." : "Lên sóng"}
        </button>
      </div>

      {/* Main section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Image upload */}
        <div className="flex flex-col items-center justify-center border rounded-md bg-orange-50 aspect-[3/4]">
          {!imageUrl ? (
            <label
              htmlFor="file"
              className="flex flex-col items-center justify-center cursor-pointer text-gray-600 text-center p-6"
            >
              <Camera className="w-10 h-10 mb-2 text-gray-400" />
              <p className="font-medium">
                Bạn đã đăng hình món mình nấu ở đây chưa?
              </p>
              <p className="text-sm text-gray-500">
                Chia sẻ với mọi người thành phẩm nấu nướng của bạn!
              </p>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          ) : (
            <img
              src={imageUrl}
              alt="preview"
              className="w-full h-full object-cover rounded-md"
            />
          )}
        </div>

        {/* Right: Title + description */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold border-0 border-b w-full focus:ring-0 focus:border-orange-400 mb-4"
            placeholder="Tên món..."
          />

          {/* Author info */}
          <div className="flex items-center gap-2 mb-4">
            <img
              src={user.avatar}
              alt="user"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </div>

          {/* Description */}
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Hãy chia sẻ với mọi người về món này của bạn nhé..."
            className="w-full border rounded-md p-3 text-gray-700 h-24 focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      {/* Ingredients + Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        {/* 7. Truyền prop 'onChange' để nhận dữ liệu */}
        <IngredientList onChange={setIngredients} />
        <StepList onChange={setSteps} />
      </div>
    </div>
  );
}
