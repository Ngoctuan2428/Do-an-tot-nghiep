import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

function FAQ() {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqData = {
    accountInfo: {
      title: 'Thông tin tài khoản',
      questions: [
        {
          id: 'q1',
          question: 'Làm thế nào để tôi thay đổi tên người dùng?',
          answer: (
            <div className="space-y-2">
              <p>
                • Trên trang web, chạm vào ảnh hồ sơ của bạn ở góc trên bên
                trái, nhấp vào "Bếp cá nhân" và nhấp vào "Sửa trang bếp cá
                nhân". Sau đó, bạn có thể chỉnh sửa tên người dùng, ví trí, tiểu
                sử hoặc thay đổi ảnh hồ sơ của mình.
              </p>
              <p>
                • Trên Android hoặc iOS, chạm vào ảnh hồ sơ của bạn ở góc trên
                bên trái, nhấp vào "Bếp cá nhân" và nhấp vào "Sửa trang bếp cá
                nhân" và bạn có thể chỉnh sửa tên người dùng, email, ví trí,
                tiểu sử hoặc thay đổi ảnh hồ sơ của mình.
              </p>
            </div>
          ),
        },
        {
          id: 'q2',
          question: 'Làm thế nào để tắt/bật thông báo của tôi?',
          answer: (
            <p>
              Bây là trang nơi bạn có thể chỉnh sửa{' '}
              <a href="#" className="text-blue-600 hover:underline">
                tùy chọn thông báo
              </a>
              .
            </p>
          ),
        },
        {
          id: 'q3',
          question: 'Tôi không thể đăng nhập',
          answer: (
            <p>
              Để đặt lại mật khẩu, vui lòng{' '}
              <a href="#" className="text-blue-600 hover:underline">
                nhấp vào đây
              </a>
              . Nếu bạn vẫn gặp khó khăn khi đăng nhập hoặc quên mật khẩu, vui
              lòng liên hệ với chúng tôi theo địa chỉ{' '}
              <a
                href="mailto:info-vn@cookpad.com"
                className="text-blue-600 hover:underline"
              >
                info-vn@cookpad.com
              </a>
              .
            </p>
          ),
        },
        {
          id: 'q4',
          question: 'Tôi muốn hủy hoặc xóa tài khoản của mình',
          answer: (
            <p>
              Bạn có thể hủy hoặc xóa tài khoản của mình bằng cách nhấp vào{' '}
              <a href="#" className="text-blue-600 hover:underline">
                đây
              </a>
              .
            </p>
          ),
        },
      ],
    },
    notifications: {
      title: 'Thông báo',
      questions: [
        {
          id: 'q5',
          question: 'Làm thế nào để tôi nhận được email?',
          answer: (
            <p>
              Nếu bạn muốn được thêm vào danh sách email của chúng tôi, vui lòng
              bật thông báo bằng cách nhấp vào tùy chọn đó trên{' '}
              <a href="#" className="text-blue-600 hover:underline">
                trang thông báo
              </a>
              .
            </p>
          ),
        },
        {
          id: 'q6',
          question: 'Làm thế nào để tôi hủy đăng ký nhận email?',
          answer: (
            <p>
              Bạn có thể thay đổi tùy chọn email và thông báo của mình bất kỳ
              lúc nào bằng cách cập nhật tùy chọn của bạn trên{' '}
              <a href="#" className="text-blue-600 hover:underline">
                trang thông báo
              </a>
              .
            </p>
          ),
        },
      ],
    },
    usingCookpad: {
      title: 'Sử dụng PCook',
      questions: [
        {
          id: 'q7',
          question: 'Tìm công thức nấu ăn để nấu ăn hôm nay',
          answer: (
            <p>
              Bạn có thể tìm kiếm công thức theo thành phần cũng như theo tên
              món ăn hoặc dụng cụ nấu ăn. Điều đó có nghĩa là với PCook, bạn có
              thể tìm thấy công thức nấu ăn với bất kỳ sự kết hợp nguyên liệu
              nào bạn có trong bếp.
            </p>
          ),
        },
        {
          id: 'q8',
          question: 'Dịch vụ PCook Premium là gì?',
          answer: (
            <p>
              Dịch vụ Premium của PCook giúp bạn dễ dàng tìm thấy những công
              thức nấu ăn phổ biến nhất trên PCook. "Phổ biến nhất" có nghĩa là
              những công thức nấu ăn đã được hàng nghìn người dùng nấu và thưởng
              thức nhiều nhất trong nhiều năm qua.
            </p>
          ),
        },
        {
          id: 'q9',
          question:
            'Làm thế nào để tôi có thể duyệt qua các công thức nấu ăn của các quốc gia khác?',
          answer: (
            <p>
              Bạn có thể duyệt qua các công thức nấu ăn từ các quốc gia khác
              nhau trên PCook bằng cách chuyển đổi ngôn ngữ trong cài đặt.
            </p>
          ),
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Câu hỏi thường gặp
        </h1>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {Object.entries(faqData).map(([key, section]) => (
            <div
              key={key}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(key)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {section.title}
                </h2>
                {openSections[key] ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Section Content */}
              {openSections[key] && (
                <div className="px-6 pb-6">
                  {section.questions.map((item, index) => (
                    <div
                      key={item.id}
                      className={`${
                        index > 0 ? 'mt-6 pt-6 border-t border-gray-200' : ''
                      }`}
                    >
                      <h3 className="font-medium text-gray-800 mb-3">
                        {index + 1}. {item.question}
                      </h3>
                      <div className="text-gray-600 text-sm leading-relaxed">
                        {item.answer}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;
