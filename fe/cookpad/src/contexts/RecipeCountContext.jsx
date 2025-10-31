// src/contexts/RecipeCountContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
// Import API (đã có sẵn) để lấy số lượng
import { getRecipeCounts } from "../services/recipeApi";

// 1. Tạo Context
const RecipeCountContext = createContext();

// 2. Tạo Provider (Component cha)
export function RecipeCountProvider({ children }) {
  const [counts, setCounts] = useState({}); // VD: { all: 0, saved: 0, mine: 0, ... }
  const [loading, setLoading] = useState(true);

  // 3. Hàm gọi API để lấy số lượng mới nhất
  const refreshCounts = useCallback(async () => {
    try {
      setLoading(true);
      // Giả sử API trả về: { data: { all: 5, mine: 2, published: 2, ... } }
      const response = await getRecipeCounts();
      setCounts(response.data.data || {}); // Lưu kết quả vào state
    } catch (error) {
      console.error("Failed to fetch recipe counts:", error);
      // Nếu lỗi (vd: chưa đăng nhập), có thể trả về state rỗng
      setCounts({});
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. Tự động gọi hàm này khi app khởi động
  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  // 5. Cung cấp state và hàm refresh cho các component con
  const value = { counts, loading, refreshCounts };

  return (
    <RecipeCountContext.Provider value={value}>
      {children}
    </RecipeCountContext.Provider>
  );
}

// 6. Tạo Hook (để component con dễ sử dụng)
export function useRecipeCounts() {
  const context = useContext(RecipeCountContext);
  if (context === undefined) {
    throw new Error(
      "useRecipeCounts must be used within a RecipeCountProvider"
    );
  }
  return context;
}
