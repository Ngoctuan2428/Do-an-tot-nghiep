// import RecipeCard from '../components/RecipeCard';

// const recipes = [
//   {
//     id: 1,
//     title: 'Thịt',
//     image: 'https://via.placeholder.com/300x200?text=Thịt+Kho+Tàu',
//     premium: false,
//     views: 1200,
//     likes: 250,
//   },
//   {
//     id: 2,
//     title: 'Bánh mì',
//     image: 'https://via.placeholder.com/300x200?text=Bánh+Mì',
//     premium: true,
//     views: 800,
//     likes: 180,
//   },
//   {
//     id: 3,
//     title: 'Cá',
//     image: 'https://via.placeholder.com/300x200?text=Bánh+Mì',
//     premium: true,
//     views: 1800,
//     likes: 120,
//   },
//   {
//     id: 4,
//     title: 'Đậu hũ',
//     image: 'https://via.placeholder.com/300x200?text=Bánh+Mì',
//     premium: true,
//     views: 80,
//     likes: 10,
//   },
//   {
//     id: 5,
//     title: 'Cá tầm',
//     image: 'https://via.placeholder.com/300x200?text=Bánh+Mì',
//     premium: true,
//     views: 2570,
//     likes: 102,
//   },
//   {
//     id: 6,
//     title: 'Trứng',
//     image: 'https://via.placeholder.com/300x200?text=Bánh+Mì',
//     premium: true,
//     views: 1450,
//     likes: 450,
//   },
//   {
//     id: 7,
//     title: 'Món ngon mỗi ngày',
//     image: 'https://via.placeholder.com/300x200?text=Bánh+Mì',
//     premium: true,
//     views: 3500,
//     likes: 3000,
//   },
//   {
//     id: 8,
//     title: 'Spaghetti',
//     image: 'https://via.placeholder.com/300x200?text=Bánh+Mì',
//     premium: true,
//     views: 2090,
//     likes: 235,
//   },
// ];

// export default function Home() {
//   return (
//     <main className="max-w-7xl mx-auto p-6">
//       {/* Banner */}
//       <div className="bg-gradient-to-r from-cookpad-orange to-cookpad-yellow text-white p-6 rounded-lg mb-6 text-center">
//         <h2 className="text-2xl font-bold mb-2">Chào mừng đến với Cookpad!</h2>
//         <p className="text-sm">Khám phá hàng ngàn công thức nấu ăn dễ làm.</p>
//       </div>

//       {/* Grid Recipes */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {recipes.map((recipe) => (
//           <RecipeCard key={recipe.id} {...recipe} />
//         ))}
//       </div>

//       {/* Premium Section */}
//       <section className="bg-white p-6 rounded-lg shadow-md mb-6">
//         <h3 className="text-lg font-bold mb-4 flex items-center">
//           <span className="bg-yellow-400 text-black px-2 py-1 rounded mr-2 text-sm">
//             Premium
//           </span>
//           Top Món Ăn Premium
//         </h3>
//         <div className="grid grid-cols-3 gap-4">
//           {/* Thêm 3 cards premium */}
//           <RecipeCard
//             title="Cá kho tộ"
//             image="https://via.placeholder.com/150x100?text=Cá+Kho"
//             premium
//             views={500}
//             likes={100}
//           />
//         </div>
//       </section>
//     </main>
//   );
// }
export default function Home() {
  const sections = [
    {
      id: 1,
      title: 'Khởi Tạo Bộ Sưu Tập Công Thức Món Ngon Của Bạn',
      desc: 'Đóng góp công thức nấu ăn tại nhà yêu thích của bạn vào Cộng đồng Cookpad và chia sẻ chúng với gia đình và bạn bè. Lưu các công thức nấu ăn được chia sẻ bởi những chủ bếp khác và thêm chúng vào bộ sưu tập của bạn.',
      image:
        'https://chupanhquangcao.com/wp-content/uploads/2022/08/ung-dung-chup-anh-mon-an-dep.jpg',
      bg: 'bg-white',
    },
    {
      id: 2,
      title:
        'Tải ứng dụng Cookpad để tạo công thức nấu ăn của bạn trong vài phút với trợ lý AI',
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
