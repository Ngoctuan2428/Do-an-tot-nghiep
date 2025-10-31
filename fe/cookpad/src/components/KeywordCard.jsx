import { useNavigate } from "react-router-dom";

export default function KeywordCard({ title, image }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/search/${encodeURIComponent(title.toLowerCase())}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
        <h3 className="absolute bottom-4 left-4 text-white font-medium">
          {title}
        </h3>
      </div>
    </div>
  );
}
