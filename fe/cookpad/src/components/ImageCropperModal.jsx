// src/components/ImageCropperModal.jsx
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, RotateCw, Image as ImageIcon } from "lucide-react";
import getCroppedImg from "../utils/cropImage";

export default function ImageCropperModal({
  imageSrc,
  onClose,
  onCropComplete,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const onCropChange = (crop) => setCrop(crop);
  const onZoomChange = (zoom) => setZoom(zoom);

  const onCropAreaChange = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Tạo file ảnh mới từ vùng cắt
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      // Gửi file ảnh đã cắt ra ngoài
      onCropComplete(croppedImageBlob);
    } catch (e) {
      console.error(e);
      alert("Có lỗi khi cắt ảnh");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-lg overflow-hidden flex flex-col h-[500px] relative">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <button onClick={onClose} className="opacity-0 cursor-default">
            <X />
          </button>{" "}
          {/* Spacer */}
          <h3 className="font-semibold text-gray-700">Cắt Hình</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:bg-gray-100 p-1 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={4 / 3} // Tỉ lệ khung hình (bạn có thể đổi thành 1/1 cho avatar)
            onCropChange={onCropChange}
            onCropComplete={onCropAreaChange}
            onZoomChange={onZoomChange}
          />
        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between gap-4">
          {/* Nút Đổi Hình (Giả lập click input file gốc) */}
          <button
            onClick={onClose} // Tạm thời đóng để chọn lại, hoặc truyền callback đổi hình
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Đổi Hình
          </button>

          {/* Nút Xoay */}
          <button
            onClick={() => setRotation((prev) => prev + 90)}
            className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
            title="Xoay ảnh"
          >
            <RotateCw size={18} />
          </button>

          {/* Nút Tiếp Theo */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Tiếp theo"}
          </button>
        </div>
      </div>
    </div>
  );
}
