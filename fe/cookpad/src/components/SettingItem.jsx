import { ChevronRight } from 'lucide-react';

export default function SettingItem({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center py-3 px-3 border-b border-gray-200 text-gray-700 hover:bg-gray-50 transition"
    >
      <span className="text-[15px] text-left">{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </button>
  );
}
