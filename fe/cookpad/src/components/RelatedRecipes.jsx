export default function RelatedRecipes({ recipes }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6">Các Món Tương Tự</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((r, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition"
          >
            <img
              src={r.img}
              alt={r.title}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{r.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {r.desc}
              </p>
              <p className="text-sm text-gray-500">👩‍🍳 {r.author}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold mt-8 mx-auto block hover:bg-orange-600">
        Xem thêm chỉ với 25.000 ₫/tháng
      </button>
    </section>
  );
}
