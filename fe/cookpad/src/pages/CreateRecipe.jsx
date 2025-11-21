import { useState } from 'react';
import { Camera, Trash2, Save, Upload, Plus } from 'lucide-react';
import IngredientList from '../components/IngredientList';
import StepList from '../components/StepList';

export default function CreateRecipe() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('Món canh bí ngon nhất nhà mình');
  const [desc, setDesc] = useState('');
  const user = {
    name: 'Page One',
    username: 'cook_114380624',
    avatar: 'https://i.pravatar.cc/100?img=45',
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  return (
    <div className="p-8 w-full px-4 md:px-10 bg-white">
      {/* Top Header */}
      <div className="flex justify-end gap-3 mb-6">
        <button className="border border-red-400 text-red-500 px-4 py-1.5 rounded-md hover:bg-red-50 flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Xóa
        </button>
        <button className="border text-gray-600 px-4 py-1.5 rounded-md hover:bg-gray-50">
          Lưu và Đóng
        </button>
        <button className="bg-orange-500 text-white px-4 py-1.5 rounded-md hover:bg-orange-600 flex items-center gap-2">
          <Upload className="w-4 h-4" /> Lên sóng
        </button>
      </div>

      {/* Main section */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left: Image upload */}
        <div className="flex flex-col items-center justify-center border rounded-md bg-orange-50 aspect-[3/4]">
          {!image ? (
            <label
              htmlFor="file"
              className="flex flex-col items-center justify-center cursor-pointer text-gray-600 text-center p-6"
            >
              <Camera className="w-10 h-10 mb-2 text-gray-400" />
              <p className="font-medium">
                Bạn đã đăng hình món mình nấu ở đây chưa?
              </p>
              <p className="text-sm text-gray-500">
                Chia sẻ với mọi người thành phẩm nấu nướng của bạn nào!
              </p>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          ) : (
            <img
              src={image}
              alt="preview"
              className="w-full h-full object-cover rounded-md"
            />
          )}
        </div>

        {/* Right: Title + description */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold border-0 border-b w-full focus:ring-0 focus:border-orange-400 mb-4"
            placeholder="Tên món..."
          />

          {/* Author info */}
          <div className="flex items-center gap-2 mb-4">
            <img
              src={user.avatar}
              alt="user"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </div>

          {/* Description */}
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Hãy chia sẻ với mọi người về món này của bạn nhé..."
            className="w-full border rounded-md p-3 text-gray-700 h-24 focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      {/* Ingredients + Steps */}
      <div className="grid grid-cols-2 gap-10 mt-10">
        <IngredientList />
        <StepList />
      </div>
    </div>
  );
}
