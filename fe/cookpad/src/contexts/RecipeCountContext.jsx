// src/contexts/RecipeCountContext.jsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from './AuthContext'; // 👈 [1] IMPORT useAuth
import {
  getRecipeCounts,
  getSavedRecipes,
  getLikedRecipesIds,
} from "../services/recipeApi";

const RecipeCountContext = createContext();

export function RecipeCountProvider({ children }) {
  const { user } = useAuth(); // 👈 [2] LẤY USER TỪ CONTEXT
  
  const [counts, setCounts] = useState({});
  const [savedRecipeIds, setSavedRecipeIds] = useState(new Set());
  const [likedRecipeIds, setLikedRecipeIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // ✅ [SỬA ĐỔI] THÊM user VÀO DEPENDENCY ARRAY CỦA useCallback
  const refreshCounts = useCallback(async () => {
    // Nếu user là null hoặc loading, reset state
    if (!user) {
      setCounts({});
      setSavedRecipeIds(new Set());
      setLikedRecipeIds(new Set()); 
      setLoading(false);
      return;
    }
    
    // Logic fetch API
    try {
      setLoading(true);
      // Giả định token đã được xử lý trong interceptor/axiosClient và user đã có
      const [countsRes, savedRes, likedRes] = await Promise.all([
        getRecipeCounts(),
        getSavedRecipes(),
        getLikedRecipesIds(),
      ]);

      setCounts(countsRes.data.data || {});
      // Giả định savedRes.data.data.rows là mảng các đối tượng recipe có trường id
      setSavedRecipeIds(new Set(savedRes.data.data.rows.map((r) => r.id)));
      // Giả định likedRes.data.data là mảng các ID
      setLikedRecipeIds(new Set(likedRes.data.data)); 
    } catch (error) {
      console.error("Failed to fetch recipe data:", error);
      // Xóa token nếu lỗi 401 xảy ra trong interceptor
      setCounts({});
      setSavedRecipeIds(new Set());
      setLikedRecipeIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [user]); // 👈 [3] CHỈ CHẠY LẠI KHI TRẠNG THÁI user THAY ĐỔI (LOGIN/LOGOUT)

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]); 

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