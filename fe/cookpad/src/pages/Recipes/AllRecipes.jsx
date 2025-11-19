import RecipeSubPageLayout from '../../components/RecipeSubPageLayout';
import RecipeCard from '../../components/RecipeCard';
import { khoMonItems } from '../../data/sidebarData';

const currentItem = khoMonItems.find((item) => item.path === '/recipes/all');
const recipes = []; // Giả sử empty; fetch từ API nếu có

export default function AllRecipes() {
  return (
    <RecipeSubPageLayout
      title={currentItem.label}
      count={currentItem.count}
      descriptionEmpty="Bạn chưa lưu món nào. Hãy duyệt công thức và lưu những món yêu thích!"
    >
      {recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      )}
    </RecipeSubPageLayout>
  );
}
