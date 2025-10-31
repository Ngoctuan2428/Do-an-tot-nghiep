import React, { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm công thức..."
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cookpad-orange"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-cookpad-orange"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
}
