import {
  Camera,
  ThumbsUp,
  Heart,
  Hand,
  Soup,
  Bookmark,
  MoreHorizontal,
  Share2,
  Printer,
  X,
  User,
  MapPin,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import CooksnapModal from '../components/CooksnapModal';

export default function CooksnapSection({ recipe, cooksnaps, onAddCooksnap }) {
  const [isFriend, setIsFriend] = useState(false);
  // const [cooksnaps, setCooksnaps] = useState([]);
  const [showCooksnapModal, setShowCooksnapModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  // Trạng thái mỗi loại reaction (đã bấm hay chưa)
  const [likes, setLikes] = useState({ liked: false, count: 7 });
  const [hearts, setHearts] = useState({ liked: false, count: 9 });
  const [claps, setClaps] = useState({ liked: false, count: 5 });
  const fileInputRef = useRef(null);

  const handleAddCooksnap = (data) => {
    setCooksnaps((prev) => [...prev, data]);
  };

  // Mở file picker khi click nút “Chọn hình”
  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Xử lý file được chọn
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    // if (file) {
    //   alert(`Đã chọn hình: ${file.name}`);
    // }
    if (!file) return;
    const imageURL = URL.createObjectURL(file);
    setSelectedImage(imageURL);
    setShowCooksnapModal(true);
  };

  // Toggle hàm
  const toggle = (type) => {
    if (type === 'like') {
      setLikes((prev) => ({
        liked: !prev.liked,
        count: prev.count + (prev.liked ? -1 : 1),
      }));
    } else if (type === 'heart') {
      setHearts((prev) => ({
        liked: !prev.liked,
        count: prev.count + (prev.liked ? -1 : 1),
      }));
    } else if (type === 'clap') {
      setClaps((prev) => ({
        liked: !prev.liked,
        count: prev.count + (prev.liked ? -1 : 1),
      }));
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10 border-t border-gray-200">
      <div className="flex items-center gap-2 text-gray-600 mb-3">
        <button
          onClick={() => toggle('like')}
          className={`flex items-center gap-1 transition ${
            likes.liked ? 'text-blue-500' : 'hover:text-blue-400'
          }`}
        >
          <ThumbsUp
            className={`w-4 h-4 ${
              likes.liked ? 'fill-blue-500 text-blue-500' : ''
            }`}
          />
          <span>{likes.count}</span>
        </button>

        <button
          onClick={() => toggle('heart')}
          className={`flex items-center gap-1 transition ${
            hearts.liked ? 'text-red-500' : 'hover:text-red-400'
          }`}
        >
          <Heart
            className={`w-4 h-4 ${
              hearts.liked ? 'fill-red-500 text-red-500' : ''
            }`}
          />
          <span>{hearts.count}</span>
        </button>

        <button
          onClick={() => toggle('clap')}
          className={`flex items-center gap-1 transition ${
            claps.liked ? 'text-yellow-500' : 'hover:text-yellow-400'
          }`}
        >
          <Hand
            className={`w-4 h-4 ${
              claps.liked ? 'fill-yellow-500 text-yellow-500' : ''
            }`}
          />
          <span>{claps.count}</span>
        </button>
      </div>

      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold">Cooksnap</h3>
          <Camera className="w-6 h-6 text-gray-600" />
        </div>
        <p className="text-gray-700 mb-3">
          Bạn đã làm theo món này phải không? Hãy chia sẻ hình ảnh và cảm nhận
          của bạn!
        </p>
        <button
          className="bg-black text-white px-5 py-2 rounded-lg mx-auto block mb-2 hover:bg-gray-800"
          onClick={handleChooseFile}
        >
          Gửi Cooksnap
          <input
            ref={fileInputRef}
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </button>
        {/* Danh sách cooksnap */}
        {cooksnaps.length > 0 && (
          <div className="mt-6 space-y-6">
            {cooksnaps.map((snap, i) => (
              <div
                key={i}
                className="bg-white border rounded-lg shadow-sm p-4 flex flex-col gap-3"
              >
                <img
                  src={snap.image}
                  alt="cooksnap"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className="text-gray-800">{snap.comment}</p>
                <p className="text-gray-400 text-sm">
                  Gửi lúc: {new Date(snap.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
        <a href="#" className="text-blue-500 text-sm block text-center mt-4">
          Tìm hiểu thêm về Cooksnap
        </a>
      </div>

      <p className="text-center text-gray-400 text-sm mt-6">
        ID Công thức: {recipe.id}
      </p>

      {/* Thông tin tác giả */}
      <div className="flex items-center gap-4 mt-8">
        <img
          src={recipe.author.avatar}
          alt={recipe.author.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-lg">{recipe.author.name}</p>
          <p className="text-gray-600 text-sm">
            vào {recipe.author.joined} · {recipe.author.location}
          </p>
          <button
            onClick={() => setIsFriend(!isFriend)}
            className={`mt-2  px-4 py-1 rounded-lg text-sm border border-gray-300 ${
              isFriend ? 'text-black bg-white' : 'bg-gray-700 text-white'
            }`}
          >
            {' '}
            {isFriend ? ' Bạn bếp' : ' Kết bạn bếp '}
          </button>
        </div>
      </div>
      <p className="mt-4 text-gray-700">{recipe.author.bio}</p>

      {/* Bình luận */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-3">Bình luận</h3>
        <div className="flex items-center gap-3">
          <img
            src="https://placehold.co/40x40"
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <input
            type="text"
            placeholder="Thêm bình luận..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
          <button className="bg-orange-500 text-white rounded-full px-3 py-2 hover:bg-orange-600">
            ➤
          </button>
        </div>
      </div>

      {showCooksnapModal && (
        <CooksnapModal
          image={selectedImage}
          onClose={() => setShowCooksnapModal(false)}
          // onSubmit={onAddCooksnap}
          onSubmit={(data) => {
            onAddCooksnap(data); // gọi hàm cha
            setShowCooksnapModal(false);
          }}
        />
      )}
    </section>
  );
}
