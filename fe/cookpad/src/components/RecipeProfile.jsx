import { Heart, Clock, Users } from 'lucide-react';

const RecipeFile = ({ title, image, time, servings, isSaved }) => (
  <div className="bg-white rounded-md shadow-sm p-4">
    <img
      src={image}
      alt={title}
      className="w-full h-32 object-cover rounded-md mb-2"
    />
    <h3 className="text-lg font-medium text-gray-900 truncate">{title}</h3>
    <div className="flex justify-between text-sm text-gray-600 mt-1">
      <span className="flex items-center">
        <Clock size={14} className="mr-1" /> {time}
      </span>
      <span className="flex items-center">
        <Users size={14} className="mr-1" /> {servings}
      </span>
    </div>
    <button
      className={`mt-2 w-full py-2 rounded-md text-sm flex items-center justify-center ${
        isSaved
          ? 'bg-gray-200 text-gray-700'
          : 'bg-cookpad-orange text-white hover:bg-orange-500'
      }`}
    >
      <Heart size={16} className="mr-1" /> {isSaved ? 'Đã lưu' : 'Lưu'}
    </button>
  </div>
);

export default RecipeFile;
