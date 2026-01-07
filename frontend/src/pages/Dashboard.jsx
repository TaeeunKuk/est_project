// frontend/src/pages/Dashboard.jsx
import React from "react";
import { AuthProvider } from "../context/AuthContext";
import useTodos from "../hooks/useTodos";
import CategoryManager from "../components/category/CategoryManager";
import Calendar from "../components/schedule/Calendar";
import TodoList from "../components/schedule/TodoList";
import "../assets/styles/main.scss";

const DashboardInner = () => {
  const today = new Date().toISOString().slice(0, 10);
  const {
    todos,
    loading,
    selectedDate,
    setSelectedDate,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos(today);

  return (
    <div className="dashboard-container">
      {/* 좌측 사이드바 */}
      <aside>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold" }}>
              안녕하세요, 게스트님!
            </p>
            <small style={{ color: "#718096" }}>오늘도 힘내세요!</small>
          </div>
        </div>

        <CategoryManager />

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {/* 필터 바로가기 예시 */}
          <button
            className="btn-primary"
            onClick={() =>
              setSelectedDate(new Date().toISOString().slice(0, 10))
            }
          >
            오늘로 이동
          </button>
        </div>
      </aside>

      {/* 우측 메인 컨텐츠 */}
      <main className="main-content">
        <section>
          <h2>{selectedDate} 일정</h2>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {/* 달력 영역 */}
            <div style={{ flex: "1 1 300px" }}>
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                todos={todos}
              />
            </div>

            {/* 할 일 목록 영역 */}
            <div
              style={{
                flex: "1 1 300px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="todo-wrapper" style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <h3 style={{ margin: 0 }}>할 일 목록</h3>
                  <button
                    className="btn-primary"
                    onClick={async () => {
                      const title = prompt("할 일 입력");
                      if (!title) return;
                      try {
                        await addTodo(title, null);
                      } catch (e) {
                        alert("추가 실패");
                      }
                    }}
                  >
                    + 일정 등록
                  </button>
                </div>

                <TodoList
                  todos={todos}
                  loading={loading}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              </div>
            </div>
          </div>
        </section>
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
