// frontend/src/components/schedule/TodoList.jsx
import React, { useState } from "react";
import "../../assets/styles/components/_todolist.scss";

const TodoList = ({
  todos = [],
  loading = false,
  onToggle = () => {},
  onDelete = () => {},
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const safeTodos = Array.isArray(todos) ? todos : [];

  if (loading) return <p>로딩 중...</p>;
  if (!safeTodos.length)
    return <p className="empty-msg">이 날의 일정이 없습니다.</p>;

  return (
    <ul className="list-container">
      {safeTodos.map((todo) => {
        if (!todo) return null;
        const { id, title, isCompleted, categoryColor } = todo;

        return (
          <li key={id ?? Math.random()} className="todo-item">
            <div className="left-section">
              <input
                type="checkbox"
                checked={!!isCompleted}
                onChange={() => onToggle(id, !!isCompleted)}
              />
              <div
                className="cat-dot"
                style={{ background: categoryColor || "#cbd5e0" }}
              />
              {editingId === id ? (
                <input
                  className="edit-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <span className={`todo-text ${isCompleted ? "text-done" : ""}`}>
                  {title ?? "제목 없음"}
                </span>
              )}
            </div>

            <div className="btn-group">
              {editingId === id ? (
                <button
                  className="btn-save"
                  onClick={() => {
                    setEditingId(null);
                  }}
                >
                  저장
                </button>
              ) : (
                <button
                  className="btn-edit"
                  onClick={() => {
                    setEditingId(id);
                    setEditText(title ?? "");
                  }}
                >
                  수정
                </button>
              )}
              <button className="btn-del" onClick={() => onDelete(id)}>
                삭제
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default TodoList;
