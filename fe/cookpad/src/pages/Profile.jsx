import { useState } from 'react';
import {
  MapPin,
  MoreHorizontal,
  Search,
  Clock,
  Users,
  ThumbsUp,
  Heart,
  Hand,
} from 'lucide-react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('recipes');

  const user = {
    name: 'Bòn Bon',
    username: 'bonbonhcm',
    location: 'Hồ Chí Minh - Việt Nam',
    avatar: 'https://i.pravatar.cc/150?img=8',
    joined: '2017',
    followers: 4469,
    following: 4990,
    bio: 'Chào mừng bạn ghé thăm nhật ký bếp Bòn Bon. Mình gia nhập gia đình Cookpad từ năm 2017. Đây là nơi lưu giữ cách làm các món ăn mình đã nấu. Mình thích các món ăn vùng miền, thích thử các nguyên liệu mới.',
  };

  const recipes = [
    {
      id: 1,
      title: 'Bí Ngòi Cuộn Tôm Bò Lò',
      desc: 'Bí ngòi xanh - Tôm non tươi - Phô mai mozzarella và cheddar bào - Sốt cà chua - Củ hành tây - Dầu olive - Muối - Tiêu',
      time: '30 phút',
      portions: '2 phần ăn',
      image: 'https://img-global.cpcdn.com/recipes/3a7e2b7/photo.jpg',
    },
    {
      id: 2,
      title: 'Xôi Trám Cao Bằng',
      desc: 'Gạo nếp cái hoa vàng - Trám đen (đã om) - Hành phi - Muối vừng lạc',
      time: '8 giờ',
      portions: '5 người',
      image: 'https://img-global.cpcdn.com/recipes/abc/photo.jpg',
    },
    {
      id: 3,
      title: 'Lòng Heo Xào Nghệ Miền Trung',
      desc: 'Lòng heo - Nước nghệ tươi - Ớt - Tỏi - Hành - Nước mắm - Muối tiêu',
      time: '30 phút',
      portions: '2 phần ăn',
      image: 'https://img-global.cpcdn.com/recipes/def/photo.jpg',
    },
  ];

  const cooksnaps = [
    {
      id: 1,
      image: 'https://img-global.cpcdn.com/cooksnaps/1/photo.jpg',
      caption:
        'Mình làm lại món này từ công thức của Bòn Bon, vị cực kỳ thơm ngon!',
      recipeTitle: 'Thịt Xíu Mè',
      reactions: { like: 7, heart: 9, clap: 5 },
    },
    {
      id: 2,
      image: 'https://img-global.cpcdn.com/cooksnaps/2/photo.jpg',
      caption: 'Món ăn ngon, cả nhà đều thích!',
      recipeTitle: 'Cá Kho Tiêu',
      reactions: { like: 2, heart: 4, clap: 1 },
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header thông tin đầu bếp */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 relative">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-28 h-28 rounded-full border-4 border-orange-400"
        />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">@{user.username}</p>
          <p className="flex items-center justify-center sm:justify-start text-gray-500 mt-1">
            <MapPin className="w-4 h-4 mr-1" /> {user.location}
          </p>
          <p className="mt-3 text-gray-700 max-w-2xl">{user.bio}</p>
          <div className="flex gap-6 mt-3 text-gray-600 justify-center sm:justify-start">
            <span className="font-semibold">
              {user.following.toLocaleString()}
            </span>{' '}
            Bạn Bếp
            <span className="font-semibold">
              {user.followers.toLocaleString()}
            </span>{' '}
            Người quan tâm
          </div>
          <button className="mt-3 bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg">
            Kết Bạn Bếp
          </button>
        </div>

        {/* Menu 3 chấm */}
        <div className="absolute top-2 right-2">
          <button className="border rounded-lg p-2 hover:bg-gray-50">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b flex items-center justify-center gap-8 mb-6">
        <button
          onClick={() => setActiveTab('recipes')}
          className={`pb-2 font-medium ${
            activeTab === 'recipes'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Recipes ({recipes.length})
        </button>
        <button
          onClick={() => setActiveTab('cooksnaps')}
          className={`pb-2 font-medium ${
            activeTab === 'cooksnaps'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Cooksnaps ({cooksnaps.length})
        </button>
      </div>

      {/* Ô tìm kiếm */}
      <div className="flex items-center gap-2 mb-6 max-w-sm mx-auto sm:mx-0">
        <div className="flex items-center border rounded-lg w-full px-3">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm món"
            className="w-full px-2 py-2 outline-none text-sm"
          />
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Tìm
        </button>
      </div>

      {/* Danh sách */}
      <div className="space-y-4">
        {activeTab === 'recipes'
          ? recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)
          : cooksnaps.map((c) => <CooksnapCard key={c.id} snap={c} />)}
      </div>
    </div>
  );
}

/* ---------- RecipeCard Component ---------- */
function RecipeCard({ recipe }) {
  return (
    <div className="flex items-start gap-4 border-b pb-4">
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">Bòn Bon</p>
        <h3 className="font-semibold text-lg text-gray-800 hover:text-orange-500 cursor-pointer">
          {recipe.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">{recipe.desc}</p>
        <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {recipe.time}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" /> {recipe.portions}
          </span>
        </div>
      </div>
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-28 h-28 object-cover rounded-lg"
      />
    </div>
  );
}

/* ---------- CooksnapCard Component ---------- */
function CooksnapCard({ snap }) {
  const [reactions, setReactions] = useState({
    like: { active: false, count: snap.reactions.like },
    heart: { active: false, count: snap.reactions.heart },
    clap: { active: false, count: snap.reactions.clap },
  });

  const toggle = (type) => {
    setReactions((prev) => ({
      ...prev,
      [type]: {
        active: !prev[type].active,
        count: prev[type].count + (prev[type].active ? -1 : 1),
      },
    }));
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <img
        src={snap.image}
        alt={snap.recipeTitle}
        className="w-full h-60 object-cover"
      />
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">Bòn Bon</p>
        <p className="font-medium text-gray-800 mb-1">
          Đã làm món <span className="text-orange-500">{snap.recipeTitle}</span>
        </p>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {snap.caption}
        </p>

        {/* Reactions */}
        <div className="flex items-center gap-3 text-gray-600 text-sm">
          <button
            onClick={() => toggle('like')}
            className={`flex items-center gap-1 transition ${
              reactions.like.active ? 'text-blue-500' : 'hover:text-blue-400'
            }`}
          >
            <ThumbsUp
              className={`w-4 h-4 ${
                reactions.like.active ? 'fill-blue-500' : ''
              }`}
            />
            {reactions.like.count}
          </button>

          <button
            onClick={() => toggle('heart')}
            className={`flex items-center gap-1 transition ${
              reactions.heart.active ? 'text-red-500' : 'hover:text-red-400'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                reactions.heart.active ? 'fill-red-500' : ''
              }`}
            />
            {reactions.heart.count}
          </button>

          <button
            onClick={() => toggle('clap')}
            className={`flex items-center gap-1 transition ${
              reactions.clap.active
                ? 'text-yellow-500'
                : 'hover:text-yellow-400'
            }`}
          >
            <Hand
              className={`w-4 h-4 ${
                reactions.clap.active ? 'fill-yellow-500' : ''
              }`}
            />
            {reactions.clap.count}
          </button>
        </div>
      </div>
    </div>
  );
}
