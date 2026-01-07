// frontend/src/components/category/CategoryManager.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import useTodos from "../../hooks/useTodos";
import "../../assets/styles/components/_category.scss";

const CategoryManager = () => {
  const { user } = useAuth();
  const { todos } = useTodos(new Date().toISOString().slice(0, 10));

  const [categories, setCategories] = useState([
    { id: 1, name: "업무" },
    { id: 2, name: "개인" },
    { id: 3, name: "긴급" },
  ]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const cats = Array.from(
      new Map(
        todos
          .filter((t) => t.categoryId)
          .map((t) => [
            t.categoryId,
            { id: t.categoryId, name: t.categoryName ?? "카테고리" },
          ])
      ).values()
    );
    if (cats.length)
      setCategories((prev) => {
        const map = new Map(prev.map((c) => [c.id, c]));
        cats.forEach((c) => map.set(c.id, c));
        return Array.from(map.values());
      });
  }, [todos]);

  const addCategory = () => {
    if (!newName.trim()) return;
    setCategories((prev) => [
      ...prev,
      { id: Date.now(), name: newName.trim() },
    ]);
    setNewName("");
  };

  const deleteCategory = (id) => {
    if (!window.confirm("카테고리를 삭제하시겠습니까?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="category-manager">
      <h3>카테고리 관리</h3>

      <div className="cat-input-group">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="새 카테고리 추가"
        />
        <button className="btn-primary" onClick={addCategory}>
          추가
        </button>
      </div>

      <ul className="cat-list">
        {categories.map((cat) => (
          <li key={cat.id} className="cat-chip">
            <span className="color-dot" style={{ background: "#cbd5e0" }} />
            <span>{cat.name}</span>
            <button
              className="btn-del-cat"
              onClick={() => deleteCategory(cat.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;
