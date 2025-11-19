import { useState } from 'react';
import { X, Smile, Heart, Hand } from 'lucide-react';

export default function ReactionModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('all');

  const data = [
    {
      id: 1,
      name: 'Madhumita Bishnu',
      username: '@Madhubish27',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      recipes: '1.530 Món',
      icon: '🍲',
    },
    {
      id: 2,
      name: 'Andi1980',
      username: '@Andi1980',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      recipes: '1.582 Món',
      icon: '🍳',
    },
    {
      id: 3,
      name: '木漏れ日の台所',
      username: '@cook_40333353',
      avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
      recipes: '1.141 Cooksnap',
      icon: '📸',
    },
    {
      id: 4,
      name: 'Béchamellicious 💕 (Maria)',
      username: '@bech',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      recipes: '529 Món',
      icon: '🍰',
    },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-3">
          <div className="flex gap-6 text-gray-700 text-sm font-medium">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-2 border-b-2 ${
                activeTab === 'all'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent hover:text-orange-400'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveTab('like')}
              className={`flex items-center gap-1 pb-2 border-b-2 ${
                activeTab === 'like'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent'
              }`}
            >
              <Smile className="w-4 h-4 text-yellow-500" /> 8
            </button>
            <button
              onClick={() => setActiveTab('heart')}
              className={`flex items-center gap-1 pb-2 border-b-2 ${
                activeTab === 'heart'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent'
              }`}
            >
              <Heart className="w-4 h-4 text-red-500" /> 10
            </button>
            <button
              onClick={() => setActiveTab('clap')}
              className={`flex items-center gap-1 pb-2 border-b-2 ${
                activeTab === 'clap'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent'
              }`}
            >
              <Hand className="w-4 h-4 text-yellow-500" /> 5
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Danh sách */}
        <div className="overflow-y-auto p-4 divide-y">
          {data.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-sm">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.username}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <span>{user.icon}</span>
                    <span>{user.recipes}</span>
                  </div>
                </div>
              </div>
              <button className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full hover:bg-gray-700">
                Kết bạn bếp
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
