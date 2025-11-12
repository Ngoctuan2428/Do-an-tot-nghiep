// src/components/ChallengeItem.jsx
import { useNavigate } from "react-router-dom";
import { ChefHat } from "lucide-react";

// ✅ Thêm 'hashtag' vào props
const ChallengeItem = ({ img, title, daysLeft, number, hashtag }) => {
  const navigate = useNavigate();

  const handleJoin = () => {
    // Lấy hashtag không bao gồm dấu #
    const tag = hashtag.startsWith("#") ? hashtag.substring(1) : hashtag;
    navigate(`/challenge/${tag}`);
  };

  return (
    <li className="border rounded-lg shadow-sm p-3 flex flex-col">
      <img
        src={img}
        alt={title}
        className="w-full h-36 object-cover rounded-md mb-2"
      />
      <h3 className="text-lg font-medium text-gray-900 py-2 line-clamp-2 flex-1">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-1">
        <span>Còn: {daysLeft} ngày</span>
        <span className="text-cookpad-orange flex items-center justify-end">
          <ChefHat className="inline-block mr-1" size={16} />
          {number} món
        </span>
      </div>
      <button
        onClick={handleJoin} // ✅ Sửa lại
        className="mt-4 w-full bg-cookpad-orange text-white py-2 rounded-md hover:bg-orange-500 transition-colors text-sm"
      >
        Xem thử thách
      </button>
    </li>
  );
};

export default ChallengeItem;
