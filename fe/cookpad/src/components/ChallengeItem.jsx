import { useNavigate } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

const ChallengeItem = ({ img, title, daysLeft, number }) => {
  const navigate = useNavigate();

  return (
    <li>
      <img
        src={img}
        alt={title}
        className="w-full h-36 object-cover rounded-md mb-2"
      />
      <h3 className="text-lg font-medium text-gray-900 py-2">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-600 mt-1">
        <span>Thời gian còn lại: {daysLeft} ngày</span>
        <span className="text-cookpad-orange flex items-center justify-end">
          <ChefHat className="inline-block mr-1 -mt-2" />
          {number} món
        </span>
      </div>
      <button
        onClick={() => navigate(`/challenge/${title.replace(/\s+/g, '-')}`)} // Navigate to challenge detail (mock)
        className="mt-4 w-full bg-cookpad-orange text-white py-2 rounded-md hover:bg-orange-500 transition-colors text-sm"
      >
        Tham gia
      </button>
    </li>
  );
};

export default ChallengeItem;
