import React, { useState, forwardRef, useMemo } from "react";
import Calendar from "react-calendar";
import DatePicker from "react-datepicker";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { ko } from "date-fns/locale";
import { FiX, FiCalendar } from "react-icons/fi";

import { AuthProvider, useAuth } from "../context/AuthContext";
import useTodos from "../hooks/useTodos";
import useCategories from "../hooks/useCategories";

import CategoryManager from "../components/category/CategoryManager";
import TodoList from "../components/schedule/TodoList";

import "../assets/styles/main.scss";
import "react-calendar/dist/Calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/styles/components/_calendar.scss";

const DashboardInner = () => {
  const { user, logout } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [filterMode, setFilterMode] = useState("daily");

  const { categories, addCategory, updateCategory, deleteCategory } =
    useCategories();
  const { todos, todoLoading, addTodo, toggleTodo, deleteTodo, updateTodo } =
    useTodos();

  const filteredTodos = useMemo(() => {
    if (!todos) return [];
    return todos.filter((todo) => {
      const todoDateStr =
        todo.date && typeof todo.date === "string"
          ? todo.date.substring(0, 10)
          : "";
      if (!todoDateStr) return false;

      if (filterMode === "daily") {
        return todoDateStr === format(selectedDate, "yyyy-MM-dd");
      } else {
        if (!startDate || !endDate) return false;
        const targetStart = format(startDate, "yyyy-MM-dd");
        const targetEnd = format(endDate, "yyyy-MM-dd");
        return todoDateStr >= targetStart && todoDateStr <= targetEnd;
      }
    });
  }, [todos, filterMode, selectedDate, startDate, endDate]);

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
      setDateRange([
        startOfWeek(today, { weekStartsOn: 1 }),
        endOfWeek(today, { weekStartsOn: 1 }),
      ]);
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

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateStr = format(date, "yyyy-MM-dd");
      if (todos?.some((t) => t.date && t.date.startsWith(dateStr)))
        return <div className="dot"></div>;
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const day = date.getDay();
      if (day === 0) return "sunday";
      if (day === 6) return "saturday";
    }
    return null;
  };

  // --- 진행률 데이터 계산 (복구) ---
  const totalTodos = filteredTodos.length;
  const completedTodos = filteredTodos.filter((t) => t.is_completed).length;
  const remainingTodos = totalTodos - completedTodos;
  const progressPercentage =
    totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-inner">
          <div className="brand">
            <h1>My Scheduler</h1>
          </div>
          <div className="user-info">
            <span>{user?.name || "User"}님</span>
            <button className="btn-logout" onClick={logout}>
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="left-column">
          <div className="card calendar-card">
            <Calendar
              onChange={handleCalendarChange}
              value={selectedDate}
              formatDay={(locale, date) => format(date, "d")}
              tileContent={tileContent}
              tileClassName={tileClassName}
              minDetail="month"
              next2Label={null}
              prev2Label={null}
              showNeighboringMonth={false}
              locale="ko-KR"
              calendarType="gregory"
            />
          </div>

          {/* 진행률 카드 영역 */}
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
                {/* 미완료(미진행) 섹션 복구 */}
                <div className="info-item">
                  <span className="label">미완료</span>
                  <span className="value remaining">{remainingTodos}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="card todo-card">
            <div className="todo-header">
              <div className="header-title">
                <h2>
                  {filterMode === "daily" ? (
                    <>
                      {format(selectedDate, "MM월 dd일")}{" "}
                      <span className="weekday">
                        {format(selectedDate, "EEEE", { locale: ko })}
                      </span>
                    </>
                  ) : (
                    <>
                      {format(startDate, "MM.dd")} ~ {format(endDate, "MM.dd")}{" "}
                      <span className="weekday">
                        {filterMode === "weekly" ? " 주간 일정" : " 기간 일정"}
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
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    customInput={<CustomDateInput />}
                    locale={ko}
                  />
                </div>
              </div>
            </div>
            <div className="todo-body">
              <TodoList
                todos={filteredTodos}
                categories={categories}
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
