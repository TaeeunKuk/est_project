// frontend/src/components/schedule/TodoList.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  FiCheckSquare,
  FiSquare,
  FiTrash2,
  FiEdit,
  FiSave,
  FiPlus,
  FiSettings,
  FiX,
  FiTag,
  FiChevronDown,
} from "react-icons/fi";
import "../../assets/styles/components/_todolist.scss";

const TodoList = ({
  todos = [],
  categories = [],
  loading = false,
  onAdd,
  onToggle,
  onDelete,
  onUpdate,
  onOpenCategoryManager,
  currentDateStr, // Dashboard에서 받은 "YYYY-MM-DD"
}) => {
  // --- 상태 관리 ---
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoCatId, setNewTodoCatId] = useState(null);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [filterCatId, setFilterCatId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCatDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 로직 ---

  const filteredTodos = (Array.isArray(todos) ? todos : []).filter((todo) => {
    if (!filterCatId) return true;
    return todo.category_id === Number(filterCatId);
  });

  const handleAdd = () => {
    if (!newTodoTitle.trim()) {
      alert("할 일을 입력해주세요.");
      return;
    }

    // [수정] 12:00:00 꼼수 제거. 백엔드에서 to_char로 처리하므로 안전함.
    // currentDateStr는 이미 "YYYY-MM-DD" 형식이므로 그대로 전송.
    onAdd({
      title: newTodoTitle,
      categoryId: newTodoCatId ? Number(newTodoCatId) : null,
      date: currentDateStr,
      description: "",
    });

    setNewTodoTitle("");
    setNewTodoCatId(null);
    setIsCatDropdownOpen(false);
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const saveEditing = (todo) => {
    onUpdate(todo.id, {
      title: editTitle,
      categoryId: todo.category_id,
      date: todo.date, // 기존 날짜 유지
      description: todo.description,
    });
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const selectedCategory = categories.find((c) => c.id === newTodoCatId);

  return (
    <div className="todo-list-container">
      {/* 1. 상단 필터 영역 */}
      <div className="top-control-bar">
        <select
          className="filter-select"
          value={filterCatId}
          onChange={(e) => setFilterCatId(e.target.value)}
        >
          <option value="">모든 카테고리 보기</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 2. 입력 및 속성 설정 영역 */}
      <div className="creation-card">
        {/* (1) 텍스트 입력 */}
        <div className="input-row">
          <input
            type="text"
            className="main-input"
            placeholder="할 일을 입력하세요..."
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAdd()}
          />
          <button className="btn-add" onClick={handleAdd}>
            <FiPlus />
          </button>
        </div>

        {/* (2) 하단 속성 선택 */}
        <div className="options-row">
          <div className="option-group">
            <span className="label">분류:</span>

            {/* 커스텀 드롭다운 */}
            <div className="custom-dropdown-container" ref={dropdownRef}>
              <button
                className={`dropdown-trigger ${
                  selectedCategory ? "has-value" : ""
                }`}
                onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                style={
                  selectedCategory
                    ? {
                        backgroundColor: `${selectedCategory.color}15`,
                        color: selectedCategory.color,
                        borderColor: selectedCategory.color,
                      }
                    : {}
                }
              >
                <div className="trigger-content">
                  {selectedCategory ? (
                    <>
                      <span
                        className="dot"
                        style={{ background: selectedCategory.color }}
                      />
                      <span className="text">{selectedCategory.name}</span>
                    </>
                  ) : (
                    <>
                      <FiTag className="icon" />
                      <span className="text">분류 없음</span>
                    </>
                  )}
                </div>
                <FiChevronDown className="arrow" />
              </button>

              {isCatDropdownOpen && (
                <ul className="dropdown-menu">
                  <li
                    className="dropdown-item"
                    onClick={() => {
                      setNewTodoCatId(null);
                      setIsCatDropdownOpen(false);
                    }}
                  >
                    <span className="text-gray">분류 없음</span>
                  </li>
                  {categories.map((c) => (
                    <li
                      key={c.id}
                      className="dropdown-item"
                      onClick={() => {
                        setNewTodoCatId(c.id);
                        setIsCatDropdownOpen(false);
                      }}
                    >
                      <span
                        className="color-circle"
                        style={{ background: c.color }}
                      />
                      <span>{c.name}</span>
                      {newTodoCatId === c.id && (
                        <FiCheckSquare className="check" color={c.color} />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 카테고리 관리 버튼 */}
            <button
              className="btn-settings-inline"
              title="카테고리 관리"
              onClick={onOpenCategoryManager}
            >
              <FiSettings />
            </button>
          </div>
        </div>
      </div>

      {/* 3. 리스트 영역 */}
      <div className="list-scroll-area">
        {loading ? (
          <p className="status-msg">로딩 중...</p>
        ) : filteredTodos.length === 0 ? (
          <p className="empty-msg">
            {filterCatId
              ? "해당 카테고리의 일정이 없습니다."
              : "등록된 일정이 없습니다."}
          </p>
        ) : (
          <ul className="todo-items">
            {filteredTodos.map((todo) => {
              const matchedCat = categories.find(
                (c) => c.id === todo.category_id
              );

              return (
                <li
                  key={todo.id}
                  className={`todo-item ${todo.is_completed ? "done" : ""}`}
                >
                  <div className="check-icon" onClick={() => onToggle(todo.id)}>
                    {todo.is_completed ? (
                      <FiCheckSquare size={22} />
                    ) : (
                      <FiSquare size={22} />
                    )}
                  </div>

                  <div className="content">
                    {matchedCat && (
                      <div className="meta-info">
                        <span
                          className="cat-badge"
                          style={{
                            backgroundColor: matchedCat.color + "20",
                            color: matchedCat.color,
                          }}
                        >
                          {matchedCat.name}
                        </span>
                      </div>
                    )}

                    {editingId === todo.id ? (
                      <input
                        className="edit-input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && saveEditing(todo)
                        }
                        autoFocus
                      />
                    ) : (
                      <span className="text">{todo.title}</span>
                    )}
                  </div>

                  <div className="actions">
                    {editingId === todo.id ? (
                      <>
                        <button
                          className="icon-btn save"
                          onClick={() => saveEditing(todo)}
                        >
                          <FiSave />
                        </button>
                        <button
                          className="icon-btn cancel"
                          onClick={cancelEditing}
                        >
                          <FiX />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="icon-btn edit"
                          onClick={() => startEditing(todo)}
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="icon-btn delete"
                          onClick={() => onDelete(todo.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoList;
