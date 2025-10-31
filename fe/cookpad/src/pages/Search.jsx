import RecipeCard from "../components/RecipeCard";
import KeywordCard from "../components/KeywordCard";
import SearchBar from "../components/SearchBar";
import pCook from "../../public/pCook.png";
import { useNavigate } from "react-router-dom";

const keywords = [
  {
    id: 1,
    title: "Thịt",
    image:
      "https://spicyfoodstudio.com/wp-content/uploads/2023/03/chup-anh-do-an-02.jpg",
  },
  {
    id: 2,
    title: "Bánh mì",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAknClSjZDs61TvQURlzDASUnuJ1YTrUXAI4fegJEl6D4jkIE9sCtx1GnOPuV23bld-X8&usqp=CAU",
  },
  {
    id: 3,
    title: "Cá",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-UcWvavWqUdsUTeb8wNp_eJ-qwUsPcaeAXvvmQbri6BcgjyXh_9eflk2ifhMSEEZfc2k&usqp=CAU",
  },
  {
    id: 4,
    title: "Đậu hũ",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpt5UtC_8kYFm52vw4fMA0NxcBBQ7Z_wkA8g&s",
  },
  {
    id: 5,
    title: "Cá tầm",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsVVy6lcBU8KFdy06tNmQgOFryd_-Htv7V_w&s",
  },
  {
    id: 6,
    title: "Trứng",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReLhbbCEAGduomuDYEn3PHufu9yoG-FchdbQ&s",
  },
  {
    id: 7,
    title: "Món ngon mỗi ngày",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgircv16aYN3FPY4ae9t-JEBWBMcVIIfYzUw&s",
  },
  {
    id: 8,
    title: "Spaghetti",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmieI6GUbehVX6sK9g4PWyrN4Y7-1IVQfFQw&s",
  },
];

export default function Search() {
  // Add useNavigate hook
  const navigate = useNavigate();

  // Optional: Handle search submission from SearchBar
  const handleSearchSubmit = (searchTerm) => {
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.toLowerCase())}`);
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6">
      {/* Banner */}
      <div className="flex justify-center mb-6">
        <img src={pCook} className="w-1/6" alt="logo" />
      </div>

      {/* Search Bar - Pass the submit handler */}
      <div className="flex flex-row justify-center mb-8">
        <SearchBar onSearch={handleSearchSubmit} />
      </div>

      {/* Grid Keywords - Each keyword is clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {keywords.map((keyword) => (
          <KeywordCard key={keyword.id} {...keyword} />
        ))}
      </div>

      {/* Premium Section */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <span className="bg-yellow-400 text-black px-2 py-1 rounded mr-2 text-sm">
            Premium
          </span>
          Top Món Ăn Premium
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Thêm 3 cards premium */}
          <RecipeCard
            title="Cá kho tộ"
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz9zkfWHKnT-Lij3GJTl1mXfWebB9Ennk2jA&s"
            premium
            views={500}
            likes={100}
          />
          <RecipeCard
            title="Thịt chuột nướng"
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWvrEUp-CuFJwKEA4Iswu4ZJKPkdloGyya9w&s"
            premium
            views={500}
            likes={100}
          />
          <RecipeCard
            title="Hàu nướng mỡ hành"
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk9XYzXEHeSxYLdB6vPOLb-DPC0kUoH5i0rg&s"
            premium
            views={500}
            likes={100}
          />
        </div>
      </section>
    </main>
  );
}
