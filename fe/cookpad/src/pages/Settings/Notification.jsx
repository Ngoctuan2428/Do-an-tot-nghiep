import { useState } from 'react';

function Notification() {
  const [settings, setSettings] = useState({
    guide: false,
    fromCookpad: false,
    news: false,
  });

  const handleCheckboxChange = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = () => {
    console.log('Saved settings:', settings);
    alert('Đã cập nhật cài đặt thông báo!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Điều chỉnh chức năng thông báo
        </h1>

        {/* Settings Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Email Section Title */}
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Email</h2>

          {/* Checkboxes */}
          <div className="space-y-6 mb-8">
            {/* Hướng dẫn */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="guide"
                checked={settings.guide}
                onChange={() => handleCheckboxChange('guide')}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
              />
              <label htmlFor="guide" className="flex-1 cursor-pointer">
                <p className="font-medium text-gray-800 mb-1">Hướng dẫn</p>
                <p className="text-sm text-gray-600">
                  Chúng tôi sẽ email cho bạn để hướng dẫn cách tận dụng tốt nhất
                  các tính năng của Cookpad.
                </p>
              </label>
            </div>

            {/* Từ Cookpad */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="fromCookpad"
                checked={settings.fromCookpad}
                onChange={() => handleCheckboxChange('fromCookpad')}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
              />
              <label htmlFor="fromCookpad" className="flex-1 cursor-pointer">
                <p className="font-medium text-gray-800 mb-1">Từ Cookpad</p>
                <p className="text-sm text-gray-600">
                  Chúng tôi sẽ email cho bạn về những sự kiện theo mùa, khảo sát
                  và bí quyết hay từ đội ngũ Admin.
                </p>
              </label>
            </div>

            {/* Bản tin */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="news"
                checked={settings.news}
                onChange={() => handleCheckboxChange('news')}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
              />
              <label htmlFor="news" className="flex-1 cursor-pointer">
                <p className="font-medium text-gray-800 mb-1">Bản tin</p>
                <p className="text-sm text-gray-600">
                  Chúng tôi sẽ email cho bạn về những bản tin, gợi ý món ngon và
                  sự kiện nổi bật về cộng đồng Cookpad.
                </p>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;
