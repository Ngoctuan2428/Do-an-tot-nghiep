import { useState } from 'react';
import { Sparkles } from 'lucide-react';

function Blocked() {
  const [blockedUsers, setBlockedUsers] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Danh sách các bếp đã bị chặn
          </h1>
          <p className="text-gray-600">
            Đây là các bếp bạn đã chặn. Các bếp này sẽ không thể tương tác với
            bạn qua Cookpad.
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Icon bát ăn với Sparkles */}
            <div className="relative mb-6">
              {/* Sparkles trên đầu */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>

              {/* Icon bát - vẽ bằng SVG đơn giản */}
              <svg
                className="w-24 h-24 text-gray-400"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Miệng bát */}
                <ellipse
                  cx="50"
                  cy="45"
                  rx="28"
                  ry="8"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
                {/* Thân bát */}
                <path
                  d="M 22 45 Q 22 68, 50 73 Q 78 68, 78 45"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
                {/* Chân bát */}
                <ellipse cx="50" cy="82" rx="12" ry="3" fill="currentColor" />
                <path d="M 38 82 L 40 73 L 60 73 L 62 82" fill="currentColor" />
              </svg>
            </div>

            {/* Text */}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Không có ai bị chặn
            </h2>
            <p className="text-gray-600 max-w-md">
              Khi bạn chặn ai đó, họ sẽ xuất hiện trong danh sách này
            </p>
          </div>
        </div>

        {/* Phần này sẽ hiển thị khi có người bị chặn */}
        {blockedUsers.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="space-y-4">
              {blockedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setBlockedUsers(
                        blockedUsers.filter((u) => u.id !== user.id)
                      );
                    }}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Bỏ chặn
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Blocked;
