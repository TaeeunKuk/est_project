import React, { useState, useMemo } from "react";
import Calendar from "react-calendar"; // npm install react-calendar
import { format, startOfWeek, endOfWeek, isSameDay, parseISO } from "date-fns"; // npm install date-fns
import { AuthProvider, useAuth } from "../context/AuthContext";
import useTodos from "../hooks/useTodos";
import CategoryManager from "../components/category/CategoryManager";
import TodoList from "../components/schedule/TodoList";
import "../assets/styles/main.scss";
import "../assets/styles/components/_calendar.scss"; // 캘린더 스타일
import "react-calendar/dist/Calendar.css";

const DashboardInner = () => {
  const { user, logout } = useAuth();

  // 1. 상태 관리
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categories, setCategories] = useState([]); // CategoryManager에서 받아옴
  const [filterMode, setFilterMode] = useState("daily"); // 'daily' | 'weekly'

  // useTodos 훅은 "특정 날짜" 기준으로 가져온다고 가정되어 있으나,
  // 캘린더 점 표시를 위해 전체 혹은 월별 데이터를 가져와야 효율적입니다.
  // 여기서는 API 구조상 selectedDate string을 보내면 해당 날짜 데이터를 가져온다고 가정하고,
  // *실제로는 월별 데이터를 가져오는 로직으로 수정하는 것이 좋습니다.*
  // 현재는 편의상 selectedDate를 YYYY-MM-DD로 변환하여 사용합니다.
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const { todos, loading, addTodo, toggleTodo, deleteTodo } = useTodos(dateStr);

  // 2. 날짜 필터링 로직 (이번 주 보기 등)
  // useTodos가 '해당 날짜'만 가져온다면 프론트에서 필터링 한계가 있습니다.
  // 과제 요구사항 구현을 위해 '이번 주' 버튼 클릭 시,
  // 실제로는 useTodos 훅 내부 혹은 API 호출 시 range를 주어야 하지만,
  // 여기서는 UI 로직 위주로 구성합니다.

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFilterMode("daily"); // 날짜 클릭하면 일간 보기로 전환
  };

  const handleSetToday = () => {
    const now = new Date();
    setSelectedDate(now);
    setFilterMode("daily");
  };

  const handleSetWeekly = () => {
    // 주간 보기 로직: 실제로는 API를 주간 단위로 호출해야 함.
    // 여기서는 UI 상태만 변경
    setFilterMode("weekly");
    alert(
      "주간 보기 기능은 백엔드 API(기간 조회) 연동이 필요합니다. 현재는 UI만 변경됩니다."
    );
  };

  // 3. 캘린더 타일에 점 찍기 (Todo가 있는 날짜)
  // 현재 todos는 선택된 날짜의 목록만 있으므로, 실제로는 전체 목록이 필요함.
  // 시각적 예시를 위해 현재 선택된 날짜에 투두가 있으면 점을 찍습니다.
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      // date와 todos의 날짜 비교 (실제 구현 시 모든 날짜의 todo 데이터 필요)
      const hasTodo = todos.some((t) => t.date === format(date, "yyyy-MM-dd"));
      if (hasTodo) {
        return (
          <div className="dot-container">
            <div className="dot"></div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="dashboard-layout">
      {/* [좌측 패널] 프로필, 카테고리, 할 일 목록 */}
      <aside className="left-panel">
        <div className="user-profile">
          <div>
            <h3>{user?.name || "게스트"}님</h3>
            <p>{user?.email || "로그인이 필요합니다"}</p>
          </div>
          <button className="common-btn danger" onClick={logout}>
            로그아웃
          </button>
        </div>

        {/* 필터 버튼 */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className={`common-btn ${filterMode === "daily" ? "primary" : ""}`}
            onClick={handleSetToday}
            style={{ flex: 1 }}
          >
            오늘 (Today)
          </button>
          <button
            className={`common-btn ${filterMode === "weekly" ? "primary" : ""}`}
            onClick={handleSetWeekly}
            style={{
              flex: 1,
              background: filterMode === "weekly" ? "#3182ce" : "white",
              border: "1px solid #e2e8f0",
              color: filterMode === "weekly" ? "white" : "#4a5568",
            }}
          >
            이번 주 (Weekly)
          </button>
        </div>

        {/* 카테고리 관리 */}
        <CategoryManager onUpdateCategories={setCategories} />

        {/* 할 일 목록 (좌측에 배치하여 관리 집중) */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "10px" }}>
            {filterMode === "weekly"
              ? "이번 주 할 일"
              : `${format(selectedDate, "MM월 dd일")} 할 일`}
          </h3>
          <TodoList
            todos={todos}
            categories={categories}
            loading={loading}
            onAdd={addTodo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={(id, title) => console.log("Update Todo", id, title)}
          />
        </div>
      </aside>

      {/* [우측 패널] 대형 캘린더 */}
      <main className="main-panel">
        <div className="calendar-container">
          <h2>일정 캘린더</h2>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            formatDay={(locale, date) => format(date, "d")} // 날짜 숫자만 표시
            tileContent={tileContent} // 점 찍기
            minDetail="month" // 월 단위만 보여주기
            prev2Label={null}
            next2Label={null}
            showNeighboringMonth={false} // 이웃 달 날짜 숨기기 (깔끔하게)
          />
        </div>
      </main>
    </div>
  );
};

const Dashboard = () => (
  <AuthProvider>
    <DashboardInner />
  </AuthProvider>
);

export default Dashboard;
