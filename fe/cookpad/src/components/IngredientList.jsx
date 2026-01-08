import React, { useState, useEffect } from "react"; // 1. Thêm useEffect
import { Plus, GripVertical, MoreHorizontal } from "lucide-react";

/**
 * IngredientList - manage sections (phần) and items (nguyên liệu)
 *
 * Features:
 * - Add Section (+ Phần)
 * - Add Ingredient inside a section (+ Nguyên liệu)
 * - 3-dot menu on section / ingredient -> Delete
 * - Drag & Drop ingredient to reorder within same section or move to other section
 */

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export default function IngredientList({ ingredientsData, onChange }) {
  // 3. Sửa useState:
  // Nếu có 'ingredientsData' (chế độ edit), dùng nó.
  // Nếu không, dùng state mặc định (chế độ create).
  const [sections, setSections] = useState(() => {
    if (ingredientsData && ingredientsData.length > 0) {
      // Chuyển đổi mảng string (từ CSDL) sang cấu trúc 'sections'
      return [
        {
          id: uid(),
          title: "Phần 1",
          items: ingredientsData.map((text) => ({ id: uid(), text })),
        },
      ];
    }
    // State mặc định khi tạo mới
    return [
      {
        id: uid(),
        title: "Phần 1",
        items: [{ id: uid(), text: "" }],
      },
    ];
  });

  const [serving, setServing] = useState("2 người");
  const [menuOpen, setMenuOpen] = useState(null);
  const [dragData, setDragData] = useState(null);

  useEffect(() => {
    onChange?.({
      sections,
      serving,
    });
  }, [sections, serving, onChange]);

  // Call onChange if provided
  const publish = (next) => {
    setSections(next);
    //onChange?.(next);
  };

  const addSection = () => {
    const newSection = {
      id: uid(),
      title: `Phần ${sections.length + 1}`,
      items: [],
    };
    const next = [...sections, newSection];
    publish(next);
  };

  const addIngredient = (sectionId) => {
    const next = sections.map((s) =>
      s.id === sectionId
        ? { ...s, items: [...s.items, { id: uid(), text: "" }] }
        : s
    );
    publish(next);
  };

  const updateItemText = (sectionId, itemId, text) => {
    const next = sections.map((s) => ({
      ...s,
      items: s.items.map((it) => (it.id === itemId ? { ...it, text } : it)),
    }));
    publish(next);
  };

  const deleteItem = (sectionId, itemId) => {
    const next = sections.map((s) =>
      s.id === sectionId
        ? { ...s, items: s.items.filter((it) => it.id !== itemId) }
        : s
    );
    publish(next);
  };

  const deleteSection = (sectionId) => {
    const next = sections.filter((s) => s.id !== sectionId);
    publish(next);
  };

  // Drag handlers for ingredients
  const onDragStart = (e, { itemId, fromSectionId }) => {
    setDragData({ itemId, fromSectionId });
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ itemId, fromSectionId })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOverItem = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDropOnItem = (e, { toSectionId, toItemId, position = "after" }) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;
    const { itemId, fromSectionId } = JSON.parse(raw);

    if (!itemId) return;
    if (itemId === toItemId) return;

    // Remove item from source
    let movingItem = null;
    const withoutSource = sections.map((s) => {
      if (s.id !== fromSectionId) return s;
      return {
        ...s,
        items: s.items.filter((it) => {
          if (it.id === itemId) {
            movingItem = it;
            return false;
          }
          return true;
        }),
      };
    });

    if (!movingItem) return;

    // Insert into destination
    const next = withoutSource.map((s) => {
      if (s.id !== toSectionId) return s;
      const idx = s.items.findIndex((it) => it.id === toItemId);
      const arr = [...s.items];
      const insertIndex = idx + (position === "after" ? 1 : 0);
      arr.splice(insertIndex, 0, movingItem);
      return { ...s, items: arr };
    });

    publish(next);
    setDragData(null);
  };

  // Drop into empty section area (append)
  const onDropOnSection = (e, toSectionId) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;
    const { itemId, fromSectionId } = JSON.parse(raw);

    let movingItem = null;
    const withoutSource = sections.map((s) => {
      if (s.id !== fromSectionId) {
        return s;
      }
      return {
        ...s,
        items: s.items.filter((it) => {
          if (it.id === itemId) {
            movingItem = it;
            return false;
          }
          return true;
        }),
      };
    });

    if (!movingItem) return;

    const next = withoutSource.map((s) =>
      s.id === toSectionId ? { ...s, items: [...s.items, movingItem] } : s
    );
    publish(next);
    setDragData(null);
  };

  // Reorder items inside same section by dropping on item with position=before/after could be done via onDropOnItem

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Nguyên Liệu</h3>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-sm">Khẩu phần</span>
          <input
            value={serving}
            onChange={(e) => setServing(e.target.value)}
            className="border rounded px-3 py-1 text-sm w-28"
          />
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="p-3 border rounded-md bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">
                  {section.title}
                </div>
              </div>

              <div className="flex items-center gap-2 relative">
                <button
                  onClick={() => addIngredient(section.id)}
                  className="text-sm text-orange-500 border px-2 py-1 rounded hover:bg-orange-50"
                >
                  + Nguyên liệu
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(section.id === menuOpen ? null : section.id);
                  }}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
                {menuOpen === section.id && (
                  <div className="absolute right-0 mt-9 w-40 bg-white border rounded shadow z-40">
                    <button
                      onClick={() => {
                        deleteSection(section.id);
                        setMenuOpen(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-500"
                    >
                      Xóa phần
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => onDropOnSection(e, section.id)}
              className="space-y-2 min-h-[40px] p-1"
            >
              {section.items.length === 0 && (
                <div className="text-sm text-gray-400 italic">
                  Không có nguyên liệu. Thêm nguyên liệu bằng nút + Nguyên liệu.
                </div>
              )}

              {section.items.map((it) => (
                <div
                  key={it.id}
                  draggable
                  onDragStart={(e) =>
                    onDragStart(e, { itemId: it.id, fromSectionId: section.id })
                  }
                  onDragOver={onDragOverItem}
                  onDrop={(e) =>
                    onDropOnItem(e, {
                      toSectionId: section.id,
                      toItemId: it.id,
                      position: "before",
                    })
                  }
                  className="flex items-center gap-3 bg-orange-50 rounded px-3 py-2"
                >
                  <GripVertical className="w-4 h-4 text-gray-500" />
                  <input
                    value={it.text}
                    onChange={(e) =>
                      updateItemText(section.id, it.id, e.target.value)
                    }
                    className="bg-transparent outline-none flex-1 text-sm"
                    placeholder="vd. 250g bột"
                  />
                  <div className="relative">
                    <button
                      onClick={() =>
                        setMenuOpen(it.id === menuOpen ? null : it.id)
                      }
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-500" />
                    </button>
                    {menuOpen === it.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow z-40">
                        <button
                          onClick={() => {
                            deleteItem(section.id, it.id);
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
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={addSection}
          className="flex items-center gap-2 text-orange-500 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Phần
        </button>

        {/* <button
          onClick={() => addIngredient(sections[0].id)}
          className="flex items-center gap-2 text-orange-500 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Nguyên liệu
        </button> */}
      </div>
    </div>
  );
}
