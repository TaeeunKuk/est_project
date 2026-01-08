// frontend/src/components/category/CategoryManager.jsx
import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiCheck } from "react-icons/fi";

const CategoryManager = ({ categories, setCategories }) => {
  const [inputName, setInputName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3182ce");
  const [editModeId, setEditModeId] = useState(null);

  // 사용할 색상 팔레트
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

  const handleAddOrUpdate = () => {
    if (!inputName.trim()) return;

    if (editModeId) {
      // 수정
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editModeId
            ? { ...c, name: inputName, color: selectedColor }
            : c
        )
      );
      setEditModeId(null);
    } else {
      // 생성
      setCategories((prev) => [
        ...prev,
        { id: Date.now(), name: inputName.trim(), color: selectedColor },
      ]);
    }
    setInputName("");
    setSelectedColor(colorPalette[0]);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("이 카테고리를 삭제하시겠습니까?");
    if (confirmed) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const startEdit = (cat) => {
    setEditModeId(cat.id);
    setInputName(cat.name);
    setSelectedColor(cat.color || "#3182ce");
  };

  return (
    <div className="category-manager-modal">
      {/* 1. 입력 및 버튼 행 */}
      <div className="input-row">
        <input
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder={editModeId ? "카테고리 수정" : "새 카테고리 이름"}
          className="cat-input"
          onKeyPress={(e) => e.key === "Enter" && handleAddOrUpdate()}
        />
        <button className="btn-save" onClick={handleAddOrUpdate}>
          {editModeId ? "수정" : <FiPlus />}
        </button>
      </div>

      {/* 2. 색상 선택 행 (별도 라인 분리) */}
      <div className="color-picker-row">
        <span className="label">색상:</span>
        <div className="palette">
          {colorPalette.map((color) => (
            <div
              key={color}
              className={`color-circle ${
                selectedColor === color ? "selected" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            >
              {selectedColor === color && <FiCheck color="white" size={12} />}
            </div>
          ))}
        </div>
      </div>

      {/* 3. 카테고리 목록 */}
      <ul className="cat-list">
        {categories.map((cat) => (
          <li key={cat.id} className="cat-item">
            <div className="cat-info">
              <span className="color-dot" style={{ background: cat.color }} />
              <span className="cat-text">{cat.name}</span>
            </div>
            <div className="cat-actions">
              <button onClick={() => startEdit(cat)} title="수정">
                <FiEdit2 />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="danger"
                title="삭제"
              >
                <FiTrash2 />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;
