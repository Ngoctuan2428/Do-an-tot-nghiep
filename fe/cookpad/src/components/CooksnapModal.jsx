import { X } from 'lucide-react';
import { useState } from 'react';

export default function CooksnapModal({ image, onClose, onSubmit }) {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!comment.trim()) return alert('Hãy nhập bình luận nhé!');
    onSubmit({ image, comment, createdAt: new Date().toISOString() });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-5 py-3">
          <h2 className="font-semibold text-center flex-1">
            Bạn thích gì nhất ở món này?
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col items-center">
          <img
            src={image}
            alt="Cooksnap preview"
            className="w-3/4 rounded-md mb-4 object-cover"
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn..."
            className="w-full border rounded-lg p-3 mb-4 resize-none focus:outline-none focus:ring-1 focus:ring-orange-400"
            rows={3}
          />
          <button
            onClick={handleSubmit}
            className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-orange-600 block mx-auto"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
