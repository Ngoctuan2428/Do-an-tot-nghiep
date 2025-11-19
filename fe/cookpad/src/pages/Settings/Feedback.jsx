import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Feedback() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!feedback.trim()) {
      alert('Vui lòng nhập nội dung góp ý trước khi gửi!');
      return;
    }

    // Giả lập gửi feedback (có thể thay bằng gọi API)
    setSubmitted(true);
    setTimeout(() => {
      alert('Cảm ơn bạn đã gửi góp ý cho PCook 💛');
      setFeedback('');
      setSubmitted(false);
      navigate(-1); // Quay lại trang trước
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-gray-800">
      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold mb-4">
        Giúp chúng tôi cải thiện dịch vụ
      </h1>

      {/* Mô tả */}
      <p className="text-gray-700 mb-2 leading-relaxed">
        PCook luôn không ngừng hoàn thiện dịch vụ để khiến bạn hài lòng hơn. Rất
        mong nhận được phản hồi của bạn để PCook có thể cải thiện tốt hơn.
      </p>
      <p className="text-gray-700 mb-6">
        Nếu bạn có câu hỏi hay gặp vấn đề gì, vui lòng mở{' '}
        <a href="/faq" className="text-orange-500 hover:underline font-medium">
          Trang FAQ
        </a>
        .
      </p>

      {/* Form góp ý */}
      <form onSubmit={handleSubmit} className="mb-10">
        <textarea
          placeholder="Vui lòng ghi góp ý của bạn ở đây"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full h-40 p-4 border rounded-md bg-orange-50 placeholder-gray-400 focus:outline-none focus:border-orange-400 text-gray-700"
        />

        <button
          type="submit"
          disabled={submitted}
          className="mt-4 bg-orange-500 text-white font-semibold px-8 py-2 rounded-md hover:bg-orange-600 transition disabled:opacity-50"
        >
          {submitted ? 'Đang gửi...' : 'Gửi'}
        </button>
      </form>

      {/* Ghi chú */}
      <div className="text-sm text-gray-600 space-y-4">
        <p>
          Vui lòng không đưa bất kỳ thông tin nhận dạng cá nhân nào (dữ liệu cá
          nhân) vào biểu mẫu phản hồi này, bao gồm tên hoặc chi tiết liên hệ của
          bạn.
        </p>

        <p>
          Chúng tôi sẽ sử dụng thông tin này để giúp chúng tôi cải thiện dịch vụ
          của mình. Bằng cách gửi phản hồi này, bạn đồng ý xử lý thông tin của
          mình theo{' '}
          <a href="/privacy" className="text-orange-500 hover:underline">
            Chính Sách Bảo Mật
          </a>{' '}
          và{' '}
          <a href="/terms" className="text-orange-500 hover:underline">
            Điều Khoản Dịch Vụ
          </a>{' '}
          của chúng tôi.
        </p>
      </div>
    </div>
  );
}
