import React, { useRef } from 'react';
import { Trash2, Save, UploadCloud } from 'lucide-react';

export default function RecipeFormHeader({
  onDelete,
  onSave,
  onPublish,
  image,
  onImageChange,
  title,
  onTitleChange,
}) {
  const fileRef = useRef(null);

  const handleFileClick = () => fileRef.current?.click();
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f && onImageChange) {
      onImageChange(URL.createObjectURL(f), f);
    }
  };

  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      {/* Left: image preview box */}
      <div className="w-72">
        <div
          className="aspect-[3/4] bg-orange-50 border rounded-md flex items-center justify-center cursor-pointer"
          onClick={handleFileClick}
        >
          {image ? (
            <img
              src={image}
              alt="preview"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="text-center px-4">
              <div className="mb-2 text-orange-500">
                <UploadCloud className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-sm text-gray-600">
                Bạn đã đăng hình món mình nấu ở đây chưa?
                <div className="text-xs mt-1 text-gray-400">
                  Chia sẻ với mọi người thành phẩm của bạn!
                </div>
              </div>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Right: title, user, actions */}
      <div className="flex-1">
        <input
          value={title}
          onChange={(e) => onTitleChange?.(e.target.value)}
          placeholder="Tên món: Món canh bí ngon nhất nhà mình"
          className="w-full text-xl md:text-2xl font-semibold border-0 border-b pb-2 focus:outline-none focus:border-orange-400"
        />

        <div className="mt-3 text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40?img=5"
              alt="author"
              className="w-9 h-9 rounded-full"
            />
            <div>
              <div className="font-medium">
                Page One{' '}
                <span className="text-gray-400 font-normal">
                  @cook_114380624
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                Hãy chia sẻ với mọi người về món này của bạn nhé...
              </div>
            </div>
          </div>
        </div>

        {/* action buttons */}
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-red-300 text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" /> Xóa
          </button>

          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50"
          >
            <Save className="w-4 h-4" /> Lưu và Đóng
          </button>

          <button
            onClick={onPublish}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
          >
            <UploadCloud className="w-4 h-4" /> Lên sóng
          </button>
        </div>
      </div>
    </div>
  );
}
