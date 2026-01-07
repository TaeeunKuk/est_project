import React, { useState } from "react";
import {
  FiCheckSquare,
  FiSquare,
  FiTrash2,
  FiEdit,
  FiSave,
} from "react-icons/fi";
import "../../assets/styles/components/_todolist.scss";

const TodoList = ({
  todos = [],
  categories = [], // 카테고리 목록 받음
  loading = false,
  onAdd = () => {},
  onToggle = () => {},
  onDelete = () => {},
  onUpdate = () => {}, // 업데이트 함수 추가 필요
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [selectedCatId, setSelectedCatId] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const safeTodos = Array.isArray(todos) ? todos : [];

  const handleAdd = () => {
    if (!newTodoTitle.trim()) return;
    onAdd(newTodoTitle, selectedCatId ? Number(selectedCatId) : null);
    setNewTodoTitle("");
  };

  return (
    <div className="todo-wrapper">
      {/* 할 일 입력 영역 */}
      <div className="input-group">
        <select
          className="cat-select"
          value={selectedCatId}
          onChange={(e) => setSelectedCatId(e.target.value)}
        >
          <option value="">카테고리 없음</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          className="todo-input"
          placeholder="할 일을 입력하세요..."
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAdd()}
        />
        <button className="common-btn primary" onClick={handleAdd}>
          등록
        </button>
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <ul className="list-container">
          {!safeTodos.length && <p className="empty-msg">일정이 없습니다.</p>}

          {safeTodos.map((todo) => (
            <li key={todo.id || Math.random()} className="todo-item">
              <div className="left-section">
                <div
                  onClick={() => onToggle(todo.id, todo.isCompleted)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {todo.isCompleted ? (
                    <FiCheckSquare color="#3182ce" />
                  ) : (
                    <FiSquare color="#cbd5e0" />
                  )}
                </div>

                {/* 카테고리 표시 */}
                <div
                  className="cat-dot"
                  title={todo.categoryName}
                  style={{
                    background: todo.categoryColor || "#cbd5e0",
                    marginLeft: 8,
                  }}
                />

                {editingId === todo.id ? (
                  <input
                    className="edit-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                ) : (
                  <span
                    className={`todo-text ${
                      todo.isCompleted ? "text-done" : ""
                    }`}
                  >
                    {todo.title}
                  </span>
                )}
              </div>

              <div className="btn-group">
                {editingId === todo.id ? (
                  <button
                    className="btn-save"
                    onClick={() => {
                      // 여기서 실제 업데이트 로직 호출 (생략 시 setEditingId(null))
                      onUpdate(todo.id, editTitle);
                      setEditingId(null);
                    }}
                  >
                    <FiSave />
                  </button>
                ) : (
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditTitle(todo.title);
                    }}
                  >
                    <FiEdit />
                  </button>
                )}
                <button className="btn-del" onClick={() => onDelete(todo.id)}>
                  <FiTrash2 />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
