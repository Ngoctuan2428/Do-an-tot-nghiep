// src/contexts/RecipeCountContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
// ✅ Import thêm getLikedRecipesIds
import {
  getRecipeCounts,
  getSavedRecipes,
  getLikedRecipesIds,
} from "../services/recipeApi";

const RecipeCountContext = createContext();

export function RecipeCountProvider({ children }) {
  const [counts, setCounts] = useState({});
  const [savedRecipeIds, setSavedRecipeIds] = useState(new Set());
  // ✅ THÊM STATE CHO LIKE
  const [likedRecipeIds, setLikedRecipeIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const refreshCounts = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCounts({});
      setSavedRecipeIds(new Set());
      setLikedRecipeIds(new Set()); // ✅ Reset
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // ✅ Gọi song song 3 API
      const [countsRes, savedRes, likedRes] = await Promise.all([
        getRecipeCounts(),
        getSavedRecipes(),
        getLikedRecipesIds(),
      ]);

      setCounts(countsRes.data.data || {});
      setSavedRecipeIds(new Set(savedRes.data.data.rows.map((r) => r.id)));
      // ✅ Lưu danh sách ID đã like
      setLikedRecipeIds(new Set(likedRes.data.data));
    } catch (error) {
      console.error("Failed to fetch recipe data:", error);
      // Reset nếu lỗi (ví dụ token hết hạn)
      setCounts({});
      setSavedRecipeIds(new Set());
      setLikedRecipeIds(new Set());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  // ✅ Thêm likedRecipeIds vào value
  const value = {
    counts,
    loading,
    refreshCounts,
    savedRecipeIds,
    likedRecipeIds,
  };

  return (
    <RecipeCountContext.Provider value={value}>
      {children}
    </RecipeCountContext.Provider>
  );
}

export function useRecipeCounts() {
  return useContext(RecipeCountContext);
}
