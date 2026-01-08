// frontend/src/pages/Dashboard.jsx
import React, { useState, forwardRef, useMemo } from "react";
import Calendar from "react-calendar";
import DatePicker from "react-datepicker";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { ko } from "date-fns/locale";
import { FiX, FiCalendar } from "react-icons/fi";

// Context & Hooks
import { AuthProvider, useAuth } from "../context/AuthContext";
import useTodos from "../hooks/useTodos";
import useCategories from "../hooks/useCategories";

// Components
import CategoryManager from "../components/category/CategoryManager";
import TodoList from "../components/schedule/TodoList";

// Styles
import "../assets/styles/main.scss";
import "react-calendar/dist/Calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/styles/components/_calendar.scss";

const DashboardInner = () => {
  const { user, logout } = useAuth();

  // --- 상태 관리 ---
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [filterMode, setFilterMode] = useState("daily");

  // --- Data Fetching ---
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    loading: catLoading,
  } = useCategories();

  const {
    todos,
    loading: todoLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
  } = useTodos();

  // --- 필터링 로직 ---
  const filteredTodos = useMemo(() => {
    if (!todos) return [];

    return todos.filter((todo) => {
      const todoDateStr =
        todo.date && typeof todo.date === "string"
          ? todo.date.substring(0, 10)
          : "";

      if (!todoDateStr) return false;

      if (filterMode === "daily") {
        const targetStr = format(selectedDate, "yyyy-MM-dd");
        return todoDateStr === targetStr;
      } else {
        if (!startDate || !endDate) return false;
        const targetStart = format(startDate, "yyyy-MM-dd");
        const targetEnd = format(endDate, "yyyy-MM-dd");
        return todoDateStr >= targetStart && todoDateStr <= targetEnd;
      }
    });
  }, [todos, filterMode, selectedDate, startDate, endDate]);

  // --- 핸들러 ---
  const handleCalendarChange = (date) => {
    setSelectedDate(date);
    setDateRange([date, date]);
    setFilterMode("daily");
  };

  const handleFilterClick = (mode) => {
    setFilterMode(mode);
    const today = new Date();

    if (mode === "daily") {
      setDateRange([today, today]);
      setSelectedDate(today);
    } else if (mode === "weekly") {
      const start = startOfWeek(today, { weekStartsOn: 1 });
      const end = endOfWeek(today, { weekStartsOn: 1 });
      setDateRange([start, end]);
    }
  };

  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <button
      className={`filter-btn custom-picker-btn ${
        filterMode === "custom" ? "active" : ""
      }`}
      onClick={onClick}
      ref={ref}
    >
      <FiCalendar className="icon" />
      <span>{value || "기간 선택"}</span>
    </button>
  ));

  // 캘린더 점 찍기
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateStr = format(date, "yyyy-MM-dd");
      const hasTodo = todos.some((t) => t.date && t.date.startsWith(dateStr));
      if (hasTodo) return <div className="dot"></div>;
    }
    return null;
  };

  // [수정] 요일별 클래스 부여 (CSS nth-child 오류 해결)
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const day = date.getDay();
      if (day === 0) return "sunday"; // 일요일
      if (day === 6) return "saturday"; // 토요일
    }
    return null;
  };

  // 진행률 계산
  const totalTodos = filteredTodos.length;
  const completedTodos = filteredTodos.filter((t) => t.is_completed).length;
  const progressPercentage =
    totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

  return (
    <div className="dashboard-container">
      {/* 헤더 */}
      <header className="dashboard-header">
        <div className="brand">
          <h1>My Scheduler</h1>
        </div>
        <div className="user-info">
          <span>{user?.name || "User"}님</span>
          <button className="btn-logout" onClick={logout}>
            로그아웃
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* [왼쪽] 캘린더 + 위젯 */}
        <div className="left-column">
          <div className="card calendar-card">
            <Calendar
              onChange={handleCalendarChange}
              value={selectedDate}
              formatDay={(locale, date) => format(date, "d")}
              tileContent={tileContent}
              tileClassName={tileClassName} // [추가] 클래스네임 핸들러 연결
              minDetail="month"
              next2Label={null}
              prev2Label={null}
              showNeighboringMonth={false}
              locale="ko-KR"
              calendarType="gregory" // 일요일 시작
            />
          </div>

          <div className="card status-card">
            <div className="status-header">
              <h3>
                {filterMode === "daily" ? "오늘의 진행률" : "기간 진행률"}
              </h3>
              <span className="date-badge">
                {filterMode === "daily"
                  ? format(selectedDate, "M월 d일")
                  : `${format(startDate, "M.d")}~${format(endDate, "M.d")}`}
              </span>
            </div>
            <div className="status-body">
              <div
                className="progress-circle"
                style={{
                  background: `conic-gradient(#3182ce ${progressPercentage}%, #edf2f7 ${progressPercentage}% 100%)`,
                }}
              >
                <div className="inner-circle">
                  <span className="percent">{progressPercentage}%</span>
                </div>
              </div>
              <div className="status-info">
                <div className="info-item">
                  <span className="label">전체</span>
                  <span className="value">{totalTodos}</span>
                </div>
                <div className="info-item">
                  <span className="label">완료</span>
                  <span className="value completed">{completedTodos}</span>
                </div>
                <div className="info-item">
                  <span className="label">미완료</span>
                  <span className="value remaining">
                    {totalTodos - completedTodos}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* [오른쪽] 투두 리스트 */}
        <div className="right-column">
          <div className="card todo-card">
            <div className="todo-header">
              <div className="header-title">
                <h2>
                  {filterMode === "custom" && startDate && endDate ? (
                    <>
                      {format(startDate, "MM.dd")} ~ {format(endDate, "MM.dd")}
                      <span className="weekday"> 기간 일정</span>
                    </>
                  ) : filterMode === "weekly" ? (
                    <>
                      {format(startDate, "MM.dd")} ~ {format(endDate, "MM.dd")}
                      <span className="weekday"> 주간 일정</span>
                    </>
                  ) : (
                    <>
                      {format(selectedDate, "MM월 dd일")}
                      <span className="weekday">
                        {format(selectedDate, "EEEE", {
                          locale: ko,
                        })}
                      </span>
                    </>
                  )}
                </h2>
              </div>

              <div className="filter-buttons">
                <button
                  className={`filter-btn ${
                    filterMode === "daily" ? "active" : ""
                  }`}
                  onClick={() => handleFilterClick("daily")}
                >
                  오늘
                </button>
                <button
                  className={`filter-btn ${
                    filterMode === "weekly" ? "active" : ""
                  }`}
                  onClick={() => handleFilterClick("weekly")}
                >
                  이번 주
                </button>

                <div
                  className="date-picker-wrapper"
                  onClick={() => setFilterMode("custom")}
                >
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                      setDateRange(update);
                      if (update[0]) setFilterMode("custom");
                    }}
                    customInput={<CustomDateInput />}
                    dateFormat="yyyy.MM.dd"
                    locale={ko}
                    shouldCloseOnSelect={false}
                  />
                </div>
              </div>
            </div>

            <div className="todo-body">
              <TodoList
                todos={filteredTodos}
                categories={categories}
                loading={todoLoading}
                onAdd={addTodo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
                onOpenCategoryManager={() => setIsCatModalOpen(true)}
                currentDateStr={format(selectedDate, "yyyy-MM-dd")}
              />
            </div>
          </div>
        </div>
      </div>

      {isCatModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCatModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>카테고리 관리</h3>
              <button
                className="close-btn"
                onClick={() => setIsCatModalOpen(false)}
              >
                <FiX size={24} />
              </button>
            </div>
            <CategoryManager
              categories={categories}
              onAdd={addCategory}
              onUpdate={updateCategory}
              onDelete={deleteCategory}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => (
  <AuthProvider>
    <DashboardInner />
  </AuthProvider>
);

export default Dashboard;
