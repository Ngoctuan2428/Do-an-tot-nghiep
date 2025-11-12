// src/components/InteractionItem.jsx
import { Link } from "react-router-dom";
import { Heart, MessageCircle, UserPlus, Camera } from "lucide-react";

// Hàm tính thời gian tương đối
const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " năm trước";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " tháng trước";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " ngày trước";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " giờ trước";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " phút trước";
  return Math.floor(seconds) + " giây trước";
};

// Hàm render nội dung dựa trên 'type'
const renderInteraction = (interaction) => {
  const { type, item } = interaction;
  let actor, action, target, icon, actorUrl, targetUrl;

  switch (type) {
    case "like":
      actor = item.User?.username || "Ai đó";
      action = "đã thích món ăn";
      target = item.Recipe?.title || "của bạn";
      icon = <Heart size={16} className="text-red-500" />;
      actorUrl = `/user/${item.User?.id}`;
      targetUrl = `/recipes/${item.Recipe?.id}`;
      break;
    case "comment":
      actor = item.User?.username || "Ai đó";
      action = "đã bình luận về món";
      target = item.Recipe?.title || "của bạn";
      icon = <MessageCircle size={16} className="text-blue-500" />;
      actorUrl = `/user/${item.User?.id}`;
      targetUrl = `/recipes/${item.Recipe?.id}`;
      break;
    case "follow":
      // 'Follower' là alias chúng ta đặt ở models/index.js
      actor = item.Follower?.username || "Ai đó";
      action = "đã theo dõi bạn";
      target = ""; // Không có đối tượng
      icon = <UserPlus size={16} className="text-green-500" />;
      actorUrl = `/user/${item.Follower?.id}`;
      targetUrl = actorUrl;
      break;
    case "cooksnap":
      actor = item.User?.username || "Ai đó";
      action = "đã gửi Cooksnap cho món";
      target = item.Recipe?.title || "của bạn";
      icon = <Camera size={16} className="text-orange-500" />;
      actorUrl = `/user/${item.User?.id}`;
      targetUrl = `/recipes/${item.Recipe?.id}`;
      break;
    default:
      return null;
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-800">
          <Link to={actorUrl} className="font-semibold hover:underline">
            {actor}
          </Link>{" "}
          {action}{" "}
          <Link to={targetUrl} className="font-semibold hover:underline">
            {target}
          </Link>
        </p>
        <span className="text-xs text-gray-500">
          {timeAgo(interaction.time)}
        </span>
      </div>
      <Link to={actorUrl} className="flex-shrink-0">
        <img
          src={
            item.User?.avatar_url ||
            item.Follower?.avatar_url ||
            "https://placehold.co/40x40?text=U"
          }
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border"
        />
      </Link>
    </div>
  );
};

export default function InteractionItem({ interaction }) {
  return (
    <li className="border-b border-gray-200 last:border-b-0 py-2">
      {renderInteraction(interaction)}
    </li>
  );
}
