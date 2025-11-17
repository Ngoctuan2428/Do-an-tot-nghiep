export default function Home() {
  const sections = [
    {
      id: 1,
      title: 'Khởi Tạo Bộ Sưu Tập Công Thức Món Ngon Của Bạn',
      desc: 'Đóng góp công thức nấu ăn tại nhà yêu thích của bạn vào Cộng đồng PCook và chia sẻ chúng với gia đình và bạn bè. Lưu các công thức nấu ăn được chia sẻ bởi những chủ bếp khác và thêm chúng vào bộ sưu tập của bạn.',
      image:
        'https://chupanhquangcao.com/wp-content/uploads/2022/08/ung-dung-chup-anh-mon-an-dep.jpg',
      bg: 'bg-white',
    },
    {
      id: 2,
      title:
        'Tải ứng dụng PCook để tạo công thức nấu ăn của bạn trong vài phút với trợ lý AI',
      desc: 'Chỉ cần mở trình chỉnh sửa công thức, trả lời các câu hỏi mà trợ lý của chúng tôi hỏi về công thức bạn muốn tạo, và ngay cả khi bạn không nhớ hết mọi chi tiết, trợ lý của chúng tôi sẽ tạo công thức cho bạn – bao gồm cả phần nguyên liệu và hướng dẫn từng bước. Thật nhanh chóng và dễ dàng để chia sẻ các món ăn yêu thích của bạn!',
      subdesc:
        'Nếu bạn muốn tự tạo chi tiết, chỉ cần bấm “Bỏ qua” để chuyển đến trình chỉnh sửa công thức thông thường không dùng AI. Tuỳ bạn chọn nhé!',
      image: 'https://blog.dktcdn.net/files/chup-anh-do-an-2.png',
      bg: 'bg-orange-50',
    },
    {
      id: 3,
      title:
        'Đóng góp công thức của bạn và xem nó truyền cảm hứng cho người khác',
      desc: 'Chia sẻ công thức của bạn và xem mọi người tái hiện món ăn, sáng tạo thêm theo cách riêng. Mỗi món ăn bạn chia sẻ đều là nguồn cảm hứng mới cho cộng đồng đầu bếp tại nhà trên khắp thế giới.',
      image:
        'https://assets.tronhouse.vn/59185068-4c44-404a-a5b6-493d1d50d13d/origin/chup-hinh-mon-an-1.jpeg',
      bg: 'bg-white',
    },
  ];

  return (
    <div className="w-full">
      {sections.map((section, index) => (
        <section
          key={section.id}
          className={`${section.bg} py-16 border-b last:border-none`}
        >
          <div
            className={`max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 px-6 ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Text */}
            <div className="lg:w-1/2">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                {section.title}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {section.desc}
              </p>
              {section.subdesc && (
                <p className="text-gray-600 text-sm mb-4">{section.subdesc}</p>
              )}
              {section.id === 2 && (
                <a
                  href="https://play.google.com/store/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Google Play"
                    className="w-40"
                  />
                </a>
              )}
            </div>

            {/* Image */}
            <div className="lg:w-1/2 flex justify-center">
              <img
                src={section.image}
                alt={section.title}
                className="w-72 h-auto object-contain"
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
