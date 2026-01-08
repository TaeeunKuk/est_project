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
  FiAlertCircle,
  FiFilter,
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
  currentDateStr,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoCatId, setNewTodoCatId] = useState(null);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const filterRef = useRef(null);
  const [filterCatId, setFilterCatId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCatDropdownOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTodos = (Array.isArray(todos) ? todos : []).filter((todo) => {
    if (!filterCatId) return true;
    return todo.category_id === Number(filterCatId);
  });

  const handleAdd = () => {
    if (!newTodoTitle.trim()) {
      alert("할 일을 입력해주세요.");
      return;
    }
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
      date: todo.date,
      description: todo.description,
    });
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const selectedCategory = categories.find((c) => c.id === newTodoCatId);
  const activeFilterCategory = categories.find(
    (c) => c.id === Number(filterCatId)
  );

  return (
    <div className="todo-list-container">
      {/* 1. 상단 필터 영역 */}
      <div className="top-control-bar">
        <div
          className="custom-dropdown-container filter-dropdown"
          ref={filterRef}
        >
          <button
            className={`dropdown-trigger ${
              activeFilterCategory ? "has-value" : ""
            }`}
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
          >
            <div className="trigger-content">
              <FiFilter className="icon" />
              <span className="text">
                {activeFilterCategory
                  ? activeFilterCategory.name
                  : "모든 카테고리 보기"}
              </span>
            </div>
            <FiChevronDown className="arrow" />
          </button>

          {isFilterDropdownOpen && (
            <ul className="dropdown-menu">
              <li
                className="dropdown-item"
                onClick={() => {
                  setFilterCatId("");
                  setIsFilterDropdownOpen(false);
                }}
              >
                <span className="text-gray">모든 카테고리 보기</span>
              </li>
              {categories.map((c) => (
                <li
                  key={c.id}
                  className="dropdown-item"
                  onClick={() => {
                    setFilterCatId(c.id);
                    setIsFilterDropdownOpen(false);
                  }}
                >
                  <span
                    className="color-circle"
                    style={{ background: c.color }}
                  />
                  <span>{c.name}</span>
                  {Number(filterCatId) === c.id && (
                    <FiCheckSquare className="check" color={c.color} />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 2. 할 일 입력 영역 */}
      <div className="creation-card">
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

        <div className="options-row">
          <div className="option-group">
            <span className="label">분류:</span>
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
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
                      <FiCheckSquare size={20} />
                    ) : (
                      <FiSquare size={20} />
                    )}
                  </div>

                  <div className="content">
                    {matchedCat && (
                      <span
                        className="cat-badge-inline"
                        style={{
                          backgroundColor: matchedCat.color + "15",
                          color: matchedCat.color,
                          borderColor: matchedCat.color + "40",
                        }}
                      >
                        {matchedCat.name}
                      </span>
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
                          onClick={() => setDeleteConfirmId(todo.id)}
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

      {/* 삭제 확인 커스텀 모달 */}
      {deleteConfirmId && (
        <div className="mini-modal-overlay">
          <div className="mini-modal">
            <div className="icon-area">
              <FiAlertCircle />
            </div>
            <h3>일정 삭제</h3>
            <p>정말로 이 일정을 삭제하시겠습니까?</p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteConfirmId(null)}
              >
                취소
              </button>
              <button
                className="btn-confirm"
                onClick={() => {
                  onDelete(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
