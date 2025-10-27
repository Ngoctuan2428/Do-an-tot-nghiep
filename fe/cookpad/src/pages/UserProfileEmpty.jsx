import { useState } from 'react';
import { User, Edit3, FileText } from 'lucide-react';

export default function UserProfileEmpty() {
  const [activeTab, setActiveTab] = useState('recipes');

  const user = {
    name: 'Page One',
    username: 'cook_114380624',
    avatar: 'https://i.pravatar.cc/100?img=68',
    friends: 0,
    followers: 0,
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-full border mb-3"
        />
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-500 mb-3">@{user.username}</p>

        <div className="flex gap-4 text-sm text-gray-600 mb-3">
          <span>{user.friends} Bạn Bếp</span>
          <span>{user.followers} Người quan tâm</span>
        </div>

        <button className="border border-gray-300 px-4 py-1.5 rounded-full text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          <Edit3 className="w-4 h-4" />
          Sửa thông tin cá nhân
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mt-8 border-b text-sm">
        <button
          onClick={() => setActiveTab('recipes')}
          className={`px-6 pb-2 ${
            activeTab === 'recipes'
              ? 'border-b-2 border-orange-500 text-orange-600 font-medium'
              : 'text-gray-600 hover:text-orange-500'
          }`}
        >
          Recipes (0)
        </button>
        <button
          onClick={() => setActiveTab('cooksnaps')}
          className={`px-6 pb-2 ${
            activeTab === 'cooksnaps'
              ? 'border-b-2 border-orange-500 text-orange-600 font-medium'
              : 'text-gray-600 hover:text-orange-500'
          }`}
        >
          Cooksnaps (0)
        </button>
      </div>

      {/* Empty State */}
      <div className="text-center mt-16">
        <div className="flex justify-center mb-4">
          <div className="bg-orange-50 rounded-full p-6">
            <FileText className="w-10 h-10 text-orange-500" />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          Nào, bắt đầu viết cách làm món đầu tiên thôi!
        </h3>
        <p className="text-gray-600 mb-5 text-sm max-w-md mx-auto">
          Bạn vẫn chưa đăng món nào. Hãy chia sẻ món bạn yêu thích và bạn sẽ
          thấy món ấy ở đây nhé!
        </p>

        <button className="bg-orange-500 text-white px-5 py-2 rounded-md font-medium hover:bg-orange-600 transition">
          Viết món mới
        </button>
      </div>
    </div>
  );
}
