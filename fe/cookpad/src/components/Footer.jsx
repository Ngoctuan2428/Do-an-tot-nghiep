export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      {' '}
      {/* mt-auto để push xuống dưới nếu dùng flex */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Phần mô tả app */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-700 leading-relaxed mb-4 max-w-2xl mx-auto">
            Về PCook: Làm cho việc nấu ăn trở nên dễ dàng và thú vị hơn với hàng
            triệu công thức từ cộng đồng. Tìm kiếm và lưu công thức yêu thích,
            chia sẻ với bạn bè, và khám phá nguyên liệu mới mỗi ngày. Chúng tôi
            có hơn 100 triệu người dùng trên toàn thế giới!
          </p>
          <a
            href="/premium"
            className="text-sm text-cookpad-orange font-semibold underline hover:no-underline"
          >
            Đăng ký Gold Premium để truy cập công thức độc quyền và ưu đãn khác!
          </a>
        </div>

        {/* Danh sách quốc gia */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-6 text-xs text-gray-600">
          {/* Flags giả lập bằng emoji/text - bạn có thể thay bằng icon thật từ react-icons */}
          <span>🇺🇸 US</span>
          <span>🇬🇧 UK</span>
          <span>🇪🇸 ES</span>
          <span>🇦🇷 AR</span>
          <span>🇺🇾 UY</span>
          <span>🇲🇽 MX</span>
          <span>🇨🇱 CL</span>
          <span>🇻🇳 VN</span>
          <span>🇮🇩 ID</span>
          <span>🇫🇷 FR</span>
          <span>🇸🇦 SA</span>
          <span>🇦🇪 AR</span>
          <span>🇮🇹 IT</span>
          <span>🇮🇳 IN</span>
          <span>🇭🇺 HU</span>
          <span>🇳🇬 NG</span>
          <span>🇬🇷 GR</span>
          <span>🇲🇾 MY</span>
          <span>🇵🇹 PT</span>
          <span>🇺🇦 UA</span>
          <span>🇰🇷 KR</span>
          <span>🇹🇼 TW</span>
        </div>

        {/* Phần Tìm Hiểu Thêm */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 text-xs text-gray-600">
          <a href="#" className="hover:text-cookpad-orange transition-colors">
            Giới thiệu Premium
          </a>
          <a href="#" className="hover:text-cookpad-orange transition-colors">
            Sử dụng PCook
          </a>
          <a href="#" className="hover:text-cookpad-orange transition-colors">
            Góp ý
          </a>
          <a href="#" className="hover:text-cookpad-orange transition-colors">
            Bảo mật
          </a>
          <a href="#" className="hover:text-cookpad-orange transition-colors">
            Điều khoản
          </a>
          <a href="#" className="hover:text-cookpad-orange transition-colors">
            Liên hệ
          </a>
        </div>

        {/* Buttons tải app */}
        {/* <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <a
            href="#"
            className="flex items-center px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors"
          >
            <img
              src="https://developer.android.com/studio/images/android-studio-logo.png"
              alt="Google Play"
              className="w-5 h-5 mr-2"
            />
            Tải trên Google Play
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors"
          >
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              className="w-5 h-5 mr-2"
            />
            Tải trên App Store
          </a>
        </div> */}

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500 mb-4">
          Bản quyền © PCook Inc. All Rights Reserved
        </div>
      </div>
      {/* Minh họa rau củ ở dưới (dùng background SVG cho đơn giản, hoặc thêm image) */}
      <div className="bg-gradient-to-r from-cookpad-orange/10 to-cookpad-yellow/10 h-16 flex items-end justify-center">
        <div className="flex space-x-2 text-2xl">
          {' '}
          {/* Emoji rau củ */}
          <span>🍅</span>
          <span>🥕</span>
          <span>🥦</span>
          <span>🍊</span>
          <span>🌶️</span>
          <span>🥬</span>
          <span>🍅</span>
        </div>
      </div>
    </footer>
  );
}
