// src/contexts/RecipeCountContext.jsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import {
  getRecipeCounts,
  getSavedRecipes,
  getLikedRecipesIds,
} from '../services/recipeApi';

const RecipeCountContext = createContext();

export function RecipeCountProvider({ children }) {
  const { user } = useAuth(); // lay user tu context

  const [counts, setCounts] = useState({});
  const [savedRecipeIds, setSavedRecipeIds] = useState(new Set());
  const [likedRecipeIds, setLikedRecipeIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

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
      const [countsRes, savedRes, likedRes] = await Promise.all([
        getRecipeCounts(),
        getSavedRecipes(),
        getLikedRecipesIds(),
      ]);

      setCounts(countsRes.data.data || {});
      setSavedRecipeIds(new Set(savedRes.data.data.rows.map((r) => r.id)));
      setLikedRecipeIds(new Set(likedRes.data.data));
    } catch (error) {
      console.error('Failed to fetch recipe data:', error);
      // reset state on error
      setCounts({});
      setSavedRecipeIds(new Set());
      setLikedRecipeIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [user]); // chi chay khi user thay doi
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
