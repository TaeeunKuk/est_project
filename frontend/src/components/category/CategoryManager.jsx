// frontend/src/components/category/CategoryManager.jsx
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
        // [수정] Hook에서 받은 함수 실행
        await onUpdate(editModeId, inputName.trim(), selectedColor);
        setEditModeId(null);
      } else {
        // [생성] Hook에서 받은 함수 실행
        await onAdd(inputName.trim(), selectedColor);
      }

      // 입력창 초기화
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
    <div className="category-manager">
      <div className="input-row">
        <input
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder={editModeId ? "카테고리 수정" : "새 카테고리"}
          onKeyPress={(e) => e.key === "Enter" && handleAddOrUpdate()}
        />
        <button onClick={handleAddOrUpdate}>
          {editModeId ? "수정" : <FiPlus />}
        </button>
      </div>

      <div
        className="palette"
        style={{ display: "flex", gap: "5px", margin: "10px 0" }}
      >
        {colorPalette.map((color) => (
          <div
            key={color}
            onClick={() => setSelectedColor(color)}
            style={{
              backgroundColor: color,
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: selectedColor === color ? "2px solid black" : "none",
            }}
          >
            {selectedColor === color && <FiCheck color="white" size={10} />}
          </div>
        ))}
      </div>

      <ul className="cat-list">
        {categories.map((cat) => (
          <li
            key={cat.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "5px 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: cat.color,
                  borderRadius: "50%",
                }}
              />
              <span>{cat.name}</span>
            </div>
            <div>
              <button
                onClick={() => startEdit(cat)}
                style={{ marginRight: "5px" }}
              >
                <FiEdit2 />
              </button>
              <button onClick={() => handleDelete(cat.id)}>
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
