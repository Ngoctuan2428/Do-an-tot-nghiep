import RecipeCard from '../components/RecipeCard';

const recipes = [
  {
    id: 1,
    title: 'Thịt kho tàu',
    image: 'https://via.placeholder.com/300x200?text=Thịt+Kho+Tàu',
    premium: false,
    views: 1200,
    likes: 250,
  },
  {
    id: 2,
    title: 'Bánh mì thịt nướng',
    image: 'https://via.placeholder.com/300x200?text=Bánh+Mì',
    premium: true,
    views: 800,
    likes: 180,
  },
  // Thêm 8-10 cards nữa tương tự từ screenshot
];

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto p-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cookpad-orange to-cookpad-yellow text-white p-6 rounded-lg mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Chào mừng đến với Cookpad!</h2>
        <p className="text-sm">Khám phá hàng ngàn công thức nấu ăn dễ làm.</p>
      </div>

      {/* Grid Recipes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} {...recipe} />
        ))}
      </div>

      {/* Premium Section */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <span className="bg-yellow-400 text-black px-2 py-1 rounded mr-2 text-sm">
            Premium
          </span>
          Top Món Ăn Premium
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Thêm 3 cards premium */}
          <RecipeCard
            title="Cá kho tộ"
            image="https://via.placeholder.com/150x100?text=Cá+Kho"
            premium
            views={500}
            likes={100}
          />
        </div>
      </section>

      {/* Footer Banner */}
      <div className="bg-gray-100 p-4 rounded-lg text-center text-sm text-gray-600">
        <p>
          Có sẵn trên US, UK, ES, AR, UY, MX, CL, VN, ID, FR, SA, AR, IT, IN,
          HU, NG, GR, MY, PT, UA, KR, TW
        </p>
        <p className="mt-2">
          Tìm kiếm & Thêm | Giới thiệu Premium | Sử dụng Cookpad
        </p>
      </div>
    </main>
  );
}
