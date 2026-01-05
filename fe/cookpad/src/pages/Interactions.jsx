// src/pages/Interactions.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  UserPlus,
  CheckCircle,
  Camera,
  Loader2,
  Bell,
  Utensils,
} from 'lucide-react';
import { getInteractions } from '../services/interactionApi'; // Đảm bảo bạn đã có API này
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function Interactions() {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const response = await getInteractions();
        setInteractions(response.data.data);
      } catch (error) {
        console.error('Lỗi tải thông báo:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInteractions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-gray-50 py-6 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {interactions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {interactions.map((item) => (
              <NotificationItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Bạn chưa có thông báo nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Component con để render từng loại thông báo
function NotificationItem({ item }) {
  // Cấu hình nội dung dựa trên loại thông báo (type)
  let config = {
    icon: <Bell size={20} />,
    color: 'bg-gray-100 text-gray-600',
    content: 'Thông báo mới',
    link: '#',
  };

  const { type, Sender, Recipe, Comment } = item;
  const senderName = Sender?.username || 'Ai đó';

  switch (type) {
    // 1. Đăng món ăn thành công
    case 'RECIPE_PUBLISHED':
      config = {
        icon: <CheckCircle size={20} />,
        color: 'bg-green-100 text-green-600',
        content: (
          <span>
            Chúc mừng! Món <strong>{Recipe?.title}</strong> của bạn đã được xuất
            bản thành công.
          </span>
        ),
        link: `/recipes/${Recipe?.id}`,
      };
      break;

    // 2. Gửi Cooksnap thành công
    case 'COOKSNAP_SENT':
      config = {
        icon: <Camera size={20} />,
        color: 'bg-blue-100 text-blue-600',
        content: (
          <span>
            Bạn đã gửi Psnap cho món <strong>{Recipe?.title}</strong>.
          </span>
        ),
        link: `/recipes/${Recipe?.id}`,
      };
      break;

    // 3. Có người phản hồi bình luận
    case 'COMMENT_REPLY':
      config = {
        icon: <MessageCircle size={20} />,
        color: 'bg-purple-100 text-purple-600',
        content: (
          <span>
            <strong>{senderName}</strong> đã trả lời bình luận của bạn trong món{' '}
            <strong>{Recipe?.title}</strong>.
          </span>
        ),
        link: `/recipes/${Recipe?.id}`,
      };
      break;

    // 4. Có lượt thích
    case 'LIKE':
      config = {
        icon: <Heart size={20} />,
        color: 'bg-red-100 text-red-600',
        content: (
          <span>
            <strong>{senderName}</strong> đã thích món{' '}
            <strong>{Recipe?.title}</strong> của bạn.
          </span>
        ),
        link: `/recipes/${Recipe?.id}`,
      };
      break;

    // 5. Có người kết bạn (Follow)
    case 'FOLLOW':
      config = {
        icon: <UserPlus size={20} />,
        color: 'bg-orange-100 text-orange-600',
        content: (
          <span>
            <strong>{senderName}</strong> đã bắt đầu theo dõi bạn.
          </span>
        ),
        link: `/profile/${Sender?.id}`,
      };
      break;

    // Trường hợp khác (Cooksnap nhận được từ người khác)
    case 'COOKSNAP_RECEIVED':
      config = {
        icon: <Utensils size={20} />,
        color: 'bg-yellow-100 text-yellow-600',
        content: (
          <span>
            <strong>{senderName}</strong> vừa gửi Psnap cho món{' '}
            <strong>{Recipe?.title}</strong> của bạn!
          </span>
        ),
        link: `/recipes/${Recipe?.id}`,
      };
      break;

    default:
      break;
  }

  return (
    <Link
      to={config.link}
      className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors group relative"
    >
      {/* Icon đại diện */}
      <div className={`p-3 rounded-full flex-shrink-0 ${config.color}`}>
        {config.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-gray-800 text-sm leading-relaxed mb-1">
          {config.content}
        </div>
        <p className="text-xs text-gray-500 font-medium">
          {item.created_at
            ? formatDistanceToNow(new Date(item.created_at), {
                addSuffix: true,
                locale: vi,
              })
            : 'Vừa xong'}
        </p>
      </div>

      {/* Dấu chấm đỏ nếu chưa đọc (Tùy chọn backend có trả về is_read không) */}
      {!item.is_read && (
        <span className="w-2.5 h-2.5 bg-orange-500 rounded-full absolute top-1/2 right-4 -translate-y-1/2"></span>
      )}
    </Link>
  );
}
