export default function RecipeCard({
  title,
  image,
  premium = false,
  views = 0,
  likes = 0,
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={image} alt={title} className="w-full h-36 object-cover" />
      {premium && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
          Premium
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {title}
        </h3>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{views} lượt xem</span>
          <span>{likes} lượt thích</span>
        </div>
      </div>
    </div>
  );
}
