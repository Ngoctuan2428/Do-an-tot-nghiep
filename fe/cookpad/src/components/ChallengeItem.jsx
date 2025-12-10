// src/components/ChallengeItem.jsx
import { useNavigate } from "react-router-dom";
import { ChefHat } from "lucide-react";

const ChallengeItem = ({ img, title, daysLeft, number, hashtag }) => {
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!hashtag) return;
    // Lấy hashtag không bao gồm dấu # để đưa lên URL
    const tag = hashtag.startsWith("#") ? hashtag.substring(1) : hashtag;
    navigate(`/challenge/${tag}`);
  };

  return (
    <li className="border rounded-lg shadow-sm p-3 flex flex-col h-full bg-white hover:shadow-md transition-shadow">
      <div className="relative pt-[66%] mb-2 overflow-hidden rounded-md">
        <img
          src={img}
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>

      <h3 className="text-lg font-bold text-gray-900 py-1 line-clamp-2 flex-1">
        {title}
      </h3>

      <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
          Còn {daysLeft} ngày
        </span>
        <span className="text-cookpad-orange flex items-center font-medium">
          <ChefHat className="inline-block mr-1" size={16} />
          {number} món
        </span>
      </div>

      <button
        onClick={handleJoin}
        className="mt-4 w-full bg-orange-50 text-orange-600 border border-orange-200 py-2 rounded-md hover:bg-orange-500 hover:text-white transition-all text-sm font-semibold"
      >
        Xem thử thách
      </button>
    </li>
  );
};

export default ChallengeItem;
