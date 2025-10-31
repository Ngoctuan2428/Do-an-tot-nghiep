import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecipeHeader from "../components/RecipeHeader";
import RecipeContent from "../components/RecipeContent";
import CooksnapSection from "../components/CooksnapSection";
import RelatedRecipes from "../components/RelatedRecipes";
import { getRecipeById } from "../services/recipeApi";

export default function RecipeDetail() {
  const { id } = useParams(); // route must provide :id
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const res = await getRecipeById(id);
        setRecipe(res.data.data);
      } catch (err) {
        console.error("Failed to load recipe:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error || !recipe)
    return <div className="p-6">Không tìm thấy công thức hoặc đã có lỗi.</div>;

  return (
    <div className="bg-white text-gray-900">
      <RecipeHeader recipe={recipe} />
      <RecipeContent recipe={recipe} />
      <CooksnapSection recipe={recipe} />
      <RelatedRecipes recipes={recipe.related || []} />
    </div>
  );
}
