import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import {
  FiCheckSquare,
  FiSquare,
  FiTrash2,
  FiEdit,
  FiSave,
  FiPlus,
  FiSettings,
  FiX,
  FiCalendar,
} from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";
import "../../assets/styles/components/_todolist.scss"; // scss import

const TodoList = ({
  todos = [],
  categories = [],
  loading = false,
  onAdd,
  onToggle,
  onDelete,
  onUpdate,
  onOpenCategoryManager,
}) => {
  // --- 상태 관리 ---
  const [newTodoTitle, setNewTodoTitle] = useState("");

  // 1. 새로운 할 일의 속성 (카테고리, 날짜)
  const [newTodoCatId, setNewTodoCatId] = useState(null);
  const [newDateRange, setNewDateRange] = useState([null, null]);
  const [startDate, endDate] = newDateRange;

  // 2. 리스트 필터링용 카테고리 상태 (UI 상단)
  const [filterCatId, setFilterCatId] = useState("");

  // 수정 모드 상태
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // --- 로직 ---

  // 필터링된 투두 리스트
  const filteredTodos = (Array.isArray(todos) ? todos : []).filter((todo) => {
    if (!filterCatId) return true; // 전체 보기
    return todo.categoryId === Number(filterCatId);
  });

  const handleAdd = () => {
    if (!newTodoTitle.trim()) {
      alert("할 일을 입력해주세요.");
      return;
    }

    // 상위 컴포넌트로 전달 (제목, 카테고리, 시작일, 종료일)
    onAdd(
      newTodoTitle,
      newTodoCatId ? Number(newTodoCatId) : null,
      startDate || new Date(), // 없으면 오늘
      endDate || startDate || new Date() // 없으면 시작일과 동일하게
    );

    // 입력값 초기화
    setNewTodoTitle("");
    setNewTodoCatId(null);
    setNewDateRange([null, null]);
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const saveEditing = (id) => {
    onUpdate(id, editTitle);
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
  };

  // DatePicker 커스텀 인풋
  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <button className="date-badge-btn" onClick={onClick} ref={ref}>
      <FiCalendar className="icon" />
      <span>{value || "기간 설정 (선택)"}</span>
    </button>
  ));

  return (
    <div className="todo-list-container">
      {/* 1. 상단 필터 & 설정 영역 (기존 위치 유지) */}
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
        <button
          className="btn-settings"
          title="카테고리 관리"
          onClick={onOpenCategoryManager}
        >
          <FiSettings />
        </button>
      </div>

      {/* 2. 입력 및 속성 설정 영역 (카드 형태) */}
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

        {/* (2) 하단 속성 선택 (모달 느낌의 옵션 바) */}
        <div className="options-row">
          <div className="option-group">
            <span className="label">분류:</span>
            <div className="category-chips">
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={`chip ${newTodoCatId === c.id ? "active" : ""}`}
                  onClick={() =>
                    setNewTodoCatId(newTodoCatId === c.id ? null : c.id)
                  }
                  style={{
                    borderColor:
                      newTodoCatId === c.id ? c.color : "transparent",
                    backgroundColor:
                      newTodoCatId === c.id ? `${c.color}20` : "#f7fafc",
                    color: newTodoCatId === c.id ? c.color : "#718096",
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="divider"></div>

          <div className="option-group">
            <span className="label">기간:</span>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setNewDateRange(update)}
              customInput={<CustomDateInput />}
              dateFormat="MM.dd"
              locale={ko}
              shouldCloseOnSelect={false}
              placeholderText="기간 설정"
            />
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
              : "일정이 없습니다."}
          </p>
        ) : (
          <ul className="todo-items">
            {filteredTodos.map((todo) => {
              const matchedCat = categories.find(
                (c) => c.id === todo.categoryId
              );

              return (
                <li
                  key={todo.id}
                  className={`todo-item ${todo.isCompleted ? "done" : ""}`}
                >
                  <div
                    className="check-icon"
                    onClick={() => onToggle(todo.id, todo.isCompleted)}
                  >
                    {todo.isCompleted ? (
                      <FiCheckSquare size={22} />
                    ) : (
                      <FiSquare size={22} />
                    )}
                  </div>

                  <div className="content">
                    {/* 정보 라인 (카테고리 + 기간) */}
                    <div className="meta-info">
                      {matchedCat && (
                        <span
                          className="cat-badge"
                          style={{
                            backgroundColor: matchedCat.color + "20",
                            color: matchedCat.color,
                          }}
                        >
                          {matchedCat.name}
                        </span>
                      )}
                      {todo.startDate && (
                        <span className="date-text">
                          {format(new Date(todo.startDate), "MM.dd")}
                          {todo.endDate && todo.endDate !== todo.startDate
                            ? ` ~ ${format(new Date(todo.endDate), "MM.dd")}`
                            : ""}
                        </span>
                      )}
                    </div>

                    {editingId === todo.id ? (
                      <input
                        className="edit-input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && saveEditing(todo.id)
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
                          onClick={() => saveEditing(todo.id)}
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
