import React, { useState } from 'react';
import { Camera, Plus, MoreHorizontal, GripVertical } from 'lucide-react';

/**
 * StepList - manage steps:
 * - add step
 * - delete step via 3-dot menu
 * - reorder steps via drag & drop
 */

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export default function StepList({ onChange }) {
  const [cookTime, setCookTime] = useState('1 tiếng 30 phút');
  const [steps, setSteps] = useState(() => [
    { id: uid(), text: 'Trộn bột và nước đến khi đặc lại', image: null },
    {
      id: uid(),
      text: 'Đậy kín hỗn hợp lại và để ở nhiệt độ phòng trong 24-36 tiếng',
      image: null,
    },
  ]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [dragId, setDragId] = useState(null);

  const publish = (next) => {
    setSteps(next);
    onChange?.(next);
  };

  const addStep = () => {
    const next = [...steps, { id: uid(), text: '', image: null }];
    publish(next);
  };

  const updateStepText = (id, text) =>
    publish(steps.map((s) => (s.id === id ? { ...s, text } : s)));

  const deleteStep = (id) => publish(steps.filter((s) => s.id !== id));

  // Drag & drop handlers for steps (reorder)
  const handleDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || dragId;
    if (!sourceId) return;
    if (sourceId === targetId) return;

    const srcIndex = steps.findIndex((s) => s.id === sourceId);
    const tgtIndex = steps.findIndex((s) => s.id === targetId);
    if (srcIndex === -1 || tgtIndex === -1) return;

    const arr = [...steps];
    const [moved] = arr.splice(srcIndex, 1);
    arr.splice(tgtIndex, 0, moved);
    publish(arr);
    setDragId(null);
  };

  const handleImageChange = (e, stepId) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    publish(steps.map((s) => (s.id === stepId ? { ...s, image: url } : s)));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Các bước</h3>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-sm">Thời gian nấu</span>
          <input
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            className="border rounded px-3 py-1 text-sm w-40"
          />
        </div>
      </div>

      <div className="space-y-6">
        {steps.map((s, index) => (
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
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={`step-${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
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
