import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="flex-1 max-w-md mx-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm tên hoặc nguyên liệu"
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cookpad-orange"
        />
        {/* <button className="absolute left-3 top-2.5 text-gray-400"></button> */}
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <button className="absolute right-3 top-2.5 text-sm bg-cookpad-orange text-white px-3 py-1 rounded-md">
          Tìm kiếm
        </button>
      </div>
    </div>
  );
}
