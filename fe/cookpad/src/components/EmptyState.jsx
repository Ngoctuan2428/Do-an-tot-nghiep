import { UtensilsCrossed } from 'lucide-react';

// empty state chung
export default function EmptyState({
  title = 'Chưa có gì ở đây',
  description,
  buttonText = 'Thêm mới',
  onButtonClick,
  iconColor = 'text-gray-400',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg shadow-sm border border-gray-200">
      <div
        className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 ${iconColor}`}
      >
        <UtensilsCrossed size={32} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-6 max-w-sm">{description}</p>
      <button
        onClick={onButtonClick}
        className="px-6 py-2 bg-cookpad-orange text-white rounded-md hover:bg-orange-500 transition-colors text-sm font-medium"
      >
        {buttonText}
      </button>
    </div>
  );
}
