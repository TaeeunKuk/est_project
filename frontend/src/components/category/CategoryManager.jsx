import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiCheck } from "react-icons/fi";

const CategoryManager = ({ categories, onAdd, onUpdate, onDelete }) => {
  const [inputName, setInputName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3182ce");
  const [editModeId, setEditModeId] = useState(null);

  const colorPalette = [
    "#3182ce",
    "#38a169",
    "#e53e3e",
    "#d69e2e",
    "#805ad5",
    "#d53f8c",
    "#718096",
    "#319795",
    "#dd6b20",
  ];

  const handleAddOrUpdate = async () => {
    if (!inputName.trim()) return;

    try {
      if (editModeId) {
        await onUpdate(editModeId, inputName.trim(), selectedColor);
        setEditModeId(null);
      } else {
        await onAdd(inputName.trim(), selectedColor);
      }
      setInputName("");
      setSelectedColor(colorPalette[0]);
    } catch (error) {
      alert(error.response?.data?.message || "작업 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await onDelete(id);
      } catch (error) {
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const startEdit = (cat) => {
    setEditModeId(cat.id);
    setInputName(cat.name);
    setSelectedColor(cat.color);
  };

  return (
    <div className="category-manager-modal">
      {/* 입력 영역 */}
      <div className="input-row">
        <input
          className="cat-input"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder={editModeId ? "카테고리 수정" : "새 카테고리 명 입력"}
          onKeyPress={(e) => e.key === "Enter" && handleAddOrUpdate()}
        />
        <button className="btn-save" onClick={handleAddOrUpdate}>
          {editModeId ? "수정" : <FiPlus />}
        </button>
      </div>

      {/* 컬러 피커 영역 */}
      <div className="color-picker-row">
        <span className="label">색상 선택</span>
        <div className="palette">
          {colorPalette.map((color) => (
            <div
              key={color}
              className={`color-circle ${
                selectedColor === color ? "selected" : ""
              }`}
              onClick={() => setSelectedColor(color)}
              style={{ backgroundColor: color }}
            >
              {selectedColor === color && <FiCheck color="white" size={14} />}
            </div>
          ))}
        </div>
      </div>

      {/* 리스트 영역 */}
      <ul className="cat-list">
        {categories.map((cat) => (
          <li key={cat.id} className="cat-item">
            <div className="cat-info">
              <span
                className="color-dot"
                style={{ backgroundColor: cat.color }}
              />
              <span className="cat-text">{cat.name}</span>
            </div>
            <div className="cat-actions">
              <button onClick={() => startEdit(cat)} title="수정">
                <FiEdit2 size={16} />
              </button>
              <button
                className="danger"
                onClick={() => handleDelete(cat.id)}
                title="삭제"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;
