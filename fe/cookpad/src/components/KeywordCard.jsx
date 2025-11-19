export default function KeywordCard({ title, image }) {
  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={image} alt={title} className="w-full h-36 object-cover" />
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
        Premium
      </div>
      <h3 className="absolute bottom-1 left-4 font-semibold text-white mb-2 line-clamp-2">
        {title}
      </h3>
    </div>
  );
}
