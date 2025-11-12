// src/components/StepList.jsx
import React, { useState } from "react";
import {
  Camera,
  Plus,
  MoreHorizontal,
  GripVertical,
  Loader2,
} from "lucide-react";
import { uploadMedia } from "../services/uploadApi";

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export default function StepList({ stepsData = [], onChange }) {
  const [cookTime, setCookTime] = useState("1 tiếng 30 phút");
  const [menuOpen, setMenuOpen] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);

  const publish = (next) => {
    onChange?.(next);
  };

  const addStep = () => {
    const next = [...stepsData, { id: uid(), text: "", image: null }];
    publish(next);
  };

  const updateStepText = (id, text) =>
    publish(stepsData.map((s) => (s.id === id ? { ...s, text } : s)));

  const deleteStep = (id) => publish(stepsData.filter((s) => s.id !== id));

  const handleDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.setData("text/plain", id);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain") || dragId;
    if (!sourceId || sourceId === targetId) return;
    const srcIndex = stepsData.findIndex((s) => s.id === sourceId);
    const tgtIndex = stepsData.findIndex((s) => s.id === targetId);
    if (srcIndex === -1 || tgtIndex === -1) return;
    const arr = [...stepsData];
    const [moved] = arr.splice(srcIndex, 1);
    arr.splice(tgtIndex, 0, moved);
    publish(arr);
    setDragId(null);
  };

  const handleImageChange = async (e, stepId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(stepId);

    try {
      const uploadRes = await uploadMedia(file);
      const serverUrl = uploadRes.data.url;
      publish(
        stepsData.map((s) => (s.id === stepId ? { ...s, image: serverUrl } : s))
      );
    } catch (error) {
      console.error("Lỗi upload ảnh bước:", error);
      alert("Upload ảnh thất bại!");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Các bước</h3>
      </div>

      <div className="space-y-6">
        {stepsData.map((s, index) => (
          <div key={s.id} className="bg-white border rounded-md p-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-white font-medium">
                {index + 1}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <input
                    value={s.text}
                    onChange={(e) => updateStepText(s.id, e.target.value)}
                    placeholder="Mô tả bước..."
                    className="w-full bg-orange-50 rounded px-3 py-2 outline-none"
                  />
                  <div className="relative">
                    <button
                      onClick={() =>
                        setMenuOpen(s.id === menuOpen ? null : s.id)
                      }
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-500" />
                    </button>
                    {menuOpen === s.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow z-40">
                        <button
                          onClick={() => {
                            deleteStep(s.id);
                            setMenuOpen(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-500"
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, s.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, s.id)}
                  className="mt-3 flex gap-4 items-center"
                >
                  <div className="w-36 h-24 border rounded-md bg-orange-50 flex items-center justify-center">
                    {uploadingId === s.id ? (
                      <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                    ) : s.image ? (
                      <img
                        src={s.image}
                        alt={`step-${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      // ✅ 3. SỬA LỖI: 'Ca' thành 'Camera'
                      <label className="flex flex-col items-center justify-center cursor-pointer text-gray-500">
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-xs">Thêm hình</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, s.id)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div className="text-sm text-gray-600">
                    Kéo để thay đổi thứ tự bước
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addStep}
        className="mt-5 text-orange-500 font-medium text-sm flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> Bước làm
      </button>
    </div>
  );
}
