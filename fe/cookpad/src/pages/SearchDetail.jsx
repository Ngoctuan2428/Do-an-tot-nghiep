import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Crown, ChefHat, Clock, Users } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';

const mockRankedRecipes = [
  {
    id: 1,
    rank: 1,
    image:
      'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/Thit_ran_98d4de0731.jpg',
  },
  {
    id: 2,
    rank: 2,
    image:
      'https://cookbeo.com/media/2020/11/thit-kho-tau/thit-kho-tau-16x9.jpg',
  },
  {
    id: 3,
    rank: 3,
    image:
      'https://cellphones.com.vn/sforum/wp-content/uploads/2023/08/mon-ngon-tu-thit-lon-10.jpg',
  },
  {
    id: 4,
    rank: 4,
    image:
      'https://cdn.tgdd.vn/Files/2019/08/11/1186405/7-mon-tu-thit-heo-khong-chi-ngon-kho-cuong-ma-con-cuc-de-lam-201908110859354934.jpg',
  },
];

const mockRecipes = [
  {
    id: 5,
    title: 'Thịt Xào Mè',
    description:
      'thịt ba rọi rút sườn - mè trắng - hạt tim băm - nước tương - dầu hào - đường 6 món',
    image:
      'https://cdn.pastaxi-manager.onepas.vn/content/uploads/articles/Ho%C3%A0i%20Thu%20mkt/%E1%BA%A2nh%20b%C3%A0i%20vi%E1%BA%BFt%20ch%E1%BB%A7%20%C4%91%E1%BB%81%20dinh%20d%C6%B0%E1%BB%A1ng/cac-mon-ngon-voi-thit-lon/mon-ngon-voi-thit-lon-thit-kho-tieu.jpg',
    time: '45 phút',
    servings: '5 người',
    author: 'Bồn Bồn',
  },
  {
    id: 6,
    title: 'Khoai Tay Xào Thịt Nac',
    description:
      'Thịt nac xay - Khoai tay - Đậu an - Hành tim - Hat nêm - Nước mắm - Muối - Tiêu',
    image:
      'https://i.ytimg.com/vi/9IxeBx67Wvg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD28R7_DLn6ggpWytGlVukpidpPsw',
    time: '30 phút',
    servings: '2 phan an',
    author: 'Đậu Đậu',
  },
  {
    id: 7,
    title: 'Cá Kho Tộ',
    description:
      'Cá basa cắt khúc - nước màu - nước mắm - tiêu - hành tím - ớt - đường - dầu ăn',
    image:
      'https://img-global.cpcdn.com/recipes/3b1054eb857b0e2d/1200x630cq80/photo.jpg',
    time: '60 phút',
    servings: '4 người',
    author: 'Mắm Mắm',
  },
  {
    id: 8,
    title: 'Trứng Chiên Thịt Bằm',
    description: 'Trứng gà - thịt heo bằm - hành lá - nước mắm - tiêu - dầu ăn',
    image:
      'https://store.longphuong.vn/wp-content/uploads/2024/10/thit-de-lam-mon-gi-ngon-11.webp',
    time: '20 phút',
    servings: '3 người',
    author: 'Trứng Trứng',
  },
  {
    id: 9,
    title: 'Canh Chua Cá Lóc',
    description:
      'Cá lóc - cà chua - thơm - bạc hà - đậu bắp - me chua - rau ngò - nước mắm - đường - muối',
    image: 'https://i.ytimg.com/vi/bZ7IFrZ3-hI/maxresdefault.jpg',
    time: '40 phút',
    servings: '4 người',
    author: 'Chua Chua',
  },
  {
    id: 10,
    title: 'Thịt Heo Kho Trứng',
    description:
      'Thịt ba chỉ - trứng vịt - nước dừa - nước mắm - đường - tiêu - hành tím',
    image:
      'https://vinhhanhfood.com/wp-content/uploads/2021/01/thit-de-hap-toi.jpg',
    time: '90 phút',
    servings: '5 người',
    author: 'Kho Kho',
  },
  {
    id: 11,
    title: 'Thịt Bò Xào Bông Cải',
    description:
      'Thịt bò - bông cải xanh - tỏi - dầu hào - nước tương - tiêu - dầu ăn',
    image:
      'https://cellphones.com.vn/sforum/wp-content/uploads/2023/08/mon-ngon-tu-thit-lon-13.jpg',
    time: '25 phút',
    servings: '3 người',
    author: 'Bò Bò',
  },
  {
    id: 12,
    title: 'Gà Rang Gừng',
    description: 'Thịt gà - gừng - nước mắm - đường - tiêu - hành tím - dầu ăn',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu_p9selxWn3Slv7hjD0Gjj5NvtTswEH5h5Q&s',
    time: '35 phút',
    servings: '4 người',
    author: 'Gừng Gừng',
  },
  {
    id: 13,
    title: 'Thịt Heo Quay Giòn Bì',
    description: 'Thịt ba chỉ - muối - giấm - tiêu - ngũ vị hương - dầu ăn',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoumumwlIH6xk_Ipu2kdjYDJjl1a5UD9NpnA&s',
    time: '120 phút',
    servings: '6 người',
    author: 'Giòn Giòn',
  },
  {
    id: 14,
    title: 'Thịt Bò Kho',
    description:
      'Thịt bò - cà rốt - nước dừa - ngũ vị hương - nước mắm - tiêu - hành tím',
    image:
      'https://pos.nvncdn.com/867afd-52643/art/artCT/20221006_H6Q8gwIb1HnFhAkz71dPgd0S.jpg',
    time: '75 phút',
    servings: '5 người',
    author: 'Kho Kho',
  },
  {
    id: 15,
    title: 'Gà Nướng Mật Ong',
    description:
      'Thịt gà - mật ong - tỏi - nước mắm - tiêu - dầu ăn - ngũ vị hương',
    image:
      'https://cdn.pastaxi-manager.onepas.vn/content/uploads/articles/vuvu/1-1-vietnam-938/blog/7-mon-ngon-tu-thit-ba-chi/mach-ban-7-mon-ngon-tu-thit-ba-chi-vua-de-lam-lai-vua-hao-com-3.jpg',
    time: '60 phút',
    servings: '4 người',
    author: 'Mật Mật',
  },
];

