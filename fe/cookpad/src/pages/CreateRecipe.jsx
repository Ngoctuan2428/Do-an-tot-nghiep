import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Camera, Trash2, Upload, Loader2, Save, X } from "lucide-react";
import IngredientList from "../components/IngredientList";
import StepList from "../components/StepList";
import {
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../services/recipeApi";

// Import API services
import { uploadMedia } from "../services/uploadApi";
import { getCurrentUser } from "../services/userApi";
import { useRecipeCounts } from "../contexts/RecipeCountContext";

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export default function CreateRecipe() {
  const navigate = useNavigate();
  const { refreshCounts } = useRecipeCounts();

  const location = useLocation();
  const recipeToEdit = location.state?.recipeToEdit;
  const isEditMode = !!recipeToEdit; // Cờ (flag) chế độ Chỉnh sửa

  let initialIngredients = [];
  let initialSteps = [];

  if (recipeToEdit) {
    try {
      const ingredientsData = recipeToEdit.ingredients;

      if (Array.isArray(ingredientsData)) {
        initialIngredients = ingredientsData;
      } else if (
        typeof ingredientsData === "string" &&
        ingredientsData.startsWith("[")
      ) {
        initialIngredients = JSON.parse(ingredientsData);
      } else {
        initialIngredients = [];
      }
    } catch (e) {
      console.error("Lỗi parse ingredients khi sửa:", e);
    }

    try {
      // Xử lý Steps (JSON)
      const stepsData = recipeToEdit.steps;
      if (Array.isArray(stepsData)) {
        initialSteps = stepsData.map((s) => ({ ...s, id: s.id || uid() }));
      } else if (typeof stepsData === "string" && stepsData.startsWith("[")) {
        initialSteps = JSON.parse(stepsData).map((s) => ({
          ...s,
          id: s.id || uid(),
        }));
      } else {
        initialSteps = [];
      }
    } catch (e) {
      console.error("Lỗi parse steps khi sửa:", e);
    }
  }

  // Khởi tạo state với dữ liệu (nếu có)
  const [title, setTitle] = useState(recipeToEdit?.title || "");
  const [desc, setDesc] = useState(recipeToEdit?.description || "");
  const [imageUrl, setImageUrl] = useState(recipeToEdit?.image_url || null);
  const [imageFile, setImageFile] = useState(null);

  // State của Ingredients/Steps
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [steps, setSteps] = useState(initialSteps);
  const [serving, setServing] = useState(recipeToEdit?.servings || "2 người");

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Đã lưu");
  const [user, setUser] = useState(null);

  // Lấy dữ liệu user thật khi component tải
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data.data);
      } catch (error) {
        console.error("Không thể tải thông tin user:", error);
      }
    };
    fetchUser();
  }, []);

  // Cập nhật state khi chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  // --- Hàm Chung để tạo Payload ---
  const createPayload = async (status) => {
    let finalImageUrl = imageUrl;
    if (imageFile) {
      const uploadRes = await uploadMedia(imageFile);
      finalImageUrl = uploadRes.data.url;
    }

    const ingredientsList = ingredients.flatMap((section) =>
      section.items.map((item) => item.text)
    );
    const stepsList = steps.map((s) => ({
      text: s.text,
      image: s.image || null,
    }));

    return {
      title: title || "Không đề",
      description: desc,
      image_url: finalImageUrl,
      ingredients: JSON.stringify(ingredientsList),
      servings: serving,
      steps: stepsList,
      status: status,
    };
  };

  // --- Sửa handlePublish ---
  const handlePublish = async () => {
    setLoading(true);
    setSaveStatus("Đang lưu...");
    try {
      const payload = await createPayload("public");
      let response;

      if (isEditMode) {
        response = await updateRecipe(recipeToEdit.id, payload);
      } else {
        response = await createRecipe(payload);
      }

      await refreshCounts();
      setSaveStatus("Đã lưu");
      setLoading(false);
      alert("Đăng món thành công!");
      navigate(`/recipes/${response.data.data.id}`);
    } catch (error) {
      setLoading(false);
      setSaveStatus("Lỗi!");
      console.error("Lỗi khi đăng món:", error);
      alert(
        `Đã xảy ra lỗi: '${error.response?.data?.message || error.message}'`
      );
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setSaveStatus("Đang lưu (Nháp)...");
    try {
      const payload = await createPayload("draft");

      if (isEditMode) {
        await updateRecipe(recipeToEdit.id, payload);
      } else {
        await createRecipe(payload);
      }

      await refreshCounts();
      setSaveStatus("Đã lưu");
      setLoading(false);
      alert("Đã lưu bản nháp thành công!");
      navigate("/recipes/all");
    } catch (error) {
      setLoading(false);
      setSaveStatus("Lỗi!");
      console.error("Lỗi khi lưu nháp:", error);
      alert(
        `Đã xảy ra lỗi: '${error.response?.data?.message || error.message}'`
      );
    }
  };

  const handleDelete = async () => {
    if (!isEditMode) {
      alert("Công thức này chưa được lưu!");
      return;
    }

    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa công thức này? Hành động này không thể hoàn tác."
      )
    ) {
      setLoading(true);
      setSaveStatus("Đang xóa...");
      try {
        await deleteRecipe(recipeToEdit.id);
        await refreshCounts();
        alert("Xóa công thức thành công!");
        navigate("/recipes/all");
      } catch (error) {
        setLoading(false);
        setSaveStatus("Lỗi!");
        console.error("Lỗi khi xóa công thức:", error);
        alert(
          `Đã xảy ra lỗi: '${error.response?.data?.message || error.message}'`
        );
      }
    }
  };

  // Hiển thị loading trong khi chờ lấy thông tin user
  if (!user) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ height: "calc(100vh - 70px)" }}
      >
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="bg-white lg:bg-gray-50">
      {/* Header (Nút Lên Sóng, Lưu, Xóa) */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="p-2 lg:hidden">
              <X size={20} />
            </button>
            <span className="text-sm text-gray-500">{saveStatus}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md border border-red-300 text-red-500 hover:bg-red-50 text-sm font-medium flex items-center gap-2"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">Xóa</span>
            </button>
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50 text-sm font-medium"
              disabled={loading}
            >
              Lưu và Đóng
            </button>
            <button
              onClick={handlePublish}
              disabled={
                loading ||
                !title.trim() ||
                !ingredients?.length ||
                !steps?.length ||
                steps.some((step) => !step.text?.trim())
              }
              className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 text-sm font-medium flex items-center gap-2 disabled:bg-orange-300"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {loading ? "Đang xử lý..." : "Lên sóng"}
            </button>
          </div>
        </div>
      </div>

      {/* Bố cục 2 cột (Grid) */}
      <div className="max-w-7xl mx-auto p-4 lg:grid lg:grid-cols-[min(35%,300px)_1fr] lg:gap-8">
        {/* CỘT TRÁI (Ảnh và Nguyên liệu) */}
        <div className="lg:sticky lg:top-20 h-fit">
          {/* Box Ảnh */}
          <div className="relative mb-6">
            <label
              htmlFor="file-upload"
              className="cursor-pointer aspect-[3/4] bg-orange-50 border rounded-md flex items-center justify-center text-center p-4 text-gray-600"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="preview"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Camera className="w-10 h-10 mb-2 text-gray-400" />
                  <p className="font-medium">
                    Bạn đã đăng hình món mình nấu ở đây chưa?
                  </p>
                </div>
              )}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <IngredientList
            ingredientsData={initialIngredients}
            // onChange={setIngredients}
            onChange={({ sections, serving }) => {
              setIngredients(sections);
              setServing(serving);
            }}
          />
        </div>

        {/* CỘT PHẢI (Tiêu đề, Mô tả, Các bước) */}
        <div className="mt-6 lg:mt-0">
          {/* Tiêu đề */}
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tên món: Món canh bí ngon nhất nhà mình"
            rows={1}
            className="w-full text-2xl md:text-3xl font-bold border-0 border-b-2 border-gray-200 p-2 focus:ring-0 focus:border-orange-400 resize-none overflow-hidden"
            style={{ height: "auto", minHeight: "54px" }}
          />

          {/* Tác giả (Sử dụng 'user' từ state) */}
          <div className="flex items-center gap-3 my-4">
            <img
              src={user.avatar_url || "https://placehold.co/40"}
              alt="author"
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = "https://placehold.co/40";
              }}
            />
            <div>
              <div className="font-semibold text-gray-800">{user.username}</div>
              <div className="text-sm text-gray-500">@{user.username}</div>
            </div>
          </div>

          {/* Mô tả (Story) */}
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Hãy chia sẻ với mọi người về món này của bạn nhé..."
            rows={3}
            className="w-full text-base border-0 border-b-2 border-gray-200 p-2 focus:ring-0 focus:border-orange-400 resize-none"
          />

          <p className="text-xs text-gray-500 mt-1 px-2">
            Để tham gia thử thách, hãy thêm hashtag (ví dụ:{" "}
            <span className="text-orange-500">#monchay7ngay</span>) vào đây nhé!
          </p>

          {/* Box Các Bước */}
          <div className="mt-8">
            <StepList stepsData={steps} onChange={setSteps} />
          </div>
        </div>
      </div>
    </div>
  );
}
