import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  UserPlus,
  CheckCircle, // Dùng cho System notification nếu có
  Loader2,
  Bell,
  Utensils,
  CheckCheck,
  Filter,
} from "lucide-react";
// Import service mới
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notificationApi";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "react-toastify";

export default function Interactions() {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all"); // State cho bộ lọc

  // Danh sách các tabs bộ lọc
  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "like", label: "Yêu thích" },
    { id: "comment", label: "Bình luận" },
    { id: "follow", label: "Theo dõi" },
  ];

  // Hàm tải dữ liệu
  const fetchInteractions = async () => {
    setLoading(true);
    try {
      // Gọi API với tham số filterType
      const response = await getNotifications(filterType);
      setInteractions(response.data.data.notifications);
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi lại API mỗi khi filterType thay đổi
  useEffect(() => {
    fetchInteractions();
  }, [filterType]);

  // Xử lý đánh dấu tất cả đã đọc
  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      // Cập nhật UI: set tất cả is_read = true
      setInteractions((prev) =>
        prev.map((item) => ({ ...item, is_read: true }))
      );
      toast.success("Đã đánh dấu tất cả là đã đọc");
    } catch (error) {
      console.error(error);
    }
  };

  // Xử lý khi click vào một thông báo (đánh dấu đã đọc)
  const handleItemClick = async (id, isRead) => {
    if (!isRead) {
      try {
        await markNotificationAsRead(id);
        // Cập nhật UI cục bộ
        setInteractions((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, is_read: true } : item
          )
        );
      } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-gray-50 py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
        </div>

        {/* Nút đánh dấu đã đọc tất cả */}
        <button
          onClick={handleMarkAllRead}
          className="text-sm text-gray-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
          title="Đánh dấu tất cả đã đọc"
        >
          <CheckCheck size={16} /> Đã đọc
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterType === f.id
                ? "bg-orange-500 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
          </div>
        ) : interactions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {interactions.map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item.id, item.is_read)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-full mb-3">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-600">
              Không có thông báo nào
            </p>
            <p className="text-sm">Chưa có hoạt động nào trong mục này.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Component con để render từng loại thông báo
function NotificationItem({ item, onClick }) {
  const { type, Sender, message, created_at, is_read, reference_id } = item;
  const senderName = Sender?.username || "Người dùng Cookpad";
  const avatarUrl = Sender?.avatar_url || "https://via.placeholder.com/150";

  // Cấu hình mặc định
  let config = {
    icon: <Bell size={16} />,
    color: "bg-gray-100 text-gray-600",
    link: "#",
  };

  // Xác định icon và link dựa trên type (lowercase từ Backend)
  switch (type) {
    case "like":
      config = {
        icon: <Heart size={16} fill="currentColor" />, // Fill icon cho đẹp
        color: "bg-red-100 text-red-500",
        link: `/recipes/${reference_id}`, // reference_id là recipe_id
      };
      break;

    case "comment":
    case "reply":
      config = {
        icon: <MessageCircle size={16} fill="currentColor" />,
        color: "bg-blue-100 text-blue-500",
        link: `/recipes/${reference_id}`, // reference_id có thể cần logic điều hướng
      };
      break;

    case "follow":
      config = {
        icon: <UserPlus size={16} />,
        color: "bg-orange-100 text-orange-500",
        link: `/profile/${Sender?.id}`, // Link đến trang cá nhân người follow
      };
      break;

    case "cooksnap":
      config = {
        icon: <Utensils size={16} />,
        color: "bg-yellow-100 text-yellow-600",
        link: `/recipes/${reference_id}`,
      };
      break;

    default:
      break;
  }

  return (
    <Link
      to={config.link}
      onClick={onClick}
      className={`flex items-start gap-4 p-4 transition-colors relative group ${
        is_read
          ? "bg-white hover:bg-gray-50"
          : "bg-orange-50/60 hover:bg-orange-50"
      }`}
    >
      {/* Avatar người gửi + Icon nhỏ ở góc */}
      <div className="relative flex-shrink-0">
        <img
          src={avatarUrl}
          alt={senderName}
          className="w-12 h-12 rounded-full object-cover border border-gray-200"
        />
        <div
          className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white ${config.color}`}
        >
          {config.icon}
        </div>
      </div>

      <div className="flex-1 min-w-0 pt-1">
        <div className="text-gray-900 text-sm leading-snug">
          <span className="font-bold hover:underline">{senderName}</span>{" "}
          <span className="text-gray-700">{message}</span>
        </div>

        <p className="text-xs text-gray-400 font-medium mt-1">
          {created_at
            ? formatDistanceToNow(new Date(created_at), {
                addSuffix: true,
                locale: vi,
              })
            : "Vừa xong"}
        </p>
      </div>

      {/* Dấu chấm xanh báo chưa đọc */}
      {!is_read && (
        <span className="w-2.5 h-2.5 bg-orange-500 rounded-full absolute top-1/2 right-4 -translate-y-1/2 shadow-sm"></span>
      )}
    </Link>
  );
}
