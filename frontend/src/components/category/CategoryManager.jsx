import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import useTodos from "../../hooks/useTodos";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi"; // 아이콘 사용
import "../../assets/styles/components/_category.scss";

const CategoryManager = ({ onUpdateCategories }) => {
  const { user } = useAuth();
  // 카테고리 로직은 Todo와 별개로 동작할 수도 있지만, 여기서는 로컬 상태 예시
  // 실제로는 API로 카테고리를 가져와야 합니다.
  // 과제 요구사항 상 User:Category = 1:N 이므로, 여기서는 임시 state로 구현합니다.

  const [categories, setCategories] = useState([
    { id: 1, name: "업무" },
    { id: 2, name: "개인" },
    { id: 3, name: "긴급" },
  ]);
  const [inputName, setInputName] = useState("");
  const [editModeId, setEditModeId] = useState(null);

  // 상위 컴포넌트로 카테고리 정보 전달
  useEffect(() => {
    onUpdateCategories && onUpdateCategories(categories);
  }, [categories, onUpdateCategories]);

  const handleAddOrUpdate = () => {
    if (!inputName.trim()) return;

    if (editModeId) {
      // 수정
      setCategories((prev) =>
        prev.map((c) => (c.id === editModeId ? { ...c, name: inputName } : c))
      );
      setEditModeId(null);
    } else {
      // 추가
      setCategories((prev) => [
        ...prev,
        { id: Date.now(), name: inputName.trim() },
      ]);
    }
    setInputName("");
  };

  const deleteCategory = (id) => {
    if (!window.confirm("카테고리를 삭제하시겠습니까?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const startEdit = (cat) => {
    setEditModeId(cat.id);
    setInputName(cat.name);
  };

  return (
    <div className="category-manager">
      <h3>카테고리 관리</h3>

      <div className="cat-input-group">
        <input
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder={editModeId ? "카테고리 수정" : "새 카테고리 추가"}
        />
        <button className="btn-primary" onClick={handleAddOrUpdate}>
          {editModeId ? "수정" : "추가"}
        </button>
      </div>

      <ul className="cat-list">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="cat-chip"
            style={editModeId === cat.id ? { border: "1px solid #3182ce" } : {}}
          >
            <span className="color-dot" style={{ background: "#cbd5e0" }} />
            <span>{cat.name}</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
              <button className="btn-del-cat" onClick={() => startEdit(cat)}>
                <FiEdit2 size={12} />
              </button>
              <button
                className="btn-del-cat"
                onClick={() => deleteCategory(cat.id)}
              >
                <FiTrash2 size={12} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;
