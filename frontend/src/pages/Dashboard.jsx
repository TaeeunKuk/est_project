// frontend/src/pages/Dashboard.jsx
import React, { useState, forwardRef } from "react";
import Calendar from "react-calendar";
import DatePicker from "react-datepicker"; // 라이브러리 추가
import { format, startOfWeek, endOfWeek } from "date-fns";
import { ko } from "date-fns/locale";
import { FiX, FiCalendar } from "react-icons/fi";

// Context & Hooks
import { AuthProvider, useAuth } from "../context/AuthContext";
import useTodos from "../hooks/useTodos";

// Components
import CategoryManager from "../components/category/CategoryManager";
import TodoList from "../components/schedule/TodoList";

// Styles
import "../assets/styles/main.scss";
import "react-calendar/dist/Calendar.css";
import "react-datepicker/dist/react-datepicker.css"; // datepicker css
import "../assets/styles/components/_calendar.scss";

const DashboardInner = () => {
  const { user, logout } = useAuth();

  // --- 상태 관리 ---
  // 1. 왼쪽 미니 캘린더용 (단일 날짜)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 2. 우측 리스트 필터용 (기간)
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [filterMode, setFilterMode] = useState("daily"); // daily | weekly | custom

  // 카테고리 상태 (임시 데이터)
  const [categories, setCategories] = useState([
    { id: 1, name: "업무", color: "#3182ce" },
    { id: 2, name: "개인", color: "#38a169" },
    { id: 3, name: "긴급", color: "#e53e3e" },
  ]);

  // Hook에 전달할 날짜 파라미터 구성
  // (실제 구현 시에는 startDate, endDate를 모두 백엔드에 전달하여 필터링해야 합니다)
  const queryDate = format(startDate || new Date(), "yyyy-MM-dd");

  const { todos, loading, addTodo, toggleTodo, deleteTodo, updateTodo } =
    useTodos(queryDate);

  // --- 핸들러 ---

  // 1. 왼쪽 캘린더 클릭 -> 해당 날짜의 '오늘' 보기로 초기화
  const handleCalendarChange = (date) => {
    setSelectedDate(date);
    setDateRange([date, date]); // 기간을 해당 날짜 하루로 설정
    setFilterMode("daily");
  };

  // 2. 필터 버튼 클릭 (오늘 / 이번주)
  const handleFilterClick = (mode) => {
    setFilterMode(mode);
    const today = new Date();

    if (mode === "daily") {
      // 오늘 날짜로 세팅 (또는 selectedDate 유지 정책에 따라 변경 가능)
      setDateRange([today, today]);
      setSelectedDate(today);
    } else if (mode === "weekly") {
      // 이번 주 (월~일) 계산
      const start = startOfWeek(today, { weekStartsOn: 1 });
      const end = endOfWeek(today, { weekStartsOn: 1 });
      setDateRange([start, end]);
    }
  };

  // 3. DatePicker 커스텀 인풋 버튼
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

  // 4. 캘린더 점 찍기 (예시: 해당 월 데이터 확인 필요)
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      // todos에 해당 날짜가 있는지 확인 (단순 예시)
      const dateStr = format(date, "yyyy-MM-dd");
      const hasTodo = todos.some((t) => t.date === dateStr);
      if (hasTodo) return <div className="dot"></div>;
    }
    return null;
  };

  // 진행률 계산
  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.isCompleted).length;
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
          <span>{user?.name || "Guest"}님</span>
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
              minDetail="month"
              next2Label={null}
              prev2Label={null}
              showNeighboringMonth={false}
              locale="ko-KR"
            />
          </div>

          <div className="card status-card">
            <div className="status-header">
              <h3>오늘의 진행률</h3>
              <span className="date-badge">
                {format(new Date(), "M월 d일")}
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
            {/* 헤더: 날짜/기간 제목 & 필터 버튼 */}
            <div className="todo-header">
              <div className="header-title">
                <h2>
                  {filterMode === "custom" && startDate && endDate ? (
                    // 기간 선택 모드일 때
                    <>
                      {format(startDate, "MM.dd")} ~ {format(endDate, "MM.dd")}
                      <span className="weekday"> 기간 일정</span>
                    </>
                  ) : (
                    // 일간/주간 모드일 때 (대표 날짜 표시)
                    <>
                      {format(startDate || selectedDate, "MM월 dd일")}
                      <span className="weekday">
                        {format(startDate || selectedDate, "EEEE", {
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

                {/* 기간 선택 (DatePicker) */}
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
                      if (update[0] && !update[1]) setFilterMode("custom"); // 시작일만 찍어도 모드 변경
                      if (update[0] && update[1]) setFilterMode("custom");
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
                todos={todos}
                categories={categories}
                loading={loading}
                onAdd={addTodo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
                onOpenCategoryManager={() => setIsCatModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* [카테고리 관리 모달] */}
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
              setCategories={setCategories}
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