const mockSuggestions = [
  'thịt nướng',
  'thịt kho',
  'thịt chiên',
  'món thịt bò ngon',
  'món thịt gà ngon',
];

export default function SearchDetail() {
  const { query } = useParams(); // Lấy query từ URL, ví dụ /search/thit
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mới nhất');
  const [sort, setSort] = useState('mới nhất');
  const [filterInclude, setFilterInclude] = useState('');
  const [filterExclude, setFilterExclude] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search/${e.target.value}`);
    }
  };

  const RankedRecipe = ({ rank, image }) => (
    <div className="relative">
      <img
        src={image}
        alt={`Rank ${rank}`}
        className="w-full h-24 object-cover rounded-md"
      />
      <span className="absolute top-0 left-0 bg-white p-1 rounded text-xs font-bold">
        {rank}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            defaultValue={query || 'thit'}
            onKeyDown={handleSearch}
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cookpad-orange text-lg"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-cookpad-orange">
            <Search size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-4">
          <button
            className={`text-sm font-medium pb-2 border-b-2 ${
              activeTab === 'mới nhất'
                ? 'border-cookpad-orange text-cookpad-orange'
                : 'border-transparent text-gray-600'
            }`}
            onClick={() => setActiveTab('mới nhất')}
          >
            Mới Nhất
          </button>
          <button
            className={`text-sm font-medium pb-2 border-b-2 ${
              activeTab === 'phổ biến'
                ? 'border-cookpad-orange text-cookpad-orange'
                : 'border-transparent text-gray-600'
            }`}
            onClick={() => setActiveTab('phổ biến')}
          >
            Phổ Biến
          </button>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Thit (23.807)</h1>
        <p className="text-sm text-gray-600 mb-4">
          Món 'thit' đã được kiểm chứng
        </p>

        {/* Ranked Recipes */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {mockRankedRecipes.map((recipe) => (
            <RankedRecipe
              key={recipe.id}
              rank={recipe.rank}
              image={recipe.image}
            />
          ))}
        </div>

        {/* Main Content - Responsive Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Recipes List */}
          <div className="flex-1 space-y-6">
            {mockRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="flex items-start space-x-4 bg-white p-4 rounded-md shadow-sm"
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-32 h-32 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {recipe.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {recipe.description}
                  </p>
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>
                      <Clock size={16} className="inline mr-1" /> {recipe.time}
                    </span>
                    <span>
                      <Users size={16} className="inline mr-1" />{' '}
                      {recipe.servings}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <img
                      src="https://via.placeholder.com/20"
                      alt="Author"
                      className="w-5 h-5 rounded-full mr-2"
                    />
                    {recipe.author}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Filters */}
          <aside className="space-y-4 lg:w-64 lg:sticky lg:top-6 lg:h-fit">
            {/* Tim kiệm tương tự */}
            <div className="bg-white rounded-md p-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                Tim kiệm tương tự
              </h3>
              <div className="flex flex-wrap gap-2">
                {mockSuggestions.map((sug) => (
                  <button
                    key={sug}
                    className="px-3 py-1 bg-gray-100 rounded-md text-xs hover:bg-gray-200"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Sắp xếp */}
            <div className="bg-white rounded-md p-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Sắp xếp</h3>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cookpad-orange"
              >
                <option>Hiển thị các món với:</option>
                <option>Mới nhất</option>
                <option>Phổ biến</option>
              </select>
            </div>

            {/* Bộ lọc */}
            <div className="bg-white rounded-md p-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Bộ lọc</h3>
              <input
                type="text"
                value={filterInclude}
                onChange={(e) => setFilterInclude(e.target.value)}
                placeholder="Gõ vào tên nguyên liệu..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cookpad-orange mb-2"
              />
              <p className="text-xs text-gray-500 mb-2">
                Hiển thị các món không có:
              </p>
              <input
                type="text"
                value={filterExclude}
                onChange={(e) => setFilterExclude(e.target.value)}
                placeholder="Gõ vào tên nguyên liệu..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cookpad-orange"
              />
            </div>

            {/* Premium Filter */}
            <div className="bg-yellow-50 rounded-md p-4 shadow-sm text-center">
              <p className="text-sm font-bold text-yellow-800 mb-2">
                Bộ lọc Premium
              </p>
              <button className="w-full bg-yellow-400 text-yellow-800 py-2 rounded-md hover:bg-yellow-500 transition-colors text-sm flex items-center justify-center">
                <Crown size={16} className="mr-1" />
                Bỏ lọc Premium
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
