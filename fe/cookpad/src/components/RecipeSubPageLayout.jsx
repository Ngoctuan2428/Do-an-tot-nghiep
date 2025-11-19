import { useState } from 'react';
import { Search, Plus, Sparkles } from 'lucide-react';
import EmptyState from './EmptyState';
import { khoMonItems } from '../data/sidebarData'; // Giả sử bạn export array từ Sidebar hoặc tạo file data riêng

export default function RecipeSubPageLayout({
  title,
  count = 0,
  children,
  descriptionEmpty = 'Bạn chưa có món nào ở đây. Hãy thêm món yêu thích để lưu lại!',
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNew = () => {
    // TODO: Navigate to create recipe page
    console.log('Thêm mới món:', title);
  };

  const currentItem = khoMonItems.find((item) => item.label === title); // Match với sidebar

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      {/* Header với search và actions */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">
              {title} ({count})
            </h1>
            <button className="p-1 text-gray-500 hover:text-gray-700">
              <Sparkles size={16} />
            </button>
          </div>
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder={`Tìm trong ${title.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cookpad-orange"
              />
              <Search
                size={16}
                className="absolute left-3 top-2.5 text-gray-400"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-sm text-gray-600 hover:text-cookpad-orange">
              Tùy chọn
            </button>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-cookpad-orange text-white rounded-md hover:bg-orange-500 text-sm"
            >
              <Plus size={16} className="inline mr-1" /> Thêm mới
            </button>
            <img
              src="https://via.placeholder.com/32"
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex max-w-7xl mx-auto p-6 gap-6">
        {/* Left: Content area */}
        <div className="flex-1">
          {count === 0 ? (
            <EmptyState
              title={`Chưa có gì ở ${title.toLowerCase()}`}
              description={descriptionEmpty}
              buttonText="Chọn món để thêm"
              onButtonClick={handleAddNew}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              {children} {/* Render grid recipes nếu có */}
            </div>
          )}
        </div>

        {/* Right: Gợi ý panel (fixed width như screenshot) */}
        <aside className="w-80 hidden lg:block bg-white rounded-lg shadow-sm p-4 sticky top-6 h-fit">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Sparkles size={16} className="mr-2 text-cookpad-orange" />
            Gợi ý món dựa trên tủ lạnh
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Dựa trên nguyên liệu bạn có: cà chua, hành tây, thịt bò...
          </p>
          <div className="space-y-2">
            {/* Gợi ý cards nhỏ */}
            <div className="flex items-center p-2 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=40&h=40&fit=crop rounded"
                className="w-10 h-10 rounded mr-3"
              />
              <div>
                <p className="text-sm font-medium">Cà ri gà</p>
                <p className="text-xs text-gray-500">Dễ làm, 30 phút</p>
              </div>
            </div>
            {/* Thêm 2-3 gợi ý nữa */}
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-cookpad-orange text-white rounded-md text-sm hover:bg-orange-500">
            Xem thêm gợi ý
          </button>
        </aside>
      </main>
    </div>
  );
}
